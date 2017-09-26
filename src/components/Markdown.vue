<template>
  <div class="md" v-html="content"></div>
</template>
<style lang="stylus">
  @import "../stylus/main.styl"
  $codeBack=#f3f3f3;
  .md {
    font-size: 15px;
    color: #333;
    line-height :1.7em;
    h1, h2, h3, h4 {
      font-weight: bold;
      color: #333;
      margin-left: -3px;
      line-height :1.6em;
    }
    img{
      max-width :100%;
      display: block;
      margin: 0 auto;
    }

    hr {
      border: 0;
      background-color: #eee;
      height: 1px;
      margin: 16px 0;
    }

    h1 {
      font-size: 30px;
      border-bottom: #eee 1px solid;
      padding-bottom: 8px;
    }
    h2 {
      font-size: 24px;
      border-bottom: #eee 1px solid;
      padding-bottom: 8px;
      margin-bottom :30px;
      padding-top :30px;
    }
    h3 {
      font-size: 18px;
      padding : 10px 0;
    }
    h4 {
      font-size: 16px;
    }
    blockquote {
      border-left-color: $theme.primary;
      padding: 16px 10px 16px 24px;
      margin: 24px 0px;
      background: #f3f3f3;
      font-size: 15px;
      font-weight :normal;
      /*color:#214750;*/
      border-bottom-right-radius: 2px;
      border-top-right-radius: 2px;
      p {
        margin: 0;
      }
    }
    @media screen and (max-width: 900px){
      blockquote {
        padding: 8px 10px 8px 15px;
        font-size :14px;
      }
    }
    ol, ul {
      margin: 20px 0;
    }
    li {
      line-height: 2em;
    }
    pre {
      position: relative;
      margin-bottom: 24px;
      border-radius: 3px;
      background-color: $codeBack !important;
      white-space: pre;
      display: block;
      padding: 12px 20px;
      border:#eee 1px solid;
      line-height :1.6em;
      overflow-x: auto;
      code{
        white-space: pre;
        color: rgb(52, 73, 94);
        font-weight :normal !important;
        line-height: 1.8em;
        font-size : 13px;
      }
    }

    code {
      font-family: "SFMono-Regular", Menlo, 'Roboto Mono', Monaco, courier, monospace;
      background-color: $codeBack !important;
      -webkit-font-smoothing: initial;
      padding: 0 2px;
      /*font-weight normal !important;*/

    }
    code:after, code:before, kbd:after, kbd:before {
      content: "" !important;
    }
    table {
      margin: 10px auto;
      overflow :auto;
      border-collapse: collapse;
    }
    th {
      border: #ccc 1px solid;
      text-align: left;
      background: #eee;
      padding: 8px 12px;
      white-space: nowrap;
    }
    td {
      border: #ccc 1px solid;
      padding: 8px 12px;
    }
    tr:nth-child(even) {
      background-color #f6f6f6
    }
    @media screen and (max-width: 600px) {
      blockquote {
        padding: 8px 10px 8px 15px;
        font-size: 14px;
      }
      table{
        display:block;
      }
      pre{
        padding: 12px;
        code{
          font-size : 12px;
        }
      }
    }

  }


</style>
<script>
  var marked = require('marked');
  marked.setOptions({
    breaks: true,
    highlight: function (code) {
      return hljs.highlight("javascript",code,true).value;
      //return hljs.highlightAuto(code).value;
    }
  });
  export default {
    props: ["data"],
    computed: {
      content() {
        return marked(this.data || "");
      }
    }
  }
</script>
