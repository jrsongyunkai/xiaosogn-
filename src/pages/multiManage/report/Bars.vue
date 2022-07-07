<template>
  <div
    :id="uniqueID"
    class="bar"
    :style="baseStyle"
  ></div>
  <!-- <div>11111</div> -->
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
            },
            onGetEchartsInstance: {
                type: Function,
                require: false
            }
        },
        data () {
            return {
                uniqueID: '',
                chart: '',
                baseStyle: {
                    height: '350px'
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
                let _this = this;
                const options = {
                    title: {
                        show: this.options.title.show,
                        text: this.options.title.text,
                        textStyle: {
                            color: '#000',
                            fontSize: 16
                        },
                        left: 20,
                        top: 0
                    },
                    grid: {
                        x: 50,
                        y: 50,
                        x2: 30,
                        y2: 80,
                        borderWidth: 0,
                        bottom: this.options.flag ? '50' : '135'
                    },
                    tooltip: {

                    },
                    legend: {
                        selectedMode: false,
                        show: this.options.legendStatus,
                        y: 'top',
                        x: 'right',
                        padding: [0, 50, 0, 0],
                        data: this.legend,
                        textStyle: {
                            color: '#000'
                        }
                    },
                    xAxis: [
                        {
                            type: this.options.xAxisType ? this.options.xAxisType : 'category',
                            data: this.options.xAxis,
                            max: this.options.xAxis.max ? this.options.xAxis.max : null,
                            axisLabel: {
                                interval: 0,
                                textStyle: {
                                    color: '#000'
                                },
                                formatter: this.options.flag ? {} : function (value, index) {
                                    var str = value.split('');
                                    return str.join('\n');
                                }
                            },
                            axisTick: {
                                onGap: 0,
                                lineStyle: {
                                    color: '#767d8f'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#767d8f'
                                }
                            },
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: this.options.yAxisType ? this.options.yAxisType : 'value',
                            data: this.options.yAxisType ? ['今年', '去年'] : [],
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dashed',
                                    color: ['#4e5159']
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#767d8f'
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#000'
                                }
                            }
                        }
                    ],
                    series: this.options.series
                };

                // 传不同的ID就可以在不同的地方复用 可以传不同的组件，不会出错(其实我个人感觉没什么意义)
                let chart = echarts.init(document.getElementById(this.uniqueID));

                chart.clear();

                chart.setOption(options, true);
                if (this.options.monitor) {
                    chart.on('click', function (params) {
                        if (_this.options.dateType === 2) {
                            _this.$emit('passIndex', params.dataIndex + 1);
                        } else {
                            _this.$emit('passIndex', params.dataIndex);
                        }
                    });
                }
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
<style scoped>
.bar {
  width: 100%;
}
</style>
