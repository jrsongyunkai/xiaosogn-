<template>
  <div>
      <div class="title">
          提示：项目服务指向将会对项目内设备所有的设备进行批量的服务指向修改
      </div>
    <h3>配置服务指向</h3>
    <Form ref="form" :model="form">
      <FormItem label="状态">
        <RadioGroup v-model="form.serverPointStatus">
          <Radio :label="1">启用</Radio>
          <Radio :label="0">禁用</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="新指向类型">
        <Select
        :clearable='true'
          :disabled="form.serverPointStatus === 0"
          v-model="serverPoint[0]"
          style="width: 200px"
          placeholder="请选择"
        >
          <Option
            v-for="item in options"
            :value="item.value"
            :label="item.label"
            :key="item.value"
          ></Option>
        </Select>
      </FormItem>
      <FormItem label="新指向(UDP)">
        <Input
          v-model="serverPoint[1]"
          :disabled="form.serverPointStatus === 0"
          placeholder="格式举例 '192.168.1.1:7758', 'sample.com:7758'"
        ></Input>
      </FormItem>
      <FormItem label="新指向(HTTP)">
        <Input
          v-model="serverPoint[2]"
          :disabled="form.serverPointStatus === 0"
          placeholder="格式举例 '192.168.1.1:8080/data/carry', 'sample.com:8080/data/carry'"
        ></Input>
      </FormItem>
      <FormItem>
        <Button size="small" @click="handleSave" type="primary">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
// id 待后端完善
    import { findProject, saveServerPoint } from '@/api/public';
    export default {
        name: 'configurings',
        data () {
            return {
                form: { serverPointStatus: 0 },
                serverPoint: ['0', '', ''],
                // immediate: false,
                options: [
                    {
                        label: 'IP',
                        value: '0'
                    },
                    {
                        label: '域名',
                        value: '1'
                    }
                ],
                prjId: window.sessionStorage.getItem('prjId')
            };
        },
        created () {},
        methods: {
            queryInfo () {
                let prjId = this.prjId
                findProject({ id: prjId })
                    .then((res) => {
                        if (res.success) {
                            this.form = res.data;
                            if (res.data.serverPoint) {
                                this.serverPoint = res.data.serverPoint.split(',');
                                if (this.serverPoint.length === 1) {
                                    this.serverPoint = ['0', this.serverPoint[0], ''];
                                }
                            }
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
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                    })
                    .finally(() => {});
            },
            handleSave () {
                let params = {
                    id: this.prjId,
                    serverPointStatus: this.form.serverPointStatus
                };
                if (this.form.serverPointStatus !== 0) {
                    params.isDomain = this.serverPoint[0];
                    params.address1 = this.serverPoint[1];
                    params.address2 = this.serverPoint[2];
                }
                saveServerPoint(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
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
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                    })
                    .finally(() => {});
            }
        },
        mounted () {
            this.queryInfo();
        }
    };
</script>

<style lang="less" scoped>
.title{
    background:rgba(121, 125, 139, 0.2);
    border: 1px solid #888b92;
    padding: 10px;
}
h3{
    margin-top: 10px;
}
</style>
