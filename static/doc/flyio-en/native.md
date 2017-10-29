# Http Engine Implementation 

This article will take Android as an example to implement a Http Engine from scratch.

> We use DSBridge as the Javascript bridge between H5 and Native . Please refer to DSBridge
> Android: https://github.com/wendux/DSBridge-Android
> IOS: https://github.com/wendux/DSBridge-IOS



### 1. registration API on native

We register the API for Ajax requests in APP, named `onAjaxRequest`

```java
 @JavascriptInterface
 public void onAjaxRequest(JSONObject jsonObject, final CompletionHandler handler){
    //jsonObject is the object that is Corresponding to the `request` object 
    // that fly adapter passed
   
    //After the completion of the request, the response object 
    //is returned to fly adapter through hander.
   
    //hanlder(response)
 }
```

### 2. H5 implementation of adapter

We're using DSBridge, and we can call onAjaxRequest directly in Native, and here's part of the code for adapter/dsbridge.js：

```javascript
adapter = function (request, responseCallBack) {
      dsBridge.call("onAjaxRequest", request, function onResponse(responseData) {
          responseCallBack(JSON.parse(responseData))
     })
}
```

You can see that adapter directly passes the request object to the Native through  the API `call`  of dsBridge , and Native will call back the `responseCallBack`  with the response data after the real HTTP request is completed . the` responseData` is the response data。

### 3. Switching http engine

```javascript
var adapter = require("flyio/dist/npm/adapter/dsbridge")
var EngineWrapper = require("flyio/dist/npm/engine-wrapper")
var dsEngine = EngineWrapper(adapter)
var fly = new Fly(dsEngine);
```



The above three steps are the whole process. Let's see how the Android side implements http engine.



## Http Engine Implementation on Android

We take `okhttp`, a famous HTTP Network Library on Android, as an example, and give the general implementation：

```javascript
@JavascriptInterface 
public void onAjaxRequest(JSONObject requestData, final CompletionHandler handler){
    
    // Define response structure
    final Map<String, Object> responseData=new HashMap<>();
    responseData.put("statusCode",0);

    try {
        int timeout =requestData.getInt("timeout");
        // Create a okhttp instance and set timeout
        final OkHttpClient okHttpClient = new OkHttpClient
            .Builder()
            .connectTimeout(timeout, TimeUnit.MILLISECONDS)
            .build();

        // Determine whether you need to encode the response result,
        // and encode when responseType is stream.
        String contentType="";
        boolean encode=false;
        String responseType=requestData.getString("responseType");
        if(responseType!=null&&responseType.equals("stream")){
            encode=true;
        }

        Request.Builder rb= new Request.Builder();
        rb.url(requestData.getString("url"));
        JSONObject headers=requestData.getJSONObject("headers");

        // Set request headers
        Iterator iterator = headers.keys();
        while(iterator.hasNext()){
            String  key = (String) iterator.next();
            String value = headers.getString(key);
            String lKey=key.toLowerCase();
            if(lKey.equals("cookie")){
               // Here you can use CookieJar to manage cookie in a unified way
               continue;
            }
            if(lKey.toLowerCase().equals("content-type")){
                contentType=value;
            }
            rb.header(key,value);
        }

        // Create request body
        if(requestData.getString("method").equals("POST")){
            RequestBody requestBody=RequestBody
                    .create(MediaType.parse(contentType),requestData.getString("data"));
            rb.post(requestBody) ;
        }
        // Create and send HTTP requests
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
                // If encoding is needed, the result is encoded by Base64 and returned
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

The above code is just a demo code, and there are several points to note in the production environment:

1. OkHttpClient should share instances instead of creating instances at each request
2. Cookie should be unified managed or persistent, and `okhttp CookieJar` can be used。
3. Should check certificate in Https requests 。

### Stream

Fly supports binary file transmission by Base64 encoding in stream data, **which requires Native side support**, just as the above example implements. When a request is initiated in H5, it is necessary to indicate that the response is a stream. We request a picture below:：

```html
<img alt="loading..." id="img" />
<script>
    //Request pictures, native engine can cross domain
    fly.request("https://assets-cdn.github.com/favicon.ico", null,{
        method:"GET",
        //Specifies that the response is received with stream
        responseType:"stream" 
    }).then(function (d) {
       //The picture is the data encoded by Base64
       document.getElementById("img").src=d.data;
    })
</script> 
```

And then you can see this familiar little cat ![github logo](https://assets-cdn.github.com/favicon.ico)

**IOS can be implemented by AFNetwork, the implementation is relatively simple, not for example.**