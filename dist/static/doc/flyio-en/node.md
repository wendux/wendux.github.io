# Node enhanced API

In node environment, because there is no sandbox restrictions, JavaScript has the ability to access the file system, therefore, we enhanced the API of Fly in node, mainly add a convenient way to download and upload files.

> The APIs this document listed are impleted by  official  node adapter, if you use the adapter of other third partie provided  , there is no guarantee that the API can work normally.

Node adapter uses the  library [request](https://github.com/request/request) , and thanks to the author

## File download

 **`download (url, savePath, params = null, options={})`** 

`savePath` is  the path to save files after downloading successfully, `params` is the request data to the server.

 **example**：

```javascript
var fly=require("flyio")
var log=console.log
// Download file
fly.download("http://localhost:8089/static/v.png", "./v.png")
    .then(d => {
        log(d.size)
    })
    .catch(log)
```

Download the picture and save it to the current folder. After success, the data structure received by then is：

```javascript
{
  // File size in byte
  size:3000,
  // Absolute path of the downloaded file
  path:"/user/wendux/xx/v.png" 
}
```

**options**

Options configuration for requests. For details, see  [Request configuration](#/doc/flyio-en/config) .

### Internals

Principle Fly download is through the request responseType option is set to "stream", then fly when receiving data, the response will transfer to the upper layer with stream, and then read and save file, so we can also achieve the same purpose by the following codes ：

```javascript
fly.get("http://localhost:8089/static/v.png",null,{responseType:"stream"})
  .then(d=>{
   // d.data is a buffer object
   fs.writeFile("v.png", d.data,(err)=>{
     // Error 
   })
  })
```



## File upload

**`upload(url,formData,options={})`**

FormData is an object that is similar to FormData in browsers. It can include either text fields or  stream of files that will be upload.

```javascript
var fly=require("flyio")

// Upload single file
var formData = {
    file: fs.createReadStream('./v.png'), 
}
fly.upload("http://localhost/upload", formData)
    .then(log).catch(log)

var formData = {
    name:"v.png", //text fields
    avatar: fs.createReadStream('./v.png'), //stream
    resume: fs.createReadStream('./resume.docx'), //stream
    attachments:[ //supports stream array
        fs.createReadStream('./file1.zip'),
        fs.createReadStream('./file2.zip')
    ]
}

fly.upload("http://localhost/upload", formData)
    .then(log).catch(log)
```

`upload` will set the request content-type to "multipart/form-data"。

> ⚠️ Most HTTP servers have restrictions on the size of the uploading files, and it is not recommended to upload multiple files in one request。

**options**

Options configuration for requests. For details, see  [Request configuration](#/doc/flyio-en/config) .

## $http

The advantage of using Fly is that it encapsulates the `request` library and provides a Promise interface that is consistent with the browser side. If you want to use request native API directly, you can call  through fly.$http, $http is a instance of  `request` object, such as:

```javascript
// Stream
fly.$http('http://google.com/doodle.png')
  .pipe(fs.createWriteStream('doodle.png'))
// Perform the post request
fly.$http.post('http://service.com/upload', {form:{key:'value'}})
```

For details, see  [Github request](https://github.com/request/request#requestoptions-callback) 。

## Create a new  instance of Fly

When you create a new instance in Node, you need to require the path  `src/node/index.js`

```
var Fly= require("./src/node")
var newFly=new Fly;
```

