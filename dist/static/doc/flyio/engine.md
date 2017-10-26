# Http Engine

Fly引入了Http engine 的概念，所谓 Http Engine，就是真正发起 http 请求的引擎，这在浏览器中就是`XMLHttpRequest` 或 `ActiveXObject` (IE)，而在node环境中，engine 可以用任何能发起网络请求的库／模块实现。 Fly正是通过在不同的环境更换不同的engine而实现同时支持 node 和 browser。

**切换engine**:

```javascript
var  fly=require("flyio")
//浏览器环境下
fly.engine=XMLHttpRequest
//node环境
fly.engine=xx  //任何实现了engine接口的对象
```

上面代码示意了 fly 如何切换 engine，那么如何来提供自定义的 engine, 本质上来讲，它就是一个和`XMLHttpRequest` 有相同接口、属性、行为的对象。这很糟糕，因为这必须得了解 `XMLHttpRequest` 的各个细节，为了简化 engine 的实现，Fly 提供了一个 engine-wrapper 模块，它是一个 engine 的骨架，开发者只需要实现一个适配器（adapter）便可方便的自动生成一个 engine。下面我们看看Fly内置的 node engine 的大概实现：

```javascript
var Fly = require("../../dist/npm/fly")
var EngineWrapper = require("../../dist/npm/engine-wrapper")
//引入fly实现的node adapter
var adapter = require("./adapter/node")
//通过包装node adapter生成一个engine
var engine=EngineWrapper(adapter)
module.exports=new Fly(engine)
```

**`engine.setAdapter (adpter)`**

每个 engine 可以随时切换adpter可实现和切换 http 引擎相同的目的。现在问题变得很简单，就是如何实现adapter.

## Adapter

通过上面的例子可以看出，真正的 http请求动作是在 adapter 中完成的。adapter是一个标准的接口，签名如下

```javascript
function (request, responseCallBack)
```

**`request`**

 http请求信息，由engine 传给adapter，**基本结构字段**如下：

```javascript
{
  method:"",//请求方法， GET 、POST ...
  headers:{},//请求头
  url:"",//请求地址
  timeout:"",//超时时间
  body  //请求数据，GET请求时为null,类型不定，可能是FromData、字符串。
}
```

**`responseCallBack(response)`**

响应回调，请求结束时adapter应调用此函数，通知engine请求结束, response **基本结构字段**如下：

```javascript
{
    responseText: '{"aa":5}',//响应内容，为字符串
    statusCode: 200,// http 状态码，发生异常时，值为0
    errMsg:"", //错误信息，
    headers: {}//响应头
}
```

整个请求过程为：每次请求开始的时候，fly 将用户本次的请求信息传给 http engine，然后 http engine 根据用户请求信息生成一个 request 对象传递给 adapter， 接着 adapter 发起真正的 http 请求，等到请求结束时，adapter 通过调用 `responseCallBack` 将请求结果回传给 http engine.  然后 http engine 将结果返回给fly。

**基本结构字段：**

所谓基本结构字段是fly定义的标准字段。除了这些基本结构字段，可以任意扩展：

对于 request对象， 用户在发起的请求配置 options 中的其它字段也会 merge 到 request 对象中，这样就可以在adapter 中获取到，这在自定义 adapte r时非常有用。

对于 response 对象，可以在 adapter  中给其添加任何自定义属性，然后上层在 then 回调中可以取出。

### 一个简单的例子

```javascript
var engine= EngineWrapper(function (request,responseCallback) {
            responseCallback({
                statusCode:200,
                responseText:"你变或者不变，我都不变😜。",
                extraFeild:"自定义字段"
            })
        })
fly.engine=engine;

fly.get("../package.json").then(d=>{
    log(d.data)
    log(d.extraFeild)
})

控制台输出

> 你变或者不变，我都不变😜。
> 自定义字段

```

这个例子中，adapter 并没有真正发起 http 请求，而是直接返回了固定内容，这样 fly 上层请求任何接口收到的内容永远都是相同的。

## 远程Http Engine

我们说过，在浏览器环境中，fly 使用的默认的 engine 就是 `XMLHttpRequest`。 如果能在 Native 上实现一个engine，然后供浏览器中的 fly 使用，那么也就会将原本应该在浏览器中发起的请求重定向到了 Native 上。而这个在 Native 上实现的 engine，我们称其为为远程 engine，这是因为调用者和执行者并不在同一个环境。我们看看在fly中如何使用远程 engine。在介绍这个之前，我们先来了解一下什么是 **Javascript Bridge** 。

> Javascript Bridge 是指web应用中Javascript与Native之间接口互调，数据传输的一个桥梁。现在github中有一些成熟易用的移动端跨平台实现如: [dsBridge](https://github.com/wendux/DSBridge-Android) 、 [WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge) 。

通过 Javascript bridge，我们可以在 adapter 中将请求信息转发到 Natvie上，然后在 native 上发起真正的网络请求，这样就可以在native进行统一的证书验证、cookie管理、访问控制 、缓存策略等等。等到native请求完成后再将请求结果回传给 adapter ， 然后 adapter 再返回给 fly，整个请求流程结束。

因为不同的 Javascript bridge， 数据传输的协议不同，我们只需为我们使用的 javascript bridge 提供一个 adapter 即可。fly 预置了 DSBridge 的 adapter 。

### DSBridge Adapter

[dsBridge](https://github.com/wendux/DSBridge-Android)  是一个优秀的跨平台的 Javascript Bridge ，最大的特点是不仅支持**异步调用**，也支持**异步调用**和进度**连续调用**。如果你的 App 使用的是DSBridge， 那么你可以非常方便的使用fly。

```javascript
var adapter = require("flyio/dist/npm/adapter/dsbridge")
var EngineWrapper = require("flyio/dist/npm/engine-wrapper")
var Fly = require("flyio/dist/npm/fly")

var dsEngine = EngineWrapper(adapter)
var fly = new Fly(engine);
//然后你就可以使用fly发起请求了
fly.get("xxx.com")...
```

现在在h5中通过fly发起的所有ajax请求都会被重定向到端上，下一节我们看看Native端改如何实现。

### Native实现

Fly 将 http 请求重定向到 Native ，Native 是需要完成真正的 http 请求。具体实现由端上根据使用的网络框架自定。Fly官方提供了Android端的实现示例，可供开发者参考，详情请参考 [Native 实现 Http Engine](#/doc/flyio/native) 。


