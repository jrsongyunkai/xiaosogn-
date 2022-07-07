<template>
  <div>
    <div
      style="
        background: #1a202e;
        height: 52px;
        margin-top: 60px;
        margin-bottom: -40px;
        min-width: 1430px;
      "
    >
      <div class="blockLseft">
        <Select
            v-model="packetTypes"
            @on-change="handleTypes"
            style="width: 200px"
            placeholder="选择分组类型"
            :clearable='true'
          >
            <Option
              v-for="item in packetList"
              :value="item.id"
              :key="item.id"
              :label="item.type"
            ></Option>
          </Select>
        <div class="" style="margin-left: 0px;margin-right:20px;margin-top:0px"  >
         <TreeSelect
                placeholder="选择分组"
                multiple
                show-checkbox
                v-model="packetFilter"
                transfer
                :data="packetFilterList"
              />
        </div>
        <div class="dateBnt" style="margin-top: 8px" v-if="!datas.date">
          <div style="margin-left: 25px; margin-right: -5px; margin-top: 8px">
            日期:
          </div>
          <RadioGroup
            v-model="dateRadio"
            @on-change="handleDatePicker"
            style="margin-right: -30px; margin-top: 8px"
          >
            <Radio label="日"></Radio>
            <Radio label="月"></Radio>
          </RadioGroup>
        </div>
        <!-- <div>日期</div> -->
        <!-- 日历 -->
        <DatePicker
          v-show="isDay"
          :type="datas.date ? 'daterange' : 'date'"
          :value="datas.date ? dayes : days"
          placeholder="请选择日期"
          style="width: 200px; margin-left: 0px"
          :editable="false"
          @on-change="changeDM"
          :clearable="true"
        ></DatePicker>
        <!-- 月历 -->
        <DatePicker
          type="month"
          :value="mouths"
          style="width: 200px; margin-left: 0px"
          v-show="!isDay"
          :editable="false"
          @on-change="changeDM"
          :clearable="true"
        ></DatePicker>

        <!-- 导出 使用v-if -->
        <!-- <div class="output" v-if="isoutput">
          <Select v-model="model" style="width: 100px" @on-select="output">
            <Option
              v-for="item in cityList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div> -->

        <!-- 搜索 -->
        <div class="serach" style="margin-left: 0px; margin-right: 0px">
          <Input
            placeholder="输入设备号"
            @on-enter="searchDevice"
            v-model="device"
            class="inp"
            clearable
          />
          <Button type="primary" @click="searchDevice" class="but">查询</Button>
          <Button @click="reset" class="but">重置</Button>
          <!-- <Button @click="reset" class="but">导出</Button> -->
        </div>

        <div class="export" v-if="isoutput" style="margin-left: 0px">
          <Dropdown placement="bottom" @on-click="outputs">
            <a href="javascript:void(0)">
              <Icon custom="icon-v5 icon-v5-daochu" size="20" class="buts" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="now">导出当前页数据</DropdownItem>
              <DropdownItem name="all">导出全部数据</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <!-- <div  style="margin-right: 25%"></div> -->
    <!-- <br /> -->
    <!-- echart 图表部分 -->
    <!-- <div style="background: #1a202e; margin-top: 50px"> -->
    <div
      class="echarts"
      :style="
        datas.tem
          ? 'padding-top:2px;background: #1a202e;'
          : 'padding: 20px;padding-bottom:0px;background: #1a202e;'
      "
      v-if="!datas.date"
    >
      <slot></slot>
      <div style="height: 338px" v-if="datas.other">
        <slot name="ect1"></slot>
        <p
          style="
            width: 5px;
            background-color: #090f19;
            float: left;
            height: 364px;
            margin-top: -20px;
          "
        ></p>
        <slot name="ect2"></slot>
      </div>
    </div>
    <!-- 表格部分 -->
    <!-- <h6 style="height:10px;float:none;margin-top:10px" v-if="datas.date"></h6> -->
    <br v-if="datas.date" />
    <br v-if="datas.date" />
    <div
      class="table"
      style="
        padding: 20px;
        padding-bottom: 0px;
        background: #1a202e;
        margin-top: 7px;
      "
    >
      <!-- 表格 -->
      <Table
        :data="datas.tableData1"
        :columns="datas.tableColumns1"
        :height="datas.date ? 520 : 320"
        :disabled-hover="true"
        ref="table"
      >
        <template slot-scope="{ row }" slot="type_number">
          <span class="pointer" :style="row.type_number ===1003?'color:#409eff':'color:#e6a23c'">{{ row.type_number ===1003?'分闸警告':'合闸警告' }}</span>
        </template>
        <template slot-scope="{ row }" slot="mac">
          <span class="pointer" @click="handle(row)">{{ row.mac }}</span>
        </template>
        <template slot-scope="{ row }" slot="macname">
          <span >{{ row.boxName }}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
           <span
              size="30"
              class="c-primary pointer"
              style="margin: 0 10px"
              custom="icon-v5 icon-v5-xianlu"
              @click="lineLeakageDetail(row.address, row.mac)"
              >线路明细</span
            >
          <span
              size="30"
              class="c-primary pointer"
              style="margin: 0 10px"
              custom="icon-v5 icon-v5-qushi"
              @click="leakageTrend(row.address, row.mac)"
              >历史趋势</span
            >
        </template>

        <template slot-scope="{ row }" slot="actions">
           <span
              size="30"
              class="c-primary pointer"
              custom="icon-v5 icon-v5-qushi"
              @click="leakageTrend(row.address, row.mac)"
              >历史趋势</span
            >
        </template>
      </Table>
      <!-- 分页 -->
      <div style="overflow: hidden">
        <div style="float: right" :style="datas.date ? 'margin-bottom:150px' : ''">
          <Page
            show-total
            :current="current"
            @on-change="changePage"
            :total="datas.total"
            show-elevator
          />
        </div>
      </div>
    </div>
    <!-- 设备详情 -->
    <Modal
      title="设备详情"
      :close-on-click-modal="false"
      custom-class="details-dialog"
      v-model="detailsFlag"
      width="1323px"
      id="Details"
      :before-close="handleDetailsClose"
    >
      <div slot="header">
        <span class="title">设备详情</span>
        <span
          class="offline-attention c-danger"
          v-show="detailsObj.others.online !== 1"
          >设备离线可能是由于设备断电、通讯信号弱、或发生重大事故</span
        >
      </div>
      <div class="date-picker">
        <DatePicker
          style="width: 135px"
          v-model="detailsValue"
          :type="
            detailsObj.equipmentType === 6 || detailsObj.equipmentType === 7
              ? 'month'
              : 'date'
          "
          @on-change="handleDateChange"
          :disabled="$store.state.dateFlag"
          :editable="false"
          :value-format="
            detailsObj.equipmentType === 6 || detailsObj.equipmentType === 7
              ? 'yyyy-MM'
              : 'yyyy-MM-dd'
          "
          placeholder="请选择日期"
          :clearable="false"
        >
        </DatePicker>
      </div>
      <Details v-if="detailsFlag" :param="detailsObj"></Details>
      <div slot="footer"></div>
    </Modal>
    <!-- 线路明细 -->
    <Modal :title="addr" width="40%" v-model="dialogTableVisible">
      <Table :data="lineDetail" :columns="trendlines">
          <template slot-scope="{ row }" slot="aT">
           <span>{{row.aT?row.aT:'--'}}</span>
        </template>
        <template slot-scope="{ row }" slot="bT">
           <span>{{row.bT?row.bT:'--'}}</span>
        </template>
        <template slot-scope="{ row }" slot="cT">
           <span>{{row.cT?row.cT:'--'}}</span>
        </template>
        <template slot-scope="{ row }" slot="nT">
           <span>{{row.nT?row.nT:'--'}}</span>
        </template>
      </Table>
      <div slot="footer"></div>
    </Modal>
    <!-- 历史趋势 -->
    <Modal :title="addrs" class="lines" v-model="trendDialog" :width="width" :styles="{top: '40px'}">
      <div slot="footer"></div>
      <Row class="pickDate" style="margin-bottom:10px">
        <div style="margin-left: 20px; margin-right: 5px; margin-top: 5px">
          日期:
        </div>
        <RadioGroup
          v-model="dateRadios"
          @on-change="handleDatePickers"
          style="margin-top: 5px"
        >
          <Radio label="日"></Radio>
          <Radio label="月"></Radio>
        </RadioGroup>
        <template>
          <div class="block" v-show="isDays">
            <DatePicker
              v-show="isDays"
              :editable="false"
              v-model="dayss"
              type="date"
              value-format="yyyy-MM-dd"
              @on-change="changeDMs"
              :clearable="false"
            >
            </DatePicker>
          </div>
          <div class="block" v-show="!isDays">
            <DatePicker
              v-model="mouthss"
              value-format="yyyy-MM"
              type="month"
              :editable="false"
              @on-change="changeDMs"
              :clearable="false"
            >
            </DatePicker>
          </div>
        </template>
      </Row>
      <template v-if="slotshow" style="margin: 20px">
        <slot name="history" />
      </template>
      <Table
        :data="
          datas.tableData1s
        "
        :columns=" $route.path === '/safetyMonitor/leakageWarm' ? hisqsa : trendHistory"
        :height="320"
        :disabled-hover="true"
      >
        <template slot-scope="{ row }" slot="mac">
          <span class="pointer" @click="handle(row)">{{ row.mac }}</span>
        </template>
      </Table>
      <!-- 分页 -->

      <div
        style="margin: 10px; overflow: hidden"
        v-if="$route.path !== '/safetyMonitor/leakageWarm'"
      >
        <div style="float: right">
          <Page
            show-total
            :current="1"
            @on-change="changePages"
            :total="datas.totals"
            show-elevator
          />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
