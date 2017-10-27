# FAQ

1. **fly能支持Jsonp吗 ？**

   > fly不会支持jsonp，原因有三点：
   >
   > 1. 由于jsonp本质上是通过可跨域html标签来完成的，并非通过http engine (XmlHttprequest)来完成. 实现其实是dom操作。
   > 2. jsonp只是在浏览器环境中需要，而其它环境可能并不存在dom。
   > 3. 在fly中，如果您有跨域需求，使用CORS会更简单。

2. **一个fly实例的拦截器可以设置多个吗？**

   > 不可以，因为在大多数场景中，很少有需要设置多个拦截器的场景；而 fly 的定位是轻量，所以将来也不会在内部支持，如果您有需要设置多个拦截器的场景，可以自己维护一个拦截器数组，然后在fly 的拦截器中遍历调用，这也很简单。

3. **fly怎么清除拦截器，没有unuse方法吗？**

   > 一个fly实例的拦截器只有一个，没有unuse方法，清除时只需要将拦截器设置为null即可， 如`fly.interceptors.response.use(null,null)`

4. **fly支持请求取消吗？**

   > fly不支持请求取消，并且将来也不会支持，原因如下：
   >
   > 1. 请求取消的场景很少，需要请求取消的场景常见于需要并发、网络请求密集的场景，而无论是在浏览器端还是node端，javascript 都不太适用于这样的场景（注意，这和node作为网络服务器不同，fly是请求的发起方而不是处理方，node 适用于处理高并发的场景没错，但并不适合发起密集的网络请求）。
   > 2. 本质上来讲，只要请求发出，基本很难完全取消请求，很多的取消实现只是不处理返回结果而已。

5. **fly没有 delete、put、patch这些方法吗？**

   > 考虑到 RESTful API的场景并不多，而这些方法实现也很简单，由于fly的定位是轻量，所以没有提供这些方法，但是，您可以通过request方法很容易实现如：
   >
   > ```javascript
   > //DELETE 请求
   > fly.request("/user/8/delete", null, {method:"delete"})
   > //PUT请求
   > fly.request("/user/register", {name:"doris"}, {method:"PUT"})
   >
   > ```
   >
   > 其实要让fly支持也就是几句代码的事：
   >
   > ```javascript
   > ["delete","put","patch"].forEach(e=>{
   >   fly[e]=function(url,data,option){
   >     return this.request(url,data,Object.assign({method:e},options))
   >   }
   > })
   > ```

   ​