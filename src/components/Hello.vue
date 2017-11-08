<template>
  <div style="text-align: center; margin-top: 50px">
    {{time}} 秒后将为您跳转到 github/wendux
  </div>
</template>

<script>
export default {
  name: 'hello',
  created(){
    var timer=setInterval(()=>{
      if(--this.time==0) {
        location.href = "https://github.com/wendux"
        clearInterval(timer)
      }

    },1000)
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      time:5
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
