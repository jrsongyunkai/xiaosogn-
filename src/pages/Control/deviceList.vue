<template>
  <div>
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <Col style="width: 100%">
        <Breadcrumb separator-class="el-icon-arrow-right">
          <BreadcrumbItem class="pointer" @click.native="$router.go(-1)"
            >返回</BreadcrumbItem
          >
          <BreadcrumbItem>设备列表</BreadcrumbItem>
        </Breadcrumb>
        <Form inline :model="formInline" class="demo-form-inline tr mt-20">
          <FormItem>
            <Select
              v-model="formInline.projectCode"
              :clearable="true"
              filterable
              placeholder="请输入项目名称"
            >
              <Option
                v-for="item in projectNames"
                :key="item.projectCode"
                :label="item.projectName"
                :value="item.projectCode"
              ></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input
              v-model="formInline.mac"
              :clearable="true"
              placeholder="请输入设备号"
              @on-keyup.enter.native="onSubmit"
            />
          </FormItem>
          <FormItem>
            <Input
              v-model="formInline.aliasName"
              :clearable="true"
              placeholder="请输入设备别名"
              @on-keyup.enter.native="onSubmit"
            />
          </FormItem>
          <FormItem>
            <Input
              v-model="formInline.addr"
              placeholder="输入楼栋/单元/房号"
              :clearable="true"
              @on-keyup.enter.native="onSubmit"
            />
          </FormItem>
          <FormItem>
            <Select
              v-model="formInline.status"
              multiple
              :clearable="true"
              placeholder="设备状态"
            >
              <Option
                v-for="item in stats"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="onSubmit">查询</Button>
          </FormItem>
          <FormItem>
            <Button @click="onEliminate">重置</Button>
          </FormItem>
          <FormItem>
            <Dropdown trigger="click" @on-click="handleCommand">
              <Button>
                导出<i class="el-icon-arrow-down el-icon--right"></i>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="current">导出当前页</DropdownItem>
                <DropdownItem name="all">导出全部</DropdownItem>
                 <DropdownItem name="device">导出设备电量</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </FormItem>
          <FormItem>
            <Button type="text" @click="toChannelList">线路列表</Button>
          </FormItem>
        </Form>
        <Table :data="devicesData" :columns="columns">
          <template slot-scope="{ row }" slot="mac">
            <div @click="handleSwitch(row)" class="pointer">{{ row.mac }}</div>
          </template>
          <template slot-scope="{ row }" slot="macname">
            <div>{{ row.name }}</div>
          </template>
          <template slot-scope="{ row }" slot="projectName">
            <div @click="handleSwitch(row, 'project')" class="pointer">
              {{ row.projectName }}
            </div>
          </template>

          <template slot-scope="{ row }" slot="status">
            <span v-show="row.stats === -1" class="c-info">脱线</span>
            <span v-show="row.stats === 0" class="c-danger">离线</span>
            <span v-show="row.stats === 1" class="c-success">在线</span>
          </template>
          <template slot-scope="{ row }" slot="inspection">
            <Button type="text" class="fs-14" @click="handleInspection(row)"
              >进行巡检</Button
            >
          </template>
          recording
          <template slot-scope="{ row }" slot="recording">
            <Button type="text" class="fs-14" @click="handleViewInspection(row)"
              >查看</Button
            >
          </template>
        </Table>
        <Page
          @on-page-size-change="handleSizeChange"
          @on-change="handleCurrentChange"
          :page-size-opts="[20, 50, 100, 500]"
          :current="currentPage"
          :page-size="pageSize"
          :total="devicesTotal"
        ></Page>
      </Col>
    </Row>
    <Modal
      id="Details"
      :model="false"
      title="设备详情"
      :lock-scroll="false"
      :value="detailsFlag"
      :before-close="handleDetailsClose"
      width="70%"
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
          :clearable="false"
          :format="
            detailsObj.equipmentType === 6 || detailsObj.equipmentType === 7
              ? 'yyyy-MM'
              : 'yyyy-MM-dd'
          "
          placeholder="选择日期"
        >
        </DatePicker>
      </div>
      <div style="height: 100%">
        <Details v-if="detailsFlag" :param="detailsObj" />
      </div>
      <div slot="footer"></div>
    </Modal>

    <Modal
      :title="titleFlag ? '设备巡检' : '设备巡检记录'"
      :mask="false"
      width="580px"
      style="background-color: #68313f"
      v-model="inspectionFlag"
      @on-ok="submitInformation"
      @on-cancel="handleInspectionClose"
    >
      <div style="margin: 10px 20px">
        <InspectionDevice
          ref="inspection"
          v-if="inspectionFlag"
          @handleInspectionClose="handleInspectionClose"
          :inspectionData="inspectionData"
          :infoData="infoData"
          :titleFlag="titleFlag"
        ></InspectionDevice>
      </div>
    </Modal>
     <Modal v-model="exportRangeFlags" title="设备电量统计表导出"  footer-hide>

     <Row> <Col :span="3" >
          <Button :type="monthColor"  shape="circle" @click="getMonthValue" >月</Button>
      </Col>
      <Col :span="3" >
      <Button :type="yearColor" shape="circle"  @click="getYearValue">年</Button>
      </Col>
       <Col :span="8" v-if="!dateValue">
            <DatePicker type="year" format="yyyy" v-model="valueYear" placeholder="请选择年"></DatePicker>
        </Col>
         <Col :span="8" v-if="dateValue">
            <DatePicker type="month" format="yyyy-MM" v-model="valueMonth" placeholder="请选择月" ></DatePicker>
        </Col>
        <Col :span="5" style="margin-left:10px"> <Button type="primary"  @click="handleExportRange" >导出</Button></Col>

        </Row>

    </Modal>
  </div>
