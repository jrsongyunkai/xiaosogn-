<template>
  <div class="leakage">
    <div class="head content">
      <div class="head-left">
        <div class="type">
          <Select
          :clearable='true'
                transfer
                v-model="packetTypes"
                placeholder="选择分组类型"
                class="en-unit"
                style="width: 200px"
                @on-change="handleTypes"
              >
                <Option
                  v-for="item in packetList"
                  :key="item.id"
                  :label="item.type"
                  :value="item.id"
                ></Option>
              </Select>
        </div>
        <div class="type">
          <TreeSelect
                placeholder="选择分组"
                multiple
                show-checkbox
                v-model="packetFilter"
                @on-change="handleFilter"
                transfer
                :data="packetFilterList"
              />
        </div>
      </div>
      <div class="head-right">
        <div class="dateBnt">
          <span>日期:</span>
          <RadioGroup v-model="dateRadio" @on-change="handleDatePicker">
            <Radio label="日"></Radio>
            <Radio label="月"></Radio>
        </RadioGroup>

        </div>
        <div class="date">
          <Row>
            <Col span="12" class="blockLleakage">
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
                v-model="month"
                type="month"
                :value="mouths"
                style="width: 200px"
                v-show="!isDay"
                @on-change="changeDM"
                 :editable="false"
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
        </div>
      </div>
    </div>
    <div class="leakage-content">
      <div class="mymain content table" >
        <div class="typeC">
          <span>
            <div class="active active1"></div>
            <h6>安全</h6>
          </span>
          <span>
            <div class="active active2"></div>
            <h6>预警</h6>
          </span>
          <span>
            <div class="active active3"></div>
            <h6>报警</h6>
          </span>
        </div>
        <bar-chart :options="leakageOption"></bar-chart>

      </div>
      <div class="table content">
        <Table height="320" :columns="columns" :data="tableData">
        <template slot-scope="{ row }" slot="mac">
          <span class="pointer c-primary" @click="handle(row)">{{ row.mac }}</span>
        </template>
        <template slot-scope="{ row }" slot="action">

          <Tooltip content="线路明细" placement="top">
              <span
                size="30"
                class="c-primary pointer"
                style="margin-right:10px"
                custom="icon-v5 icon-v5-xianlu"
                @click="lineLeakageDetail(row.address, row.mac)"
              >线路明细</span>
            </Tooltip>
            <Tooltip content="历史趋势" placement="top">
              <span
                size="30"
                class="c-primary pointer"
                custom="icon-v5 icon-v5-qushi"
                @click="leakageTrend(row.address, row.mac)"
              >历史趋势</span>
            </Tooltip>
        </template>
      </Table>
      <Page
        :current="currentPage"
        :total="total"
        :page-size="pageSize"
        show-elevator
        @on-change="changePage"
        @on-page-size-change="changesize"
      />
      </div>

      <!-- 线路明细 -->
      <Modal :title="addr" width="30%" v-model="dialogTableVisible">
        <Table :data="lineDetail" :columns="trendlines">

        </Table>
        <div slot="footer"></div>
      </Modal>

      <Modal :title="addr" id="lines" v-model="trendDialog">
        <Row class="pickDate" style="display: flex;align-items: center;">
            <div class="dateBnt2">
              <span>日期:</span>
              <RadioGroup v-model="dateRadio2" @on-change="handleTrendPicker">
                <Radio label="日"></Radio>
                <Radio label="月"></Radio>
            </RadioGroup>
            </div>

            <div class="block" v-show="trendPicker === '日'">
              <DatePicker
                v-model="trendValue"
                type="date"
                :editable="false"
                :clearable="false"
                value-format="yyyy-MM-dd"
                @on-change="handleTrendDayPicker"
              >
              </DatePicker>
            </div>
            <div class="block" v-show="trendPicker === '月'">
              <DatePicker
                v-model="trendMonth"
                value-format="yyyy-MM"
                type="month"
                :editable="false"
                :clearable="false"
                @on-change="handleTrendMonthPicker"
              >
              </DatePicker>
            </div>
        </Row>
        <div class="typeC" >
          <span>
            <div class="active active1"></div>
            <h6>安全</h6>
          </span>
          <span>
            <div class="active active2"></div>
            <h6>预警</h6>
          </span>
          <span>
            <div class="active active3"></div>
            <h6>报警</h6>
          </span>
        </div>
        <bar-chart v-if="trendFlag" :options="trendOptions"></bar-chart>

        <Table height="300" :data="trendData" :columns="trendHistory"></Table>
         <div slot="footer"></div>
      </Modal>

      <Modal
        title="设备详情"
        id="Details"
        v-model="detailsFlag"
        width="1606px"
      >
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
        <Details v-if="detailsFlag" :param="detailsObj"></Details>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>
