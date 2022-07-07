<template>
  <div id="edit">
    <div class="title">
        <div class="description-title">
            <i class="icon-v5 icon-v5-huifu"></i> 说明:
        </div>
        <div class="description-text">
            <div class="description">
                  {{ '1. ' + '向服务器提交了指令,并非立即生效,指令将由服务器后台逐个下发到设备,根据网络情况可能会延迟.' }}
            </div>
            <div class="description">
                {{ '2. ' +'提交后,要等待设备响应后方可查询可见.' }}
            </div>
        </div>
    </div>
    <Form :model="form" style="margin-top:20px">
      <FormItem :label-width="0">
         <div style="display:flex">
            <div class="slot-label pointer" >设备</div>
            <Button class="btn"  @click="handleDevice">点击选择</Button>
            <Input v-model="form.mac" readonly style="width:300px"></Input>
         </div>
      </FormItem>
      <FormItem v-show="form.mac" :label-width="0">
       <div style="display:flex">
          <div  class="slot-label pointer">线路</div>
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
               <div class="slot-label pointer" >重复</div>
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
            <div class="slot-label pointer" >时间延迟</div>
               <Col :span="6"  style="padding-left: 0">
                <Select :clearable='true' v-model="form.type">
                  <Option
                    v-for="item in trigger"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </Option>
                </Select>
            </Col>
            <Col>
              <Input
                style="width: 90px;margin-left:20px"
                v-model="form.time">
                <i slot="suffix" style="font-style:normal;margin-right">秒</i>
              </Input>
              <span  style="margin-left:20px">{{ '(' + "正数表示延迟，负数表示提前" + ')' }}</span>
            </Col>
        </div>

      </FormItem>
      <FormItem  :label-width="0">
          <div style="display:flex">
            <div class="slot-label pointer" >动作</div>
                <Col :span="13">
                  <Select :clearable='true' v-model="form.action" style="width:200px">
                    <Option
                      v-for="item in actions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </Option>
                  </Select>
                </Col>
          </div>
      </FormItem>
      <FormItem  :label-width="0">
          <div style="display:flex">
            <div class="slot-label pointer">设置经纬度</div>
            <Button class="btn" @click="handleSetUp">点击设置</Button>
          </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display:flex">
        <div class="slot-label pointer" >监视时长</div>
        <Input

          style="width: 199px"
          oninput="if(value>86399) {value=86399} else if (value<0) {value=0}"
          v-model="form.monitorTime">
          <i slot="suffix" style="font-style:normal;margin-right">秒</i>
        </Input>
        </div>
      </FormItem>
      <FormItem>
        <Col :span="24" class="tr">
           <Button class="b-blue" @click="handleSubmit" :disabled="form.mac === '' || tags.length === 0 || form.week.length === 0 || form.action === '' || form.time === ''">保存</Button>
           <Button @click="handleCloseEdit">取消</Button>
        </Col>
      </FormItem>
    </Form>

    <Modal title="添加设备线路" :close-on-click-modal="false" custom-class="custom-device-dialog" v-model="deviceVisible"  width="75%" append-to-body>
        <Device source="BuiltInTiming" @sendBuiltInTimingMac="receiveBuiltInTimingMac" attrFlag="attrFlag"></Device>
    </Modal>
    <Modal title="线路列表" v-model="lineVisible" width="60%" append-to-body>
      <LineList :mac="form.mac" :tags="tags" @sendChannels="receiveChannels" @sendCancel="sendCancel" source="BuiltInTiming" v-if="lineVisible"></LineList>
      <div slot="footer"></div>
    </Modal>
    <Modal title="选择重复" v-model="repeatFlag" append-to-body>
      <WeekSelection :options="form.week" @sendWeekSelection="receiveWeekSelection" @receiveWeekSelectionCancel="receiveWeekSelectionCancel"></WeekSelection>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
    import Device from '../../DetectionRules/Device'
    import LineList from '../../Common/LineList'
    import WeekSelection from '../../Common/WeekSelection'
    import { modifyTiming, queryPageAuth } from '@/api/multiManage/latlongTimer'
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
                    triggerTime: '',
                    time: this.options.time,
                    week: [...this.options.weekday],
                    action: this.options.status,
                    type: this.options.type,
                    monitorTime: this.options.monitorTime
                },
                trigger: [
                    {
                        value: 2,
                        label: '日出触发'
                    },
                    {
                        value: 3,
                        label: '日落触发'
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
                setupFlag: false,
                monitorFlag: false,
                deviceVisible: false,
                lineVisible: false,
                repeatFlag: false,
                tags: this.options.tags
            }
        },
        mounted () {
            this.init()
            if (this.form.monitorTime) {
                this.monitorFlag = true
            }
        },
        methods: {
            init () {
                let parmas = {
                    resKeys: 'AUTH_PROJECT_USE',
                    operKeys: 'ADVANCED_TIMING_MONITOR'
                }
                queryPageAuth(parmas)
                    .then(res => {
                        if (res.success) {
                            this.setupFlag = res.data[0].result
                            if (this.form.monitorTime.length > 0) {
                                this.monitorFlag = true
                            }
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
            },
            handleCloseEdit () {
                this.$emit('closeEdit', false)
            },
            handleChangeType (val) {
                this.form.type = val
                if (this.form.type === 1) {
                    this.form.time = this.$func.getNowFormatDateTime()
                } else {
                    this.form.time = this.options.time ? this.options.time : this.$func.getNowFormatDateTime('time')
                }
            },
            handleAdvanced () {
                this.monitorFlag = !this.monitorFlag
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
            handleRepeatClose (tag) {
                this.form.week.splice(this.form.week.indexOf(tag), 1)
            },
            receiveWeekSelection (val) {
                this.form.week = val
                this.repeatFlag = false
            },
            receiveWeekSelectionCancel () {
                this.repeatFlag = false
            },
            sendCancel () {
                this.lineVisible = false
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
            handleSubmit () {
                let params = {
                    mac: this.form.mac,
                    autoid: this.options.autoid ? this.options.autoid : 0,
                    channel: this.tags.map((item) => { return item.addr }).join(','),
                    weekday: this.form.week.join(''),
                    time: this.form.time,
                    type: this.form.type,
                    status: this.form.action,
                    _operate_at: 4 + ':' + this.options.autoid,
                    monitorTime: this.form.monitorTime
                }
                modifyTiming(params)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message

                            })
                            this.$emit('queryList', true)
                            this.$emit('closeEdit', true)
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
            },

            handleSetUp () {
                if (this.form.mac === '') {
                    this.$Message.error({
                        content: '请选择设备'
                    })
                    return false
                }
                this.form.flag = 'ture'
                this.form.autoid = this.options.autoid ? this.options.autoid : 0
                this.form.tags = this.tags
                this.$emit('handleLatitudeLongitude', this.form)
            }
        },
        watch: {
            monitorFlag: {
                handler (newVal, oldVal) {
                    if (!newVal) {
                        this.form.monitorTime = ''
                    }
                    if (newVal) {
                        this.form.monitorTime = this.options.monitorTime
                    }
                }
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
.form{
    display: flex;
    /deep/.ivu-input{
        width: 200px;
    }
}
.mr{
    margin-right: 20px;
}
.tr{
    display: flex;
    justify-content: flex-end;
    Button{
        margin: 0 5px;
        width: 80px;
        height: 36px;
        border-radius: 5px;
    }
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
.title{
    background: rgba(153, 153, 153, 0.05);
    border: 1px solid #999999;
    font-size: 14px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    display: flex;
    padding: 10px;
    .description-title{
        width: 66px;
    }
    .description-text{

    }
}
/deep/.ivu-modal-footer{
    border: none;
    padding: 0;
}
</style>
