# 支持微信小程序

官方支持小程序了, 从此你可以在微信小程序中愉快的使用fly了。

> 您需要下载wx.js(未压缩) 或 wx.umd.min.js（压缩）, 然后将其拷贝到您的工程目录下
> 下地址下载：https://unpkg.com/flyio/dist/  或 https://github.com/wendux/fly/tree/master/dist。

**使用**

```javascript
var Fly=require("../lib/wx.js") //wx.js为您下载的源码文件
var fly=new Fly();创建fly实例
...
Page({
  //事件处理函数
  bindViewTap: function() {
    //调用
    fly.get("http://10.10.180.81/doris/1/1.0.0/user/login",{xx:6}).then((d)=>{
      console.log(d)
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
var  Fly=require("../dist/fly")
var EngineWrapper = require("../dist/engine-wrapper")
var adapter = require("../dist/adapter/wx") //微信小程序adapter
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