<template>
  <div id="load">
    <div class="form">
     <div style="float:left">
        <Input
        class="short-input"
        v-model="params.mac"
        placeholder="输入设备号"
        clearable

      ></Input>

      <Select
            v-model="packetTypes"
            @on-change="handleTypes"
            style="width: 200px;margin-left:10px"
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

      <div class="" style="margin-left: 10px;float:left"  >
          <TreeSelect
                placeholder="选择分组"
                multiple
                show-checkbox
                v-model="packetFilter"
                transfer
                :data="packetFilterList"
              />
        </div>
      <Button
        type="primary"
        @click="inits"
        style="margin-left: 10px; background: #007eff"
        >查询</Button
      >
      <Button @click="reset" style="margin-left: 10px">重置</Button>
    </div>
    <Row :gutter="10" class="project_trend mt">
      <Col span="12">
        <div class="pd content">
          <div class="title">近两天负载用电趋势</div>
          <line-area-chart :options="HoursOptions"></line-area-chart>
        </div>
      </Col>
      <Col span="12">
        <div class="pd content">
          <div class="title">近两周负载用电趋势</div>
          <line-area-chart :options="WeekOptions"></line-area-chart>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="24" class="mt">
        <div class="pd content">
          <div class="title">近两年负载用电趋势</div>
          <line-area-chart :options="YearsOptions"></line-area-chart>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
    import { groupingList, tree } from '@/api/safetyMonitor/public';
    import { getGroupType, getGroupTree } from '@/api/public';
    import BarCharts from '@/pages/Common/Bars';
    import LineCharts from '@/pages/Common/Line';
    import LineAreaChart from '../../Common/LineArea.vue';

    import { getLoadHour, getLoadDay, getLoadYears } from '@/api/console/project';
    export default {
        data () {
            return {
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                firstLine: false,
                secondLine: false,
                thirdBar: false,
                firstLineOptions: {
                    series: [],
                    xAxis: [],
                    title: {
                        show: true,
                        text: '近两天的负载情况'
                    },
                    legendSelect: false,
                    tooltip: {
                        trigger: 'axis',
                        formatter:
                            '{b}' +
                            '点' +
                            '<br/>' +
                            '昨日负载' +
                            '：{c0}<br/>' +
                            '今日负载' +
                            '：{c1}'
                    }
                },
                secondLineOptions: {
                    series: [],
                    xAxis: [],
                    title: {
                        show: true,
                        text: '近两周的负载情况'
                    },
                    legendSelect: false,
                    tooltip: {
                        trigger: 'axis',
                        formatter: ''
                    }
                },
                thirdBarOptions: {
                    legendStatus: true,
                    xAxisType: '',
                    yAxisType: '',
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '今年和去年各月负载情况'
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        formatter:
                            '{b}<br/>' + '去年负载' + '：{c0}<br/>' + '今年负载' + '：{c1}'
                    }
                },
                model1: '',
                cityList1: [],
                value: '',
                cityList2: [],
                HoursOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                afterPower: [],
                prePower: [],
                hourstime: [],
                WeekOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                wafterPower: [],
                wprePower: [],
                weekstime: [],
                YearsOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                yafterPower: [],
                yprePower: [],
                yeekstime: [],
                params: {
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    nodeId: ''
                }
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.getGroupTypes();

                this.GetEData();
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
            inits () {
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    let str = ''
                    if (this.packetFilter.length !== 0) {
                        this.packetFilter.forEach((item) => {
                            str += item + ',';
                        });
                        str = str.substr(0, str.length - 1);
                    }
                    this.params.nodeId = str
                    this.queryGetLoadHour(this.params);
                    this.queryGetLoadWeek(this.params);
                    this.queryGetLoadYears(this.params);
                }
            },
            GetEData () {
                this.queryGetLoadHour(this.params);
                this.queryGetLoadWeek(this.params);
                this.queryGetLoadYears(this.params);
            },
            reset () {
                this.packetTypes = ''
                this.packetFilter = []
                this.model1 = '';
                this.cityList2 = [];
                this.params = {
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    nodeId: ''
                };

                this.GetEData();
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
            groupingType (e) {
                if (e === undefined) return false;
                else this.changeType(e);
            },
            getdata () {
                groupingList({ projectCode: this.$store.state.projectCode }).then(
                    (res) => {
                        if (res.data) {
                            this.cityList1 = res.data;
                            for (let i = 0; i < res.data.length; i++) {
                                this.cityList1[i].value = res.data[i].id;
                            }
                        }
                        //
                    }
                );
            },
            changeType (groupId) {
                this.$nextTick(() => {
                    tree({ groupId }).then((res) => {
                        // 使用递归
                        function sys (arr, parentId) {
                            let data2 = [];

                            if (arr.length === 0) {
                                return false;
                            } else {
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
                            }
                        }
                        this.cityList2 = sys(res.data, 0);
                    });
                });
            },
            groupingChoise (e) {
                // 分组筛选完之后，就传给父级进行应用，根据这个ID发请求
                // 分组筛选
                //
                let str = '';
                e.forEach((item) => {
                    str += item + ',';
                });
                str = str.substr(0, str.length - 1);
                this.parmas.nodeId = str
                // this.params.nodeId = e;
                // this.$emit('sendID', e);
            },
            queryGetLoadHour () {
                getLoadHour(this.params).then((res) => {
                    var hourList = res.data;
                    this.afterPower = []
                    this.prePower = []
                    this.hourstime = [];

                    for (let i in hourList) {
                        this.afterPower.push(hourList[i].afterPower);
                        this.prePower.push(hourList[i].prePower);
                        this.hourstime.push(hourList[i].time);
                    }
                    if (res.success) {
                        this.HoursOptions.xAxis = [];
                        this.HoursOptions.series = [];

                        this.HoursOptions.xAxis = this.hourstime;
                        this.HoursOptions.yAxis.name = '电量（度）';
                        this.HoursOptions.series[0] = {
                            name: '前天',
                            type: 'line',
                            data: this.prePower,
                            itemStyle: {
                                color: '#0DD667'
                            },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                                        { offset: 1, color: 'rgba(13, 214, 103, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                        this.HoursOptions.series[1] = {
                            name: '昨天',
                            type: 'line',
                            data: this.afterPower,
                            itemStyle: {
                                color: '#0373e6'
                            },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                        { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                    } else if (res.code === '-1') {
                    } else {
                        this.HoursOptions.xAxis = [];
                        this.HoursOptions.series = [];
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            queryGetLoadWeek () {
                getLoadDay(this.params).then((res) => {
                    var weekList = res.data;

                    this.wafterPower = []
                    this.wprePower = []
                    this.weekstime = []
                    for (let i in weekList) {
                        this.wafterPower.push(weekList[i].afterPower);
                        this.wprePower.push(weekList[i].prePower);
                        this.weekstime.push(weekList[i].time);
                    }
                    if (res.success) {
                        this.WeekOptions.xAxis = [];
                        this.WeekOptions.series = [];
                        this.WeekOptions.xAxis = this.weekstime;
                        this.WeekOptions.yAxis.name = '电量（度）';

                        this.WeekOptions.series[0] = {
                            name: '上周',
                            type: 'line',
                            data: this.wprePower,
                            itemStyle: { color: '#0DD667' },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                                        { offset: 1, color: 'rgba(13, 214, 103, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                        this.WeekOptions.series[1] = {
                            name: '本周',
                            type: 'line',
                            data: this.wafterPower,
                            itemStyle: { color: '#0373e6' },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                        { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4,
                            smooth: true
                        };
                    } else if (res.code === '-1') {
                    } else {
                        this.WeekOptions.xAxis = [];
                        this.WeekOptions.series = [];
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            queryGetLoadYears () {
                getLoadYears(this.params).then((res) => {
                    var yearsList = res.data;
                    this.yafterPower = []
                    this.yprePower = []
                    this.yeekstime = []
                    for (let i in yearsList) {
                        this.yafterPower.push(yearsList[i].afterPower);
                        this.yprePower.push(yearsList[i].prePower);
                        this.yeekstime.push(yearsList[i].time);
                    }
                    if (res.success) {
                        this.YearsOptions.xAxis = [];
                        this.YearsOptions.series = [];
                        this.YearsOptions.xAxis = this.yeekstime;
                        this.YearsOptions.yAxis.name = '电量（度）';
                        this.YearsOptions.series[0] = {
                            name: '去年',
                            type: 'line',
                            data: this.yprePower,
                            itemStyle: { color: '#0DD667' },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                                        { offset: 1, color: 'rgba(13, 214, 103, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                        this.YearsOptions.series[1] = {
                            name: '本年',
                            type: 'line',
                            data: this.yafterPower,
                            itemStyle: { color: '#0373e6' },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                        { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4,
                            smooth: true
                        };
                    } else if (res.code === '-1') {
                    } else {
                        this.YearsOptions.xAxis = [];
                        this.YearsOptions.series = [];
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            }
        },
        watch: {
            '$store.state.projectCode': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.init();
                    }
                }
            }
        },
        components: {
            BarCharts,
            LineCharts,
            LineAreaChart
        }
    };
</script>
<style lang="less" scoped>
.title {
//   width: 96px;
  height: 16px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
}
.mt {
  margin-top: 10px;
}
.mb {
  margin-bottom: 20px;
}
.pd {
  padding: 20px;
}
.form {
  background: #1a202e;
  padding-left: 20px;
  // float:left;
  height: 52px;
  line-height: 52px;
  margin-bottom: 10px;
  // width: 100%;
}
.short-input {
  width: 200px;
}
</style>
