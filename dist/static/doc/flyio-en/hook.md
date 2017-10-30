# Global Ajax interception 

In most cases, our Ajax requests are issued through the front-end development library and framework, such as jQuery, Axios or Fly。Although these libraries themselves have some request / response  interceptors, they can be used to preprocess Ajax requests and responses. However, if you do not use the network library, or for some web pages that aren't developed by you, you want to analyze the Ajax requests they launch , or you're a hybrid application developer, and you need to intercept all http requests in your WebView (web pages aren't yours)... At this point, you need to intercept the **global** Ajax request

## Principle

No matter what framework or library Ajax request is initiated by your application, you will eventually call the `XMLHttpRequest` object. So, the essence of interception is to replace the browser original `XMLHttpRequest`.

## Intercepting global Ajax by Fly

We know that in Fly, `XMLHttpRequest` is a [HTTP Engine](#/doc/flyio-en/engine). So we want to intercept, just need to customize a engine, replace the global `XMLHttpRequest` object.  And Fly provides a quick tool(engine-wrapper) to generate a new Http Engine.

Let's look at a simple example of the output of each network request URL and method。

### The first implementation

```javascript
 var EngineWrapper = require("flyio/dist/npm/engine-wrapper")
 // Save original XMLHttpRequest
 var realXMLHttpRequest=XMLHttpRequest;
 var engine= EngineWrapper(function (request,responseCallback) {
   // Output request URL and  method
   console.log(request.url,request.method)
   // Perform real http request
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

We start a request test with Axios：

```javascript
axios.post("../package.json").then(log)

// Output
> http://localhost:63341/Fly/package.json POST
> {data: {…}, status: 200, statusText: "OK", headers: {…}, config: {…}, …}
```

You can see the output of the requested URL and method in the console, and our interception succeeded. And the result of the second line is printed by Axios `then`。

The above example is a simple demon, it is not perfect, because it has no header synchronization and no timeout processing and soon on.  Of course  you can manually to complete these details, but think about it, is there an easier way?

### The Second implementation

```javascript
var log = console.log;
// Switch fly engine to XMLHttpRequest
fly.engine = XMLHttpRequest;
// Create a custom http engine to replace  XMLHttpRequest 
var engine = EngineWrapper(function (request, responseCallback) {
    // Output request URL and  method
    console.log(request.url, request.method)
    // Perform real http request
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
// Replace XMLHttpRequest with our custom engine
XMLHttpRequest = engine;
// Perform a http request by Axios
axios.post("../package.json").then(log)
```

In fact, in the browser environment, ` XMLHttpRequest` is the default http engine of Fly , without the need to manually switch here, in order to clear the manual switch at。Fly automatically synchronizes the request config such as headers 、timeout and so on, according to the request object. If you want to stop the request, you can just direct `return` in adapter.

## Other interception ways

Another open source library [Ajax-hook](https://github.com/wendux/Ajax-hook )  can also intercept the global Ajax request. Unlike that, Unlike fly, it can intercept every step of the Ajax request, each callback. It's not only powerful, but also lightweight (1KB). Compared with the way fly engine intercepts above, Ajax-hook has finer granularity of interception, but Ajax-hook does not support browsers below IE9 because of the use of ES5's getter and setter.