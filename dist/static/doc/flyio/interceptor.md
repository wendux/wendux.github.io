## 拦截器

Fly支持请求／响应拦截器，可以通过它在请求发起之前和收到响应数据之后做一些预处理。

```javascript

//添加请求拦截器
fly.interceptors.request.use((request)=>{
    //给所有请求添加自定义header
    request.headers["X-Tag"]="flyio";
  	//打印出请求体
  	console.log(request.body)
  	//终止请求
  	//var err=new Error("xxx")
  	//err.request=request
  	//return Promise.reject(new Error(""))

    //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
    return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        //只将请求结果的data字段返回
        return response.data
    },
    (err) => {
        //发生网络错误后会走到这里
        //return Promise.resolve("ssss")
    }
)
```

**请求拦截器**中的request对象结构如下：

```javascript
{
  baseURL,  //请求的基地址
  body, //请求的参数
  headers, //自定义的请求头
  method, // 请求方法
  timeout, //本次请求的超时时间
  url, // 本次请求的地址
  withCredentials, //跨域请求是否发送第三方cookie
  ... //options中自定义的属性
}
```

**响应拦截器**中的response对象结构如下：

```javascript
{
  data, //服务器返回的数据
  engine, //请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
  headers, //响应头信息
  request  //本次响应对应的请求信息，即上面的request结构
}
```


### 移除拦截器

如果你想移除拦截器，只需要将拦截器设为null即可：

```javascript
fly.interceptors.request.use(null)
fly.interceptors.response.use(null,null)
```



## 在拦截器中执行异步任务

如果您想在拦截器里发起一个异步任务，然后等该异步任务结束后才继续往下执行，那么，您可以使用拦截器对象的`await(promise)`方法，它会等待异步任务（即`promise`参数）执行完毕后，才继续往下执行，这和直接在拦截器中返回promise是不同的，如果直接返回promise, fly将会使用其返回的数据作为最终的网络请求结果：

```javascript
//添加请求拦截器
fly.interceptors.request.use((request)=>{
    //直接返回promise将终止请求
  	return Promise.resolve("xx")
})

fly.get("/test").then(d=>{
  console.log(d)  //输出xxx
})

```

所以要在拦截器中执行异步任务必须使用拦截器的`await(promise)`方法。

this

### 在请求拦截器中执行异步任务

下面我们看一个例子：由于安全原因，我们需要所有的请求都需要在header中设置一个`csrfToken`，如果`csrfToken`不存在时，我们需要先请求一个`csrfToken`，然后再发起网络请求，由于请求`csrfToken`是异步的，所以我们需要在拦截器中执行异步请求，代码如下：

```javascript
var csrfToken = "";
//定义公共headers
fly.config.headers = {"x-tag":"flyio"}
fly.config.baseURL = "http://www.dtworkroom.com/doris/1/2.0.0/"
var newFly = new Fly;
newFly.config = fly.config;
var log=console.log
fly.interceptors.request.use(function (request) {
    log(`发起请求：path:${request.url}，baseURL:${request.baseURL}`)
    if (!csrfToken) {
        log("没有token，先请求token...");
        //注册拦截器不要使用箭头函数，这回导致this指向错误，如果使用的是箭头函数
        //则使用`fly.interceptors.request`替换`this`
        return this.await(
            newFly.get("/token").then((d) => {
                request.headers["csrfToken"] = csrfToken = d.data.data.token;
                log("token请求成功，值为: "+d.data.data.token);
                log(`继续完成请求：path:${request.url}，baseURL:${request.baseURL}`)
                return request
            })
        );
    } else {
        request.headers["csrfToken"] = csrfToken;
    }
})
```

> 本示例中用到两个示例接口地址为: http://www.dtworkroom.com/doris/1/2.0.0/test和http://www.dtworkroom.com/doris/1/2.0.0/token 。 您可以直接在浏览器中打开这两个链接查看返回数据。值得一提的是这两个接口中的数据内容会根据随机算法动态生成，所以相同的接口，多次请求的结果可能会不同。

接下来我们发起三次请求：

```javascript
fly.get("/test?tag=1")
    .then(function (d) {
        log("请求成功:", d)
    }).catch(function (e) {
    log("请求失败", e)
})
fly.get("/test?tag=2")
    .then(function (d) {
        log("请求成功:", d)
    }).catch(function (e) {
    log("请求失败", e)
})
fly.get("/test?tag=3")
    .then(function (d) {
        log("请求成功:", d)
    }).catch(function (e) {
    log("请求失败", e)
})
```

输出日志如下：

```shell
>发起请求：path:/test?tag=1，baseURL:http://www.dtworkroom.com/doris/1/2.0.0/
>没有token，先请求token...
>token请求成功，值为: DTSFBZXMEBEIPDBQITCIQXHM
>继续完成请求：path:/test?tag=1，baseURL:http://www.dtworkroom.com/doris/1/2.0.0/
>发起请求：path:/test?tag=2，baseURL:http://www.dtworkroom.com/doris/1/2.0.0/
>发起请求：path:/test?tag=3，baseURL:http://www.dtworkroom.com/doris/1/2.0.0/
>请求成功: {name: "曹洋", motion: "明图往装级今变连技能世关世管再社须题革开。", age: 44, male: false, type: 4, …}
>请求成功: {name: "秦超", motion: "查现空这革交局众太示形历二养及象便品了战。", age: 88, male: false, type: 4, …}
>请求成功: {name: "吴军", motion: "是部确场历安具观部千劳对观行南龙想今究本。", age: 36, male: false, type: 2, …}
```

