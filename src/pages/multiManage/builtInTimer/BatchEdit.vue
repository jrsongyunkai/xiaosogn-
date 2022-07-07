<template>
    <div id="BatchEdit">
      <Table
        class="mb-20 device-wrap"
        :data="options"
        :columns="columns"
        max-height="280"
        :header-cell-style="{ 'text-align': 'center' }"
        style="width: 100%">

          <template slot-scope="{row}" slot="mac">
            <div>{{ row.mac }}</div>
            <div>{{ row.others.name }}</div>
          </template>
          <template slot-scope="{row}" slot="others.address">
            <div>{{ row.others.address}}</div>
          </template>
        <template slot-scope="{row,index}" slot="others.titles">
          <Button type="text" class="mr-15 tl" @click="handleLine(row, index)">+选择线路</Button>
          <Tag
            v-show="row.others.titles.length > 0"
            v-for="(tag, index) in row.others.titles"
            :key="index"
            :closable='true'
            @on-close="handleCloseTag(index, row)">
            {{tag}}
          </Tag>
        </template>
      </Table>
      <Form :model="form" :label-width="120" style="margin-top:20px">
        <FormItem label="定时类型:">
          <Select :clearable='true' v-model="form.type" @on-change="handleChangeType" style="width:200px">
            <Option :label="item.label" v-for="item in timingOptions" :key="item.value" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="执行时间:">
          <DatePicker
            v-if="form.type === 1"
            :value="form.time"
            style="width:199px"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :clearable="false"
            type="datetime"
            placeholder="请选择日期时间">
          </DatePicker>
          <TimePicker
            v-if="form.type === 2"
            style="width:199px"
            :value="form.time"
            format="HH:mm"
            value-format="HH:mm:ss"
            :editable="false"
            :clearable="false"
            placeholder="任意时间点">
          </TimePicker>
        </FormItem>
        <FormItem v-if="form.type === 2" label="选择重复:">
          <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" @on-change="handleCheckAllChange">全选</Checkbox>

          <CheckboxGroup v-model="form.weekday" @on-change="handleCheckedTypesChange">
            <Checkbox v-for="item in weekDays"  :label="item.value" :key="item.value">{{item.label}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="执行动作:">
          <Select :clearable='true' v-model="form.action" style="width:200px">
            <Option
              v-for="item in actions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button class="b-blue" @click="onSubmit" style="margin-right: 10px;">保存</Button>
          <Button @click="handleCancel">取消</Button>
        </FormItem>
      </Form>
      <Modal title="线路列表" v-model="lineVisible"  width="60%" append-to-body>
        <LineList :mac="lineMac" :tags="tags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>

<script>
    import LineList from '../../Common/LineList.vue'
    import { batchModifyTiming } from '@/api/multiManage/builtlnTimer'
    export default {
        components: { LineList },
        props: {
            options: {
                type: [Object, Array],
                default () {
                    return []
                }
            }
        },
        data () {
            return {
                form: {
                    type: '',
                    time: '',
                    weekday: [],
                    action: ''
                },
                lineMac: '',
                tags: [],
                index: 0,
                timingOptions: [
                    {
                        value: 1,
                        label: '单次定时'
                    },
                    {
                        value: 2,
                        label: '循环定时'
                    }
                ],
                isIndeterminate: false,
                checkAll: false,
                lineVisible: false,
                weekDays: [
                    {
                        value: '日',
                        label: '日'
                    },
                    {
                        value: '一',
                        label: '一'
                    },
                    {
                        value: '二',
                        label: '二'
                    },
                    {
                        value: '三',
                        label: '三'
                    },
                    {
                        value: '四',
                        label: '四'
                    },
                    {
                        value: '五',
                        label: '五'
                    },
                    {
                        value: '六',
                        label: '六'
                    }
                ],
                actions: [
                    {
                        value: 1,
                        label: '合闸'
                    },
                    {
                        value: 2,
                        label: '分闸'
                    }
                ],
                columns: [
                    {
                        title: '设备号',
                        slot: 'mac',
                        align: 'center'
                    },
                    {
                        title: '地点',
                        slot: 'others.address',
                        align: 'center'
                    },
                    {
                        title: '线路',
                        slot: 'others.titles',
                        align: 'center'
                    }
                ]
            }
        },
        mounted () {

        },
        methods: {
            handleChangeType (val) {
                this.form.type = val
                if (this.form.type === 1) {
                    this.form.time = this.$func.getNowFormatDateTime()
                } else {
                    this.form.time = this.$func.getNowFormatDateTime('time')
                }
            },
            handleCheckAllChange (val) {
                this.form.weekday = val ? ['日', '一', '二', '三', '四', '五', '六'] : []
                this.isIndeterminate = false
            },
            handleCheckedTypesChange (value) {
                let checkedCount = value.length
                this.checkAll = checkedCount === this.weekDays.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekDays.length
            },
            onSubmit () {
                let typeMsg = '命令已提交，生效中..'
                if (this.form.time === '' || this.form.action === '') {
                    this.$Message.error({
                        content: '内容未填写完整'
                    })
                    return
                }
                if (this.form.type === 2 && this.form.weekday.length === 0) {
                    this.$Message.error({
                        content: '内容未填写完整'
                    })
                    return
                }
                let addrs = this.options.map(element => {
                    return element.channelAddrs.join(',')
                })
                let macs = this.options.map(element => {
                    return element.mac
                })
                let autoIds = this.options.map(element => {
                    return element.autoId
                })
                let operates = this.options.map(element => {
                    return 4 + ':' + element.autoId
                })
                let week = this.form.weekday.map(element => {
                    return element
                })
                let time = ''
                if (this.form.time.length === 8 || 19) {
                    let arr = this.form.time.split(':')
                    time = arr.pop()
                    time = arr.join(':')
                }

                let parmas = {
                    macs: macs.join('_'),
                    channels: addrs.join('_'),
                    autoids: autoIds.join('_'),
                    weekDay: week.join(''),
                    time: time,
                    status: this.form.action,
                    _operate_at: operates.join('_')
                }
                batchModifyTiming(parmas)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            })
                        } else if (res.code === '-1') {
                        } else {
                            let errMsg = (res.data !== undefined && res.data.length > 0) ? res.data.split('<br/>').map((item) => {
                                if (item.indexOf(':0') !== -1) {
                                    item = item.split(':0').join('')
                                    return `<div style="color: #67C23A">${item + ':\xa0' + typeMsg}</div>`
                                } else {
                                    return `<div style="color: #F56C6C">${item}</div>`
                                }
                            }) : res.message
                            this.$Modal.error({
                                content: (res.data !== undefined && res.data.length > 0) ? errMsg.join('\n') : errMsg
                            })
                        }
                    })
                this.$emit('closeBatchEdit', true)
            },
            handleCancel () {
                this.$emit('closeBatchEdit', true)
            },
            receiveChannels (val) {
                this.options[this.index].channelAddrs = val.map(item => {
                    return item.addr
                })
                this.options[this.index].others.titles = val.map(item => {
                    return item.title
                })
                this.lineVisible = false
                this.$Message.success({
                    content: '保存成功'
                })
            },
            handleLine (row, index) {
                this.tags = []
                this.tags = row.channelAddrs.map((item, index) => {
                    return {
                        addr: item,
                        title: row.others.titles[index]
                    }
                })
                this.index = index
                this.lineVisible = true
                this.lineMac = row.mac
            },
            handleCloseTag (index, row) {
                row.others.titles.splice(index, 1)
                row.channelAddrs.splice(index, 1)
            }
        },
        watch: {}
    }
</script>
