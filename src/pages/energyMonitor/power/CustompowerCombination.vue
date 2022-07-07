<template>
  <div>
    <Row>
      <Col
        span="24"
        style="background-color: #1a202e; padding-top: 20px; padding-left: 20px"
      >
        <Form inline :model="formInline" style="display: flex">
          <Col>
            <FormItem style="display: flex">
              <Select
                transfer
                v-model="formInline.year"
                placeholder="年份"
                :clearable="true"
                style="width: 200px"
              >
                <Option
                  z-index="5"
                  v-for="item in years"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col >
            <FormItem  style="display: flex">
              <Select
                transfer
                :clearable="true"
                v-model="formInline.month"
                placeholder="月份"
                style="width: 200px"
              >
                <Option
                  z-index="5"
                  v-for="item in months"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem>
              <Button type="primary" @click="queryPowerList">查询</Button>
            </FormItem>
             <FormItem>
              <Button  @click="handleReset">重置</Button>
            </FormItem>
            <FormItem>
              <Dropdown trigger="click" @on-click="handleCommand">
                <Button  class="export" >
                   <Icon custom="icon-v5 icon-v5-daochu" />
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem name="current">导出当前页</DropdownItem>
                  <DropdownItem name="all">导出全部</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormItem>

          </Col>
        </Form>
      </Col>
    </Row>
    <Row style="padding: 10px; background-color: #1a202e; margin-top: 10px">
      <Col :span="23"> <h4 style="margin-left:10px">自定义分组列表</h4> </Col>
      <Col :span="1">
        <Button type="primary" style="margin-left: -10px" @click="handleAddEdit"
          >新增</Button
        ></Col
      >
    </Row>
    <Row style="padding: 5px 20px; background-color: #1a202e">
      <Table
      style="width:100%"
      ref="currentRowTable"
      :columns="custEleColumns"
      :data="customElelList"
    >
      <template slot-scope="{ row }" slot="name">
        <span @click="handleViewGroup(row.name, row.id)">{{ row.name }}</span>
      </template>
      <template slot-scope="{ row }" slot="action">
        <span style="display: flex">
          <Button style="color:#007EFF" type="text" @click="handleViewGroup(row.name, row.id)"
            >线路明细</Button
          >
          <Button style="color:#007EFF" type="text" @click="handleAddEdit(row)">编辑</Button>
          <Button style="color:#E03C3A" type="text" @click="handleDelGroup(row.id)"
            >移除</Button
          >
        </span>
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
    <Modal
      :title="groupName"
      width="40%"
      v-model="groupDialog"
      :mask="false"
      :footer-hide="true"
      @on-visible-change="handleCloseAddr"
    >
      <Row class="pickDate">
        <Col>
          <Button type="primary"  @click="handleSelectDevice">选择设备</Button>
        </Col>
        <Col style="display:flex">
           <div style="margin:0 10px">
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
              :editable="false"
              value-format="yyyy-MM-dd HH"
              format="yyyy-MM-dd HH"
              @on-change="handlePowerHourPicker"
              :clearable="false"
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
        <Tooltip content="导出" placement="top">
           <Button type="primary" ghost  @click="handlePowerExport">
                  <i class="icon-v5 icon-v5-daochu1"></i>
                </Button>
        </Tooltip>
        </Col>
      </Row>
      <Table :columns="columns4" :data="groupData" style="margin-top:20px">
         <template slot-scope="{ row}" slot="macname">

            <span >{{row.name}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="operating">
          <Button type="text" @click="handleDelGroupLine(row.id, index)"
            ><span style="color: #ff5b59">移除</span></Button
          >
        </template>
      </Table>
    </Modal>
    <Modal :title="formTitle" v-model="dialogVisible">
      <Form :model="groupsForm" :label-width="80">
        <FormItem style="display: flex" label="名称">
          <Input v-model="groupsForm.name" placeholder="请输入名称" />
        </FormItem>
        <FormItem style="display: flex" label="描述">
          <Input v-model="groupsForm.remark" autocomplete="off" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          v-show="formTitle === '编辑分组'"
          @click="handleDetails"
          >详情</Button
        >
        <Button type="primary" @click="handleSceneCancel">取消</Button>
        <Button type="primary" @click="handleSceneSave">确定</Button>
      </div>
    </Modal>
    <Modal
      title="添加设备线路"
      v-model="addDeviceVisible"
      footer-hide
      :width="1200"
      :mask="false"
      @on-visible-change="handleClose"
    >

        <Form
          :model="ruleForm"
          ref="ruleForm"
          class="rule-form"
          inline
          @submit.native.prevent
        >
          <FormItem>
            <Col  class="left-padding-right">
              <Input v-model="ruleForm.mac" placeholder="设备号"></Input>
            </Col>
          </FormItem>
          <FormItem>
             <Col >
              <Button type="primary" @click="handleQuery">查询</Button>
            </Col>
            </FormItem>
          <FormItem>
            <Col >
              <Button type="primary" @click="handleQuery">保存多选</Button>
            </Col>
          </FormItem>
        </Form>

        <Table :data="macLineData" :columns="columnTable" @on-selection-change="chiose">
          <template slot-scope="{ row }" slot="deviceNo">
            <div>{{ row.mac }}</div>
            <div>{{ row.name }}</div>
          </template>
          <template slot-scope="{ row }" slot="state">
            <span v-if="row.others.online === -1" style="color:#909399">脱线</span>
            <span v-else-if="row.others.online === 0" style="color:#f56c6c">离线 </span>
            <span v-else style="color:#21f27f">在线</span>
          </template>
          <template slot-scope="{ row }" slot="operating">
            <Button
              type="text"
              style="color: #409eff"
              @click="handleLine(row.mac)"
              >保存选中</Button
            >
          </template>
        </Table>
        <Page
            :current="currentLinePage"
            @on-change="changePages"
            :total="lineTotal"
            show-elevator
          />

    </Modal>
    <Modal
      title="线路列表"
      v-model="lineListVisible"
      footer-hide
      @on-visible-change="checkedClose"
    >
    <Row>
      <CheckboxGroup
        v-model="checkedAddr"
        @on-change="handleCheckedCitiesChange"
      >
        <Checkbox
          v-for="(v, f) in addrData"
          :ref="`disable-${v.title}`"
          :label="v.addr"
          :key="f"
        >
          {{ v.title }}
          <span v-if="v.gatherAddr === '-1'" class="c-warning">(D)</span>
        </Checkbox>
      </CheckboxGroup></Row>
      <Row>
        <Col :span="17"></Col>
        <Col>
          <Button
            style="float: right"
            class="mr-20"
            @click="lineListVisible = false"
            >返回</Button
          >
        </Col>
        <Col>
          <Button
          style="margin-left:10px"
            :disabled="checkedAddr.length === 0"
            type="primary"
            @click="handleAddrSave"
            >保存</Button
          >
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
    import {
        queryGroup,
        chnlDetails,
        delDetail,
        pageBoxsSelect,
        queryChnlSelect,
        saveDetail,
        delGroup,
        addrEditGroup
    } from '@/api/public';
    export default {
        name: 'Custompower',
        data () {
            return {
                columnTable: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    { title: '设备号', slot: 'deviceNo' },
                    { title: '位置', key: 'location' },
                    { title: '状态', slot: 'state' },
                    { title: '操作', slot: 'operating', align: 'center' }
                ],
                formTitle: '新增分组',
                groupsForm: {
                    name: '',
                    remark: '',
                    id: ''
                },
                name: '',
                dialogVisible: false,
                columns4: [
                    { title: '设备号', key: 'mac' },
                    { title: '设备别名', slot: 'macname' },
                    { title: '线路', key: 'addrTitles' },

                    { title: '电量(度)', key: 'power' },
                    { title: '操作', slot: 'operating' }
                ],
                groupId: '',
                groupData: [],
                groupName: '',
                groupDialog: false,
                powerDay: this.$func.getNowFormatDate(),
                powerHour: this.$func.formatDate('yyyy-MM-dd HH', new Date()),
                powerMonth: this.$func.getCurrentYearMonth(),
                dateType: 3,
                date: '',
                datePicker: 'hour',
                custEleColumns: [
                    { title: '分组名', slot: 'name' },
                    { title: '描述', key: 'remark' },
                    { title: '统计电量(度)', key: 'statsPower' },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 220,
                        align: 'center'
                    }
                ],
                customElelList: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                formInline: {
                    year: '',
                    month: ''
                },
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
                years: [
                    { value: new Date().getFullYear() },
                    { value: new Date().getFullYear() - 1 },
                    { value: new Date().getFullYear() - 2 }
                ],
                ruleForm: {
                    mac: ''
                },
                addDeviceVisible: false,
                addrData: [],
                addrMac: '',
                addrList: [],
                checkedAddr: [],
                lineListVisible: false,
                lineTotal: 0,
                macLineData: [],
                pageLineSize: 20,
                currentLinePage: 1
            };
        },
        created () {
            this.init();
        },
        methods: {
            handleReset () {
                this.formInline.year = '';
                this.formInline.month = '';
                // this.init();
            },
            init () {
                this.formInline.year = this.years[0].value;
                this.formInline.month = String(
                    new Date().getMonth() + 1 > 9
                        ? new Date().getMonth() + 1
                        : '0' + (new Date().getMonth() + 1)
                );
                this.queryPowerList();
            },
            handleClose (val) {
                if (!val) {
                    this.ruleForm.mac = '';
                }
            },
            checkedClose (val) {
                if (!val) {
                    this.checkedAddr = [];
                    this.addrList = [];
                }
            },
            handleCheckedCitiesChange (val) {
                this.addrList = [];
                // if (val.length === 0) return;
                // if (val[0].gatherAddr === '-1') {
                //     for (let j = 0; j < val.length; j++) {
                //         for (let i = 0; i < this.addrData.length; i++) {
                //             if (this.addrData[i].gatherAddr === val[j].addr.toString()) {
                //                 this.$refs[`disable-${this.addrData[i].title}`][0].disabled = true;
                //             }
                //         }
                //     }
                // } else {
                //     console.log(79798798789789);
                //     for (let j = 0; j < val.length; j++) {
                //         for (let i = 0; i < this.addrData.length; i++) {
                //             if (this.addrData[i].addr.toString() === val[j].gatherAddr) {
                //                 this.$refs[`disable-${this.addrData[i].title}`][0].disabled = true;
                //             }
                //         }
                //     }
                // }
                // if (val.length > 1) {
                //     for (let i = 0; i < val.length; i++) {
                //         console.log(val);
                //         for (let j = 0; j < this.addrData.length; j++) {
                //             if (
                //                 this.addrData[j].addr.toString() === val[i] ||
                //                 val[i].toString() === this.addrData[j].gatherAddr
                //             ) {
                //                  console.log(1122222222);
                //                  console.log(this.$refs[`disable-${this.addrData[j].title}`]);
                //                 /this.$refs[`disable-${this.addrData[j].title}`][0].disabled = true;
                //             }
                //         }
                //     }
                // }
                val.forEach((v) => {
                    this.addrList.push(v);
                });
            },
            handleAddrSave (flag) {
                if (this.addrList.length === 0) return;
                let params = {
                    groupId: this.groupId,
                    mac: this.addrMac,
                    addrs: flag ? this.addrList.toString() : ''
                };
                saveDetail(params)
                    .then((res) => {
                        if (res.success) {
                            this.checkedClose();
                            this.addDeviceVisible = false;
                            this.handleGroupChnlDetails();
                            this.lineListVisible = false
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
            handleQuery () {
                this.currentLinePage = 1;
                this.querySelectDevice();
            },
            chiose (e) {
            },
            handleLine (mac) {
                this.addrData = [];
                this.addrMac = mac;
                this.lineListVisible = true;
                queryChnlSelect({ mac })
                    .then((res) => {
                        if (res.success) {
                            if (res.data) {
                                this.addrData = res.data;
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
            handleCommand (command) {
                if (command === 'current') {
                    this.$func.windowCountDown(
                        '/stats-group/export.as?projectCode=' +
                            this.$store.state.projectCode +
                            '&year=' +
                            this.formInline.year +
                            '&month=' +
                            this.formInline.month +
                            '&pageSize=' +
                            this.pageSize +
                            '&pageNo=' +
                            this.currentPage
                    );
                }
                if (command === 'all') {
                    this.$func.windowCountDown(
                        '/stats-group/export.as?projectCode=' +
                            this.$store.state.projectCode +
                            '&year=' +
                            this.formInline.year +
                            '&month=' +
                            this.formInline.month +
                            '&pageSize=' +
                            this.pageSize +
                            '&pageNo=' +
                            this.currentPage +
                            '&exportType=exportAll'
                    );
                }
            },
            handleCloseAddr () {
                this.datePicker = 'hour';
                this.dateType = 3;
                this.powerHour = this.$func.formatDate('yyyy-MM-dd HH', new Date());
                this.powerDay = this.$func.getNowFormatDate();
                this.powerMonth = this.$func.getCurrentYearMonth();
                this.date = this.powerHour;
            },
            handlePowerExport () {
                // this.$Message.error('暂时不能导出');
                this.date = this.date
                    ? this.date
                    : this.$func.formatDate('yyyy-MM-dd HH', new Date());
                this.$func.windowCountDown(
                    '/stats-group/export/chnlDetails.as?projectCode=' +
                        this.$store.state.projectCode +
                        '&groupId=' +
                        this.groupId +
                        '&oqp1=' +
                        this.$store.state.projectName +
                        '&dateType=' +
                        this.dateType +
                        '&date=' +
                        this.date
                );
            },
            handleDelGroupLine (id) {
                let params = {
                    groupDetailId: id
                };
                delDetail(params)
                    .then((res) => {
                        if (res.success) {
                            this.handleGroupChnlDetails();
                            this.$Message.success({
                                content: res.message
                            });
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
            handleDatePicker (val) {
                if (val === 'day') {
                    this.dateType = 1;
                    this.date = this.powerDay;
                    // this.columns3[2].title = '上一日用电量(度)';
                } else if (val === 'month') {
                    this.dateType = 2;
                    this.date = this.powerMonth;
                    //  this.columns3[2].title = '上一月用电量(度)';
                } else if (val === 'hour') {
                    this.dateType = 3;
                    this.date = this.powerHour;
                    //  this.columns3[2].title = '上一时用电量(度)';
                }
                this.datePicker = val;
                this.handleGroupChnlDetails();
            },
            handlePowerMonthPicker (val) {
                this.dateType = 2;
                this.date = val;
                this.handleGroupChnlDetails();
            },
            handlePowerDayPicker (val) {
                this.dateType = 1;
                this.date = val;
                this.handleGroupChnlDetails();
            },
            handlePowerHourPicker (val) {
                this.dateType = 3;
                this.date = val;
                this.handleGroupChnlDetails();
            },
            handleSelectDevice () {
                this.addDeviceVisible = true;
                this.querySelectDevice();
            },
            querySelectDevice () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    key: this.ruleForm.mac,
                    pageNo: this.currentLinePage,
                    pageSize: 10,
                    nodeId: ''
                };
                pageBoxsSelect(params)
                    .then((res) => {
                        if (res.success) {
                            this.macLineData = res.datas;
                            this.macLineData.forEach(item => {
                                item.location = item.build + ',' + item.unit + ',' + item.room
                            })

                            this.lineTotal = res.total;
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
                                content: '未知功能,请刷新重试'
                            });
                        }
                });
            },
            queryPowerList () {
                if (!this.formInline.year) {
                    this.$Message.error({
                        content: '请先选择年份'
                    })
                    return false
                }
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    year: this.formInline.year
                        ? this.formInline.year
                        : new Date().getFullYear(),
                    month: this.formInline.month ? this.formInline.month : '01',
                    projectCode: this.$store.state.projectCode
                };
                queryGroup(params)
                    .then((res) => {
                        if (res.success) {
                            //
                            this.customElelList = res.datas.map((item) => ({
                                ...item,
                                statsPower: item.others.statsPower
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
            },
            handleViewGroup (name, id) {
                this.groupDialog = true;
                this.groupId = id;
                this.groupName = '分组名：' + name + '的线路 电量明细';
                this.handleGroupChnlDetails();
            },
            handleGroupChnlDetails () {
                this.$nextTick(() => {
                    this.groupData = [];
                    let params = {
                        dateType: this.dateType,
                        date: this.date
                            ? this.date
                            : this.$func.formatDate('yyyy-MM-dd HH', new Date()),
                        groupId: this.groupId
                    };
                    chnlDetails(params)
                        .then((res) => {
                            if (res.success) {
                                this.groupData = res.data;
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
            // exportPowerList () {
            //     this.$Message.error('暂时不能导出哦');
            //     // 待完善
            // },
            handleAddEdit (obj, val) {
                this.groupsForm.id = '';
                this.groupsForm.name = '';
                this.groupsForm.remark = '';
                this.dialogVisible = true;
                if (obj.id) {
                    this.formTitle = '编辑分组';
                    this.groupsForm.id = obj.id;
                    this.groupsForm.name = obj.name;
                    this.groupsForm.remark = obj.remark;
                    this.name = obj.name;
                    this.groupId = obj.id;
                }
            },
            handleDetails () {
                this.dialogVisible = false;
                this.groupDialog = true;
                this.handleViewGroup(this.name, this.groupId);
            },
            handleSceneCancel () {
                this.dialogVisible = false;
                this.groupsForm.name = '';
                this.groupsForm.remark = '';
            },
            handleSceneSave () {
                if (this.groupsForm.name === '') {
                    this.$Message.error({
                        content: '请输入分组名称'
                    });
                    return false;
                }
                let params = {
                    name: this.groupsForm.name,
                    remark: this.groupsForm.remark,
                    groupId: this.groupsForm.id,
                    projectCode: this.$store.state.projectCode
                };
                addrEditGroup(params)
                    .then((res) => {
                        if (res.success) {
                            this.handleSceneCancel();
                            this.queryPowerList();
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
            },
            handleDelGroup (id) {
                let params = {
                    groupId: id
                };
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>你确定要移除此分组吗？</p>',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        delGroup(params)
                            .then((res) => {
                                if (res.success) {
                                    this.queryPowerList();
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
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消移除'
                        });
                    }
                });
            },
            changePage (val) {
                this.currentPage = val;
                this.queryPowerList();
            },
            changePages (e) {
                this.currentLinePage = e
                this.querySelectDevice()
            },
            changesize (val) {
                this.pageSize = val;
                this.queryPowerList();
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
.pickDate{
  display: flex;
  justify-content: space-between;
}
</style>
