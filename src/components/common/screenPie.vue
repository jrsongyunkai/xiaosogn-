<template>
  <div>
    <div :id="uniqueID" class="screen-pie" :style="baseStyle"></div>
  </div>
</template>
<script>
    import uuid from 'uuid/v1'
    import echarts from 'echarts/lib/echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    export default {
        name: 'screen-pie',
        props: {
            title: String,
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
                    height: '235px'
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
                let sum = this.options.data.forEach(element => {
                    sum = element.value + sum
                })
                const options = {
                    tooltip: {
                        show: false,
                        trigger: 'item'
                    },
                    legend: {
                        textStyle: {
                            color: '#fff'
                        },
                        left: 'auto',
                        top: 'auto',
                        right: 20,
                        type: 'scroll',
                        orient: 'vertical'
                    },
                    series: [
                        {
                            name: 'alarm',
                            type: 'pie',
                            radius: ['60%', '80%'],
                            center: ['35%', '50%'],
                            avoidLabelOverlap: true,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#000',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '16',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    formatter: '{c}\n\n{b}\n\n{d}%'
                                },
                                scale: false
                            },
                            labelLine: {
                                show: false
                            },
                            data: this.options.data
                        }
                    ]
                };
                let chart = echarts.init(document.getElementById(this.uniqueID))
                this.echart = chart
                chart.clear()
                chart.setOption(options, true)
                window.addEventListener('resize', () => {
                    setTimeout(function () {
                        chart.resize()
                    }, 100)
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
            }
        }
    }
</script>
<style lang="less" scoped>
.manage-line-area{
    width: 100%
}
</style>
