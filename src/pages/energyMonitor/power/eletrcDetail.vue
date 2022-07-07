/* eslint-disable no-unused-expressions */
<template>
  <div>
    <Col id="power-form" :span="24">
      <div id="input-wrap">
        <Form
          ref="form"
          :model="form"
          inline
          style="
            display: flex;
            background-color: #1a202e;
            padding-top: 20px;
            padding-left: 20px;
          "
        >
          <Col>
            <!-- 表单逻辑已完成   已完成图表部分逻辑-->
            <Select
              v-model="packetTypes"
              transfer
              clearable
              class="build"
              style="width: 200px"
              placeholder="分组类型"
              @on-change="handleTypes"
            >
              <Option
                v-for="item in packetList"
                :key="item.id"
                :label="item.type"
                :value="item.id"
              ></Option> </Select
          ></Col>
          <Col style="margin-left: 10px"
            ><FormItem>
              <TreeSelect
                transfer
                v-model="packetFilter"
                multiple
                show-checkbox
                placeholder="分组筛选"
                :data="packetFilterList"
              /> </FormItem
          ></Col>
          <Col>
            <!-- <RadioGroup v-model="buttonSize">
              <Radio label="year" style="margin-left: 5px">年</Radio>
              <Radio label="month" style="margin-left: 5px">月</Radio>
            </RadioGroup> -->
            <Select
              style="width: 200px"
              v-model="year"
              transfer
              clearable
              placeholder="请选择年"
            >
              <Option
                v-for="item in years"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></Option>
            </Select>
            <Select
              style="width: 200px; margin-left: 10px"
              v-model="month"
              transfer
              clearable
              placeholder="请选择月"
            >
              <Option
                v-for="item in months"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></Option>
            </Select>
          </Col>
          <Col style="margin-left: 10px">
            <FormItem>
              <Button type="primary" @click="querList">查询</Button>
            </FormItem>
            <FormItem>
              <Button type="default" @click="restList">重置</Button>
            </FormItem>
          </Col>
        </Form>
      </div>
    </Col>
    <Col
      :span="24"
      style="background-color: #1a202e; margin-top: 10px; padding-top: 20px"
    >
      <span style="display: flex">
        <Col :span="1"></Col>
        <Col :span="21"> <h3 style="margin-left: -20px">用电趋势</h3></Col>
        <div class="active"></div>
        <h6>用电趋势</h6>
      </span>
      <bar-charts :options="thirdBarOptions" v-if="thirdBar"></bar-charts>
    </Col>
    <Col
      :span="24"
      style="background-color: #1a202e; margin-top: 10px; padding-top: 20px"
    >
      <Tabs name="children-name">
        <TabPane label="用电数据列表" name="children-name1" tab="children-name">
          <Row style="padding: 0px 20px; background-color: #1a202e">
            <Table
              height="600"
              highlight-row
              style="width: 100%"
              ref="currentRowTable"
              :columns="columns"
              :data="dataList"
            ></Table>
          </Row>
          <!--不需要 <Page :current="currentPage" :total="total" :page-size="pageSize" show-elevator  @on-change="changePage" @on-page-size-change="changesize" /> -->
        </TabPane>
        <TabPane
          label="每户用电数据列表(自然月)"
          name="children-name2"
          tab="children-name"
        >
          <Form :model="form" inline style="display: flex">
            <Col>
              <FormItem style="display: flex; margin-left: 20px">
                <Select
                  transfer
                  clearable
                  v-model="building"
                  placeholder="全部"
                  style="width: 200px"
                >
                  <Option
                    z-index="5"
                    v-for="item in buildings"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <FormItem style="display: flex">
                <Input
                  v-model="keyword"
                  clearable
                  placeholder="请输入设备号搜索"
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem style="display: flex">
                <Select
                  style="width: 200px"
                  v-model="Dateyear"
                  clearable
                  placeholder="请选择年份"
                >
                  <Option
                    v-for="item in years"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  ></Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <FormItem style="display: flex">
                <Select
                  clearable
                  style="width: 200px"
                  v-model="Datemonth"
                  placeholder="请选择月份"
                >
                  <Option
                    v-for="(item, index) in months"
                    :key="index"
                    :label="item.text"
                    :value="item.value"
                  ></Option>
                </Select>
              </FormItem>
            </Col>
            <FormItem>
              <Button type="primary" @click="queryPowerList">查询</Button>
            </FormItem>
            <FormItem>
              <Button type="default" @click="resetPowerList">重置</Button>
            </FormItem>
            <FormItem>
              <Dropdown trigger="click" @on-click="handleCommand" transfer>
                <Button class="export">
                  <Icon custom="icon-v5 icon-v5-daochu" />
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem name="exportCurrent"
                    >导出当前页设备电量</DropdownItem
                  >
                  <DropdownItem name="exportAll"
                    >导出所有页设备电量</DropdownItem
                  >
                </DropdownMenu>
              </Dropdown>
            </FormItem>
          </Form>
          <Row style="padding: 0px 20px; background-color: #1a202e">
            <Table
              style="width: 100%"
              ref="currentRowTable"
              :columns="columns2"
              :data="naturalList"
            >
            <template slot-scope="{ row }" slot="macname">
                <span>{{ row.name}}</span>
              </template>
              <template slot-scope="{ row }" slot="room">
                <span
                  >{{ row.unit ? row.unit : ''
                  }}{{ row.room ? ',' + row.room : '' }}</span
                >
              </template>
              <template slot-scope="{ row }" slot="status">
                <span v-if="row.statusCnString === 'NORMAL'">
                  <span v-if="row.others.online === 1">
                    启用|
                    <span class="c-success">在线</span>
                  </span>
                  <span v-else-if="row.others.online === 0">
                    启用|
                    <span class="c-danger">离线</span>
                  </span>
                  <span v-else>
                    启用|
                    <span class="c-info">脱线</span>
                  </span>
                </span>
                <span v-else>禁用</span>
              </template>
              <template slot-scope="{ row, index }" slot="operating">
                <Button
                  type="text"
                  style="color: #2d8cf0"
                  @click="
                    linePowerDetail(
                      row.build,
                      row.unit,
                      row.room,
                      row.mac,
                      index
                    )
                  "
                  >线路明细</Button
                >
              </template>
            </Table>
          </Row>

          <Page
            :current="currentPage"
            :total="total"
            :page-size="pageSize"
            show-elevator
            @on-change="changePage"
            @on-page-size-change="changesize"
          />
        </TabPane>
        <TabPane
          label="每户用电数据列表(自定义月)"
          name="children-name3"
          tab="children-name"
        >
          <Form :model="form" inline style="display: flex">
            <Col style="margin-left: 20px">
              <FormItem style="display: flex">
                <Select
                  transfer
                  clearable
                  v-model="build"
                  placeholder="全部"
                  style="width: 200px"
                >
                  <Option
                    z-index="5"
                    v-for="item in builds"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <DatePicker
                v-model="customValue"
                format="yyyy/MM/dd"
                type="daterange"
                placement="bottom-end"
                placeholder="Select date"
                style="width: 200px"
                :start-date="new Date()"
                transfer
                :editable="false"
                :clearable="false"
              ></DatePicker>
            </Col>
            <Col>
              <FormItem style="display: flex; margin-left: 10px">
                <Input v-model="keywordKer" placeholder="请输入设备号搜索" />
              </FormItem>
            </Col>
            <Col>
              <FormItem>
                <Button type="primary" @click="queryPowerListKer">查询</Button>
              </FormItem>
              <FormItem>
                <Button type="default" @click="resetPowerListKer">重置</Button>
              </FormItem>
              <FormItem>
                <!-- <Button type="primary" ghost @click="handleExportRange">
                 <i class="icon-v5 icon-v5-daochu1"></i>
                </Button> -->
                <Button class="export" @click="handleExportRange">
                  <Icon custom="icon-v5 icon-v5-daochu" />
                </Button>
              </FormItem>
            </Col>
          </Form>
          <Row style="padding: 0px 20px; background-color: #1a202e">
            <Table
              highlight-row
              style="width: 100%"
              ref="currentRowTable"
              :columns="custColumns"
              :data="customlList"
            >
            <template slot-scope="{ row }" slot="macname">
                <span
                  >{{row.name}}</span
                >
              </template>
              <template slot-scope="{ row }" slot="room">
                <span
                  >{{ row.unit ? row.unit : ''
                  }}{{ row.room ? ',' + row.room : '' }}</span
                >
              </template>
              <template slot-scope="{ row }" slot="status">
                <span v-if="row.statusCnString === 'NORMAL'">
                  <span v-if="row.others.online === 1">
                    启用|
                    <span class="c-success">在线</span>
                  </span>
                  <span v-else-if="row.others.online === 0">
                    启用|
                    <span class="c-danger">离线</span>
                  </span>
                  <span v-else>
                    启用|
                    <span class="c-info">脱线</span>
                  </span>
                </span>
                <span v-else>禁用</span>
              </template>
              <template slot-scope="{ row, index }" slot="operating">
                <Button
                  type="text"
                  style="color: #2d8cf0"
                  @click="
                    linePowerDetail(
                      row.build,
                      row.unit,
                      row.room,
                      row.mac,
                      index
                    )
                  "
                  >线路明细</Button
                >
              </template>
            </Table>
          </Row>

          <Page
            :current="customcurrentPage"
            :total="customTotal"
            :page-size="custompageSize"
            show-elevator
            @on-change="customchangePage"
            @on-page-size-change="customChangesize"
          />
        </TabPane>
      </Tabs>
    </Col>
    <Modal
      :title="addr"
      width="40%"
      v-model="powerDialog"
      :mask="false"
      :footer-hide="true"
      @on-visible-change="handleCloseAddr"
    >
      <Row class="pickDate">
        <Tooltip content="导出" placement="top">
          <Icon type="md-cloud-upload" @click="handlePowerExport" />
        </Tooltip>
        <div style="margin: 0 10px">
          <div class="block" v-show="datePicker === 'month'">
            <DatePicker
              v-model="powerMonth"
              type="date"
              :editable="false"
              value-format="yyyy-MM"
              format="yyyy-MM"
              @on-change="handlePowerMonthPicker"
              :clearable="false"
            >
            </DatePicker>
          </div>
          <div class="block" v-show="datePicker === 'hour'">
            <DatePicker
              v-model="powerHour"
              type="datetime"
              value-format="yyyy-MM-dd HH"
              format="yyyy-MM-dd HH"
              @on-change="handlePowerHourPicker"
              :clearable="false"
              :editable="false"

            >
            </DatePicker>
          </div>
          <div class="block" v-show="datePicker === 'day'">
            <DatePicker
              v-model="powerDay"
              type="date"
              :editable="false"
              value-format="yyyy-MM-dd "
              format="yyyy-MM-dd "
              @on-change="handlePowerDayPicker"
              :clearable="false"
            >
            </DatePicker>
          </div>
        </div>
        <div class="block">
          <Button
            :type="datePicker === 'hour' ? 'success' : 'info'"
            class="button"
            @click="handleDatePicker('hour')"
            >时</Button
          >
          <Button
            :type="datePicker === 'day' ? 'success' : 'info'"
            class="button"
            @click="handleDatePicker('day')"
            >日</Button
          >
          <Button
            :type="datePicker === 'month' ? 'success' : 'info'"
            class="button"
            @click="handleDatePicker('month')"
            >月</Button
          >
        </div>
      </Row>
      <Table :columns="columns3" :data="powerData" style="margin-top: 20px">
      </Table>
    </Modal>
  </div>
