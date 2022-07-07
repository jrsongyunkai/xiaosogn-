<template>
  <div class="allWarn">
    <div class="head content">
      <div class="head-left">
        <div class="type">
          <Select
            v-model="packetTypes"
            @on-change="handleTypes"
            style="width: 200px"
            placeholder="选择分组类型"
            :clearable='true'
          >
            <Option
              v-for="item in packetList"
              :value="item.id"
              :key="item.id"
              :label="item.type"
            ></Option>
          </Select>
        </div>
        <div class="type">
         <TreeSelect
                placeholder="选择分组"
                multiple
                show-checkbox
                v-model="packetFilter"
                transfer
                :data="packetFilterList"
              />
        </div>
      </div>
      <div class="head-right">
       <div class="dateBnt">
        <span>日期:</span>
        <RadioGroup v-model="dateRadio" @on-change="changedate">
            <Radio label="日"></Radio>
            <Radio label="月"></Radio>
        </RadioGroup>

      </div>
        <div class="date">
          <Row>
            <Col span="12" class="blockLall">
          <DatePicker
            v-show="isDay"
            type="date"
            :value="days"
            style="width: 200px"
            @on-change="changeDM"
            :editable="false"
            :clearable="false"
          ></DatePicker>
          <!-- 月历 -->
          <DatePicker
            type="month"
            :value="mouths"
            style="width: 200px"
            v-show="!isDay"
             :editable="false"
            @on-change="changeDM"
            :clearable="false"
          ></DatePicker>
        </Col>
          </Row>
        </div>
        <div class="search-device">
            <Input
              v-model="device"
              placeholder="输入设备号"
              style="width: 120px"
            />
            <Button type="primary" @click="handleonSubmit">查询</Button>
            <Button @click="reset" class="but">重置</Button>
            <div class="export">
                <Icon custom="icon-v5 icon-v5-daochu" size="20" style="margin-left: 10px" @click="handleExport" />
            </div>

        </div>
      </div>
    </div>
    <div class="allWarn-tabs ">
      <Tabs value="name1" class="content table" v-model="activeName" @on-click='changeTabs'>
        <!-- 用电报警 -->
        <template>
          <TabPane label="用电报警" name="first" >
            <bar-chart :options="alarmOption"></bar-chart>
          </TabPane>
        </template>

        <!-- 用电预警 -->
        <template>
          <TabPane label="用电预警" name="second">
            <bar-chart :options="warnOption"></bar-chart>
          </TabPane>
        </template>
      </Tabs>
      <div class="table content">
          <Table height="320"  :columns="columns" :data="tableData">
              <template slot-scope="{ row }" slot="mac">
                <span class="pointer" style="color:#007EFF" @click="handle(row)">{{row.mac}}</span>
              </template>
              <template slot-scope="{ row }" slot="progress">
               <template v-if="row.progress < 50">
                        <Progress
                            stroke-color='#87d068'
                            :percent="row.progress"
                            :stroke-width="5"
                            :hide-info="true"
                        ></Progress>
                    </template>
                    <template v-if="row.progress > 50">
                        <Progress
                            stroke-color='#FF4F4F'
                             :stroke-width="5"
                            :percent="row.progress"
                            :hide-info="true"
                    ></Progress>
                    </template>
              </template>
              <template slot-scope="{ row }" slot="action">
                <span
                  class="pointer c-primary"
                  style="margin-right: 5px"
                  @click="handleUrge(row.id)"
                  v-if="row.processStatus === 0"
                  >催促</span
                >
                    <template v-if="row.processStatus === 0">
                      <span class="pointer b-danger"
                          @click="handleMaintenance(row)"
                      >未处理</span>
                    </template>
                       <template v-if="row.processStatus === 1">
                      <span class="pointer b-yelo"
                          @click="handleMaintenance(row)"
                      >处理中</span>
                    </template>
                     <template v-if="row.processStatus === 2">
                      <span class="pointer b-success"
                          @click="handleMaintenance(row)"
                      >已处理</span>
                    </template>
              </template>
        </Table>
        <Page :current="currentPage" :total="total" :page-size="pageSize" show-elevator  @on-change="changePage" @on-page-size-change="changesize" />
        <!-- 维保编辑 -->
      </div>

        <Modal v-model="dialogVisible" title="编辑维保" @on-cancel="closeMaintenance" id="modal">
            <maintenance-editor v-if="dialogVisible"  :maintenanceObj="maintenanceObj" @close-maintenance="closeMaintenance"/>
            <div slot="footer"></div>
        </Modal>
        <!-- 设备号 -->
        <Modal id="Details" :model="false" title="设备详情" :lock-scroll="false" :value="detailsFlag" :before-close="handleDetailsClose" width="70%">
            <div slot="header">
                <span class="title">设备详情</span>
                <span class="offline-attention c-danger" v-show="detailsObj.others.online !== 1">设备离线可能是由于设备断电、通讯信号弱、或发生重大事故</span>
            </div>
            <div class="date-picker">
            <DatePicker
              style="width: 135px"
              v-model="detailsValue"
              :type="detailsObj.equipmentType === 6 || detailsObj.equipmentType === 7 ? 'month' : 'date'"
              @on-change="handleDateChange"
              :disabled="$store.state.dateFlag"
              :editable="false"
              :clearable="false"
              :format="detailsObj.equipmentType === 6 || detailsObj.equipmentType === 7 ? 'yyyy-MM' : 'yyyy-MM-dd'"
              placeholder="选择日期">
            </DatePicker>
          </div>
          <div style="height:100%">
              <Details v-if="detailsFlag" :param="detailsObj"/>
          </div>
          <div slot="footer"></div>
        </Modal>
    </div>

  </div>