</template>

<script>
    import store from '@/store';
    import InspectionDevice from '../Common/InspectionDevice.vue';
    import { queryProjectMacDetails } from '@/api/public';
    import Details from './Details.vue';
    import { modifyMacRate } from '../../api/control/index.js';
    export default {
        components: {
            InspectionDevice,
            Details
        },
        props: {
            queryType: {
                type: String
            }
        },
        data () {
            return {
                valueYear: '2022',
                valueMonth: '2022' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)),
                dateValue: true,
                monthColor: 'success',
                yearColor: 'default',
                exportRangeFlags: false,
                detailsFlag: false,
                detailsObj: {
                    others: {
                        version: '',
                        online: ''
                    }
                },
                detailsValue: '',
                columns: [
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
                        title: '项目名称',
                        slot: 'projectName',
                        align: 'center'
                    },
                    {
                        title: '位置',
                        key: 'projectAddress',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'status',
                        align: 'center'
                    },
                    {
                        title: '离线时间',
                        key: 'offlineTime',
                        align: 'center'
                    },
                    {
                        title: '联系人',
                        key: 'linkman',
                        align: 'center'
                    },
                    {
                        title: '联系电话',
                        key: 'linktel',
                        align: 'center'
                    },
                    {
                        title: '巡检',
                        slot: 'inspection',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '巡检记录',
                        slot: 'recording',
                        width: 120,
                        align: 'center'
                    }
                ],
                stats: [
                    {
                        value: '0',
                        label: '离线'
                    },
                    {
                        value: '1',
                        label: '在线'
                    },
                    {
                        value: '-1',
                        label: '脱线'
                    }
                ],
                projectNames: [],
                devicesData: [],
                devicesTotal: 0,
                currentPage: 1,
                pageSize: 20,
                formInline: {
                    projectCode: this.$route.params.projectCode
                        ? this.$route.params.projectCode
                        : this.$store.state.projectCode,
                    status:
                        this.$route.params.status === '100' ? '' : this.$route.params.status,
                    mac: '',
                    aliasName: '',
                    addr: ''
                },
                loading: false,
                inspectionFlag: false,
                titleFlag: false,
                inspectionData: {
                    projectCode: '',
                    macs: ''
                },
                infoData: {
                    type: '',
                    id: ''
                },
                deviceParams: ''
            };
        },
        created () {
            // this.formInline = {
            //     projectCode: this.$route.params.projectCode
            //         ? this.$route.params.projectCode
            //         : this.$store.state.projectCode,
            //     status:
            //         this.$route.params.status === '100' ? '' : this.$route.params.status,
            //     mac: '',
            //     aliasName: '',
            //     addr: ''
            // }

            if (this.$route.query.projectCode) {
                this.formInline.status = this.$route.query.status
            }
            // {   value: '0',
            //    label: '离线'
            // },
            // {
            //    value: '1',
            //    label: '在线'
            // },
            // {
            //    value: '-1',
            //    label: '脱线'
            // }
            //
            this.init();
        },
        mounted () {},
        methods: {
            init () {
                //
                this.queryDevices();
            },
            toChannelClear () {
                this.formInline.projectCode = '';
                this.formInline.aliasName = '';
                this.formInline.mac = '';
                this.formInline.aliasName = '';
                this.formInline.addr = '';
                this.formInline.status = '';
            },
            queryDevices () {
                if (this.$route.params.status && this.$route.params.status !== '100') {
                    this.formInline.status = this.$route.params.status.split(',');
                    this.$route.params.status = '';
                }
                this.devicesData = [];
                //  this.loading = true;
                let params = {
                    projectCode: this.formInline.projectCode,
                    mac: this.formInline.mac,
                    macName: this.formInline.aliasName,
                    address: this.formInline.addr,
                    provinceId: this.$store.state.provinceId,
                    cityId: this.$store.state.cityId,
                    countyId: this.$store.state.countyId,
                    onlineStats: this.formInline.status
                        ? this.formInline.status.toString()
                        : this.$store.state.status,
                    pageNo: this.currentPage,
                    pageSize: this.pageSize
                };
                queryProjectMacDetails(params)
                    .then((res) => {
                        if (res.success) {
                            this.devicesData = res.datas;
                            //
                            this.devicesTotal = res.total;
                            this.projectNames = this.$store.state.allProjects.data;
                            this.deviceFlag = true;
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
                                content: '未知错误,请刷新重试'
                            });
                        }
                    })
                    .finally(() => {});
            },
            onSubmit () {
                this.currentPage = 1;
                this.queryDevices();
            },
            handleSizeChange (val) {
                this.currentPage = 1;
                this.pageSize = val;
                this.queryDevices();
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.queryDevices();
            },
            getMonthValue () {
                this.dateValue = true
                this.monthColor = 'success'
                this.yearColor = 'default'
            },
            getYearValue () {
                this.dateValue = false
                this.monthColor = 'default'
                this.yearColor = 'success'
            },
            handleExportRange () {
                // 这是设备列表页，勿搞混
                const valueYears = this.$Date(this.valueYear).format('YYYY');
                const valueMonths = this.$Date(this.valueMonth).format('YYYYMM');
                console.log(valueYears, valueMonths);
                if (this.dateValue) {
                    this.$func.windowCountDown(
                        '/project/main/v5/xls/userBoxPowerStats.as?startYm=' +
                            valueMonths +
                            '&endYm=' +
                            valueMonths
                    )
                } else if (!this.dateValue) {
                    this.$func.windowCountDown(
                        '/project/main/v5/xls/userBoxPowerStats.as?startYm=' +
                            valueYears + '01' +
                            '&endYm=' +
                            valueYears + '12'
                    )
                }
            },
            // 导出功能后续需改动，有bug
            handleCommand (command) {
                if (command === 'device') {
                    this.exportRangeFlags = true
                } else {
                    this.$func.windowCountDown(
                        this.$func.ctxPaths() + '/project/main/v3/xls/exportProjectMacDetails.as?projectCode=' +
                            (this.$route.params.projectCode
                                ? this.$route.params.projectCode
                            : this.$store.state.projectCode) +
                            '&provinceId=' +
                            (this.$store.state.provinceId ? this.$store.state.provinceId : '') +
                            '&cityId=' +
                            (this.$store.state.cityId ? this.$store.state.cityId : '') +
                            '&countyId=' +
                            (this.$store.state.countyId ? this.$store.state.countyId : '') +
                            '&mac=' +
                            this.formInline.mac +
                            '&address=' +
                            this.formInline.addr +
                            '&macName=' +
                            this.formInline.aliasName +
                            '&pageSize=' +
                            this.pageSize +
                            '&pageNo=' +
                            this.currentPage +
                            '&onlineStats=' +
                            this.formInline.status +
                            '&exportType=' +
                            (command === 'current' ? 'exportCurrent' : '')
                    );
                }
                //
                // http://localhost:8080/project/main/v3/xls/exportProjectMacDetails.as?projectCode=&provinceId=&cityId=&countyId=&mac=&address=&macName=&pageSize=20&pageNo=1&onlineStats=undefined&exportType=exportCurrent
                // http://localhost:8081/project/main/v3/xls/exportProjectMacDetails.as?projectCode=&provinceId=&cityId=&countyId=&mac=&address=&macName=&pageSize=20&pageNo=1&onlineStats=&exportType=
            },
            handleSwitch (row, type) {
                var path = '/console/device'
                if (type !== 'project') {
                    store.commit('equipmentType', row.equipmentType)
                    store.commit('overviewMac', row.mac)
                } else {
                    store.commit('equipmentType', 1)
                    store.commit('overviewMac', '')
                }
                this.$func.switchToProject(row, path)
            },
            handleModifyMacRate (mac, flag) {
                if (!mac) return false;
                modifyMacRate({
                    fastMac: flag === true ? mac : '',
                    slowMac: flag === true ? '' : mac
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
            handleDateChange (val) {
                this.value = val;
                store.commit('historyDate', val);
            },
            toChannelList () {
                this.$router.push({
                    name: 'ChannelList',
                    query: {
                        mac: this.formInline.mac,
                        status: this.formInline.status,
                        projectCode: this.formInline.projectCode
                    }
                });
            },
            handleInspection (row) {
                this.titleFlag = this.inspectionFlag = true;
                this.inspectionData = {
                    projectCode: row.projectCode,
                    macs: row.mac
                };
                this.infoData = {
                    type: 1,
                    id: row.id
                };
            },
            handleViewInspection (row) {
                this.titleFlag = false;
                this.inspectionFlag = true;
                this.inspectionData = {
                    projectCode: row.projectCode,
                    macs: row.mac
                };
            },
            submitInformation () {
                // 未解决 解决
                //
                this.$refs.inspection.submitForm();
            },
            handleInspectionClose () {
                this.inspectionFlag = false;
            },
            onEliminate () {
                this.formInline.projectCode = '';
                this.formInline.mac = '';
                this.formInline.aliasName = '';
                this.formInline.addr = '';
                this.formInline.status = '';
                this.currentPage = 1
                this.queryDevices()
            }
        },
        watch: {
            '$store.state.location': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.queryDevices();
                    }
                },
                deep: true
            }
        }
    };
</script>

<style lang="less" scoped>
/deep/.ivu-select-item {
  text-align: left;
}
/deep/.ivu-table-tip {
  overflow: auto;
}
</style>
