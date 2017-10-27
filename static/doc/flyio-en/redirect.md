# Request forwarding

If you're developing a PC desktop application, or a APP,  there may be some functionality that you need to implement by embedding H5 pages, and for such applications, we call them hybrid applications. And in the hybrid application of the big number platform, you will find a problem-- you can't interfere with the Ajax request initiated by the H5 page in webview. This makes it difficult for you to do a unified request management，oh..oh.. But why do we need unified request management?  There are mainly the following scenes：

1. cookie synchronization.
2. Interface security
3. Access control
4. Performance
5. Cache

### Cookie synchronization

The key point in the development of hybrid applications is the cookie synchronization between Native and h5. Because Native and H5 can initiate a network request, both the request pool is not the same (H5 Ajax request was initiated by the WebView), which can lead to the cookies of Native and H5  are not synchronized, if not the unified management request, will lead you to do a lot of work  synchronously in different situations. More frustrating is that the WKWebview in the IOS system does not provide cookie synchronization interface,  IOS developers usually only indirectly, through the injection of JavaScript code to the WebView , but it has a drawback, is unable to synchronize the httpOnly property of cookie, it is because JavaScript cannot operate the cookie with httpOnly property.

### Interface security

In order to ensure the security of data transmission on network, HTTPS protocol has become more and more popular, but the browser /webview for HTTPS requests, the default certificate verification strategy is: first check the local certificate trust list, if the local trust list does not has the certificate of  the website you visit , the browser /webview  will go to check the CA chains. This means that if an attacker opens a proxy server through the fake certificate, and then on their own mobile phone manually add this fake certificate to the local certificate trust list, then the attacker sets the mobile network agent as its proxy server, As a result, the  request and response  data of WebView  will completely leak in front of attackers. At present, The main way to prevent proxy attacks is to verify certificates at the native, it can guarantee the requested/responsed data by Native is safe, but the H5 through the WebView initiated request will still be exposed, if your APP is a financial application, it will be very dangerous.

### Access control

Because of  the same-origin policy of browsers, if H5 requests need cross domain, it is a troublesome matter. Now the main  cross-domain solution is **jsonp** and **CORS**（Cross Origin Resource Sharing）. But these two solutions both need server side support。Many times, however, we need to specify which domains can be accessed  and which domains cannot be accessed at native side. If the request is initiated in WebView, the native can not be interfered at all。

### Performance

Different WebView, the underlying request processing strategy for the network is often different, some is the use of a thread pool, and some are each request will create a new thread, which leads to slower network requests on webview of some systems  .

### Cache

Now some hybrid applications in order to achieve page quickly opened, with some self cache management scheme, the common solution is to package the new version of the web page in advance, and then detect the update and download the package  to the local after each time of APP startup .Then intercept all requests from the WebView, read from the downloaded files directly from the static resources, and the dynamic data is still dynamically request from the server by ajax. but there are some data requested by ajax also need cache , such as a config file, or a markdown text and so on. But because we can't interfere with the Ajax request, we can't do that.



**Summary**

In a word, these problems can be easily resolved if unified request management can be implemented at the native side .   But how do we get the Ajax  requests on native?  It might have been difficult in the past, but now with fly, the problem becomes very simple. the answer is request redirections which is supported by Fly .

## Request redirections

In browsers, Ajax requests are sent by browsers, and Fly can redirect  requests to native by switching http engine. The typical scene is in the hybrid App, will forward all requests to Native, then, the unified request management, cookie management, certificate verification, request filtering and so on are carried out on Native.

Another important point is that there is no same-origin  restriction on the native, and access control can be done at the native. 

Before you know how fly supports request redirection, you need to know "HTTP engine" first.