</template>
<script>
    import '@/styles/pages/allWarn.less';
    import store from '@/store/index'
    import BarChart from '@/pages/Common/Bars';
    import echarts from 'echarts/lib/echarts';
    import MaintenanceEditor from './MaintenanceEditor.vue'
    import Details from '../../Control/Details.vue'
    import { getGroupType, getGroupTree } from '@/api/public';
    import { getDetailOfTypeStats, getDetailOfProject, getfindMaintenance, queryBoxDetails, modifyMacRate, alarmUrgePush } from '@/api/safetyMonitor/allWarn';
    export default {
        components: {
            BarChart, MaintenanceEditor, Details
        },
        data () {
            return {
                dialogVisible: false,
                dateRadio: '日',
                activeName: 'first',
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                newArr: [],
                isDay: true,
                days: '',
                mouths: '',
                device: '',
                typeList: '',
                currentPage: 1,
                total: 0,
                page: 1,
                pageSize: 10,
                rows: 10,
                dateType: 1,
                date: this.$Date().format('YYYY-MM-DD'),
                typeNumbers: -100,
                projectCode: '',
                alarmOption: {
                    legendStatus: false,
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '报警统计（次）'
                    },
                    tooltip: {
                        show: true,
                        trigger: '',
                        formatter: ''
                    }
                },
                warnOption: {
                    legendStatus: false,
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '预警统计（次）'
                    },
                    tooltip: {
                        show: true,
                        trigger: '',
                        formatter: ''
                    }
                },
                nodeId: '',
                tableData: [],
                columns: [
                    {
                        title: '事件ID',
                        key: 'id',
                        align: 'left'
                    },
                    {
                        title: '地点',
                        key: 'address',
                        align: 'left'
                    },

                    {
                        title: '设备号',
                        slot: 'mac',
                        align: 'left'
                    },
                    {
                        title: '设备别名',
                        key: 'boxName',
                        align: 'left'
                    },
                    {
                        title: '线路',
                        key: 'channel',
                        align: 'left'
                    },
                    {
                        title: '报警类型',
                        key: 'info',
                        align: 'left'
                    },
                    {
                        title: '报警时间',
                        key: 'create_time',
                        align: 'left'
                    },
                    {
                        title: '进度',
                        slot: 'progress',
                        align: 'left',
                        width: 150
                    },
                    {
                        title: '耗时',
                        key: 'passTime',
                        align: 'left'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'left'
                    }
                ],
                maintenanceBoxObj: {},
                maintenanceObj: '',
                detailsFlag: false,
                detailsValue: '',
                detailsObj: {
                    'others': {
                        'version': '',
                        'online': ''
                    }
                }
            };
        },
        methods: {
            // 初始化事件
            init () {
                this.days = this.$Date().format('YYYY-MM-DD');
                this.mouths = this.$Date().format('YYYY-MM');
                this.handleTypeStats()
                this.handleProject()
                this.getGroupTypes();
            },
            reset () {
                this.value = ''
                this.treevalue = ''
                this.mouths = ''
                this.days = ''
                this.device = ''
                this.packetTypes = ''
                this.dateRadio = '日';
                this.packetFilter = []
                this.$emit('reset')
            },

            handleTypes (val) {
                this.packetTypes = val;
                this.getGroupTrees();
            },
            getGroupTypes () {
                let params = {
                    projectCode: this.$store.state.projectCode // 'P00000000012'
                };
                getGroupType(params)
                    .then((res) => {
                        //
                        if (res.success) {
                            this.packetList = res && res.data;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            getGroupTrees () {
                // if (!this.packetTypes) {
                //     this.$Message.error({
                //         content: '请先选择分组类型'
                //     });
                // }
                getGroupTree({ groupId: this.packetTypes })
                    .then((res) => {
                        if (res.code === '0') {
                            this.packNewlist = res.data;
                            let resData = this.getTree(res.data);
                            this.packetFilterList = this.cloneTree(resData);
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            cloneTree (score, parentId = 0) {
                let tree = [];
                score.map((item) => {
                    if (item.parentId === parentId) {
                        // 递归寻找
                        item.children = this.cloneTree(score, item.id);
                        tree.push(item);
                    }
                });

                return tree;
            },
            // 递归遍历数组为树状结构
            getTree (tree = []) {
                let arr = [];
                if (!!tree && tree.length !== 0) {
                    tree.forEach((item) => {
                        let obj = {};
                        obj.id = item.id;
                        obj.value = item.id;
                        obj.parentId = item.parentId;
                        obj.title = item.name;
                        // 其他你想要添加的属性
                        obj.expand = true;
                        obj.selected = false;
                        obj.checked = false;
                        obj.children = this.getTree(item.children); // 递归调用
                        arr.push(obj);
                    });
                }
                return arr;
            },

            getListid (val) {
                val.map((itm) => {
                    this.packNewlist.map((item) => {
                        if (JSON.stringify(item).toLowerCase().indexOf(itm) > -1) {
                            // let index = JSON.stringify(item).toLowerCase().indexOf(itm);
                            this.newArr.push(item.id);
                        }
                        return this.newArr;
                    });
                });
                // let idArr = this.newArr.map((item) => item.id);
                this.packetFilter = this.unique(this.newArr);
                // this.queryList();
            },
            unique (arr) {
                return Array.from(new Set(arr));
            },
            // 改变时间类型
            changedate (dateType) {
                // 改变日月
                // e == 1 ? (this.isDay = true) : (this.isDay = false);//三元运算符
                if (dateType === '日') {
                    // 日
                    this.isDay = true;
                    this.dateType = 1
                } else {
                    // 月
                    this.isDay = false;
                    this.dateType = 2
                }
                this.init()
            },
            // 获取到echarts数据
            handleTypeStats () {
                var params = {
                    dateType: this.dateType,
                    date: this.date,
                    typeNumbers: this.activeName === 'first' ? -100 : -200,
                    projectCode: this.$store.state.projectCode,
                    mac: this.device,
                    nodeId: this.packetFilter ? this.packetFilter.join() : this.packetFilter
                }

                getDetailOfTypeStats(params).then((r) => {
                    this.flag = true
                    if (r.success) {
                        let that = this
                        this.alarmOption.xAxis = []
                        this.alarmOption.series = []
                        this.warnOption.xAxis = []
                        this.warnOption.series = []
                        let bardata = { value: [], legend: [], typeNos: [] }
                        let _bardata = { value: [], legend: [], typeNos: [] }
                        r.data.forEach(function (item, index) {
                            if ([1, 2, 3, 4, 5, 6, 7, 8, 11, 17, 18, 19, 1007, 1008, 1009].indexOf(item.typeNumber) !== -1) {
                                if (item.typeNumber === 4 || item.typeNumber === 1008) {
                                    bardata.typeNos.forEach(function (v, i) {
                                        if (v === 3) {
                                            bardata.value[i] += item.number
                                            that.alarmOption.xAxis[i] = '过载过流'
                                        }
                                    })
                                } else if (item.typeNumber === 18 || item.typeNumber === 19) {
                                    bardata.typeNos.forEach(function (_v, _i) {
                                        if (_v === 17) {
                                            bardata.value[_i] += item.number
                                            that.alarmOption.xAxis[_i] = '三相报警'
                                        }
                                    })
                                } else if (item.typeNumber === 1007) {
                                    bardata.typeNos.forEach(function (_v, _i) {
                                        if (_v === 5) {
                                            bardata.value[_i] += item.number
                                            that.alarmOption.xAxis[_i] = '过压报警'
                                        }
                                    })
                                } else if (item.typeNumber === 1009) {
                                    bardata.typeNos.forEach(function (_v, _i) {
                                        if (_v === 7) {
                                            bardata.value[_i] += item.number
                                            that.alarmOption.xAxis[_i] = '温度报警'
                                        }
                                    })
                                } else {
                                    bardata.value.push(item.number)
                                    bardata.typeNos.push(item.typeNumber)
                                    that.alarmOption.xAxis.push(item.info)
                                }
                            } else {
                                if (item.typeNumber !== 1001) {
                                    _bardata.value.push(item.number)
                                    _bardata.typeNos.push(item.typeNumber)
                                    that.warnOption.xAxis.push(item.info)
                                }
                            }
                        })
                        this.alarmOption.series.push({
                            type: 'bar',
                            barMaxWidth: '15',
                            data: bardata.value,
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 1, 0, 0, // 这里不同的排序会出现不同的效果   查看4 渐变规则
                                        [
                                            { offset: 1, color: '#ca3939' }, // 红
                                            // 可以加0.2等
                                            { offset: 0, color: 'rgba(26, 32, 46,.2)' } // 黑
                                        ]
                                    ),
                                    label: {
                                        show: false,
                                        position: 'top',
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                }
                            }
                        })
                        this.warnOption.series.push({
                            type: 'bar',
                            barMaxWidth: '15',
                            data: _bardata.value,
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 1, 0, 0, // 这里不同的排序会出现不同的效果   查看4 渐变规则
                                        [
                                            { offset: 1, color: '#ca3939' }, // 红
                                            // 可以加0.2等
                                            { offset: 0, color: '#1f212e' } // 黑
                                        ]
                                    ),
                                    label: {
                                        show: false,
                                        position: 'top',
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                }
                            }
                        })
                        this.flag = true
                    } else if (r.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: r.message
                        })
                    }
                })
            },
            // 获取到列表数据
            handleProject () {
                var params = {
                    page: this.page,
                    rows: this.pageSize,
                    dateType: this.dateType,
                    date: this.date,
                    typeNumbers: this.activeName === 'first' ? -100 : -200,
                    projectCode: this.$store.state.projectCode,
                    mac: this.device,
                    nodeIds: this.packetFilter ? this.packetFilter.join() : this.packetFilter
                }
                getDetailOfProject(params).then((r) => {
                    if (r.success) {
                        this.tableData = r.datas
                        this.$set(this.tableData)
                        this.total = r.total
                        this.currentPage = this.page
                    } else if (r.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: r.message
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
            // 搜索设备
            handleonSubmit () {
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    this.init();
                }
            },
            changeTabs (e) {
                this.activeName = e;
                this.init()
            },
            changeDM (dates) {
                // 改变日期
                // 直接把所需要的日期和日期类型传过去
                if (this.isDay) {
                    // 日
                    this.date = dates;
                } else {
                    // 月
                    this.date = dates;
                }
                this.init()
            },
            changePage (val) {
                this.page = val
                this.init()
            },
            changesize (val) {
                this.pageSize = val
                this.init()
            },
            // 催促
            handleUrge (id) {
                alarmUrgePush({ id: id })
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
                    })
            },
            // 设备号详情
            handle (row) {
                queryBoxDetails({ 'mac': row.mac })
                    .then(res => {
                        if (res.success) {
                            this.detailsObj = res.data
                            store.commit('mac', this.detailsObj.mac)
                            store.commit('equipmentType', this.detailsObj.equipmentType)
                            if (this.detailsObj.equipmentType === 6 || this.detailsObj.equipmentType === 7) {
                                this.detailsValue = this.$func.getCurrentYearMonth()
                            } else {
                                this.detailsValue = this.$func.getNowFormatDate()
                            }
                            store.commit('historyDate', this.detailsValue)
                            this.detailsFlag = true
                            this.handleModifyMacRate(this.detailsObj.mac, true)
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
            handleModifyMacRate (mac, flag) {
                if (!mac) return false
                modifyMacRate({ 'fastMac': (flag === true ? mac : ''), 'slowMac': (flag === true ? '' : mac) })
            },
            // 关闭
            handleDetailsClose () {
                if (this.detailsObj.equipmentType === 6 || this.detailsObj.equipmentType === 7) {
                    this.detailsValue = this.$func.getCurrentYearMonth()
                    store.commit('historyDate', this.$func.getCurrentYearMonth())
                } else {
                    this.detailsValue = this.$func.getNowFormatDate()
                    store.commit('historyDate', this.$func.getNowFormatDate())
                }
                store.commit('detailsAddr', '')
                this.handleModifyMacRate(this.$store.state.mac, false)
                store.dispatch('resetMac')
                this.detailsFlag = false
            },
            handleDateChange (val) {
                this.value = val
                store.commit('historyDate', val)
            },
            // 维保编辑
            handleMaintenance (obj) {
                let params = {
                    mac: obj.mac,
                    alarmId: obj.id,
                    id: ''
                }
                getfindMaintenance(params)
                    .then(res => {
                        if (res.success) {
                            store.commit('maintenanceObj', res.data)
                            store.commit('alarmId', obj.id)
                            this.maintenanceObj = obj
                            this.dialogVisible = true
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
                    .catch(res => {
                        this.$Message.error({ content: '未知错误，请刷新重试' })
                    })
            },
            handleExport () {
                this.$func.windowCountDown('/project/main/v2/xls/alarmDetailOfProject.as?' + 'typeNumbers=0&dateType=' + this.dateType + '&date=' + (this.dateType === 1 ? this.days : this.mouths) + '&projectCode=' + this.$store.state.projectCode + '&oqp1=' + this.$store.state.projectName + '&mac=' + this.device + '&nodeIds=' + this.packetFilter)
            },
            // 维保编辑取消
            closeMaintenance () {
                store.dispatch('resetMaintenanceObj')
                this.dialogVisible = false
                this.init()
            }
        },
        created () {

        },
        mounted () {
            this.init();
        },
        computed: {
        }
    };
</script>
<style lang="less" scoped>
.allWarn {
  .c-success {
    color: #67C23A;
  }
  .c-danger {
    color: #F56C6C;
  }
  .pointer{
      cursor: pointer;
      &:hover{
        color: #409eff;
      }
  }
  .head {
    width: 100%;
    padding: 10px 0px;
    display: flex;
    margin-bottom: 10px;
    margin-top: 60px;
    .head-left {
      display: flex;
      align-items: center;
      .type {
          margin: 0px 10px;
        span {
          margin: 0px 8px;
        }
      }
    }
    .head-right {
      display: flex;
      align-items: center;
      margin-left: 60px;
       .dateBnt{
           display: flex;
           align-items: center;
            span{
                margin-right: 10px;
            }
        }
      .date {
        display: flex;
        span {
          margin: 7px 8px;
        }
      }
      .search-device {
        display: flex;
        align-items: center;
        margin-left: 10px;
        Button {
          margin-left: 10px;
        }
      }
    }
  }
  .allWarn-tabs {
    width: 100%;
    // background: #151518;

    margin-top: 10px;
    #main1,
    #main2 {
      width: 100%;
      height: 500px;
    }
    .state {
      color: #67c23a;
    }
  }
.table{
    margin-top: 10px;
    padding: 20px;
}
}
.export{
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007EFF;
    border-radius: 5px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    .ivu-icon{
        color: #007EFF;
        margin: 0 !important;
    }
}
/deep/.ivu-progress-inner{
    background-color: #454a56;
}
/deep/.ivu-table-cell{
  white-space: nowrap;
}
/deep/.ivu-modal-footer{
    border: none;
}
</style>
