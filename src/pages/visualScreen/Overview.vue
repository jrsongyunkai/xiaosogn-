<template>
  <div id="overview">
    <Row :gutter="20" class="rw" style="margin: 0; padding: 20px ;padding-bottom:0px">
      <Col class="df">
        <Breadcrumb separator-class="el-icon-arrow-right">
          <BreadcrumbItem class="pointer" @click.native="$router.go(-1)"
            >返回</BreadcrumbItem
          >
          <BreadcrumbItem>项目概况</BreadcrumbItem>
        </Breadcrumb>
        <Form
          :inline="true"
          :model="form"
          class="demo-form-inline tr mt-20"
          @submit.native.prevent
        >
          <FormItem
            class="nodeTreeGrouping"
            v-if="foldFlag && nodeTreeData.length > 0"
          >
            分组路径:
            <span v-for="(v, f) in nodeTreeData" :key="f">{{ v.label }}</span
            ><span v-if="nodeTreeData.length > 0" @click="closeLeftGroup"
              ><Icon type="md-close"
            /></span>
          </FormItem>
          <FormItem>
            <span
              v-if="
                $store.state.toPath !== '/visualScreen' &&
                $store.state.toPath !== ''
              "
              class="mr-20 fw"
            ></span>
          </FormItem>
          <FormItem>
            <Select
              :clearable='true'
              @on-change="handleKeyword"
              v-model="form.projectName"
              placeholder="请输入项目名称"
              style="width:150px"
            >
              <Option
                v-for="item in projectNames"
                :key="item.projectCode"
                :label="item.projectName"
                :value="item.projectName"
              >
              </Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="queryOverview">查询</Button>
          </FormItem>
          <FormItem>
            <Button @click="handleReset">重置</Button>
          </FormItem>
          <FormItem>
            <Dropdown trigger="click" @on-click="handleCommand">
              <Button > 导出<Icon type="ios-arrow-down" /> </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="current">导出当前页</DropdownItem>
                <DropdownItem name="all">导出全部</DropdownItem>
                <DropdownItem name="device">导出项目电量</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <div style="padding:30px;padding-top:0px;padding-bottom:0px">
      <Table :data="overviewDatas" :columns="columns">
      <template slot-scope="{ row }" slot="name">
        <span class="pointer" @click="handleSelect(row)">{{ row.name }}</span>
      </template>

      <template slot-scope="{ row }" slot="address">
        <span class="pointer">{{ row.others.address }}</span>
      </template>

      <template slot-scope="{ row }" slot="totalBoxNum">
        <span class="pointer" @click="handleDevices(row, '100')">{{
          row.others.totalBoxNum
        }}</span>
      </template>

      <template slot-scope="{ row }" slot="online">
        <span class="pointer">{{ row.others.totalBoxOnlineNum }}</span>
      </template>

      <template slot-scope="{ row }" slot="boxOnlineRate">
        <span class="pointer">{{ row.others.boxOnlineRate }}</span>
      </template>

      <template slot-scope="{ row }" slot="totalAlarmNum">
        <span class="pointer" @click="handleAlarm(row, '')">{{
          row.others.totalAlarmNum
        }}</span>
      </template>

      <template slot-scope="{ row }" slot="alarmProcessedNum">
        <span class="pointer" @click="handleAlarm(row, '2')">{{
          row.others.alarmProcessedNum
        }}</span>
      </template>

      <template slot-scope="{ row }" slot="alarmProcessedRate">
        <span class="pointer">{{ row.others.alarmProcessedRate }}</span>
      </template>

      <template slot-scope="{ row }" slot="alarmUnprocessedNum">
        <span class="pointer" @click="handleAlarm(row, '0')">{{
          row.others.alarmUnprocessedNum
        }}</span>
      </template>

      <template slot-scope="{ row }" slot="maintainNum">
        <span class="pointer" @click="handleMore(row)">{{
          row.others.maintainNum
        }}</span>
      </template>
      <template slot-scope="{ row }" slot="thisMonthPower">
        <span class="pointer">{{
          row.others.thisMonthPower
        }}</span>
      </template>
    </Table>
    </div>

    <div class="block tc mt-10" style="padding:20px;padding-top:0px;">
      <Page
        @on-page-size-change="handleSizeChange"
        @on-change="handleCurrentChange"
        :current="currentPage"
        :page-size-opts="[20, 50, 100, 500]"
        :page-size="pageSize"
        :total="total"
      >
      </Page>
    </div>
   <Modal v-model="exportRangeFlags" title="项目电量统计表导出"  footer-hide>

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
    import {
        getLeftTreeView,
        queryProjectDetails,
        loadTree,
        saveProjectGroup,
        delProjectGroup,
        pageRsOfProject,
        pageProject4SelectOfGroup,
        saveProjectOfGroup,
        queryPageAuth
    } from '@/api/visualScreen/index';
    export default {
        data () {
            return {
                valueYear: '2022',
                valueMonth: '2022' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)),
                dateValue: true,
                monthColor: 'success',
                yearColor: 'default',
                exportRangeFlags: false,
                setupFlag: false,
                groupData: [],
                arrData: [],
                leftArrData: [],
                treeData: [],
                nodeTreeData: [],
                customData: [],
                nodeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                form: {
                    // projectName: this.$store.state.fullName
                    //     ? this.$store.state.fullName
                    //     : this.$route.params.projectName,
                    projectName: '',
                    projectCode: this.$store.state.projectCode,
                    mac: ''
                },
                groupId: '',
                loading: false,
                overviewDatas: [],
                projectNames: this.$store.state.allProjects.data,
                dialogVisible: false,
                longitude: '',
                latitude: '',
                currentPage: 1,
                firstCurrentPage: 1,
                secondCurrentPage: 1,
                pageSize: 20,
                total: 0,
                timerID: null,
                foldFlag: false,
                projectVisible: false,
                configurationVisible: false,
                flag_index: -1,
                customTotal: 0,
                treeGroupId: '',
                treeKeyWrod: '',
                configurationVal: '',
                configurationData: [],
                configurationTotal: '',
                multipleSelection: '',
                columns: [
                    {
                        title: '项目名称',
                        slot: 'name',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '建设时间',
                        key: 'createTime',
                        align: 'center'
                    },
                    {
                        title: '地点',
                        slot: 'address',
                        align: 'center'
                    },
                    {
                        title: '设备总数',
                        slot: 'totalBoxNum',
                        align: 'center'
                    },
                    {
                        title: '在线设备数',
                        slot: 'online',
                        align: 'center'
                    },
                    {
                        title: '在线率',
                        slot: 'boxOnlineRate',
                        align: 'center'
                    },
                    {
                        title: '本月报警数',
                        slot: 'totalAlarmNum',
                        align: 'center'
                    },
                    {
                        title: '已处理数',
                        slot: 'alarmProcessedNum',
                        align: 'center'
                    },

                    {
                        title: '已处理率',
                        slot: 'alarmProcessedRate',
                        align: 'center'
                    },
                    {
                        title: '未处理率',
                        slot: 'totalAlarmNum',
                        align: 'center'
                    },
                    {
                        title: '维保记录',
                        slot: 'maintainNum',
                        align: 'center'
                    },
                    {
                        title: '本月电量',
                        slot: 'thisMonthPower',
                        align: 'center'
                    }
                ]
            };
        },
        mounted () {
            this.init();
            this.queryTreePageAuth();
            this.handleGetLeftTree();
        },
        methods: {
            handleGetLeftTree () {
                getLeftTreeView()
                    .then((res) => {
                        if (res.success) {
                            this.leftArrData = res.data;
                            this.treeData = this.arraytoTree(res.data);
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
            },
            handleCommand (command) {
                if (command === 'current') {
                    this.$func.windowCountDown('/project/main/v3/xls/exportProjectDetails.as?projectCode=' + this.form.projectCode + '&provinceId=' + (this.$store.state.provinceId ? this.$store.state.provinceId : '') + '&cityId=' + (this.$store.state.cityId ? this.$store.state.cityId : '') + '&countyId=' + (this.$store.state.countyId ? this.$store.state.countyId : '') + '&mac=' + this.form.mac + '&pageSize=' + this.pageSize + '&pageNo=' + this.currentPage + '&exportType=exportCurrent')
                } else if (command === 'device') {
                    this.exportRangeFlags = true
                } else {
                    this.$func.windowCountDown('/project/main/v3/xls/exportProjectDetails.as?projectCode=' + this.form.projectCode + '&provinceId=' + (this.$store.state.provinceId ? this.$store.state.provinceId : '') + '&cityId=' + (this.$store.state.cityId ? this.$store.state.cityId : '') + '&countyId=' + (this.$store.state.countyId ? this.$store.state.countyId : '') + '&mac=' + this.form.mac + '&pageSize=' + this.pageSize + '&pageNo=' + this.currentPage + '&exportType=')
                }
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
                const valueYears = this.$Date(this.valueYear).format('YYYY');
                const valueMonths = this.$Date(this.valueMonth).format('YYYYMM');
                if (this.dateValue) {
                    this.$func.windowCountDown(
                        '/project/main/v5/xls/userPrjPowerStats.as?startYm=' +
                            valueMonths +
                            '&endYm=' +
                            valueMonths
                    )
                } else if (!this.dateValue) {
                    this.$func.windowCountDown(
                        '/project/main/v5/xls/userPrjPowerStats.as?startYm=' +
                            valueYears + '01' +
                            '&endYm=' +
                            valueYears + '12'
                    )
                }
            },
            arraytoTree (arr) {
                let dataArray = [];
                arr.forEach((item) => {
                    let parentId = item.parentId;
                    if (parentId === 0) {
                        let objTemp = {
                            floorNo: item.floorNo,
                            id: item.id,
                            label: item.name,
                            parentId: parentId,
                            sortNo: item.sortNo
                        };
                        dataArray.push(objTemp);
                    }
                });
                return this.childrenTree(arr, dataArray);
            },
            childrenTree (arr, dataArray) {
                if (dataArray !== []) {
                    for (let j = 0; j < dataArray.length; j++) {
                        let dataArrayItem = dataArray[j];
                        let childrenArr = [];
                        let Id = dataArrayItem.id;
                        for (let i = 0; i < arr.length; i++) {
                            let Arr = arr[i];
                            if (Arr.parentId === Id) {
                                let childTemp = {
                                    floorNo: Arr.floorNo,
                                    id: Arr.id,
                                    label: Arr.name,
                                    parentId: Arr.parentId,
                                    sortNo: Arr.sortNo
                                };
                                childrenArr.push(childTemp);
                            }
                        }
                        dataArrayItem.children = childrenArr;
                        if (childrenArr.length > 0) {
                            this.childrenTree(arr, childrenArr);
                        }
                    }
                } else {
                    dataArray = arr;
                }
                return dataArray;
            },
            init () {
                this.queryOverview();
            },
            queryTreePageAuth () {
                let params = {
                    resKeys: 'AUTH_PROJECT_USE',
                    operKeys: 'PROJECT_GROUP'
                };
                queryPageAuth(params)
                    .then((res) => {
                        if (res.success) {
                            this.setupFlag = res.data[0].result;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
            },
            handleNodeClick (data, node) {
                this.groupId = data.id;
                let recurArr = [data];
                this.nodeTreeData = [];
                this.nodeTreeData = this.handleRecursion(
                    data,
                    this.leftArrData,
                    recurArr
                );
                if (this.nodeTreeData.length > 1 && this.nodeTreeData.length <= 3) {
                    this.nodeTreeData.forEach((item) => {
                        if (item.id !== data.id) {
                            if (item.label && item.label.indexOf('>') === -1) {
                                item.label = item.label + ' > ';
                            } else if (item.name.indexOf('>') === -1) {
                                item.label = item.name + ' > ';
                            }
                        }
                    });
                    this.nodeTreeData.reverse();
                } else if (this.nodeTreeData.length > 3) {
                    this.nodeTreeData = [{ label: '... > ' + data.label }];
                } else {
                    this.nodeTreeData = [{ label: data.label }];
                }
                this.queryOverview();
            },
            closeLeftGroup () {
                this.nodeTreeData = [];
                this.groupId = '';
                this.queryOverview();
            },
            closeNodeTree () {
                this.nodeData = this.groupData = [];
                this.treeGroupId = this.treeKeyWrod = '';
                this.flag_index = -1;
                this.handleSearch();
            },
            handleCloseProject () {
                this.handleGetLeftTree();
                if (
                    this.projectVisible === false &&
                    this.configurationVisible === false
                ) {
                    this.treeKeyWrod = this.treeGroupId = '';
                    this.nodeData = [];
                    this.flag_index = -1;
                }
            },
            handleNodeCustom (data, node) {
                let recurArr = [data];
                this.nodeData = [];
                this.nodeData = this.handleRecursion(data, this.arrData, recurArr);
                if (this.nodeData.length > 1 && this.nodeData.length <= 3) {
                    this.nodeData.forEach((item) => {
                        if (item.id !== data.id) {
                            if (item.label && item.label.indexOf('>') === -1) {
                                item.label = item.label + ' > ';
                            } else if (item.name.indexOf('>') === -1) {
                                item.label = item.name + ' > ';
                            }
                        }
                    });
                    this.nodeData.reverse();
                } else if (this.nodeData.length > 3) {
                    this.nodeData = [{ label: '... > ' + data.label }];
                } else {
                    this.nodeData = [{ label: data.label }];
                }
                this.flag_index = this.treeGroupId = data.id;
                this.handleSearch();
            },
            handleRecursion (data, arr, recurArr) {
                if (data.parentId !== 0) {
                    arr.filter((item) => {
                        if (item.id === data.parentId) return recurArr.push(item);
                    });
                    this.handleRecursion(recurArr[recurArr.length - 1], arr, recurArr);
                } else {
                    recurArr = data;
                }
                return recurArr;
            },
            queryOverview () {
                this.loading = true;
                let params = {
                    projectName: this.form.projectName,
                    provinceId: this.$store.state.provinceId,
                    cityId: this.$store.state.cityId,
                    countyId: this.$store.state.countyId,
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    groupId: this.groupId
                };
                queryProjectDetails(params)
                    .then((res) => {
                        if (res.success) {
                            this.overviewDatas = res.datas;
                            this.total = res.total;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
            },
            handleDevices (obj, state) {
                this.$router.push({
                    name: 'deviceList',
                    params: {
                        projectCode: obj.code,
                        status: state
                    }
                });
            },
            handleAlarm (obj, state) {
                this.$router.push({
                    name: 'Alarms',
                    params: {
                        projectCode: obj.code,
                        typeNumber: '-100',
                        status: state
                    }
                });
            },
            handleSelect (obj) {
                var path = '/console/project'
                let objs = {
                    projectCode: obj.code,
                    fullName: obj.name
                }
                this.$func.switchToProject(objs, path)
            },
            handleMap (obj) {
                this.longitude = obj.longitude;
                this.latitude = obj.latitude;
                this.dialogVisible = true;
                this.renderMap();
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.queryOverview();
            },
            handleSizeChange (val) {
                this.currentPage = 1;
                this.pageSize = val;
                this.queryOverview();
            },
            handleMore (obj) {
                store.commit('mac', '')
                this.$router.push({
                    name: 'MaintenanceRecords',
                    params: {
                        projectCode: obj.code
                    }

                });
            },
            handleKeyword (val) {
                if (val) {
                    this.projectNames.map((item) => {
                        if (item.projectName === val) {
                            this.form.projectCode = item.projectCode;
                        }
                    });
                } else {
                    this.form.projectCode = '';
                }
            },
            handleLoadTree () {
                loadTree()
                    .then((res) => {
                        if (res.success) {
                            this.customData = this.arraytoTree(res.data);
                            this.arrData = res.data;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
            },
            handleConfigure () {
                if (!this.setupFlag) return false;
                this.handleLoadTree();
                this.handleSelectOfGroup();
                this.projectVisible = true;
            },
            handleCloseConfiguration () {
                this.handleLoadTree();
                this.handleSearch();
                this.configurationVisible = false;
                this.projectVisible = true;
            },
            handleSelectOfGroup (params) {
                pageRsOfProject(params)
                    .then((res) => {
                        if (res.success) {
                            this.groupData = res.datas;
                            this.customTotal = res.total;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
            },
            handleSearch () {
                let params = {
                    pageNo: 1,
                    params: {
                        groupId: this.treeGroupId,
                        keyword: this.treeKeyWrod
                    }
                };
                this.firstCurrentPage = 1;
                this.handleSelectOfGroup(params);
            },
            handleConfigurationSearch () {
                let params = {
                    pageNo: 1,
                    params: {
                        groupId: this.treeGroupId,
                        keyword: this.configurationVal
                    }
                };
                this.secondCurrentPage = 1;
                this.handlePageProject4SelectOfGroup(params);
            },
            handleConfiguration () {
                this.projectVisible = false;
                this.handlePageProject4SelectOfGroup({
                    params: { groupId: this.treeGroupId }
                });
                this.configurationVal = '';
                this.configurationVisible = true;
            },
            handlePageProject4SelectOfGroup (parmas) {
                pageProject4SelectOfGroup(parmas)
                    .then((res) => {
                        if (res.success) {
                            this.configurationData = res.datas;
                            this.configurationTotal = res.total;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
            },
            handleCustomPage (val) {
                let params = {
                    pageNo: val,
                    params: {
                        groupId: this.treeGroupId,
                        keyword: this.treeKeyWrod
                    }
                };
                this.handleSelectOfGroup(params);
            },
            handleConfigurationPage (val) {
                let params = {
                    pageNo: val,
                    params: {
                        groupId: this.treeGroupId,
                        keyword: this.configurationVal
                    }
                };
                this.handlePageProject4SelectOfGroup(params);
            },
            append (num, data) {
                let arr = [];
                let params = {};
                if (num === '2') {
                    this.arrData.filter((item) => {
                        if (item.parentId === data.id) return arr.push(item);
                    });
                    params = {
                        floorNo: data.floorNo + 1,
                        parentId: data.id,
                        name: `new group${arr.length + 1}`,
                        sortNo: arr.length + 1
                    };
                } else {
                    this.arrData.filter((item) => {
                        if (item.parentId === 0) return arr.push(item);
                    });
                    params = {
                        floorNo: 2,
                        parentId: 0,
                        name: `new group${arr.length + 1}`,
                        sortNo: arr.length + 1
                    };
                }
                saveProjectGroup(params)
                    .then((res) => {
                        this.$Message({
                            message:
                                res.code === '0'
                                    ? '添加' + '成功'
                                    : res.message,
                            type: res.code === '0' ? 'success' : 'error'
                        });
                        this.handleLoadTree();
                    })
            },
            deletes (data) {
                delProjectGroup({ groupId: data.id })
                    .then((res) => {
                        this.$Message({
                            message: res.message,
                            type: res.code === '0' ? 'success' : 'error'
                        });
                        this.handleLoadTree();
                    })
            },
            handleReset () {
                this.form.projectName = ''
            },
            handleConfigurationSelect (val) {
                this.multipleSelection = val;
            },
            handleOperation (val) {
                let code = [];
                this.multipleSelection.filter((item) => {
                    code.push(item.code);
                });
                let params = {
                    projectCodes: code.toString(),
                    groupId: this.treeGroupId,
                    oper: val
                };
                saveProjectOfGroup(params)
                    .then((res) => {
                        this.$Message({
                            message: res.message,
                            type: res.code === '0' ? 'success' : 'error'
                        });
                    })
            },
            handleRemove (row) {
                let params = {
                    projectCodes: row.prjCode,
                    groupId: row.id,
                    oper: 'del'
                };
                saveProjectOfGroup(params)
                    .then((res) => {
                        this.$Message({
                            message: res.message,
                            type: res.code === '0' ? 'success' : 'error'
                        });
                        this.handleSearch();
                    })
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
            }
        },
        destroyed () {
            clearTimeout(this.timerID);
        },
        watch: {
            '$store.state.location': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.queryOverview();
                    }
                },
                deep: true
            }
        }
    };
</script>
<style lang="less" scoped>
.df {
  width: 100%;
}
/deep/.ivu-select .ivu-select-dropdown{
  &::-webkit-scrollbar{
    display: none;
  }
  .ivu-select-item{
    text-align: left;
  }
}
</style>
