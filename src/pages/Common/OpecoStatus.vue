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
    import 'echarts/lib/chart/line';
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/title';

    export default {
        name: 'OpecoStatus',
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
            setTimeout(() => {
                this.init();
            }, 500);
        },
        methods: {
            init () {
                var options = {
                    grid: {
                        top: '0%',
                        left: '5%',
                        right: '5%',
                        bottom: '20%',
                        borderWidth: 0
                    },
                    xAxis: [

                        {
                            axisTick: {
                                show: true,
                                textStyle: {
                                    color: '#fff' // 坐标值得具体的颜色
                                }
                            },
                            axisLabel: {
                                show: true,
                                rotate: 0,
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            },
                            data: this.options.time
                        },
                        {
                            type: 'value',
                            min: 20,
                            max: 80,
                            gridIndex: 0,
                            splitLine: {
                                show: false,
                                textStyle: {
                                    color: '#fff' // 坐标值得具体的颜色
                                }
                            },
                            axisLine: {// y轴线的颜色以及宽度
                                show: false

                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            show: false,
                            min: 0,
                            max: 20,
                            position: 'right',
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false

                            }
                        },
                        {
                            type: 'category',
                            position: 'left',
                            axisLabel: {
                                show: true
                            },
                            axisLine: {// y轴线的颜色以及宽度
                                show: false,
                                lineStyle: {
                                    color: '#fff',
                                    type: 'solid'
                                }
                            },
                            axisTick: {
                                show: false // 刻度线
                            },
                            splitLine: {
                                show: false
                            },
                            data: ['关闭', '打开']

                        }
                    ],
                    series: [

                        {
                            type: 'line',
                            name: '关闭',
                            symbol: 'none',
                            z: 2,
                            lineStyle: {
                                normal: {
                                    width: 0,
                                    opacity: 0

                                }
                            },
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0]

                        },
                        {
                            type: 'line',
                            name: '打开',
                            symbol: 'none',
                            z: 0,
                            lineStyle: {
                                normal: {
                                    width: 0,
                                    opacity: 0
                                }
                            },
                            data: [10, 10, 10, 10, 10, 10, 10, 10, 10]
                        },
                        {
                            name: '阀门状态',
                            type: 'bar',
                            stack: '阀门状态',
                            barCategoryGap: 0,
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                        {
                                            offset: 0,
                                            color: 'transparent'
                                        },
                                        {
                                            offset: 0.5,
                                            color: 'transparent'
                                        },
                                        {
                                            offset: 0.8,
                                            color: 'rgba(0, 0, 0, 0)'
                                        },
                                        {
                                            offset: 0.92,
                                            color: 'rgba(0, 0, 0, 0)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(0, 0, 0, 0)'
                                        }
                                    ])
                                }
                            },
                            data: this.options.data
                        },
                        {
                            type: 'bar',
                            stack: '阀门状态',
                            silent: true,
                            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                            barMinHeight: 1,
                            itemStyle: {
                                normal: {
                                    color: '#007eff',
                                    shadowColor: 'rgba(0, 0, 0, 1)',
                                    shadowBlur: 10,
                                    shadowOffsetX: 0
                                }
                            }
                        }
                    ]
                };

                // 传不同的ID就可以在不同的地方复用 可以传不同的组件，不会出错(其实我个人感觉没什么意义)
                let chart = echarts.init(document.getElementById(this.uniqueID));
                chart.clear();
                chart.setOption(options, true);
                window.addEventListener('resize', function () {
                    chart.resize();
                });
            }
        },
        watch: {

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
