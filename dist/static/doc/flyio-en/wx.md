## Using in WeChat applet

The JavaScript runtime of WeChat applet is different from browser and node，The script  of WeChat applet runs in JsCore ( a  javascript runtime ) , and JsCore is an JavaScript runtime  without some object such as  ` window`、`document` , so they can not be used in the script，and you can't operate components or doms in scripts, and there's no `XmlhttpRequest` object in JsCore too, so jQuery, zepto, Axios are not available in WeChat applet, and that's when fly comes into play。


### Downloading
https://github.com/wendux/fly/tree/master/dist/npm/wx.js 
https://github.com/wendux/fly/tree/master/dist/umd/wx.umd.min.js 

Download any one and copy it to your project directory。

### Using

```javascript
var Fly=require("../lib/wx.js") //wx.js is your downloaded code
var fly=new Fly(); //Create an instance of Fly

// Add interceptors
fly.interceptors.request.use((config,promise)=>{
    // Add custom headers  
    config.headers["X-Tag"]="flyio";
    return config;
})
// Set the base url
fly.config.baseURL="https://wendux.github.io/"
...

Page({
  bindViewTap: function() {
    // Perform request
    fly.get("http://10.10.180.81/doris/1/1.0.0/user/login",{xx:6}).then((d)=>{
      // output the response data
      console.log(d.data)
      // output the resopnse headers
      console.log(d.header)
    }).catch(err=>{
      // output the error info
      console.log(err.status,err.message)
    })
    ...
  })
})
```



### Size

`wx.umd.min.js` is only 8.4k, very light-weight。



## Principle

Fly supports WeChat applet  by providing custom [Http Engine](#/doc/flyio-en/engine). Let's look at the `wx.js` source code:

```javascript
var  Fly=require("./fly")
var EngineWrapper = require("./engine-wrapper")
// Require adpter for WeChat applet
var adapter = require("./adapter/wx") 
// Create an new Http Engine with the adapter
var wxEngine = EngineWrapper(adapter)
module.exports=function (engine) {
    return new Fly(engine||wxEngine);
}
```

As you can see, the key code is in `adapter/wx`. Let's look at the WeChat applet's adapter code：

```javascript

module.exports=function(request, responseCallback) {
    var con = {
        method: request.method,
        url: request.url,
        dataType: request.dataType||"text",
        header: request.headers,
        data: request.body||{},
        success(res) {
            responseCallback({
                statusCode: res.statusCode,
                responseText: res.data,
                headers: res.header,
                statusMessage: res.errMsg
            })
        },
        fail(res) {
            responseCallback({
                statusCode: res.statusCode||0,
                statusMessage: res.errMsg
            })
        }
    }
    // Calling the WeChat applet http request API
    wx.request(con)
}
```


