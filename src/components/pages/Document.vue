<template>
  <v-app light>
    <v-navigation-drawer
      persistent
      clipped
      fixed
      v-model="drawer"
      enable-resize-watcher
    >
      <v-list dense >
        <v-list-tile
          ripple
          v-for="(item, i) in comMenus"
          :key="i"
          @click="go(item)"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <!--文档列表菜单-->
      <v-list dense >
        <v-list-group
                      v-if="store.menus"
                      v-for="(dir, i) in store.menus.dirs"
                      :key="i"
                      :value="dir.active"
        >
          <v-list-tile slot="item" ripple>
            <v-list-tile-action>
              <v-icon>{{ dir.icon||"folder" }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ dir.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile v-for="subItem in dir.list"
                       :key="subItem.title"
                       ripple
                       :value="subItem.file==$route.params.name"
                       @click="$router.push({path:`/doc/${path}/${subItem.file}`})">

            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>

    </v-navigation-drawer>
    <v-toolbar  fixed :class="store.menus.toolbarClass||'teal'" :dark="!store.menus.light" v-show="show">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" ></v-toolbar-side-icon>
      <v-toolbar-title v-text="store.title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon v-if="store.menus.git" :href="store.menus.git"><v-icon>fa-github</v-icon></v-btn>
    </v-toolbar>
    <main>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <router-view style=" min-height: calc(100vh - 210px);"></router-view>
        </v-slide-y-transition>
        <copy-right></copy-right>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import CopyRight from "../CopyRight.vue"
  export default {
    components: {
      CopyRight
    },
    data () {
      return {
        clipped: false,
        drawer: false,
        items: [
          { icon: 'fa-github', title: 'Github Home page' , route:"https://github.com/wendux"}
        ],
        store: store,
        show:false,
        path:""
      }
    },
    beforeRouteUpdate(to,from,next){
      this.load(to)
      next()
    },
    created(){
      this.load(this.$route)
    },
    computed:{
      comMenus(){
        return this.items.concat(this.store.menus.menus||[]);
      }
    },
    methods:{
      go(item){
        if(item.route.startsWith("http")){
          location.href=item.route;
        }else{
          this.$router.push({path:item.route})
        }
      },
      load(route){
        this.path=route.params.path;
        fly.get(`/static/doc/${this.path}/menus.json`).then(d=>{

          var pre;
          var map={};
          d.data.dirs.forEach(e=>{
            e.list.forEach(item=>{
              if(pre){
                pre.next=item;
                item.pre=pre;
              }
              pre=map[item.file]=item;
            })
          })
          store.menus=d.data;
          store.map=map;

          setTimeout(()=>{
            this.show=true;
          },18);
          store.title=store.menus&&store.menus.pageTitle||"文档中心";
          document.getElementsByTagName('title')[0].innerText=store.title;
        })
      }
    }
  }
</script>
<style lang="stylus">
</style>
