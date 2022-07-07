<template>
  <div>
    <warnS
      :datas="datas"
      @sendPage="changePage"
      @sendSize="changesize"
      @search="search"
      @reset="reset"
      @sendDate="changeDM"
    >
      <line-chart :options="options"></line-chart>
    </warnS>
  </div>
</template>
<script>
// 引入面积图组件
// import LineChart from "@/pages/Common/Line";
    import warnS from '@/components/seftcontrol';
    // 引入面积图组件
    import LineChart from '@/pages/Common/Line';
    // 引入电弧警告api
    import { warnList, warnStates } from '@/api/safetyMonitor/SparkWarn';

    export default {
        data () {
            return {
                datas: {
                    data1: [],
                    data2: [],
                    tableData1: [],
                    tableColumns1: [
                        {
                            title: '事件ID',
                            key: 'id'
                        },
                        {
                            title: '地点',
                            key: 'address'
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
                            title: '线路',
                            key: 'channel'
                        },
                        {
                            title: '报警时间',
                            key: 'time'
                        }
                    ],
                    total: 0
                },
                options: {
                    nameY: '单位（条）',
                    xAxis: [
                    ],
                    series: [
                        {
                            name: '电弧报警数量（单位：条）',
                            type: 'line',
                            data: [
                            ],
                            smooth: true,
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(224, 74, 73, 0.2)' },
                                        { offset: 1, color: 'rgba(224, 74, 73, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            itemStyle: { color: '#ab3f42' },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4
                        }
                    ],
                    title: { show: true, text: '24小时电弧报警情况' }
                },
                params: {
                    page: 1,
                    rows: 10,
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    dateType: 1,
                    typeNumbers: 11,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    // date: '2022-01',
                    nodeIds: ''
                }
            };
        },
        methods: {
            search (e) {
                this.params.page = 1
                this.params.mac = e.mac
                this.params.dateType = e.dateType
                this.params.date = e.date
                this.params.nodeIds = e.nodeIds
                this.init()
            },
            init () {
                this.getTableData();
                this.getEchartsData();
            },
            getEchartsData () {
                this.$nextTick(() => {
                    warnStates(this.params).then((res) => {
                        // 获取echarts的数据
                        //
                        // 还得先清空数据

                        this.options.xAxis = [];
                        this.options.series[0].data = [];

                        if (this.params.dateType === 2) {
                            this.options.title.text = '当月电弧报警情况';
                        } else this.options.title.text = '24小时电弧报警情况';
                        for (let i = 0; i < res.data.length; i++) {
                            //
                            this.options.xAxis.push(res.data[i].time);
                            this.options.series[0].data.push(res.data[i].number);
                        }
                        //
                    });
                });
            },
            getTableData () {
                warnList(this.params).then((res) => {
                    // 获取数据
                    this.datas.tableData1 = res.datas;
                    this.datas.total = res.total;
                    //
                    // if(res.data.code == -1) this.$Message.error('你的登录信息已过期，请重新登录'); // 会话过期
                });
            },
            changeDM (e) {
                // 改变日期
                this.params.dateType = e[0];
                this.params.date = e[1];
                this.getEchartsData();
                this.getTableData();
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
            },
            changeID (e) {
                this.params.nodeIds = e;
                this.getTableData();
            },
            reset () {
                this.params = {
                    page: 1,
                    rows: 10,
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    dateType: 1,
                    typeNumbers: 11,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    // date: '2022-01',
                    nodeIds: ''
                }
                this.init()
            }
        },
        created () {
            this.init();

            // const today = this.$Date().format("YYYY-MM-DD");// 输出格式化时间 2019-08-29 18:17:24

            //
            // 默认为当天
        },
        components: {
            warnS,
            LineChart
        }
    };
</script>
