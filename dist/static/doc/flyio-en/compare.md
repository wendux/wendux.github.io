# 与axios和Fetch对比

在Angular、React、Vue这些移动端web框架大行其道的今天，很大的改变了WEB应用的开发方式。而这些框架通常都只专注于View层，而对于http请求，开发者一般都会单独引入一个http 请求库，如axios。笔者也是从使用axios过来的，但随着项目的使用，觉得 axios 不尽完美，在一些场景用起来并不舒服，所以才有了Fly。

在设计 Fly 的过程中，为了符合使用习惯，借鉴了axios（但并不完全兼容），下面将 Fly 和 axios做一个详细的对比：

## 共同点

1. 都支持Promise API
2. 都同时支持Node和Browser环境
3. 都支持请求／响应拦截器
4. 都支持自动转换 JSON

## 不同点

### 浏览器环境

axios支持请求取消和全局配置，而 fly 不支持请求取消，fly的配置支持实例级别和单次请求级别，其余功能基本不分伯仲，在体积上，fly.min.js只有4K左右，而axios.min.js 12K左右。Fly更轻量，集成成本更低。

### Node环境

Node下 Fly 的功能要明显强于axios，Fly在node下不仅提供了文件下载、上传的API，而且还可以通过 `fly.$http` 直接调用 [request 库 ](https://github.com/request/request) 的所有功能，详情请参照[Node下增强的API](#/doc/flyio/node) 。

### 请求转发

Fly最大的特点就是在混合APP中支持请求转发，而axios不支持，关于请求转发的详细内容请参照[请求重定向](#/doc/flyio/redirect) 。

### Http Engine

Fly中提出了Http Engine的概念，Fly可以通过更换Http Engine的方式实现很多有趣的功能，比如全局Ajax拦截，详情请参考 [全局ajax拦截](#/doc/flyio/hook) 。

### 设计思想

Fly采用分层的设计思想，将上层用户接口和底层Http Engine分离。采用适配器模式，让实现Http Engine变的非常容易。正是这样的框架设计，可以通过替换底层Http Engine的方式，使得fly能够在灵活的支持各种环境的同时又能保证上层接口的一致性。还有，通过adapter，用户完全可以自定义http请求的实现.......还有很多高级的玩法。

## Fetch

Fetch的接口设计要好于 XMLHttpRequest，但是，由于Fetch本身的一些特点，导致其在使用时也不是很方便，下面我们看一个post请求的例子：

```javascript
fetch("doAct.action", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    credentials: 'include',
    body: "key=value"
}).then(function(res) {
    if (res.ok) {
        // To do with res
    } else if (res.status == 401) {
        // To do with res
    }else if(res.status == 404){
       //
    }else if(res.status==500){
       // 
    }
})
.catch(function(e) {
    // Handling errors
});
```



上面有三点要注意：

1. 必须手动设置header的 `content-type`，Fetch不会自动设置。
2. 必须手动设置  `credentials`，Fetch默认不带cookie。
3. 像40X、50X这种http 状态错误是不会触发`catch`，需要在then中处理。

除此之外，Fetch：

1. 不支持请求／响应拦截器，这在设置一些全局的参数、请求头时很有用。
2. 不支持Node
3. 浏览器支持程度不同。

#### 另一个角度

我们用 `XMLHttprequest` 来实现上述功能其实代码量也差不多：

```javascript
var xhr = new XMLHttpRequest();
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
xhr.open('post', "doAct.action");
xhr.onload = function() {
    if (xhr.status>=200&&xhr.status<300) {
        // To do with res
    } else if (xhr.status == 401) {
        // To do with res
    }else if(xhr.status == 404){
       //
    }else if(xhr.status==500){
       // 
    }
};
xhr.onerror = function() {
    // Handling errors
};
xhr.send("key=value");
```

既然代码量又差不多，为什么在 XMLHttprequest 时代我们还是要引一个 http请求库，答案是 **方便**。不可否认，Fetch是比 XMLHttprequest 的接口好很多，但是即使使用Fetch，也不是很方便。而fly也会在合适的时候支持Fetch。

