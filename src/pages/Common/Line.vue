<template>
  <div>
      <div class="flaxs" style="float:right;margin-right:10px">
          <div  class="flaxs" v-for="(item,index) in options.series" :key="index">
            <template v-if="item.itemStyle">
                <div class="yuan" :style="'border:1px solid' + item.itemStyle.color"></div>
                <div class="text">{{item.name}}</div>
            </template>
          </div>
      </div>
      <div :id="uniqueID" class="line" :style="baseStyle"></div>
  </div>
</template>
<script>
    import uuid from 'uuid/v1';
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/title';
    export default {
        name: 'line-chart',
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
                echart: '',
                baseStyle: {
                    height: this.options.height
                        ? this.options.height
                        : this.$store.state.innerComponentHeight
                }
            };
        },
        created () {
            this.uniqueID = uuid();
        },
        mounted () {
            this.init();
            console.log(this.options.title.text);
        },
        methods: {
            init () {
                let that = this;
                const options = {
                    title: {
                        show: this.options.title.show,
                        text: this.options.title.text,
                        textStyle: {
                            color: '#FFF',
                            fontSize: 16
                        },
                        left: 0,
                        top: 0
                    },
                    grid: {
                        x: 50,
                        y: 65,
                        x2: 60,
                        y2: this.options.grid ? this.options.grid : 80,
                        borderWidth: 0,
                        bottom: '50'
                    },
                    tooltip: {
                        trigger: 'axis',
                        confine: true,
                        formatter: function (datas) {
                            let res = '';
                            for (let i = 0, length = datas.length; i < length; i++) {
                                if (that.options.time && i === 0) { res = '时间' + ': ' + datas[i].axisValue + '<br/>'; }
                                res +=
                                    datas[i].marker +
                                    datas[i].seriesName +
                                    '：' +
                                    (datas[i].value !== undefined
                                        ? datas[i].value === true
                                            ? '合闸'
                                            : datas[i].value === false
                                                ? '分闸'
                                                : datas[i].value
                                    : '') +
                                    '<br/>';
                            }
                            return res;
                        }
                    },
                    // legend: {
                    //     show:
                    //         this.options.legendDisplay === false
                    //             ? this.options.legendDisplay
                    //             : true,
                    //     x: 'right',
                    //     y: 'top',
                    //     data: this.options.series,
                    //     padding: 10,
                    //     selectedMode: this.options.legendSelect
                    //         ? this.options.legendSelect
                    //         : false,
                    //     textStyle: {
                    //         color: '#fff'
                    //     }
                    // },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.options.xAxis,
                            axisLabel: {
                                show: true,
                                rotate: 0,
                                textStyle: {
                                    color: '#fff'
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
                            },
                            rotate: -25
                        }
                    ],
                    yAxis: [
                        {
                            name: this.options.nameY,
                            minInterval: this.$route.meta.isShowtabbar ? 1 : '',
                            type: 'value',
                            splitArea: {
                                show: true,
                                areaStyle: {
                                    color: ['transparent', 'transparent']
                                }
                            },
                            splitLine: {
                                show: this.options.splitLine ? this.options.splitLine : false,
                                lineStyle: {
                                    color: '#274473'
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
                                    color: '#fff'
                                }
                            }
                        }
                    ],
                    series: this.options.series
                };
                let chart = echarts.init(document.getElementById(this.uniqueID));
                this.echart = chart;
                chart.setOption(options, true);
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
                        setTimeout(this.init, 500);
                    }
                },
                deep: true
            },
            '$store.state.innerComponentHeight': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.baseStyle.height = newVal;
                    }
                }
            }
        }
    };
</script>
<style lang="less" scoped>
.line {
  width: 100%;
}
.flaxs{
    display: flex;
    .yuan{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fff;
    }
    .text{
        margin-left: 10px;
        margin-top: -5px;
        font-size: 14px;
    }
}
</style>
