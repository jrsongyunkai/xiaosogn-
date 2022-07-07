<template>
  <div>
    <h3>告警名称修改</h3>
    <Divider orientation="left">报警</Divider>
    <Row>
      <Form :model="form" inline>
        <FormItem v-for="(item, index) in inputList" :key="index">
          <Row>
            <Col :span="12">
              <Input
                size="small"
                clearable
                v-model="item.info"
                @on-blur="handleOk(item, 'alarm', index)"
              ></Input>
            </Col>
            <Col :span="1"> </Col>
            <Col :span="6"
              ><Button
                size="small"
                type="primary"
                @click="handleReset(item, 'alarm')"
                >重置</Button
              >
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Row>

    <Divider orientation="left">预警</Divider>
    <Row>
      <Form :model="forms" inline>
        <FormItem v-for="(item, index) in inputList2" :key="index">
          <Row>
            <Col :span="12">
              <Input
                size="small"
                clearable
                v-model.trim="item.info"
                @on-blur="handleOk(item, 'warn')"
              ></Input>
            </Col>
            <Col :span="1"> </Col>
            <Col :span="6"
              ><Button
                size="small"
                type="primary"
                @click="handleReset(item, 'warn')"
                >重置</Button
              >
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Row>
    <Row>
      <Col
        ><Button size="small" @click="handleSave" type="primary"
          >保存
        </Button></Col
      >
    </Row>
  </div>
</template>

<script>
    import {
        queryAlarms4Custom,
        resetCustomAlarm,
        saveCustomAlarms
    } from '@/api/public';
    export default {
        name: 'ProjectAlarmModification',
        data () {
            return {
                value1: 'value',
                form: {},
                forms: {},
                inputList: [],
                inputList2: [],
                changeList: []
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.queryConfig();
            },
            queryConfig () {
                let parmas = {
                    projectCode: this.$store.state.projectCode
                };
                queryAlarms4Custom(parmas)
                    .then((res) => {
                        this.inputList = res.data.alarms;
                        this.inputList2 = res.data.warns;
                        // store.commit('alarmForConfig', this.lists.concat(this.lists2));
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误请刷新重试'
                            });
                        }
                });
            },
            handleOk (item, type, index) {
                if (!item.info) {
                    this.$Message.error('名称不能为空');
                } else {
                    this.changeList.push(item);
                }
            },
            handleSave () {
                let parmas = {
                    projectCode: this.$store.state.projectCode,
                    customAlarm: JSON.stringify(this.changeList)
                };
                saveCustomAlarms(parmas)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.$nextTick(() => {
                                this.changeList = [];
                            });
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误请刷新重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误请刷新重试'
                            });
                        }
                });
            },
            handleReset (item, type) {
                //
                let parmas = {
                    typeNumber: item.typeNumber
                };
                resetCustomAlarm(parmas)
                    .then((res) => {
                        if (type === 'alarm') {
                            item.info = res.data;
                        } else {
                            item.info = res.data;
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
            }
        }
    };
</script>

<style></style>
