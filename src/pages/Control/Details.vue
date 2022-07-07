<template>
  <div id="detail">
    <Row :gutter="16">
      <Col :span="12">
        <Info :mac="param.mac" ref="hanleInfo"></Info>
      </Col>
      <Col
        :span="12"
        v-if="
          param.equipmentType === 1 ||
          param.equipmentType === 2 ||
          param.equipmentType === 8
        "
      >
        <Col class="info">
          <LineConfiguration :param="param" @hanleInfo="hanleInfo"></LineConfiguration>
        </Col>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 3">
        <!-- 电器火灾 -->
        <Stralsund :param="param"></Stralsund>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 4">
        <Level :mac="param.mac"></Level>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 5">
        <!-- 压力 -->
        <Pressure :mac="param.mac"></Pressure>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 6">
        <!-- 烟感 -->
        <Smoke :mac="param.mac"></Smoke>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 7">
        <!-- 可燃气体 -->
        <FlammableGas :mac="param.mac"></FlammableGas>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 10">
        <!-- 烟感 -->
        <smokeAlarm :mac="param.mac"></smokeAlarm>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 11">
        <!-- 温湿度 -->
        <TemperatureHumiditySensor
          :param="param"
          :online="param.others.online"
        ></TemperatureHumiditySensor>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 12">
        <!-- 电表 -->
        <SmartMeter
          :mac="param.mac"
          :model="param.model"
          :online="param.others.online"
        ></SmartMeter>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 13">
        <!-- 可燃气体探测设备 -->
        <smokeAlarm :mac="param.mac"></smokeAlarm>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 14">
        <!-- 光照采集器 -->
        <IlluminanceSensing :param="param"></IlluminanceSensing>
      </Col>
      <Col :span="12" v-if="param.equipmentType === 15">
        <!-- 智能水表 -->
        <IntelligentWaterMeter :param="param"></IntelligentWaterMeter>
      </Col>
      <!-- 智能水表 -->
      <Col :span="12" v-if="param.equipmentType === 16">
        <MeterReadingCat :param="param"></MeterReadingCat>
      </Col>
    </Row>
    <div class="header" style="margin-bottom: 10px">
      <div class="bor"></div>
      <h4>数据趋势</h4>
    </div>
    <!-- <div style="margin-bottom: 10px"><hr /></div> -->

    <Row>
      <Col class="stralsund" v-if="param.equipmentType === 15">
        <LineChart :options="IntelligentWaterMeter"></LineChart>
      </Col>
      <Col
        class="mantunsci"
        :span="12"
        v-if="
          param.equipmentType === 1 ||
          param.equipmentType === 2 ||
          param.equipmentType === 8
        "
      >
        <LineChart
          :options="residualCurrent"
          :onGetEchartsInstance="onGetEchartsInstance"
        ></LineChart>
      </Col>
      <Col
        class="mantunsci"
        :span="12"
        v-if="
          param.equipmentType === 1 ||
          param.equipmentType === 2 ||
          param.equipmentType === 8
        "
      >
        <LineChart
          :options="temperature"
          :onGetEchartsInstance="onGetEchartsInstance"
        ></LineChart>
      </Col>
    </Row>
    <Row>
      <Col class="stralsund" v-if="param.equipmentType === 3" :span="12">
        <LineChart :options="stralsund"></LineChart>
      </Col>
      <Col class="stralsund" v-if="param.equipmentType === 4" :span="12">
        <LineChart :options="level"></LineChart>
      </Col>
      <Col class="stralsund" v-if="param.equipmentType === 5" :span="12">
        <LineChart :options="pressure"></LineChart>
      </Col>
      <Col class="stralsund" v-if="param.equipmentType === 6" :span="12">
        <LineChart :options="smoke"></LineChart>
      </Col>
      <Col class="stralsund" v-if="param.equipmentType === 7" :span="12">
        <LineChart :options="flammableGas"></LineChart>
      </Col>
      <Col class="mantunsci" v-if="param.equipmentType === 10" :span="12">
        <LineChart :options="smokeAlarm"></LineChart>
      </Col>
      <Col class="mantunsci" v-if="param.equipmentType === 10" :span="12">
        <LineChart :options="smokeVoltage"></LineChart>
      </Col>
      <Col class="mantunsci" v-if="param.equipmentType === 11" :span="12">
        <LineChart :options="temperatureSensor"></LineChart>
      </Col>
      <Col class="mantunsci" v-if="param.equipmentType === 11" :span="12">
        <LineChart :options="humiditySensor"></LineChart>
      </Col>
      <Col class="mantunsci" v-if="param.equipmentType === 12" :span="12">
        <LineChart :options="smartMeterVoltage"></LineChart>
      </Col>
      <Col class="mantunsci" v-if="param.equipmentType === 12" :span="12">
        <LineChart :options="smartMeterAmpere"></LineChart>
      </Col>
      <Col class="mantunsci" v-if="param.equipmentType === 13" :span="12">
        <LineChart :options="smokeAlarm"></LineChart>
      </Col>
      <Col class="mantunsci" v-if="param.equipmentType === 13" :span="12">
        <LineChart :options="combustibleGas"></LineChart>
      </Col>
      <Col class="stralsund" v-if="param.equipmentType === 14" :span="12">
        <LineChart :options="Illuminance"></LineChart>
      </Col>
      <!-- <Col
        :span="24"
        v-if="
          param.equipmentType === 1 ||
          param.equipmentType === 2 ||
          param.equipmentType === 8
        "
        class="voltagC"
      ></Col> -->
      <Col class="mantunsci" :span="12"  v-if="
          param.equipmentType === 1 ||
          param.equipmentType === 2 ||
          param.equipmentType === 8
        ">
        <LineChart
          v-if="param.equipmentType === 1 ||
          param.equipmentType === 2 ||
          param.equipmentType === 8"
          :options="voltage"
          :onGetEchartsInstance="onGetEchartsInstance"
        ></LineChart>
      </Col>
      <Col class="mantunsci" :span="12"  v-if="
          param.equipmentType === 1 ||
          param.equipmentType === 2 ||
          param.equipmentType === 8
        ">
        <LineChart
            v-if="param.equipmentType === 1 ||
          param.equipmentType === 2 ||
          param.equipmentType === 8"
          :options="current"
          :onGetEchartsInstance="onGetEchartsInstance"
        ></LineChart>
      </Col>
    </Row>
    <!-- <Col :span="24" style="display: flex">
        <Col span="12" style="display: flex; flex-wrap: wrap">
          <Col style="display: flex">
          </Col>
        </Col>
      </Col> -->
    <Row>
      <Col
        :span="24"
        v-if="param.equipmentType !== 12 && param.equipmentType !== 16"
      >
        <AlarmRecordList
          :mac="param.mac"
          :equipmentType="param.equipmentType"
          @clickAlarm="clickAlarm"
        ></AlarmRecordList>
      </Col>
      <Col
        :span="24"
        v-if="param.equipmentType !== 12 && param.equipmentType !== 16"
      >
        <MaintenanceRecords
        id="modal"
          ref="MaintenanceRecords"
          :mac="param.mac"
          :equipmentType="param.equipmentType"
        ></MaintenanceRecords>
      </Col>
    </Row>
  </div>
