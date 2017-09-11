
# 多页面应用脚手架

> 本工程是一个同时支持vue+vux和传统jQuery的多页面应用脚手架；您可以在此工程中自由选择用vue+vux方式开发或者是jQuery.

## 构建步骤

1. 确保已经安装了node
2. 在工程根目录下执行如下命令

```shell
#安装依赖（首次需要）
npm install
//启动开发模式hot reload
npm run dev
//生产环境打包
npm run build
```
一些osx电脑在打包时会抛出如下错误：

```
Module build failed: Error: dyld: Library not loaded: /usr/local/opt/libpng/lib/libpng16.16.dylib
```

这是则需要安装最新版本的libpng,下面是用homebrew安装的命令：

```shell
brew install libpng
```



#### 针对在webstorm里面不能hot reload的问题大家可以按如下步骤设置一下就行：

> Please try turning 'Safe write' option ( Settings | Appearance & Behavior | System Settings | Use "safe write" (save changes to temporary file first)) off

## 开发步骤

每一个页面，对应module下一个文件夹，问价夹名内分别有一个同名的html、js文件，分别作为入口模版和脚本。

### **Vue+vux**

如果某个页面是要用Vue+vux开发,则需要src/module下创建一个文件夹，然后在该文件夹下分别创建一个与文件夹同名的html和js，如：

```
index
 -index.html
 -index.js
```

接下来你就可以开发了。

启动开发服务器（webpack热替换）:

```
npm run vu-dev
```

### jQuery

如果某个页面是要用jQuery开发,则需要src/jm下创建一个文件夹,然后在该文件夹下分别创建一个与文件夹同名的html和js;

注：为了使用jQuery cdn加速，必须在html的head中导入jquery的cdn外链，参考jm/test/test.html

启动开发服务器（webpack热替换）:

```
npm run jq-dev
```

## 打包发布

打包release版的命令是：

```
npm run release
```

 成功后，会在dist文件夹下生成最终版本的release文件。
