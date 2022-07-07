<template>
    <div>
      <div :id="uniqueID" :style="baseStyle" style="width:'100%'"></div>
      <div class="length">
        <span><i/>尖时</span>
        <span><i/>峰时</span>
        <span><i/>平时</span>
        <span><i/>谷时</span>

      </div>
    </div>
</template>
<script>
    import uuid from 'uuid/v1'
    import echarts from 'echarts/lib/echarts'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/chart/gauge'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/legendScroll'

    export default {
        props: {
            options: { type: Array, default: () => [] }
        },
        data () {
            return {
                uniqueID: '',
                echart: '',
                baseStyle: {
                    height: this.$store.state.heightOne + 'px'
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
                let _this = this
                // let seriesData = []
                // for (var i = 0; i < 120; i++) {
                //     seriesData.push({
                //         value: 3
                //     });
                // }
                //  var data = seriesData
                // var data = [1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 3, 1, 1, 1, 2, 1, 2, 1]
                var data = _this.options
                var colors = ['rgba(17, 165, 88,.8)', 'rgba(7, 101, 199,.8)', 'rgba(171, 53, 55,.8)', 'rgba(255, 168, 84, 0.8)']
                var colors2 = ['rgba(17, 165, 88,.2)', 'rgba(7, 101, 199,.2)', 'rgba(171, 53, 55,.2)', 'rgba(255, 168, 84, 0.2)']
                var lineColors = data.map((value, index) => {
                    var lineNumber = (1 / 24) * (index + 1);
                    return [lineNumber, colors[value - 1]];
                });
                var lineColors2 = data.map((value, index) => {
                    var lineNumber = (1 / 24) * (index + 1);
                    return [lineNumber, colors2[value - 1]];
                });
                const options = {

                    series: [
                        {
                            name: '颜色',
                            type: 'gauge',
                            center: ['50%', '50%'],
                            radius: '90%',
                            // min: 0,
                            // max: 60,
                            startAngle: 90,
                            endAngle: -269.9999,
                            // splitNumber: 12,
                            animation: 0,
                            pointer: {
                                show: true
                            },
                            axisLine: {
                                lineStyle: {
                                    color: lineColors2,
                                    width: 300
                                }
                            },
                            splitLine: {
                                // 分割线样式
                                show: false,
                                length: 18,
                                lineStyle: {
                                    width: 1
                                }
                            },
                            axisTick: {
                                show: false
                            }, // 仪表盘刻度样式
                            axisLabel: {
                                // 刻度标签
                                show: false
                            },
                            title: {
                                show: false
                            },
                            detail: {
                                show: false
                            },
                            data: []
                        },
                        {
                            name: '小时',
                            type: 'gauge',
                            radius: '82%',
                            min: 0,
                            max: 24,
                            startAngle: 90,
                            endAngle: -269.99999,
                            splitNumber: 24,
                            axisLine: {
                                lineStyle: {
                                    color: [[1, '#fff']],
                                    width: 0
                                }
                            },
                            axisLabel: {
                                show: true,
                                distance: 2,
                                formatter: function (t) {
                                    return t || '';
                                },
                                fontSize: 12,
                                color: '#fff'
                            },
                            axisTick: {
                                length: 12,
                                lineStyle: {
                                    color: 'auto',
                                    width: 1
                                }
                            },
                            splitLine: {
                                length: 16,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                }
                            },
                            detail: {
                                show: false
                            }
                        },
                        {
                            name: '分钟',
                            type: 'gauge',
                            radius: '90%',
                            min: 0,
                            max: 60,
                            startAngle: 90,
                            endAngle: -269.99999,
                            splitNumber: 60,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: lineColors,
                                    width: 10
                                }
                            },
                            axisLabel: {
                                show: false,
                                distance: 10
                            },
                            axisTick: {
                                show: false,
                                length: 4,
                                lineStyle: {
                                    color: 'auto',
                                    width: 1
                                }
                            },
                            splitLine: {
                                show: false,
                                length: 4,
                                lineStyle: {
                                    color: 'auto',
                                    width: 1
                                }
                            },
                            detail: {
                                show: false
                            }
                        }

                    ]
                };

                // 传不同的ID就可以在不同的地方复用 可以传不同的组件，不会出错(其实我个人感觉没什么意义)

                let chart = echarts.init(document.getElementById(_this.uniqueID))
                _this.echart = chart
                window.addEventListener('resize', function () {
                    if (document.getElementById(_this.uniqueID)) document.getElementById(_this.uniqueID).style.width = (window.innerWidth * 0.2083333 - 22) + 'px'
                    chart.resize()
                })
                chart.clear()
                chart.setOption(options, true)
            }

        },
        watch: {
            options: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.options.xAxis = newVal.xAxis
                        this.options.series = newVal.series
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
            }
        }
    }
</script>
<style lang="less" scoped>
.length{
        display: flex;
        justify-content: center;
        margin-right: 20px;
        span{
            display: flex;
            align-items: center;
            margin: 0 20px;
            i{
                width: 10px;
                height: 10px;
                display: block;
                margin-right: 5px;

            }

        }
    }
  .length span:nth-child(1){

        i{
           background: #e03c3a;

        }
    }
    .length span:nth-child(2){
        i{
          background: #FFA854;

        }
    }
    .length span:nth-child(3){
        i{
            background: #007fff;
        }
    }
     .length span:nth-child(4){
        i{
            background: #0dd667;
        }
    }

</style>
