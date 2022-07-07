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
    >
      <line-chart :options='options'></line-chart>
      <line-chart :options='optionss' slot="history"></line-chart>

    </warnS>
  </div>
</template>
<script>
// 引入面积图组件
// import LineChart from "@/pages/Common/Line";
// {"xAxis":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],"series":[{"name":"漏电报警数量（单位：条）","type":"line","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],"smooth":true,"itemStyle":{"normal":{"areaStyle":{"type":"default"},"color":"#f26665"}},"symbol":"emptyCircle"},{"name":"漏电预警数量（单位：条）","type":"line","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"smooth":true,"itemStyle":{"normal":{"areaStyle":{"type":"default"},"color":"#08BEC1"}},"symbol":"emptyCircle"}],"title":{"show":true,"text":"三月漏电报警情况"},"tooltip":"{a}{c}<br/>{a1}{c1}","legendSelect":true}
    import warnS from '@/components/seftcontrol';
    // 引入面积图组件
    import LineChart from '@/pages/Common/Line';
    // import echarts from 'echarts/lib/echarts';
    // import LineAreaChart from '../../Common/LineArea.vue';
    // 引入漏电警告api
    import { warnList, warnStates } from '@/api/safetyMonitor/leakageWarm';

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
                            title: '报警/预警时间',
                            key: 'time'
                        },
                        {
                            title: '操作',
                            slot: 'actions'
                            // width: 150
                        }
                    ],
                    tableData1s: [],
                    total: 0,
                    optionss: {

                        xAxis: [
                        ],
                        series: [
                            {
                                name: '漏电报警数量（单位：条）',
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
                            },
                            {
                                name: '漏电预警数量（单位：条）',
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
                                            { offset: 0, color: 'rgba(255, 168, 84, 0.2)' },
                                            { offset: 1, color: 'rgba(255, 168, 84, 0.3)' }
                                        ],
                                        global: false
                                    }
                                },
                                itemStyle: { color: '#FFA854' },
                                showSymbol: true,
                                symbol: 'emptyCircle',
                                symbolSize: 4
                            }
                        ],
                        title: { show: true, text: '24小时漏电报警情况' },
                        tooltip: ''

                    }
                },
                // '#08BEC1'
                options: {
                    nameY: '单位（条）',
                    xAxis: [
                    ],
                    series: [
                        {
                            name: '漏电报警数量（单位：条）',
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
                        },
                        {
                            name: '漏电预警数量（单位：条）',
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
                                        { offset: 0, color: 'rgba(255, 168, 84, 0.2)' },
                                        { offset: 1, color: 'rgba(255, 168, 84, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            itemStyle: { color: '#FFA854' },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4
                        }
                    ],
                    title: { show: true, text: '24小时漏电报警情况' },
                    tooltip: ''
                },
                optionss: {
                    nameY: '单位（条）',
                    xAxis: [
                    ],
                    series: [
                        {
                            name: '漏电报警数量（单位：条）',
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
                        },
                        {
                            name: '漏电预警数量（单位：条）',
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
                                        { offset: 0, color: 'rgba(255, 168, 84, 0.2)' },
                                        { offset: 1, color: 'rgba(255, 168, 84, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            itemStyle: { color: '#FFA854' },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4
                        }
                    ],
                    title: { show: true, text: '24小时漏电报警情况' },
                    tooltip: ''
                },
                params: {
                    projectCode: this.$store.state.projectCode,
                    typeNumbers: '2,12',
                    mac: '',
                    dateType: 1,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    nodeIds: ''
                },
                paramss: {
                    projectCode: this.$store.state.projectCode,
                    typeNumbers: '2,12',
                    mac: '',
                    dateType: 1,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    nodeIds: ''
                }
            };
        },
        methods: {
            init () {
                this.getTableData();
                this.getEchartsData();
                // this.getEchartsDatas()
            },
            getEchartsData () {
                this.$nextTick(() => {
                    warnStates(this.params).then((res) => {
                        // 获取echarts的数据、
                        //

                        // 还得先清空数据

                        this.options.xAxis = [];
                        this.options.series[0].data = [];
                        this.options.series[1].data = [];
                        if (this.params.dateType === 2) {
                            this.options.title.text = '当月漏电报警情况';
                        } else {
                            this.options.title.text = '24小时漏电报警情况';
                        }
                        for (let i = 0; i < res.data.length; i++) {
                            //
                            this.options.xAxis.push(res.data[i].time);
                            this.options.series[0].data.push(res.data[i].number2);
                            this.options.series[1].data.push(res.data[i].number12);
                        }
                        // this.datas.options = this.options
                    });
                });
            },
            getEchartsDatas () {
                this.$nextTick(() => {
                    warnStates(this.paramss).then((res) => {
                        // 获取echarts的数据、

                        // 还得先清空数据

                        this.optionss.xAxis = [];
                        this.optionss.series[0].data = [];
                        this.optionss.series[1].data = [];
                        if (this.paramss.dateType === 2) {
                            this.optionss.title.text = '当月漏电报警情况';
                        } else {
                            this.optionss.title.text = '24小时漏电报警情况';
                        }
                        for (let i = 0; i < res.data.length; i++) {
                            //
                            this.optionss.xAxis.push(res.data[i].time);
                            this.optionss.series[0].data.push(res.data[i].number2);
                            this.optionss.series[1].data.push(res.data[i].number12);
                        }
                        // this.datas.optionss = this.optionss

                        this.datas.tableData1s = [];

                        this.optionss.series[0].data.forEach((item, index) => {
                            this.datas.tableData1s.push({
                                time: this.paramss.dateType === 2 ? index + 1 : index,
                                number1: item,
                                number2: this.optionss.series[1].data[index]
                            });
                        });
                    });
                });
            },
            getTableData () {
                warnList(this.params).then((res) => {
                    // 获取数据
                    //
                    this.datas.tableData1 = res.datas;
                    this.datas.total = res.total;
                    // if(res.data.code == -1) this.$Message.error('你的登录信息已过期，请重新登录'); // 会话过期
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
                    projectCode: this.$store.state.projectCode,
                    typeNumbers: '2,12',
                    mac: '',
                    dateType: 1,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    nodeIds: ''
                }
                this.init()
            },
            changemacs (e) {
                this.paramss.mac = e;

                this.getEchartsDatas();
            },
            changeDMs (e) {
                this.paramss.dateType = e[0];
                this.paramss.date = e[1];
                this.getEchartsDatas();
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
