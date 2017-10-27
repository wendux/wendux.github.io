<template>
  <div>
    <div class="box">
      <div class="tit">{{ title }}</div>
      <ul>
        <li><router-link to="/doc/flyio-en/readme">English</router-link></li>
        <li><router-link to="/doc/flyio/readme">中文简体</router-link></li>
      </ul>
      <div class="copyright">Copyright © wendu  2017 </div>
    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Choose a language'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  *{
    box-sizing: border-box;
  }

  .box {
    width: 550px;
    margin: 50px auto;
    padding:0 16px;
    min-height: 300px;
    position: relative;
  }
  .tit {
    list-style-type: none;
    font-size: 16px;
    font-weight: bold;
    padding: 20px 0;
    border-bottom: #eee 1px solid;
  }
  ul{
    margin-top: 30px;
    padding: 0;
  }
  ul li{
    width: 30%;
    font-size: 16px;
    padding: 10px 16px 10px 3px;
    display: inline-block;
  }
  @media screen and (max-width: 550px) {
    .box{
      width: 100%;
      padding:0 26px;
    }
    ul li{
      width: 100%;
    }
  }
  a {
    color: darkcyan;
  }
  .copyright{
    color: #bbb;
    position: absolute;
    bottom: 0;
    text-align: center;
  }
</style>
