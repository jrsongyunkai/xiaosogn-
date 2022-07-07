<template>
  <div class="page-account">
    <div v-if="showI18n" class="page-account-header">
        <div class="project">
            <div >
                <img src="@/assets/images/mantunLogo.png" alt="" />
                <span>智慧式用电安全监管与电能管理平台</span>
            </div>
            <div class="vertical"></div>
            <div class="setText">顿雾系统V1.0</div>
        </div>
        <div class="links"><a :href="loginObj.cc3.href" target="_blank" style="text-decoration:none;color: #2878ff;">访问Mantunsci官方网站</a></div>
      <!-- <i-header-i18n /> -->
    </div>
    <Row style="height: 100%">
      <Col span="10" />
      <Col span="14">
        <div class="page-account-container">
          <div class="login">
            <div class="login-title">登录</div>
            <Form ref="formInline" :model="formInline">
                <Input class="us" name="loginName" value="" v-model="formInline.user" />
                <Input class="us" type="password" name="password" value="" v-model="formInline.password" enter-to-submit />
                <FormItem v-if="checkCodeAreaShow" >
                    <div style="display:flex">
                        <Input class="us" name="loginName" value="" v-model="formInline.code" style="margin-right:10px" />
                        <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                            <img id="imgIdentifyingCode" :src="identifyingCode" style="height:33px; width: 100px; cursor: pointer;" alt="点击更换" title="点击更换" />
                        </div>
                    </div>

                </FormItem>
                <div class="subBnt">
                    <Button class="V5Btn" @click="handleSubmit('2')">登录顿雾系统</Button>
                    <img src="../../../assets/images/new.png" alt="">
                </div>
                <div class="V3Btn" style="margin-top: 20px;" @click="handleSubmit('1')">登录曼顿云平台2021版</div>
            </Form>

                <!-- <Login @on-submit="handleSubmit" >
                <UserName class="us" name="loginName" value=""/>
                <Password class="us" name="password" value="" enter-to-submit />
                <Captcha
                  class="demo-login-captcha"
                  name="checkCode"
                  :count-down="0"
                  @on-get-captcha="handleGetCaptcha"
                  v-if="checkCodeAreaShow"
                >
                  <img
                    slot="text"
                    :src="'/portal/getCode.as?randomStr=' + randomStr"
                  />
                </Captcha>
              <Submit>登录曼顿云平台2021版本</Submit>
              <div class="subBnt">
                <Submit>登录顿雾系统</Submit>
                <img src="../../../assets/images/new.png" alt="">
              </div>

            </Login> -->

          </div>
        </div>
      </Col>
    </Row>
    <Row class="proAppClass">
        <Col class="proImg">
            <img src="@/assets/images/proApp.png" alt="">
        </Col>
    </Row>
    <i-copyright :loginObj="loginObj" />
  </div>
