<template>
  <div>
    <div class="top">

    </div>
    <div class="mainC">
      <div class="left">
        <h2>{{isbz?'编辑巡检工单信息':'新建巡检工单信息'}}</h2>
        <div class="inputdata">
          <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="130"
          >
            <FormItem label="巡检设备：" prop="mac" class="MT">
              <Input
                v-model="formValidate.mac"
                disabled
                placeholder="请选择"
                style="width: 250px"
              ></Input>
              &nbsp;&nbsp;<Button ghost type="primary" style="color:#007EFF;" @click="getMac"
                >选择设备</Button
              >
            </FormItem>

            <FormItem label="巡检设备别名：" class="MT">
              {{ OtherName }}
            </FormItem>

            <FormItem label="处理人：" prop="completeStaffName" class="MT">
              <Input
                v-model="formValidate.completeStaffName"
                placeholder="输入处理人名字"
                style="width: 350px"
              ></Input>
            </FormItem>
            <!-- 日期选择 -->
            <FormItem prop="date" label="巡检日期：" class="MT">
              <DatePicker
                type="datetime"
                v-model="formValidate.date"
                format="yyyy-MM-dd HH:mm"
                confirm
                placement="top"
                placeholder="请选择日期"
                style="width: 350px"
                @on-change='getdate'
                :editable="false"
              ></DatePicker>
            </FormItem>

            <FormItem label="巡检内容" prop="content" class="MT">
              <Input
                v-model="formValidate.content"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="输入巡检内容"
              ></Input>
            </FormItem>

            <FormItem label="巡检结果" prop="result" class="MT">
              <Input
                v-model="formValidate.result"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="输入巡检结果"
              ></Input>
            </FormItem>

            <FormItem class="MT" label="巡检照片">
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
                <template>
                  <img :src="uploadList ? uploadList : imgUrls" />
                  <div class="demo-upload-list-cover">
                    <!-- 获取大图 -->
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleView(uploadList)"
                    ></Icon>
                    <Icon
                      type="ios-trash-outline"
                      @click.native="handleRemove(item)"
                    ></Icon>
                  </div>
                </template>
              </div>
            </FormItem>
            <FormItem >
              <Button   style="background:#007EFF;border:none" type="primary"  @click="completeInput">完成</Button> &nbsp;
              <Button  @click="cancel">取消巡检</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <!-- <div></div> -->
      <div style="background-color: rgb(9, 15, 25);float:left;width:0.5%;height:100%"></div>
      <div class="right">
        <Timeline class="historydata">
          <h2>工单历史记录</h2>
          <TimelineItem v-for="item in datas" :key="item.id" :color="item.status===1?'#0DD667':'#E03C3A'">
            <span class="time" style="margin-bottom:50px;!important">{{ item.createTime }}</span>
            <p class="content">处理人：{{ item.handlerName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态：<span :style="item.status===1?'color:#0DD667':'color:#E03C3A'">{{item.status===1?'已处理':'未处理' }}</span></p>
            <p class="content">巡检内容：{{ item.content }}</p>
            <p class="content">
              巡检结果：{{ item.result ? item.result : "无" }}
            </p>
          </TimelineItem>

          <h1 v-if="allNum=== 0" style="font-size:16px;color:#999">暂无数据...</h1>
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
          <template slot-scope="{ row }" slot="macname">
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
              :total="total"

              :current="currentPage"
              :page-size = 10
              @on-change="changePage"
              show-elevator
            >
            </Page>
          </Col>
        </Row>
      </span>
    </Modal>
  </div>
</template>

<script>
    import { inquireDetail, createinput } from '@/api/multiManage/workOrder';
    import { queryBoxes } from '@/api/multiManage/batchConfig';
    export default {
        data () {
            return {
                formValidate: {
                    content: '',
                    result: '',
                    mac: '',
                    date: this.$Date().format('YYYY-MM-DD HH:mm'),
                    completeStaffName: ''
                },
                allNum: 0,
                ruleValidate: {
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

                    completeStaffName: [
                        {
                            // 为空的时候
                            required: true,
                            message: '处理人不能为空', // 提示文字
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
                imgName: '',
                visible: false,
                uploadList: '',
                datas: [],
                form: {
                    imgUrls: []
                },
                srcList: '',
                imgUrls: '',
                ruleForm: {
                    mac: '',
                    build: '',
                    unit: ''
                },
                boxesColumn: [
                    {
                        title: '设备号',
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '设备别名',
                        slot: 'macname',
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
                pageSize: 10,
                total: 0,
                OtherName: '先选择设备',
                size: 5
            };
        },
        methods: {
            handleView (imgurl) {
                this.imgUrls = imgurl;
                this.visible = true;
            },
            handleRemove (file) {
                this.uploadList = ''
                // const fileList = this.$refs.upload.fileList;
                // this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                // this.uploadList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                this.uploadList = file.response.data// .push({ imgUrl: this.imgUrls, imgUrls:  })
                //
                // if (res.success) {
                //     this.form.imgUrls[0] = res.data;
                //     this.form.imgUrls[1] =
                //         this.form.imgUrls[1] === undefined
                //             ? (this.form.imgUrls[1] = '')
                //             : this.form.imgUrls[1];
                //             // this.srcList = [this.imageUrl]
                // } else if (res.code === '-1') {
                // } else {
                //     this.$Message.error(res.message);
                // }
                //
                // if (this.uploadList.length === 0) this.uploadList = [{ imgUrl: this.imgUrls }]
                // else this.uploadList[this.uploadList.length - 1].imgUrl = this.imgUrls
                //
                // let that = this;
                // that.$nextTick(function () {
                //     // 不使用this.$nextTick()方法会报错
                //     that.uploadList[that.uploadList.length - 1].imgUrl = that.imgUrls;
                // });
            },
            handleBeforeUpload (file) {
                //
                this.imgUrls = URL.createObjectURL(file);
                // const check = this.uploadList.length < 3;
                // if (!check) {
                //     this.$Notice.warning({
                //         title: '不能超过3张图片'
                //     });
                // }
                // return check;
            },
            handleFormatError (file) {
                this.$Message.error('上传文件格式错误');
            },
            handleMaxSize (file) {
                // 超过2M
                this.$Message.error('图片不能大于2M');
            },
            // 上传图片

            cancel () {
                this.$emit('send2', 1);
                // for (const key in this.formValidate) {
                //     this.formValidate[key] = ' ';
                // }
                // this.formValidate = {
                //     content: '',
                //     result: '',
                //     mac: '',
                //     date: '',
                //     completeStaffName: ''
                // }
                this.$refs['formValidate'].resetFields();
                this.uploadList = '';
                this.allNum = 0
                // this.formValidate.date = this.$Date().format('YYYY-MM-DD HH:mm:ss');
                this.OtherName = '请先选择设备';
                this.datas = [];
            },
            completeInput () {
                this.date === ''
                    ? (this.date = this.$Date().format('YYYY-MM-DD'))
                    : (this.date = this.date);

                let urlArr = '';

                // this.uploadList.forEach((item) => {
                //     // this.urlArr = item.imgUrl
                //     urlArr += item.imgUrls + ';';
                // });
                urlArr = this.uploadList// urlArr.slice(0, urlArr.length - 1); // 去除最后一个字符 ;
                let params = {
                    projectCode: this.$store.state.projectCode,
                    macs: this.formValidate.mac,
                    content: this.formValidate.content,
                    completeStaffName: this.formValidate.completeStaffName,
                    completeTime: this.formValidate.date,
                    result: this.formValidate.result,
                    imgUrlList: urlArr,
                    id: this.id
                    // imgUrlList: 'blob:http://localhost:8080/347681f0-c9d0-4671-8c70-0e8af803ac43'
                };

                if (params.completeStaffName === '') {
                    this.$Message.error('处理人不能为空');
                }
                if (params.completeTime === '') {
                    this.$Message.error('巡检日期不能为空');
                }
                if (params.content === '') {
                    this.$Message.error('巡检内容不能为空');
                } else if (params.content.length < 5) {
                    this.$Message.error('巡检内容不能少于5个字');
                }
                if (params.macs === '') {
                    this.$Message.error('请选择设备');
                }

                if (
                    params.completeStaffName !== '' &&
                    params.completeTime !== '' &&
                    params.content !== '' &&
                    params.content.length >= 5 &&
                    params.macs !== ''
                ) {
                    // 进来保存
                    createinput(params).then((res) => {
                        if (res.success) {
                            this.$Message.success(res.message);
                            this.cancel()
                        } else {
                            this.$Message.error(res.message);
                            this.cancel()
                        }
                    });
                }
            },
            getdate (e) {
                this.date = e;
                this.formValidate.date = e;
                //
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
                //
                this.OtherName = row.name;
                this.selectFlag = false;
                this.HistoryData(row.mac);
            },
            changePage (e) {
                this.currentPage = e
                this.getMac()
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
                if (build) params.build = build
                if (unit) params.unit = unit
                if (mac) params.key = mac
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
            handleSizeChange (val) {
                // this.pageSize = val;
                // this.queryList(
                //     this.ruleForm.build,
                //     this.ruleForm.unit,
                //     this.ruleForm.mac
                // );
            },
            HistoryData (mac) {
                let params = {
                    workOrderType: 0,
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
            //
            this.HistoryData(this.inpdata.mac)
        },
        watch: {
            uploadList: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.uploadList = newVal

                        // for (let i = 0; i < newVal.length; i++) {
                        //     this.uploadList[i].imgUrl = newVal[i].imgUrl;
                        // }
                    }
                },
                deep: true
            },
            inpdata: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        //
                        // this.formValidate = newVal;
                        this.formValidate.content = newVal.content
                        this.formValidate.date = newVal.createTime;
                        this.OtherName = newVal.macName;
                        this.formValidate.completeStaffName = newVal.handlerName
                        this.OtherName = newVal.macName;
                        this.formValidate.mac = newVal.mac;
                        this.formValidate.result = newVal.result
                        // this.HistoryData(newVal.mac)
                        this.id = newVal.id;
                        if (newVal.imgUrls === undefined || newVal.imgUrls === '') return false
                        else this.uploadList = newVal.imgUrls
                        // let arr = '';
                        // if (newVal.imgUrls !== '') {
                        //     arr = newVal.imgUrls.split(';');
                        // }
                        // arr.forEach((item, index) => {
                        //     // this.uploadList[index] = {};
                        //     this.uploadList[index] = { imgUrl: item, imgUrls: item };
                        // });
                        //
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

.top {
  margin-top: 50px;
  float: right;
  margin-right: 10px;
}

.icon {
  font-size: 10px;
  // margin: 25px;
  // margin-bottom: -20px;
  width: 10px;
  height: 10px;
  // background-color: #fff!important;
  z-index: 555;
  background-color: rgb(9, 15, 25);
}
.mainC {
  width: 100%;
  height: 750px;
  float: right;
  margin-top: -40px;
  background-color: #1A202E;
  .left {
    float: left;
    width: 45%;
    // margin-top: 25px;
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
    float: left;
    width: 50%;
    height: 700px;
    // margin-left: 0.5%;
    .historydata {
      // width: 100%;
      // background-color: #28313F ;
      height: 650px;
      overflow: auto;
      margin-left: 20px;
    }

    p {
      // background-color: rgb(9, 15, 25);
      background-color: #1A202E;
    }
    h2 {
      width: 100%;
      // height: 120px;
      margin-bottom: -20px;
      // line-height: 120px;
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
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
}
.content {
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
  // background-color: #fff;
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
  background-color: #1A202E;
}
</style>
