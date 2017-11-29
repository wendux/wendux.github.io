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
    font-family: Arial, Helvetica, 'Microsoft Yahei', "微软雅黑",sans-serif !important;
    -webkit-font-smoothing: antialiased;
    word-break: break-word;
    box-sizing: border-box;
  }
  @media screen and (max-width: 600px) {
    .navigation-drawer {
      margin-top: 56px !important;
      max-height: calc(100vh - 56px) !important;
    }
  }
</style>
