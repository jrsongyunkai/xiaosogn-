<template>
  <div>
    <div :id="uniqueID" class="line-area" :style="baseStyle"></div>
  </div>
</template>
<script>
    import uuid from 'uuid/v1'
    import echarts from 'echarts/lib/echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    export default {
        name: 'line-area-chart',
        props: {
            title: String,
            refreshFlag: Boolean,
            lineAreaChartFlag: Boolean,
            options: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                echart: '',
                uniqueID: '',
                baseStyle: {
                    height: this.$route.path !== '/energyMonitor/load' ? this.$store.state.heightOne + 'px' : '300px'
                }
            }
        },
        created () {
            this.uniqueID = uuid()
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                var that = this
                const options = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (data) {
                            var time = '';
                            var text = ''
                            var text2 = ''
                            time += that.$Date().format('YYYY年MM月') + data[0].name + '日' + '<br/>';
                            text += data[0].marker + data[0].seriesName + ': ' + data[0].value + '%' + '<br/>';
                            text2 += data[1].marker + data[1].seriesName + ': ' + data[1].value + '次' + '<br/>';
                            return time + text + text2;
                        }
                    },
                    title: {
                        show: this.options.title.show,
                        text: this.options.title.text ? this.options.title.text : '',
                        textStyle: {
                            color: '#fff',
                            fontSize: 16
                        },
                        left: 0,
                        top: 10
                    },
                    legend: {
                        show: true,
                        orient: 'horizontal',
                        align: 'left',
                        right: 20,
                        data: this.options.series.name,
                        icon: 'emptycircle',
                        itemWidth: 10, // 设置宽度

                        itemHeight: 10, // 设置高度

                        itemGap: 10, // 设置间距
                        textStyle: {
                            color: '#fff'
                        }

                    },

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#DDDDDD'
                            }
                        },
                        data: this.options.xAxis
                    },
                    yAxis: [
                        {

                            name: this.options.yAxis.name,
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#DDDDDD'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dashed',
                                    color: ['#4e5159']
                                }
                            }

                        },
                        {
                            type: 'value',
                            name: this.options.yAxis.name2,
                            axisLine: {
                                lineStyle: {
                                    color: '#DDDDDD'
                                }
                            },
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    type: 'dashed',
                                    color: ['#4e5159']
                                }
                            },
                            min: 0,
                            max: 100
                    }],
                    grid: {
                        left: 50,
                        right: '4%',
                        top: '20%',
                        bottom: '20%'
                    },
                    series: this.options.series

                }
                let chart = echarts.init(document.getElementById(this.uniqueID))
                this.echart = chart
                chart.clear()
                chart.setOption(options)
                window.addEventListener('resize', function () {
                    // if (document.getElementById(_this.uniqueID)) document.getElementById(_this.uniqueID).style.width = (window.innerWidth * 0.2083333 - 22) + 'px'
                    chart.resize()
                })
            }
        },
        watch: {
            options: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.options = newVal
                        this.init()
                    } else {
                        this.options = oldVal
                        this.init()
                    }
                },
                deep: true
            },
            '$store.state.heightOne': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.baseStyle.height = newVal + 'px'
                    }
                }
            },
            '$store.state.systemFlag': {
                handler (newVal, oldVal) {
                    if (newVal && this.$store.state.toPath !== '') this.echart.resize()
                }
            },
            '$store.state.toPath': {
                handler (newVal, oldVal) {
                    document.getElementById(this.uniqueID).style.width = (window.innerWidth * 0.2083333 - 22) + 'px'
                    if (newVal) this.echart.resize()
                }
            }
        }
    }
</script>
<style lang="less" scoped>
.line-area{
    width :100%;
}

.loading{
    position :relative;
}

.el-icon-loading{
  position :absolute;
  left :43%;
  top :39%;
  font-size :50px;
  opacity: 0.5;
}

</style>