在日志中可以看到，只有第一个请求才会请求token，请求token是一个异步任务，**通过`await` 发起异步任务后，当前fly实例将会被锁定，锁定后，fly实例会将接下来的新请求添加到一个队列，直到该异步任务执行结束后，才会执行该队列中的任务，正是由于这种特性，fly可以避免不必要的重复请求**，假设fly没有任务队列，我们想想上面的代码会如何执行？由于我们同时发起了三个网络请求，当第一个请求进入到拦截器时，发现没有token，则会先去请求token，这会需要一些时间，然后紧接着，第二个、第三个请求也进入了请求拦截器，然后也发现没有token(请求token的任务还没结束)，然后，它们又会分别再去请求token，这就会导致重复的网络请求。

> 注意：正是由于在拦截器中发起异步任务时当前fly实例将会被锁定，所以千万不要在await的异步任务中使用当前fly实例发起网络请求(死锁)，通常的做法是创建一个新Fly实例。

### 在响应拦截器中执行异步任务

现在基于上面的例子，我们添加一些功能：假设token有一个有效期，超过一段时间就会过期失效，失效时服务器会返回通知我们，然后我们再重新去请求新的token，请求成功后再重新发起之前的请求。

#### 思路

首先如果我们在业务代码中手动处理的话，会意味着，没个请求都要处理token失效、重试的逻辑，这会非常麻烦。所以我们寻求一种全局处理方式，如果在请求拦截器中来做，我们是不知道token是否过期的，所以无法在请求拦截器中处理重试逻辑。这时候该怎么做？响应拦截器就是答案：

响应拦截器中我们收到服务器返回，然后首先判断是否token过期，如果是，我们重新请求token并重新发起之前的请求，代码如下：

```javascript
fly.interceptors.response.use(
    function (response) {
        log("interceptors.response", response)
        //验证是否失效，
        if(response.data.data.tokenExpired) {
            log("token失效，重新请求token...");
            //注册拦截器不要使用箭头函数，这回导致this指向错误，如果使用的是箭头函数
            //则使用`fly.interceptors.response`替换`this`
            return this.await(
                newFly.get("/token").then((d) => {
                    csrfToken = d.data.data.token;
                    log("token已更新，值为: "+csrfToken);
                })
            ).then(() => {
                log(`重新请求：path:${response.request.url}，baseURL:${response.request.baseURL}`)
              //使用当前fly实例，重新发起之前的网络请求
              return fly.request(response.request); 
            })
        }else{
            return response.data.data;
        }
    }
)
```

上面的代码很简单，值得注意的是我们在`await()`返回的promise上添加了`then`，这并不会造成死锁，因为只有在执行传给await的promise过程中fly实例才会锁定，所以`then`里面的代码并不会被锁定。 

和请求拦截器中相同的是在执行`await()`提交的任务时fly实例会被锁定，新的请求将会进入到一个等待队列，同时锁定响应拦截器，也就是说，在响应拦截器中执行异步任务时，其余已经完成网络请求但还没进入响应拦截器的任务会在响应拦截器外排队，直到响应拦截器中的异步任务执行完成时，它们才会进入响应拦截器。这和请求拦截器设计初衷是相同的：避免不必要的重复请求。

### 完整的代码

```javascript
//定义公共headers
fly.config.headers = {"x-tag":"flyio"}
fly.config.baseURL = "http://www.dtworkroom.com/doris/1/2.0.0/"
var newFly = new Fly;
newFly.config = fly.config;
var log=console.log
//设置请求拦截器
fly.interceptors.request.use(function (request) {
    log(`发起请求：path:${request.url}，baseURL:${request.baseURL}`)
    if (!csrfToken) {
        log("没有token，先请求token...");
        return this.await(
            newFly.get("/token").then((d) => {
                request.headers["csrfToken"] = csrfToken = d.data.data.token;
                log("token请求成功，值为: "+d.data.data.token);
                log(`继续完成请求：path:${request.url}，baseURL:${request.baseURL}`)
                return request
            })
        );
    } else {
        request.headers["csrfToken"] = csrfToken;
    }
})
//设置响应拦截器    
fly.interceptors.response.use(
    function (response) {
        log("interceptors.response", response)
        //验证失效
        if(response.data.data.tokenExpired) {
            log("token失效，重新请求token...");
            return this.await(
                newFly.get("/token").then((d) => {
                    csrfToken = d.data.data.token;
                    log("token已更新，值为: "+csrfToken);
                })
            ).then(() => {
                log(`重新请求：path:${response.request.url}，baseURL:${response.request.baseURL}`)
                return fly.request(response.request);
            })
        }else{
            return response.data.data;
        }
    },
    function (err) {
        log("error-interceptor", err)
    }
)
```

