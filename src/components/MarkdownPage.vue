<template>
  <v-layout justify-center style="margin: 30px 0;">
    <v-flex md10 xs12>
      <markdown :data="data"></markdown>
      <div
        v-if="current.next||current.pre"
        style="margin-top: 50px; background: #f1f1f1; padding: 12px; font-weight: bold"
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
      store: store
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
        this.path = route.params.path;
        this.name = route.params.name
        fly.get(`/static/doc/${this.path}/${this.name}.md`).then(d => {
          this.data = d.data;
          document.body.scrollTop = 0
        }).catch(e => {
          alert(e.message);
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
