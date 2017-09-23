<template>
  <div style='color: #aaa; text-align: center; margin-top: 40px; padding-bottom: 30px;'>
    Copyright &copy; wendu {{new Date().getFullYear()}}
    <v-btn icon v-if="store.menus.git" :href="store.menus.git"><v-icon>fa-github</v-icon></v-btn>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        store:store
      }
    }
  }
</script>
