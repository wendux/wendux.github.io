# Node增强的API

Fly 同时支持浏览器环境和 node 环境，在 node 下，由于没有浏览器沙箱的限制，有访问文件系统的能力，为此fly 针对 node，专门做了功能提升，主要添加了文件下载和上传的便捷方法。

> 本文档所列 API 为 Fly 默认自带的的 node adapter 支持，如果是您使用了其它第三方实现的 adapter，则不能保证这些 api 能正常工作。

Node adapter 使用了 [request](https://github.com/request/request) 库，向作者致谢。

## 文件下载

 **`download (url, savePath, params = null, options={})`** 

 url 为下载地址，savePath为下载成功后保存的路径，params 为请求参数，默认为null。返回一个`Promise`对象，一个简单的示例如下：

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

Fly下载文件的原理是将选项 `responseType` 设为“stream”，然后fly在接收数据时就会将响应流传递给上层，然后再读取、保存，所以我们也可以用如下方式达到同样的效果：

```javascript
fly.get("http://localhost:8089/static/v.png",null,{responseType:"stream"})
  .then(d=>{
   //d.data为buffer对象
   fs.writeFile("v.png", d.data,(err)=>{
     //错误处理  
   })
  })
```



## 文件上传

**`upload(url,formData,options={})`**

formData是一个对象，和浏览器中` FormData` 相似。既可以包括普通字段，也可以包括文件。

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

upload会将请求的 `content-type` 设为 “multipart/form-data”。

> ⚠️ 大多数http服务器对单次请求上传文件的大小都有限制，不建议在一次请求中上传多个文件。



## $http

使用 Fly 的好处是封装了request 库，提供了和浏览器端一致的 `Promise` 接口。如果你想直接使用 request 库原生的 api，可以通过 `fly.$http` 直接调用，`$http` 就是一个request对象，如：

```javascript
//Stream
fly.$http('http://google.com/doodle.png')
  .pipe(fs.createWriteStream('doodle.png'))
//post请求
request.post('http://service.com/upload', {form:{key:'value'}})
```

详细的文档请移步 [Github request](https://github.com/request/request#requestoptions-callback) 。

## 创建新实例

Node下创建新实例时，要引用 `src/node/index.js`:

```
var Fly= require("./src/node")
var newFly=new Fly;
```




## 请求配置

如果在上传或下载文件时，需要定制请求参数，如设置 header，那么你应该直接调用 `request` 方法，通过第三个参数 options 去配置。所有选项请参考 [请求配置](#/doc/flyio/config) 。

