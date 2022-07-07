<template>
  <div class="loading">
    <div class="load">
       <Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" />
    </div>

  </div>
</template>
<script>
    import {
        getGblinfo,
        getProject,
        loginRedirect
    } from '@/api/account';
    import { switchToProject } from '@/api/console/project.js';
    import store from '@/store';

    export default {
        data () {
            return {

            }
        },
        methods: {
            handlelinfo () {
                getGblinfo().then((r) => {
                    //   往sessionStorage中添加全局参数
                    var res = r.data;
                    console.log(res);
                    var storage = window.sessionStorage;
                    storage.setItem('LOCALDEPLOY', res.LOCALDEPLOY);
                    storage.setItem('PROJECT_GROUP', res.PROJECT_GROUP);
                    storage.setItem('baiduKey', res.baiduKey);
                    storage.setItem('baiduOfflinemapMaxzoom', res.baiduOfflinemapMaxzoom);
                    storage.setItem('gblEdition', res.gblEdition);
                    storage.setItem('googleKey', res.googleKey);
                    storage.setItem('isLogin', res.isLogin);
                    storage.setItem('isMaster', res.isMaster);
                    storage.setItem('realName', res.realName);
                    storage.setItem('staffName', res.staffName);
                    storage.setItem('useMap', res.useMap);
                    store.commit('realName', res.info.name);
                    //  接口请求刷新时间
                    function storageObj (obj) {
                        var checkedIdStr = JSON.stringify(obj); // 转为字符串存入sessionStorage
                        storage.setItem('checkedIdStr', checkedIdStr);
                    }
                    storage.setItem('uuid', res.uuid);
                    storage.setItem('token', res.wsPushToken);
                    var Interval = res.pollingInterval;
                    storageObj(Interval);
                    // var checkIdstrObj = JSON.parse(storage.getItem('checkedIdStr')); // 取值时转为对象
                });
            },
            handleProject () {
                var params = {
                    projectName: '',
                    provinceId: '',
                    cityId: '',
                    countyId: '',
                    statsAlarm: ''
                };
                getProject(params).then((r) => {
                    console.log(r);
                    var storage = window.sessionStorage;
                    function storageProjectObj (obj) {
                        var checkedProjectStr = JSON.stringify(obj); // 转为字符串存入sessionStorage
                        storage.setItem('checkedProjectStr', checkedProjectStr);
                    }
                    var project = r.data;

                    storageProjectObj(project);
                });
            },
            handleLodin () {
                this.handlelinfo();
                this.handleProject();
                store.commit('devHis', true);

                loginRedirect()
                    .then((res) => {
                        if (res.success) {
                            if (res.data.targetProjectCode === '') {
                                this.$router.replace(
                                    this.$route.query.redirect || '/visualScreen'
                                );
                            } else {
                                store.commit('projectCode', res.data.targetProjectCode);
                                switchToProject({
                                    projectCode: res.data.targetProjectCode
                                })
                                    .then((res) => {
                                        if (res.success) {
                                            store.commit('prjTitle', res.data.prjTitle);
                                            store.commit('prjName', res.data.prjName)
                                            store.commit('switchData', res.data)
                                            this.$router.replace({ path: '/console/project' });
                                        }
                                    })
                            }
                        }
                    })
            }
        },

        mounted () {
            this.handleLodin()
        }
    }
</script>

<style lang="less" scoped>
.loading{
  background:url('../../../assets/images/loading.jpg') no-repeat;
  background-size:100% 100%;
  width: 100%;
  height: 100%;
  position: relative;
  .load{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -25px;
  }
}
</style>
