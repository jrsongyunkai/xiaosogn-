<template>
  <div id="edit">
    <Form :model="form" :label-width="80">
      <FormItem :label-width="0">
          <div style="display:flex">
          <div class="slot-label pointer">设备</div>
            <Button class="btn"  @click="handleDevice">点击选择</Button>
            <Input v-model="form.mac" readonly style="width:300px"></Input>
        </div>
      </FormItem>
      <FormItem v-show="form.mac" :label-width="0">
        <div style="display:flex;flex-wrap:wrap">
          <div class="slot-label pointer" >线路</div>
          <Button class="btn"  @click="handleLine">选择路线</Button>
          <Tag
            v-show="tag.title.length > 0"
            v-for="(tag, index) in tags"
            :key="index"
            :closable="true"
            @on-close="handleCloseTag(tag)">
            {{tag.title}}
          </Tag>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display:flex">
          <div class="slot-label pointer">类型</div>
          <Select  v-model="form.type" @on-change="handleChangeType" style="width:200px">
            <Option :label="item.label" v-for="item in timingOptions" :key="item.value" :value="item.value"></Option>
          </Select>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display:flex">
          <div class="slot-label pointer">时间</div>
        <DatePicker
          @on-change="startTimeChange"
          style="width:200px"
          v-if="form.type === 1"
          v-model="form.time"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :clearable="false"
          type="datetime"
          placeholder="请选择日期时间">
        </DatePicker>
        <TimePicker
          @on-change="startTimeChange"
          v-if="form.type === 2"
          v-model="nowTime"
          format ="HH:mm"
          :editable="false"
          :clearable="false"
          placeholder="任意时间点">
        </TimePicker>
        </div>
      </FormItem>
      <FormItem v-if="form.type === 2" :label-width="0">
         <div style="display:flex">
        <div class="slot-label pointer">重复</div>
        <Button class="btn"  @click="handleRepeat">点击选择</Button>
        <Tag
          v-for="tag in form.week"
          :key="tag"
           :closable="true"
          :disable-transitions="false"
          @on-close="handleRepeatClose(tag)">
          <span>{{ "周" + tag }}</span>
        </Tag>
         </div>
      </FormItem>
      <FormItem :label-width="0">
         <div style="display:flex">
        <div class="slot-label pointer">动作</div>
        <Select v-model="form.action" style="width:200px">
          <Option
            v-for="item in actions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </Option>
        </Select>
         </div>
      </FormItem>
      <FormItem class="tr">
        <Button class="b-blue" type="primary" @click="handleSubmit" :disabled="form.mac === '' || tags.length === 0 || (form.type === 2 && form.week.length === 0)">保 存</Button>
        <Button  @click="handleCancel">取 消</Button>
      </FormItem>
    </Form>
    <Modal id="equipment" title="添加设备线路" v-model="deviceVisible" width="75%" append-to-body>
        <Device source="BuiltInTiming" @sendBuiltInTimingMac="receiveBuiltInTimingMac"></Device>
    </Modal>
    <Modal title="线路列表" v-model="lineVisible" width="60%" append-to-body>
      <LineList :mac="form.mac" :tags="tags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
      <div slot="footer"></div>
    </Modal>
     <Modal title="选中重复" v-model="repeatFlag" append-to-body>
      <WeekSelection :options="form.week" @sendWeekSelection="receiveWeekSelection" @receive="receive"></WeekSelection>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
    import Device from '../../DetectionRules/Device.vue'
    import LineList from '../../Common/LineList.vue'
    import WeekSelection from '../../Common/WeekSelection'
    import { modifyTiming } from '@/api/multiManage/builtlnTimer'
    export default {
        props: {
            options: {
                type: Object,
                default () {
                    return []
                }
            }
        },
        data () {
            return {
                form: {
                    mac: this.options.mac,
                    type: this.options.weekday === '' ? 1 : 2,
                    time: this.options.time ? this.options.time : this.$func.getNowFormatDateTime(),
                    week: [...this.options.weekday],
                    action: this.options.status
                },
                nowTime: this.$Date().format('HH:mm'),
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
                actions: [
                    {
                        value: 'true',
                        label: '合闸'
                    },
                    {
                        value: 'false',
                        label: '分闸'
                    }
                ],
                deviceVisible: false,
                lineVisible: false,
                repeatFlag: false,
                tags: this.options.tags
            }
        },
        mounted () {

        },
        methods: {
            handleChangeType (val) {
                this.form.type = val
                if (val === 1) {
                    this.form.time = this.$func.getNowFormatDateTime()
                } else {
                    this.form.time = this.options.time ? this.options.time : this.$func.getNowFormatDateTime('time')
                }
            },
            handleDevice () {
                this.deviceVisible = true
            },
            handleLine () {
                this.lineVisible = true
            },
            handleRepeat () {
                this.repeatFlag = true
            },
            handleCancel () {
                this.$emit('closeEdit', false)
            },
            handleRepeatClose (tag) {
                this.form.week.splice(this.form.week.indexOf(tag), 1)
            },
            receiveWeekSelection (val) {
                this.form.week = val
                this.repeatFlag = false
            },
            receive (val) {
                this.repeatFlag = val
            },
            receiveBuiltInTimingMac (val) {
                this.form.mac = val
                this.tags = []
                this.deviceVisible = false
            },
            receiveChannels (val) {
                this.tags = val
                this.lineVisible = false
            },
            handleCloseTag (tag) {
                this.tags.splice(this.tags.indexOf(tag), 1)
            },
            startTimeChange (val) {
                this.form.time = val
            },
            handleSubmit () {
                let time = ''
                if (this.form.type === 1) {
                    time = this.form.time
                }
                if (this.form.type === 2) {
                    time = this.form.time

                    time = time.substring(time.length - 5, time.length)
                }
                let params = {
                    mac: this.form.mac,
                    autoid: this.options.autoid ? this.options.autoid : 0,
                    channel: this.tags.map((item) => { return item.addr }).join(','),
                    weekday: this.form.week.join(''),
                    time: time + ':00',
                    type: 1,
                    status: this.form.action,
                    _operate_at: 4 + ':' + this.options.autoid
                }
                modifyTiming(params)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            })
                            this.$emit('closeEdit', true)
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
            }

        },
        components: {
            Device,
            LineList,
            WeekSelection
        }
    }
</script>
<style lang="less" scoped>
#edit{
  .Form-item__label{
    color: #333;
  }

.el-tag .el-tag{
    margin-left :5px;
}
.slot-label{
  width: 80px;
  text-align: center;
}
.btn{
  background: rgba(0, 126, 255, 0.1);
  border: 1px solid #007EFF;
  border-radius: 5px;
  color: #007EFF;
  margin-right: 10px;
}
.ivu-tag{
  height: 32px;
  line-height: 32px;
}
.tr{
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
  Button{
    margin: 5px;
  }
}

}
/deep/.ivu-modal-footer{
  padding: 0;
  border: none;
}
</style>
