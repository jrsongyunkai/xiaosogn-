<template>
    <div class="content">
        <div class="content_top">
            <div class="header">
            <div class="img_row" >
                <div class="img_row_col" style="display:flex;align-items: center;">
                    <i class="img_row_art ml-10">警情分布</i>
                </div>
                <div class="tab img_row_col" >
                    <Tabs value="name1">
                        <TabPane label="报警" name="name1"><pie :options="typeAlarmTypes" /></TabPane>
                        <TabPane label="预警" name="name2"><pie :options="typeAlarmTypes2"/></TabPane>
                    </Tabs>
                </div>
            </div>
            </div>
        </div>
        <div class="content_content">
            <div class="bom">
                    <Row class="img_row">
                        <Col class="img_row_col tl">
                            <i class="img_row_art ml-10">警情趋势</i>
                        </Col>
                    </Row>

            </div>
             <div style="margin-top:10px">
                    <bar :options="barOptions" ></bar>
                </div>
        </div>

    </div>
</template>

<script>
    import screenPie from '../Common/NestPie.vue'
    import screenBar from '../../components/common/screenBar.vue'
    import { alarmTypeDistribution, alarmTrend } from '@/api/visualScreen/index.js'
    export default {
        components: {
            pie: screenPie,
            bar: screenBar
        },
        data () {
            return {
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
                warn: []
            }
        },
        created () {},
        mounted () {
            this.init()
        },
        methods: {
            init () {
                this.queryDistribution()
                this.queryalarmTrend()
            },
            queryDistribution () {
                this.typeAlarmTypes.series = []
                this.typeAlarmTypes2.series = []
                alarmTypeDistribution().then(res => {
                    if (res.success) {
                        let data = []
                        let _data = []
                        res.data.forEach((item, index) => {
                            if ([-100].indexOf(item.classify) !== -1) {
                                data.push({ name: item.info, value: item.number, tno: item.typeNumber })
                            } else if ([-200].indexOf(item.classify) !== 1) {
                                _data.push({ name: item.info, value: item.number, tno: item.typeNumber })
                            }
                        });
                        this.typeAlarmTypes.series.push({ type: 'pie', data: data, radius: ['35%', '50%'], center: [this.$store.state.toPath !== '' ? '25%' : '25%', '50%'], avoidLabelOverlap: false, label: { normal: { show: false, position: 'center' }, emphasis: { show: false, textStyle: { fontSize: '20', fontWeight: 'bold' } } }, labelLine: { normal: { show: false } } })
                        this.typeAlarmTypes2.series.push({ type: 'pie', data: _data, radius: ['35%', '50%'], center: [this.$store.state.toPath !== '' ? '25%' : '25%', '50%'], avoidLabelOverlap: false, label: { normal: { show: false, position: 'center' }, emphasis: { show: false, textStyle: { fontSize: '20', fontWeight: 'bold' } } }, labelLine: { normal: { show: false } } })
                        let legend = this.legendData(data)
                        let _legend = this.legendData(_data)
                        this.typeAlarmTypes.legend.data = legend
                        this.typeAlarmTypes2.legend.data = _legend
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
            queryalarmTrend () {
                alarmTrend().then(res => {
                    var trend = res.data
                    trend.forEach(item => {
                        this.alarm.push(item.alarm)
                        this.time.push(item.time)
                        this.warn.push(item.warn)
                    })
                    if (res.success) {
                        this.barOptions.xAxis = this.time
                        this.barOptions.series.push(
                            { name: '报警', type: 'bar', barMaxWidth: '10', data: this.alarm, itemStyle: { emphasis: { barBorderRadius: 5 }, normal: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(50, 124, 255, .8)' }, { offset: 1, color: 'rgba(50, 124, 255, .2)' }], globalCoord: false } } } },
                            { name: '预警', type: 'bar', barMaxWidth: '10', data: this.warn, itemStyle: { emphasis: { barBorderRadius: 5 }, normal: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0, 189, 135, .8)' }, { offset: 1, color: 'rgba(0, 189, 135, .2)' }], globalCoord: false } } } }
                        )
                    }
                })
            }
        },
        watch: {}
    }
</script>

<style lang="less" scoped>
.content{
    width: 100%;
    background-color: transparent;
    height: 100%;
    position: relative;
    .content_top{
        background: url('../../assets/images/contentTop.png') no-repeat;
        background-size: 100% 100%;
        height: 60%;
    }
    .header{
        width: 100%;
        display: flex;
        align-items: center;
        background: url('../../assets/images/border.gif') no-repeat;
        background-size: 100% 100%;
        height: 35px;
        .img_row{
            position: absolute;
            width:95%;
            .tab{
                position: absolute;
                top: -30%;
                width: 100%;
            }
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
    .content_content{
            background: url('../../assets/images/contentTop.png') no-repeat;
            background-size: 100% 100%;
            height: 40%;
            margin-top: 10px;
             .bom{
                width: 100%;
                background: url('../../assets/images/border.gif') no-repeat;
                background-size: 100% 100%;
                height: 35px;
                display: flex;
                align-items: center;
                .img_row{
                    position: absolute;
                    width: 100%;
                    display: flex;

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

}
/deep/.ivu-tabs-nav-scroll{
    .ivu-tabs-nav{
        float: right;

    }
    .ivu-tabs-ink-bar{
        background-color:transparent
    }
}
/deep/.ivu-tabs{
    color:#fff;

}
/deep/.ivu-tabs-nav-container{
    padding: 6px;
}
/deep/.ivu-tabs-tab-active {
    background: rgba(50, 124, 255, 0.3);
    border: 1px solid #327CFF;
    color: #fff;
}
 /deep/.ivu-tabs-tab {
    padding: 0px 8px;

}
@media only screen and (min-width: 1024px) {
        .content_top,.content_content{
            padding: 10px;
        }
        .content_top{
            margin-bottom: 6px;
        }

    }
    @media only screen and (min-width: 1366px) {
        .content_top{
            margin-bottom: 10px;
        }
    }
    @media only screen and (min-width: 1920px) {

        .content_top,.content_content{
            padding: 20px;
        }
        .content_top{
            margin-bottom: 10px;
        }
    }
</style>
