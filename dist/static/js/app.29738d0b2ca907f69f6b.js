webpackJsonp([1],{"/fHn":function(t,e,n){"use strict";function a(t){n("ocW8")}var r=n("SDP/"),i=n("Iqb2"),o=n("o7Pn"),s=a,c=o(r.a,i.a,s,null,null);e.a=c.exports},"07Dj":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"hello"},[n("h1",[t._v(t._s(t.msg))]),t._v(" "),n("h2",[t._v("Essential Links")]),t._v(" "),t._m(0),t._v(" "),n("h2",[t._v("Ecosystem")]),t._v(" "),t._m(1)])},r=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",[n("li",[n("a",{attrs:{href:"https://vuejs.org",target:"_blank"}},[t._v("Core Docs")])]),t._v(" "),n("li",[n("a",{attrs:{href:"https://forum.vuejs.org",target:"_blank"}},[t._v("Forum")])]),t._v(" "),n("li",[n("a",{attrs:{href:"https://chat.vuejs.org",target:"_blank"}},[t._v("Community Chat")])]),t._v(" "),n("li",[n("a",{attrs:{href:"https://twitter.com/vuejs",target:"_blank"}},[t._v("Twitter")])]),t._v(" "),n("br"),t._v(" "),n("li",[n("a",{attrs:{href:"http://vuejs-templates.github.io/webpack/",target:"_blank"}},[t._v("Docs for This Template")])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",[n("li",[n("a",{attrs:{href:"http://router.vuejs.org/",target:"_blank"}},[t._v("vue-router")])]),t._v(" "),n("li",[n("a",{attrs:{href:"http://vuex.vuejs.org/",target:"_blank"}},[t._v("vuex")])]),t._v(" "),n("li",[n("a",{attrs:{href:"http://vue-loader.vuejs.org/",target:"_blank"}},[t._v("vue-loader")])]),t._v(" "),n("li",[n("a",{attrs:{href:"https://github.com/vuejs/awesome-vue",target:"_blank"}},[t._v("awesome-vue")])])])}],i={render:a,staticRenderFns:r};e.a=i},"0zry":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"md",domProps:{innerHTML:t._s(t.content)}})},r=[],i={render:a,staticRenderFns:r};e.a=i},"5ouM":function(t,e,n){"use strict";var a=n("Fn9v"),r=n("ZzUO"),i=n("o7Pn"),o=i(a.a,r.a,null,null,null);e.a=o.exports},Fn9v:function(t,e,n){"use strict";e.a={data:function(){return{store:store}}}},Iqb2:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-layout",{staticStyle:{margin:"30px 0"},attrs:{"justify-center":""}},[n("v-flex",{directives:[{name:"show",rawName:"v-show",value:!t.loading,expression:"!loading"}],staticClass:"fade",style:{opacity:t.opacity?0:1},attrs:{md10:"",xs12:""}},[n("markdown",{attrs:{data:t.data}}),t._v(" "),t.current.next||t.current.pre?n("div",{staticStyle:{"margin-top":"50px",background:"#f1f1f1",padding:"12px","font-weight":"bold","border-radius":"2px"}},[t.current.next?n("div",[t._v("\n          下一篇： "),n("a",{staticStyle:{"text-decoration":"none"},attrs:{href:"#/doc/"+t.path+"/"+t.current.next.file}},[t._v("\n          "+t._s(t.current.next.title)+"\n        ")])]):n("div",[t._v("\n          已是最后一篇, 您可以打开菜单栏浏览目录。\n        ")])]):t._e()],1),t._v(" "),t.loading?n("v-flex",{staticStyle:{"text-align":"center"},attrs:{md10:"",xs12:""}},[n("v-progress-circular",{staticClass:"primary--text",attrs:{indeterminate:"",size:30}})],1):t._e()],1)},r=[],i={render:a,staticRenderFns:r};e.a=i},M93x:function(t,e,n){"use strict";function a(t){n("voEs")}var r=n("ajUD"),i=n("QdBm"),o=n("o7Pn"),s=a,c=o(r.a,i.a,s,null,null);e.a=c.exports},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("woOf"),r=n.n(a),i=n("7+uW"),o=n("3EgV"),s=n.n(o),c=n("tLfa"),u=(n.n(c),n("M93x")),l=n("YaEn"),v=n("205Z");i.a.use(s.a),i.a.config.productionTip=!1,r()(window,{log:console.log.bind(console),fly:new v,Fly:v,bus:new i.a,store:{title:"",menus:{},map:{}}}),new i.a({el:"#app",router:l.a,template:"<App/>",components:{App:u.a}}),console.log("您可以直接输入fly验证其功能")},QdBm:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-slide-y-transition",{attrs:{mode:"out-in"}},[n("router-view")],1)},r=[],i={render:a,staticRenderFns:r};e.a=i},"SDP/":function(t,e,n){"use strict";var a=n("k2iK");e.a={components:{Markdown:a.a},data:function(){return{data:"",path:"",name:"",store:store,loading:!1,opacity:!1}},beforeRouteUpdate:function(t,e,n){this.load(t),n()},created:function(){this.load(this.$route)},methods:{load:function(t){var e=this;if(!this.loading){this.loading=!0,this.opacity=!0,this.path=t.params.path,this.name=t.params.name;var n=Date.now(),a=function(){var t=Date.now()-n;t<1e3?setTimeout(function(){e.loading=!1,setTimeout(function(){e.opacity=!1},20)},800-t):(e.loading=!1,setTimeout(function(){e.opacity=!1},100))};fly.get("/static/doc/"+this.path+"/"+this.name+".md").then(function(t){e.data=t.data,document.body.scrollTop=0,a()}).catch(function(t){alert(t.message),a()})}}},computed:{current:function(){return this.store.map[this.name]||{}}}}},TemT:function(t,e,n){"use strict";var a=n("5ouM");e.a={components:{CopyRight:a.a},data:function(){return{clipped:!1,drawer:!1,items:[{icon:"home",title:"主页"}],store:store,show:!1,path:""}},beforeRouteUpdate:function(t,e,n){this.load(t),n()},created:function(){this.load(this.$route)},computed:{comMenus:function(){return this.items.concat(this.store.menus.menus||[])}},methods:{go:function(t){t.route.startsWith("http")?location.href=t.route:this.$router.push({path:t.route})},load:function(t){var e=this;this.path=t.params.path,fly.get("/static/doc/"+this.path+"/menus.json").then(function(t){var n,a={};t.data.dirs.forEach(function(t){t.list.forEach(function(t){n&&(n.next=t,t.pre=n),n=a[t.file]=t})}),store.menus=t.data,store.map=a,setTimeout(function(){e.show=!0},18),store.title=store.menus&&store.menus.pageTitle||"文档中心",document.getElementsByTagName("title")[0].innerText=store.title})}}}},YaEn:function(t,e,n){"use strict";var a=n("7+uW"),r=n("/ocq"),i=n("qSdX"),o=n("/fHn"),s=n("atJB");a.a.use(r.a),e.a=new r.a({routes:[{path:"/",name:"Hello",component:i.a},{path:"/doc",component:s.a,children:[{path:":path/:name",component:o.a}]}]})},ZzUO:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{color:"#aaa","text-align":"center","margin-top":"40px","padding-bottom":"30px"}},[t._v("\n  Copyright © wendu "+t._s((new Date).getFullYear())+"\n  "),t.store.menus.git?n("v-btn",{attrs:{icon:"",href:t.store.menus.git}},[n("v-icon",[t._v("fa-github")])],1):t._e()],1)},r=[],i={render:a,staticRenderFns:r};e.a=i},aIBP:function(t,e){},ajUD:function(t,e,n){"use strict";e.a={data:function(){return{}}}},atJB:function(t,e,n){"use strict";function a(t){n("zGA2")}var r=n("TemT"),i=n("zdUZ"),o=n("o7Pn"),s=a,c=o(r.a,i.a,s,null,null);e.a=c.exports},dSsZ:function(t,e,n){"use strict";var a=n("EFqf");a.setOptions({breaks:!0,highlight:function(t){return hljs.highlight("javascript",t,!0).value}}),e.a={props:["data"],computed:{content:function(){return a(this.data||"")}}}},k2iK:function(t,e,n){"use strict";function a(t){n("aIBP")}var r=n("dSsZ"),i=n("0zry"),o=n("o7Pn"),s=a,c=o(r.a,i.a,s,null,null);e.a=c.exports},ocW8:function(t,e){},p57E:function(t,e){},q6Np:function(t,e,n){"use strict";e.a={name:"hello",data:function(){return{msg:"Welcome to Your Vue.js App"}}}},qSdX:function(t,e,n){"use strict";function a(t){n("p57E")}var r=n("q6Np"),i=n("07Dj"),o=n("o7Pn"),s=a,c=o(r.a,i.a,s,"data-v-74fd39b8",null);e.a=c.exports},tLfa:function(t,e){},voEs:function(t,e){},zGA2:function(t,e){},zdUZ:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",{attrs:{light:""}},[n("v-navigation-drawer",{attrs:{persistent:"",clipped:"",fixed:"","enable-resize-watcher":""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[n("v-list",{attrs:{dense:""}},t._l(t.comMenus,function(e,a){return n("v-list-tile",{key:a,attrs:{ripple:""},on:{click:function(n){t.go(e)}}},[n("v-list-tile-action",[n("v-icon",{domProps:{innerHTML:t._s(e.icon)}})],1),t._v(" "),n("v-list-tile-content",[n("v-list-tile-title",{domProps:{textContent:t._s(e.title)}})],1)],1)})),t._v(" "),n("v-list",{attrs:{dense:""}},t._l(t.store.menus.dirs,function(e,a){return t.store.menus?n("v-list-group",{key:a,attrs:{value:e.active}},[n("v-list-tile",{attrs:{slot:"item",ripple:""},slot:"item"},[n("v-list-tile-action",[n("v-icon",[t._v(t._s(e.icon||"folder"))])],1),t._v(" "),n("v-list-tile-content",[n("v-list-tile-title",[t._v(t._s(e.title))])],1),t._v(" "),n("v-list-tile-action",[n("v-icon",[t._v("keyboard_arrow_down")])],1)],1),t._v(" "),t._l(e.list,function(e){return n("v-list-tile",{key:e.title,attrs:{ripple:"",value:e.file==t.$route.params.name},on:{click:function(n){t.$router.push({path:"/doc/"+t.path+"/"+e.file})}}},[n("v-list-tile-content",[n("v-list-tile-title",[t._v(t._s(e.title))])],1)],1)})],2):t._e()}))],1),t._v(" "),n("v-toolbar",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],class:t.store.menus.toolbarClass||"teal",attrs:{fixed:"",dark:!t.store.menus.light}},[n("v-toolbar-side-icon",{on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}}),t._v(" "),n("v-toolbar-title",{domProps:{textContent:t._s(t.store.title)}}),t._v(" "),n("v-spacer"),t._v(" "),t.store.menus.git?n("v-btn",{attrs:{icon:"",href:t.store.menus.git}},[n("v-icon",[t._v("fa-github")])],1):t._e()],1),t._v(" "),n("main",[n("v-container",{attrs:{fluid:""}},[n("v-slide-y-transition",{attrs:{mode:"out-in"}},[n("router-view",{staticStyle:{"min-height":"calc(100vh - 210px)"}})],1),t._v(" "),n("copy-right")],1)],1)],1)},r=[],i={render:a,staticRenderFns:r};e.a=i}},["NHnr"]);
//# sourceMappingURL=app.29738d0b2ca907f69f6b.js.map