<template>
  <v-layout justify-center style="margin: 30px 0;">
    <v-flex md10 xs12 v-if="!loading">
      <markdown :data="data"></markdown>
      <div
        v-if="current.next||current.pre"
        style="margin-top: 50px; background: #f1f1f1; padding: 12px; font-weight: bold; border-radius: 2px"
      >
        <div v-if="current.next">
          下一篇： <a :href="`#/doc/${path}/${current.next.file}`" style="text-decoration: none">
          {{current.next.title}}
        </a>
        </div>
        <div v-else-if="current.pre">
          上一篇： <a :href="`#/doc/${path}/${current.pre.file}`" style="text-decoration: none">
          {{current.pre.title}}
        </a>
        </div>

      </div>
    </v-flex>
    <v-flex md10 xs12 v-else style="text-align: center">
      <v-progress-circular indeterminate v-bind:size="30" class="primary--text"></v-progress-circular>
    </v-flex>
  </v-layout>
</template>
<script>
  import Markdown from './Markdown.vue'

  export default {
    components: {
      Markdown
    },
    data: () => ({
      data: "",
      path: "",
      name: "",
      store: store,
      loading:false
    }),
    beforeRouteUpdate(to, from, next) {
      this.load(to)
      next()
    },
    created: function () {
      this.load(this.$route)
    },
    methods: {
      load(route) {
        if(this.loading){
          return;
        }
        this.loading=true;
        this.path = route.params.path;
        this.name = route.params.name
        var start=Date.now();
        var wait= ()=>{
          var pass=Date.now()-start
          if(pass<1000){
            setTimeout(()=>{
              this.loading=false;
            },1000-pass)
          }else{
            this.loading=false;
          }
        }
        fly.get(`/static/doc/${this.path}/${this.name}.md`).then(d => {
          this.data = d.data;
          document.body.scrollTop = 0
          wait();

        }).catch(e => {
          alert(e.message);
          wait()
        })
      }
    },
    computed: {
      current() {
        return this.store.map[this.name] || {};
      }
    }
  }
</script>
