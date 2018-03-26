## Using in WeChat Mini Program

The JavaScript runtime of [WeChat Mini Program](https://mp.weixin.qq.com/cgi-bin/wx) is different from browser and node，The script  of WeChat Mini Program runs in JsCore ( a  javascript runtime ) , and JsCore is an JavaScript runtime  without some object such as  ` window`、`document` , so they can not be used in the script，and you can't operate components or doms in scripts, and there's no `XmlhttpRequest` object in JsCore too, so jQuery, zepto, Axios are not available in WeChat Mini Program, and that's when fly comes into play。


### Downloading
https://github.com/wendux/fly/tree/master/dist/npm/wx.js
https://github.com/wendux/fly/tree/master/dist/umd/wx.umd.min.js

Download any one and copy it to your project directory。

If you use [mpvue](https://github.com/Meituan-Dianping/mpvue), you can also use npm to manage dependencies.

```javascript
  npm install flyio
```

### Using

```javascript
var Fly=require("../lib/wx") //wx.js is your downloaded code
// var Fly=require("flyio/dist/npm/wx") //npm require
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

Fly supports WeChat Mini Program  by providing custom [Http Engine](#/doc/flyio-en/engine). Let's look at the `wx.js` source code:

```javascript
var  Fly=require("./fly")
var EngineWrapper = require("./engine-wrapper")
// Require adpter for WeChat Mini Program
var adapter = require("./adapter/wx")
// Create an new Http Engine with the adapter
var wxEngine = EngineWrapper(adapter)
module.exports=function (engine) {
    return new Fly(engine||wxEngine);
}
```

As you can see, the key code is in `adapter/wx`. Let's look at the WeChat Mini Program's adapter code：

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
    // Calling the WeChat Mini Program http request API
    wx.request(con)
}
```


