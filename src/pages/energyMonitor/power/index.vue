<template>
  <div id="power">
    <Col :style="powerTableHeight">
      <!-- <h3 style="padding: 10px">电量</h3> -->
      <div style="position:relative">
          <div style="height:50px;width:100%;background:#1a202e;position:absolute"></div>
      </div>
      <Tabs v-model="activeName" name="name" style="padding-top:3px;" >
        <TabPane label="用电情况" name="first" tab="name">
          <eletrcDetail></eletrcDetail>
        </TabPane>
        <TabPane label="近两年用电情况" name="second" tab="name">
          <Col :span="24">
            <div
              class="pd content"
              style="background-color: #1a202e;  padding: 15px"
            >
              <div style="display: flex">
                <Col :span="1"></Col>
                <Col :span="20">
                  <h3 style="margin-left: -40px">各月用电量</h3></Col
                >
                <div class="active active1"></div>
                <h6>2021</h6>
                <div class="active active2"></div>
                <h6>2022</h6>
              </div>
              <BarCharts :options="optionsFirst"></BarCharts>
            </div>
          </Col>
          <Row style="margin-top: 10px" :gutter="5">
            <Col :span="12">
              <div
                class="pd content"
                style="background-color: #1a202e;  padding: 15px"
              >
                <LineCharts :options="optionsSecond"></LineCharts>
              </div>
            </Col>
            <Col :span="12">
              <div
                class="pd content"
                style="background-color: #1a202e;  padding: 15px"
              >
                <BarCharts :options="optionsThird"></BarCharts>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="自定义组合电量" name="third" tab="name">
          <Custompower></Custompower>
        </TabPane>
      </Tabs>
    </Col>
  </div>
