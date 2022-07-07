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
      <p slot="ect1" ><LineChart :options="options" /></p>
      <p slot="ect2" style="padding-left:25px"><LineChart :options="loadoptions" /></p>
    </warnS>
  </div>
</template>
<script>
// 引入面积图组件
    import warnS from '@/components/seftcontrol';
    // 引入过流过载警告api
    import LineChart from '@/pages/Common/Line';

    import {
        warnList,
        loadStats,
        currentStats
    } from '@/api/safetyMonitor/abnormalCurrent';

    export default {
        data () {
            return {
                datas: {
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
                            title: '报警类型',
                            key: 'info'
                        },
                        {
                            title: '报警时间',
                            key: 'time'
                        }
                    ],
                    total: 0,
                    other: true
                },
                loadoptions: {
                    nameY: '千瓦时（KW·H）',
                    xAxis: [],
                    series: [
                        {
                            name: '负载（单位：千瓦时）',
                            type: 'line',
                            data: [],
                            smooth: true,
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(224, 60, 58, 0.2)' },
                                        { offset: 1, color: 'rgba(224, 60, 58, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            itemStyle: { color: '#E03C3A' },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4
                        }
                    ],
                    title: { show: true, text: '24小时负载情况' }
                },
                options: {
                    nameY: '安（A）',
                    xAxis: [
                    ],
                    series: [
                        {
                            name: '电流（单位：安）',
                            type: 'line',
                            data: [],
                            smooth: true,
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(224, 60, 58, 0.2)' },
                                        { offset: 1, color: 'rgba(224, 60, 58, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            itemStyle: { color: '#E03C3A' },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4
                        }
                    ],
                    title: { show: true, text: '24小时电流情况' }
                },

                params: {
                    page: 1,
                    rows: 10,
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    dateType: 1,
                    typeNumbers: '3,4',
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    // date: '2022-02',
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
            getTableData () {
                warnList(this.params).then((res) => {
                    // 获取数据

                    this.datas.tableData1 = res.datas;
                    this.datas.total = res.total;
                    // if(res.data.code == -1) this.$Message.error('你的登录信息已过期，请重新登录'); // 会话过期
                });
            },
            getEchartsData () {
                this.$nextTick(() => {
                    loadStats(this.params).then((res) => {
                        // 获取echarts的数据
                        //
                        // 还得先清空数据

                        this.loadoptions.xAxis = [];
                        this.loadoptions.series[0].data = [];

                        if (this.params.dateType === 2) this.loadoptions.title.text = '当月负载情况';
                        else this.loadoptions.title.text = '24小时负载情况'

                        for (let i = 0; i < res.data.length; i++) {
                            //
                            this.loadoptions.xAxis.push(res.data[i].time);
                            this.loadoptions.series[0].data.push(res.data[i].number);
                        }
                        //
                    });
                });
                this.$nextTick(() => {
                    currentStats(this.params).then((res) => {
                        // 获取echarts的数据
                        //
                        // 还得先清空数据

                        this.options.xAxis = [];
                        this.options.series[0].data = [];

                        if (this.params.dateType === 2) this.options.title.text = '当月电流情况';
                        else this.options.title.text = '24小时电流情况'

                        for (let i = 0; i < res.data.length; i++) {
                            //
                            this.options.xAxis.push(res.data[i].time);
                            this.options.series[0].data.push(res.data[i].number);
                        }
                    });
                });
            },
            changeDM (e) {
                // 改变日期
                this.params.dateType = e[0];
                this.params.date = e[1];
                this.getEchartsData();
                this.getTableData()
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
                    typeNumbers: '3,4',
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    // date: '2022-02',
                    nodeIds: ''
                }
                this.init()
            }
        },
        created () {
            this.init();
        },
        components: {
            warnS,
            LineChart
        }
    };
</script>
<style scoped>

p {
  float: left;
  width: 49.5%;
}

</style>
