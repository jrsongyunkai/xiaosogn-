<template>
  <div class="">
    <Row
      class="alarm-sound-tip"
      v-if="category === 3 || category === 6 || category === 1"
    >
      <span v-if="category === 3">
        <i class="icon-v5 icon-v5-xiaoxi"></i
        >:同一个手机号码每天只能接收50条短信通知</span
      >
      <span v-if="category === 6">
        <i class="icon-v5 icon-v5-xiaoxi"></i
        >:同一个手机号码每天只能接收50条语音通知,外呼号码由系统随机分配</span
      >
      <span v-if="category === 1"
        ><i class="icon-v5 icon-v5-xiaoxi"></i
        >:仅限于安装并运行了智慧用电APP的手机或终端</span
      >
    </Row>
    <Col v-if="data.length === 0 && this.count === 1" class="c-danger">
      未开通
      <Button
        type="text"
        class="add-btn ml-20 pointer"
        @click="openFlag = false"
        >开通</Button
      >
    </Col>
    <Row>
      <Col :span="23">
        <Form
          :data="form"
          ref="form"
          style="height: 16px"
          inline
          v-if="category === 3 || category === 6"
        >
          <FormItem :title="category === 3 ? '短信账户' : '语音账户'">
            <span>{{
              "剩余" +
              (remaining ? remaining : 0) +
              (category === 3 ? "条" : "分钟")
            }}</span>
            <Button type="text" @click="instantRecharge">立即充值</Button>
          </FormItem>
        </Form>
      </Col>
      <Col
        :span="1"
        v-if="!openFlag || data.length > 0 || this.count > 1"
        style="padding: 7px"
      >
        <Button
          type="primary"
          size="small"
          @click="addNotification"
          v-if="category === 1 || category === 3 || category === 6"
          >添加
          <!-- <Icon type="md-add " /> 添加 -->
        </Button>
        <Button
          type="primary"
          size="small"
          @click="addNotification"
          v-if="category === 2 && data.length === 0"
          >添加
          <!-- <Icon type="md-add  pointer fs-12 c-default" /> 添加 -->
        </Button>
      </Col>
    </Row>
    <Col :span="24">
      <Table
        :data="data"
        v-if="!openFlag || data.length > 0 || this.count > 1"
        :columns="columnTable"
      >
        <template slot-scope="{ row, index }" slot="prjList">
          <Button
            type="primary"
            size="small"
            ghost
            style="margin-right: 5px"
            @click="handleAddProject(row.prjList, index)"
            >添加</Button
          >
          <Tag
            v-for="tag in row.prjList"
            :key="tag.code"
            :name="tag.name"
            @on-close="handleProjectClose(row.prjList, tag)"
            style="width: 100px"
          >
            <span>
              <Tooltip :content="tag.name" placement="top">
                {{ tag.name }}
              </Tooltip>
            </span>
          </Tag>
        </template>
        <template slot-scope="{ row }" slot="appChnl">
          <CheckboxGroup v-model="row.appChnl">
            <Checkbox label="iOS"></Checkbox>
            <Checkbox label="Android"></Checkbox>
          </CheckboxGroup>
        </template>
        <template slot-scope="{ row }" slot="url">
          <Input size="small" v-model="row.url"></Input>
        </template>
        <template slot-scope="{ row }" slot="salt">
          <Input size="small" v-model="row.salt"></Input>
        </template>
        <template slot-scope="{ row, index }" slot="phone">
          <Poptip placement="top" transfer :ref="`phone-popover-${index}`">
            <Button type="primary" size="small" ghost class="tag-add pointer"
              >添加</Button
            >
            <div class="api" slot="content">
              <Input
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="form.phone"
                placeholder="请输入手机号"
              ></Input>
              <div style="margin: 5px 0 0">
                <Button
                  type="primary"
                  size="small"
                  @click="handleAddPhone(form.phone, index)"
                  >确定</Button
                >
                <!-- 这里有两个doColse方法没写，一个确定按纽，一个取消按钮 ,待解决  已解决-->
                /
                <Button size="small" @click="close(index)">取消</Button>
              </div>
            </div>
          </Poptip>
          <span v-if="row.phoneNumber !== ''">
            <Tag
              v-for="tag in row.phoneNumber.split(',')"
              :key="tag"
              :name="tag"
              closable
              @on-close="handleClosePushPhone(tag, index)"
            >
              <span>{{ tag }}</span>
            </Tag>
          </span>
        </template>
        <template slot-scope="{ row, index }" slot="alarmList">
          <Button
            type="primary"
            size="small"
            ghost
            style="margin-right: 5px"
            @click="handleAddAlarm(row.alarmList, index)"
            >添加</Button
          >
          <Tag
            v-for="tag in row.alarmList"
            :key="tag.typeNumber"
            :name="tag.alarmInfo"
            closable
            @on-close="handleTypesClose(row.alarmList, tag)"
          >
            <span>{{ tag.alarmInfo }}</span>
          </Tag>
        </template>
        <template slot-scope="{ row, index }" slot="timeRanges">
          <Button
            type="primary"
            size="small"
            ghost
            style="margin-right: 5px"
            @click="add(index)"
            >添加</Button
          >
          <Tag
            v-for="(tag, indexs) in row.timeRanges"
            :key="indexs"
            :name="tag"
            closable
            @on-close="handleTypesCloses(row.timeRanges, tag, index)"
          >
            <span>{{ tag }}</span></Tag
          >
          <div>
            沉默周期
            <Select v-model="row.silenceTimeout" style="width: 80px">
              <Option
                v-for="item in timeOptions"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
        </template>
        <template slot-scope="{ row }" slot="generalSignName">
          <Checkbox v-model="row.generalSignName">通用</Checkbox>
        </template>
        <template slot-scope="{ row }" slot="pushEnable">
          <Select :clearable="true" transfer v-model="row.pushEnable">
            <Option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </Option>
          </Select>
        </template>
        <template slot-scope="{ row, index }" slot="operation">
          <Button type="text" size="small" @click="handleSave(row)"
            ><span style="color: #007eff">保存</span></Button
          >
          <Button type="text" size="small" @click="handleDel(row, index)"
            ><span style="color: #ff5b59">移除</span></Button
          >
        </template>
      </Table>
      <div class="tc" style="margin-top: 15px">
        <Button @click="handlePage('home')"> 首页 </Button>
        <Button @click="handlePage('prev')" :disabled="count <= 1"
          >上一页</Button
        >
        <Button @click="handlePage('next')" :disabled="length < 10"
          >下一页
        </Button>
      </div>
    </Col>

    <Modal
      v-model="modalnotice"
      title="提示"
      @on-ok="removeOk"
      @on-cancel="removeCancel"
    >
      <p>此操作将永久删除该配置, 是否继续?</p>
    </Modal>
    <Modal
      title="项目选择"
      :mask="false"
      v-model="projectSelectFlag"
      :mask-closable="false"
      :footer-hide="true"
    >
      <ProjectSelect
        v-model="projectLists"
        v-if="projectSelectFlag"
        @select-multiple="selectMultiple"
      ></ProjectSelect>
    </Modal>
    <Modal
      title="告警类型的选择"
      :mask="false"
      v-model="alarmTypeFlag"
    >
      <!-- <Checkboxgroup
        v-model="alarmTypeList"
        ref="typesCheckboxGroup"
      ></Checkboxgroup> -->
      <div class="checkbox-group">
        <CheckboxGroup
          v-model="checkedLists"
          @on-change="handleCheckedTypesChange"
        >
          <Checkbox
            v-for="(item, index) in lists"
            :label="item.typeNumber"
            :key="index"
            >{{ item.info }}</Checkbox
          >
        </CheckboxGroup>
        <Checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @on-change="handleCheckAllChange"
          >全选</Checkbox
        >
      </div>
      <hr />
      <div class="checkbox-group">
        <CheckboxGroup
          v-model="checkedLists2"
          @on-change="handleCheckedTypesChange2"
        >
          <Checkbox
            v-for="(item, index) in lists2"
            :label="item.typeNumber"
            :key="index"
            :value="item.typeNumber"
            >{{ item.info }}</Checkbox
          >
        </CheckboxGroup>
        <Checkbox
          :indeterminate="isIndeterminate2"
          v-model="checkAll2"
          @on-change="handleCheckAllChange2"
          >全选</Checkbox
        >
      </div>
      <div slot="footer" style="padding:20px">
        <Button  @click="alarmTypeFlag = false">取消</Button>
        <Button type="primary" @click="handleSaveTypes">保存</Button>
      </div>
    </Modal>
    <Modal
      :title="category === 3 ? '短信充值' : '语音充值'"
      :mask="false"
      v-model="rechargeFlag"
      @on-cancel="handleCloseRecharge"
      id="recharge-form"
    >
      <template v-if="packageFlag">
        <div class="fw recharge-tip">
          <i class="icon-v5 icon-v5-huifu"></i>
          <span>有效期:自充值之日起,永久有效</span>
        </div>
        <Row style="display: flex; margin: 20px 0">
          <Col :span="6">充值套餐: </Col>
          <Col :span="18">
            <RadioGroup v-model="rechargeOption" id="rechargeOption">
              <Radio
                style="width: 150px; margin-bottom: 10px"
                v-for="(item, index) in rechargeOptions"
                :key="index"
                :label="item.split(':')[0]"
                >{{
                  `${item.split(":")[2]}条` + " " + `(${item.split(":")[1]}元)`
                }}</Radio
              >
            </RadioGroup>
          </Col>
        </Row>
        <div class="btn">
          <Button type="primary" @click="payImmediately"> 立即充值</Button>
        </div>
      </template>
      <template v-if="!packageFlag">
        <Row style="display: flex" :gutter="30">
          <template v-if="!paymentResultFlag">
            <Col :span="10">
              <div class="qrCode">
                <img :src="qrCode" class="qr-code" />
              </div>
            </Col>
            <Col :span="14">
              <div style="width: 100px">
                <img
                  style="width: 100%"
                  src="../../../assets/images/weChat.png"
                />
              </div>
              <div style="margin-top: 20px; margin-bottom: 60px">
                请使用微信扫描二维码以完成支付
              </div>
              <h3 style="margin-bottom: 10px">
                {{ "请支付" + packagePrice + "元" }}
              </h3>
              <div style="display: flex">
                <h4>您选择的套餐：</h4>
                <h4>{{ quantity + (category === 3 ? "条" : "分钟") }}</h4>
              </div>
            </Col>
          </template>

          <div v-if="paymentResultFlag" class="payment-result">
            <p v-if="paymentResult === '1'">
              <i class="el-icon-success c-success"></i>
              <span class="fw">支付成功</span>
            </p>
            <p v-if="paymentResult === '2'">
              <i class="el-icon-warning c-danger"></i>
              <span>
                <div class="fw">支付失败</div>
                <div class="failure-msg">{{ paymentFailureMsg }}</div>
              </span>
            </p>
          </div>
        </Row>
      </template>

      <div slot="footer"></div>
    </Modal>
    <Modal
      v-model="flag"
      title="选择时间"
      @on-ok="getTime"
      @on-visible-change="visiblechange"
    >
      <Row>
        <Col span="12">
          <TimePicker
            v-model="timeArr"
            type="timerange"
            format="HH:mm"
            confirm
            placement="bottom-end"
            placeholder="选择时间"
            style="width: 168px"
          ></TimePicker>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
