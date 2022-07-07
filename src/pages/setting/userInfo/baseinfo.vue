<template>
  <div>
    <h2>基本资料</h2>
    <Form
      ref="datas"
      :model="datas"
      :rules="rules"
      label-position="top"
      class="ivu-mt"
    >
      <Row type="flex" :gutter="48">
        <Col v-bind="grid1">
          <FormItem label="头像" prop="avatar">
            <!-- <Avatar
              :src="datas.avatar"
              class="setting-account-info-avatar"
              shape="square"
            /> -->
             <Avatar
              :src="user"
              class="setting-account-info-avatar"
              shape="square"
            />
            <Upload
              action="//jsonplaceholder.typicode.com/posts/"
              class="ivu-mt ivu-mb"
            >
              <Button icon="md-camera">更换头像</Button>
            </Upload>
          </FormItem>
        </Col>
        <Col v-bind="grid2">
          <FormItem label="登录账号" prop="accont">
            <Input disabled v-model="datas.accont" />
          </FormItem>
          <FormItem label="登录密码" prop="password">
            <div style="display: flex">
              <Input
                type="password"
                v-model="datas.password"
                style="width: 50%"
                :disabled="passwordDisabled"
                @on-blur="updatePass"
                @on-enter="updatePass"
              />
              <Button
                type="text"
                style="margin-left: 20px; color: #1890ff"
                @click="updatePassword"
                >修改</Button
              >
            </div>
          </FormItem>
          <FormItem label="真实姓名" prop="realName">
            <Input v-model="datas.realName" placeholder="请输入姓名" />
          </FormItem>
          <FormItem label="手机号码" type="number" prop="phoneNumber">
            <Input
              v-model="datas.phoneNumber"
              maxlength="11"
              placeholder="请输入手机号码"
            />
          </FormItem>
          <FormItem label="固定电话" prop="fixPhone">
            <div style="display: flex">
              <Input
                v-model.number="datas.fixPhone"
                maxlength="4"
                style="width: 20%"
              />
              <Input
                v-model="datas.lastPhone"
                maxlength="8"
                style="width: 60%; margin-left: 20px"
              />
            </div>
          </FormItem>
          <FormItem label="邮箱地址" prop="mail">
            <Input v-model="datas.mail" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('datas')">保存</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
    import { findStaffInfo, updateStaffInfo, chgPwd } from '@/api/public';
    import store from '@/store/index';
    //  import { JSEncrypt } from 'jsencrypt'
    export default {
        name: 'baseinfo',
        data () {
            return {
                passwordDisabled: true,
                user: require('../../../assets/images/user.png'),
                grid1: {
                    xl: {
                        span: 12,
                        order: 2
                    },
                    lg: {
                        span: 24,
                        order: 1
                    },
                    md: {
                        span: 24,
                        order: 1
                    },
                    sm: {
                        span: 24,
                        order: 1
                    },
                    xs: {
                        span: 24,
                        order: 1
                    }
                },
                grid2: {
                    xl: {
                        span: 12,
                        order: 1
                    },
                    lg: {
                        span: 24,
                        order: 2
                    },
                    md: {
                        span: 24,
                        order: 2
                    },
                    sm: {
                        span: 24,
                        order: 2
                    },
                    xs: {
                        span: 24,
                        order: 2
                    }
                },
                datas: {
                    accont: '',
                    avatar:
                        'https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar',
                    realName: '',
                    password: this.$store.state.password, // 待登录页将登录密码存在vuex中
                    mail: '',
                    phoneNumber: '',
                    fixPhone: '',
                    lastPhone: ''
                },
                oldPassword: '',
                rules: {
                    name: [
                        {
                            message: '请输入昵称',
                            trigger: 'blur'
                        }
                    ],
                    password: [{ message: '请输入昵称', trigger: 'blur' }],
                    mail: [
                        { message: '请输入邮箱', trigger: 'blur' },
                        {
                            // required: true,
                            type: 'email',
                            message: '请输入正确的邮箱',
                            trigger: 'blur'
                        }
                    ],
                    phoneNumber: [
                        {
                            message: '码冲冲冲',
                            trigger: 'blur'
                        }
                    ],
                    fixPhone: [
                        {
                            pattern: /^(\d{4})$/,

                            message: '请输入正确的固定电话',
                            trigger: 'change'
                        }
                    ],
                    lastPhone: [
                        {
                            pattern: /^(\d{6-8})$/,

                            message: '请输入正确的固定电话',
                            trigger: 'change'
                        },
                        { max: 8, message: '请输入正确的固定电话' }
                    ]
                }
            };
        },
        created () {
            this.handlePassword();
            this.datas.password = sessionStorage.getItem('password');
            // sessionStorage.setItem('password', this.datas.password);

            this.oldPassword = this.datas.password;
        },
        mounted () {
            // this.datas.password = sessionStorage.getItem('password');
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        updateStaffInfo({
                            realName: this.datas.realName,
                            loginName: this.datas.accont,
                            mobile: this.datas.phoneNumber,
                            email: this.datas.mail,
                            telephone: this.datas.fixPhone + this.datas.lastPhone
                        }).then((res) => {
                            if (res.success) {
                                this.$Message.success('信息更新成功!');
                                store.commit('realName', this.datas.realName);
                            } else {
                                if (res.message) {
                                    this.$Message.error({
                                        content: res.message
                                    });
                                } else {
                                    this.$Message.error({
                                        content: '未知错误，请刷新重试'
                                    });
                                }
                            }
                        });
                    } else {
                        this.$Message.error('请输入正确格式');
                    }
                });
            },
            updatePassword () {
                this.passwordDisabled = false;
            },
            updatePass () {
                if (!this.datas.password) {
                    this.$Message.warning('修改失败,密码不能为空');
                } else {
                    this.passwordDisabled = true;
                    //  const encry = new JSEncrypt()
                    let newpassword = this.datas.password;
                    let params = { oriPwd: sessionStorage.getItem('password'), newPwd: newpassword };
                    chgPwd(params).then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '修改密码成功'
                            });

                            this.datas.password = newpassword;
                            sessionStorage.setItem('password', this.datas.password);
                            this.passwordDisabled = false;
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                        }
                    });
                }
            },
            handlePassword () {
                findStaffInfo()
                    .then((res) => {
                        if (res.success) {
                            this.datas.accont = res.data.loginName;
                            this.datas.realName = res.data.realName;
                            this.datas.phoneNumber = res.data.mobile;
                            this.datas.fixPhone = res.data.telephone.substr(0, 4);
                            this.datas.lastPhone = res.data.telephone.substr(4);
                            this.datas.mail = res.data.email;
                            // this.informationForm = res.data;
                            // this.informationFlag = true;
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请重新刷新'
                            });
                        }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
.setting-account-info {
  &-avatar {
    width: 90px;
    height: 90px;
  }
}
</style>
