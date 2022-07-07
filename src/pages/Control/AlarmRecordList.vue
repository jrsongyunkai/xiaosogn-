<template>
  <div id="record-list">
    <div class="theader">
        <div class="left">
            <div class="bor"></div>
            <span>报警记录</span>
        </div>
        <div class="right" @click="handleMore" >
            查看全部
        </div>
    </div>
    <Col ref="box" style="overflow: hidden;">
      <Table
        :data="tableData"
        height="200"
        :columns="columns"
        style="width: 100%;margin-top: 10px">
          <template slot-scope="{row}" slot="others.address">
              <span class="pointer">{{row.others.address}}</span>
          </template>
          <template slot-scope="{row}" slot="valueDescribe">
            <span>{{row.others.valueDescribe}}</span>
          </template>
            <template slot-scope="{row}" slot="others.progress">
              <Progress
                :text-inside="true"
                :stroke-width="18"
                :show-text="false"
                :class="row.processStatus === 2 ? 'solved' : 'rejected'"
                :percentage="100"
                v-if="row.others.progress > 100"
              ></Progress>
              <Progress
                :text-inside="true"
                :stroke-width="18"
                :show-text="false"
                :class="row.processStatus === 2 ? 'solved' : 'rejected'"
                :percentage="row.others.progress"
              ></Progress>
            </template>

            <template slot-scope="{row}" slot="others.passTime">
              <span
                :class="row.passTime === '48' ? 'danger-text' : 'warning-text'"
              >{{ row.others.passTime + "小时" }}</span>
            </template>

          <template slot-scope="{row}" slot="processStatus">
            <Button type="text" v-if="row.processStatus === 0" @click="handleUrge(row.id)">催促</Button>
            <span class="pointer" @click="queryMaintenance(row)" :class="row.processStatus === 0 ? 'c-danger' : 'c-success'">{{ row.processStatus === 0 ? "未处理" :"已处理" }}</span>
          </template>
      </Table>
    </Col>
    <Modal
      id="dialogVisible"
      title="维保编辑" v-model="dialogVisible" @close="closeMaintenance">
      <maintenance-editor
      v-if="dialogVisible"
      v-on:close-maintenance="closeMaintenance"
      :maintenanceBoxObj="maintenanceBoxObj"
      @hanleAlarm="hanleClickAlarm"
      ></maintenance-editor>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
    import store from '@/store'
    import MaintenanceEditor from '../safetyMonitor/allWarn/MaintenanceEditor.vue'
    import { queryAlarmByBox, findMaintenance, alarmUrgePush } from '@/api/control/index'
    export default {
        props: {
            mac: {
                type: String
            },
            equipmentType: {
                type: Number
            }
        },
        data () {
            return {
                tableData: [],
                alarmInfo: '',
                page: 1,
                loadMore: true,
                dialogVisible: false,
                maintenanceBoxObj: {},
                columns: [
                    {
                        title: '事件ID',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '地点',
                        slot: 'others.address',
                        align: 'center'
                    },
                    {
                        title: '报警时间',
                        key: 'dateTime',
                        align: 'center'
                    },
                    {
                        title: '节点线路',
                        key: 'node',
                        align: 'center'
                    },
                    {
                        title: '报警类型',
                        key: 'info',
                        align: 'center'
                    },
                    {
                        title: '数值',
                        slot: 'valueDescribe',
                        align: 'center'
                    },
                    {
                        title: '进度',
                        slot: 'others.progress',
                        align: 'center'
                    },
                    {
                        title: '耗时',
                        slot: 'others.passTime',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'processStatus',
                        width: 150,
                        align: 'center'
                    }
                ]
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                if (this.$route.path === '/ConfigurationList') return false
                this.queryAlarm(false)
            },
            queryAlarm (flag) {
                let params = {
                    limit: 10,
                    typeNumbers: '',
                    mac: this.mac
                }
                queryAlarmByBox(params)
                    .then(res => {
                        if (res.success) {
                            if (flag) {
                                if (res.datas.length === 0) {
                                    this.loadMore = false
                                    return false
                                } else {
                                    this.loadMore = true
                                }
                                this.tableData = this.tableData.concat(res.datas)
                            } else {
                                this.tableData = res.data
                                this.loadMore = true
                            }
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
                    .finally(() => {})
            },
            listenDistance () {
                let that = this
                const selectWrap = document.querySelector('#record-list .el-table__body-wrapper')
                if (selectWrap) {
                    selectWrap.addEventListener('scroll', function () {
                        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
                        if (scrollDistance === 0 && that.loadMore) {
                            setTimeout(() => {
                                that.page += 1
                                that.queryAlarm(true)
                                that.loadMore = false
                            }, 1000)
                        }
                    })
                }
            },
            handleValue (obj) {
                let type = ''
                let signal = ''
                if (obj.elecType === 1) {
                    type = this.$t('main.watt')
                } else if (obj.elecType === 2) {
                    type = this.$t('main.ampere')
                } else if (obj.elecType === 3) {
                    type = this.$t('menu.leakageCurrent')
                } else if (obj.elecType === 4) {
                    type = this.$t('menu.temperature')
                } else if (obj.elecType === 5) {
                    type = this.$t('main.volt')
                } else if (obj.elecType === 8) {
                    type = this.$t('main.lightningCurrent')
                } else if (obj.elecType === 9) {
                    signal = this.$t('control.signal')
                    type = this.$t('main.volt')
                } else if (obj.elecType === 10) {
                    type = this.$t('menu.humidity')
                } else if (obj.elecType === 11) {
                    type = this.$t('stralsund.concentration')
                } else if (obj.elecType === 12) {
                    type = this.$t('echarts.illumination') + this.$t('echarts.celsius')
                } else if (obj.elecType === 14) {
                    type = this.$t('table.waterVolume')
                }
                if (obj.elecType === 9) {
                    this.alarmInfo = [`${type}(${obj.unit1}): ${obj.value1},\xa0${signal}(${obj.unit2}): ${obj.value2}`]
                } else if (obj.elecType === 8) {
                    this.alarmInfo = [`${type}(${obj.unit}): ${obj.value} ${obj.elecType === 8 ? '' : ('(' + this.$t('table.threshold') + ':' + obj.threshold + ')')}`,
                                      `${obj.groundWire !== undefined ? this.$t('main.groundState') + ': ' + (obj.groundWire === 0 ? this.$t('control.normal') : this.$t('control.abnormal')) : ''}`,
                                      `${obj.spd !== undefined ? 'SPD: ' + (obj.spd === 0 ? this.$t('control.normal') : this.$t('control.abnormal')) : ''}`,
                                      `${obj.occurTime ? this.$t('main.surgeTime') + ': ' + (obj.occurTime ? obj.occurTime : '') : ''}`]
                } else if (obj.elecType === 10) {
                    this.alarmInfo = `${type}: ${obj.value}${obj.unit + 'RH'} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
                } else if (obj.elecType === 11) {
                    this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
                } else if (obj.elecType === 12) {
                    this.alarmInfo = `${type}: ${obj.value + 'Lux'} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
                } else if (obj.elecType === 14) {
                    this.alarmInfo = `${type}: ${obj.value1 + obj.unit1}`
                } else {
                    this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
                }
            },
            handleMore () {
                this.$router.push({
                    name: 'Alarms',
                    params: {
                        projectCode: this.$store.state.projectCode,
                        mac: this.mac,
                        typeNumber: '-100',
                        status: '',
                        oqp2: ''
                    }
                })
            },
            hanleClickAlarm () {
                this.$emit('clickAlarm')
            },
            queryMaintenance (obj) {
                let params = {
                    mac: obj.mac,
                    alarmId: obj.id,
                    id: ''
                }
                findMaintenance(params)
                    .then(res => {
                        if (res.success) {
                            store.commit('maintenanceObj', res.data)
                            store.commit('alarmId', obj.id)
                            this.maintenanceBoxObj = obj
                            if (!this.maintenanceBoxObj.equipmentType) this.maintenanceBoxObj.equipmentType = this.equipmentType

                            this.dialogVisible = true
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
                    .catch(res => {
                        this.$Message.error({
                            content: '未知错误，请刷新重试'
                        })
                    })
            },
            closeMaintenance () {
                store.dispatch('resetMaintenanceObj')
                this.dialogVisible = false
                this.init()
            },
            handleUrge (id) {
                alarmUrgePush({ id: id })
                    .then(res => {
                        if (res.code === '0') {
                            this.$Message.success({
                                content: res.message
                            // type: res.code === '0' ? 'success' : 'error'
                            })
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
        watch: {
            '$store.state.detailsAddr': {
                handler (newVal, oldVal) {
                    if (newVal) {}
                }
            },
            '$route': 'init'
        },
        components: {
            MaintenanceEditor
        }
    }
</script>
<style lang="less" scoped>
.icon-gengduo{ vertical-align:middle;}
/deep/.ivu-modal-footer{
    padding: 0;
}
</style>
