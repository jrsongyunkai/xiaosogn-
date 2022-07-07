<template>
  <div id="reportALL">
    <!-- 顶部 -->
    <div class="top">
      <Select
        :clearable="true"
        v-model="model2"
        style="width: 260px; margin-left: 10px"
        @on-change="changeMonth"
        placeholder="请选择月份"
      >
        <Option v-for="item in Month" :value="item.value" :key="item.value">{{
          item.label
        }}</Option>
      </Select>
      <Button
        @click="create"
        style="
          background: #007eff;
          color: #fff;
          border: none;
          margin-left: 10px;
        "
        type="primary"
        >生成</Button
      >
      <Button @click="output" style="margin-left: 10px">下载</Button>
    </div>
    <div>
      <Tag
        v-if="show"
        @on-close="handleClose"
        closable
        class="tab"
        color="primary"
        ><Icon color="#999" type="md-chatboxes" />
        <span style="color: #999; margin-left: 10px"
          >请选择上方的筛选条件生成统计报告</span
        >
      </Tag>
    </div>
    <!-- <pie :options="typeAlarmTypes" /> -->
    <div class="main" :style="isReport ? 'height: 680px;' : 'height: 4000px;'">
      <div v-if="isReport" class="report" @click="create">
        <img
          src="@/assets/images/nodata.png"
          alt=""
          style="width: 250px; height: 250px"
        />
        <div>暂无数据，点击上方数据生成报告</div>
      </div>
      <main v-else>
        <div style="height: 3900px" class="EnergyA"  v-watermark>
          <h1>分析报告</h1>
          <h3 class="h3">检测周期按月提报</h3>
          <!-- <span style="color:#333">生成时间：{{ $Date().format('YYYY-MM-DD HH:mm:ss') }}</span> -->
          <h2 style="margin-top: 20px; color: black">1、设备概况</h2>
          <Row class="macState">
            <Col span="7">
              <h4>项目名称</h4>
              <h3>{{ macState.prjName }}</h3>
              <br />
              <br />
              <h4>联系电话</h4>
              <h3>{{ macState.linkTel }}</h3>
            </Col>
            <Col span="7">
              <h4>客户名称</h4>
              <h3>{{ macState.linkMan }}</h3>
              <br />
              <br />
              <h4>设备总数</h4>
              <h3>{{ macState.macTotal }}</h3>
            </Col>
            <Col span="7">
              <h4>项目地址</h4>
              <h3>
                {{
                  macState.prjLocation.address === ''
                    ? '深圳曼顿科技有限公司'
                    : macState.prjLocation.address
                }}
              </h3>
            </Col>
          </Row>
          <h2 style="margin-top: 20px; color: black">2、报警分析</h2>
          <Row class="warntype">
            <Col span="21">
              <h4>2.1、报警类型</h4>
              <p style="height: 350px; color: black">
                <pie :options="typeAlarmTypes" />
              </p>
            </Col>
          </Row>
          <Row class="warntype" style="margin-top:30px">
            <Col span="21">
              <h4>2.2、预警类型</h4>
              <p style="height: 350px">
                <pie :options="typeAlarmTypes2" />

              </p>
            </Col>
          </Row>
          <br />
          <Row class="warntype" >
            <Col span="21">
              <h4>2.3、报警/预警趋势</h4>
              <p style="height: 262px">
                <bar :options="barOptions"></bar>
              </p>
            </Col>
          </Row>

          <br /><br />><br /><br /><br />><br />
          <Row class="warntype" style="height: 370px">
            <Col span="21">
              <h4>2.4、报警排名</h4>
              <p style="height: 354px">
                <BarChart :options="alarmOption"></BarChart>
              </p>
            </Col>
          </Row>

          <h2 style="margin: 30px; color: black; margin-top: 30px">
            3、用能分析
          </h2>
          <p></p>

          <br />
          <Row class="warntype" style="height: 400px">
            <Col span="21">
              <h4>3.1、用能概况</h4>
              <h3 style="color: black">
                本监测周期内，总的用电负荷kW-h，监测周期内用能情况曲线如下:
              </h3>
              <p style="height: 334px">
                <BarChart :options="alarmOption1"></BarChart>
              </p>
            </Col>
          </Row>
          <br />
          <Row>
            <Col span="21">
              <h4>3.1、用能概况</h4>
              <h3 style="color: black">用能排名前十的电箱/线路</h3>
              <div class="table">
                <Table
                  highlight-row
                  ref="currentRowTable"
                  :columns="columns2"
                  :data="naturalList"
                ></Table>
              </div>
            </Col>
          </Row>
          <br />
          <br />
          <h2 style="margin: 30px; color: black; margin-top: 50px">
            4、用能行为简报
          </h2>
          <p></p>
          <Row class="macState" style="height: 100px">
            <Col span="7">
              <h4>4.1、在线设备</h4>
              <h3 style="font-weight: 23px; color: #21f27f">
                {{ EmaginData.totalOnlineMac }}
              </h3>
            </Col>
            <Col span="7">
              <h4>4.2、离线设备</h4>
              <h3 style="font-weight: 23px">
                {{ EmaginData.totalOfflineMac }}
              </h3>
            </Col>

            <Col span="7">
              <h4>4.3、巡检得分</h4>
              <h3 style="font-weight: 23px; color: #21f27f">-</h3>
            </Col>
          </Row>
          <h4
            style="margin: 30px; position: relative; top: 0px; color: #f24e4c"
          >
            建议如下︰通过对设备巡检、报警统计、工单处理、用能情况的综合评判，相对优质，需贵单位加强安全用电及用能管理。
          </h4>
          <h4
            style="margin: 30px; color:'font-weight:18px; black;position:relative;top:20px;z-index:555"
          >
            工单管理系统4个板块内容
          </h4>
          <Row class="macState">
            <Col span="5">
              <h5 style="font-weight: 18px">用电安全隐患数量</h5>
              <h5 style="font-weight: 18px; color: #333333">
                {{ lastdata.hiddenDangerCount }}
              </h5>
            </Col>
            <Col span="5">
              <h5 style="font-weight: 18px">处理中</h5>
              <h5 style="font-weight: 18px; color: #333333">
                {{ lastdata.workOrderProcessingCount }}
              </h5>
            </Col>

            <Col span="5">
              <h5 style="font-weight: 18px">完成工单</h5>
              <h5 style="font-weight: 18px; color: #333333">
                {{ lastdata.workOrderProcessingCount }}
              </h5>
            </Col>

            <Col span="5">
              <h5 style="font-weight: 18px">分析报告</h5>
              <h5 style="font-weight: 18px; font-size: 18px; color: #333333">
                —
              </h5>
            </Col>
          </Row>
        </div>
        <!-- <div class="EnergyA" v-watermark>
          <div class="data">
            <header>
              <img src="../../../assets/images/wordhead.png" alt="" />
            </header>
            <div class="count">
              <h1>分析报道</h1>
              <div class="tille">检测周期按月提报</div>
              <div class="statement">
                （本平台根据本月所采集数据为基准，运动电能管理理论和统计学原理等对项目所用电情况作出分析判断，若本报告所提供的数据
                与国网数据不一致，则以国网数据为准。）
              </div>
            </div>
            <footer>
              <img src="../../../assets/images/wordfooter.png" alt="" />
            </footer>
          </div>

          <div class="data" style="margin-top: 20px">
            <header>
              <img src="../../../assets/images/wordhead.png" alt="" />
            </header>
            <div class="Basicdata">
              <div class="text">1、基础概况</div>
              <Row class="basic">
                <Col :span="8">
                  <div class="tpye">项目名称</div>
                  <div class="name">{{ macState.prjName }}</div>
                </Col>
                <Col :span="8">
                  <div class="tpye">客户名称</div>
                  <div class="name">{{ macState.linkMan }}</div>
                </Col>
                <Col :span="8">
                  <div class="tpye">项目地址</div>
                  <div class="name">
                    {{
                      macState.prjLocation.address === ""
                        ? "深圳曼顿科技有限公司"
                        : macState.prjLocation.address
                    }}
                  </div>
                </Col>
              </Row>
              <Row class="basic">
                <Col :span="7">
                  <div class="tpye">联系电话</div>
                  <div class="name">{{ macState.linkTel }}</div>
                </Col>
                <Col :span="7">
                  <div class="tpye">设备总数</div>
                  <div class="name">{{ macState.macTotal }}</div>
                </Col>
              </Row>
            </div>

            <div class="Basicdata">
              <div class="text">2、报警分析</div>

            </div>
            <footer>
              <img src="../../../assets/images/wordfooter.png" alt="" />
            </footer>
          </div>
        </div> -->
      </main>
    </div>
  </div>
