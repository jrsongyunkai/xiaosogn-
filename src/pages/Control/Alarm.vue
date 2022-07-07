<template>
  <div id="alarms">
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <Col style="width: 100%">
        <Breadcrumb separator-class="el-icon-arrow-right">
          <BreadcrumbItem class="pointer" @click.native="$router.go(-1)" style="color:#7b7b7b"
            >返回</BreadcrumbItem
          >
          <BreadcrumbItem>报警/预警列表</BreadcrumbItem>
        </Breadcrumb>
        <Row class="title">
            <Col>
                <i class="icon-v5 icon-v5-huifu"></i>
                本月内同设备同种警情类型仅统计一次。
            </Col>
        </Row>
        <Row class="alarms_typeList">
          <Col :span="24">
            <Form
              :inline="true"
              :model="quantityForm"
              class="demo-form-inline mt-20"
              @submit.native.prevent
            >
              <FormItem class="fl">
                <span
                  class="ml-20 fs-18"
                  v-if="alarmData.currentMonthAlarmNum"
                  >{{
                    '本月报警数' + '：' + alarmData.currentMonthAlarmNum
                  }}</span
                >
                <span class="ml-20 fs-18" v-if="alarmData.lastMonthAlarmNum">{{
                  '上月报警数' + '：' + alarmData.lastMonthAlarmNum
                }}</span>
                <span class="ml-20 fs-18" v-if="alarmData.totalAlarmNum">{{
                  '累计报警数' + '：' + alarmData.totalAlarmNum
                }}</span>
              </FormItem>
              <FormItem>
                <span
                  v-if="
                    $store.state.toPath !== '/Home' &&
                    $store.state.toPath !== ''
                  "
                  class="mr-20 fw"
                >
                </span>
                <span class="block">
                  <DatePicker
                    :clearable ="false"
                    :disabled="jobFlag"
                    v-model="quantityForm.month"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    :editable="false"
                    separator="至"
                    @on-change="handleChangeDate"
                  >
                  </DatePicker>
                </span>
              </FormItem>
              <FormItem>
                <Input
                  :disabled="jobFlag"
                  v-model="quantityForm.mac"
                  :onkeyup="
                    (quantityForm.mac = quantityForm.mac.replace(/[, ]/g, ''))
                  "
                  @keyup.enter.native="queryQuantity"
                  placeholder="请输入设备号"
                ></Input>
              </FormItem>
              <FormItem>
                <Input
                  v-model="quantityForm.jobNumber"
                  :onkeyup="
                    (quantityForm.jobNumber = quantityForm.jobNumber.replace(
                      /[^\d]/g,
                      ''
                    ))
                  "
                  @keyup.enter.native="queryQuantity"
                  placeholder="请输入事件ID"
                ></Input>
              </FormItem>
              <FormItem>
                <Select
                :clearable='true'
                  v-model="quantityForm.type"
                  :disabled="jobFlag"
                  @change="handleChange"
                  @visible-change="handleFocus"
                  :style="quantityForm.type.length > 1 ? 'width: 390px' : ''"
                  multiple
                  multiple-limit="3"
                  placeholder="告警类型"
                >
                  <Option
                    v-for="item in alarmTypes"
                    :key="item.typeNumber"
                    :label="item.info"
                    :value="item.typeNumber"
                    :disabled="item.disabled"
                  ></Option>
                </Select>
              </FormItem>
              <FormItem>
                <Select
                :clearable='true'
                  v-model="quantityForm.oqp1"
                  :disabled="jobFlag"
                  class="w-100"
                  placeholder="状态"
                >
                  <Option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></Option>
                </Select>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="queryQuantity">查询</Button>
              </FormItem>
              <FormItem>
                <Button  @click="handleReset">重置</Button>
              </FormItem>
              <FormItem>
                <Dropdown trigger="click" @on-click="handleCommand">
                  <Button>
                    导出<i class="el-icon-arrow-down el-icon--right"></i>
                  </Button>
                  <DropdownMenu slot="list">
                    <DropdownItem name="current">导出当前页</DropdownItem>
                    <DropdownItem name="all">导出全部</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
    <div style="padding:0 30px">
         <Table
      :data="quantityData"
      :columns="columns"
      @on-selection-change="handleSelectionChange"
    >
      <template slot-scope="{ row }" slot="mac">
        <span @click="handleSwitch(row)" class="pointer">{{ row.mac }}</span>
      </template>
       <template slot-scope="{ row }" slot="macname">

        <div>{{ row.name }}</div>
      </template>
      <template slot-scope="{ row }" slot="projectName">
        <span @click="handleSwitch(row, 'project')" class="pointer">{{
          row.projectName
        }}</span>
      </template>

      <template slot-scope="{ row }" slot="action">
        <Button
          type="text"
          v-if="row.processStatus === 0"
          @click="handleUrge(row.id)"
          >催促</Button
        >
            <template v-if="row.processStatus === 0">
              <span class="pointer b-danger"
                  @click="queryMaintenance(row)"
              >未处理</span>
            </template>
               <template v-if="row.processStatus === 1">
              <span class="pointer b-yelo"
                  @click="queryMaintenance(row)"
              >处理中</span>
            </template>
             <template v-if="row.processStatus === 2">
              <span class="pointer b-success"
                  @click="queryMaintenance(row)"
              >已处理</span>
            </template>
      </template>
    </Table>
    </div>

    <div class="page tc mt-10">
      <Button :disabled="ids.length === 0" @click="handleBatchEdit(ids)"
        >批量修改状态为已处理</Button
      >
      <!-- <Page
              @size-change="handleSizeChange"
              :page-sizes="[20, 50, 100, 500]"
              :page-size="quantityPageSize"
              >
            </Page> -->
      <Button-group>
        <Button @click="handlePage('home')">首页</Button>
        <Button
          icon="el-icon-arrow-left"
          :disabled="page.length < 1"
          @click="handlePage('prev')"
          >上一页</Button
        >
        <Button
          @click="handlePage('next')"
          :disabled="quantityData.length < quantityPageSize"
          >下一页<i class="el-icon-arrow-right el-icon--right"></i
        ></Button>
      </Button-group>
    </div>
    <Modal
      id="modal"
      :title="title"
      v-model="dialogVisible"
      @close="closeMaintenance"
    >
      <maintenance-editor
        v-if="dialogVisible"
        :maintenanceBoxObj="maintenanceBoxObj"
        v-on:close-maintenance="closeMaintenance"
      ></maintenance-editor>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
    import store from '@/store';
    import MaintenanceEditor from '../safetyMonitor/allWarn/MaintenanceEditor.vue';
    import {
        queryAlarmListOfPageById,
        findMaintenance,
        // switchHover,
        alarmHandling,
        alarmHistoryStatisticalNumber,
        alarmUrgePush,
        queryAlarmForConfig
    } from '@/api/control/index';
    export default {
        data () {
            return {
                loading: false,
                quantityType: '',
                quantityForm: {
                    mac: this.$route.params.mac === undefined ? '' : this.$route.params.mac,
                    jobNumber: '',
                    type: '',
                    oqp1: this.$route.params.status,
                    month: this.$route.params.type === '1' ? [this.$Date().format('YYYY-MM-DD'), this.$Date().format('YYYY-MM-DD')] : [this.$Date().format('YYYY-MM') + '-01', this.$Date().format('YYYY-MM-DD')],
                    lastId: ''
                },
                exportId: 0,
                page: [],
                prevId: '',
                quantityData: [],
                alarmData: [],
                quantityPageSize: 20,
                alarmInfo: [],
                title: '',
                status: [
                    {
                        value: '',
                        label: '所有'
                    },
                    {
                        value: '0',
                        label: '未处理'
                    },
                    {
                        value: '1',
                        label: '处理中'
                    },
                    {
                        value: '2',
                        label: '已处理'
                    }
                ],
                alarmTypes: [],
                ids: [],
                alarmHistory: {},
                maintenanceBoxObj: {},
                dialogVisible: false,
                jobFlag: false,
                columns: [
                    {
                        type: 'selection',
                        width: 55,
                        align: 'center'
                    },
                    {
                        title: '事件ID',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        slot: 'mac',
                        align: 'center'
                    },
                    {
                        title: '设备别名',
                        slot: 'macname',
                        align: 'center'
                    },
                    {
                        title: '项目',
                        slot: 'projectName',
                        align: 'center'
                    },
                    {
                        title: '位置',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '线路',
                        key: 'channel',
                        align: 'center'
                    },
                    {
                        title: '报警/预警类型',
                        key: 'info',
                        align: 'center'
                    },
                    {
                        title: '时间',
                        key: 'time',
                        align: 'center'
                    },
                    {
                        title: '数值',
                        key: 'value',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ]
            };
        },
        mounted () {
            this.init();
            this.queryConfig();
        },
        methods: {
            init () {
                this.quantityForm.jobNumber = '';
                if (this.$route.params.typeNumber !== undefined) {
                    this.quantityForm.type = this.$route.params.typeNumber.split(',');
                }
                function getNextDate (date, day) {
                    var dd = new Date(date);
                    dd.setDate(dd.getDate() + day);
                    var y = dd.getFullYear();
                    var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
                    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
                    return y + '-' + m + '-' + d;
                };
                let yestorday = getNextDate(this.$Date().format('YYYY-MM-DD'), -1)
                if (this.$route.params.type === '-1') {
                    this.quantityForm.month = [yestorday, yestorday]
                }
                this.queryAlarm();
                this.queryAlarmHistoryStatisticalNumber();
            },
            queryConfig () {
                queryAlarmForConfig({})
                    .then((res) => {
                        this.alarmTypes = res.data.alarms.concat(res.data.warns);
                        this.alarmTypes.unshift(
                            { typeNumber: '-100', info: '全部报警' },
                            { typeNumber: '-200', info: '全部预警' }
                        );
                        if (this.$route.query.projectCode) {
                            //

                            this.quantityForm.type = this.$route.query.status
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
            queryAlarm (type) {
                this.quantityData = [];
                this.quantityType = type;
                let params = {};
                if (this.jobFlag) {
                    params = {
                        provinceId: this.$store.state.provinceId,
                        cityId: this.$store.state.cityId,
                        countryId: this.$store.state.countyId,
                        lastId: this.quantityForm.lastId,
                        rows: this.quantityPageSize,
                        projectCode: this.$route.params.projectCode || this.$store.state.projectCode,
                        typeNumbers: this.quantityForm.type
                            ? this.quantityForm.type.join(',')
                            : '',
                        mac: this.quantityForm.mac ? this.quantityForm.mac : '',
                        jobNumber: this.quantityForm.jobNumber
                            ? this.quantityForm.jobNumber
                            : '',
                        oqp1: this.quantityForm.oqp1,
                        startTime: this.quantityForm.month[0],
                        endTime: this.quantityForm.month[1]
                    };
                } else {
                    params = {
                        provinceId: this.$store.state.provinceId,
                        cityId: this.$store.state.cityId,
                        countryId: this.$store.state.countyId,
                        lastId: this.quantityForm.lastId,
                        rows: this.quantityPageSize,
                        projectCode: this.$route.params.projectCode || this.$store.state.projectCode,
                        typeNumbers: this.quantityForm.type
                            ? this.quantityForm.type.join(',')
                            : '',
                        mac: this.quantityForm.mac ? this.quantityForm.mac : '',
                        jobNumber: this.quantityForm.jobNumber
                            ? this.quantityForm.jobNumber
                            : '',
                        oqp1: this.quantityForm.oqp1,
                        startTime: this.quantityForm.month[0],
                        endTime: this.quantityForm.month[1]
                    };
                }
                if (this.$func.checkDateThreeMonths(params.startTime, params.endTime) === 'false') {
                    this.$Message.error({
                        content: '时间间隔不能超过三个月!'
                    })
                    return false;
                }

                queryAlarmListOfPageById(params)
                    .then((res) => {
                        if (res.success) {
                            this.quantityData = res.data;

                            if (res.data.length > 0) {
                                this.quantityForm.lastId = res.lastId;
                                this.prevId = res.data[0].id + 1;
                                this.exportId = res.data[0].id;
                            } else {
                                this.quantityForm.lastId = res.lastId;
                                this.exportId = 0;
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
                    .finally(() => {
                        this.loading = false;
                });
            },
            handleChange (val) {
                this.alarmTypes.forEach((v) => {
                    if (val.indexOf('-100') > -1) {
                        if (
                            v.typeNumber === '1' ||
                            v.typeNumber === '2' ||
                            v.typeNumber === '3' ||
                            v.typeNumber === '4' ||
                            v.typeNumber === '5' ||
                            v.typeNumber === '6' ||
                            v.typeNumber === '7' ||
                            v.typeNumber === '8' ||
                            v.typeNumber === '11' ||
                            v.typeNumber === '17' ||
                            v.typeNumber === '18' ||
                            v.typeNumber === '19' ||
                            v.typeNumber === '53' ||
                            v.typeNumber === '54' ||
                            v.typeNumber === '56' ||
                            v.typeNumber === '57' ||
                            v.typeNumber === '62' ||
                            v.typeNumber === '63' ||
                            v.typeNumber === '1001' ||
                            v.typeNumber === '1002' ||
                            v.typeNumber === '1005' ||
                            v.typeNumber === '2002' ||
                            v.typeNumber === '2003' ||
                            v.typeNumber === '2004' ||
                            v.typeNumber === '2006' ||
                            v.typeNumber === '9000' ||
                            v.typeNumber === '9001'
                        ) {
                            v.disabled = true;
                        }
                    } else {
                        if (
                            v.typeNumber === '1' ||
                            v.typeNumber === '2' ||
                            v.typeNumber === '3' ||
                            v.typeNumber === '4' ||
                            v.typeNumber === '5' ||
                            v.typeNumber === '6' ||
                            v.typeNumber === '7' ||
                            v.typeNumber === '8' ||
                            v.typeNumber === '11' ||
                            v.typeNumber === '17' ||
                            v.typeNumber === '18' ||
                            v.typeNumber === '19' ||
                            v.typeNumber === '53' ||
                            v.typeNumber === '54' ||
                            v.typeNumber === '56' ||
                            v.typeNumber === '57' ||
                            v.typeNumber === '62' ||
                            v.typeNumber === '63' ||
                            v.typeNumber === '1001' ||
                            v.typeNumber === '1002' ||
                            v.typeNumber === '1005' ||
                            v.typeNumber === '2002' ||
                            v.typeNumber === '2003' ||
                            v.typeNumber === '2004' ||
                            v.typeNumber === '2006' ||
                            v.typeNumber === '9000' ||
                            v.typeNumber === '9001'
                        ) {
                            v.disabled = false;
                        }
                    }
                    if (val.indexOf('-200') > -1) {
                        if (
                            v.typeNumber === '9' ||
                            v.typeNumber === '10' ||
                            v.typeNumber === '12' ||
                            v.typeNumber === '13' ||
                            v.typeNumber === '14' ||
                            v.typeNumber === '15' ||
                            v.typeNumber === '16' ||
                            v.typeNumber === '55' ||
                            v.typeNumber === '58' ||
                            v.typeNumber === '1003' ||
                            v.typeNumber === '1004' ||
                            v.typeNumber === '1006'
                        ) {
                            v.disabled = true;
                        }
                    } else {
                        if (
                            v.typeNumber === '9' ||
                            v.typeNumber === '10' ||
                            v.typeNumber === '12' ||
                            v.typeNumber === '13' ||
                            v.typeNumber === '14' ||
                            v.typeNumber === '15' ||
                            v.typeNumber === '16' ||
                            v.typeNumber === '55' ||
                            v.typeNumber === '58' ||
                            v.typeNumber === '1003' ||
                            v.typeNumber === '1004' ||
                            v.typeNumber === '1006'
                        ) {
                            v.disabled = false;
                        }
                    }
                });
                let arr = [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '11',
                    '17',
                    '18',
                    '19',
                    '53',
                    '54',
                    '56',
                    '57',
                    '62',
                    '63',
                    '1001',
                    '1002',
                    '1005',
                    '2002',
                    '2003',
                    '2004',
                    '2006',
                    '9000',
                    '9001'
                ];
                if (val.indexOf('-100') > -1) {
                    arr.forEach((item) => {
                        val.forEach((items, index) => {
                            if (items === item) {
                                val.splice(index, 1);
                            }
                        });
                    });
                }
                let arr1 = [
                    '9',
                    '10',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '55',
                    '58',
                    '1003',
                    '1004',
                    '1006'
                ];
                if (val.indexOf('-200') > -1) {
                    arr1.forEach((item) => {
                        val.forEach((items, index) => {
                            if (items === item) {
                                val.splice(index, 1);
                            }
                        });
                    });
                }
            },
            handleFocus () {
                this.alarmTypes.forEach((v) => {
                    if (this.quantityForm.type.indexOf('-100') > -1) {
                        if (
                            v.typeNumber === '1' ||
                            v.typeNumber === '2' ||
                            v.typeNumber === '3' ||
                            v.typeNumber === '4' ||
                            v.typeNumber === '5' ||
                            v.typeNumber === '6' ||
                            v.typeNumber === '7' ||
                            v.typeNumber === '8' ||
                            v.typeNumber === '11' ||
                            v.typeNumber === '17' ||
                            v.typeNumber === '18' ||
                            v.typeNumber === '19' ||
                            v.typeNumber === '53' ||
                            v.typeNumber === '54' ||
                            v.typeNumber === '56' ||
                            v.typeNumber === '57' ||
                            v.typeNumber === '62' ||
                            v.typeNumber === '63' ||
                            v.typeNumber === '1001' ||
                            v.typeNumber === '1002' ||
                            v.typeNumber === '1005' ||
                            v.typeNumber === '2002' ||
                            v.typeNumber === '2003' ||
                            v.typeNumber === '2004' ||
                            v.typeNumber === '2006' ||
                            v.typeNumber === '9000' ||
                            v.typeNumber === '9001'
                        ) {
                            v.disabled = true;
                        }
                    } else {
                        if (
                            v.typeNumber === '1' ||
                            v.typeNumber === '2' ||
                            v.typeNumber === '3' ||
                            v.typeNumber === '4' ||
                            v.typeNumber === '5' ||
                            v.typeNumber === '6' ||
                            v.typeNumber === '7' ||
                            v.typeNumber === '8' ||
                            v.typeNumber === '11' ||
                            v.typeNumber === '17' ||
                            v.typeNumber === '18' ||
                            v.typeNumber === '19' ||
                            v.typeNumber === '53' ||
                            v.typeNumber === '54' ||
                            v.typeNumber === '56' ||
                            v.typeNumber === '57' ||
                            v.typeNumber === '62' ||
                            v.typeNumber === '63' ||
                            v.typeNumber === '1001' ||
                            v.typeNumber === '1002' ||
                            v.typeNumber === '1005' ||
                            v.typeNumber === '2002' ||
                            v.typeNumber === '2003' ||
                            v.typeNumber === '2004' ||
                            v.typeNumber === '2006' ||
                            v.typeNumber === '9000' ||
                            v.typeNumber === '9001'
                        ) {
                            v.disabled = false;
                        }
                    }
                    if (this.quantityForm.type.indexOf('-200') > -1) {
                        if (
                            v.typeNumber === '9' ||
                            v.typeNumber === '10' ||
                            v.typeNumber === '12' ||
                            v.typeNumber === '13' ||
                            v.typeNumber === '14' ||
                            v.typeNumber === '15' ||
                            v.typeNumber === '16' ||
                            v.typeNumber === '55' ||
                            v.typeNumber === '58' ||
                            v.typeNumber === '1003' ||
                            v.typeNumber === '1004' ||
                            v.typeNumber === '1006'
                        ) {
                            v.disabled = true;
                        }
                    } else {
                        if (
                            v.typeNumber === '9' ||
                            v.typeNumber === '10' ||
                            v.typeNumber === '12' ||
                            v.typeNumber === '13' ||
                            v.typeNumber === '14' ||
                            v.typeNumber === '15' ||
                            v.typeNumber === '16' ||
                            v.typeNumber === '55' ||
                            v.typeNumber === '58' ||
                            v.typeNumber === '1003' ||
                            v.typeNumber === '1004' ||
                            v.typeNumber === '1006'
                        ) {
                            v.disabled = false;
                        }
                    }
                });
            },
            queryAlarmHistoryStatisticalNumber () {
                let params = this.alarmHistory;
                alarmHistoryStatisticalNumber(params)
                    .then((res) => {
                        if (res.data) {
                            this.alarmData = res.data;
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
            queryQuantity () {
                this.page = [];
                this.quantityForm.lastId = '';
                this.quantityForm.mac = this.$route.params.mac
                this.queryAlarm(this.quantityType);
            },
            handleValue (obj) {
                let type = '';
                let signal = '';
                if (obj.elecType === 1) {
                    type = this.$t('main.watt');
                } else if (obj.elecType === 2) {
                    type = this.$t('main.ampere');
                } else if (obj.elecType === 3) {
                    type = this.$t('menu.leakageCurrent');
                } else if (obj.elecType === 4) {
                    type = this.$t('menu.temperature');
                } else if (obj.elecType === 5) {
                    type = this.$t('main.volt');
                } else if (obj.elecType === 8) {
                    type = this.$t('main.lightningCurrent');
                } else if (obj.elecType === 9) {
                    signal = this.$t('control.signal');
                    type = this.$t('main.volt');
                } else if (obj.elecType === 10) {
                    type = this.$t('menu.humidity');
                } else if (obj.elecType === 11) {
                    type = this.$t('stralsund.concentration');
                } else if (obj.elecType === 12) {
                    type = this.$t('echarts.illumination') + this.$t('echarts.celsius');
                } else if (obj.elecType === 14) {
                    type = this.$t('table.waterVolume');
                }
                if (obj.elecType === 9) {
                    this.alarmInfo = [
                        `${type}(${obj.unit1}): ${obj.value1},\xa0${signal}(${obj.unit2}): ${obj.value2}`
                    ];
                } else if (obj.elecType === 8) {
                    this.alarmInfo = [
                        `${type}(${obj.unit}): ${obj.value} ${
                            obj.elecType === 8
                                ? ''
                                : '(' + this.$t('table.threshold') + ':' + obj.threshold + ')'
                        }`,
                        `${
                            obj.groundWire !== undefined
                                ? this.$t('main.groundState') +
                                    ': ' +
                                    (obj.groundWire === 0
                                        ? this.$t('control.normal')
                                        : this.$t('control.abnormal'))
                                : ''
                        }`,
                        `${
                            obj.spd !== undefined
                                ? 'SPD: ' +
                                    (obj.spd === 0
                                        ? this.$t('control.normal')
                                        : this.$t('control.abnormal'))
                                : ''
                        }`,
                        `${
                            obj.occurTime
                                ? this.$t('main.surgeTime') +
                                    ': ' +
                                    (obj.occurTime ? obj.occurTime : '')
                                : ''
                        }`
                    ];
                } else if (obj.elecType === 10) {
                    this.alarmInfo = `${type}: ${obj.value}${obj.unit + 'RH'} ${
                        '(' + this.$t('table.threshold') + ':' + obj.threshold + ')'
                    }`;
                } else if (obj.elecType === 11) {
                    this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${
                        '(' + this.$t('table.threshold') + ':' + obj.threshold + ')'
                    }`;
                } else if (obj.elecType === 12) {
                    this.alarmInfo = `${type}: ${obj.value + 'Lux'} ${
                        '(' + this.$t('table.threshold') + ':' + obj.threshold + ')'
                    }`;
                } else if (obj.elecType === 14) {
                    this.alarmInfo = `${type}: ${obj.value1 + obj.unit1}`;
                } else {
                    this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${
                        '(' + this.$t('table.threshold') + ':' + obj.threshold + ')'
                    }`;
                }
            },
            handleReset () {
                this.quantityForm.month = ''
                this.quantityForm.mac = ''
                this.quantityForm.jobNumber = ''
                this.quantityForm.type = ''
                this.quantityForm.oqp1 = ''
            },
            handleChangeDate (item) {
                this.page = [];
                this.quantityForm.lastId = '';
                this.quantityForm.month = item
            },
            handlePage (e) {
                if (e === 'home') {
                    this.quantityForm.lastId = '';
                    this.page = [];
                } else if (e === 'prev') {
                    this.quantityForm.lastId = this.page.pop();
                } else if (e === 'next') {
                    this.page.push(this.prevId);
                }
                store.commit('quantityPage', this.page);
                this.queryAlarm();
            },
            handleSizeChange (val) {
                this.page = [];
                this.quantityForm.lastId = '';
                this.quantityPageSize = val;
                store.commit('quantityPageSize', val);
                this.queryAlarm();
            },
            queryMaintenance (obj) {
                if (obj.processStatus === 0) {
                    this.title = '新建工单'
                } else if (obj.processStatus === 1) {
                    this.title = '编辑工单'
                } else {
                    this.title = '工单详细'
                }
                let params = {
                    mac: obj.mac,
                    alarmId: obj.id,
                    id: ''
                };
                findMaintenance(params)
                    .then((res) => {
                        if (res.success) {
                            if (this.page.length === 0) {
                                this.quantityForm.lastId = '';
                            } else {
                                this.quantityForm.lastId = this.prevId;
                            }
                            store.commit('maintenanceObj', res.data);
                            store.commit('alarmId', obj.id);
                            this.maintenanceBoxObj = obj;
                            this.dialogVisible = true;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
                    .catch((res) => {
                        this.$Message.error({
                            content: '未知错误，请刷新重试'
                        });
                });
            },
            handleCommand (command) {
                if (
                    this.$func.checkDateThreeMonths(
                        this.quantityForm.month[0],
                        this.quantityForm.month[1]
                    ) === 'false'
                ) {
                    this.$Message.error({
                        content: '时间间隔不能超过三个月'
                    });
                    return false;
                }
                this.$func.windowCountDown(
                    '/project/main/v3/xls/exportAlarmListOfPage.as?projectCode=' +
                        (this.$route.params.projectCode
                            ? this.$route.params.projectCode
                        : '') +
                        '&provinceId=' +
                        (this.$store.state.provinceId ? this.$store.state.provinceId : '') +
                        '&cityId=' +
                        (this.$store.state.cityId ? this.$store.state.cityId : '') +
                        '&countyId=' +
                        (this.$store.state.countyId ? this.$store.state.countyId : '') +
                        '&mac=' +
                        this.quantityForm.mac +
                        '&typeNumbers=' +
                        (this.$route.params.typeNumber ? this.$route.params.typeNumber : 0) +
                        '&lastId=' +
                        this.exportId +
                        '&rows=' +
                        this.quantityPageSize +
                        '&oqp1=' +
                        (this.quantityForm.oqp1 ? this.quantityForm.oqp1 : '') +
                        '&startTime=' +
                        String(this.quantityForm.month[0]) +
                        '&endTime=' +
                        String(this.quantityForm.month[1]) +
                        '&exportType=' +
                        (command === 'current' ? 'exportCurrent' : '')
                );
            },

            handleSwitch (obj, type) {
                var path = '/console/device'
                if (type !== 'project') {
                    store.commit('equipmentType', obj.equipmentType);
                    store.commit('overviewMac', obj.mac);
                } else {
                    store.commit('equipmentType', 1);
                    store.commit('overviewMac', '');
                }
                this.$func.switchToProject(obj, path)
            },
            handleSelectionChange (val) {
                this.ids = [];
                val.forEach((item) => {
                    this.ids.push(item.id);
                });
            },
            handleBatchEdit (ids) {
                alarmHandling({ id: ids.join(','), isSolve: 1 })
                    .then((res) => {
                        if (res.success) {
                            this.quantityForm.lastId = '';
                            this.$Message.success({
                                content: res.message
                            });
                            this.queryAlarm();
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
            closeMaintenance () {
                store.dispatch('resetMaintenanceObj');
                this.dialogVisible = false;
                this.init();
            },
            handleUrge (id) {
                alarmUrgePush({ id: id })
                    .then((res) => {
                        if (res.code === '0') {
                            this.$Message.success({
                                content: res.message
                            });
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
            }
        },
        watch: {
            '$store.state.location': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.queryAlarm();
                    }
                },
                deep: true
            },
            $route: {
                handler (to, from) {
                    if (to.path === '/Alarm') {
                        if (from.path === '/Home') {
                            this.quantityForm.jobNumber = '';
                            this.alarmHistory = {};
                        } else if (from.path === '/InnerMain/Overview') {
                            this.alarmHistory = {
                                projectCode: this.$route.params.projectCode
                            };
                        }
                        if (from.path === '/MaintenanceBox') return false;
                        this.quantityForm.lastId = '';
                        this.quantityForm.oqp1 = this.$route.params.status;
                        this.quantityForm.jobNumber = '';
                        this.quantityForm.mac = this.$route.params.mac
                            ? this.$route.params.mac
                            : '';
                        if (this.$route.params.type === '2') {
                            this.quantityForm.month = [
                                this.$func.formatDate(
                                    'yyyy-MM-dd',
                                    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                                ),
                                this.$func.getNowFormatDate()
                            ];
                        } else {
                            if (this.$route.params.oqp2 === 2) {
                                this.quantityForm.month = [
                                    this.$route.params.oqp2 === 2
                                        ? this.$func.formatDate(
                                            'yyyy-MM-dd',
                                            new Date(
                                                new Date().getFullYear(),
                                                new Date().getMonth(),
                                                1
                                            )
                                        )
                                        : this.$func.getNowFormatDate(),
                                    this.$func.getNowFormatDate()
                                ];
                            } else {
                                this.quantityForm.month = [
                                    this.$func.getNowFormatDate(),
                                    this.$func.getNowFormatDate()
                                ];
                            }
                        }
                        this.queryAlarm();
                        this.queryAlarmHistoryStatisticalNumber();
                    }
                }
            },
            '$route.params.typeNumber': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.quantityForm.type = newVal.split(',');
                        this.queryAlarm();
                    }
                },
                deep: true
            },
            'quantityForm.jobNumber': {
                handler (newVal, oldVal) {
                    if (newVal.length > 0) {
                        this.jobFlag = true;
                    } else {
                        this.jobFlag = false;
                    }
                },
                deep: true
            }
        },
        components: {
            MaintenanceEditor
        }
    };
</script>
<style lang="less" scoped>
.alarms_typeList {
  width: 100%;
  background:#1c202c;
  padding: 10px;
  .ivu-form-item{
      margin-bottom: 0;
  }
}
.page {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  button {
    margin-right: 20px;
  }
}
/deep/.ivu-select-dropdown-list{
    text-align: left;
    width: 100px;

}
/deep/.ivu-modal-footer{
    border: none;
}
.title{
    padding: 5px;
    border: 1px solid #73757a;
    color: #73757a;
    margin: 10px 0;
}
</style>
