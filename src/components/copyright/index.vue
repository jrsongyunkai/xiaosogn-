<template>
  <div class="footer">
    <GlobalFooter class="i-copyright" :copyright="copyright" />
    <span class="v6">{{loginObj.cc1}}</span>
    <div class="links"><a :href="miit" target="_blank" style="text-decoration:none;color: #808695;">{{loginObj.cc2}} </a> </div>
    <span class="v6">当前版本 <span class="edition">v1.0.4-sp3</span> </span>
  </div>
</template>
<script>
    export default {
        props: {
            loginObj: {
                type: Object
            }
        },

        name: 'i-copyright',
        data () {
            return {
                miit: 'https://beian.miit.gov.cn/#/Integrated/index',
                copyright: '',
                obj: ''
            };
        },
        mounted () {
        },
        methods: {

        }

    };
</script>
<style lang="less" >
.footer {
  display: flex;
  justify-content: center;
  height: 40px;
  line-height: 40px;
}
.i-copyright {
  &-hidden {
    display: none;
  }
}
.ivu-global-footer {
  margin: 0 !important;
  padding: 0 !important;
}
.ivu-global-footer-copyright,.links {
    color: #808695 !important;
    font-size: 14px;
}
.v6{
  margin:0 5px;
  color: #808695;
}
.edition{
  color: #1054ff;
}
</style>