</template>
<script>
// 引入分组的api

    import { groupingList, tree } from '@/api/safetyMonitor/public';
    import {
        queryTable,
        powerConsumptionTrend,
        workOrderStatistics,
        getGroupType,
        getGroupTree
    } from '@/api/public';
    import screenPie from './NestPie.vue';
    import screeBar from './screeBar';
    import {
        getPrejectData,
        getEmaginData,
        queryAlarmTrend
    } from '@/api/multiManage/report';
    import { alarmTypeDistribution, alarmTrend } from '@/api/visualScreen/index.js';
    import NestPieChart from '@/pages/Common/NestPie';
    import LineAreaChart from './LineArea.vue';
    import BarChart from './Bars';

    import BarCharts from '@/pages/Common/Bars';
    import { getDetailOfTypeStats } from '@/api/safetyMonitor/allWarn';
    export default {
        data () {
            return {
                data: [],
                days: '',
                mouths: '',
                cityList1: [],
                cityList2: [],
                model1: '',
                model2: '',
                value: '',
                Month: [],
                isReport: true,
                macState: [],
                options1: {
                    legend: [],
                    series: []
                },
                options2: {
                    legend: [],
                    series: []
                },
                alarmOption: {
                    legendStatus: false,
                    xAxis: [],
                    series: [],
                    title: {
                        show: false
                    },
                    tooltip: {
                        show: false
                    }
                },
                alarmOption1: {},
                columns2: [
                    { type: 'index', title: '排名', width: 100, align: 'center' },
                    { title: '设备别名', key: 'name' },
                    { title: '设备号', key: 'mac', width: 200 },
                    { title: '房号', key: 'roomWZ' },
                    { title: '本月电量(度)', key: 'electricity' },
                    { title: '上月电量(度)', key: 'preElectricity' },
                    { title: '对比', key: 'ratio' }
                ],
                naturalList: [],
                EmaginData: {},
                trendOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: []
                },
                thirdBarOptions: {
                    legendStatus: true,
                    xAxisType: '',
                    yAxisType: '',
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '用电趋势'
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        formatter:
                            '{b}<br/>' + '去年负载' + '：{c0}<br/>' + '今年负载' + '：{c1}'
                    }
                },
                lastdata: {},
                show: true,
                isshow: false,
                typeAlarmTypes: {
                    legend: [],
                    series: []
                },
                typeAlarmTypes2: {
                    legend: [],
                    series: []
                },
                barOptions: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '数量'
                    }
                },
                alarm: [],
                time: [],
                warn: [],
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                nodeId: ''
            };
        },

        methods: {
            init () {
                this.days = this.$Date().format('YYYY-MM-DD');
                this.mouths = this.$Date().format('YYYY-MM');
                this.getdata();

                this.getGroupTypes();
                let month = new Date();
                for (let i = 1; i < month.getMonth() + 1 + 1; i++) {
                    this.Month.push({
                        label: i + '月',
                        value: i > 9 ? '2022-' + i : '2022-0' + i
                    });
                }
                this.model2 = this.$Date().format('YYYY-MM');

                getPrejectData({ projectCode: this.$store.state.projectCode }).then(
                    (res) => {
                        this.macState = res.data;
                    }
                );
                getEmaginData({ projectCodes: this.$store.state.projectCode }).then(
                    (res) => {
                        this.EmaginData = res.data;
                    }
                );
            },
            handleClose () {
                this.show = false;
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
            handleTypes (val) {
                this.packetTypes = val;
                this.getGroupTrees();
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
            initDistribution () {
                this.typeAlarmTypes.series = [];
                this.typeAlarmTypes2.series = [];

                let params = {
                    projectCode: this.$store.state.projectCode,
                    time: this.mouths + '-01'
                };

                alarmTypeDistribution(params).then((res) => {
                    if (res.success) {
                        let data = [];
                        let _data = [];
                        res.data.forEach((item, index) => {
                            if ([-100].indexOf(item.classify) !== -1) {
                                data.push({
                                    name: item.info,
                                    value: item.number,
                                    tno: item.typeNumber
                                });
                            } else if ([-200].indexOf(item.classify) !== 1) {
                                _data.push({
                                    name: item.info,
                                    value: item.number,
                                    tno: item.typeNumber
                                });
                            }
                        });
                        this.typeAlarmTypes.series.push({
                            type: 'pie',
                            data: data,
                            radius: ['30%', '60%'],
                            center: ['15%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: { show: false, position: 'center' },
                                emphasis: {
                                    show: false,
                                    textStyle: { fontSize: '20', fontWeight: 'bold' }
                                }
                            },
                            labelLine: { normal: { show: false } }
                        });
                        this.typeAlarmTypes2.series.push({
                            type: 'pie',
                            data: _data,
                            radius: ['30%', '60%'],
                            center: ['15%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: { show: false, position: 'center' },
                                emphasis: {
                                    show: false,
                                    textStyle: { fontSize: '20', fontWeight: 'bold' }
                                }
                            },
                            labelLine: { normal: { show: false } }
                        });
                        let legend = this.legendData(data);
                        let _legend = this.legendData(_data);
                        this.typeAlarmTypes.legend.data = legend;
                        this.typeAlarmTypes2.legend.data = _legend;

                        this.alarmOption.xAxis = [];
                        this.alarmOption.series = [];
                        let datas = [];
                        let datas1 = [];

                        res.data.forEach(function (item, index) {
                            if ([-100].indexOf(item.classify) !== -1) {
                                datas.push({
                                    name: item.info,
                                    value: item.number,
                                    tno: item.typeNumber
                                });
                                datas1.push(item.info);
                            }
                        });

                        this.alarmOption.series.push({
                            type: 'bar',
                            barMaxWidth: '30',
                            // barWidth: 30,
                            data: datas,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        let colorList = [
                                            '#f47920',
                                            '#2a5caa',
                                            '#7fb80e',
                                            '#d71345',
                                            '#ffc20e',
                                            '#33a3dc',
                                            '#ffe600',
                                            '#45b97c',
                                            '#f3715c',
                                            '#0000FF',
                                            '#2E64FE',
                                            '#00FF80',
                                            '#FE9A2E',
                                            '#f47920',
                                            '#2a5caa',
                                            '#7fb80e',
                                            '#d71345',
                                            '#ffc20e',
                                            '#33a3dc',
                                            '#ffe600',
                                            '#45b97c',
                                            '#f3715c',
                                            '#0000FF',
                                            '#2E64FE',
                                            '#00FF80',
                                            '#FE9A2E',
                                            '#f47920',
                                            '#2a5caa',
                                            '#7fb80e',
                                            '#d71345',
                                            '#ffc20e',
                                            '#33a3dc',
                                            '#ffe600',
                                            '#45b97c',
                                            '#f3715c',
                                            '#0000FF',
                                            '#2E64FE',
                                            '#00FF80',
                                            '#FE9A2E'
                                        ];
                                        return colorList[params.dataIndex];
                                    },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                }
                            }
                        });
                        let arr = [];
                        datas1.forEach((item) => {
                            arr.push(item.split('(')[0]);
                        });

                        this.alarmOption.xAxis = arr;
                    }
                });
            },
            legendData (data) {
                let total = 0;
                let legend = [];
                data.forEach((v, i) => {
                    legend[i] = v.name + ' ' + v.value + ' ';
                    total += v.value;
                });
                legend.forEach((v, i) => {
                    if (document.documentElement.clientWidth > 1366) {
                        legend[i] =
                            v +
                            '(' +
                            (total === 0 ? 0 : ((data[i].value / total) * 100).toFixed(2)) +
                            '%)';
                    } else {
                        legend[i] = v.split(' ')[0];
                    }
                    data[i].name = legend[i];
                });
                return legend;
            },
            initAlarmTrend () {
                this.lineAreaChartFlag = false;
                let params = {
                    projectCode: this.$store.state.projectCode,
                    provinceId: this.provinceId,
                    cityId: this.cityId,
                    countyId: this.countyId
                };
                this.$nextTick(function () {
                    queryAlarmTrend(params).then((res) => {
                        if (res.success) {
                            // let _height
                            // if (window.innerHeight < 969) {
                            //     _height = 969
                            // } else {
                            //     _height = window.innerHeight
                            // }
                            // store.commit('heightOne', (_height - 309) / 3)
                            this.trendOptions.xAxis = [];
                            this.trendOptions.series = [];
                            this.trendOptions.xAxis = res.data.xAxis;
                            this.trendOptions.series.push(
                                {
                                    name: '报警',
                                    type: 'line',
                                    data: res.data.alarm,
                                    itemStyle: { color: '#F80759' },
                                    showSymbol: true,
                                    symbol: 'circle',
                                    symbolSize: 4,
                                    smooth: true
                                },
                                {
                                    name: '预警',
                                    type: 'line',
                                    data: res.data.warn,
                                    areaStyle: {
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [
                                                { offset: 0, color: '#6FB1FC' },
                                                { offset: 1, color: '#0052D4' }
                                            ],
                                            global: false
                                        }
                                    },
                                    itemStyle: { color: '#34ACE7' },
                                    showSymbol: true,
                                    symbol: 'emptyCircle',
                                    symbolSize: 4,
                                    smooth: true
                                }
                            );
                            this.lineAreaChartFlag = true;
                        } else if (res.code === '-1') {
                        } else {
                            this.trendOptions.xAxis = [];
                            this.trendOptions.series = [];
                            this.$message({
                                message: res.message,
                                type: 'error'
                            });
                        }
                        setTimeout(() => {
                            this.isshow = true;
                        }, 100);
                    });
                });
            },
            groupingType (e) {
                // 分组类型
                //
                // this.$emit("sendType", e);
                this.changeType(e);
            },
            groupingChoise (e) {
                // 分组筛选
            },
            output () {
                window.scrollTo(0, 0);
                let el = document.querySelector('.EnergyA');
                let el2 = document.querySelector('.EnergyB');
                this.$Print(el);
                this.$Print(el2);
            },
            changeMonth (e) {
                this.mouths = e;
            },
            getdata () {
                // 分组类型筛选
                groupingList({ projectCode: this.$store.state.projectCode }).then(
                    (res) => {
                        if (res.data) {
                            this.cityList1 = res.data;
                            for (let i = 0; i < res.data.length; i++) {
                                this.cityList1[i].value = res.data[i].id;
                            }
                        }
                    }
                );
            },
            changeType (groupId) {
                this.$nextTick(() => {
                    tree({ groupId }).then((res) => {
                        // 使用递归
                        function sys (arr, parentId) {
                            let data2 = [];
                            if (arr.length !== 0) {
                                // 经过一系列过滤去筛选，如果后面筛选出来的数组为空，就结束递归
                                let pArr = res.data.filter((value) => {
                                    // 筛选出满足条件的
                                    return value.parentId === parentId;
                                });
                                let mArr = arr.filter((value) => {
                                    // 筛选出不满足条件的 剩下的就是之前筛选出来的子集
                                    return value.parentId !== parentId;
                                });
                                pArr.forEach((value, i) => {
                                    let arr = {};
                                    arr.title = value.name;
                                    arr.value = value.id;
                                    arr.children = sys(mArr, value.id);
                                    data2.push(arr);
                                });
                                return data2;
                            } else {
                                return false;
                            }
                        }
                        this.cityList2 = sys(res.data, 0);
                    });
                });
            },
            handleTypeStats () {
                var params = {
                    date: this.mouths,
                    dateType: 2,
                    mac: '',
                    nodeId: this.nodeId,
                    projectCode: this.$store.state.projectCode,
                    typeNumbers: -100
                };

                getDetailOfTypeStats(params).then((res) => {
                    if (res.success) {
                        let that = this;
                        this.alarmOption.xAxis = [];
                        this.alarmOption.series = [];
                        let bardata = { value: [], legend: [], typeNos: [] };
                        res.data.forEach(function (item, index) {
                            if (
                                [1, 2, 3, 4, 5, 6, 7, 8, 11, 17, 18, 19].indexOf(
                                    item.typeNumber
                                ) !== -1
                            ) {
                                if (item.typeNumber === 4) {
                                    bardata.typeNos.forEach(function (v, i) {
                                        if (v === 3) {
                                            bardata.value[i] += item.number;
                                            that.alarmOption.xAxis[i] = '过载过流';
                                        }
                                    });
                                } else if (item.typeNumber === 18 || item.typeNumber === 19) {
                                    bardata.typeNos.forEach(function (_v, _i) {
                                        if (_v === 17) {
                                            bardata.value[_i] += item.number;
                                            that.alarmOption.xAxis[_i] = '三相报警';
                                        }
                                    });
                                } else {
                                    bardata.value.push(item.number);
                                    bardata.typeNos.push(item.typeNumber);
                                    that.alarmOption.xAxis.push(item.info);
                                }
                            }
                        });
                        this.alarmOption.series.push({
                            type: 'bar',
                            barMaxWidth: '30',
                            data: bardata.value,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        let colorList = [
                                            '#cb3f40',
                                            '#f26665',
                                            '#f2a5a6',
                                            '#9a39b4',
                                            '#c077cd',
                                            '#d19edc',
                                            '#e79c28',
                                            '#f0c647 ',
                                            '#fee7a2'
                                        ];
                                        return colorList[params.dataIndex];
                                    },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                }
                            }
                        });
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            getTable () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    date: this.mouths + '-01',
                    topNum: 10
                };

                queryTable(params).then((res) => {
                    this.naturalList = res.data;

                    this.naturalList.forEach((item) => {
                        //
                        item.electricity = item.others.electricity;
                        item.preElectricity = item.others.preElectricity;
                        item.ratio = item.others.ratio;
                        item.roomWZ = item.build + item.unit + item.room;
                    });
                });
            },
            getlist () {
                this.thirdBarOptions.series = [];
                this.thirdBarOptions.xAxis = [];
                let params = {
                    statsType: 3,
                    time: this.mouths + '-01', // 表单的值和v3有所变化，后期待完善 已完善
                    projectCode: this.$store.state.projectCode
                };
                powerConsumptionTrend(params).then((res) => {
                    if (res.success) {
                        let bardata = {
                            power: [],
                            legend: []
                        };
                        if (res.data.length > 12) {
                            res.data.forEach((v, i) => {
                                bardata.power[i] = v.afterPower;
                                bardata.legend[i] = v.time + '日';
                            });
                        } else {
                            res.data.forEach((v, i) => {
                                bardata.power[i] = v.afterPower;
                                bardata.legend[i] = v.time + '月';
                            });
                        }

                        this.thirdBarOptions.xAxis = bardata.legend;
                        this.thirdBarOptions.series.push({
                            name: '用电趋势',
                            type: 'bar',
                            barMaxWidth: '30',
                            data: bardata.power,
                            itemStyle: {
                                emphasis: { barBorderRadius: 5 },
                                normal: { color: '#08BEC1', barBorderRadius: 5 }
                            }
                        });
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }

                    this.thirdBarOptions.flag = true;
                    this.alarmOption1 = this.thirdBarOptions;
                });
            },

            getLastData () {
                workOrderStatistics({
                    projectCode: this.$store.state.projectCode,
                    time: this.mouths + '-01'
                }).then((res) => {
                    //
                    this.lastdata = res.data;
                });
            },
            queryalarmTrend () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    time: this.mouths + '-01'
                };
                alarmTrend(params).then((res) => {
                    var trend = res.data;
                    trend.forEach((item) => {
                        this.alarm.push(item.alarm);
                        this.time.push(item.time);
                        this.warn.push(item.warn);
                    });
                    if (res.success) {
                        this.barOptions.xAxis = this.time;
                        this.barOptions.series.push(
                            {
                                name: '报警',
                                type: 'bar',
                                barMaxWidth: '10',
                                data: this.alarm,
                                itemStyle: {
                                    emphasis: { barBorderRadius: 5 },
                                    normal: {
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [
                                                { offset: 0, color: 'rgba(50, 124, 255, .8)' },
                                                { offset: 1, color: 'rgba(50, 124, 255, .2)' }
                                            ],
                                            globalCoord: false
                                        }
                                    }
                                }
                            },
                            {
                                name: '预警',
                                type: 'bar',
                                barMaxWidth: '10',
                                data: this.warn,
                                itemStyle: {
                                    emphasis: { barBorderRadius: 5 },
                                    normal: {
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [
                                                { offset: 0, color: 'rgba(0, 189, 135, .8)' },
                                                { offset: 1, color: 'rgba(0, 189, 135, .2)' }
                                            ],
                                            globalCoord: false
                                        }
                                    }
                                }
                            }
                        );
                    }
                });
            },
            create () {
                let str = '';
                if (this.packetFilter.length !== 0) {
                    this.packetFilter.forEach((item) => {
                        str += item + ',';
                    });
                    str = str.substr(0, str.length - 1);
                }
                this.nodeId = str;
                this.isReport = false;
                this.initDistribution();
                this.queryalarmTrend();
                this.getTable();
                this.getlist();
                this.getLastData();
            }
        },
        mounted () {
            this.init();
        },
        watch: {
            datas: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        // this.cityList1 = newVal.data1;
                        // this.cityList2 = newVal.data2;
                    }
                },
                deep: true
            }
        },
        props: {
            datas: {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        components: {
            NestPieChart,
            LineAreaChart,
            BarChart,
            BarCharts,
            pie: screenPie,
            bar: screeBar
        }
    };
</script>

<style lang="less" scoped>
#reportALL {
  .tab {
    width: 100%;
    height: 42px;
    line-height: 42px;
    border: 1px solid #999;
    // margin-top: 0px;
    font-size: 15px;
    margin-bottom: -20px;
    .ivu-icon-ios-close {
      float: right;
      line-height: 42px;
      margin-right: 20px;
    }
  }
  .report {
    text-align: center;
    float: none;
    margin-right: 100px;
    img {
      margin-top: 200px;
    }
  }
  .top {
    margin-bottom: 10px;
    width: 100%;
    height: 52px;
    width: 100%;
    min-width: 1430px;
    line-height: 52px;
    background-color: #1a202e;
  }
  .sy {
    width: 1000px;
    height: 1500px;
    overflow: hidden;
    margin-left: 300px;
    .sys:nth-of-type(1) {
      margin-top: -470px;
    }
    .sys {
      color: #000;
      height: 120px;
      background: #fff;
      transform: rotate(-35deg);
      width: 1500px;

      margin-left: -170px;
      text-align: center;
      div {
        font-size: 20px;
        color: orange;
        opacity: 0.8;
      }
    }
  }
  .blockL {
    float: left;
    margin: 10px;
    margin-left: 0px;
  }
  .Tab {
    background-color: blue;
  }
  .blockR {
    div {
      float: left;
    }
    .output {
      // margin: 10px;
      margin-left: 20px;
    }
    .date {
      line-height: 50px;
      margin-left: 10px;
      height: 50px;
    }
    .dates {
      line-height: 50px;
      margin-right: -20px;
      height: 50px;
    }
    .serach {
      .inp {
        float: left;
        margin: 10px;
        width: 200px;
      }
      .but {
        float: left;
        margin: 10px;
        margin-left: 0;
        margin-right: -25px;
      }
      div {
        float: left;
      }
    }
  }
  .page {
    float: left;
    margin-left: 50px;
    h1 {
      width: 1000px;
    }
  }
  main {
    float: left;
    // height: 2200px;
    overflow: auto;
    div {
      // margin: 0 15px;
      position: relative;
    }
    > div {
      width: 1000px;
      h1 {
        font-size: 40px;
        font-family: PingFang SC;
        font-weight: 700;
        color: #333333;
        line-height: 48px;
      }
      .h3 {
        color: #f24e4c;
        margin-top: 10px;
      }
      p {
        width: 100%;
        border-bottom: 2px solid #ccc;
        margin-top: 10px;
        margin-left: 30px;
      }
      > span {
        position: absolute;
        left: 900px;
        top: 120px;
      }
      .macState {
        height: 160px;
        width: 1000px;
        margin: 30px 0;
        color: #000;
        // margin-top: 50px;
        h4 {
          font-size: 18px;
          font-weight: 400;
          color: #999999;
        }
        h3 {
          font-size: 18px;
          font-weight: 700;
          color: #333333;
        }
      }
      .warntype {
        height: 300px;
        margin-top: 10px;
        p {
          width: 100%;
          height: 100%;
          margin-left: 0px;
          margin-top: 20px;
          border: none;
          overflow: hidden;
          // background-color: red;
        }
      }
      .EnergyA {
        > div {
          margin-top: 150px;
        }
      }
    }
  }
  .table {
    div {
      margin: 0;
    }
  }
  .main {
    height: 52px;
    width: 100%;
    min-width: 1430px;
    // line-height: 72px;
    margin-top: 35px;
    padding-left: 100px;
    background-color: #1a202e;
  }
  .boundary {
    border: 2px solid #303a5ecc;
    box-shadow: 3px 3px 6px 1px rgba(0, 0, 0, 0.2);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    width: 500px;
    background-color: #101525;
    z-index: 555;
  }
  .boundaries {
    border: 2px solid #303a5ecc;
    box-shadow: 3px 3px 6px 1px rgba(0, 0, 0, 0.2);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    // width: 500px;
    background-color: #101525;
    z-index: 555;
  }

  /deep/::-webkit-scrollbar {
    width: 6px; //竖轴宽度
    height: 6px; //横轴宽度
    // background-color: rgba(99, 110, 246, 0.5);
  }

  /* 滚动槽 */
  /deep/::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /deep/::-webkit-scrollbar-thumb {
    background-color: rgb(9, 15, 25);
  }
  h4 {
    color: #000;
  }
}
header {
  text-align: center;
  margin-top: 20px;
  img {
    width: 100%;
  }
}
footer {
  // position: absolute;
  // bottom: 0;
  text-align: center;
  width: 920px;
  img {
    width: 100%;
    background-size: 100%;
  }
}
.EnergyA {
  position: relative;
  padding: 40px;
  background-color: #fff;
  .count {
    text-align: center;
    height: 860px;
    h1 {
      margin-top: 400px;
    }
    .tille {
      margin-top: 50px;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #f24e4c;
    }
    .statement {
      font-size: 18px;
      margin-top: 50px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #999999;
    }
  }
  .Basicdata {
    .text {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
      border-bottom: 1px solid #eeeeee;
      padding: 20px 0;
    }
    .basic{
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        margin-top: 10px;
      .tpye{
        color: #999999;
      }
      .name{
        color: #333333;
      }
    }
  }
}
</style>
