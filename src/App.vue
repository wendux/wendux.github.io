<template>
  <v-slide-y-transition mode="out-in">
    <router-view></router-view>
  </v-slide-y-transition>
</template>

<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>

<style lang="stylus">
  @import "./stylus/main.styl"
  body {
    font-family: 'Source Sans Pro', 'Helvetica Neue', 'Roboto', Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased;
  }
</style>
