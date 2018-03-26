# 请求配置



> Fly 在发起请求时有一些配置选项，由于运行环境不同，这些配置选项可能会有不同，但有一些通用配置选项，它们在任何环境下都是有效的。



## 配置级别

Fly 的请求配置为**实例级配置**和**单次请求配置**。两者可配置的选项是相同，不同的是，前者对该 Fly 实例发起的所有请求都有效，而后者只对当次请求有效。

```javascript
//实例级配置
fly.config.timeout=5000;
//单次请求配置
fly.request("/test",null,{ timeout:5000})
```



## 可配置项

可配置项分为**通用项**和**可选项**。**通用项**在所有环境下都有效，而**可选项**会根据环境、[http engine](#/doc/flyio/engine) 不同而不同。

### 通用项

```javascript
{
  method:"",//请求方法， GET 、POST ...
  headers:{},//请求头
  baseURL:"",//请求基地址
  //是否自动将Content-Type为“application/json”的响应数据转化为JSON对象，默认为true
  parseJson:true,
  timeout:""//超时时间
}
```

### 可选项

除了通用项，您可以给配置选项中添加任何自定义字段。**自定义字段只在 fly 使用的是通过 EngineWrapper 定义的 http engine 时有才意义**，因为对自定义请求选项是否支持是取决于底层 http engine 的实现。而在 Fly 中，除了浏览器内置的 `XMLHttpRequest` 以外，fly 还提供了node engine 和 native engine (需要 native 侧支持)，不同的engine 支持的选项也大都不同。需要注意的是，**`XMLHttpRequest` 只支持通用项，不支持任何可选项。**

#### **responseType**

该字段代表响应内容以何种方式接收，如果设置为"stream"时，node下接受的是一个buffer，native engine下为一个base64编码的字符串；浏览器下，取值比较多，详情请参考 [XMLHttpRequest.responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)。

如果不设置时，默认以字符串形式接收。

#### Node engine 可选项

Fly Node engine 内部使用的是开源的 [request](https://github.com/request/request) 库发起的 http 请求，所以支持其所有的请求选项（body字段除外），详细的字段列表请移步  [request options](https://github.com/request/request#requestoptions-callback ) 。

**注意：**

1. 不要手动设置body选项，fly 会将用户参数自动设置到body中。
2. Node engine是支持http代理的，如果要使用代理，可以参考request代理相关选项。

## engine中使用可选项

如果你要自定义一个http engine，然后支持一些自定义选项，你可以在adapter的request对象中直接读取：

```javascript
fly.config.selfField="xx"
fly.engine=EngineWrapper(function(request,responseCallBack){
  //读取自定义选项
  var feild= request.selfFiled
})
```

