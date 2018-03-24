<template>
  <v-layout justify-center style="margin: 30px 0;">
    <v-flex md10 xs12 v-show="!loading" class="fade" :style="{opacity:opacity?0:1}">
      <markdown :data="data"></markdown>
      <div
        v-if="current.next||current.pre"
        style="margin-top: 50px; background: #f1f1f1; padding: 12px; font-weight: bold; border-radius: 2px"
      >
        <div v-if="current.next">
          Next： <a :href="`#/doc/${path}/${current.next.file}`" style="text-decoration: none">
          {{current.next.title}}
        </a>
        </div>
        <div v-else>
          已是最后一篇, 您可以打开菜单栏浏览目录。
        </div>
      </div>
      <div id="comments"></div>
    </v-flex>
    <v-flex md10 xs12 v-if="loading" style="text-align: center; margin-top: 30px">
      <v-progress-circular indeterminate v-bind:size="30" class="primary--text"></v-progress-circular>
    </v-flex>


  </v-layout>
</template>

<style lang="stylus">
  .fade {
    transition: all .2s
  }

  .fade {
    opacity: 0;
  }

  #comments {
    border-top #ddd 1px solid
    margin-top 40px
    padding-top 10px
    button {
      margin-bottom: 0;
    }
    .gitment-comment-header {
      background: transparent
    }
  }
</style>
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
      loading: false,
      opacity: false
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
        if (this.loading) {
          return;
        }

        this.loading = true;
        this.opacity = true;
        this.path = route.params.path;
        this.name = route.params.name
        var start = Date.now();
        var wait = () => {
          var pass = Date.now() - start
          if (pass < 1000) {
            setTimeout(() => {
              this.loading = false;
              setTimeout(() => {
                this.opacity = false
              }, 20)
            }, 800 - pass)
          } else {
            this.loading = false;
            setTimeout(() => {
              this.opacity = false
            }, 100)
          }
        }
        // alert(document.documentElement.scrollTop)
        // alert(document.body.scrollTop)
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        fly.get(`/static/doc/${this.path}/${this.name}.md`).then(d => {
          this.data = d.data;
          wait();
          document.title = "flyio-" + this.current.title;
          this.renderComment();
        }).catch(e => {
          alert(e.message);
          wait()
        })
      },
      renderComment() {
        var myTheme = {
          render(state, instance) {
            const container = document.createElement('div')
            container.lang = "en-US"
            container.className = 'gitment-container gitment-root-container'
            container.appendChild(instance.renderHeader(state, instance))
            container.appendChild(instance.renderComments(state, instance))
            container.appendChild(instance.renderEditor(state, instance))
            container.appendChild(instance.renderFooter())
            return container
          },
          renderFooter() {
            const container = document.createElement('div')
            container.lang = "en-US"
            container.className = 'gitment-container gitment-footer-container'
            container.innerHTML = `
              Contact me by
              <a class="gitment-footer-project-link" href="https://juejin.im/user/58211b88a0bb9f0058c25b7f/posts" target="_blank">
                Blog
              </a> or
               <a class="gitment-footer-project-link" href="https://github.com/wendux" target="_blank">
                Github
              </a>
            `
            return container
          }
        }
        var gitment = new Gitment({
          id: this.current.title, // optional
          owner: 'wendux',
          repo: 'flyio-issues',
          theme: myTheme,
          oauth: {
            client_id: 'cd1c78a4b43550a390f2',
            client_secret: 'fdb869e6a8e81b0c12fc7e19b1b74a98d81a3a41',
          }
          // ...
          // For more available options, check out the documentation below
        })
        gitment.render('comments')
      }
    },
    computed: {
      current() {
        return this.store.map[this.name] || {};
      }
    }
  }
</script>
