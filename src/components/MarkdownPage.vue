<template>
  <v-layout justify-center style="margin: 30px 0">
    <v-flex md10 xs12>
      <markdown :data="data"></markdown>
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
      data: ""
    }),
    beforeRouteUpdate(to,from,next){
      this.load(to)
      next()
    },
    created: function () {
      this.load(this.$route)
    },
    methods: {
      load(route){
        var path = route.params.path;
        var name = route.params.name;
        axios.get(`/static/doc/${path}/${name}.md`).then(d => {
          this.data = d.data;
        }).catch(e => {
          alert(e.msg);
        })
      }
    }
  }
</script>
