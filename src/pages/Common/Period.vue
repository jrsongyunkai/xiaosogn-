<template>
<div  class="preiod">
     <div class="length">
        <span><i/>平时</span>
        <span><i/>谷时</span>
         <span><i/>尖时</span>
        <span><i/>峰时</span>

    </div>
  <div :id="uniqueID" class="bar" :style="baseStyle"></div>
</div>

</template>
<script>
    import uuid from 'uuid/v1';
    import echarts from 'echarts/lib/echarts';
    // 引入echarts的样式
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/title';

    export default {
        name: 'bar-charts',
        props: {
            options: {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data () {
            return {
                uniqueID: '',
                chart: '',
                baseStyle: {
                    height: this.$store.state.innerComponentHeight
                }
            };
        },
        created () {
            this.uniqueID = uuid();
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                var data = {
                    area: this.options.timer,
                    legend: [
                        '尖时',
                        '峰时',
                        '谷时',
                        '平时'

                    ],
                    data: this.options.data
                };
                var colors = [
                    '#e03c3a',
                    '#ffa854',
                    '#0dd667',
                    '#007fff'

                ];
                var option = {
                    title: {
                        text: '分时段用电趋势',
                        left: 9,
                        top: 0,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    color: colors,
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '0%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            color: '#939393',
                            interval: 0,
                            formatter: function (params) {
                                var newParamsName = '';
                                var paramsNameNumber = params.length;
                                var provideNumber = 5; // 一行显示几个字
                                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                if (paramsNameNumber > provideNumber) {
                                    for (var p = 0; p < rowNumber; p++) {
                                        var tempStr = '';
                                        var start = p * provideNumber;
                                        var end = start + provideNumber;
                                        if (p === rowNumber - 1) {
                                            tempStr = params.substring(start, paramsNameNumber);
                                        } else {
                                            tempStr = params.substring(start, end) + '\n';
                                        }
                                        newParamsName += tempStr;
                                    }
                                } else {
                                    newParamsName = params;
                                }
                                return newParamsName;
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#939393'
                            },
                            width: 5

                        },
                        axisTick: {
                            show: false
                        },
                        data: data.area
                    },
                    yAxis: {
                        name: '用电量（kwh）',
                        nameTextStyle: {
                            padding: [0, 0, 0, 50] // 四个数字分别为上右下左与原位置距离
                        },
                        type: 'value',
                        axisLabel: {
                            color: '#939393'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#939393'
                            },
                            width: 5
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color: '#939393'
                            }
                        }

                    },
                    series: []
                };
                for (var i = 0; i < data.legend.length; i++) {
                    option.series.push({
                        name: data.legend[i],
                        type: 'bar',
                        stack: '总量',
                        barWidth: '8%',
                        label: {
                            show: false,
                            position: 'insideRight'
                        },
                        data: data.data[i]
                    });
                }

                // 传不同的ID就可以在不同的地方复用 可以传不同的组件，不会出错(其实我个人感觉没什么意义)
                let chart = echarts.init(document.getElementById(this.uniqueID));

                chart.clear();

                chart.setOption(option, true);
                // if (this.option.monitor) {
                //     chart.on('click', function (params) {
                //         if (_this.option.dateType === 2) {
                //             _this.$emit('passIndex', params.dataIndex + 1);
                //         } else {
                //             _this.$emit('passIndex', params.dataIndex);
                //         }
                //     });
                // }
                this.onGetEchartsInstance && this.onGetEchartsInstance(chart);
                window.addEventListener('resize', function () {
                    chart.resize();
                });
            }
        },
        watch: {
            options: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.options.xAxis = newVal.xAxis;
                        this.options.series = newVal.series;
                        this.init();
                    }
                },
                deep: true
            },
            '$store.state.innerComponentHeight': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.baseStyle.height = newVal
                    }
                }
            }
        }
    };
</script>
<style scoped lang="less">
.preiod{
    width: 100%;
    position: relative;
    .length{
        position: absolute;
        right: 0;
        display: flex;
        span{
            display: flex;
            align-items: center;
            margin-right: 10px;
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
            background: #007fff;
        }
    }
    .length span:nth-child(2){
        i{
            background: #0dd667;
        }
    }
    .length span:nth-child(3){
        i{
            background: #e03c3a;
        }
    }
    .length span:nth-child(4){
        i{
            background: #ffb85c;
        }
    }
}
.bar {
  width: 100%;
}
</style>
