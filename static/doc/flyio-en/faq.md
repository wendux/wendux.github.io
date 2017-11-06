# FAQ

1. **Can fly support Jsonp?**

   > Fly doesn't support jsonp, because there are three reasons：
   >
   > 1. Because jsonp is essentially accomplished by cross domain HTML tags, it is not accomplished by HTTP engine (XmlHttprequest). The implementation is actually DOM operation。
   > 2. Jsonp is only needed in the browser environment, and other environments may not have DOM。
   > 3. In fly, it's easier to use CORS if you have cross domain requirements。

2. **Can a fly instance set multiple interceptors?**

   > No, because in most situations, there is little need to set up a number of interceptor scene; while fly is positioning lightweight, so will not be in the internal support, if you need to set up a number of interceptor scenes, can maintain an interceptor array yourself.

3. **How to remove interceptors? Is there no unuse method?**

   > There is only one interceptor for a fly instance, and  there is no `unuse` method for fly. When you need to  remove the interceptors,  just set it to null:
   >
   > `fly.interceptors.response.use(null,null)`

4. **Does fly support request cancellation?**

   > Fly does not support request cancellation, and will not support it for the future, reasons are as follows:
   >
   > 1. The scene is very few;  need to request the cancellation of the scene is common in need of concurrency, network request intensive scene, whether in the browser or node client, JavaScript are not applicable to this scene.
   > 2. Essentially, as long as the request is sent, it's hard to completely cancel the request, and many of the cancellation implementations just don't deal with the return result。



   ​
