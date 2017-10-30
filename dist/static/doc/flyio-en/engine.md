# Http Engine

> Fly introduces the concept : **Http Engine**, and the Http Engine is the engine that really initiates http requests. This is typically `XMLHttpRequest` in browser environment, and in Node environments, any module or library that can initiate a network request can be implemented. Fly can switch the Http Engine freely. In fact, Fly is implemented by switching Http Engine, supporting both the browser environment and the Node environmen。

## Switching Http Engine

```javascript
var  fly=require("flyio")

// In browser environment
fly.engine=XMLHttpRequest

// In node environment, and xx is a custom http engine 
//that is impleted with any module or library of node
fly.engine=xx  
```

The code above shows how fly switches  http engine, so how do you provide a custom engine?

Essentially,  http engine is an object that has the same interface, attribute, and behavior as `XMLHttpRequest`. Obviously, it's very complicated to implement a engine manually by yourself, because you have to understand all the details of `XMLHttpRequest`!

It is a skeleton of engine, and developers only need to implement an adapter for it, and it can automatically generate a engine automatically.

Next, let's take a look at how Fly built-in node-engine is implemented with engine-wrapper：

```javascript
var Fly = require("../../dist/npm/fly")
var EngineWrapper = require("../../dist/npm/engine-wrapper")
// Require the node adapter
var adapter = require("./adapter/node")
// Generate a engine by wrapping node adapter
var engine=EngineWrapper(adapter)
module.exports=new Fly(engine)
```

Through this code, we can see   how to generate a engine through a adapter , so now the work is transformed into how to implete a adapter, later we will introduce, now we must first look at the only API of  the engine:

**`engine.setAdapter (adpter)`**

Each engine can switch adpter at any time, which can achieve the same purpose as switching http engine.

## Adapter

As you can see from the above example, the real HTTP request action is done in adapter. And adapter is a standard interface, the signature is as follows：

```javascript
function (request, responseCallBack)
```

**`request`**

`request` is the HTTP request information is passed from engine-wrapper to adapter, and the **basic structure field** is as follows：

```javascript
{
  method:"",// Http  method
  headers:{},
  url:"",
  timeout:0,
  body:null // Request data
}
```

**`responseCallBack(response)`**

In response to callbacks, adapter should call this function at the end of the request to notify the engine-wrapper request to end, and the` response` **basic structure field** follows：

```javascript
{
    // Response content
    responseText: '{"aa":5}',
    // HTTP status code, when the exception occurs, the value is 0  
    statusCode: 200,
    // Error message，  
    errMsg:"", 
    // Response header  
    headers: {}
}
```

The whole request process is: when the start of each request, Fly will package the http request information and pass it to the http engine, then http engine according to the request information to generate a request object passed to adapter, then adapter perform the real HTTP request until the end of the request, adapter  return the response result back to http engine by calling the `responseCallBack` .  And then, http engine returns the results to the fly.

### **Custom fields**：

The basic structure field is the standard field defined by fly. In addition to these basic structure fields, you can optionally extend **custom fields**。

For `request` object, the custom fields can be passed to adapter by the   `options` of request API . And for the response object,  you can add any custom field to it,  these fields will return to the fly,  you can get them in the `then` callback:

### example

```javascript
var engine= EngineWrapper(function (request,responseCallback) {
            responseCallback({
                statusCode:200,
                responseText:"I am fixed content 😜",
                extraFeild:"I am custom field"
            })
        })
fly.engine=engine;

fly.get("../package.json").then(d=>{
    log(d.data)
    log(d.extraFeild)
})

// output
> I am fixed content 😜。
> I am custom field
```

In this case, adapter does not actually start the HTTP request, but directly returns the fixed content, so that the fly upper layer requests any interface to receive the same content forever.

## Remote Http Engine

We said that in the browser environment, the default engine for fly is `XMLHttpRequest`. Now we think of hybrid APP,  if you can implement a engine on Native but use it for fly in browser environment, that is to say , you will redirect the request that should have been initiated in the browser to Native. so we call this kind of engine as  **remote engine**,  because it's really implemented in Native, not in browser. Before introducing how to use remote engine in Fly, we have to first understand what the **Javascript Bridge** is:

> Javascript Bridge is a bridge between Javascript and Native interface intermodulation, data transmission. Now there are some mature and easy to use mobile platforms implemented in GitHub, such as: [dsBridge](https://github.com/wendux/DSBridge-Android) 、 [WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge) 。

Through Javascript bridge, we can forward the request information to the Natvie in adapter, and then start the real network request in  native side according to the request information. The advantage of this is that native can perform unified certificate validation, cookie management, access control, caching policies, and so on. When the native request is finished, the request result is returned to adapter, and then adapter is returned to fly, and the whole request process is finished。

Because of the different Javascript bridge, the data transfer protocol is different, we only need to provide a adapter for the JavaScript bridge we use. Fly presets DSBridge's adapter.

### DSBridge Adapter

[DsBridge](https://github.com/wendux/DSBridge-Android) is an excellent cross platform Javascript Bridge ，Its most important feature is not only supporting asynchronous calls, but also supporting synchronous invocation。If your App uses DSBridge, then you can use fly very easily:

```javascript
// Require dsBridge adapter
var adapter = require("flyio/dist/npm/adapter/dsbridge")
var EngineWrapper = require("flyio/dist/npm/engine-wrapper")
var Fly = require("flyio/dist/npm/fly")
// Generate a engine with the dsBridge adapter
var dsEngine = EngineWrapper(adapter)
var fly = new Fly(engine);
// perform a get http request
fly.get("xxx.com")...
```

Now all Ajax requests initiated by fly in H5 pages will be redirected to the native。

### Implementation in natvie side

Fly redirects the HTTP request to Native, and Native needs to complete the real http request. The corresponding implementation depends on the native. Fly official provides the Android side of the implementation of examples, for developers to refer to, for details, please refer to [ Http Engine Implementation on Android](#/doc/flyio-en/native) 。


