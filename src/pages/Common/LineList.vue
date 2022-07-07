<template>
  <Row class="row">
    <div class="checkbox-group">
      <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" @on-change="handleCheckAllChange">全选</Checkbox>
      <div style="margin: 15px 0;"></div>
      <CheckboxGroup v-model="checkedLines" @on-change="handleCheckedLinesChange">
        <Checkbox v-for="(item,index) in lines" :label="item.addr + '-' +  item.title" :key="index">{{ item.title }}</Checkbox>
      </CheckboxGroup>
    </div>
    <Row class="mt-20" v-if="source === 'BuiltInTiming'">
      <Col :span="22" v-show="false">
        <Button style="float: right" class="mr-20" @click="handleBuiltInTimingBack">返回</Button>
      </Col>
      <Col :span="24" class="tr">
        <Button class="fr" :disabled="checkedLines.length === 0" type="primary" @click="handleBuiltInTimingSave">保 存</Button>
      </Col>
    </Row>
    <Row class="mt-20" v-if="source === 'DetectionRules'">
      <Col :span="22" style="text-align: right;">
        <Button style="float: right" class="mr-20" @click="handleBack">返回</Button>
      </Col>
      <Col :span="22">
        <Button :disabled="checkedLines.length === 0" type="primary" @click="handleSave">保 存</Button>
      </Col>
    </Row>
  </Row>
</template>
<script>
    import { queryChannels, saveDeStatuscanConfDetail } from '@/api/common'
    export default {
        props: {
            mac: {
                type: String,
                default () {
                    return ''
                }
            },
            source: {
                type: String,
                default () {
                    return ''
                }
            },
            tags: {
                type: [Object, Array]

            }
        },
        data () {
            return {
                checkedLines: [],
                checkAll: false,
                isIndeterminate: true,
                lines: []
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                if (this.mac) {
                    this.queryList()
                } else {
                    const lineLists = [...(Array(29).keys())].map((item) => {
                        return { addr: item + 1, title: item === 0 ? '总路' : '线路' + item }
                    })
                    this.lines = lineLists
                }
            },
            queryList () {
                queryChannels({ mac: this.mac })
                    .then(res => {
                        if (res.success) {
                            this.lines = res.datas
                            this.checkedLines = this.tags.map((item) => { return item.addr + '-' + item.title })
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
            },
            handleCheckAllChange (val) {
                let datas = []
                if (val) this.lines.map((item) => { datas.push(item.addr + '-' + item.title) })
                this.checkedLines = val ? datas : []
                this.isIndeterminate = false
            },
            handleCheckedLinesChange (value) {
                let checkedCount = value.length
                this.checkAll = checkedCount === this.lines.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.lines.length
            },
            handleSave () {
                let chnls = []
                let chnlNames = []
                let val = null
                this.checkedLines.map((item) => {
                    val = item.split('-')
                    chnls.push(val[0])
                    chnlNames.push(val[1])
                })
                let params = {
                    mac: this.mac ? this.mac : 'all',
                    ruleId: this.$store.state.ruleId,
                    chnls: chnls.join(','),
                    chnlNames: chnlNames.join('，')
                }
                saveDeStatuscanConfDetail(params)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: '保存成功'
                            })
                            this.$parent.$parent.handleLineClose()
                            this.$parent.$parent.handleLineListClose()
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
            },
            handleBack () {
                this.$parent.$parent.handleLineClose()
            },
            handleBuiltInTimingSave () {
                let channel = []
                let val = null
                this.checkedLines.map((item) => {
                    val = item.split('-')
                    channel.push({ addr: val[0], title: val[1] })
                })
                this.$emit('sendChannels', channel)
            },
            handleBuiltInTimingBack () {
                let channel = []
                this.$emit('sendChannels', channel)
            }
        }
    }
</script>
<style lang="less" scoped>
.row{
    display: flex;
    flex-direction: column;
}
.checkbox-group{
     .CheckboxGroup{
        label{
            width :calc(17.4% - 30px);
            margin-left :0;
        &:nth-child(6n){
            width: auto;
        }

     }
    }
}
.tr{
    Button{
        margin: 5px;
    }
}
</style>
