<template>
    <div id="content_bottom">
        <div class="content_left">
            <div style="display:flex;align-items:center">
                <Row class="img_row">
                <Col span="12" class="img_row_col tl">
                    <i class="img_row_art ml-10">实时报警列表</i>
                </Col>
                <Col span="12" class="img_row_col tr">
                <CheckboxGroup v-model="filterType" @on-change="handleFilterType">
                    <Checkbox  label="包含预警"><i ref="re" class="c-default">包含预警</i></Checkbox>
                    <Checkbox label="只显示离线报警" ><i ref="rf" class="c-default">只显示离线报警</i></Checkbox>
                </CheckboxGroup>
                </Col>
            </Row>
            </div>

            <div class="qm-table">
                <Table id="screen" height="270" stripe  :columns="columnTable" :data="tableData">
                    <template slot-scope="{row}" slot="projectimg">
                      <div class="tablist">
                        <span v-if="row.classify === -100">
                          <img src="../../assets/images/baojin.png" alt="">
                        </span>
                        <span v-if="row.classify !== -100">
                          <img src="../../assets/images/yujin.png" alt="">
                        </span>
                      </div>
                  </template>
                  <template slot-scope="{row}" slot="project">
                      <div class="tablist">
                        <span  @click="handleSwitch(row, 'project')" class="state-icon-mr pointer">{{ row.projectName }}</span>
                      </div>

                  </template>

                  <template slot-scope="{row}" slot="address">
                    <div @click="handleAddress(row)" class="pointer">{{ row.address }}</div>
                  </template>
                    <template slot-scope="{row}" slot="mac">
                    <div @click="handleDetails(row)" class="pointer c-primary">{{ row.mac }}</div>
                  </template>

                  <template slot-scope="{row}" slot="progress">
                    <template v-if="row.progress < 50">
                        <Progress
                            stroke-color='#87d068'
                            :percent="row.progress"
                        ></Progress>
                    </template>
                    <template v-if="row.progress > 50">
                        <Progress
                            stroke-color='#FF4F4F'
                            :percent="row.progress"

                        >
                        <span> </span>
                        </Progress>
                    </template>
                  </template>

                  <template slot-scope="{row}" slot="passTime">
                    <span
                      :class="row.passTime === '48' ? 'danger-text' : 'warning-text'"
                    >{{row.passTime + "小时" }}</span>
                  </template>

                  <template slot-scope="{row}" slot="stage">
                      <template v-if="row.stage === 0">
                        <span class="pointer b-danger"
                            @click="queryMaintenance(row)"
                        >未处理</span>
                      </template>
                         <template v-if="row.stage === 1">
                        <span class="pointer b-yelo"
                            @click="queryMaintenance(row)"
                        >处理中</span>
                      </template>
                       <template v-if="row.stage === 2">
                        <span class="pointer b-success"
                            @click="queryMaintenance(row)"
                        >已处理</span>
                      </template>
                  </template>
                </Table>
            </div>
        </div>
        <div class="content_right">
             <div style="display:flex;align-items:center">
                <Row class="img_row">
                    <Col span="24" class="img_row_col tl">
                        <i class="img_row_art ml-10">设备分类</i>
                    </Col>
                </Row>
             </div>
            <pie :options="pieOptions"></pie>
        </div>
        <Modal id='modal' :title="title" v-model="dialogVisible">
             <maintenance-editor
                v-if="dialogVisible"
                :maintenanceBoxObj="maintenanceBoxObj"
                v-on:close-maintenance="closeMaintenance"
            ></maintenance-editor>
            <div slot="footer"></div>
        </Modal>
        <Modal title="报警详情" id="detailsV" v-model="detailsVisible">
            <Row>
              <Col :span="12">
                <Form :model="form" class="ml-20" label-position="right">
                  <FormItem label="事件ID" prop="id" :label-width="80">{{form.id}}</FormItem>
                  <FormItem label="项目：" prop="projectName" :label-width="65">{{form.projectName}}</FormItem>
                  <FormItem label="设备号：" prop="mac" :label-width="80">{{form.mac}}</FormItem>
                  <FormItem label="联系人：" prop="linkman" :label-width="80">{{form.linkman}}</FormItem>
                  <FormItem label="预警类型：" prop="info" :label-width="95">{{form.info}}</FormItem>
                  <FormItem label="线路：" prop="channelTitle" :label-width="70">{{form.channelTitle}}</FormItem>
                </Form>
              </Col>
              <Col :span="12">
                <Form :model="form" label-position="right">
                  <FormItem label="设备别名：" prop="macName" :label-width="100">{{form.macName}}</FormItem>
                  <FormItem label="地点：" prop="porjectAddress" :label-width="70">
                    <div class="no_wrap" :title="form.projectAddress">{{form.projectAddress}}</div>
                  </FormItem>
                  <FormItem label="在线状态：" prop="onlineStatus" :label-width="100">
                    <span :class="form.onlineStatus === 1 ? 'c-success' : form.onlineStatus === 0 ? 'c-danger' : 'c-info'">{{form.onlineStatus === 1 ? '在线' : form.onlineStatus === 0 ? '离线' : '脱线'}}<span class="fs-12" v-if="form.offLineTime">{{'(' + form.offLineTime + ')'}}</span></span>
                  </FormItem>
                  <FormItem label="联系电话：" prop="linkmanTel" :label-width="100">{{form.linkmanTel}}</FormItem>
                  <FormItem label="报警时间：" prop="time" :label-width="100">{{form.time}}</FormItem>
                  <FormItem label="线路状态：" :label-width="100">
                     <span v-if="typeof form.oc !== 'undefined'" :class="form.oc ? 'c-success' : 'c-danger'">{{form.oc ? '已通' : '已断'}}</span>
                  </FormItem>
                </Form>
              </Col>
              <Col :span="24">
                 <Table
                    class="device-wrap"
                    :data="electricData"
                    :columns="detailsTable"
                    stripe
                    style="width: 100%">
                      <template slot-scope="{row}" slot="A">
                        <span v-if="row.index === 2 && form.aT < -60"><i class="icon-v5 icon-v5-jieruguanli" title="未接探头"></i></span>
                        <span v-else>{{row.A}}</span>
                      </template>
                      <template slot-scope="{row}" slot="B">
                        <span v-if="row.index === 2 && form.bT < -60"><i class="icon-v5 icon-v5-jieruguanli" title="未接探头"></i></span>
                        <span v-else>{{row.B}}</span>
                      </template>
                      <template slot-scope="{row}" slot="C">
                        <span v-if="row.index === 2 && form.cT < -60"><i class="icon-v5 icon-v5-jieruguanli" title="未接探头"></i></span>
                        <span v-else>{{row.C}}</span>
                      </template>
                  </Table>
              </Col>
              <Col :span="12" class="tx">总功率: {{typeof form.gWp !== 'undefined' ? form.gWp + 'w' : '--'}}</Col>
              <Col :span="11" class="tx">剩余电流: {{typeof form.gLd !== 'undefined' ? form.gLd + 'mA' : '--'}} </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import '@/styles/pages/visualScreen.less'
    import store from '@/store'
    import MaintenanceEditor from '../safetyMonitor/allWarn/MaintenanceEditor.vue'
    import screenPie from '../Common/BotPie.vue'
    import { getClosestRealTimeByAlarmTime, realtimeAlarm, findMaintenance, getEquipClassifyStatList } from '@/api/visualScreen/index.js'
    export default {
        components: {
            pie: screenPie,
            MaintenanceEditor
        },
        data () {
            return {
                warningFlag: false,
                alarmFlag: false,
                dialogVisible: false,
                detailsVisible: false,
                filterTypeParam: '-100',
                title: '',
                filterType: [],
                checked: true,
                form: {},
                electricData: [],
                pieOptions: {
                    legend: [],
                    series: []
                },
                tableData: [],
                columnTable: [
                    {
                        title: ' ',
                        slot: 'projectimg',
                        width: 40,
                        align: 'rigth'
                    },
                    {
                        title: '项目',
                        slot: 'project'
                    },
                    {
                        title: '地点',
                        slot: 'address',
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        slot: 'mac',
                        align: 'center'
                    },
                    {
                        title: '设备别名',
                        key: 'macName',
                        align: 'center'
                    },

                    {
                        title: '线路',
                        key: 'channelTitle',
                        align: 'center'
                    },
                    {
                        title: '报警类型',
                        key: 'info',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '报警时间',
                        key: 'time',
                        align: 'center'
                    },
                    {
                        title: '进度',
                        slot: 'progress',
                        align: 'left',
                        width: 200
                    },
                    {
                        title: '耗时',
                        slot: 'passTime',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'stage',
                        align: 'center'
                    }
                ],
                detailsTable: []

            }
        },
        created () {},
        mounted () {
            this.initQueryRealtimeAlarm()
            this.queryEquipClassifyStatList()
        },
        methods: {
            initQueryRealtimeAlarm () {
                let params = {
                    typeNumbers: this.filterTypeParam
                }
                realtimeAlarm(params)
                    .then(res => {
                        this.tableData = res.data

                        this.datas = res
                    })
            },
            queryMaintenance (obj) {
                if (obj.stage === 0) {
                    this.title = '新建工单'
                } else if (obj.stage === 1) {
                    this.title = '编辑工单'
                } else {
                    this.title = '工单详细'
                }
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
                            this.dialogVisible = true
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
            },
            closeMaintenance () {
                store.dispatch('resetMaintenanceObj')
                this.dialogVisible = false
                this.initQueryRealtimeAlarm()
            },
            handleSwitch (obj, type) {
                var path = '/console/project'
                store.commit('overviewMac', '')
                this.$func.switchToProject(obj, path)
            },
            handleAddress (obj, type) {
                var path = '/console/device'
                store.commit('overviewMac', '')
                store.commit('equipmentType', 1)
                this.$func.switchToProject(obj, path)
            },
            handleFilterType (val) {
                this.tableData = []
                if (val.length > 0) {
                    if (val.length === 1 && val[0] === '包含预警') {
                        this.$refs.re.style = 'color:#409EFF';
                        this.filterTypeParam = '-100,-200'
                    } else {
                        this.$refs.rf.style = 'color:#409EFF';
                        this.filterTypeParam = 1002
                    }
                } else {
                    this.$refs.re.style = 'color:#fff';
                    this.$refs.rf.style = 'color:#fff';
                    this.filterTypeParam = -100
                }
                this.initQueryRealtimeAlarm()
            },
            queryEquipClassifyStatList () {
                getEquipClassifyStatList().then(res => {
                    if (res.success) {
                        let pieData = []
                        res.data.forEach(item => {
                            pieData.push({ name: item.classifyDesc, value: item.totalMac })
                        })
                        this.pieOptions.series.push({ type: 'pie', data: pieData, radius: ['0', '50%'], center: [this.$store.state.toPath !== '' ? '25%' : '25%', '50%'], avoidLabelOverlap: false, label: { normal: { show: false, position: 'center' }, emphasis: { show: false, textStyle: { fontSize: '30', fontWeight: 'bold' } } }, labelLine: { normal: { show: false } } })
                        let legend = this.legendData(pieData)
                        this.pieOptions.legend.data = legend
                    }
                })
            },
            legendData (data) {
                let total = 0
                let legend = []
                data.forEach((v, i) => {
                    legend[i] = v.name + ' ' + v.value + ' '
                    total += v.value
                })
                legend.forEach((v, i) => {
                    if (document.documentElement.clientWidth > 1366) {
                        legend[i] = v + '(' + (total === 0 ? 0 : (data[i].value / total * 100).toFixed(2)) + '%)'
                    } else {
                        legend[i] = v.split(' ')[0]
                    }
                    data[i].name = legend[i]
                })
                return legend
            },
            handleDetails (row) {
                let params = {
                    mac: row.mac,
                    resId: row.resId,
                    addr: row.chnlAddr,
                    alarmTime: row.time
                }
                getClosestRealTimeByAlarmTime(params)
                    .then(res => {
                        if (res.success) {
                            this.form = Object.assign(res.data, row)
                            if (typeof this.form.bA !== 'undefined') {
                                this.electricData = [{
                                    name: '电流',
                                    A: typeof this.form.aA !== 'undefined' ? this.form.aA + 'A' : '--',
                                    B: typeof this.form.bA !== 'undefined' ? this.form.bA + 'A' : '--',
                                    C: typeof this.form.cA !== 'undefined' ? this.form.cA + 'A' : '--'
                                }, {
                                    name: '电压',
                                    A: typeof this.form.aV !== 'undefined' ? this.form.aV + 'V' : '--',
                                    B: typeof this.form.bV !== 'undefined' ? this.form.bV + 'V' : '--',
                                    C: typeof this.form.cV !== 'undefined' ? this.form.cV + 'V' : '--'
                                }, {
                                    name: '温度',
                                    A: typeof this.form.aT !== 'undefined' ? this.form.aT + '℃' : '--',
                                    B: typeof this.form.bT !== 'undefined' ? this.form.bT + '℃' : '--',
                                    C: typeof this.form.cT !== 'undefined' ? this.form.cT + '℃' : '--'
                                }]
                            } else {
                                this.electricData = [{
                                    name: '电流',
                                    A: typeof this.form.aA !== 'undefined' ? this.form.aA + 'A' : '--'
                                }, {
                                    name: '电压',
                                    A: typeof this.form.aV !== 'undefined' ? this.form.aV + 'V' : '--'
                                }, {
                                    name: '温度',
                                    A: typeof this.form.aT !== 'undefined' ? this.form.aT + '℃' : '--'
                                }]
                            }
                            this.detailsVisible = true
                            this.detailsTable = [
                                {
                                    title: ' ',
                                    key: 'name',
                                    align: 'center'
                                },
                                {
                                    title: typeof this.form.bA !== 'undefined' ? 'A相' : '单相',
                                    slot: 'A',
                                    align: 'center'
                                },
                                {
                                    title: typeof this.form.bA !== 'undefined' ? 'B相' : ' ',
                                    slot: 'B',
                                    align: 'center'
                                },
                                {
                                    title: typeof this.form.bA !== 'undefined' ? 'C相' : ' ',
                                    slot: 'C',
                                    align: 'center'
                                }

                            ]
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
            },
            headerCellClassName ({ column, columnIndex }) {
                return 'col-blue'
            },
            rowClassName ({ row, rowIndex }) {
                return 'row-green'
            },
            cellClassName ({ row, rowIndex, column, columnIndex }) {
                return 'col-red'
            }
        },
        watch: {}
    }
</script>

<style lang="less" scoped>

#content_bottom{
    width: 100%;
    display: flex;
    justify-content: space-between;
    z-index: 999;
    height: 100%;
    .content_left{
        width: 80%;
        position: relative;
        background: url('../../assets/images/btm.png') no-repeat;
        background-size: 100% 100%;
        height: 100%;
        padding: 20px;
        margin-right: 10px;
        img{
            width: 100%;
        }
        .img_row{
            width: 100%;
            background: url('../../assets/images/bot.gif') no-repeat;
            background-size: 100% 100%;
            height: 35px;
            display: flex;
            align-items: center;
            .img_row_col{
                width: 100%;
                .img_row_art{
                    font-weight: 600;
                    font-size: 14px;
                    color: white;
                }
            }
        }
    }
    .content_right{
        position: relative;
        right: 0;
        background: url('../../assets/images/bgcr.png') no-repeat;
        background-size: 100% 100%;
        height: 100%;
        padding: 20px;
        .img_row{
            width: 100%;
            background: url("../../assets/images/border.gif") no-repeat;
            background-size: 100% 100%;
            height: 35px;
            display: flex;
            align-items: center;
            .img_row_col{
                width: 100%;
                .img_row_art{
                    // font-style:italic;
                    // font-family: 'SimHei';
                    font-weight: 600;
                    font-size: 14px;
                    // text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
                    color: white;
                }
            }
        }
    }
}
/deep/.ivu-modal-footer{
    padding: 0;
}
.c-default {
    color: #fff;
}
.c-default :hover{
    color: #409EFF;
}
.ml-30{
    margin-left: 30px;
}
.tx{
    text-align: center;
    color: #fff;
}
.alarm, .warn{
    width: 30px;
    height :32px;
    text-align: center;
    line-height: 32px;
    border-radius :50%;
    margin-top :-16px;
    -webkit-border-radius: 50%;
    -moz-border-radius :50%;
    border-radius :50%;
    padding: 8px;
    margin-right: 10px;
}

.alarm{background :#F56C6C;}

.warn{
     background :#E6A23C;
}
.ivu-table-cell{
  white-space: nowrap;
}
/deep/.ivu-table-cell:first-child{
    padding: 0;
    margin-right: 10px;
}
/deep/.ivu-table-overflowY{
    &::-webkit-scrollbar{
        display: none;
    }
}
/deep/.ivu-table-cell{
  white-space: nowrap;
}
.tablist{
    span{
        margin-right: 10px;
        width: 30px;
    }
}
@media only screen and (min-width: 1024px){
    .content_left{
        width: 75%;
    }
    .content_right{
        width: 25%;
    }
}
@media only screen and (min-width: 1366px) {
    .content_left{
        width: 77%;
    }
    .content_right{
        width: 23%;
    }

}
@media only screen and (min-width: 1920px) {
    .content_left{
        width: 80.5%;
    }
    .content_right{
         width: 19.5%;
     }

}
</style>