// 引入分组的api
    import { groupingList, tree } from '@/api/safetyMonitor/public';
    import { getGroupType, getGroupTree } from '@/api/public';
    // import Edetails from '@/components/dialog';
    import { warnStates } from '@/api/safetyMonitor/temperature';
    import '@/styles/pages/leakage.less';
    import {
        queryChannels,
        queryBoxDetails,
        modifyMacRate
    } from '@/api/safetyMonitor/leakage';
    import store from '@/store/index';
    import Details from '@/pages/Control/Details';
    import BarChart from '@/pages/Common/Bars';
    export default {
        data () {
            return {
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                value1: '',
                value2: '',
                value3: '',
                value4: '',
                values3: '',
                values4: '',
                dateRadio: '日',
                data: [],
                days: '',
                mouths: '',
                dayss: '',
                mouthss: '',
                dayHis: true,
                dataflag: false,
                isDay: true,
                isDays: true,
                isMouth: false,
                device: '',
                tableData1: [],
                tableColumns1: [],
                select: [
                    {
                        title: '导出全部数据',
                        expand: true,
                        value: '1',
                        selected: false,
                        checked: false,
                        sortable: true
                    },
                    {
                        title: '导出当前页数据',
                        expand: true,
                        value: '0',
                        selected: false,
                        checked: false
                    }
                ],
                cityList: [
                    {
                        value: 1,
                        label: '导出全部数据'
                    },
                    {
                        value: 2,
                        label: '导出当前页面'
                    }
                ],
                isoutput: false,
                cityList1: [],
                model: '',
                model1: '',
                cityList2: [],
                model2: '',
                detailsFlag: false,
                detailsObj: {
                    others: {
                        version: '',
                        online: ''
                    }
                },
                detailsValue: '',
                addr: '',
                dialogTableVisible: false,
                lineDetail: [],
                trendlines: [
                    {
                        title: '线路名称',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '温度A(℃)',
                        slot: 'aT',
                        align: 'center'
                    },
                    {
                        title: '温度B(℃)',
                        slot: 'bT',
                        align: 'center'
                    },
                    {
                        title: '温度C(℃)',
                        slot: 'cT',
                        align: 'center'
                    },
                    {
                        title: '温度N(℃)',
                        slot: 'nT',
                        align: 'center'
                    }
                ],
                trendDialog1: false,
                trendDateType: 1,
                trendDate: '',
                trendFlag: false,
                trendDialog: false,
                trendPicker: 'day',
                trendLoading: false,
                trendData: [],
                trendValue: this.$func.getNowFormatDate(),
                trendMonth: this.$func.getCurrentYearMonth(),
                typeNumbers: -100,
                trendHistory: [
                    {
                        title: '线路',
                        key: 'title'
                    },
                    {
                        title: '温度A(℃)',
                        key: 'aT'
                    },
                    {
                        title: '温度B(℃)',
                        key: 'bT'
                    },
                    {
                        title: '温度C(℃)',
                        key: 'cT'
                    },
                    {
                        title: '温度N(℃)',
                        key: 'nT'
                    }
                ],
                trendOptions: {
                    xAxis: [],
                    series: [
                        {
                            type: 'bar',
                            barMaxWidth: '30',
                            name: '温度值A',
                            data: [],
                            itemStyle: {
                                normal: { color: {}, label: { show: true, position: 'top' } }
                            }
                        }
                    ],
                    title: { show: true, text: '' },
                    tooltip: { show: true, trigger: '', formatter: '' },
                    monitor: true,
                    dateType: ''
                },
                dayes: [this.$Date().format('YYYY-MM') + '-01', this.$Date().format('YYYY-MM-DD')],
                params: {
                    page: 1,
                    rows: 10,
                    projectCode: this.$store.state.projectCode,
                    mac: '',
                    dateType: 1,
                    date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
                    nodeId: ''
                },
                width: 800,
                slotshow: false,
                arr: [],
                addrs: '',
                dateRadios: '日',
                hisqsa: [
                    {
                        title: '时间',
                        key: 'time'
                    },
                    {
                        title: '漏电报警数量',
                        key: 'number1'
                    },
                    {
                        title: '漏电预警数量',
                        key: 'number2'
                    }
                ],
                current: 1
            };
        },
        methods: {
            getGroupTypes () {
                let params = {
                    projectCode: this.$store.state.projectCode // 'P00000000012'
                };
                getGroupType(params)
                    .then((res) => {
                        //  console.log(res, '分组类型');
                        if (res.success) {
                            this.packetList = res && res.data;
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
            groupingType (e) {
                this.changeType(e);
            },
            groupingChoise (e) {
                // 分组筛选完之后，就传给父级进行应用，根据这个ID发请求
                // 分组筛选
                console.log('数据发生了改变');
                let str = '';
                e.forEach((item) => {
                    str += item + ',';
                });
                str = str.substr(0, str.length - 1);
                this.$emit('sendID', str);
            },
            changeflag () {
                // 显示隐藏 日历
                this.dataflag = !this.dataflag;
            },
            init () {
                this.days = this.$Date().format('YYYY-MM-DD');
                this.mouths = this.$Date().format('YYYY-MM');
                this.dayss = this.$Date().format('YYYY-MM-DD');
                this.mouthss = this.$Date().format('YYYY-MM');

                this.getdata();
                this.getGroupTypes()
            },
            searchDevice () {
                console.log(2);
                this.current = 1
                let str = ''
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    if (this.packetFilter.length !== 0) {
                        this.packetFilter.forEach((item) => {
                            str += item + ',';
                        });
                        str = str.substr(0, str.length - 1);
                    }
                    if (this.isoutput) {
                        if (this.daynow === undefined) this.daynow = [this.$Date().format('YYYY-MM') + '-01', this.$Date().format('YYYY-MM-DD')]
                        let arr = {
                            mac: this.device,
                            startTime: this.daynow ? this.daynow[0] : this.$Date().format('YYYY-MM') + '-01',
                            endTime: this.daynow ? this.daynow[1] : this.$Date().format('YYYY-MM-DD'),
                            nodeIds: str
                        }
                        this.$emit('search', arr);
                    } else {
                        let arr = {
                            mac: this.device,
                            dateType: this.dateRadio === '日' ? 1 : 2,
                            date: this.daynow ? this.daynow : this.$Date().format('YYYY-MM-DD'), // 默认为今天
                            nodeIds: str
                        }
                        this.$emit('search', arr);
                    }
                }
            },
            changePage (e) {
                // 改变页码
                this.current = e
                this.$emit('sendPage', e);
            },
            changePages (e) {
                this.$emit('sendPages', e);
            },
            changesize (e) {
                // 改变每页显示条数
                this.$emit('sendSize', e);
            },
            outputs (e) {
                let ctxPaths = this.$func.ctxPaths();
                // this.$Date().format('YYYY-MM-DD HH:mm:ss');
                this.daynow === undefined
                    ? (this.daynow = [
                        this.$Date().format('YYYY-MM') + '-01',
                        this.$Date().format('YYYY-MM-DD')
                    ])
                    : console.log(this.daynow);

                if (this.$route.path === 'safetyMonitor/ocWarn') {
                    this.$func.windowCountDown(
                        ctxPaths +
                            '/project/main/v3/xls/openingAndClosingWarning.as?projectCode=' +
                            this.$store.state.projectCode +
                            '&mac=' +
                            this.device +
                            '&pageNo=' +
                            this.params.page +
                            '&pageSize=' +
                            this.params.rows +
                            '&startTime=' +
                            this.daynow[0] +
                            '&endTime=' +
                            this.daynow[1] +
                            '&exportType=' +
                            (e === 'all' ? '' : 'exportCurrent') +
                            '&nodeIds=' + this.packetFilter
                    );
                } else {
                    this.$func.windowCountDown(
                        ctxPaths +
                            '/deStatuscan/result/export.as?mac=' +
                            this.device +
                            '&pageSize=' +
                            this.params.rows +
                            '&pageNo=' +
                            this.params.page +
                            '&startTime=' +
                            this.daynow[0] +
                            '&endTime=' +
                            this.daynow[1] +
                            '&projectCode=' +
                            this.$store.state.projectCode +
                            '&projectName=' +
                            this.$store.state.prjName +
                            '&export=' +
                            (e === 'all' ? e.toUpperCase() : '') +
                            '&nodeIds=' + this.packetFilter
                    );
                }
            },

            changeDM (date) {
                // 改变日期
                // 直接把所需要的日期和日期类型传过去
                this.daynow = date;
                if (this.isDay) {
                    // 日
                    this.isDay = true;
                    this.value3 = date;

                    this.$emit('sendDate', [1, date]);
                } else {
                    // 月
                    this.isDay = false;
                    this.value4 = date;
                    this.$emit('sendDate', [2, date]);
                }
            },
            changeDMs (date) {
                // 改变日期
                // 直接把所需要的日期和日期类型传过去
                // console.log(date);
                this.daynow = date;
                if (this.isDays) {
                    // 日
                    this.isDay = true;
                    this.values3 = date;

                    this.$emit('sendDates', [1, date]);
                } else {
                    // 月
                    this.values4 = date;
                    this.isDay = false;
                    this.$emit('sendDates', [2, date]);
                }
            },
            getdata () {
                groupingList({ projectCode: this.$store.state.projectCode }).then(
                    (res) => {
                        if (res.data) {
                            this.cityList1 = res.data;
                            for (let i = 0; i < res.data.length; i++) {
                                this.cityList1[i].value = res.data[i].id;
                            }
                        }
                        // console.log(this.cityList1);
                    }
                );
            },
            changeType (groupId) {
                this.$nextTick(() => {
                    tree({ groupId }).then((res) => {
                        // 使用递归
                        function sys (arr, parentId) {
                            let data2 = [];
                            if (arr.length !== 0) {
                                // 经过一系列过滤去筛选，如果后面筛选出来的数组为空，就结束递归
                                let pArr = res.data.filter((value) => {
                                    // 筛选出满足条件的
                                    return value.parentId === parentId;
                                });
                                let mArr = arr.filter((value) => {
                                    // 筛选出不满足条件的 剩下的就是之前筛选出来的子集
                                    return value.parentId !== parentId;
                                });
                                pArr.forEach((value, i) => {
                                    let arr = {};
                                    arr.title = value.name;
                                    arr.value = value.id;
                                    arr.children = sys(mArr, value.id);
                                    data2.push(arr);
                                });
                                return data2;
                            } else {
                                return false;
                            }
                        }
                        this.cityList2 = sys(res.data, 0);
                    });
                });
            },
            line (e) {
                this.$emit('sendline', e);
            },
            historys (e) {
                this.$emit('sendhistory', e);
            },
            handle (row) {
                queryBoxDetails({ mac: row.mac })
                    .then((res) => {
                        if (res.success) {
                            this.detailsObj = res.data;
                            store.commit('mac', this.detailsObj.mac);
                            store.commit('equipmentType', this.detailsObj.equipmentType);
                            if (
                                this.detailsObj.equipmentType === 6 ||
                                this.detailsObj.equipmentType === 7
                            ) {
                                this.detailsValue = this.$func.getCurrentYearMonth();
                            } else {
                                this.detailsValue = this.$func.getNowFormatDate();
                            }
                            store.commit('historyDate', this.detailsValue);
                            this.detailsFlag = true;
                            this.handleModifyMacRate(this.detailsObj.mac, true);
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
            handleDetailsClose () {
                if (
                    this.detailsObj.equipmentType === 6 ||
                    this.detailsObj.equipmentType === 7
                ) {
                    this.detailsValue = this.$func.getCurrentYearMonth();
                    store.commit('historyDate', this.$func.getCurrentYearMonth());
                } else {
                    this.detailsValue = this.$func.getNowFormatDate();
                    store.commit('historyDate', this.$func.getNowFormatDate());
                }
                store.commit('detailsAddr', '');
                this.handleModifyMacRate(this.$store.state.mac, false);
                store.dispatch('resetMac');
                this.detailsFlag = false;
            },
            handleModifyMacRate (mac, flag) {
                if (!mac) return false;
                modifyMacRate({
                    fastMac: flag === true ? mac : '',
                    slowMac: flag === true ? '' : mac
                });
            },
            handleDateChange (val) {
                this.value = val;
                store.commit('historyDate', val);
            },
            queryChannels (addr, mac) {
                let params = {
                    mac: mac
                };
                queryChannels(params)
                    .then((res) => {
                        if (res.success) {
                            this.lineDetail = res.datas;
                            console.log(res.datas);
                            // console.log(this.lineDetail);
                            this.addr = '【' + addr + '】' + '的' + '线路' + ' ' + '温度明细';
                            this.dialogTableVisible = true;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
                    .catch((err) => {
                        // console.log(err);
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            lineLeakageDetail (addr, mac) {
                this.queryChannels(addr, mac);
            },
            // 历史趋势
            leakageTrend (addr, mac) {
                this.addrss = addr;
                this.macss = mac;
                this.$emit('sendmacs', mac);
                if (this.$route.path === '/safetyMonitor/leakageWarm') {
                    this.trendDialog = true;
                    // console.log('温度');
                    this.width = 1000;
                    this.addrs = `【${addr}】的温度 历史趋势`;
                    setTimeout(() => {
                        this.slotshow = true;
                    }, 1);
                    this.arr = [];
                    this.datas.optionss.series[0].data.forEach((item, index) => {
                        this.arr.push({
                            time: index,
                            number1: item,
                            number2: this.datas.optionss.series[1].data[index]
                        });
                    });
                } else {
                    this.trendDialog = true;
                    console.log(this.datas.tableData1s, '数据呢');
                    this.width = 1000;
                    // this.$emit('sendmacs', mac.trim());
                    this.addrs = `【${addr}】的温度 历史趋势`;
                    setTimeout(() => {
                        // this.width = 1000
                        this.slotshow = true;
                    }, 1);
                }
            },
            initTrend () {},
            handleCloseTrend () {
                this.trendPicker = 'day';
                this.trendValue = this.$func.getNowFormatDate();
                this.trendMonth = this.$func.getCurrentYearMonth();
            },
            handleTrendDayPicker (val) {
                console.log(1111);
            },
            handleTrendMonthPicker (val) {
                console.log(222);
                // this.trendDateType = 2;
                // this.trendDate = val;
                // this.trendMonth = val;
                // this.trendOptions.title.text = this.$func.getMonthText(val) + '温度情况';
                // this.initTrend();
            },
            reset () {
                this.current = 1
                console.log(this.current);
                this.model1 = '';
                this.cityList2 = [];
                this.days = '';
                this.packetTypes = ''
                this.packetFilter = []
                this.dayes = [];
                this.device = '';
                this.isDay = true;
                this.dateRadio = '日';
                this.$emit('reset');
            },
            handleTypes (val) {
                console.log(val, '分组类型val');
                this.packetTypes = val;
                this.getGroupTrees();
            },
            getGroupTrees () {
                // if (!this.packetTypes) {
                //     this.$Message.error({
                //         content: '请先选择分组类型'
                //     });
                // }
                getGroupTree({ groupId: this.packetTypes })
                    .then((res) => {
                        if (res.code === '0') {
                            this.packNewlist = res.data;
                            let resData = this.getTree(res.data);
                            this.packetFilterList = this.cloneTree(resData);
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
            cloneTree (score, parentId = 0) {
                let tree = [];
                score.map((item) => {
                    if (item.parentId === parentId) {
                        // 递归寻找
                        item.children = this.cloneTree(score, item.id);
                        tree.push(item);
                    }
                });

                return tree;
            },
            getTree (tree = []) {
                let arr = [];
                if (!!tree && tree.length !== 0) {
                    tree.forEach((item) => {
                        let obj = {};
                        obj.id = item.id;
                        obj.value = item.id;
                        obj.parentId = item.parentId;
                        obj.title = item.name;
                        // 其他你想要添加的属性
                        obj.expand = true;
                        obj.selected = false;
                        obj.checked = false;
                        obj.children = this.getTree(item.children); // 递归调用
                        arr.push(obj);
                    });
                }
                return arr;
            },
            handleDatePicker (dateType) {
                if (dateType === '日') {
                    // 日
                    dateType = 1;
                    this.isDay = true;
                    let date = this.value3 ? this.value3 : this.days;
                    console.log(dateType, date);
                    this.$emit('sendDate', [dateType, date]);
                } else {
                    // 月
                    dateType = 2;
                    this.isDay = false;
                    let date = this.value4 ? this.value4 : this.mouths;
                    console.log(dateType, date);
                    this.$emit('sendDate', [dateType, date]);
                }
            },
            handleDatePickers (dateType) {
                if (dateType === '日') {
                    // 日
                    dateType = 1;
                    this.isDays = true;
                    let date = this.values3
                        ? this.values3
                        : this.$Date().format('YYYY-MM-DD');
                    this.$emit('sendDates', [dateType, date]);
                } else {
                    // 月
                    dateType = 2;
                    this.isDays = false;
                    let date = this.values4 ? this.values4 : this.$Date().format('YYYY-MM');
                    this.$emit('sendDates', [dateType, date]);
                }
            },
            leakageWarn (address, mac) {

            }
        },
        mounted () {
            if (this.datas.isoutput) this.isoutput = this.datas.isoutput;
            this.init();
            if (this.$route.path === '/safetyMonitor/temperature') {
                warnStates(this.params).then((res) => {
                    // 获取echarts的数据
                    // 还得先清空数据
                    // console.log(res);
                    this.trendOptions.xAxis = [];
                    this.trendOptions.series[0].data = [];

                    if (this.params.dateType === 2) {
                        this.trendOptions.title.text = '当月温度报警情况';
                    } else {
                        this.trendOptions.title.text = '24小时温度报警情况';
                    }
                    for (let i = 0; i < res.data.length; i++) {
                        // console.log(i); itemStyle: { color: '#87CF86' }
                        this.trendOptions.xAxis.push(res.data[i].time);
                        this.trendOptions.series[0].data.push({
                            value: res.data[i].number1,
                            itemStyle: { color: '#87CF86' }
                        });
                    }
                });
            }
        },
        watch: {
            datas: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.datas = newVal;
                        // this.cityList2 = newVal.data2;
                        // this.datas.optionss ? this.trendOptions = this.datas.optionss : this.trendOptions = []
                    }
                },
                deep: true
            },
            trendOptions: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.trendOptions = newVal;
                    }
                },
                deep: true
            },
            arr: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.arr = newVal;
                    }
                },
                deep: true
            }

        },
        props: {
            datas: {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        components: {
            Details,
            BarChart
        }
    };
</script>

<style lang="less" scoped>
.blockLseft {
  div {
    float: left;
    margin: 10px;
  }
  .output {
    float: right;
    margin: 10px;
    margin-top: 10px;
  }
  .btn {
    // position: relative;
    // right: 30px;
    // margin-top: 10px;
    .button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      line-height: 30px;
      border: none;
      color: #fff;
    }
  }
  .date {
    // float: left;
    // line-height: 50px;
    // margin-left: 10px;
    height: 50px;
  }
  .serach {
    // width: 300px;
    float: left;
    margin-left: -20px;
    .inp {
      float: left;
      margin: 10px;
      margin-top: 0px;
      margin-left: 0px;
      width: 200px;
    }
    .but {
      float: left;
      margin: 10px;
      margin-top: 0px;
      margin-left: 0;
    }
    .buts {
      float: left;
      margin: 10px;
      // margin-top: 0px;
      margin-left: 0;
    }
  }
}
.table {
  // width: 1000px;
  // float: left;
  .pointer {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}

.echarts {
  margin-top: 50px;
  padding: 20px;
  div {
    width: 100%;
  }
}
.leakage {
  .head {
    width: 100%;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    background: #151518;
    margin-bottom: 10px;
    .head-left {
      display: flex;
      align-items: center;
      .type {
        span {
          margin: 0px 8px;
        }
      }
    }
    .head-right {
      display: flex;
      align-items: center;
      .btn {
        display: flex;
        .button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
      }
      .date {
        display: flex;
        span {
          margin: 7px 8px;
        }
      }
      .search-device {
        display: flex;
        align-items: center;
        margin-left: 10px;
        Button {
          margin-left: 10px;
        }
      }
    }
  }
  .leakage-content {
    background: #151518;
    padding-top: 10px;
    #main1 {
      width: 100%;
      height: 500px;
    }
    .mymain {
      .typeC {
        display: flex;
        justify-content: center;
        padding-bottom: 20px;
        span {
          display: flex;
          .active {
            width: 40px;
            height: 20px;
            border-radius: 5px;
            margin: 0px 10px;
          }
          .active1 {
            background: #87cf86;
          }
          .active2 {
            background: #e79c27;
          }
          .active3 {
            background: #f26665;
          }
          h6 {
            font-size: 14px;
          }
        }
      }
    }
  }

  .pointer {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
.date-picker {
  position: absolute;
  right: 40px;
  top: 14px;
  z-index: 999;
  button {
    // width: 30px;
    height: 30px;
    // border-radius: 50%;
    padding: 0 8px;
    margin-right: 10px;
  }
  .circle {
    height: 30px;
    width: 30px;
    // border-radius: 50%;
    padding: 3px;
    margin-right: 10px;
  }
  span {
    margin-right: 5px;
  }
}

.lines {
  padding: 20px;
  margin-top: -50px;
}
.export {
  background: rgba(0, 126, 255, 0.1);
  border: 1px solid #007eff;
  border-radius: 5px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  .ivu-icon {
    color: #007eff;
    margin: 0 !important;
  }
}
/deep/::-webkit-scrollbar {
  width: 6px; //竖轴宽度
  height: 6px; //横轴宽度
  // background-color: rgba(99, 110, 246, 0.5);
}

/* 滚动槽 */
/deep/::-webkit-scrollbar-track {
  border-radius: 10px;
}

/deep/::-webkit-scrollbar-thumb {
  background-color: #ccc;
  // #1A202E
}
</style>
