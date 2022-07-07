<template>
  <div id="line-details">
       <div class="header">
          <div class="bor"></div>
          <Row style="width:100%;height:32px">
              <Col :span="4">
                <Select v-model="formInline.line" @on-change="handleLine" placeholder="选择线路">
                    <Option v-for="(item, index) in lines" :key="index" :label="item.title" :value="item.addr"></Option>
                </Select>
              </Col>
              <Col :span="20">
                <Row class="df">
                 <Col :span="5" class="line">
                    <span class="title">线路状态:</span>
                    <span v-if="param.equipmentType === 1 && details.oc !== undefined" :class="details.oc ? 'c-success' : 'c-danger'">{{ details.oc ? "已通" : "已断"}}</span>
                    <span v-else-if="param.equipmentType === 2 && details.alarmState !== undefined" :class="details.alarmState === 0 ? 'c-success' : details.alarmState === -100 ? 'c-danger' : 'c-warning'">{{ details.alarmState === 0 ? "正常" : details.alarmState === -100 ? "报警" :"预警"}}</span>
                    <span v-else-if="param.equipmentType === 8 && details.oC !== undefined" :class="details.oC ? 'c-success' : 'c-danger'">{{ details.oC ? "已通" : "已断"}}</span>
                  </Col>
                  <Col>
                    <Poptip :transfer="true" placement="bottom" trigger="click">
                        <div class="content" v-if="param.equipmentType === 1" slot="title">
                            <Row class="mt-15">
                              <Col :span="15">当前状态是</Col>
                              <Col :span="9" :class="details.oc ? 'c-danger':'c-success'">{{details.oc ? "合闸" : "分闸"}}</Col>
                            </Row>
                            <Row class="mt-15" :gutter="20" style="margin-top:10px">
                                <Col :span="12"  style="display: flex;align-items: center;justify-content: center;flex-direction: column;">
                                    <span class="pointer" style="margin-left: 1px;" :class="details.oc ? 'allowed' : ''" @click="handleBrake(true)">
                                        <!-- <i class="icon-v5 icon-v5-hezha o-success"></i> -->
                                         <div class="o-danger"><img src="../../assets/images/hhezha.png" alt=""></div>
                                    </span>
                                    <div class="c-danger">合闸</div>
                                </Col>
                                <Col :span="12" style="display: flex;align-items: center;justify-content: center;flex-direction: column;">
                                <span class="pointer" style="margin-left: 1px;" :class="details.oc ? 'allowed' : ''" @click="handleBrake(false)">
                                        <!-- <i class="icon-v5 icon-v5-hezha o-success"></i> -->
                                         <div class="o-success"><img src="../../assets/images/gfenzha.png" alt=""></div>
                                    </span>
                                    <div class="c-success">分闸</div>
                                </Col>
                            </Row>

                            <div class="content" v-if="details.localLockEnable && details.localLock">
                                <div>已经被本地锁定了</div>
                                <div @click="handleLocking('true')"><i class="icon-v5 icon-v5-jiesuo o-success"></i></div>
                            </div>
                            <div class="content" style="margin-top: 2px" v-if="details.abnormalUnlockEnable && !details.enableNetCtrl">
                                <div>已经被异常分闸锁定了</div>
                                <div ><span class="pointer" @click="handleUnlock"><i class="icon-v5 icon-v5-jiesuo o-success"></i></span></div>
                            </div>
                            <template v-if="details.remoteLockAndUnlockEnable">
                                 <div>{{ details.remoteLock ? "已经被远程锁定了" : '没有被远程锁定' }}</div>
                               <div style="display:flex;align-items: center;justify-content: space-around;">
                                    <span class="pointer " :class="details.remoteLock ? 'allowed' : ''" @click="handleLocking('true')" style="margin-right:5px"><i class="icon-v5 icon-v5-jiesuo1 o-info"  ></i></span>
                                    <span class="pointer" :class="details.remoteLock ? '' : 'allowed'" @click="handleLocking('false')"><i class="icon-v5 icon-v5-jiesuo o-success" ></i></span>
                                </div>
                            </template>

                        </div>
                       <div v-else-if="param.equipmentType === 2" slot="title">
                           <div class="alarm">
                               <Button class="pointer btn" @click="handleControl(param.mac, 'REMOTE_MUTE', formInline.line)"><i class="icon-v5 icon-v5-xiaoyin"></i></Button>
                               <span>消音</span>
                           </div>
                            <div class="alarm">
                                <Button class="pointer btn" @click="handleControl(param.mac, 'CLEAR_ALARM', formInline.line)"><i class="icon-v5 icon-v5-zhongzhi1"></i></Button>
                                <span>重置</span>
                            </div>

                        <!-- <span class="pointer tr" style="float: right;" @click="queryChannel"><i class="icon-v5 icon-v5-shuaxin"></i>刷新</span> -->
                      </div>
                      <div v-else-if="param.equipmentType === 8" class="content" slot="title">
                        <div>分合闸</div>
                        <span class="pointer" v-if="false" style="margin-right:10px" ><Checkbox  v-model="group">组播</Checkbox ></span>
                        <Row class="mt-15" :gutter="20">
                            <Col :span="7">
                                <span class="pointer" style="margin-left: 1px;"  @click="handleBrake(true)">
                                    <i class="icon-v5 icon-v5-hezha o-success" :class="this.lines.length === 0 || details.oc === 1 ? 'not-allowed' : ''"></i>
                                </span>
                            </Col>
                            <Col :span="7">
                                <span class="pointer"   @click="handleBrake(false)">
                                    <i class="icon-v5 icon-v5-fenzha o-danger" :class="this.lines.length === 0 || details.oc === 1 ? 'not-allowed' : ''"></i>
                                </span>
                            </Col>
                        </Row>

                      </div>
                      <div class="tc" v-else>
                        无
                      </div>
                      <Button title="操作" class="btn"><i class="icon-v5 icon-v5-mianxingdianjitubiao"></i></Button>
                     </Poptip>
                    </Col>
                    <Button class="pointer btn" @click="queryChannel('refresh')"> <span><i class="icon-v5 icon-v5-refresh"></i> </span></Button>
                    <Button title="配置" class="btn" @click="handleConfigurationList(param, formInline.line)" ><i class="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"> </i></Button>
                    <Button title="指令历史" class="btn" @click="handleInstructions"><i class="icon-v5 icon-v5-chaobiao"> </i></Button>
                </Row>
              </Col>
          </Row>

      </div>
    <div class="details-wrap" @dblclick="handleLineList" v-if="param.equipmentType !== 8">
      <Row>
        <Col :span="8">{{ typeof details.ba === 'undefined' && typeof details.ca === 'undefined' ? ("电流" + '：' + (typeof details.aa !== 'undefined' ? details.aa + 'A' : '')) : ('A' + "相" + "电流" + '：' + (typeof details.aa !== 'undefined' ? (details.aa + 'A') : '')) }}</Col>
        <Col :span="8" v-show="Object.prototype.toString.call( details.ba) !== '[object Undefined]'">{{ 'B' + "相" + "电流" + '：' + (typeof details.ba !== 'undefined' ? details.ba + 'A' : '') }}</Col>
        <Col :span="8" v-show=" Object.prototype.toString.call( details.ca) !== '[object Undefined]'">{{ 'C' + "相" + "电流" + '：' + (typeof details.ca !== 'undefined' ? details.ca + 'A' : '' )}}</Col>
      </Row>
      <Row>
        <Col :span="8">{{ typeof details.bv === 'undefined' && typeof details.cv === 'undefined' ? ("电压(伏)" + '：' + (typeof details.av !== 'undefined' ? details.av + 'V' : '')) : ('A' + "相" + "电压(伏)" + '：' + (typeof details.av !== 'undefined' ? (details.av + 'V') : '')) }}</Col>
        <Col :span="8" v-show="Object.prototype.toString.call( details.bv) !== '[object Undefined]'">{{ 'B' + "相" + "电压(伏)" + '：' + (typeof details.bv !== 'undefined' ? details.bv + 'V' : '') }}</Col>
        <Col :span="8" v-show="Object.prototype.toString.call( details.cv) !== '[object Undefined]'">{{ 'C' + "相" + "电压(伏)" + '：' + (typeof details.cv !== 'undefined' ? details.cv + 'V' : '') }}</Col>
      </Row>
      <Row>
        <Col :span="8">{{ Object.prototype.toString.call( details.bt) !== '[object Undefined]' && typeof details.ct === 'undefined' ? ("温度" + '：' + (typeof details.asd !== 'undefined' ? details.asd > -60 ? details.asd + '℃' : '' : '')) : ('A' + "相" + "温度" + '：' + (typeof details.asd !== 'undefined' ? (details.asd > -60) ? details.asd + '℃' : '' : '')) }}<i class="iconfont icon-jieruguanli" title="未接探头" v-show="details.asd < -60"></i></Col>
        <Col :span="8" v-show="Object.prototype.toString.call( details.bt) !== '[object Undefined]'">{{ 'B' + "相" + "温度" + '：' + (typeof details.bt !== 'undefined' ? details.bt > -60 ? details.bt + '℃' : '' : '') }}<i class="iconfont icon-jieruguanli" title="未接探头" v-show="details.bt < -60"></i></Col>
        <Col :span="8" v-show="Object.prototype.toString.call( details.ct) !== '[object Undefined]'">{{ 'C' + "相" + "温度" + '：' + (typeof details.ct !== 'undefined' ? details.ct > -60 ? details.ct + '℃' : '' : '') }}<i class="iconfont icon-jieruguanli" title="未接探头" v-show="details.ct < -60"></i></Col>
      </Row>
      <Row v-if="details.groundFlag === 1">
        <Col :span="8">{{ "零线" + "温度" + '：' + (typeof details.nt !== 'undefined' ? details.nt > -60 ? details.nt + '℃' : '' : '') }}<i class="iconfont icon-jieruguanli" title="未接探头" v-show="details.nt < -60"></i></Col>
        <Col :span="8">{{ "零线" + "电流" + '：' + (typeof details.na !== 'undefined' ? details.na + 'A' : '0A') }}</Col>
      </Row>
      <Row>
        <Col :span="8">{{ "总功率" + '：' + (typeof details.gwp !== 'undefined' ? details.gwp + 'W' : '') }}</Col>
        <Col :span="8">{{ "剩余" + "电流" + '：' + (typeof details.gld !== 'undefined' ? details.gld + 'mA' : '') }}</Col>
      </Row>
    </div>
    <div  class="details-wrap" v-else>
      <Row>
        <Col :span="8">{{  "电流" + '：' + (typeof details.cur !== 'undefined' ? details.cur + 'A' : '') }}</Col>
        <Col :span="8">{{  "漏电流" + '：' + (typeof details.lki !== 'undefined' ? details.lki + 'mA' : '') }}</Col>
        <Col :span="8">{{  "电压(伏)" + '：' + (typeof details.vol !== 'undefined' ? details.vol + 'V' : '') }}</Col>
      </Row>
      <Row>
        <Col :span="8">{{  "功率" + '：' + (typeof details.pwr !== 'undefined' ? details.pwr + 'W' : '') }}</Col>
        <Col :span="8">{{  "温度" + '：' + (typeof details.tmp !== 'undefined' ? details.tmp + '℃' : '') }}</Col>
        <Col :span="8">{{  "用电量" + '：' + (typeof details.energy !== 'undefined' ? details.energy + 'kWh' : '') }}</Col>
      </Row>
    </div>
    <Modal title="指令历史记录" v-model="instructionsFlag"  custom-class="custom-select-Modal" width="1323px">
      <CommandFeedback class="mt-10" :classFlag="true" :instructionsData="param" :operateAt="1"></CommandFeedback>
    </Modal>
    <Modal
      title="设备参数调整"
      v-model="equipmentFlag"
      id="equipment"
      width="1323px">
        <gurationList v-if="equipmentFlag" :param="param" @handleInfo="handleInfo"></gurationList>
    </Modal>
    <Modal
        title=""
        v-model="modal"
        :footer-hide="true"
        :styles="{top: '20px',width:'300px'}">
        <br>
        <p v-for="(item,index) in opendatas" :key="index" :style="item.exeResult===1?'color:#f24e4c;text-align:center;line-height:25px':'color:#21f27f;text-align:center;line-height:25px'">{{
            item.exeResult===1?item.mac + "" +item.msg:item.mac + "命令已提交，生效中..."
            }}</p>

    </Modal>
  </div>
