# Node增强的API

Fly同时支持浏览器环境和node环境，在node下，由于没有浏览器沙箱的限制，有访问文件系统的能力，为此fly针对node，专门做了功能提升，主要添加了文件下载和上传的便捷方法。

> 本文档所列API为Fly 默认自带的的node adapter支持，如果是您使用了其它第三方实现的adapter，则不能保证这些api能正常工作。

## 文件下载

 **download (url, savePath, params = null)** 

 url为下载地址，savePath为下载成功后保存的路径，params 为请求参数，默认为null。返回一个Promise对象，一个简单的示例如下：

```javascript
var fly=require("flyio")
var log=console.log
//文件下载
fly.download("http://localhost:8089/static/v.png", "./v.png")
    .then(d => {
        log(d.size)
    })
    .catch(log)
```

下载一张图片，保存到当前文件夹。成功后then收到的数据结构为：

```javascript
{
  size:3000,//文件大小，单位字节
  path:"/user/wendux/xx/v.png" //下载文件保存在本地的绝对路径
}
```

### 底层

fly下载文件的原理是将选项requestType设为“stream”，然后fly在接收数据时就会将响应流传递给上层，然后再读取、保存，所以我们也可以用如下方式达到同样的效果：

```javascript
fly.request("http://localhost:8089/static/v.png",null,{requestType:"stream"})
  .then(d=>{
   //d.data为buffer对象
   fs.writeFile("v.png", d.data,(err)=>{
     //错误处理  
   })
  })
```



## 文件上传

**upload(url,formData)**

formData是一个对象，和浏览器中FormData相似。既可以包括普通字段，也可以包括文件。

```javascript
var fly=require("flyio")

//上传单个文件
var formData = {
    file: fs.createReadStream('./v.png'), //文件
}
fly.upload("http://localhost/upload", formData)
    .then(log).catch(log)

//可以包括多个字段／文件
var formData = {
    name:"v.png", //普通的字段
    avatar: fs.createReadStream('./v.png'), //文件
    resume: fs.createReadStream('./resume.docx'), //文件
    attachments:[ //可以通过数组
        fs.createReadStream('./file1.zip'),
        fs.createReadStream('./file2.zip')
    ]
}

fly.upload("http://localhost/upload", formData)
    .then(log).catch(log)
```

upload会将请求的content-type设为 “multipart/form-data”。和download方法一样，upload也是request函数的一个包装，实现如下：

```javascript
fly.upload= function (url,formData) {
  return fly.request(url,null,{method:"post",formData})
}
```



> ⚠️ 大多数http服务器对单次请求上传文件的大小都有限制，不建议在一次请求中上传多个文件。




## 请求配置

如果在上传或下载文件时，需要定制请求参数，如设置header，那么你应该直接调用request方法，通过第三个参数options去配置。

