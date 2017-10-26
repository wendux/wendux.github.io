# 工程结构说明

目录结构

**demon**    		示例目录
**dist**          		生成文件目录
**src**                		源码目录
build.js			打包脚本
index.js			npm包入口
node-index.js	node入口

## src

src为源码目录，说明如下

| 名称                | 类型   | 说明                      |
| ----------------- | ---- | ----------------------- |
| adapter           | 目录   | adapter目录               |
| node              | 目录   | node环境的源码入口目录，**不参与打包** |
| utils             | 目录   | 一些工具函数文件                |
| fly.js            | 文件   | fly.js的主入口              |
| wx.js             | 文件   | 微信小程序的主入口文件             |
| engine-wrapper.js | 文件   | engine-wrapper入口        |



## 打包环境与dist目录

```shell
npm run build
```

打包虽然只有一句命令，但会生成四种用于不同环境文件，这四个环境，“npm” 、“cdn”、“cdn-min”、“umd”。

**npm**

npm对应的是 **dist/npm**文件夹下的文件，此文件夹下的文件都支持模块化，所以，以npm包方式集成的，您应该引用此文件夹下的文件，**该文件夹下的文件不能用script标签引入**：

```javascript
var EngineWrapper = require("flyio/dist/npm/engine-wrapper")
```

**cdn cdn-min**

这两个环境生成的文件专门用于cdn引入，不支持模块化，可以用script标签的方式映入，引入后会自动设置全局变量，两者不同的是前者没有压缩，而后者有压缩，**生成文件对应dist的根目录和根目录下的adapter目录**：

```javascript
//引入后，fly Fly会自动设置为全局变量
<script src="https://unpkg.com/flyio/dist/fly.min.js"></script>
//引入后，dsbAdapter会自动设置为全局变量
<script src="https://unpkg.com/flyio/dist/adapter/dsbridge.min.js"></script>
//引入后，wjsbAdapter 会自动设置为全局变量
<script src="https://unpkg.com/flyio/dist/adapter/webviewjsbridge.min.js"></script>
```

**umd**

umd和npm都支持模块化，都可以在npm环境下以require的方式引入，并同时支持amd和cmd，不同的是umd下的文件进行了压缩，**生成文件对应dist下的umd目录** 。



