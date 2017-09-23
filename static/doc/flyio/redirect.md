# 请求重定向

## 背景

如果你开发的是一个 PC桌面应用、或者一个APP，你需要以通过内嵌 h5 页面的方式实现部分功能，这类应用我们统一称之为**混合应用**。然后你会发现你 **无法干涉 ** webview 中 h5 页面发起的 ajax 请求，无法进行统一的请求管理。为什么要进行统一的请求管理呢？主要有以下几种场景：

1. cookie 同步.
2. 接口安全
3. 访问控制
4. 性能
5. 缓存

### Cookie同步

混合APP种非常关键的一点就是 Native 和 h5 之间的 cookie 同步。因为 Native 和 h5 都可以发起网络请求，而两者所用的请求池并不是同一个（h5  ajax 请求是 webview 发起的），这就会导致 Native 和 h5 cookie 不能同步，如果不能统一管理请求，就会导致你要在不同的场景做大量的同步工作。更沮丧的是，在ios系统中WKWebview并没有提供 cookie 同步的接口，开发者通常是通过注入 javascript 的方式间接实现，但是这种做法有个缺点，就是无法同步 httpOnly 属性的 cookie , 因为 javascript 无法操作具有httpOnly属性的cookie ( 这主要是因为现代浏览器为了防止xss攻击成功后确保用户cookie不会被恶意脚本窃取而添加的特性 )。

### 接口安全

为了网络传输数据安全，https协议已经越来越普及，但是，浏览器/webview 对于https请求，默认的证书校验策略是先查看本地信任证书列表，如果没有，则去检验CA链，这也就意味着，如果攻击者通过伪造的证书开一个代理服务器，然后在自己的手机中手动添加这个伪造证书至本地信任列表， 然后攻击者将手机代理指向其代理服务器，那么接口数据将会完全暴漏在攻击者面前。而目前防止代理方式攻击方式就是在端上进行证书校验，这可以保证Native发起的请求数据是安全的，但是h5通过webview发起的请求仍将会暴漏，如果你的APP是一个金融理财类的应用，这将非常危险。

### 访问控制

由于浏览器的**同源策略**，如果h5请求需要**跨域**，是一件比较麻烦的事。现在的主流的跨域方案，无论是jsonp，还是通过设置**CORS**（Cross Origin Resource Sharing）相关的请求头，都需要服务端支持。然而很多时候我们需要能在端上指定哪些域可以访问，哪些域不能访问，如果请求在webview中发起，端上根本无法干涉。

### 性能

不同webview，底层对网络请求处理策略往往会有不同，有的是采用一个线程池，有的是每次请求都会创建一个新的线程，这就导致在有些系统上原生webview的请求会相对较慢。

### 缓存

现在有些混合app为了实现页面秒开，都采用一些缓存自管理的方案，常见的就是将线上新版本的h5页面提前打包，然后在没次APP启动后检测更新、下载。然后拦截 webview 的所有请求，对于静态资源，直接从下载好的文件中读取，而动态数据则通过ajax去后台动态拉去，如果只是这样，那倒没什么问题，但是，有时有些静态资源也是需要通过ajax去拉取，比如，一个配置 json， 又或是一个 md格式的帮助文档。如果不能拦截ajax请求，也就意味着这些静态资源还是要通过网络去服务端拉取。

综上所属，如果能在端上进行统一的请求管理，上面这些问题将会引刃而解。但是，如何实现在端上进行统一的请求管理。我们说过，目前对于大多数平台的webview，它们发起的 ajax请求，native 都是无法直接干涉的。那么现在有了Fly，我们应该如何解决这个问题？



## 请求重定向

在浏览器中，Ajax请求都是浏览器发出的，而 Fly 可以通过更换 http engine的方式，将请求重定向到。典型的场景就是在混合 App中，将所有的请求转发到 Native，然后在Native上进行统一的请求管理、cookie管理、证书校验、请求过滤等。