</template>
<script>
    import MeterReadingCat from './MeterReadingCat.vue';
    import SmartMeter from './SmartMeter.vue';
    import IntelligentWaterMeter from './IntelligentWaterMeter.vue';
    import IlluminanceSensing from './IlluminanceSensing.vue';
    import TemperatureHumiditySensor from './TemperatureHumiditySensor.vue';
    import smokeAlarm from './smokeAlarm.vue';
    import FlammableGas from './FlammableGas.vue';
    import Smoke from './Smoke.vue';
    import Pressure from './Pressure.vue';
    import Level from './Level.vue';
    import Info from './Info';
    import LineChart from '../Common/Line';
    import LineConfiguration from './LineConfiguration';
    import AlarmRecordList from './AlarmRecordList';
    import Stralsund from './Stralsund';
    import store from '@/store/index';
    import MaintenanceRecords from './MaintenanceRecords';
    import {
        channelHistory,
        zhlora,
        queryHuaxuChnlHistory,
        queryForsafeChnllHistory,
        norChannelHistory
    } from '@/api/control/index';
    import {
        getEffectAddr,
        queryTlinkChnlHistory,
        queryChtqdqMeterReadingDataHistory,
        queryRenkeChnlHistory,
        winextlora,
        querySmokeHistory
    } from '@/api/public';
    export default {
        props: {
            param: {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        components: {
            LineChart,
            Info,
            Level,
            Smoke,
            Pressure,
            smokeAlarm,
            TemperatureHumiditySensor,
            FlammableGas,
            MeterReadingCat,
            IlluminanceSensing,
            LineConfiguration,
            Stralsund,
            SmartMeter,
            IntelligentWaterMeter,
            AlarmRecordList,
            MaintenanceRecords
        },
        data () {
            return {
                residualCurrent: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text:
                            (this.param.equipmentType === 8 ? '漏电流' : '剩余电流(安)') +
                            '(A)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px' // this.$store.state.windowHeight / 4 + 'px'
                },
                temperature: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '温度(℃)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px' //  this.$store.state.windowHeight / 4 + 'px'
                },
                voltage: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '电压(伏)' + '(V)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px' // this.$store.state.windowHeight / 4 + 'px'
                },
                current: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '电流(安)' + '(A)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px' // this.$store.state.windowHeight / 4 + 'px'
                },
                stralsund: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                pressure: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                level: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                smoke: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                flammableGas: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                smokeAlarm: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '信号强度' + '(%)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                smokeVoltage: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '电压(伏)' + '(V)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                combustibleGas: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '浓度' + '(%)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                temperatureSensor: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '温度' + '(℃)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                humiditySensor: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '湿度' + '(%RH)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                smartMeterVoltage: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '电压(伏)' + '(V)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                smartMeterAmpere: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '电流' + '(A)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                leakageCurrent: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '漏电流' + '(mA)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                electricCurrent: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '电流' + '(A)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                lineTemperature: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '温度' + '(℃)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                lineVoltage: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '电压(伏)' + '(V)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                power: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '功率(瓦)' + '(W)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                powerFactor: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '功率因数'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                Illuminance: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '光照' + '度' + '(Lux)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                IntelligentWaterMeter: {
                    xAxis: [],
                    series: [],
                    title: {
                        show: true,
                        text: '吨(t)'
                    },
                    grid: 40,
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                    height: '213px'
                },
                timerID: null,
                mac: this.$store.state.mac
            };
        },
        methods: {
            init () {
                if (
                    this.param.equipmentType === 1 ||
                    this.param.equipmentType === 2 ||
                    this.param.equipmentType === 8
                ) {
                    if (this.$store.state.detailsAddr === '') {
                        return false;
                    } else {
                        if (this.param.equipmentType === 8) {
                            this.queryZhlora();
                        } else {
                            this.queryChannelHistory();
                        }
                    }
                } else if (this.param.equipmentType === 6) {
                    this.querySmoke();
                } else if (this.param.equipmentType === 12) {
                    this.queryChtqdqMeterReadingData();
                }
            },
            clickAlarm () {
                this.$refs.MaintenanceRecords.init();
            },

            onGetEchartsInstance (echart) {
                if (this.param.equipmentType === 1 || this.param.equipmentType === 2) {
                    echart.getZr().off('dblclick');
                    echart.getZr().on('dblclick', () => {
                        this.dialogVisible = true;
                        this.queryRouteList();
                    });
                }
            },
            queryChannelHistory () {
                let params = {
                    mac: this.param.mac,
                    addr: this.$store.state.detailsAddr,
                    startTime: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate(),
                    endTime: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate()
                };
                channelHistory(params)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = res.data.xAxis.map(function (str) {
                                return str.split(' ')[1];
                            });

                            this.residualCurrent.xAxis = xAxis;
                            this.voltage.xAxis = xAxis;
                            this.temperature.xAxis = xAxis;
                            this.current.xAxis = xAxis;
                            if (res.data.lstGLd) {
                                this.residualCurrent.series = [
                                    {
                                        name: '剩余电流(安)',
                                        type: 'line',
                                        data: res.data.lstGLd,
                                        smooth: true,
                                        showAllSymbol: true,
                                        symbolSize: 2
                                    },
                                    {
                                        name: '状态',
                                        type: 'line',
                                        data: res.data.ocList,
                                        color: '#909399',
                                        smooth: false,
                                        showAllSymbol: false,
                                        symbolSize: 0,
                                        lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                                    }
                                ];
                            } else {
                                this.residualCurrent.series = [];
                            }

                            if (res.data.lstGV) {
                                if (!res.data.lstAV) {
                                    this.voltage.series = [
                                        {
                                            name: '电压(伏)',
                                            type: 'line',
                                            data: res.data.lstGV,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: '状态',
                                            type: 'line',
                                            data: res.data.ocList,
                                            color: '#909399',
                                            smooth: false,
                                            showAllSymbol: false,
                                            symbolSize: 0,
                                            lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                                        }
                                    ];
                                } else {
                                    this.voltage.series = [
                                        {
                                            name: '电压',
                                            type: 'line',
                                            data: res.data.lstGV,
                                            color: '#e062ea',
                                            lineStyle: { color: '#e062ae' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'A' + '相' + '电压(伏)',
                                            type: 'line',
                                            data: res.data.lstAV,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'B' + '相' + '电压(伏)',
                                            type: 'line',
                                            data: res.data.lstBV,
                                            color: '#ffdb5c',
                                            lineStyle: { color: '#ffdb5c' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'C' + '相' + '电压(伏)',
                                            type: 'line',
                                            data: res.data.lstCV,
                                            color: '#c23531',
                                            lineStyle: { color: '#c23531' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: '状态',
                                            type: 'line',
                                            data: res.data.ocList,
                                            color: '#909399',
                                            smooth: false,
                                            showAllSymbol: false,
                                            symbolSize: 0,
                                            lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                                        }
                                    ];
                                }
                            } else {
                                this.voltage.series = [];
                            }
                            if (res.data.lstGT) {
                                if (!res.data.lstAT) {
                                    this.temperature.series = [
                                        {
                                            name: '温度',
                                            type: 'line',
                                            data: res.data.lstGT,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: '状态',
                                            type: 'line',
                                            data: res.data.ocList,
                                            color: '#909399',
                                            smooth: false,
                                            showAllSymbol: false,
                                            symbolSize: 0,
                                            lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                                        }
                                    ];
                                } else {
                                    this.temperature.series = [
                                        {
                                            name: '温度',
                                            type: 'line',
                                            data: res.data.lstGT,
                                            color: '#e062ea',
                                            lineStyle: { color: '#e062ae' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'A' + '相' + '温度',
                                            type: 'line',
                                            data: res.data.lstAT,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'B' + '相' + '温度',
                                            type: 'line',
                                            data: res.data.lstBT,
                                            color: '#ffdb5c',
                                            lineStyle: { color: '#ffdb5c' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'C' + '相' + '温度',
                                            type: 'line',
                                            data: res.data.lstCT,
                                            color: '#c23531',
                                            lineStyle: { color: '#c23531' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: '状态',
                                            type: 'line',
                                            data: res.data.ocList,
                                            color: '#909399',
                                            smooth: false,
                                            showAllSymbol: false,
                                            symbolSize: 0,
                                            lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                                        }
                                    ];
                                }
                            } else {
                                this.temperature.series = [];
                            }
                            if (res.data.lstGA) {
                                if (!res.data.lstAA) {
                                    this.current.series = [
                                        {
                                            name: '电流',
                                            type: 'line',
                                            data: res.data.lstGA,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: '状态',
                                            type: 'line',
                                            data: res.data.ocList,
                                            color: '#909399',
                                            smooth: false,
                                            showAllSymbol: false,
                                            symbolSize: 0,
                                            lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                                        }
                                    ];
                                } else {
                                    this.current.series = [
                                        {
                                            name: '电流',
                                            type: 'line',
                                            data: res.data.lstGA,
                                            color: '#e062ea',
                                            lineStyle: { color: '#e062ae' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'A' + '相' + '电流',
                                            type: 'line',
                                            data: res.data.lstAA,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'B' + '相' + '电流',
                                            type: 'line',
                                            data: res.data.lstBA,
                                            color: '#ffdb5c',
                                            lineStyle: { color: '#ffdb5c' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'C' + '相' + '电流',
                                            type: 'line',
                                            data: res.data.lstCA,
                                            color: '#c23531',
                                            lineStyle: { color: '#c23531' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: '状态',
                                            type: 'line',
                                            data: res.data.ocList,
                                            color: '#909399',
                                            smooth: false,
                                            showAllSymbol: false,
                                            symbolSize: 0,
                                            lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                                        }
                                    ];
                                }
                            } else {
                                this.current.series = [];
                            }
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
                    })
                    .finally(() => {});
            },
            queryRouteList () {
                let params = {
                    mac: this.mac
                };
                getEffectAddr(params).then((res) => {
                    if (res.success) {
                        if (res.datas.length > 0) {
                            this.tableData = res.datas;
                            if (this.param.equipmentType === (1 || 2)) {
                                this.queryLineListData(this.tableData[0].addr);
                            } else if (
                                this.param.equipmentType === 11 ||
                                this.param.equipmentType === 14
                            ) {
                                store.commit('nodeId', this.tableData[0].nodeId);
                                this.queryRenkeChnl();
                            }
                        }
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            handleClick (row, rowindex) {
                this.index = rowindex;
                this.queryLineListData(row.addr);
                this.rowAddr = row.addr;
            },
            onSubmit () {
                let addr = this.rowAddr !== '' ? this.rowAddr : this.tableData[0].addr;
                this.queryLineListData(addr);
            },
            queryLineListData (addr) {
                let params = {
                    mac: this.mac,
                    startTime: this.value1[0],
                    endTime: this.value1[1],
                    addr: addr
                };
                channelHistory(params)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = res.data.xAxis.map(function (str) {
                                return str.split(' ')[1];
                            });
                            this.electricCurrent.xAxis = xAxis;
                            this.lineTemperature.xAxis = xAxis;
                            this.lineVoltage.xAxis = xAxis;
                            this.power.xAxis = xAxis;
                            this.powerFactor.xAxis = xAxis;
                            this.leakageCurrent.xAxis = xAxis;
                            if (res.data.lstGLd) {
                                this.leakageCurrent.series = [
                                    {
                                        name: '漏电流',
                                        type: 'line',
                                        data: res.data.lstGLd,
                                        smooth: true,
                                        showAllSymbol: true,
                                        symbolSize: 2
                                    }
                                ];
                            } else {
                                this.leakageCurrent.series = [];
                            }
                            if (res.data.lstGV) {
                                if (!res.data.lstAV) {
                                    this.lineVoltage.series = [
                                        {
                                            name: '电压',
                                            type: 'line',
                                            data: res.data.lstGV,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                } else {
                                    this.lineVoltage.series = [
                                        {
                                            name: '电压',
                                            type: 'line',
                                            data: res.data.lstGV,
                                            color: '#e062ea',
                                            lineStyle: { color: '#e062ae' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'A' + '相' + '电压',
                                            type: 'line',
                                            data: res.data.lstAV,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'B' + '相' + '电压',
                                            type: 'line',
                                            data: res.data.lstBV,
                                            color: '#ffdb5c',
                                            lineStyle: { color: '#ffdb5c' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'C' + '相' + '电压',
                                            type: 'line',
                                            data: res.data.lstCV,
                                            color: '#c23531',
                                            lineStyle: { color: '#c23531' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                }
                            } else {
                                this.lineVoltage.series = [];
                            }
                            if (res.data.lstGA) {
                                if (!res.data.lstAA) {
                                    this.electricCurrent.series = [
                                        {
                                            name: '电流(安)',
                                            type: 'line',
                                            data: res.data.lstGA,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                } else {
                                    this.electricCurrent.series = [
                                        {
                                            name: '电流(安)',
                                            type: 'line',
                                            data: res.data.lstGA,
                                            color: '#e062ea',
                                            lineStyle: { color: '#e062ae' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'A' + '相' + '电流(安)',
                                            type: 'line',
                                            data: res.data.lstAA,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'B' + '相' + '电流(安)',
                                            type: 'line',
                                            data: res.data.lstBA,
                                            color: '#ffdb5c',
                                            lineStyle: { color: '#ffdb5c' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'C' + '相' + '电流(安)',
                                            type: 'line',
                                            data: res.data.lstCA,
                                            color: '#c23531',
                                            lineStyle: { color: '#c23531' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                }
                            } else {
                                this.electricCurrent.series = [];
                            }
                            if (res.data.lstGT) {
                                if (!res.data.lstAT) {
                                    this.lineTemperature.series = [
                                        {
                                            name: '温度',
                                            type: 'line',
                                            data: res.data.lstGT,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                } else {
                                    this.lineTemperature.series = [
                                        {
                                            name: '温度',
                                            type: 'line',
                                            data: res.data.lstGT,
                                            color: '#e062ea',
                                            lineStyle: { color: '#e062ae' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'A' + '相' + '温度',
                                            type: 'line',
                                            data: res.data.lstAT,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'B' + '相' + '温度',
                                            type: 'line',
                                            data: res.data.lstBT,
                                            color: '#ffdb5c',
                                            lineStyle: { color: '#ffdb5c' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'C' + '相' + '温度',
                                            type: 'line',
                                            data: res.data.lstCT,
                                            color: '#c23531',
                                            lineStyle: { color: '#c23531' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                }
                            } else {
                                this.lineTemperature.series = [];
                            }
                            if (res.data.lstGW) {
                                if (!res.data.lstAT) {
                                    this.power.series = [
                                        {
                                            name: '功率',
                                            type: 'line',
                                            data: res.data.lstGW,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                } else {
                                    this.power.series = [
                                        {
                                            name: '功率',
                                            type: 'line',
                                            data: res.data.lstGW,
                                            color: '#e062ea',
                                            lineStyle: { color: '#e062ae' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'A' + '相' + '功率',
                                            type: 'line',
                                            data: res.data.lstAW,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'B' + '相' + '功率',
                                            type: 'line',
                                            data: res.data.lstBW,
                                            color: '#ffdb5c',
                                            lineStyle: { color: '#ffdb5c' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'C' + '相' + '功率',
                                            type: 'line',
                                            data: res.data.lstCW,
                                            color: '#c23531',
                                            lineStyle: { color: '#c23531' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                }
                            } else {
                                this.power.series = [];
                            }
                            if (res.data.lstGPF) {
                                if (!res.data.lstAPF) {
                                    this.powerFactor.title.text = '功率因数';
                                    this.powerFactor.series = [
                                        {
                                            name: '功率因数',
                                            type: 'line',
                                            data: res.data.lstGPF,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                } else {
                                    this.powerFactor.title.text = '合相功率因数';
                                    this.powerFactor.series = [
                                        {
                                            name: '合相功率因数',
                                            type: 'line',
                                            data: res.data.lstGPF,
                                            color: '#e062ea',
                                            lineStyle: { color: '#e062ae' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'A' + '相' + '合相功率因数',
                                            type: 'line',
                                            data: res.data.lstAPF,
                                            color: '#71e1e4',
                                            lineStyle: { color: '#71e1e4' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'B' + '相' + '合相功率因数',
                                            type: 'line',
                                            data: res.data.lstBPF,
                                            color: '#ffdb5c',
                                            lineStyle: { color: '#ffdb5c' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        },
                                        {
                                            name: 'C' + '相' + '合相功率因数',
                                            type: 'line',
                                            data: res.data.lstCPF,
                                            color: '#c23531',
                                            lineStyle: { color: '#c23531' },
                                            smooth: true,
                                            showAllSymbol: true,
                                            symbolSize: 2
                                        }
                                    ];
                                }
                            } else {
                                this.powerFactor.title.text = '功率因数';
                                this.powerFactor.series = [''];
                            }
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
            },
            queryPressure () {
                let params = {
                    mac: this.$store.state.pressureObj.mac,
                    time: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate()
                };
                queryTlinkChnlHistory(params)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = [];
                            if (JSON.stringify(res.data) !== '{}') {
                                xAxis = res.data.timeAxis.map(function (str) {
                                    return str.split(' ')[1];
                                });
                                this.pressure.xAxis = xAxis;
                                if (this.$store.state.pressureObj.type === 't') {
                                    this.pressure.series = [
                                        { type: 'line', data: res.data['t-yAxis'] }
                                    ];
                                    this.pressure.series[0].name = '温度';
                                    this.pressure.title.text = '温度';
                                } else if (this.$store.state.pressureObj.type === 'f') {
                                    this.pressure.series = [
                                        { type: 'line', data: res.data['f-yAxis'] }
                                    ];
                                    this.pressure.series[0].name = '压力';
                                    this.pressure.title.text = '压力';
                                } else {
                                    this.pressure.series = [
                                        { type: 'line', data: res.data['t-yAxis'] }
                                    ];
                                    this.pressure.series[0].name = '温度';
                                    this.pressure.title.text = '温度';
                                }
                            } else {
                                this.pressure.xAxis = [];
                                this.pressure.series = [{ type: 'line', data: [] }];
                                if (this.$store.state.pressureObj.type === 't') {
                                    this.pressure.series[0].name = '温度';
                                    this.pressure.title.text = '温度';
                                } else {
                                    this.pressure.series[0].name = '压力';
                                    this.pressure.title.text = '压力';
                                }
                            }
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
                    })
                    .finally(() => {});
            },
            queryLevel () {
                let params = {
                    mac: this.$store.state.levelObj.mac,
                    time: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate()
                };
                queryTlinkChnlHistory(params)
                    .then((res) => {
                        if (res.success) {
                            if (JSON.stringify(res.data) !== '{}') {
                                let xAxis = res.data.timeAxis.map(function (str) {
                                    return str.split(' ')[1];
                                });
                                this.level.xAxis = xAxis;
                                if (this.$store.state.levelObj.type === 't') {
                                    this.level.series = [
                                        { type: 'line', data: res.data['t-yAxis'] }
                                    ];
                                    this.level.series[0].name = '温度';
                                    this.level.title.text = '温度';
                                } else if (this.$store.state.levelObj.type === 'f') {
                                    this.level.series = [
                                        { type: 'line', data: res.data['f-yAxis'] }
                                    ];
                                    this.level.series[0].name = '液位';
                                    this.level.title.text = '液位';
                                } else {
                                    this.level.series = [
                                        { type: 'line', data: res.data['t-yAxis'] }
                                    ];
                                    this.level.series[0].name = '温度';
                                    this.level.title.text = '温度';
                                }
                            } else {
                                this.level.xAxis = [];
                                this.level.series = [{ type: 'line', data: [] }];
                                if (this.$store.state.levelObj.type === 't') {
                                    this.level.series[0].name = '温度';
                                    this.level.title.text = '温度';
                                } else {
                                    this.level.series[0].name = '液位';
                                    this.level.title.text = '液位';
                                }
                            }
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
                    })
                    .finally(() => {});
            },
            queryZhlora () {
                let params = {
                    mac: this.param.mac,
                    addr: this.$store.state.detailsAddr,
                    time: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate()
                };

                zhlora(params)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = [];

                            if (JSON.stringify(res.data) !== '{}') {
                                xAxis = res.data.xAxis.map(function (str) {
                                    return str.split(' ')[1];
                                });
                            }
                            this.residualCurrent.xAxis = xAxis;
                            this.voltage.xAxis = xAxis;
                            this.temperature.xAxis = xAxis;
                            this.current.xAxis = xAxis;
                            this.residualCurrent.series = [
                                {
                                    name: '漏电流值',
                                    type: 'line',
                                    data: res.data.lstLki,
                                    smooth: true
                                }
                            ];
                            this.voltage.series = [
                                {
                                    name: '电压',
                                    type: 'line',
                                    data: res.data.lstVol,
                                    smooth: true
                                }
                            ];
                            this.temperature.series = [
                                {
                                    name: '温度',
                                    type: 'line',
                                    data: res.data.lstTmp,
                                    smooth: true
                                }
                            ];
                            this.current.series = [
                                {
                                    name: '电流',
                                    type: 'line',
                                    data: res.data.lstCur,
                                    smooth: true
                                }
                            ];
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
                    })
                    .finally(() => {});
            },
            queryHuaxuChnl () {
                let params = {
                    mac: this.param.mac,
                    time: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.formatDate(
                            'yyyy-MM-dd',
                            new Date(new Date().setDate(new Date().getDate() - 1))
                        )
                };
                queryHuaxuChnlHistory(params)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = [];
                            if (JSON.stringify(res.data) !== '{}') {
                                xAxis = res.data.timeList.map(function (str) {
                                    return str.split(' ')[1];
                                });
                            }
                            this.IntelligentWaterMeter.xAxis = xAxis;
                            this.IntelligentWaterMeter.series = [
                                {
                                    name: '用水量(吨)',
                                    type: 'line',
                                    data: res.data.waterVolumeList,
                                    color: '#e062ea',
                                    lineStyle: { color: '#e062ae' },
                                    smooth: true
                                }
                            ];
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
            },
            querySmoke () {
                if (!this.$store.state.smokeObj.mac) return false;
                let params = {
                    mac: this.$store.state.smokeObj.mac,
                    msgType: this.$store.state.smokeObj.msgType,
                    yearMonth: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getCurrentYearMonth()
                };
                queryForsafeChnllHistory(params)
                    .then((res) => {
                        if (res.success) {
                            this.smoke.xAxis = res.data.timeAxis;
                            this.smoke.series = [
                                { type: 'line', name: '电量', data: res.data.yAxis }
                            ];
                            this.smoke.title.text = '电量';
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
                    })
                    .finally(() => {});
            },
            querysmokeAlarm () {
                let params = {
                    mac: this.$store.state.smokeAlarmObj.mac,
                    time: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate()
                };
                querySmokeHistory(params)
                    .then((res) => {
                        if (res.success) {
                            if (JSON.stringify(res.data) !== '{}') {
                                let xAxis = res.data.timeList.map(function (str) {
                                    return str.split(' ')[1];
                                });
                                this.smokeAlarm.xAxis = xAxis;
                                this.smokeVoltage.xAxis = xAxis;
                                this.combustibleGas.xAxis = xAxis;
                                this.smokeAlarm.series = [
                                    {
                                        type: 'line',
                                        name: '信号强度',
                                        data: res.data.signalList
                                    }
                                ];
                                this.smokeAlarm.title.text = '信号强度' + '(%)';
                                this.smokeVoltage.series = [
                                    {
                                        type: 'line',
                                        name: '电压(伏)',
                                        data: res.data.voltageList
                                    }
                                ];
                                this.smokeVoltage.title.text = '电压(伏)' + '(V)';
                                this.combustibleGas.series = [
                                    {
                                        type: 'line',
                                        name: '浓度',
                                        data: res.data.concentrationList
                                    }
                                ];
                                this.combustibleGas.title.text = '浓度' + '(%)';
                            } else {
                                this.smokeAlarm.xAxis = [];
                                this.smokeVoltage.xAxis = [];
                                this.combustibleGas.xAxis = [];
                                this.smokeAlarm.series = [{ type: 'line', data: [] }];
                                this.smokeVoltage.series = [{ type: 'line', data: [] }];
                                this.combustibleGas.series = [{ type: 'line', data: [] }];
                            }
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
            },
            queryRenkeChnl () {
                let parmas = {
                    mac: this.$store.state.mac,
                    nodeId: this.$store.state.nodeId
                        ? this.$store.state.nodeId
                        : this.tableData[0].nodeId,
                    time: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getCurrentYearMonth()
                };
                queryRenkeChnlHistory(parmas)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = [];
                            if (JSON.stringify(res.data) !== '{}') {
                                xAxis = res.data.timeList.map(function (str) {
                                    return str.split(' ')[1];
                                });
                            }
                            this.temperatureSensor.xAxis = xAxis;
                            this.humiditySensor.xAxis = xAxis;
                            this.Illuminance.xAxis = xAxis;
                            this.temperatureSensor.series = [
                                {
                                    name: '温度',
                                    type: 'line',
                                    data: res.data.temList,
                                    smooth: true
                                }
                            ];
                            this.humiditySensor.series = [
                                {
                                    name: '湿度',
                                    type: 'line',
                                    data: res.data.humList,
                                    smooth: true
                                }
                            ];
                            this.Illuminance.series = [
                                {
                                    name: '光照度',
                                    type: 'line',
                                    data: res.data.temList,
                                    smooth: true
                                }
                            ];
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
                    })
                    .finally(() => {});
            },
            queryFlammableGas () {
                let params = {
                    mac: this.$store.state.flammableGasObj.mac,
                    msgType: this.$store.state.flammableGasObj.msgType,
                    yearMonth: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getCurrentYearMonth()
                };
                queryForsafeChnllHistory(params)
                    .then((res) => {
                        if (res.success) {
                            this.flammableGas.xAxis = res.data.timeAxis;
                            this.flammableGas.series = [
                                {
                                    type: 'line',
                                    name: '浓度',
                                    data: res.data.yAxis
                                }
                            ];
                            this.flammableGas.title.text = '浓度';
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
                    })
                    .finally(() => {});
            },
            queryWinextlora () {
                let params = {
                    mac: this.param.mac,
                    addr: this.$store.state.detailsAddr,
                    time: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate()
                };
                winextlora(params)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = [];
                            if (JSON.stringify(res.data) !== '{}') {
                                xAxis = res.data.xAxis.map(function (str) {
                                    return str.split(' ')[1];
                                });
                            }
                            this.residualCurrent.xAxis = xAxis;
                            this.voltage.xAxis = xAxis;
                            this.temperature.xAxis = xAxis;
                            this.current.xAxis = xAxis;
                            this.residualCurrent.series = [
                                {
                                    name: '漏电流',
                                    type: 'line',
                                    data: res.data.lstLki,
                                    smooth: true
                                }
                            ];
                            this.voltage.series = [
                                {
                                    name: '电压',
                                    type: 'line',
                                    data: res.data.lstVol,
                                    smooth: true
                                }
                            ];
                            this.temperature.series = [
                                {
                                    name: '温度',
                                    type: 'line',
                                    data: res.data.lstTmp,
                                    smooth: true
                                }
                            ];
                            this.current.series = [
                                {
                                    name: '电流(安)',
                                    type: 'line',
                                    data: res.data.lstCur,
                                    smooth: true
                                }
                            ];
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
                    })
                    .finally(() => {});
            },
            queryChtqdqMeterReadingData () {
                let params = {
                    mac: this.param.mac,
                    time: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate()
                };
                queryChtqdqMeterReadingDataHistory(params)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = [];
                            if (JSON.stringify(res.data) !== '{}') {
                                xAxis = res.data.timeList.map(function (str) {
                                    return str.split(' ')[1];
                                });
                            }
                            this.smartMeterVoltage.xAxis = xAxis;
                            this.smartMeterAmpere.xAxis = xAxis;
                            this.smartMeterVoltage.series = [
                                {
                                    name: '电压',
                                    type: 'line',
                                    data: res.data.lstGV,
                                    color: '#e062ea',
                                    lineStyle: { color: '#e062ae' },
                                    smooth: true
                                },
                                {
                                    name: 'A' + '相' + '电压',
                                    type: 'line',
                                    data: res.data.volA,
                                    color: '#71e1e4',
                                    lineStyle: { color: '#71e1e4' },
                                    smooth: true
                                },
                                {
                                    name: 'B' + '相' + '电压',
                                    type: 'line',
                                    data: res.data.volB,
                                    color: '#ffdb5c',
                                    lineStyle: { color: '#ffdb5c' },
                                    smooth: true
                                },
                                {
                                    name: 'C' + '相' + '电压',
                                    type: 'line',
                                    data: res.data.volC,
                                    color: '#c23531',
                                    lineStyle: { color: '#c23531' },
                                    smooth: true
                                }
                            ];
                            this.smartMeterAmpere.series = [
                                {
                                    name: '温度',
                                    type: 'line',
                                    data: res.data.lstGT,
                                    color: '#e062ea',
                                    lineStyle: { color: '#e062ae' },
                                    smooth: true
                                },
                                {
                                    name: 'A' + '相' + '电流(安)',
                                    type: 'line',
                                    data: res.data.curA,
                                    color: '#71e1e4',
                                    lineStyle: { color: '#71e1e4' },
                                    smooth: true
                                },
                                {
                                    name: 'B' + '相' + '电流(安)',
                                    type: 'line',
                                    data: res.data.curB,
                                    color: '#ffdb5c',
                                    lineStyle: { color: '#ffdb5c' },
                                    smooth: true
                                },
                                {
                                    name: 'C' + '相' + '电流(安)',
                                    type: 'line',
                                    data: res.data.curC,
                                    color: '#c23531',
                                    lineStyle: { color: '#c23531' },
                                    smooth: true
                                }
                            ];
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
                    })
                    .finally(() => {});
            },
            setTimer (fn, delay) {
                let _this = this;
                function timer () {
                    _this.timerID = setTimeout(function () {
                        timer();
                        fn();
                    }, delay);
                }
                timer();
            },
            hanleInfo () {
                this.$refs.hanleInfo.queryInfo()
            },
            queryStralsund () {
                if (this.$store.state.stralsundObj.length === 0) return false;
                let params = {
                    mac: this.$store.state.stralsundObj.mac,
                    dataCategory: this.$store.state.stralsundObj.dataCategory,
                    loopType: this.$store.state.stralsundObj.loopType,
                    loopAddr: this.$store.state.stralsundObj.loopAddr,
                    startTime: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate(),
                    endTime: this.$store.state.historyDate
                        ? this.$store.state.historyDate
                        : this.$func.getNowFormatDate()
                };
                norChannelHistory(params)
                    .then((res) => {
                        if (res.success) {
                            let xAxis = res.data.xAxis.map(function (str) {
                                return str.split(' ')[1];
                            });
                            this.stralsund.xAxis = xAxis;
                            this.stralsund.series = [
                                {
                                    type: 'line',
                                    data: res.data[this.$store.state.stralsundObj.loopAddr]
                                }
                            ];
                            if (this.$store.state.stralsundObj.loopType === 0) {
                                this.stralsund.series[0].name = '烟雾' + '回路';
                                this.stralsund.title.text = '烟雾' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 1) {
                                this.stralsund.series[0].name = '电压(伏)' + '回路';
                                this.stralsund.title.text = '电压(伏)' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 2) {
                                this.stralsund.series[0].name = '漏电' + '回路';
                                this.stralsund.title.text = '漏电' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 4) {
                                this.stralsund.series[0].name = '温度' + '回路';
                                this.stralsund.title.text = '温度' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 8) {
                                this.stralsund.series[0].name = '电流' + '回路';
                                this.stralsund.title.text = '电流' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 17) {
                                this.stralsund.series[0].name = '压力' + '回路';
                                this.stralsund.title.text = '压力' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 18) {
                                this.stralsund.series[0].name = '液位' + '回路';
                                this.stralsund.title.text = '液位' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 32) {
                                this.stralsund.series[0].name = '额定电流' + '回路';
                                this.stralsund.title.text = '额定电流' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 33) {
                                this.stralsund.series[0].name = '电度' + '回路';
                                this.stralsund.title.text = '电度' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 34) {
                                this.stralsund.series[0].name = '有功功率' + '回路';
                                this.stralsund.title.text = '有功功率' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 35) {
                                this.stralsund.series[0].name = '功率因数' + '回路';
                                this.stralsund.title.text = '功率因数' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 40) {
                                this.stralsund.series[0].name = '电池' + '电量' + '回路';
                                this.stralsund.title.text = '电池' + '电量' + '回路';
                            } else if (this.$store.state.stralsundObj.loopType === 41) {
                                this.stralsund.series[0].name = '信号' + '回路';
                                this.stralsund.title.text = '信号' + '回路';
                            } else {
                                this.stralsund.series[0].name = '';
                                this.stralsund.title.text = '';
                            }
                            if (this.stralsund.series[0].name !== '') {
                                this.stralsund.series[0].name +=
                                    this.$store.state.stralsundObj.loopAddr;
                                this.stralsund.title.text +=
                                    this.$store.state.stralsundObj.loopAddr;
                            }
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
                    })
                    .finally(() => {});
            }
        },
        mounted () {
            this.init();

            this.$nextTick(() => {
                if (this.param.equipmentType === 11 || this.param.equipmentType === 14) {
                    this.queryRouteList();
                } else if (this.param.equipmentType === 15) {
                    this.queryHuaxuChnl();
                }
            });
            //
        },
        watch: {
            '$store.state.detailsAddr': {
                handler (newVal, oldVal) {
                    this.init();
                }
            },
            '$store.state.stralsundObj': {
                handler (newVal, oldVal) {
                    this.queryStralsund();
                }
            },
            '$store.state.pressureObj': {
                handler (newVal, oldVal) {
                    this.queryPressure();
                },
                deep: true
            },
            '$store.state.levelObj': {
                handler (newVal, oldVal) {
                    this.queryLevel();
                },
                deep: true
            },
            '$store.state.smokeObj': {
                handler (newVal, oldVal) {
                    if (newVal.mac || oldVal.mac) this.querySmoke();
                }
            },
            '$store.state.nodeId': {
                handler (newVal, oldVal) {
                    if (newVal || oldVal) this.queryRenkeChnl();
                }
            },
            '$store.state.smokeAlarmObj': {
                handler (newVal, oldVal) {
                    if (newVal.mac || oldVal.mac) this.querysmokeAlarm();
                }
            },
            '$store.state.flammableGasObj': {
                handler (newVal, oldVal) {
                    if (newVal.mac || oldVal.mac) this.queryFlammableGas();
                }
            },
            '$store.state.historyDate': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        if (
                            this.param.equipmentType === 1 ||
                            this.param.equipmentType === 2
                        ) {
                            if (this.$store.state.detailsAddr === '') return false;
                            this.queryChannelHistory();
                        } else if (this.param.equipmentType === 3) {
                            this.queryStralsund();
                        } else if (this.param.equipmentType === 4) {
                            this.queryLevel();
                        } else if (this.param.equipmentType === 5) {
                            this.queryPressure();
                        } else if (this.param.equipmentType === 6) {
                            this.querySmoke();
                        } else if (this.param.equipmentType === 7) {
                            this.queryFlammableGas();
                        } else if (this.param.equipmentType === 8) {
                            this.queryZhlora();
                        } else if (
                            this.param.equipmentType === 10 ||
                            this.param.equipmentType === 13
                        ) {
                            this.querysmokeAlarm();
                        } else if (
                            this.param.equipmentType === 11 ||
                            this.param.equipmentType === 14
                        ) {
                            this.queryRenkeChnl();
                        } else if (this.param.equipmentType === 12) {
                            this.queryChtqdqMeterReadingData();
                        } else if (this.param.equipmentType === 15) {
                            this.queryHuaxuChnl();
                        }
                    }
                }
            },
            $route (to, from) {
                if (to.path) clearTimeout(this.timerID);
            },
            param: {
                handler (newVal, oldVal) {

                }
            }
        },
        destroyed () {
            clearTimeout(this.timerID);
        }
    };
</script>
<style lang="less" scoped>
#details {
  color: #fff;
}

.stralsund,
.lora {
  width: 760px;
}
.mantunsci {
  width: 320px;
}
#details-popper .el-date-editor.el-input__inner {
  width: 260px;
}
.qureyBtn {
  margin-right: 40px;
}
.routeList {
  font-size: 18px;
  color: #fff;
}
.listBtn {
  color: #409eff !important;
}
.voltagC {
  display: flex;
}
</style>
