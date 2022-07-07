<template>
  <ol>
    <Form>
      <FormItem label="设备设定:">
        <Tooltip class="item" effect="light" content="刷新列表" placement="top">
          <Button type="text" :style="{ fontSize: '18px', color: '#fff' }"  @click="queryList"><i class="icon-v5 icon-v5-shuaxin"></i></Button>
        </Tooltip>
        <Tooltip class="item" effect="light" content="反查开关信息" placement="top">
          <Button type="text" :style="{ fontSize: '18px', color: '#fff' }"  @click="handleReportInformation('ZH_LORA_O_GET_TYPE_1')"><i class="icon-v5 icon-v5-open"></i></Button>
        </Tooltip>
        <Tooltip class="item" effect="light" content="反查节点信息" placement="top">
          <Button type="text" :style="{ fontSize: '18px', color: '#fff' }"  @click="handleReportInformation('ZH_LORA_O_GET_TYPE_2')"><i class="icon-v5 icon-v5-s-operation"></i></Button>
        </Tooltip>
      </FormItem>
      <FormItem v-for="(value, index) in datas" :key="index" :label="'线路' + (value.addr + 1) + '：'">
        <ol :span="4">
          开启时间:
          <span v-if="lineIndex !== index + '-openTime'" @mouseover="handleOver(index, 'openTime')" @mouseout="lineIndex = -1">{{ value.openTime }}</span>
          <TimePicker
            v-if="lineIndex === index + '-openTime'"
            v-model="value.openTime"
            format="HH:mm"
            class="component-width"
            value-format="HH:mm"
            :editable="false"
            :clearable="false"
            size="small"
            @change="handleChange(value.mac, 'ZH_LORA_O_TIMED_OPEN_AND_OFF', value.openTime, value.closeTime)"
            placeholder="任意时间点"
            >
          </TimePicker>
        </ol>
        <ol :span="4">
         关闭时间:
          <span v-if="lineIndex !== index + '-closeTime'" @mouseover="handleOver(index, 'closeTime')" @mouseout="lineIndex = -1">{{ value.closeTime }}</span>
          <TimePicker
            v-if="lineIndex === index + '-closeTime'"
            v-model="value.closeTime"
            format="HH:mm"
            class="component-width"
            value-format="HH:mm"
            :editable="false"
            :clearable="false"
            size="small"
            @change="handleChange(value.mac, 'ZH_LORA_O_TIMED_OPEN_AND_OFF', value.openTime, value.closeTime)"
            placeholder="任意时间点"
            >
          </TimePicker>
        </ol>
        <ol :span="4">
         上报周期:
          <span v-if="lineIndex !== index + '-reportCycle'" @mouseover="handleOver(index, 'reportCycle')" @mouseout="lineIndex = -1">{{ value.reportCycle }}</span>
          <Input
            v-if="lineIndex === index + '-reportCycle'"
            class="component-width"
            @blur="handleReporting(value.mac, 'ZH_LORA_O_PERIOD_AND_DELAY', value.reportCycle, value.reportDelay)"
            @keyup.enter.native="$event.target.blur"
            v-model.number="value.reportCycle"
            autocomplete="off"
            size="small"
          ></Input>
          <span>(min)</span>
        </ol>
        <ol :span="4">
          上报延时:
          <span v-if="lineIndex !== index + '-reportDelay'" @mouseover="handleOver(index, 'reportDelay')" @mouseout="lineIndex = -1">{{ value.reportDelay }}</span>
          <Input
            v-if="lineIndex === index + '-reportDelay'"
            class="component-width"
            @blur="handleReporting(value.mac, 'ZH_LORA_O_PERIOD_AND_DELAY', value.reportCycle, value.reportDelay)"
            @keyup.enter.native="$event.target.blur"
            v-model.number="value.reportDelay"
            autocomplete="off"
            size="small"
          ></Input>
          <span>(ms)</span>
        </ol>
      </FormItem>
    </Form>
  </ol>
</template>
<script>
    import { zhloraQueryBoxConfig, zhloraCmd } from '@/api/control/index'
    export default {
        data () {
            return {
                datas: [],
                lineIndex: -1
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                this.queryList()
            },
            queryList () {
                let params = {
                    mac: this.$route.query.param.mac,
                    addr: this.$route.query.param.addr
                }
                zhloraQueryBoxConfig(params)
                    .then(res => {
                        if (res.success) {
                            this.datas = res.data
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                })
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
                    .finally(() => {
                        this.lineIndex = -1
                    })
            },
            handleReportInformation (cmd) {
                let params = {
                    mac: this.$route.query.param.mac,
                    cmd: cmd
                }
                zhloraCmd(params)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            })
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                })
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
                this.lineIndex = -1
            },
            handleOver (index, name) {
                this.lineIndex = index + '-' + name
            },
            handleChange (mac, cmd, openTime, closeTime) {
                let params = {
                    mac: mac,
                    cmd: cmd,
                    openTime: openTime,
                    closeTime: closeTime
                }
                zhloraCmd(params)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            })
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                })
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
                this.lineIndex = -1
            },
            handleReporting (mac, cmd, reportCycle, reportDelay) {
                let params = {
                    mac: mac,
                    cmd: cmd,
                    reportCycle: reportCycle,
                    reportDelay: reportDelay
                }
                zhloraCmd(params)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            })
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                })
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
                this.lineIndex = -1
            }
        }
    }
</script>
<style lang="less" scoped>
.component-width{
   width: 95px;
}

</style>