<script>
    import BarChart from '@/pages/Common/Bars';
    import '@/styles/pages/leakage.less';
    import { getGroupType, getGroupTree } from '@/api/public';
    import {
        getCurrentRealtime,
        getCurrentStats,
        queryChannels,
        leakageStats,
        queryBoxDetails,
        modifyMacRate
    } from '@/api/safetyMonitor/leakage';
    import store from '@/store/index';
    import Details from '../../Control/Details.vue';
    import echarts from 'echarts/lib/echarts';
    export default {
        components: {
            BarChart,
            Details
        },
        data () {
            return {
                dialogVisible: false,
                dateRadio: '日',
                dateRadio2: '日',
                activeName: 'first',
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                days: '',
                mouths: '',
                isDay: true,
                month: this.$Date().format('YYYY-MM'),
                device: '',
                typeList: '',
                currentPage: 1,
                total: 0,
                page: 1,
                pageSize: 10,
                rows: 10,
                dateType: 1,
                date: this.$Date().format('YYYY-MM-DD'),
                trendValue: this.$func.getNowFormatDate(),
                trendMonth: this.$func.getCurrentYearMonth(),
                typeNumbers: -100,
                projectCode: '',
                leakageOption: {
                    legendStatus: false,
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '漏电情况'
                    },
                    nameY: '毫安（mA）',
                    tooltip: {
                        show: true,
                        trigger: '',
                        formatter: ''
                    }
                },
                trendOptions: {
                    legendStatus: false,
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '漏电情况'
                    },
                    nameY: '毫安（mA）',
                    nameX: '小时',
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
                        title: '漏电流(单位:毫安)',
                        key: 'number',
                        align: 'left'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'left'
                    }
                ],
                trendlines: [
                    {
                        title: '线路名称',
                        key: 'title',
                        align: 'left'
                    },
                    {
                        title: '漏电流(毫安)',
                        key: 'gLd',
                        align: 'left'
                    }
                ],
                trendHistory: [
                    {
                        title: '时间',
                        key: 'time',
                        align: 'left'
                    },
                    {
                        title: '漏电流(毫安)',
                        key: 'number',
                        align: 'left'
                    }
                ],
                addr: '',
                lineDetail: [],
                trendData: [],
                dialogTableVisible: false,
                trendDateType: 1,
                trendDate: '',
                trendFlag: false,
                trendDialog: false,
                trendPicker: '日',
                trendLoading: false,
                detailsFlag: false,
                detailsObj: {
                    others: {
                        version: '',
                        online: ''
                    }
                },
                detailsValue: '',
                newArr: []
            };
        },
        methods: {
            // 初始化事件
            init () {
                this.days = this.$Date().format('YYYY-MM-DD');
                this.mouths = this.$Date().format('YYYY-MM');
                this.handleLeakageStats();
                this.handleRealtime();
            },
            reset () {
                this.packetTypes = ''
                this.packetFilterList = []
                this.days = ''
                this.mouths = ''
                this.device = ''
                this.dateRadio = '日';
                this.$emit('reset')
            },
            // 分组类型
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
            handleFilter (val) {
                this.pageNo = 1;
                this.getListid(val);
                //
                // this.packetFilter = packList
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
            handleDatePicker (dateType) {
                // 改变日月
                // e == 1 ? (this.isDay = true) : (this.isDay = false);//三元运算符
                if (dateType === '日') {
                    // 日
                    this.isDay = true;
                    this.dateType = 1;
                    this.leakageOption.title.text = '漏电情况';
                } else {
                    // 月
                    this.isDay = false;
                    this.dateType = 2;

                    this.leakageOption.title.text = this.$func.getMonthText(this.month) + '漏电情况';
                }
                this.init();
            },
            // 获取到echarts数据
            handleLeakageStats () {
                this.leakageOption.xAxis = [];
                this.leakageOption.series = [];
                this.$nextTick(function () {
                    var that = this;
                    var params = {
                        dateType: this.dateType,
                        date: this.date,
                        projectCode: this.$store.state.projectCode,
                        mac: this.device,
                        nodeId: this.nodeId
                    };
                    getCurrentStats(params).then((r) => {
                        if (r.success) {
                            let barData = [];
                            r.data.forEach(function (item, index) {
                                barData.push({
                                    value: item.number,
                                    name: '漏电流值',
                                    type: 'bar',
                                    itemStyle: { color: '' }
                                });
                                that.leakageOption.xAxis.push(item.time);

                                if (item.number < 300 || item.number === '-') {
                                    barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(26, 32, 46,.2)'
                                    }, {
                                        offset: 1,
                                        color: '#87cf86'
                                    }])
                                } else if (item.number >= 300 && item.number < 1500) {
                                    barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(26, 32, 46,.2)'
                                    }, {
                                        offset: 1,
                                        color: '#E79C27'
                                    }])
                                } else {
                                    barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(26, 32, 46,.2)'
                                    }, {
                                        offset: 1,
                                        color: '#F26665'
                                    }])
                                }
                            });
                            that.leakageOption.series.push({
                                type: 'bar',
                                barMaxWidth: '15',
                                data: barData
                            });
                        } else if (r.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: r.message
                            });
                        }
                    });
                });
            },
            // 获取到列表数据
            handleRealtime () {
                var params = {
                    page: this.page,
                    rows: this.pageSize,
                    dateType: this.dateType,
                    date: this.date,
                    projectCode: this.$store.state.projectCode,
                    mac: this.device,
                    nodeIds: this.nodeId
                };
                getCurrentRealtime(params)
                    .then((r) => {
                        if (r.success) {
                            this.tableData = r.datas;
                            this.total = r.total;
                            this.currentPage = this.page;
                        } else if (r.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: r.message
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
            // 搜索设备
            handleonSubmit () {
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    this.init();
                }
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
                this.init();
            },
            // 获取进退页面数
            changePage (val) {
                this.page = val;
                this.init();
            },
            // 获取点击页面数
            changesize (val) {
                this.pageSize = val;
                this.init();
            },
            // 线路详细
            queryChannels (addr, mac) {
                let params = {
                    mac: mac
                };
                queryChannels(params)
                    .then((res) => {
                        if (res.success) {
                            this.lineDetail = res.datas;

                            this.addr = '【' + addr + '】' + '的' + '线路' + ' ' + '漏电流明细';
                            this.dialogTableVisible = true;
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
            lineLeakageDetail (addr, mac) {
                this.queryChannels(addr, mac);
            },
            // 历史趋势
            leakageTrend (addr, mac) {
                this.mac = mac;
                this.trendDialog = true;
                this.addr = '【' + addr + '】' + '的' + '漏电流' + ' ' + '历史趋势';
                this.initTrend();
            },
            initTrend () {
                let that = this;
                this.$nextTick(function () {
                    this.trendLoading = true;
                    let params = {
                        page: 1,
                        limit: 31,
                        dateType: this.trendDateType,
                        date: this.trendDate ? this.trendDate : this.$func.getNowFormatDate(),
                        projectCode: this.$store.state.projectCode,
                        // projectCode: 'P00000000012',
                        mac: this.mac
                    };
                    leakageStats(params)
                        .then((res) => {
                            this.trendOptions.xAxis = [];
                            this.trendOptions.series = [];
                            if (res.success) {
                                let barData = [];
                                this.trendData = res.data;
                                res.data.forEach(function (item, index) {
                                    barData.push({
                                        value: item.number,
                                        name: '漏电流值',
                                        type: 'bar',
                                        barMaxWidth: '30',
                                        itemStyle: { color: '' }
                                    });
                                    that.trendOptions.xAxis.push(item.time);
                                    if (item.number < 300 || item.number === '-') {
                                        barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                            offset: 0,
                                            color: 'rgba(26, 32, 46,.2)'
                                        }, {
                                            offset: 1,
                                            color: '#87cf86'
                                        }])
                                    } else if (item.number >= 300 && item.number < 1500) {
                                        barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                            offset: 0,
                                            color: 'rgba(26, 32, 46,.2)'
                                        }, {
                                            offset: 1,
                                            color: '#E79C27'
                                        }])
                                    } else {
                                        barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                            offset: 0,
                                            color: 'rgba(26, 32, 46,.2)'
                                        }, {
                                            offset: 1,
                                            color: '#F26665'
                                        }])
                                    }
                                });
                                this.trendOptions.series.push({
                                    type: 'bar',
                                    data: barData,
                                    itemStyle: {
                                        normal: { color: {} }
                                    }
                                });

                                this.trendFlag = true;
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
                        })
                        .finally(() => {
                            this.trendLoading = false;
                    });
                });
            },
            handleCloseTrend () {
                this.trendPicker = '日';
                this.trendValue = this.$func.getNowFormatDate();
                this.trendMonth = this.$func.getCurrentYearMonth();
            },
            handleTrendDayPicker (val) {
                this.trendDateType = 1;
                this.trendDate = val;
                this.trendValue = val;
                this.trendOptions.title.text = '漏电情况';
                this.initTrend();
            },
            handleTrendMonthPicker (val) {
                this.trendDateType = 2;
                this.trendDate = val;
                this.trendMonth = val;
                this.trendOptions.title.text = this.$func.getMonthText(val) + '漏电情况';
                this.initTrend();
            },
            // 历史趋势中的切换日月
            handleTrendPicker (val) {
                if (val === '日') {
                    this.trendDateType = 1;
                    this.trendDate = this.trendValue;
                    this.trendOptions.nameY = '毫安（mA）';
                    this.trendOptions.nameX = '小时';
                } else {
                    this.trendDateType = 2;
                    this.trendDate = this.trendMonth;
                    this.trendOptions.nameY = '毫安（mA）';
                    this.trendOptions.nameX = '日';
                    this.trendOptions.title.text =
                        this.$func.getMonthText(this.trendMonth) + '漏电情况';
                }
                this.trendPicker = val;
                this.initTrend();
            },
            // 线路详细
            handle (row) {
                queryBoxDetails({ mac: row.mac })
                    .then((res) => {
                        if (res.success) {
                            this.detailsObj = res.data;
                            store.commit('mac', this.detailsObj.mac);
                            store.commit('equipmentType', this.detailsObj.equipmentType);

                            if (
                                this.detailsObj.equipmentType === 6 ||
                                this.detailsObj.equipmentType === 7
                            ) {
                                this.detailsValue = this.$func.getCurrentYearMonth();
                            } else {
                                this.detailsValue = this.$func.getNowFormatDate();
                            }

                            store.commit('historyDate', this.detailsValue);
                            this.detailsFlag = true;
                            this.handleModifyMacRate(this.detailsObj.mac, true);
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
            handleDetailsClose () {
                if (
                    this.detailsObj.equipmentType === 6 ||
                    this.detailsObj.equipmentType === 7
                ) {
                    this.detailsValue = this.$func.getCurrentYearMonth();
                    store.commit('historyDate', this.$func.getCurrentYearMonth());
                } else {
                    this.detailsValue = this.$func.getNowFormatDate();
                    store.commit('historyDate', this.$func.getNowFormatDate());
                }
                store.commit('detailsAddr', '');
                this.handleModifyMacRate(this.$store.state.mac, false);
                store.dispatch('resetMac');
                this.detailsFlag = false;
            },
            handleModifyMacRate (mac, flag) {
                if (!mac) return false;
                modifyMacRate({
                    fastMac: flag === true ? mac : '',
                    slowMac: flag === true ? '' : mac
                });
            },
            handleDateChange (val) {
                this.value = val;
                store.commit('historyDate', val);
            }
        },

        created () {

        },
        mounted () {
            this.getGroupTypes();
            this.init();
        }
    };
</script>
<style lang="less" scoped>
.table{
    margin-top: 10px;
    padding: 20px;
  }
.leakage {
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
         margin:0 10px;
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
  .leakage-content {
    #main1 {
      width: 100%;
      height: 500px;
    }
    .mymain {
      .typeC {
        display: flex;
        justify-content:flex-end;
        margin-right: 20px;
        position: absolute;
        right: 0;
        span {
          display: flex;
          align-items: center;
          .active {
            width: 10px;
            height: 10px;
            margin: 0px 10px;
          }
          .active1 {
            background: #87cf86;
          }
          .active2 {
            background: #e79c27;
          }
          .active3 {
            background: #f26665;
          }
          h6 {
            font-size: 8px;
          }
        }
      }
    }
  }

  .pointer {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
.date-picker {
  position: absolute;
  right: 40px;
  top: 14px;
  z-index: 999;
  button {
    width: 30px;
    height: 30px;
    padding: 0 8px;
    margin-right: 10px;
  }
  .circle {
    height: 30px;
    width: 30px;
    padding: 3px;
    margin-right: 10px;
  }
  span {
    margin-right: 5px;
  }
  /deep/.ivu-table-cell{
    white-space: nowrap;
  }

}
.dateBnt2{
    margin-left: 20px;
    .ivu-radio-wrapper{
        margin-left:8px;
        margin-right:8px;
    }
}
</style>
