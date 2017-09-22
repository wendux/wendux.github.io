<template>
  <v-app light>
    <v-navigation-drawer
      persistent
      clipped
      fixed
      v-model="drawer"
      enable-resize-watcher
    >
      <v-list>
        <v-list-tile
          ripple
          v-for="(item, i) in items"
          :key="i"
          @click.native="go(item)"
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
      <v-list>
        <v-list-group value="true" v-if="store.menus">
          <v-list-tile slot="item" ripple>
            <v-list-tile-action>
              <v-icon>{{ store.menus.icon||"folder" }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ store.menus.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile v-for="subItem in store.menus.list"
                       :key="subItem.title"
                       ripple
                       :value="subItem.file==$route.params.name"
                       @click.native="$router.push({path:`/doc/${path}/${subItem.file}`})">

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
          <router-view></router-view>
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
          { icon: 'home', title: '主页' }
        ],
        store: store,
        show:false,
        path:""
      }
    },
    created(){
      this.path=this.$route.params.path;
      fly.get(`/static/doc/${this.path}/map.json`).then(d=>{
        store.menus=d.data;
        console.log(d.data.menus)
        this.items=this.items.concat(d.data.menus);
        setTimeout(()=>{
          this.show=true;
        },18);
        store.title=store.menus&&store.menus.pageTitle||"文档中心";
        document.getElementsByTagName('title')[0].innerText=store.title;
      })
    },
    methods:{
      go(item){
        if(item.route.startsWith("http")){
          location.href=item.route;
        }else{
          this.$router.push({path:item.route})
        }
      }
    }
  }
</script>
<style lang="stylus">
</style>
