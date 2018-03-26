## Request configuration



> Fly has some configuration options when performing http requests. These configuration options may vary due to different Javascript runtime, but there are some generic configuration options that are valid in any environment.



## Configuration level

Configuration supports **instance level configuration** and **single request configuration**, the difference is that **Instance level configuration** can be applied to all requests initiated by the current Fly instance, but single request configuration is valid only once.

```javascript
// Instance level configuration
fly.config.timeout=5000;
// single request configuration
fly.request("/test",null,{ timeout:5000})
```



## Configurable fields

Configurable items are divided into **general fields** and **custom fields**. The general fied is valid in all javascript runtimes, and the customs vary depending on the environment and the HTTP engine implement.

### General fields

```javascript
{
 // `method` is the request method to be used when making the request
  method: 'get', // default
  // `headers` are custom headers to be sent
  headers:{},
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of fly to pass relative URLs
  // to methods of that instance.
  baseURL:"",
  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout:0,  //default
  // `parseJson` indicates whether or not it is  automatically converted response
  //  data , the Content-Type of which is application/json, to JSON object,
  parseJson:true,
  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default
}
```

### Custom fields

In addition to the generic items, you can add any custom fields to the configuration options。**Custom fields are meaningful only when fly uses HTTP engine created by EngineWrapper**，Because the support for custom request options depends on the implementation of the HTTP engine。And in Fly, different engine support fields are mostly different。**It is important to note that XMLHttpRequest supports only generic fields and does not support any custom options**.

#### **responseType**

This field represents the response content received in what way, if set to "stream", node received is a buffer native engine for a Base64 string ; and the browser, its value is more, please refer to [XMLHttpRequest.responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)。

If not set, the default is accepted as a string。

#### Node engine options

Node adapter uses the [request](https://github.com/request/request) library to perform HTTP requests,  so  fly could soupport all options of [request](https://github.com/request/request) library (body field except),  please see the detailed list of fields to  [request options](https://github.com/request/request#requestoptions-callback ) 。

**Notice：**

1. Do not manually set the `body` field, fly will automatically set user parameters to `body` field。
2. Node engine supports HTTP agents. If you want to use proxies, you can refer to the [request](https://github.com/request/request) proxy options。

## Using the custom  fields in engine

If you want to customize a HTTP engine, and then support some custom options, you can get the fields which is the user passed to  from the request object in adapter：

```javascript
// Set custom field
fly.config.selfField="xx"
fly.engine=EngineWrapper(function(request,responseCallBack){
  // Get custom field
  var feild= request.selfFiled
})
```