``
<script>
    import store from '@/store';
    import {
        getPayQuotaConfig,
        saveAlarmPushConfigInfo,
        payQrCode,
        confirmPayStatus,
        payStatus,
        SMSPush,
        queryPoPup,
        queryAlarmForConfig,
        delAlarmPushConfig,
        updatePoPup
    } from '@/api/public';
    // import Checkboxgroup from '../../Common/CheckboxGroup.vue';
    //  import TimePicker from '../../Common/TimePicker.vue';
    import ProjectSelect from '../../Common/ProjectSelect.vue';
    export default {
        components: { ProjectSelect },
        props: {
            category: {
                type: Number,
                default () {
                    return {};
                }
            }
        },
        data () {
            return {
                model2: '',
                flag: false,
                checkAll: false,
                checkAll2: false,
                isIndeterminate: true,
                isIndeterminate2: true,
                checkedLists: [],
                checkedLists2: [],
                timeArr: [],
                origin: '',
                lists: [],
                lists2: [],
                cityList: [
                    {
                        value: '0',
                        label: '0'
                    },
                    {
                        value: '30',
                        label: '30分钟'
                    },
                    {
                        value: '60',
                        label: '60分钟'
                    },
                    {
                        value: '180',
                        label: '3小时'
                    },
                    {
                        value: '360',
                        label: '6小时'
                    },
                    {
                        value: '720',
                        label: '12小时'
                    },
                    {
                        value: '1440',
                        label: '24小时'
                    }
                ],
                columnTable: [
                    // { title: '允许通知的项目', slot: 'prjList' },
                    // { title: 'APP渠道', slot: 'appChnl' },
                    // { title: '接口地址', slot: 'url' },
                    // { title: '签名盐值', slot: 'salt' },
                    // { title: '接收通知的手机', slot: 'phone' },
                    // { title: '允许的告警类型', slot: 'alarmList' },
                    // { title: '通知的时段', slot: 'timeRanges' },
                    // { title: '短信签名', slot: 'generalSignName' },
                    // { title: '状态', slot: 'pushEnable' },
                    // { title: '操作', slot: 'operation' }
                ],
                paymentFailureMsg: '',
                paymentResult: '',
                paymentResultFlag: false,
                packagePrice: '',
                quantity: 0,
                modalnotice: false,
                form: {
                    phone: ''
                },
                periodFlag: false,
                data: [],
                length: 0,
                index: 0,
                count: 1,
                openFlag: true,
                rechargeFlag: false,
                packageFlag: true,
                rechargeOption: 1,
                rechargeOptions: [],
                dataFlag: false,
                projectSelectFlag: false,
                alarmTypeList: [],
                alarmTypeFlag: false,
                remaining: 0,
                options: [
                    {
                        label: '禁用',
                        value: 0
                    },
                    {
                        label: '启用',
                        value: 1
                    }
                ],
                timeOptions: [
                    {
                        value: '',
                        label: '0'
                    },
                    {
                        value: '1800',
                        label: '30分钟'
                    },
                    {
                        value: '3600',
                        label: '60分钟'
                    },
                    {
                        value: '10800',
                        label: '3小时'
                    },
                    {
                        value: '21600',
                        label: '6小时'
                    },
                    {
                        value: '43200',
                        label: '12小时'
                    },
                    {
                        value: '86400',
                        label: '24小时'
                    }
                ],
                rowMesge: '',
                rowIndex: '',
                indexs: 0
            };
        },
        created () {
            this.queryConfig();
        },
        mounted () {
            this.setHandleColumns();
            this.queryList();
            this.queryAlarmSystem();
            setTimeout(() => {}, 1500);
        },
        methods: {
            queryConfig () {
                queryAlarmForConfig({})
                    .then((res) => {
                        this.lists = res.data.alarms;
                        this.lists2 = res.data.warns;
                        store.commit(
                            'alarmForConfig',
                            res.data.alarms.concat(res.data.warns)
                        );
                        this.renderer();
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
            queryAlarmSystem () {
                queryPoPup({})
                    .then((res) => {
                        if (res.success) {
                            this.checkedLists = res.data !== '' ? res.data.split(',') : [];
                            this.checkedLists2 = res.data !== '' ? res.data.split(',') : [];
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
            },
            handleCheckAllChange (val) {
                this.checkedLists = val
                    ? this.lists.map((item) => {
                        return item.typeNumber;
                    })
                    : [];
                // this.$emit('change', [
                //     ...new Set([...this.checkedLists, ...this.checkedLists2])
                // ]);
                this.isIndeterminate = false;
            },
            visiblechange (e) {
                //
                if (e) this.timeArr = [];
            },
            handleCheckAllChange2 (val) {
                this.checkedLists2 = val
                    ? this.lists2.map((item) => {
                        return item.typeNumber;
                    })
                    : [];
                // this.$emit('change', [
                //     ...new Set([...this.checkedLists, ...this.checkedLists2])
                // ]);
                this.isIndeterminate2 = false;
            },
            handleCheckedTypesChange (data) {
                //
                // let checkedCount = value.length;
                // this.checkAll = checkedCount === this.lists.length;
                // this.isIndeterminate =
                //     checkedCount > 0 && checkedCount < this.lists.length;
                if (data.length === this.lists.length) {
                    this.isIndeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.isIndeterminate = true;
                    this.checkAll = false;
                } else {
                    this.isIndeterminate = false;
                    this.checkAll = false;
                }
            },
            handleCheckedTypesChange2 (data) {
                this.checkedLists2 = data
                // let checkedCount = value.length;
                // this.checkAll2 = checkedCount === this.lists2.length;
                // this.isIndeterminate2 =
                //     checkedCount > 0 && checkedCount < this.lists2.length;
                if (data.length === this.lists2.length) {
                    this.isIndeterminate2 = false;
                    this.checkAll2 = true;
                } else if (data.length > 0) {
                    this.isIndeterminate2 = true;
                    this.checkAll2 = false;
                } else {
                    this.isIndeterminate2 = false;
                    this.checkAll2 = false;
                }
            },
            renderer () {
                this.checkAll = this.checkedLists.length === this.lists.length;
                this.checkAll2 = this.checkedLists2.length === this.lists2.length;
                this.isIndeterminate =
                    this.checkedLists.length > 0 &&
                    this.checkedLists.length < this.lists.length;
                this.isIndeterminate2 =
                    this.checkedLists2.length > 0 &&
                    this.checkedLists2.length < this.lists2.length;
            },
            changeList (origin) {
                this.origin = origin;
            },
            noRepeat (arr) {
                var newArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (newArr.indexOf(arr[i]) === -1) {
                        newArr.push(arr[i]);
                    }
                }
                return newArr;
            },
            handleSaveTypes () {
                let cfg = this.$store.state.alarmForConfig;
                this.data[this.index].alarmList = [];
                // console.log(this.checkedLists2);
                // let checked = this.checkedLists.concat(this.checkedLists2);
                // let checkList = this.noRepeat(checked);
                // cfg.forEach((value) => {
                //     checkList.forEach((item) => {
                //         if (value.typeNumber === item) {
                //             this.data[this.index].alarmList.push({
                //                 typeNumber: value.typeNumber,
                //                 alarmInfo: value.info
                //             });
                //         }
                //     });
                // });
                let arr = []
                let arr2 = []
                this.lists.forEach(item => {
                    arr.push(item.typeNumber)
                })
                this.lists2.forEach(item => {
                    arr2.push(item.typeNumber)
                })

                let arrs = []
                let arrs2 = []

                this.checkedLists.forEach(item => {
                    arr.forEach(items => {
                        if (item === items) {
                            arrs.push(items)
                        }
                    })
                })
                this.checkedLists2.forEach(item => {
                    arr2.forEach(items1 => {
                        if (item === items1) {
                            arrs2.push(items1)
                        }
                    })
                })
                //
                this.checkedLists = arrs
                this.checkedLists2 = arrs2
                let checked = this.checkedLists.concat(this.checkedLists2);
                cfg.forEach((value) => {
                    checked.forEach((item) => {
                        if (value.typeNumber === item) {
                            this.data[this.index].alarmList.push({
                                typeNumber: value.typeNumber,
                                alarmInfo: value.info
                            })
                        }
                    });
                });
                this.alarmTypeFlag = false;
            },
            unique (array) {
                return Array.from(new Set(array)); // Array.from() 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例
            },
            setHandleColumns () {
                let column = [
                    { title: '允许通知的项目', slot: 'prjList' },
                    { title: '允许的告警类型', slot: 'alarmList' },
                    { title: '通知的时段', slot: 'timeRanges' },
                    { title: '状态', slot: 'pushEnable' },
                    { title: '操作', slot: 'operation' }
                ];
                if (this.category === 1) {
                    column.splice(1, 0, { title: 'APP渠道', slot: 'appChnl' });
                } else if (this.category === 2) {
                    column.splice(
                        1,
                        0,
                        { title: '接口地址', slot: 'url' },
                        { title: '签名盐值', slot: 'salt' }
                    );
                } else if (this.category === 6) {
                    column.splice(1, 0, { title: '接收通知的手机', slot: 'phone' });
                } else if (this.category === 3) {
                    column.splice(1, 0, { title: '接收通知的手机', slot: 'phone' });
                    column.splice(4, 0, {
                        title: '短信签名',
                        slot: 'generalSignName'
                    });
                }
                this.columnTable = column;
            },
            add (e) {
                this.indexT = e;
                this.flag = true;
            },
            handlePage (e) {
                if (e === 'home') {
                    this.count = 1;
                } else if (e === 'prev') {
                    this.count--;
                } else if (e === 'next') {
                    this.count++;
                }
                this.queryList();
                this.$refs.table.doLayout(); // doLayout 方法未知
            },
            close (index) {
                this.form.label = '';
                this.$refs['phone-popover-' + index].visible = false;
            },
            queryList () {
                this.dataFlag = false;
                let params = {
                    pushChannel: this.category,
                    pageSize: 10,
                    pageNo: this.count
                };
                SMSPush(params)
                    .then((res) => {
                        if (res.success) {
                            res.data.configList.forEach((v) => {
                                if (!v.silenceTimeout) v.silenceTimeout = '';
                            });
                            this.data = res.data.configList;
                            this.remaining = res.data.quantity;
                            this.length = res.data.configList.length;
                            this.dataFlag = true;
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
            instantRecharge () {
                this.rechargeFlag = true;
                this.packageFlag = true;
                this.rechargeOption = 1;
                getPayQuotaConfig({ chargeType: this.category === 3 ? 1 : 2 })
                    .then((res) => {
                        if (res.success) {
                            this.rechargeOptions = res.data;
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新后重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新后重试'
                            });
                        }
                });
            },
            addNotification () {
                if (this.data.length === this.length + 1) return false;
                if (this.category === 1) {
                    this.data.unshift({
                        alarmList: [],
                        cid: 0,
                        appChnl: [],
                        phoneNumber: '',
                        prjList: [],
                        silenceTimeout: '',
                        pushEnable: 1,
                        timeRanges: []
                    });
                }
                if (this.category === 2) {
                    this.data.unshift({
                        alarmList: [],
                        cid: 0,
                        url: '',
                        salt: '',
                        phoneNumber: '',
                        prjList: [],
                        silenceTimeout: '',
                        pushEnable: 1,
                        timeRanges: []
                    });
                }
                if (this.category === 3) {
                    this.data.unshift({
                        alarmList: [],
                        cid: 0,
                        generalSignName: false,
                        phoneNumber: '',
                        prjList: [],
                        silenceTimeout: '',
                        pushEnable: 1,
                        timeRanges: []
                    });
                }
                if (this.category === 6) {
                    this.data.unshift({
                        alarmList: [],
                        cid: 0,
                        phoneNumber: '',
                        prjList: [],
                        silenceTimeout: '',
                        pushEnable: 1,
                        timeRanges: []
                    });
                }
            },
            handleAddProject (row, index) {
                this.indexs = index;
                this.projectLists = row;
                this.projectSelectFlag = true;
            },
            handleProjectClose (row, tag) {
                row.forEach((item, index) => {
                    if (item.code === tag.code) {
                        row.splice(index, 1);
                    }
                });
            },
            handleAddPhone (phone, index) {
                if (
                    !this.$func.checkPhone(phone) &&
                    phone.length < 1 &&
                    phone !== undefined
                ) {
                    this.$Message.error({
                        content: '号码格式错误'
                    });
                    return false;
                }
                if (this.data[index].phoneNumber.split(',').indexOf(phone) > -1) {
                    this.$Message.error({
                        content: '号码已存在，请勿重复添加'
                    });
                    return false;
                }
                this.form.phone = '';
                this.$refs['phone-popover-' + index].visible = false;
                this.data[index].phoneNumber =
                    this.data[index].phoneNumber !== ''
                        ? this.data[index].phoneNumber.concat(',' + phone)
                        : phone;
            },
            handleClosePushPhone (tag, index) {
                let phone = this.data[index].phoneNumber.split(',');
                phone.splice(phone.indexOf(tag), 1);
                this.data[index].phoneNumber = phone.join(',');
            },
            handleAddAlarm (row, index, origin) {
                this.index = index;
                this.checkedLists = row.map((item) => {
                    return item.typeNumber;
                });
                this.checkedLists2 = row.map((item) => {
                    return item.typeNumber;
                });
                this.alarmTypeFlag = true;
                if (origin) {
                    this.$nextTick(() => {
                        this.$refs.typesCheckboxGroup.changeList(origin);
                    });
                }
            },
            handleTypesClose (row, tag) {
                let index = row.indexOf(tag);
                if (index > -1) row.splice(index, 1);
            },
            handleTypesCloses (row, tag, num) {
                let index = row.indexOf(tag);
                if (index > -1) row.splice(index, 1);
                this.data[num].timeRanges = row;
            },
            handlePeriodFlag (index) {
                this.$refs['time-popover-' + index].visible = false;
                this.periodFlag = false;
            },
            handleAddTime (index) {
                this.periodFlag = true;
                this.$nextTick(() => {
                    this.$refs['time-picker-' + index].period(); // period 方法未知
                });
            },
            openchange (e) {},
            handleTimeClose (tag, time) {
                let index = time.indexOf(tag);
                time.splice(index, 1);
            },
            handleSave (row) {
                if (this.category === 3 || this.category === 6) {
                    if (
                        row.alarmList.length < 1 ||
                        row.phoneNumber.length < 1 ||
                        row.prjList.length < 1 ||
                        row.timeRanges.length < 1
                    ) {
                        this.$Message.error({
                            content: '每项配置最少选择一项'
                        });
                        return false;
                    }
                } else if (this.category === 1) {
                    if (
                        row.alarmList.length < 1 ||
                        row.appChnl.length < 1 ||
                        row.prjList.length < 1 ||
                        row.timeRanges.length < 1
                    ) {
                        this.$Message.error({
                            content: '每项配置最少选择一项'
                        });
                        return false;
                    }
                } else if (this.category === 2) {
                    if (
                        row.alarmList.length < 1 ||
                        row.url === '' ||
                        row.salt === '' ||
                        row.prjList.length < 1 ||
                        row.timeRanges.length < 1
                    ) {
                        this.$Message.error({
                            content: '每项配置最少选择一项'
                        });
                        return false;
                    }
                }
                let types = row.alarmList.map((item) => {
                    return item.typeNumber;
                });
                let projects = row.prjList.map((item) => {
                    return item.code;
                });
                let params = {
                    id: row.cid,
                    pushChannel: this.category,
                    typeNumbers: types.join(','),
                    timeRanges: row.timeRanges.join(','),
                    prjCodes: projects.join(','),
                    pushEnable: row.pushEnable
                };
                if (this.category === 3) {
                    params.channelParams =
                        row.phoneNumber +
                        (row.generalSignName ? '^' + row.generalSignName : '^false') +
                    (row.silenceTimeout ? '^' + row.silenceTimeout : '');
                } else if (this.category === 6) {
                    params.channelParams =
                        row.phoneNumber +
                    (row.silenceTimeout ? '^' + row.silenceTimeout : '');
                } else if (this.category === 1) {
                    params.channelParams =
                        row.appChnl.join(',') +
                    (row.silenceTimeout ? '^' + row.silenceTimeout : '');
                } else if (this.category === 2) {
                    params.channelParams =
                        row.url +
                        ',' +
                        row.salt +
                    (row.silenceTimeout ? '^' + row.silenceTimeout : '');
                }
                this.savePushConfig(params, this.category);
            },
            savePushConfig (params, type) {
                saveAlarmPushConfigInfo(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.periodFlag = false;
                            this.queryList();
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
            handleDel (row, index) {
                if (row.cid === 0) {
                    this.data.splice(index, 1);
                } else {
                    this.modalnotice = true;
                    this.rowMesge = row;
                    this.rowIndex = index;
                }
            },
            removeOk () {
                delAlarmPushConfig({ cid: this.rowMesge.cid })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.queryList();
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
                                content: '未知错误,请刷新后重试'
                            });
                        }
                });
            },
            removeCancel () {
                this.modalnotice = false;
                this.$Message.info({
                    content: '取消删除'
                });
            },
            getTime () {
                let timeStr = this.timeArr[0] + '~' + this.timeArr[1];
                this.data[this.indexT].timeRanges.unshift(timeStr);
            },
            handleCloseRecharge () {
                this.rechargeFlag = false;
                clearInterval(this.polling);
            },
            payImmediately () {
                let recharge = this.rechargeOptions[this.rechargeOption - 1].split(':');
                this.quantity = recharge[2];
                this.packagePrice = recharge[1];
                let params = {
                    quotaId: this.rechargeOption,
                    chargeType: this.category === 3 ? 1 : 2
                };
                payQrCode(params)
                    .then((res) => {
                        if (res.success) {
                            this.packageFlag = false;
                            this.paymentResultFlag = false;
                            this.qrCode = 'data:image/gif;base64,' + res.data.qrCode;
                            this.polling = setInterval(() => {
                                this.queryPaymentResult(res.data.tradeNo);
                            }, 2000);
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
            },
            queryPaymentResult (tradeNo) {
                payStatus({ tradeNo: tradeNo })
                    .then((res) => {
                        if (res.success) {
                            let code = res.data.statu;
                            if (code !== '0') {
                                clearInterval(this.polling);
                                if (code === '1') {
                                    this.paymentResultFlag = true;
                                    this.paymentResult = code;
                                    this.queryList();
                                } else if (code === '2') {
                                    this.confirmPaymentResult(tradeNo);
                                }
                            }
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
            },
            confirmPaymentResult (tradeNo) {
                confirmPayStatus({ tradeNo: tradeNo })
                    .then((res) => {
                        if (res.success) {
                            let code = res.data.statu;
                            if (code === '1' || code === '2') {
                                this.paymentResultFlag = true;
                                this.paymentResult = code;
                            }
                            if (code === '2') {
                                this.paymentFailureMsg = res.data.desc;
                            }
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
            },
            selectMultiple (e) {
                let flagArr = this.data[this.indexs].prjList.some((item) => {
                    return item.name === e[0].name;
                });

                if (!flagArr) {
                    this.$Message.info({
                        content: '项目选择' + ' "' + e[0].name + '"'
                    });
                    this.data[this.indexs].prjList.push(e[0]);
                } else this.$Message.error('不可以重复添加相同的项目哦');
            }
            // handleProject () {
            //
            //     // 未完成
            // }
        },
        watch: {
            data: {
                handler (newVal, oldVal) {
                    this.data = newVal;

                    //
                },
                deep: true
            }
        },
        destroyed () {
            clearInterval(this.polling);
        }
    };
</script>

<style lang="less" scoped>
.alarm-sound-tip {
  font-size: 14px;
  padding: 5px;
  border: 1px solid;
  background: #1a202e;
  color: #999999;
}
/deep/.ivu-modal-footer {
  border: transparent;
  padding: 0;
}
.recharge-tip {
  border: 1px solid #666877;
  padding: 5px;
  background: rgba(103, 105, 120, 0.2);
  color: #97999a;
}
.btn {
  width: 100%;
  text-align: right;
}
.qrCode {
  width: 100%;
  img {
    width: 100%;
  }
}
</style>
