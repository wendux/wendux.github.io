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
    created: function () {
      var path = this.$route.params.path;
      var name = this.$route.params.name;
      axios.get(`/static/doc/${path}/${name}.md`).then(d => {
        this.data = d.data;
      }).catch(e => {
        alert(e.msg);
      })
    },
    methods: {}
  }
</script>
