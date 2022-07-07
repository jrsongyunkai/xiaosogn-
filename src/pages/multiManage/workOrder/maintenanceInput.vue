<template>
  <div id="maintenance">
    <div class="mainM">
      <div class="left">
        <h2>{{isbz?'编辑维保工单信息':'新建维保工单信息'}}</h2>
        <div class="inputdata">
          <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="130"
          >
            <FormItem label="维保设备" prop="mac" class="MT">
              <Input
                v-model="formValidate.mac"
                disabled
                placeholder="请选择"
                style="width: 250px"
              ></Input>
              &nbsp;&nbsp;<Button
                ghost
                type="primary"
                style="color: #007eff"
                @click="getMac"
                >选择设备</Button
              >
            </FormItem>

            <FormItem label="维保设备别名" class="MT">
              {{ OtherName }}
            </FormItem>
            <!-- 日期选择 -->
            <FormItem prop="date" label="维保日期" class="MT">
              <DatePicker
                type="datetime"
                v-model="formValidate.date"
                format="yyyy-MM-dd HH:mm"
                confirm
                placement="top"
                placeholder="请选择日期"
                style="width: 350px"
                @on-change="getdate"
                :editable="false"
                :clearable="false"
              ></DatePicker>
            </FormItem>

            <FormItem label="维保内容" prop="content" class="MT">
              <Input
                v-model="formValidate.content"
                type="textarea"
                placeholder="请输入"
                :autosize="{ minRows: 2, maxRows: 5 }"
              ></Input>
            </FormItem>

            <FormItem label="故障内容" prop="malfunctionContent" class="MT">
              <Input
                v-model="formValidate.malfunctionContent"
                type="textarea"
                placeholder="请输入"
                :autosize="{ minRows: 2, maxRows: 5 }"
              ></Input>
            </FormItem>
            <FormItem label="处理结果" prop="result" class="MT">
              <Input
                v-model="formValidate.result"
                type="textarea"
                placeholder="请输入"
                :autosize="{ minRows: 2, maxRows: 5 }"
              ></Input>
            </FormItem>

            <div style="color:#007EFF;font-size:12px;margin-left:130px;margin-top:-20px;margin-bottom:20px">小提示：未填写处理结果的工单，保存后状态将变成：处理中。填写处理结果的工单，状态变成：已完成。</div>
            <FormItem label="意见反馈" prop="suggest" class="MT">
              <Input
                v-model="formValidate.suggest"
                type="textarea"
                placeholder="请输入"
                :autosize="{ minRows: 2, maxRows: 5 }"
              ></Input>
            </FormItem>

            <FormItem class="MT" label="维修前照片">
              <Modal title="图片展示" v-model="visible">
                <img :src="imgUrls" v-if="visible" style="width: 100%" />
              </Modal>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleSuccess"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                :action="action"
                name="beforeImgFile"
                :data="beforeImgData"
                style="display: inline-block; width: 58px"
              >
                <div style="width: 58px; height: 58px; line-height: 58px">
                  <Icon type="md-add" size="20"></Icon>
                </div>
              </Upload>

              &nbsp;
              <div
                class="demo-upload-list"
                v-show="uploadList"
              >
                <template >
                  <img :src="uploadList ? uploadList : imgUrls" />
                  <div class="demo-upload-list-cover">
                    <!-- 获取大图 -->
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleView(uploadList)"
                    ></Icon>
                    <Icon
                      type="ios-trash-outline"
                      @click.native="handleRemove()"
                    ></Icon>
                  </div>
                </template>
              </div>
            </FormItem>

            <FormItem class="MT" label="维修后照片">
              <Modal title="图片展示" v-model="visible1">
                <img :src="imgUrls1" v-if="visible1" style="width: 100%" />
              </Modal>
              <Upload
                ref="upload1"
                :show-upload-list="false"
                :default-file-list="defaultList1"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError1"
                :on-exceeded-size="handleMaxSize1"
                :on-success="handleSuccess1"
                :before-upload="handleBeforeUpload1"
                multiple
                type="drag"
                :action="action"
                name="afterImgFile"
                :data="beforeImgData1"
                style="display: inline-block; width: 58px"
              >
                <div style="width: 58px; height: 58px; line-height: 58px">
                  <Icon type="md-add" size="20"></Icon>
                </div>
              </Upload>
              &nbsp;
              <div
                class="demo-upload-list"
               v-show="uploadList1"
              >
                <template>
                  <img :src="uploadList1 ? uploadList1 : imgUrls1" />
                  <div class="demo-upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleView1(uploadList1)"
                    ></Icon>
                    <Icon
                      type="ios-trash-outline"
                      @click.native="handleRemove1(item)"
                    ></Icon>
                  </div>
                </template>
              </div>
            </FormItem>
            <FormItem>
              <Button
                style="background: #007eff; border: none"
                type="primary"
                @click="completeInput"
                >完成</Button
              >&nbsp;
              <Button @click="cancel">取消维保</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <div
        style="
          background-color: rgb(9, 15, 25);
          float: left;
          width: 0.5%;
          height: 100%;
        "
      ></div>
      <div class="right">
        <Timeline class="historydata">
          <h2>工单历史记录</h2>
          <TimelineItem
            v-for="item in datas"
            :key="item.id"
            :color="item.status === 1 ? '#0DD667' : '#E03C3A'"
          >
            <span class="time" style="margin-bottom:50px;!important">{{
              item.createTime
            }}</span>
            <p class="content">
              处理人：{{
                item.handlerName
              }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：<span
                :style="item.status === 1 ? 'color:#0DD667' : 'color:#E03C3A'"
                >{{ item.status === 1 ? "已处理" : "未处理" }}</span
              >
            </p>
            <p class="content">维保内容：{{ item.content }}</p>
            <p class="content">
              维保结果：{{ item.result ? item.result : "无" }}
            </p>
          </TimelineItem>
          <h1
            v-if="allNum === 0"
            style="font-size: 16px; color: #999"
          >
            暂无数据...
          </h1>
        </Timeline>
        <h1 class="btn" @click="more" v-if="allNum > 5">
          点击加载更多
        </h1>
      </div>
    </div>

    <Modal
      id="mac"
      title="选择设备"
      :close-on-click-modal="false"
      custom-class="custom-select-dialog"
      :before-close="handleCancel"
      v-model="selectFlag"
      width="75%"
    >
      <div>
        <Form :model="ruleForm" ref="ruleForm" class="rule-form">
          <FormItem>
            <Row :gutter="16">
              <Col :span="4" class="left-padding-right">
                <Input v-model="ruleForm.build" placeholder="楼栋"></Input>
              </Col>
              <Col :span="4" class="left-padding-right ml-5">
                <Input v-model="ruleForm.unit" placeholder="单元"></Input>
              </Col>
              <Col :span="4" class="left-padding-right ml-5">
                <Input v-model="ruleForm.mac" placeholder="设备号"></Input>
              </Col>
              <Col :span="8">
                <Button type="primary" @click="handleSearch">查询</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
        <Table
          class="mt-20 device-wrap"
          :data="boxesData"
          :columns="boxesColumn"
          @on-selection-change="handleSelectionChange"
        >
          <template slot-scope="{ row }" slot="mac">
            <div>{{ row.mac }}</div>
            <div>{{ row.name }}</div>
          </template>
          <template slot-scope="{ row }" slot="position">
            <div>
              {{
                row.build +
                "\xa0\xa0\xa0" +
                row.unit +
                "\xa0\xa0\xa0" +
                row.room
              }}
            </div>
          </template>

          <template slot-scope="{ row }" slot="status">
            <span v-show="row.others.online === -1" class="c-info">脱线</span>
            <span v-show="row.others.online === 0" class="c-danger">离线</span>
            <span v-show="row.others.online === 1" class="c-success">在线</span>
          </template>

          <template slot-scope="{ row }" slot="operating">
            <Button style="color: #409eff" type="text" @click="handleMac(row)"
              >选择设备</Button
            >
          </template>
        </Table>
      </div>
      <span slot="footer" style="height: 60px">
        <Row>
          <Col :span="24" class="tc">
            <Page
              @on-page-size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size-opts="[20, 50, 100]"
              :page-size="20"
              layout="sizes, prev, pager, next"
              :total="total"
            >
            </Page>
          </Col>
        </Row>
      </span>
    </Modal>
  </div>
</template>

<script>
    import { inquireDetail, pushinput } from '@/api/multiManage/workOrder';
    import { queryBoxes } from '@/api/multiManage/batchConfig';
    export default {
        data () {
            return {
                allNum: 0,
                formValidate: {
                    content: '',
                    result: '',
                    mac: '',
                    malfunctionContent: '',
                    suggest: '',
                    date: this.$Date().format('YYYY-MM-DD HH:mm')
                },
                changeName: false,
                ruleValidate: {
                    malfunctionContent: [
                        {
                            // 为空的时候
                            required: true,
                            message: '内容不能为空', // 提示文字
                            trigger: 'blur' // 失去焦点
                        },
                        {
                            // 最少输入的数据
                            type: 'string',
                            min: 5,
                            message: '至少输入5个字',
                            trigger: 'blur'
                        }
                    ],
                    content: [
                        {
                            // 为空的时候
                            required: true,
                            message: '内容不能为空', // 提示文字
                            trigger: 'blur' // 失去焦点
                        },
                        {
                            // 最少输入的数据
                            type: 'string',
                            min: 5,
                            message: '至少输入5个字',
                            trigger: 'blur'
                        }
                    ],
                    date: [
                        {
                            required: true,
                            type: 'date',
                            message: '请输入日期',
                            trigger: 'change'
                        },
                        {
                            // 为空的时候
                            required: true,
                            type: 'date',
                            message: '请选择日期', // 提示文字
                            trigger: 'blur' // 失去焦点
                        }
                    ],
                    mac: [
                        {
                            // 为空的时候
                            required: true,
                            message: '不能为空', // 提示文字
                            trigger: 'blur' // 失去焦点
                        }
                    ]
                },
                beforeImgData: { name: 'beforeImgFile' },
                date: '',
                action:
                    `${this.$func.ctxPaths()}/maintenance/imgUrl/before/upload.as?v=` +
                    new Date().getTime(),
                defaultList: [],
                visible: false,
                uploadList: '',
                datas: [],
                form: {
                    imgUrls: []
                },
                srcList: '',
                imgUrls: '',

                beforeImgData1: { name: 'afterImgFile' },
                date1: '',
                defaultList1: [],
                visible1: false,
                uploadList1: '',
                datas1: [],
                form1: {
                    imgUrls: []
                },
                srcList1: '',
                imgUrls1: '',
                ruleForm: {
                    mac: '',
                    build: '',
                    unit: ''
                },
                boxesColumn: [
                    {
                        title: '设备号',
                        slot: 'mac',
                        align: 'center'
                    },
                    {
                        title: '位置',
                        slot: 'position',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'status',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operating',
                        align: 'center'
                    }
                ],
                selectFlag: false,
                devices: [],
                boxesData: [],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                OtherName: '先选择设备',
                size: 5,
                id: ''
            };
        },
        methods: {
            handleView (name) {
                this.imgUrls = name
                this.visible = true;
            },
            handleRemove () {
                this.uploadList = ''
                // const fileList = this.$refs.upload.fileList;
                // this.uploadList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                this.uploadList = file.response.data // { imgUrl: this.imgUrls, imgUrls: file.response.data }

                if (res.success) {
                    this.form.imgUrls[0] = res.data;
                    this.form.imgUrls[1] =
                        this.form.imgUrls[1] === undefined
                            ? (this.form.imgUrls[1] = '')
                            : this.form.imgUrls[1];
                } else if (res.code === '-1') {
                } else {
                    this.$Message.error(res.message);
                }
            },
            handleFormatError (file) {
                this.$Message.error('上传文件格式错误');
            },
            handleMaxSize (file) {
                // 超过2M
                this.$Message.error('图片不能大于2M');
            },
            handleBeforeUpload (file) {
                this.imgUrls = URL.createObjectURL(file);
                // const check = this.uploadList.length < 3;
                // if (!check) {
                //     this.$Notice.warning({
                //         title: '上传图片不能多于3张'
                //     });
                // }
                // return check;
            },
            handleView1 (name) {
                this.visible1 = true;
            },
            handleRemove1 (file) {
                this.uploadList1 = ''
                //
                //
                // const fileList = this.$refs.upload1.fileList;
                // this.uploadList1.splice(fileList.indexOf(file), 1);
            },
            handleSuccess1 (res, file) {
                this.uploadList1 = file.response.data// .push({ imgUrl: this.imgUrls1, imgUrls: file.response.data })
                if (res.success) {
                    this.form1.imgUrls[0] = res.data;
                    this.form1.imgUrls[1] =
                        this.form1.imgUrls[1] === undefined
                            ? (this.form1.imgUrls[1] = '')
                            : this.form1.imgUrls[1];
                            // this.srcList = [this.imageUrl]
                } else if (res.code === '-1') {
                } else {
                    this.$Message.error(res.message);
                }
            },
            handleFormatError1 (file) {
                this.$Message.error('上传文件格式错误');
            },
            handleMaxSize1 (file) {
                // 超过2M
                this.$Message.error('图片不能大于2M');
            },
            handleBeforeUpload1 (file) {
                this.imgUrls1 = URL.createObjectURL(file);
                // const check = this.uploadList.length < 3;
                // if (!check) {
                //     this.$Notice.warning({
                //         title: '上传图片不能多于3张'
                //     });
                // }
                // return check;
            },
            cancel () {
                this.id = ''
                this.uploadList = '';
                this.uploadList1 = '';
                this.OtherName = '请先选择设备';
                this.datas = [];
                this.allNum = 0
                this.formValidate = {
                    content: '',
                    result: '',
                    mac: '',
                    malfunctionContent: '',
                    suggest: '',
                    date: this.$Date().format('YYYY-MM-DD HH:mm')
                }
                this.$emit('send', 2);
                // this.$refs['formValidate'].resetFields();
            },
            completeInput () {
                this.date === ''
                    ? (this.date = this.$Date().format('YYYY-MM-DD'))
                    : (this.date = this.date);
                // let urlArr = [];
                // let urlArr1 = [];
                //
                // this.uploadList.forEach((item) => {
                //     // this.urlArr = item.imgUrl
                //     urlArr.push(item.imgUrls);
                // });
                // this.uploadList1.forEach((item) => {
                //     // this.urlArr = item.imgUrl
                //     urlArr1.push(item.imgUrls);
                // });

                let imgUrls = this.uploadList + ';' + this.uploadList1 // JSON.stringify(urlArr) + ';' + JSON.stringify(urlArr1);
                let params = {
                    maintenanceContent: this.formValidate.content,
                    malfunctionContent: this.formValidate.malfunctionContent,
                    handledResult: this.formValidate.result,
                    suggest: this.formValidate.suggest,
                    maintenanceTime: this.date,
                    imgUrls,
                    projectCode: this.$store.state.projectCode,
                    mac: this.formValidate.mac,
                    id: this.id,
                    alarmId: ''
                };
                //
                if (params.mac === '') {
                    this.$Message.error('请选择维保设备');
                }
                if (params.maintenanceContent === '') {
                    this.$Message.error('维保内容不能为空');
                }
                if (params.maintenanceTime === '') {
                    this.$Message.error('维保日期不能为空');
                }
                if (params.malfunctionContent === '') {
                    this.$Message.error('故障内容不能为空');
                }
                if (params.maintenanceContent < 5) {
                    this.$Message.error('维保内容不能少于5个字');
                }
                if (params.malfunctionContent < 5) {
                    this.$Message.error('故障内容不能少于5个字');
                }

                if (
                    params.mac !== '' &&
                    params.maintenanceContent !== '' &&
                    params.maintenanceTime !== '' &&
                    params.malfunctionContent !== '' &&
                    params.maintenanceContent.length >= 5 &&
                    params.malfunctionContent.length >= 5
                ) {
                    pushinput(params).then((res) => {
                        if (res.success) {
                            this.$Message.success(res.message);
                            this.cancel()
                        } else { this.$Message.error(res.message); this.cancel() }
                    });
                }
            },
            getdate (e) {
                this.date = e;
            },
            handleSelectionChange (val) {
                if (val.length === 0) {
                    this.selectionFalg = true;
                } else {
                    this.selectionFalg = false;
                }
                this.selectData = val;
            },
            handleMac (row) {
                this.formValidate.mac = row.mac;
                this.OtherName = row.name;
                this.selectFlag = false;
                this.HistoryData(row.mac);
            },
            getMac () {
                this.queryList();
                this.selectFlag = true;
            },
            handleCancel () {
                this.ruleForm = {
                    mac: '',
                    build: '',
                    unit: ''
                };
                this.currentPage = 1;
                this.selectFlag = false;
            },
            handleSearch () {
                this.currentPage = 1;
                this.queryList(
                    this.ruleForm.build,
                    this.ruleForm.unit,
                    this.ruleForm.mac
                );
            },
            queryList (build, unit, mac) {
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    projectCode: this.$store.state.projectCode
                };
                if (build) params.build = build;
                if (unit) params.unit = unit;
                if (mac) params.key = mac;
                queryBoxes(params)
                    .then((res) => {
                        if (res.success) {
                            this.total = res.total;
                            this.boxesData = res.datas;
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
            handleCurrentChange (val) {
                if (this.selectData.length > 0) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '是否保存当前页所勾选设备？',
                        onOk: () => {
                            if (this.devices.length > 0) {
                                this.devices.forEach((item) => {
                                    this.selectData = this.selectData.filter(
                                        (keyItem) => keyItem.mac !== item.mac
                                    );
                                });
                                this.devices = this.devices.concat(this.selectData);
                            } else {
                                this.devices = this.selectData;
                            }
                            this.$Message.success({
                                coontent: '保存成功！'
                            });
                            this.currentPage = val;
                            this.queryList(
                                this.ruleForm.build,
                                this.ruleForm.unit,
                                this.ruleForm.mac
                            );
                        },
                        onCancel: () => {
                            this.$Message.info({
                                coontent: '取消保存'
                            });
                            this.currentPage = val;
                            this.queryList(
                                this.ruleForm.build,
                                this.ruleForm.unit,
                                this.ruleForm.mac
                            );
                        }
                    });
                } else {
                    this.currentPage = val;
                    this.queryList(
                        this.ruleForm.build,
                        this.ruleForm.unit,
                        this.ruleForm.mac
                    );
                }
            },
            handleSizeChange (val) {
                this.pageSize = val;
                this.queryList(
                    this.ruleForm.build,
                    this.ruleForm.unit,
                    this.ruleForm.mac
                );
            },
            HistoryData (mac) {
                let params = {
                    workOrderType: 1,
                    mac,
                    pageNo: 1,
                    pageSize: this.size
                };

                inquireDetail(params).then((res) => {
                    this.allNum = res.total;
                    this.datas = res.datas;
                });
            },
            more () {
                if (this.size >= this.allNum) {
                    this.$Message.error('没有更多的数据了');
                } else {
                    this.size += 5;
                    this.HistoryData(this.formValidate.mac);
                }
            }
        },
        mounted () {
            // this.uploadList = this.$refs.upload.fileList;
            // this.uploadList1 = this.$refs.upload1.fileList;;
        },
        watch: {
            inpdata: {
                handler (newVal, oldVal) {
                    if (newVal && this.isbz) {
                        this.formValidate = newVal;
                        this.formValidate.date = newVal.createTime;
                        this.date = newVal.createTime;
                        //
                        this.id = newVal.id;
                        this.changeName = true
                        //
                        this.OtherName = newVal.macName;
                        this.HistoryData(newVal.mac);
                        this.OtherName = newVal.macName;
                        if (newVal.imgUrls === '' || newVal.imgUrls === undefined) {
                            return false;
                        } else {
                            let arr = newVal.imgUrls.split(';');

                            this.uploadList = arr[0]
                            this.uploadList1 = arr[1]
                            // if (newVal.imgUrls !== '') {
                            //     let arr = '';
                            //     arr = newVal.imgUrls.split(';');
                            //
                            //     if (arr[0][0] === '[') {
                            //         JSON.parse(arr[0]).forEach((item, index) => {
                            //             this.uploadList[index] = { imgUrl: item, imgUrls: item };
                            //         });
                            //     } else if (arr[0] === '') {
                            //     } else {
                            //         //
                            //         //
                            //         this.uploadList = [{ imgUrl: arr[0], imgUrls: arr[0] }];
                            //         // this.uploadList[0].imgUrl = arr[0];
                            //         // this.uploadList[0].imgUrls = arr[0]
                            //
                            //     }
                            //     if (arr[1][0] === '[') {
                            //         // 数组
                            //
                            //         JSON.parse(arr[1]).forEach((item, index) => {
                            //             this.uploadList1[index] = { imgUrl: item, imgUrls: item };
                            //         });
                            //
                            //     } else if (arr[1] === '') {
                            //         return false;
                            //     } else {
                            //         this.uploadList1[0] = { imgUrl: arr[0], imgUrls: arr[0] };
                            //     }
                            // } else return false;
                        }
                    }
                },
                deep: true
            },
            isbz: {
                handler (newVal) {
                    this.isbz = newVal
                }
            }
        },
        props: {
            inpdata: {
                type: Object,
                default () {
                    return {};
                }
            },
            isbz: {
                type: Boolean,
                default () {
                    return {};
                }
            }
        }
    };
</script>

<style lang='less' scoped>
#maintenance{
  .ivu-timeline-item-head-custom {
  width: 0px !important;
}
.ivu-timeline-item-tail {
  margin-left: 16px;
}

.icon {
  font-size: 20px;
  margin: 25px;
  margin-bottom: -20px;
  // background-color: #fff!important;
  z-index: 555;
  background-color: rgb(9, 15, 25);
}
.top {
  margin-top: 50px;
  float: right;
  margin-right: 10px;
}
.mainM {
  width: 100%;
  // margin-top: -40px;
  display: flex;
  .left {
    width: 50%;
      background-color: #1a202e;
    h2 {
      margin-top: 20px;
      margin-left: 20px;
      font-size: 18px;
      font-family: PingFangSC-Regular;
      font-weight: Regular;
    }
    .inputdata {
      width: 500px;
      // margin-left: 100px;
      margin-top: 20px;
    }
    .MT {
      margin-top: 10px;
    }
  }
  .right {
    width: 50%;
    // height: 750px;
    // margin-top: -40px;
    background-color: #1a202e;
    .historydata {
      // width: 100%;
      // background-color: #28313F ;
      height: 650px;
      overflow: auto;
      margin-left: 20px;
    }
    h2 {
      width: 100%;
      // height: 120px;
      margin-bottom: -20px;
      line-height: 86px;
      font-size: 18px;
      font-family: PingFangSC-Regular;
      font-weight: Regular;
    }
    .btn {
      margin-left: 250px;
      color: #fff;
      cursor: pointer;
    }
  }
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.time {
  // background: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: bold;
}
.content {
  // background-color: red;
  //  background-color: rgb(9, 15, 25);
  padding-left: 5px;
}

.ivu-timeline-item-content {
  padding: 5px 21px 13px 41px;
  font-size: 14px;
  position: relative;
  top: -3px;
}
.ivu-timeline-item-head {
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid transparent;
  position: absolute;
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
  background-color: #1a202e;

}
}
</style>
