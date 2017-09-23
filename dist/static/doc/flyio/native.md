# Native实现Http Engine

本文将以 Android 为例，从头来实现一个Http Engine。

> 我们使用的DSBridge为H5和Native的通信桥梁（ Javascript Bridge ），关于DSBridge介绍请参考 
>
> Android: https://github.com/wendux/DSBridge-Android
>
> IOS: https://github.com/wendux/DSBridge-IOS



### 第一步：Native端注册API

我们在APP中注册处理ajax请求的API：

```java
 @JavascriptInterface
 public void onAjaxRequest(JSONObject jsonObject, final CompletionHandler handler){
    //jsonObject 为fly adapter 传给端的requerst对象
    //端上完成请求后，将响应对象通过hander返回给fly adapter
    //hanlder(response)
 }
```

### 第二步：H5侧提供adapter

我们使用的是DSBridge, 可以直接调用Native中注册的 `onAjaxRequest`，下面是adapter/dsbridge.js的部分代码：

```javascript
adapter = function (request, responseCallBack) {
      dsBridge.call("onAjaxRequest", request, function onResponse(responseData) {
          responseCallBack(JSON.parse(responseData))
     })
}
```

可以看到 adapter 直接通过dsBridge的call方法将请求对象传给了Native，Native再完成真正的http请求后会回调 `responseCallBack`，responseData 即为响应数据。

### 第三步：更换新engine

最后就是更换新的engine:

```javascript
var adapter = require("flyio/dist/adapter/dsbridge")
var EngineWrapper = require("flyio/dist/engine-wrapper")
var dsEngine = EngineWrapper(adapter)
var fly = new Fly(dsEngine);
```



以上三步即为整个完整的流程。下面我们看看Android端如何实现http engine.



## Android实现真正的网络请求

我们以Android下著名的http网络库okhttp为例 ，给出大概实现：



```javascript
@JavascriptInterface 
public void onAjaxRequest(JSONObject requestData, final CompletionHandler handler){
    
    //定义响应结构
    final Map<String, Object> responseData=new HashMap<>();
    responseData.put("statusCode",0);

    try {
        //timeout值为0时代表不设置超时
        int timeout =requestData.getInt("timeout");
        //创建okhttp实例并设置超时
        final OkHttpClient okHttpClient = new OkHttpClient
            .Builder()
            .connectTimeout(timeout, TimeUnit.MILLISECONDS)
            .build();

        //判断是否需要将返回结果编码，responseType为stream时应编码
        String contentType="";
        boolean encode=false;
        String responseType=requestData.getString("responseType");
        if(responseType!=null&&responseType.equals("stream")){
            encode=true;
        }

        Request.Builder rb= new Request.Builder();
        rb.url(requestData.getString("url"));
        JSONObject headers=requestData.getJSONObject("headers");

        //设置请求头
        Iterator iterator = headers.keys();
        while(iterator.hasNext()){
            String  key = (String) iterator.next();
            String value = headers.getString(key);
            String lKey=key.toLowerCase();
            if(lKey.equals("cookie")){
                //使用CookieJar统一管理cookie
               continue;
            }
            if(lKey.toLowerCase().equals("content-type")){
                contentType=value;
            }
            rb.header(key,value);
        }

        //创建请求体
        if(requestData.getString("method").equals("POST")){
            RequestBody requestBody=RequestBody
                    .create(MediaType.parse(contentType),requestData.getString("data"));
            rb.post(requestBody) ;
        }
        //创建并发送http请求
        Call call=okHttpClient.newCall(rb.build());
        final boolean finalEncode = encode;
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                responseData.put("responseText",e.getMessage());
                handler.complete(new JSONObject(responseData).toString());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                String data;
                //如果需要编码，则对结果进行base64编码后返回
                if(finalEncode){
                   data= Base64.encodeToString(response.body().bytes(),Base64.DEFAULT);
                }else{
                    data=response.body().string();
                }
                responseData.put("responseText",data);
                responseData.put("statusCode",response.code());
                responseData.put("statusMessage",response.message());
                Map<String, List<String>> responseHeaders=response.headers().toMultimap();
                responseHeaders.remove(null);
                responseData.put("headers",responseHeaders);
                handler.complete(new JSONObject(responseData).toString());
            }
        });

    }catch (Exception e){
        responseData.put("responseText",e.getMessage());
        handler.complete(new JSONObject(responseData).toString());
    }
}

```

上面代码为演示代码，在生产环境有以下几点需要注意

1. OkHttpClient 应该共享实例，而不是每次请求都创建实例
2. Cookie应进行统一的管理或持久化，可以使用okhttp的`CookieJar`。
3. Https请求时应添加证书校验。

### Stream

由于大多数浏览器中的ajax是不能接收流数据，这对于图片等二进制文件来说不是很方便，Fly中通过对流数据进行 base64 编码的方式来支持二进制文件传输，这需要Native端支持，正如上面实例实现。在h5中发起请求时需要指明响应是一个stream。下面我们请求一张图片：

```html
<img alt="加载中..." id="img" />
<script>
    //请求图片，native engine可以跨域
    fly.request("https://assets-cdn.github.com/favicon.ico", null,{
        method:"GET",
        responseType:"stream" //指定以流的方式接收响应
    }).then(function (d) {
       //图片支持base64
       document.getElementById("img").src=d.data;
    })
</script> 
```

接下来你就可以看见这个熟悉的小猫咪了 ![github logo](https://assets-cdn.github.com/favicon.ico)

**IOS可以通过AFNetwork实现，也比较简单，具体不再赘述。**