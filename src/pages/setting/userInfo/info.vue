<template>
  <div>
    <h2>基本资料</h2>
    <Form
      ref="form"
      :model="data"
      :rules="rules"
      label-position="top"
      class="ivu-mt"
    >
      <Row type="flex" :gutter="48">
        <Col v-bind="grid1">
          <FormItem label="头像" prop="avatar">
            <Avatar
              :src="data.avatar"
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
            <Input disabled v-model="data.accont" />
          </FormItem>
          <FormItem label="登录密码" prop="password">
            <Input
              type="password"
              v-model="data.password"
              placeholder="请输入密码"
            />
          </FormItem>
          <FormItem label="真实姓名" prop="name">
            <Input v-model="data.name" placeholder="请输入姓名" />
          </FormItem>
          <FormItem label="手机号码" type="number" prop="phoneNumber">
            <Input
              v-model="data.phoneNumber"
              maxlength="11"
              placeholder="请输入公司"
            />
          </FormItem>
          <FormItem label="固定电话" prop="fixPhone">
            <Input v-model="data.fixPhone" size="medium" />
            <Input v-model="data.fixPhone" />
          </FormItem>
          <FormItem label="邮箱地址" prop="mail">
            <Input v-model="data.mail" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit">保存</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
    export default {
        data () {
            return {
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
                data: {
                    accont: 'abc',
                    avatar:
                        'https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar',
                    name: 'Aresn',
                    password: 'aresn@iview.design',
                    desc: '',
                    phoneNumber: 'TalkingData',
                    fixPhone: '110000'
                },
                rules: {
                    name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                    mail: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        {
                            required: true,
                            type: 'email',
                            message: '请输入正确的邮箱',
                            trigger: 'blur'
                        }
                    ],
                    phoneNumber: [
                        { required: true, message: '请输入公司', trigger: 'blur' }
                    ],
                    fixPhone: [
                        { required: true, message: '请选择居住地', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            handleSubmit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$Message.success('信息更新成功!');
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
