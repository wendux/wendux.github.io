# 支持微信小程序

微信小程序的 javascript 运行环境和浏览器不同，页面的脚本逻辑是在JsCore中运行，JsCore是一个没有窗口对象的环境，所以不能在脚本中使用window，也无法在脚本中操作组件，JsCore中也没有 XmlhttpRequest对象，所以jquery 、zepto、axios这些在小程序中都不能用，而此时，正是 fly 大显身手的时候。


### 下载
https://github.com/wendux/fly/tree/master/dist/npm/wx.js 
https://github.com/wendux/fly/tree/master/dist/umd/wx.umd.min.js 
下载任意一个, 然后将其拷贝到您的工程目录下。

### 使用

```javascript
var Fly=require("../lib/wx.js") //wx.js为您下载的源码文件
var fly=new Fly(); //创建fly实例
...
Page({
  //事件处理函数
  bindViewTap: function() {
    //调用
    fly.get("http://10.10.180.81/doris/1/1.0.0/user/login",{xx:6}).then((d)=>{
      console.log(d.data)
    }).catch(err=>{
      console.log(err.status,err.message)
    })
  })
})
```



## 原理

Fly对小程序的支持实际上是通过自定义 http engine的方式，我们来看一下wx.js源码：

```javascript
//微信小程序入口
var  Fly=require("./fly")
var EngineWrapper = require("./engine-wrapper")
var adapter = require("./adapter/wx") //微信小程序adapter
var wxEngine = EngineWrapper(adapter)
module.exports=function (engine) {
    return new Fly(engine||wxEngine);
}
```

可以看出，关键代码就在adapter/wx中，我们看看微信小程序的adapter代码：

```javascript
//微信小程序适配器
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
    //调用微信接口发出请求
    wx.request(con)
}
```

这就是所有的实现，很简单！通过这个例子，可以帮助您理解 “fly正是通过不同的adpter来支持不同的环境” 这句话，至于其它的环境，我们完全可以照猫画虎。