</template>
<script>
    import eletrcDetail from './eletrcDetail.vue';
    import Custompower from './CustompowerCombination.vue';
    import BarCharts from './Bars.vue';
    import LineCharts from './eleclines.vue';
    import echarts from 'echarts/lib/echarts';
    import { getLoadYears } from '@/api/console/project';
    export default {
        name: 'energyMonitor-power',
        components: { eletrcDetail, BarCharts, LineCharts, Custompower },
        data () {
            return {
                activeName: 'first',
                gauge: true,
                firstCommand: '',
                powerHeight: {},
                powerTableHeight: {
                    height:
                        window.innerHeight < 969
                            ? 969 - 225 + 'px'
                            : window.innerHeight - 225 + 'px'
                },
                groupTableHeight: {
                    height:
                        window.innerHeight < 969
                            ? 969 - 388 + 'px'
                            : window.innerHeight - 388 + 'px'
                },
                optionsFirst: {
                    legendStatus: true,
                    legend: [],
                    series: [],
                    xAxis: [],
                    title: {
                        show: true,
                        text: '',
                        left: 0
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        formatter:
                            '{b}<br/>{a0}' +
                            '年' +
                            '：{c0} ' +
                            '度' +
                            '<br/>{a1}' +
                            '年' +
                            '：{c1} ' +
                            '度'
                    }
                },
                optionsSecond: {
                    series: [],
                    xAxis: [],
                    title: {
                        show: true,
                        text: '电量同比'
                    }
                },
                optionsThird: {
                    legendStatus: false,
                    xAxisType: 'value',
                    yAxisType: 'category',
                    xAxis: [
                        {
                            max: null
                        }
                    ],
                    series: [],
                    title: {
                        show: true,
                        text: '',
                        padding: 2
                    },
                    tooltip: {
                        show: false,
                        trigger: '',
                        formatter: ''
                    }
                }
            };
        },
        created () {

        },
        mounted () {
            this.initCharts();
        },
        methods: {
            handleClick (val) {
                if (val === 'second') {
                    this.initCharts();
                    // this.gauge = false;
                    // this.first = true;
                }
                // if (val === 'third') {
                //     this.powerHeight = null;
                //     this.gauge = false;
                //     this.first = false;
                //     this.formInline.value = this.years[0].value;
                //     this.formInline.region = String(
                //         new Date().getMonth() + 1 > 9
                //             ? new Date().getMonth() + 1
                //             : '0' + (new Date().getMonth() + 1)
                //     );
                //     this.onSubmit();
                // }

                //
            },
            initCharts () {
                this.optionsFirst.series = [];
                this.optionsFirst.xAxis = [];
                this.optionsSecond.series = [];
                this.optionsSecond.xAxis = [];
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                //  let that = this;
                getLoadYears(params)
                    .then((res) => {
                        if (res.success) {
                            let year = [new Date().getFullYear() - 1, new Date().getFullYear()];
                            let month = new Date().getMonth() + 1;
                            let bardata = { lastyear: [], thisyear: [] };
                            let bardata2 = { value: [0, 0] };
                            let value = 0;
                            let linedata = { value: [] };
                            this.optionsFirst.legend = year;
                            // this.optionsFirst.yAxis = {
                            //     name: '金fdjalskdfjhlkasdhfklasdhfklhasdkjhfkjsadh'
                            // };
                            this.optionsFirst.xAxis = [
                                '1月',
                                '2月',
                                '3月',
                                '4月',
                                '5月',
                                '6月',
                                '7月',
                                '8月',
                                '9月',
                                '10月',
                                '11月',
                                '12月'
                            ];

                            this.optionsSecond.xAxis = this.optionsFirst.xAxis.slice(0, month);
                            res.data.forEach(function (v, i) {
                                if (v.prePower === '-' || v.prePower === '0.000') {
                                    v.prePower = 0.1;
                                }
                                if (v.afterPower === '-' || v.afterPower === '0.00') {
                                    v.afterPower = 0.01;
                                }
                                bardata.lastyear[i] = v.prePower;
                                bardata.thisyear[i] = v.afterPower;
                                linedata.value[i] =
                                    v.afterPower === '-'
                                        ? '0'
                                        : v.prePower === 0
                                            ? v.afterPower === 0
                                                ? 0
                                                : '0'
                                            : ((v.afterPower - v.prePower) / v.prePower).toFixed(1);
                                if (i > month) {
                                } else {
                                    bardata2.value[0] += Number(v.afterPower);
                                    bardata2.value[1] += Number(v.prePower);
                                }
                            });
                            // bardata2.value[0] =
                            //     bardata2.value[0] !== 0
                            //         ? Number(bardata2.value[0].toFixed(1))
                            //         : 0;
                            // bardata2.value[1] =
                            //     bardata2.value[1] !== 0
                            //         ? Number(bardata2.value[1].toFixed(1))
                            //         : 0;
                            if (bardata2.value[1] === 0) {
                                value = bardata2.value[0].toFixed(1);
                                this.optionsThird.title.text =
                                    '用电量对比去年' + '1-' + month + '月多出' + value + '度';
                            } else {
                                value = Math.abs(
                                    (
                                        ((bardata2.value[0] - bardata2.value[1]) /
                                        bardata2.value[1]) *
                                        100
                                    ).toFixed(1)
                                );
                                if (month <= 1) {
                                    if (bardata2.value[0] - bardata2.value[1] < 0) {
                                        this.optionsThird.title.text =
                                            '用电量对比去年1月节约' + value + '%';
                                    } else if (bardata2.value[0] - bardata2.value[1] > 0) {
                                        this.optionsThird.title.text =
                                            '用电量对比去年1月超出' + value + '%';
                                    } else {
                                        this.optionsThird.title.text = '用电量对比去年月持平';
                                    }
                                } else {
                                    if (bardata2.value[0] - bardata2.value[1] < 0) {
                                        this.optionsThird.title.text =
                                            '用电量对比去年' + '1-' + month + '月节约' + value + '%';
                                    } else if (bardata2.value[0] - bardata2.value[1] > 0) {
                                        this.optionsThird.title.text =
                                            '用电量对比去年' + '1-' + month + '月超出' + value + '%';
                                    } else {
                                        this.optionsThird.title.text =
                                            '用电量对比去年' + '1-' + month + '月持平';
                                    }
                                }
                            }
                            this.optionsThird.xAxis.max =
                                bardata2.value[0] > bardata2.value[1]
                                    ? bardata2.value[0] * 1.2
                                    : bardata2.value[1] * 1.2;
                            this.optionsFirst.series.push({
                                name: year[0],
                                type: 'bar',
                                barMaxWidth: '15',
                                data: bardata.lastyear,
                                itemStyle: {
                                    emphasis: { barBorderRadius: 0 },
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(
                                            0,
                                            1,
                                            0,
                                            0, // 这里不同的排序会出现不同的效果   查看4 渐变规则
                                            [
                                                { offset: 1, color: '#21F27F' }, // 红
                                                // 可以加0.2等
                                                { offset: 0, color: 'rgba(26, 32, 46,.2)' } // 黑
                                            ]
                                        ),
                                        barBorderRadius: 0
                                    }
                                }
                            });
                            this.optionsFirst.series.push({
                                name: year[1],
                                type: 'bar',
                                barMaxWidth: '15',
                                data: bardata.thisyear,
                                itemStyle: {
                                    emphasis: { barBorderRadius: 0 },
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(
                                            0,
                                            1,
                                            0,
                                            0, // 这里不同的排序会出现不同的效果   查看4 渐变规则
                                            [
                                                { offset: 1, color: '#007EFF' },
                                                // 可以加0.2等
                                                { offset: 0, color: 'rgba(26, 32, 46,.2)' } // 黑
                                            ]
                                        ),
                                        barBorderRadius: 0
                                    }
                                }
                            });
                            //
                            this.optionsSecond.series = {
                                name: '电量（度）同比',
                                type: 'line',
                                smooth: true,
                                data: linedata.value,
                                itemStyle: { normal: { color: '#007EFF' } },
                                symbol: 'emptyCircle',
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                            { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                        ],
                                        global: false
                                    }
                                }
                            };
                            this.optionsThird.series = {
                                type: 'bar',
                                barMaxWidth: 10,
                                data: bardata2.value,
                                itemStyle: {
                                    emphasis: { barBorderRadius: 0 },
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(
                                            0,
                                            0,
                                            1,
                                            0, // 这里不同的排序会出现不同的效果   查看4 渐变规则
                                            [
                                                { offset: 1, color: '#007EFF' },
                                                // 可以加0.2等
                                                { offset: 0, color: 'rgba(26, 32, 46,.2)' } // 黑
                                            ]
                                        ),
                                        barBorderRadius: 0,
                                        label: {
                                            show: true,
                                            position: 'right',
                                            textStyle: { color: '#fff' }
                                        }
                                    }
                                }
                            };
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
.active {
  width: 10px;
  height: 10px;
  margin-top: 3px;
  margin-right: 5px;
}
.active1 {
    margin-left: 40px;
  background: #0dd667;
}
.active2 {
  background: #1c57ff;
  margin-left: 35px;
}
</style>
