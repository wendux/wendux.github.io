# Compare with axios

The author was also using Axios, but with the increase of the project experience, found that in some scenarios, Axios is not perfect.

In the process of designing Fly, in order to conform to the habits of Axios users,  referring to the Axios interface (but not fully compatible).  the following is a detailed comparison between Fly and Axios.

## Similarities

1. Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
2. Support Node and Browser environment
3. Supports  request and response interceptors
4. Automatic transforms for JSON data

## Differences

### In browser

1. Axios supports request cancellation, while fly does not support request cancellation;
2.  Axios supports global configuration and instance level configuration, and fly configuration supports instance level and single request level.
3. Fly is lighter, lower integration cost, `fly.min.js` is only about 4K, while `axios.min.js` is about 12K

### In Node

In Node environment, the function of Fly is obviously powerful than that of Axios. Fly in node not only provides the file download, upload API, but also, through `fly.$http`,  you can call all the functions of the [request library](https://github.com/request/request)  directly , more details please refer to [Node enhanced API](#/doc/flyio-en/node).

### Request forwarding

The most unique and powerful feature of Fly is that it supports request forwarding in hybrid application, while Axios does not support . more details please refer to [request redirection](#/doc/flyio-en/redirect) .

### Http Engine

Fly introduces the concept of Http Engine,  by switching Http Engine, Fly can 

1. support different JavaScript runtimes , such as node, browser , JsCore and soon on. 
2. Implement some interesting functions like  [Global Ajax interception](#/doc/flyio-en/hook)

More details please refer to [http engine](#/doc/flyio-en/engine) .

### Design idea

Fly adopts the layered design idea to separate the upper user interface and the underlying Http Engine. Using adapter mode makes it very easy to implement a  Http Engine.  Because of this framework design, by switching the underlying Http Engine, fly can flexibly support a variety of Javascript runtimes while ensuring the consistency of the upper layer interface. Also, through adapter, the user can completely customize the implementation of the HTTP request... There are many advanced gameplay .