</template>
<script>
    import iCopyright from '@/components/copyright';
    import { mapActions } from 'vuex';
    // import store from '@/store';
    import mixins from '../mixins';
    import { JSEncrypt } from 'jsencrypt';
    // import { switchToProject } from '@/api/console/project.js';
    import {
        getBpk,
        getindividual
        // getGblinfo,
        // getProject,
        // loginRedirect
    } from '@/api/account';

    export default {
        mixins: [mixins],
        components: { iCopyright },
        data () {
            return {
                randomStr: new Date().getTime(),
                checkCodeAreaShow: false,
                loginObj: {},
                formInline: {
                    user: '',
                    password: '',
                    code: ''
                },
                identifyingCode: `${'/portal/getCode.as?randomStr=' + this.randomStr}`
            };
        },
        methods: {
            ...mapActions('admin/account', ['login']),
            handleGetCaptcha () {
                this.randomStr = new Date().getTime();
            },
            // 登录页面个性化
            handleindividual () {
                getindividual().then((r) => {
                    this.loginObj = r.data.login.footer;
                });
            },

            initBpk () {
                getBpk().then((r) => {
                    this.bpk = r.data;
                });
            },
            handleSubmit (val) {
                if (val === '2') {
                    const encry = new JSEncrypt();
                    window.sessionStorage.setItem('password', this.formInline.password);
                    encry.setPublicKey(this.bpk.pubkey);
                    this.login({
                        loginName: this.formInline.user,
                        password: encry.encrypt(this.formInline.password),
                        checkCode: this.formInline.code
                    }).then((r) => {
                        if (r.code === '0') {
                            this.$router.replace({ path: '/loading' });
                        } else {
                            this.$Message.error(r.message);
                            this.checkCodeAreaShow = true;
                            this.getIdentifyingCode(true)
                            this.handleGetCaptcha();
                        }
                    // 重定向对象不存在则返回顶层路径
                    });
                } else {
                    const encry = new JSEncrypt();
                    window.sessionStorage.setItem('password', this.formInline.password);
                    encry.setPublicKey(this.bpk.pubkey);
                    this.login({
                        edition: 'ESTATE_V3',
                        loginName: this.formInline.user,
                        password: encry.getKey().encrypt(this.formInline.password),
                        checkCode: this.formInline.code,
                        authLoginFlag: 'V3'
                    }).then((r) => {
                        if (r.code === '0') {
                            if (window.location.host === 'v5.sndtest.com' || window.location.host === 'localhost:8080') {
                                window.location.href = 'https://v3.sndtest.com/portal/valid/token.as?accessToken=' + r.data.accessToken
                            } else {
                                window.location.href = 'https://v3.snd02.com/portal/valid/token.as?accessToken=' + r.data.accessToken
                            }
                        } else {
                            this.checkCodeAreaShow = true;
                            this.getIdentifyingCode(true)
                            this.handleGetCaptcha();
                            this.$Message.error(r.message);
                        }
                    // 重定向对象不存在则返回顶层路径
                    });
                }
            },
            getIdentifyingCode (bRefresh) {
                if (bRefresh) {
                    this.identifyingCode = `${'/portal/getCode.as?randomStr=' + this.randomStr}`
                }
                console.log(this.identifyingCode);
            }
            /**
             * @description 登录
             * 表单校验已有 iView Pro 自动完成，如有需要修改，请阅读 iView Pro 文档
             */
            // handleSubmit (valid, values, val) {
            //     console.log(this.formInline.user);
            //     if (valid) {
            //         const { loginName, password, checkCode } = values;
            //         const encry = new JSEncrypt();
            //         window.sessionStorage.setItem('password', password);
            //         encry.setPublicKey(this.bpk.pubkey);
            //         this.login({
            //             loginName,
            //             password: encry.encrypt(password),
            //             checkCode
            //         }).then((r) => {
            //             if (r.code === '0') {
            //                 this.handlelinfo();
            //                 this.handleProject();
            //                 store.commit('realName', r.data.info.name);
            //                 store.commit('devHis', true);
            //                 // 如果只有一个项目，登录跳转重定向
            //                 loginRedirect()
            //                     .then((res) => {
            //                         if (res.success) {
            //                             if (res.data.targetProjectCode === '') {
            //                                 this.$router.replace(
            //                                     this.$route.query.redirect || '/visualScreen'
            //                                 );
            //                             } else {
            //                                 store.commit('projectCode', res.data.targetProjectCode);
            //                                 switchToProject({
            //                                     projectCode: res.data.targetProjectCode
            //                                 })
            //                                     .then((res) => {
            //                                         if (res.success) {
            //                                             store.commit('prjTitle', res.data.prjTitle);
            //                                             this.$router.replace({ path: '/console/project' });
            //                                         }
            //                                     })
            //                             }
            //                         }
            //                     })
            //             } else {
            //                 this.checkCodeAreaShow = true;
            //                 this.handleGetCaptcha();
            //                 this.$Message.error(r.message);
            //             }
            //             // 重定向对象不存在则返回顶层路径
            //         });
            //     }
            // }
        },
        watch: {
            identifyingCode: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.handleGetCaptcha()
                    }
                }
            }
        },
        created () {},
        mounted () {
            this.initBpk();
            this.handleindividual();
        }
    };
</script>
<style lang="less" scoped>
.us{
    margin-bottom: 24px;
}
.vertical{
    height: 20px;
    width: 1px;
    background: #fff;
    margin-left: 10px;
}
.setText{
    font-size: 14px;
    color: #fff;
    background: rgba(118, 165, 241, 0.2);
    border: 1px solid #fff;
    padding: 3px 10px;
    border-radius: 20px;
    margin-left: 10px;
    height: 24px;
    line-height: 17px;
}
.V5Btn{
    width: 100%;
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
    height: 40px;
    padding: 0 15px;
    font-size: 16px;
    border-radius: 4px;
    &:hover{
        color: #fff;
        background: rgba(45, 140, 240, 0.9);
    }
}
.V3Btn{
    width: 100%;
    color: #2d8cf0;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
}
.subBnt{
    position: relative;
    img{
        position: absolute;
        right: 0;
        top: 0;
    }
}
.proAppClass{
    width: 100%;
    justify-content: center;
    margin-bottom: 20px;
    .proImg{
        width: 170px;
        img{
            width: 100%;
        }
    }
}
</style>
