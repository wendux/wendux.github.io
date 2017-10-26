# 全局Ajax拦截

大多数情况下，我们的 Ajax 请求都是通过前端的开发库、框架发出的，如 jQuery、axios 或者 Fly。这些库自身都会有一些请求／响应钩子，用于预处理 Ajax请求和响应。但是如果你没有使用这些网络库，又或是你并不是网页的开发者，而你需要分析某个网页的所有Ajax请求，又或是你是一个应用开发者，你的webview中需要拦截所有网页的网络请求（网页并不是你开发的）...... 这种时候，你就需要拦截全局的 Ajax 请求。

## 原理

无论是上层是通过何种方式发起的 Ajax 请求，最终都会回归到 `XMLHttpRequest` 。 所以，拦截的本质就是替换浏览器原生的 `XMLHttpRequest` 。具体就是，在替换之前保存先保存 `XMLHttpRequest`，然后在请求过程中根据具体业务逻辑决定是否需要发起网络请求，如果需要，再创建真正的 `XMLHttpRequest` 实例。

## 自定义engine

我们知道，在 Fly 中，`XMLHttpRequest`  就是一个 [http engine](#/doc/flyio/engine)。而 Fly 提供了快速生成 engine 的工具，所以我们可以很方便的实现 Ajax拦截。我们先看一个简单的输出每次网络请求 url 和 method的例子：

### 实现一

```javascript
 var EngineWrapper = require("flyio/dist/npm/engine-wrapper")
 //保存XMLHttpRequest
 var realXMLHttpRequest=XMLHttpRequest;
 var engine= EngineWrapper(function (request,responseCallback) {
   //输出请求链接和请求方法
   console.log(request.url,request.method)
   //发起真正的请求
   var xhr=new realXMLHttpRequest()
   xhr.open(request.method,request.url);
   xhr.send(request.body);
   var callback=function () {
     responseCallback({
       statusCode:xhr.status,
       responseText:xhr.responseText,
       statusMessage:xhr.statusText
     })
   }
   xhr.onload=callback;
   xhr.onerror=callback;
 })
 XMLHttpRequest=engine;
```

我们用 axios 发起一个请求测试一下：

```javascript
axios.post("../package.json").then(log)

//控制台输出
> http://localhost:63341/Fly/package.json POST
> {data: {…}, status: 200, statusText: "OK", headers: {…}, config: {…}, …}
```

控制台中输出了请求的 url 和 method， 第二行的结果对象是axios `then`打印出的。

上面的例子只是一个简单的示例，并不完善，如没有同步header、也没有超时处理，在生产环境下，你当然可以手动去完善这些细节，但是，仔细想想，是不是有更简单的方法？

### 实现二

```javascript
var log = console.log;
//切换fly engine为真正的XMLHttpRequest
fly.engine = XMLHttpRequest;
var engine = EngineWrapper(function (request, responseCallback) {
    console.log(request.url, request.method)
    //发起真正的ajax请求
    fly.request(request.url, request.data, request)
        .then(function (d) {
            responseCallback({
                statusCode: d.xhr.status,
                responseText: d.xhr.responseText,
                statusMessage: d.xhr.statusText
            })
        })
        .catch(function (err) {
            responseCallback({
                statusCode:err.status,
                statusMessage:err.message
            })
        })
})
//覆盖默认
XMLHttpRequest = engine;
axios.post("../package.json").then(log)

```

因为 Fly支持切换engine, 我们可以直接先将 fly engine 切换为真正的 `XMLHttpRequest` ，然后再覆盖，这样fly中的网络请求都是通过真正的 `XMLHttpRequest` 发起的 (事实上， 浏览器环境下 fly 默认的 engine本就是 `XMLHttpRequest`，无需手动切换，此处为了清晰，故手动切换了一下)。fly 会根据request对象自动同步请求头。如果想阻止请求，直接在 adapter 中 return 即可。



## 其它的拦截方法

Github上的开源库 [Ajax-hook](https://github.com/wendux/Ajax-hook) 也可以拦截全局的的ajax请求，不同的是，它可以拦截ajax请求的每一步，每一个回调，不仅强大，而且也很轻量（1KB）。和上面通过 fly engine 拦截的方式相比 ，Ajax-hook的拦截粒度更细，但Ajax-hook由于使用了ES5的 `getter`、`setter`，所以不支持IE9以下的浏览器。

