<template>
  <div>
    <warnS
      :datas="datas"

      @sendPage="changePage"
      @sendSize="changesize"
      @search="search"
      @reset="reset"
      @sendDate="changeDM"

      @sendDates="changeDMs"
      @sendmacs="changemacs"
      @sendPages="changePages"

    >
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
      <bar-chart :options="options"></bar-chart>
      <div  slot="history" >
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
        <bar-chart :options="optionss"></bar-chart>
      </div>
    </warnS>
  </div>
</template>
<script>
// 引入面积图组件
// import LineChart from "@/pages/Common/Line";
    import warnS from '@/components/seftcontrol';
    import { warnList, warnStates, tempOfRealtimeOrStatistic } from '@/api/safetyMonitor/temperature';
    // 引入面积图组件
    import BarChart from '@/pages/Common/Bars';
    import echarts from 'echarts/lib/echarts';
    export default {
        data () {
            return {
                datas: {
                    data: [],
                    tableData1: [],
                    tableColumns1: [
                        {
                            title: '地点',
                            key: 'address',
                            sortable: true
                        },
                        {
                            title: '设备号',
                            key: 'mac',
                            slot: 'mac'
                        },
                        {
                            title: '设备别名',
                            key: 'boxName'
                        },
                        {
                            title: '温度A(℃)',
                            key: 'number1'
                        },
                        {
                            title: '温度B(℃)',
                            key: 'number2'
                        },
                        {
                            title: '温度C(℃)',
                            key: 'number3'
                        },
                        {
                            title: '操作',
                            slot: 'action',
                            width: 200,
                            align: 'center'
                        }
                    ],
                    tableData1s: [],
                    total: 0,
                    totals: 0,
                    options: {
                        xAxis: [],
                        series: [
                            {
                                type: 'bar',
                                barMaxWidth: '30',
                                name: '温度值',
                                data: [],
                                itemStyle: {
                                    normal: { color: {}, label: { show: true, position: 'top' } }
                                }
                            }
                        ],
                        title: { show: true, text: '' },
                        tooltip: { trigger: 'item', formatter: '' },
                        monitor: true,
                        dateType: ''
                    },
                    tem: true
                },
                params: {
                    page: 1,
                    rows: 10,
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    dateType: 1,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    nodeIds: ''
                },
                paramss: {
                    page: 1,
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    dateType: 1,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    limit: 31
                },
                options: {
                    legendStatus: false,
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '24小时温度情况'
                    },
                    nameY: '摄氏度（°C）',
                    tooltip: {
                        show: true,
                        trigger: '',
                        formatter: ''
                    }
                },
                optionss: {
                    legendStatus: false,
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '24小时温度情况'
                    },
                    nameY: '摄氏度（°C）',
                    tooltip: {
                        show: true,
                        trigger: '',
                        formatter: ''
                    }
                }
            };
        },
        methods: {
            init () {
                this.getTableData();
                // this.getTableDatas();
                this.getEchartsData();
                // this.getEchartsDatas()
            },
            getEchartsData () {
                let that = this;
                this.$nextTick(() => {
                    warnStates(this.params).then((res) => {
                        // 获取echarts的数据
                        // 还得先清空数据
                        //
                        this.options.xAxis = [];
                        this.options.series = [];
                        if (this.params.dateType === 2) {
                            this.options.title.text = '当月温度情况';
                        } else {
                            this.options.title.text = '24小时温度情况';
                        }
                        if (res.success) {
                            let barData = [];
                            this.trendData = res.data;

                            res.data.forEach(function (item, index) {
                                barData.push({
                                    value: item.number1,
                                    name: '温度情况',
                                    type: 'bar',

                                    itemStyle: { color: '' }
                                });
                                that.options.xAxis.push(item.time);
                                if (item.number1 < 300 || item.number1 === '-') {
                                    barData[index].itemStyle.color =
                                        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                            {
                                                offset: 0,
                                                color: 'rgba(26, 32, 46,.2)'
                                            },
                                            {
                                                offset: 1,
                                                color: '#87cf86'
                                            }
                                    ]);
                                } else if (item.number1 >= 300 && item.number1 < 1500) {
                                    barData[index].itemStyle.color =
                                        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                            {
                                                offset: 0,
                                                color: 'rgba(26, 32, 46,.2)'
                                            },
                                            {
                                                offset: 1,
                                                color: '#E79C27'
                                            }
                                    ]);
                                } else {
                                    barData[index].itemStyle.color =
                                        new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                            {
                                                offset: 0,
                                                color: 'rgba(26, 32, 46,.2)'
                                            },
                                            {
                                                offset: 1,
                                                color: '#F26665'
                                            }
                                    ]);
                                }
                            });
                            this.options.series.push({
                                type: 'bar',
                                data: barData,
                                barMaxWidth: '15',
                                itemStyle: {
                                    normal: { color: {} }
                                }
                            });
                        }
                    });
                });
            },
            getEchartsDatas () {
                // let that = this;
                if (this.paramss.dateType === 2) {
                    this.optionss.title.text = '当月温度情况';
                } else {
                    this.optionss.title.text = '24小时温度情况';
                }
                let that = this
                this.$nextTick(function () {
                    // 温度弹出层
                    warnStates(this.paramss)
                        .then((res) => {
                            this.optionss.xAxis = []
                            this.optionss.series = []
                            if (res.success) {
                                let Datamax = []
                                res.data.forEach(function (item, index) {
                                    Datamax.push({ value: item.number1, itemStyle: { color: '' } })
                                    that.optionss.xAxis.push(item.time)
                                    if (item.number1 < 50) {
                                        Datamax[index].itemStyle.color = '#87CF86'
                                    } else if (item.number1 >= 50 && item.number1 <= 70) {
                                        Datamax[index].itemStyle.color = '#E79C27'
                                    } else {
                                        Datamax[index].itemStyle.color = '#F26665'
                                    }
                                })
                                this.optionss.series.push({
                                    type: 'bar',
                                    barMaxWidth: '30',
                                    name: this.$t('table.temperatureValueA'),
                                    data: Datamax,
                                    itemStyle: {
                                        normal: { color: {}, label: { show: true, position: 'top' } }
                                    }
                                })
                            } else if (res.code === '-1') {
                            } else {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            }
                        })
                })
                // this.$nextTick(() => {
                //     warnStates(this.paramss).then((res) => {
                //         // 获取echarts的数据
                //         // 还得先清空数据
                //         //
                //         this.optionss.xAxis = [];
                //         this.optionss.series = [];
                //         if (res.success) {
                //             let barData = [];
                //             this.trendData = res.data;
                //
                //             res.data.forEach(function (item, index) {
                //                 barData.push({
                //                     value: item.number1,
                //                     name: '温度情况',
                //                     type: 'bar',

                //                     itemStyle: { color: '' }
                //                 });
                //                 that.optionss.xAxis.push(item.time);
                //                 if (item.number1 < 300 || item.number1 === '-') {
                //                     barData[index].itemStyle.color =
                //                         new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                //                             {
                //                                 offset: 0,
                //                                 color: 'rgba(26, 32, 46,.2)'
                //                             },
                //                             {
                //                                 offset: 1,
                //                                 color: '#87cf86'
                //                             }
                //                     ]);
                //                 } else if (item.number1 >= 300 && item.number1 < 1500) {
                //                     barData[index].itemStyle.color =
                //                         new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                //                             {
                //                                 offset: 0,
                //                                 color: 'rgba(26, 32, 46,.2)'
                //                             },
                //                             {
                //                                 offset: 1,
                //                                 color: '#E79C27'
                //                             }
                //                     ]);
                //                 } else {
                //                     barData[index].itemStyle.color =
                //                         new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                //                             {
                //                                 offset: 0,
                //                                 color: 'rgba(26, 32, 46,.2)'
                //                             },
                //                             {
                //                                 offset: 1,
                //                                 color: '#F26665'
                //                             }
                //                     ]);
                //                 }
                //             });
                //             this.optionss.series.push({
                //                 type: 'bar',
                //                 data: barData,
                //                 barMaxWidth: '15',
                //                 itemStyle: {
                //                     normal: { color: {} }
                //                 }
                //             });
                //         }
                //     });
                // });
            },
            getTableData () {
                warnList(this.params).then((res) => {
                    // 获取数据

                    this.datas.tableData1 = res.datas;
                    this.datas.total = res.total;
                });
            },
            getTableDatas () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    mac: this.paramss.mac,
                    date: this.paramss.date,
                    dateType: this.paramss.dateType,
                    timeFlag: ''
                }
                tempOfRealtimeOrStatistic(params)
                    .then((res) => {
                        if (res.success) {
                            this.datas.tableData1s = res.data
                        } else if (res.code === '-1') {
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
                    // warnList(this.paramss).then((res) => {
                    //     // 获取数据
                    //
                    //     this.datas.tableData1s = res.datas;
                    //     this.datas.totals = res.total;
                    //     // this.paramss = this.datas.totalsd
                    //     //
                    // });
            },
            changeDM (e) {
                // 改变日期
                this.params.dateType = e[0];
                this.params.date = e[1];
                this.getTableData();
                this.getEchartsData();
            },

            changePage (e) {
                // 改变页码
                this.params.page = e;
                this.getTableData();
            },
            changesize (e) {
                // 改变每页显示数据
                this.params.rows = e;
                this.getTableData();
            },
            changemac (e) {
                // 搜索设备号
                this.params.mac = e;
                this.getTableData();
                this.getEchartsData()
            },

            getline (e) {

            },
            gethistory (e) {

            },
            changeID (e) {
                this.params.nodeIds = e;
                this.getTableData();
                this.getEchartsData();
            },
            search (e) {
                this.params.page = 1
                this.params.mac = e.mac
                this.params.dateType = e.dateType
                this.params.date = e.date
                this.params.nodeIds = e.nodeIds
                this.getTableData();
                this.getEchartsData();
            },
            reset () {
                this.params = {
                    page: 1,
                    rows: 10,
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    dateType: 1,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    nodeIds: ''
                };
                this.init();
            },
            changemacs (e) {
                this.paramss.mac = e;

                this.getEchartsDatas();
                this.getTableDatas()
            },
            changeDMs (e) {
                //
                this.paramss.dateType = e[0];
                this.paramss.date = e[1];

                this.getEchartsDatas();
                this.getTableDatas()
            },
            changePages (e) {
                this.paramss.page = e;
                this.getTableDatas();
                this.getTableDatas()
            }
        },
        created () {
            this.init();
        },
        components: {
            warnS,
            BarChart
        }
    };
</script>
<style lang="less" scoped>
.bar-label {
  text-align: center;
  margin: -20px 0 20px 0;
}

.typeC {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  position: relative;
  top: 20px;
  left: -32px;
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
.fs {
  font-size: 50px;
}
</style>