</template>

<script>
    import BarCharts from './Bars.vue';
    import echarts from 'echarts/lib/echarts';
    import {
        getGroupTree,
        powerConsumptionTrend,
        getUserMessageListElecDetail,
        getBuildings,
        queryPower,
        chnlPowerStatsOfBox,
        getGroupType,
        queryTimeRangePowerOfProject
    } from '@/api/public';
    export default {
        name: 'eletrcDetail',
        components: { BarCharts },
        data () {
            return {
                Dateyear: new Date().getFullYear(),
                Datemonth:
                    new Date().getMonth() + 1 < 10
                        ? `0${new Date().getMonth() + 1}`
                        : `${new Date().getMonth() + 1}`,
                custColumns: [
                    { title: '设备号', key: 'mac', width: 200 },
                    { title: '设备别名', slot: 'macname' },
                    { title: '房号', slot: 'room' },
                    { title: '自然日期', key: 'electricity' },
                    { title: '自定义日期', key: 'preElectricity' },
                    { title: '对比', key: 'ratio' },
                    { title: '联系人', key: 'linkman' },
                    { title: '联系电话', key: 'linkmanTel' },
                    { title: '状态', slot: 'status' },
                    { title: '操作', slot: 'operating' }
                ],
                customlList: [],
                build: '',
                builds: [],
                customValue: [
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    new Date()
                ],
                keywordKer: '',
                columns3: [
                    { title: '线路名称', key: 'title' },
                    { title: '电量(度)', key: 'electricity' },
                    {
                        title: '上一时用电量',
                        key: 'preElectricity'
                    }
                ],
                powerData: [],
                powerDay: this.$func.getNowFormatDate(),
                powerHour: this.$func.formatDate('yyyy-MM-dd HH', new Date()),
                powerMonth: this.$func.getCurrentYearMonth(),
                datePicker: 'hour',
                dateType: 3,
                date: '',
                addr: '',
                mac: '',
                powerDialog: false,
                customcurrentPage: 1,
                customTotal: 0,
                custompageSize: 10,
                currentPage: 1,
                total: 0,
                pageNo: 1,
                pageSize: 10,
                building: '',
                buildings: [],
                keyword: '',
                columns2: [
                    { title: '设备号', key: 'mac', width: 200 },
                    { title: '设备别名', slot: 'macname', width: 200 },
                    { title: '房号', slot: 'room' },
                    { title: '本月电量(度)', key: 'electricity' },
                    { title: '上月电量(度)', key: 'preElectricity' },
                    { title: '对比', key: 'ratio' },
                    { title: '联系人', key: 'linkman' },
                    { title: '联系电话', key: 'linkmanTel' },
                    { title: '状态', slot: 'status' },
                    { title: '操作', slot: 'operating' }
                ],
                naturalList: [],
                columns: [
                    { type: 'index', width: 80, align: 'center', title: '序号' },
                    { title: '时间', key: 'time' },
                    { title: '当期电量(度)', key: 'curPower' },
                    { title: '同期期电量(度)', key: 'samePower' },
                    { title: '同比(%)', key: 'sameRatio' },
                    { title: '同比差值(度)', key: 'sameDifference' },
                    { title: '环比(%)', key: 'ringRatio' },
                    { title: '环比差值', key: 'ringDifference' }
                ],
                dataList: [],
                // buttonSize: '',
                types: '',
                thirdBar: false,
                form: {},
                treeList: [],
                packetList: [],
                packetTypes: '',
                packetFilter: [],
                packetFilterList: [],
                year: new Date().getFullYear(),
                years: [
                    { text: new Date().getFullYear() + '年', value: new Date().getFullYear() },
                    { text: new Date().getFullYear() - 1 + '年', value: new Date().getFullYear() - 1 },
                    { text: new Date().getFullYear() - 2 + '年', value: new Date().getFullYear() - 2 }
                ],
                month:
                    new Date().getMonth() + 1 < 10
                        ? `0${new Date().getMonth() + 1}`
                        : `${new Date().getMonth() + 1}`,
                months: [
                    { text: '1月', value: '01' },
                    { text: '2月', value: '02' },
                    { text: '3月', value: '03' },
                    { text: '4月', value: '04' },
                    { text: '5月', value: '05' },
                    { text: '6月', value: '06' },
                    { text: '7月', value: '07' },
                    { text: '8月', value: '08' },
                    { text: '9月', value: '09' },
                    { text: '10月', value: '10' },
                    { text: '11月', value: '11' },
                    { text: '12月', value: '12' }
                ],
                thirdBarOptions: {
                    legendStatus: true,
                    xAxisType: '',
                    yAxisType: '',
                    xAxis: [],
                    // yAxis: [
                    //     {
                    //         type: 'value',
                    //         axisLabel: {
                    //             formatter: '{value}度'
                    //         }
                    //     }
                    // ],
                    series: [],
                    title: {
                        show: true,
                        text: ''
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        formatter: '{b}<br/>' + '用电量' + '：{c0}<br/>'
                    }
                }
            };
        },
        created () {},
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.initBars();
                this.getElecDetailList();
                this.getGroupTypes();
                this.initBuilding();
            },
            resetPowerList () {
                this.building = '';
                this.Dateyear = '';
                this.Datemonth = '';
                this.keyword = '';
                this.queryList();
            },
            queryPowerListKer () {
                this.currentPage = this.pageNo = 1;
                if (this.customValue[0] === '' || this.customValue[1] === '') {
                    this.$Message.error({
                        content: '请选择时间'
                    });
                    return false;
                }
                this.queryListKer();
            },
            resetPowerListKer () {
                this.build = '';
                this.keywordKer = '';
                this.customValue = [
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    new Date()
                ];
                this.queryListKer();
            },
            handleExportRange () {
                if (
                    new Date(this.customValue[0]).getTime() >=
                    new Date(this.$func.getNowFormatDate()).getTime() ||
                    new Date(this.customValue[1]).getTime() >=
                    new Date(this.$func.getNowFormatDate()).getTime()
                ) {
                    this.$Message.error({
                        content: '导出范围不能大于或等于当天'
                    });
                    return false;
                }
                if (
                    this.$func.checkDateOneMonth(
                        this.customValue[0],
                        this.customValue[1]
                    ) === 'true'
                ) {
                    this.$func.windowCountDown(
                        this.$func.ctxPaths() + '/project/main/v3/xls/powerDetailByTimeRange.as?projectCode=' +
                            this.$store.state.projectCode +
                            '&mac=' +
                            this.keywordKer +
                            '&oqp1=' +
                            this.$func.formatDate('yyyy-MM-dd', this.customValue[0]) +
                            '&oqp2=' +
                            this.$func.formatDate('yyyy-MM-dd', this.customValue[1]) +
                            '&build=' + this.build
                    );
                } else {
                    this.$Message.error({
                        content: '导出时段明细'
                    });
                }
            },
            changePage (val) {
                this.currentPage = val;
                // 调用相关list接口
                this.queryList();
            },
            customchangePage (val) {
                this.customcurrentPage = val;
                this.queryListKer();
            },
            customChangesize (val) {
                this.custompageSize = val;

                this.queryListKer();
            },
            handleCommand (command) {
                if (command === 'exportAll') {
                    this.$func.windowCountDown(
                        '/project/main/v2/xls/powerStats.as?projectCode=' +
                            this.$store.state.projectCode +
                            '&mac=' +
                            this.keyword +
                            '&build=' +
                            this.building +
                            '&year=' +
                            new Date().getFullYear() +
                            '&month=' +
                            new Date().getMonth() +
                            '&projectName=' +
                            this.$store.state.prjName +
                            '&currentPage=0'
                    );
                } else if (command === 'exportCurrent') {
                    this.$func.windowCountDown(
                        '/project/main/v2/xls/powerStats.as?projectCode=' +
                            this.$store.state.projectCode +
                            '&mac=' +
                            this.keyword +
                            '&build=' +
                            this.building +
                            '&year=' +
                            new Date().getFullYear() +
                            '&month=' +
                            new Date().getMonth() +
                            '&projectName=' +
                            this.$store.state.prjName +
                            '&currentPage=' +
                            this.currentPage +
                            '&pageSize=' +
                            this.naturalList.length
                    );
                }
            },
            queryListKer () {
                if (
                    this.$func.getDaysBetween(this.customValue[0], this.customValue[1]) > 30
                ) {
                    this.$Message.error({
                        content: '时间间隔不能超过一个月'
                    });
                    return false;
                }
                let v = this.customValue[0];
                let i = this.customValue[1];

                let params = {
                    pageNo: this.customcurrentPage,
                    pageSize: this.custompageSize,
                    type: 'MAC',
                    params: {
                        projectCode: this.$store.state.projectCode,
                        startTime: this.$func.formatDate('yyyy-MM-dd', v),
                        endTime: this.$func.formatDate('yyyy-MM-dd', i),
                        build: this.build,
                        mac: this.keywordKer
                    }
                };
                this.$nextTick(() => {
                    queryTimeRangePowerOfProject(params).then((res) => {
                        if (res.success) {
                            let days = this.$func.getDaysBetween(v, i) + 1;
                            let preMonth =
                                new Date(v - days * 24 * 60 * 60 * 1000).getMonth() + 1 < 10
                                    ? '0' +
                                        (new Date(v - days * 24 * 60 * 60 * 1000).getMonth() + 1)
                                    : new Date(v - days * 24 * 60 * 60 * 1000).getMonth() + 1;
                            let preDay =
                                new Date(v - days * 24 * 60 * 60 * 1000).getDate() < 10
                                    ? '0' + new Date(v - days * 24 * 60 * 60 * 1000).getDate()
                                    : new Date(v - days * 24 * 60 * 60 * 1000).getDate();
                            let preStartDate =
                                new Date(v - days * 24 * 60 * 60 * 1000).getFullYear() +
                                '-' +
                                preMonth +
                                '-' +
                                preDay;
                            let endMonth =
                                new Date(v - 24 * 60 * 60 * 1000).getMonth() + 1 < 10
                                    ? '0' + (new Date(v - 24 * 60 * 60 * 1000).getMonth() + 1)
                                    : new Date(v - 24 * 60 * 60 * 1000).getMonth() + 1;
                            let endDates =
                                new Date(v - 24 * 60 * 60 * 1000).getDate() < 10
                                    ? '0' + new Date(v - 24 * 60 * 60 * 1000).getDate()
                                    : new Date(v - 24 * 60 * 60 * 1000).getDate();
                            let preEndDate =
                                new Date(v - 24 * 60 * 60 * 1000).getFullYear() +
                                '-' +
                                endMonth +
                                '-' +
                                endDates;
                            this.custColumns[2].title = preStartDate + '至' + preEndDate;
                            let startDate = this.$func.formatDate('yyyy-MM-dd', v);
                            let endDate = this.$func.formatDate('yyyy-MM-dd', i);
                            this.custColumns[3].title = startDate + '至' + endDate;
                            this.customlList = res.datas.map((item) => ({
                                ...item,
                                electricity: item.others.electricity,
                                preElectricity: item.others.preElectricity,
                                ratio: item.others.ratio
                            }));
                            this.customTotal = res.total;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    });
                });
            },
            queryList () {
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    type: 'MAC',
                    params: {
                        projectCode: this.$store.state.projectCode,
                        month: this.Datemonth ? this.Datemonth : '01',
                        build: this.building,
                        year: this.Dateyear ? this.Dateyear : new Date().getFullYear(),
                        mac: this.keyword
                    }
                };

                this.$nextTick(function () {
                    queryPower(params)
                        .then((res) => {
                            if (res.success) {
                                //
                                this.naturalList = res.datas.map((item) => ({
                                    ...item,
                                    electricity: item.others.electricity,
                                    preElectricity: item.others.preElectricity,
                                    ratio: item.others.ratio
                                }));
                                this.total = res.total;
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
                    //     .finally(() => {
                    //        // this.initGauge();
                    // });
                });
            },
            linePowerDetail (build, unit, room, mac, index) {
                this.mac = mac;
                this.powerDialog = true;
                if (build) {
                    unit = ',' + unit;
                }
                if (unit) {
                    room = ',' + room;
                }
                this.addr = '【' + build + unit + room + '】' + '的线路  电量明细';
                this.initPowerDetail();
            },
            handleCloseAddr (val) {
                if (!val) {
                    this.datePicker = 'hour';
                    this.dateType = 3;
                    this.powerHour = this.$func.formatDate('yyyy-MM-dd HH', new Date());
                    this.powerDay = this.$func.getNowFormatDate();
                    this.powerMonth = this.$func.getCurrentYearMonth();
                    this.date = this.powerHour;
                }
            },
            handleDatePicker (val) {
                if (val === 'day') {
                    this.dateType = 1;
                    // this.datePicker = 'day'
                    this.date = this.powerDay;
                    this.columns3[2].title = '上一日用电量(度)';
                } else if (val === 'month') {
                    this.dateType = 2;
                    //  this.datePicker = 'month'
                    this.date = this.powerMonth;
                    this.columns3[2].title = '上一月用电量(度)';
                } else if (val === 'hour') {
                    this.dateType = 3;
                    //   this.datePicker = 'hour'
                    this.date = this.powerHour;
                    this.columns3[2].title = '上一时用电量(度)';
                }
                this.datePicker = val;
                this.initPowerDetail();
            },
            initPowerDetail () {
                this.$nextTick(function () {
                    this.powerData = [];
                    let params = {
                        page: 1,
                        limit: 10,
                        dateType: this.dateType,
                        date: this.date
                            ? this.date
                            : this.$func.formatDate('yyyy-MM-dd HH', new Date()),
                        projectCode: this.$store.state.projectCode,
                        mac: this.mac
                    };
                    chnlPowerStatsOfBox(params)
                        .then((res) => {
                            //
                            if (res.success) {
                                this.powerData = res.data;
                            } else if (res.code === '-1') {
                            } else {
                                if (res.message) {
                                    this.$Message.error({
                                        content: res.message
                                    });
                                } else {
                                    this.$Message.error({
                                        content: '未知错误，请刷新重试'
                                    });
                                }
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                    });
                });
            },
            queryPowerList () {
                this.currentPage = this.pageNo = 1;
                this.queryList();
            },
            handlePowerDayPicker (val) {
                this.dateType = 1;
                this.date = val;
                this.initPowerDetail();
            },
            handlePowerMonthPicker (val) {
                this.dateType = 2;
                this.date = val;
                this.initPowerDetail();
            },
            handlePowerHourPicker (val) {
                this.dateType = 3;
                this.date = val;
                this.initPowerDetail();
            },
            handlePowerExport () {
                // 导出事件待完善 有projectName 完善
                this.date = this.date
                    ? this.date
                    : this.$func.formatDate('yyyy-MM-dd HH', new Date());
                this.$func.windowCountDown(
                    '/project/main/v2/xls/powerStatsDetail.as?projectCode=' +
                        this.$store.state.projectCode +
                        '&mac=' +
                        this.mac +
                        '&oqp1=' +
                        this.$store.state.projectName +
                        '&dateType=' +
                        this.dateType +
                        '&date=' +
                        this.date
                );
                // this.$Message.error('暂时不能导出');
            },
            // initGauge () {
            //     let params = {
            //         projectCode: this.$store.state.projectCode,
            //         month: this.month ? this.month : '01',
            //         build: this.building,
            //         year: this.year ? this.year : new Date().getFullYear(),
            //         mac: this.keyword
            //     };
            //      this.$nextTick(()=>{
            //        last2mPowerStats(params)
            //      })
            //  未知方法
            // },
            changesize (val) {
                this.pageSize = val;
                this.queryList();
            },
            initBuilding () {
                let that = this;
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                this.$nextTick(function () {
                    getBuildings(params)
                        .then((res) => {
                            if (res.success) {
                                that.buildings = [{ text: '全部', value: '' }].concat(res.data);
                                that.builds = [{ text: '全部', value: '' }].concat(res.data);
                                // that.year = this.years[0].value;
                                // that.month = String(
                                //     new Date().getMonth() + 1 > 9
                                //         ? new Date().getMonth() + 1
                                //         : '0' + (new Date().getMonth() + 1)
                                // );
                                this.queryList();
                                this.queryListKer();
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
                });
            },
            getDetailElec (params) {
                getUserMessageListElecDetail(params)
                    .then((res) => {
                        //
                        if (res.success) {
                            this.dataList = res.data;
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
                                content: '未知错误,请刷新重试1'
                            });
                        }
                });
            },
            getElecDetailList () {
                // let moDate =
                //     new Date().getFullYear() +
                //     '-' +
                //     new Date().getMonth() +
                //     '-' +
                //     new Date().getDate();

                let params = {
                    statsType: 3,
                    projectCode: this.$store.state.projectCode,
                    time: this.$Date().format('YYYY-MM-DD')
                };

                this.getDetailElec(params);
            },
            getlist (params) {
                this.$nextTick(function () {
                    powerConsumptionTrend(params)
                        .then((res) => {
                            if (res.success) {
                                let bardata = {
                                    power: [],
                                    legend: []
                                };
                                if (res.data.length > 12) {
                                    res.data.forEach((v, i) => {
                                        bardata.power[i] = v.afterPower;
                                        bardata.legend[i] = v.time + '日';
                                    });
                                } else {
                                    res.data.forEach((v, i) => {
                                        bardata.power[i] = v.afterPower;
                                        bardata.legend[i] = v.time + '月';
                                    });
                                }

                                this.thirdBarOptions.xAxis = bardata.legend;
                                this.thirdBarOptions.series = {
                                    name: '用电趋势',
                                    type: 'bar',
                                    barMaxWidth: '15',
                                    data: bardata.power,
                                    itemStyle: {
                                        emphasis: { barBorderRadius: 5 },
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(
                                                0,
                                                1,
                                                0,
                                                0, // 这里不同的排序会出现不同的效果   查看4 渐变规则
                                                [
                                                    { offset: 1, color: '#007EFF' }, // 红
                                                    // 可以加0.2等
                                                    { offset: 0, color: 'rgba(26, 32, 46,.2)' } // 黑
                                                ]
                                            ),
                                            barBorderRadius: 0
                                        }
                                    }
                                };
                                this.thirdBar = true;
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
                                    content: '未知错误,请刷新重试2'
                                });
                            }
                    });
                });
            },
            initBars () {
                let day = (new Date().getDate() < 10 ? '0' : '') + new Date().getDate();
                this.thirdBarOptions.series = [];
                this.thirdBarOptions.xAxis = [];
                this.month === '' ? this.month = this.$Date().format('MM') : this.month = this.month
                let moDate = new Date().getFullYear() + '-' + this.month + '-' + day;
                let params = {
                    statsType: 3,
                    time: moDate, // 表单的值和v3有所变化，后期待完善 已完善
                    projectCode: this.$store.state.projectCode
                };

                this.getlist(params);
            },
            handleTypes (val) {
                this.packetTypes = val;
                this.getGroupTrees();
            },
            // 递归遍历数组为树状结构
            getTree (tree = []) {
                let arr = [];
                if (!!tree && tree.length !== 0) {
                    tree.forEach((item) => {
                        let obj = {};
                        obj.id = item.id;
                        obj.value = item.name;
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
            getGroupTrees () {
                if (!this.packetTypes) {
                    this.$Message.error({
                        content: '请先选择分组类型'
                    });
                } else {
                    getGroupTree({ groupId: this.packetTypes }).then((res) => {
                        if (res.code === '0') {
                            this.treeList = res.data;
                            let resData = this.getTree(res.data);
                            this.packetFilterList = this.cloneTree(resData);
                            //
                        }
                    });
                }
            },
            querList () {
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    let newpacketFilter = [];
                    if (this.packetFilter.length !== 0) {
                        this.packetFilter.map((itm) => {
                            this.treeList.map((item) => {
                                if (item.name.indexOf(itm) > -1) {
                                    newpacketFilter.push(String(item.id));
                                }
                            });
                        });
                    }
                    let monthDate =
                        new Date().getMonth() + 1 < 10
                            ? `0${new Date().getMonth() + 1}`
                            : `${new Date().getMonth() + 1}`;
                    let yearsList = this.year ? this.year : new Date().getFullYear();
                    let monthList = this.month ? this.month : monthDate;
                    let yueDate =
                        yearsList +
                        '-' +
                        monthList +
                        '-' +
                        (new Date().getDate() < 10 ? '0' : '') +
                        new Date().getDate();
                    let params = {
                        statsType: this.year && !this.month ? 4 : 3,
                        nodeId: newpacketFilter ? newpacketFilter.join(',') : newpacketFilter,
                        time: yueDate,
                        projectCode: this.$store.state.projectCode
                    };

                    this.getlist(params);
                    this.getDetailElec(params);
                }
            },
            restList () {
                this.packetTypes = '';
                this.packetFilter = '';

                this.year = new Date().getFullYear();
                this.month = '';
                this.init()
            },
            getGroupTypes () {
                getGroupType({
                    projectCode: this.$store.state.projectCode // 待完善projectCode
                })
                    .then((res) => {
                        //
                        if (res.success) {
                            this.packetList = res.data;
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
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
.button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0 8px;
  margin-right: 10px;
}
.active {
  width: 10px;
  height: 10px;
  margin-top: 3px;
  margin-right: 5px;
  margin-left: 25px;
  background: #007eff;
}
.pickDate {
  display: flex;
  align-items: center;
}
</style>