</template>

<script>
    import store from '@/store'
    import gurationList from '../console/device/gurationList.vue'
    import CommandFeedback from '../Common/CommandFeedback'
    import { getEffectAddr, zhloraQueryChannelDetails, winextloraCmd, queryChannelDetailsByBoxAndAddr, modifyBoxsChnlClearAlarm, modifyBoxsChnlRemoteMute, remotectrl, abnormalSwitchUnlock, remoteSwitchLock } from '@/api/control/index'
    export default {
        props: {
            param: {
                type: Object
            }
        },
        components: {
            gurationList,
            CommandFeedback
        },
        data () {
            return {
                opendatas: [],
                modal: false,
                formInline: {
                    line: ''
                },
                lines: [],
                details: [],
                equipmentFlag: false,
                value: true,
                group: false,
                timerID: null,
                iccid: this.$store.state.iccid,
                instructionsFlag: false
            }
        },
        created () {
            this.init()
        },

        methods: {
            init () {
                this.getAddrs()
            },
            getAddrs () {
                let params = {
                    'mac': this.param.mac
                }
                getEffectAddr(params)
                    .then(res => {
                        if (res.success) {
                            this.lines = res.datas
                            if (res.datas.length === 0) {
                                store.commit('detailsAddr', '')
                                return false
                            }
                            this.formInline.line = res.datas[0].addr
                            store.commit('detailsAddr', this.formInline.line)
                            this.queryChannel()
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
            queryChannel (val) {
                let params = {
                    'mac': this.param.mac,
                    'addrs': this.formInline.line
                }
                store.commit('detailsAddr', this.formInline.line)
                if (this.param.equipmentType === 8) {
                    zhloraQueryChannelDetails(params)
                        .then(res => {
                            if (res.success) {
                                if (res.data.length > 0) this.details = res.data[0]
                                if (typeof this.details.at !== 'undefined') this.details.asd = this.details.at
                                store.commit('dateFlag', false)
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
                } else {
                    queryChannelDetailsByBoxAndAddr(params)
                        .then(res => {
                            if (res.success) {
                                if (res.data.length > 0) this.details = res.data[0]
                                if (typeof this.details.at !== 'undefined') this.details.asd = this.details.at
                                store.commit('dateFlag', false)
                                if (val === 'refresh') {
                                    this.$Message.success({
                                        content: '刷新' + '成功'
                                    })
                                }
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
            handleLine (val) {
                this.queryChannel()
            },
            handleLineList () {
                this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.handleDblLineList(this.param)
            },
            handleBrake (type) {
                if (this.lines.length === 0) {
                    this.$Message.error('该设备下面没有线路')
                    return false
                }
                // if (this.lines.length === 0) return false
                // let title;
                // this.lines.forEach((item, index) => {
                //     if (item.addr === this.formInline.line) title = item.title
                // })
                this.$Modal.confirm({
                    content: '您确定要' + (type ? '合闸' : '分闸') + '?',
                    onOk: () => {
                        let _param = [
                            {
                                'mac': this.param.mac,
                                'addrOptInfos': [
                                    {
                                        'onOrOff': type,
                                        'addrs': [
                                            this.formInline.line
                                        ]
                                    }
                                ]
                            }
                        ]
                        _param = JSON.stringify(_param)
                        winextloraCmd(_param)
                            .then(res => {
                                if (res.code === '0') {
                                    this.$Message.success('命令已提交，生效中...')
                                } else {
                                    // this.opendatas = res.data
                                    this.$Message.error(res.message)
                                }
                            })
                    }
                })
                setTimeout(() => {
                    this.queryChannel()
                }, 2000);
                // if (type) {
                //     this.$Modal.confirm({
                //         content: '您确定要合闸',
                //         onOk: () => {
                //             let _param = [
                //                 {
                //                     'mac': this.param.mac,
                //                     'addrOptInfos': [
                //                         {
                //                             'onOrOff': true,
                //                             'addrs': [
                //                                 this.formInline.line
                //                             ]
                //                         }
                //                     ]
                //                 }
                //             ]
                //             _param = JSON.stringify(_param)
                //             winextloraCmd(_param)
                //                 .then(res => {
                //                     this.modal = true
                //                     if (res.code === 0) {
                //                         this.$message.success('命令已提交，生效中...')
                //                     } else {
                //                         this.opendatas = res.data
                //                     }
                //                 })
                //         }
                //     })
                // } else {
                //     this.$Modal.confirm({
                //         content: '您确定要分闸',
                //         onOk: () => {
                //             let _param = [
                //                 {
                //                     'mac': this.param.mac,
                //                     'addrOptInfos': [
                //                         {
                //                             'onOrOff': false,
                //                             'addrs': [
                //                                 this.formInline.line
                //                             ]
                //                         }
                //                     ]
                //                 }
                //             ]
                //             _param = JSON.stringify(_param)
                //             winextloraCmd(_param)
                //                 .then(res => {
                //                     this.modal = true
                //                     if (res.code === 0) {
                //                         this.$message.success('命令已提交，生效中...')
                //                     } else {
                //                         this.opendatas = res.data
                //                     }
                //                 })
                //         }
                //     })
                // }

                // if (this.param.equipmentType === 8) {
                //     if (type) {
                //         this.$Modal.confirm({
                //             content: '您确定要合闸',
                //             onOk: () => {
                //                 let _param = [
                //                     {
                //                         'mac': this.param.mac,
                //                         'addrOptInfos': [
                //                             {
                //                                 'onOrOff': true,
                //                                 'addrs': [
                //                                     this.formInline.line
                //                                 ]
                //                             }
                //                         ]
                //                     }
                //                 ]
                //                 _param = JSON.stringify(_param)
                //                 winextloraCmd(_param)
                //                     .then(res => {
                //                         this.modal = true
                //                         if (res.code === 0) {
                //                             this.$message.success('命令已提交，生效中...')
                //                         } else {
                //                             this.opendatas = res.data
                //                         }
                //                     })
                //             }
                //         })
                //     } else {
                //         this.$Modal.confirm({
                //             content: '您确定要分闸',
                //             onOk: () => {
                //                 let _param = [
                //                     {
                //                         'mac': this.param.mac,
                //                         'addrOptInfos': [
                //                             {
                //                                 'onOrOff': false,
                //                                 'addrs': [
                //                                     this.formInline.line
                //                                 ]
                //                             }
                //                         ]
                //                     }
                //                 ]
                //                 _param = JSON.stringify(_param)
                //                 winextloraCmd(_param)
                //                     .then(res => {
                //                         this.modal = true
                //                         if (res.code === 0) {
                //                             this.$message.success('命令已提交，生效中...')
                //                         } else {
                //                             this.opendatas = res.data
                //                         }
                //                     })
                //             }
                //         })
                //     }
                // } else {
                //     this.switcherCtlEvent(this.param.mac, this.formInline.line, type)
                // }
            },
            switcherCtlEvent (mac, addr, opr, lineList) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '您确定要' + (opr ? '合闸' : '分闸') + '?',
                    onOk: () => {
                        let _param = {
                            'cmd': 'OCSWITCH',
                            'mac': mac,
                            'value1': opr ? 'open' : 'close',
                            'value2': addr,
                            '_operate_at': lineList ? '2' : '1'
                        }
                        remotectrl(_param)
                            .then(res => {
                                if (res.success) {
                                    if (res.code === '0') {
                                        this.$Message.success({
                                            content: '命令已提交，生效中...'
                                        })
                                    }
                                } else if (res.code === '-1') {
                                } else {
                                    this.$Message.error({
                                        content: res.message
                                    })
                                }
                            })
                    },
                    onCancel: () => {
                        this.$Message.info('已取消');
                    }
                });
            },
            handleUnlock () {
                if (this.lines.length === 0 || this.details.localLock) return false
                if (!this.details.enableNetCtrl && this.details.localLock) {
                    this.$Message.error({
                        content: '设备已被硬件锁定, 请现场查看设备'

                    })
                    return
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '开关可能由于现场人为手动分闸或短路、漏电保护等故障锁定，需要确认现场可以安全合闸后才能解锁。此解锁操作后远程合闸不受限制，解锁、合闸造成的风险自行承担。',
                    onOk: () => {
                        let params = {
                            cmd: 'ABNORMAL_SWITCH_UNLOCK',
                            mac: this.param.mac,
                            addr: this.formInline.line
                        }
                        abnormalSwitchUnlock(params)
                            .then(res => {
                                if (res.success) {
                                    if (res.code === '0') {
                                        this.$Message.success({
                                            content: res.message
                                        })
                                    }
                                } else if (res.code === '-1') {
                                } else {
                                    this.$Message.error({
                                        content: res.message

                                    })
                                }
                            }).catch(err => {
                                if (err) {
                                    this.$Message.error({
                                        content: '未知错误，请刷新重试'

                                    })
                                }
                            })
                    },
                    onCancel: () => {
                        this.$Message.info('已取消');
                    }
                });
            },
            handleLocking (val) {
                if (this.lines.length === 0) return false
                let params = {
                    cmd: 'REMOTE_SWITCH_LOCK',
                    mac: this.param.mac,
                    addr: this.formInline.line,
                    lockStatus: val
                }
                if (val === 'false') {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '请确认现场可以安全合闸后才能解锁，此解锁操作后远程合闸不受限制，解锁、合闸造成的风险自行承担。',
                        onOk: () => {
                            this.remoteSwitchLock(params)
                        },
                        onCancel: () => {
                            this.$Message.info({
                                content: '已取消'
                            })
                        }
                    });
                } else {
                    this.remoteSwitchLock(params)
                }
            },
            handleInfo () {
                this.$emit('hanleInfo')
            },
            remoteSwitchLock (params) {
                remoteSwitchLock(params)
                    .then(res => {
                        if (res.code === '0') {
                            this.$Message.success({
                                content: res.message
                            })
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    }).catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
            },
            handleControl (mac, cmd, addr) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '您确定要' + (cmd === 'REMOTE_MUTE' ? '消音' : '清除报警') + '?',
                    onOk: () => {
                        let params = {
                            macs: mac,
                            cmd: cmd,
                            nodeNo: addr
                        }
                        if (cmd === 'CLEAR_ALARM') {
                            modifyBoxsChnlClearAlarm(params)
                                .then(res => {
                                    if (res.success) {
                                        this.$Message.success({
                                            content: '命令已提交，生效中...'
                                        })
                                    } else if (res.code === '-1') {
                                    } else {
                                        this.$Message.error({
                                            content: res.data[0].errorMsg
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
                        } else if (cmd === 'REMOTE_MUTE') {
                            modifyBoxsChnlRemoteMute(params)
                                .then(res => {
                                    if (res.success) {
                                        this.$Message.success({
                                            content: '命令已提交，生效中...'
                                        })
                                    } else if (res.code === '-1') {
                                    } else {
                                        this.$Message.error({
                                            content: res.data[0].errorMsg
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

                        return false
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '取消输入'
                        })
                    }
                });
                // this.$Modal.confirm('您确定要' + (cmd === 'REMOTE_MUTE' ? '消音' : '清除报警') + '?', '提示', {
                //     okText: '确定',
                //     cancelText: '取消'
                // }).then(() => {
                //     if (this.config.authority.CTL_REQ_AUTHCODE === 'true') {
                //         this.$Modal.prompt('请输入授权码', '提示', {
                //             confirmButtonText: '确定',
                //             cancelButtonText: '取消',
                //             inputPattern: /^[0-9a-zA-Z]{4,16}$/,
                //             inputErrorMessage: '请输入正确的授权码，由4-16位的字母或数字组成！'
                //         }).then(({ value }) => {
                //             let params = {
                //                 authCode: value
                //             }
                //             verifyAuthCode(params)
                //                 .then(res => {
                //                     if (res.success) {
                //                         if (res.data === true) {
                //                             let params = {
                //                                 macs: mac,
                //                                 cmd: cmd,
                //                                 nodeNo: addr
                //                             }
                //                             if (cmd === 'CLEAR_ALARM') {
                //                                 modifyBoxsChnlClearAlarm(params)
                //                                     .then(res => {
                //                                         if (res.success) {
                //                                             this.$Message.success({
                //                                                 content: '命令已提交，生效中...'
                //                                             })
                //                                         } else if (res.code === '-1') {
                //                                         } else {
                //                                             this.$Message.error({
                //                                                 content: res.data[0].errorMsg
                //                                             })
                //                                         }
                //                                     })
                //                                     .catch(err => {
                //                                         if (err) {
                //                                             this.$Message.error({
                //                                                 content: '未知错误，请刷新重试'
                //                                             })
                //                                         }
                //                                     })
                //                             } else if (cmd === 'REMOTE_MUTE') {
                //                                 modifyBoxsChnlRemoteMute(params)
                //                                     .then(res => {
                //                                         if (res.success) {
                //                                             this.$Message.success({
                //                                                 content: '命令已提交，生效中...'
                //                                             })
                //                                         } else if (res.code === '-1') {
                //                                         } else {
                //                                             this.$Message.error({
                //                                                 content: res.data[0].errorMsg
                //                                             })
                //                                         }
                //                                     })
                //                                     .catch(err => {
                //                                         if (err) {
                //                                             this.$Message.error({
                //                                                 content: '未知错误，请刷新重试'
                //                                             })
                //                                         }
                //                                     })
                //                             }
                //                         } else {
                //                             this.$Message.error({
                //                                 content: '授权失效,禁止操作'
                //                             })
                //                         }
                //                     } else if (res.code === '-1') {
                //                     } else {
                //                         if (res.message) {
                //                             this.$Message.error({
                //                                 content: res.message
                //                             })
                //                         } else {
                //                             this.$Message.error({
                //                                 content: '未知错误，请刷新重试'
                //                             })
                //                         }
                //                     }
                //                     return false
                //                 })
                //                 .catch(err => {
                //                     if (err) {
                //                         this.$Message.error({
                //                             content: '未知错误，请刷新重试'
                //                         })
                //                     }
                //                 })
                //         }).catch(() => {
                //             this.$Message.info({
                //                 content: '取消输入'
                //             })
                //         })
                //     } else {
                //         let params = {
                //             macs: mac,
                //             cmd: cmd,
                //             nodeNo: addr
                //         }
                //         if (cmd === 'CLEAR_ALARM') {
                //             modifyBoxsChnlClearAlarm(params)
                //                 .then(res => {
                //                     if (res.success) {
                //                         this.$Message.success({
                //                             content: '命令已提交，生效中...'
                //                         })
                //                     } else if (res.code === '-1') {
                //                     } else {
                //                         this.$Message.error({
                //                             content: res.data[0].errorMsg

                //                         })
                //                     }
                //                 })
                //                 .catch(err => {
                //                     if (err) {
                //                         this.$Message.error({
                //                             content: '未知错误，请刷新重试'

                //                         })
                //                     }
                //                 })
                //         } else if (cmd === 'REMOTE_MUTE') {
                //             modifyBoxsChnlRemoteMute(params)
                //                 .then(res => {
                //                     if (res.success) {
                //                         this.$Message.success({
                //                             content: '命令已提交，生效中...'
                //                         })
                //                     } else if (res.code === '-1') {
                //                     } else {
                //                         this.$Message.error({
                //                             content: res.data[0].errorMsg

                //                         })
                //                     }
                //                 })
                //                 .catch(err => {
                //                     if (err) {
                //                         this.$Message.error({
                //                             content: '未知错误，请刷新重试'

                //                         })
                //                     }
                //                 })
                // }
                // }
                // })
            },
            handleConfigurationList () {
                this.equipmentFlag = true
            },
            handleEquipmentClose () {
                this.equipmentFlag = false
            },
            handleInstructions () {
                this.instructionsFlag = true
            }
            //         setTimer (fn, delay) {
            //             let _this = this
            //             function timer () {
            //                 _this.timerID = setTimeout(function () {
            //                     timer()
            //                     fn()
            //                 }, delay)
            //             }
            //             timer()
            //         }
            //     },
            //     destroyed () {
            //         clearTimeout(this.timerID)
            //     },

        }
    }
</script>
<style lang="less" scoped>

.df{
    display: flex;
    justify-content: flex-end;
}
.line{
    .title{
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
    }
}
.details-wrap{
    padding: 20px 40px;
    .ivu-col{
        margin-bottom: 20px;
    }
}
.not-allowed{
    cursor: not-allowed;
    color: #999;
}
.content{
    .icon-v5{
        font-size: 30px;
    }
    .o-success{
        color :#67C23A;
        border: 1px solid #67C23A;
        background: rgba(13, 213, 103,.1);
        border-radius: 5px;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .o-danger{
        color :#f24e4c;
        border: 1px solid #f56c6c;
        background: rgba(245, 108, 108,.1);
        border-radius: 5px;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .o-info{
        color :#909399;
        border: 1px solid #909399;
        background: rgba(144, 147, 153,.1);
        border-radius: 5px;
    }
}
.alarm{
    height: 46px;
    .btn{
        background: rgba(0, 126, 255, 0.1);
        border: 1px solid #007EFF;
        border-radius: 5px;
        color: #007EFF;
        margin-right: 10px;
        padding: 0 6px;
    }
    span{
        color: #8d8e8f;
    }
}
/deep/.ivu-poptip-title:after{
    background: transparent;
}
</style>
