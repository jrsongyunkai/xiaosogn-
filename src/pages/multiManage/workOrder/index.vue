<template>
  <div>
    <div v-show="isShow" >
      <div class="blocksss" ref="top">
        <Input
            placeholder="输入工单号或者处理人"
            v-model="device"
            :clearable='true'
            style="width: 200px;margin-left:20px"
          />

          <DatePicker
              type="datetimerange"
              :value='days'
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择日期"
              style="width: 300px;margin-left:10px"
              @on-change="getdate"
              :editable='false'
              :clearable="true"
            ></DatePicker>

          <Select :clearable='true' v-model="model1" style="width: 100px;margin-left:10px" placeholder="请选择">
            <Option
              v-for="item in cityList1"
              :value="item.value"
              :key="item.value"
              >{{ item.type }}</Option
            >
          </Select>
          <Select :clearable='true' v-model="model2" style="width: 100px;margin-left:10px" placeholder="请选择">
            <Option
              v-for="item in cityList2"
              :value="item.value"
              :key="item.value"
              >{{ item.type }}</Option>
          </Select>
          <Button @click="search" type="primary" class="btnb">查询</Button>
          <Button @click="reset" style="margin-left:10px">重置</Button>
          <Button @click="output" class="outputs" >
            <Icon
                custom="icon-v5 icon-v5-daochu"
                size="18"
                @click="output"
              />
          </Button>
        </div>
      <!-- 表格部分 -->
      &nbsp;
      <div class="table" >
        <!-- 表格 -->
        <h2 style="float:left">工单管理</h2>
        <div  style="float:right">

          <Button  type="primary" class="btnb" @click="switchs(1,true)">新建巡检工单</Button>
          &nbsp;
          <Button  type="primary" class="btnb" @click="switchs(2,true)">新建维保工单</Button>
        </div>
        <br><br>
        <Table
          :data="tableData1"
          :columns="tableColumns1"
          :height="520"
          :disabled-hover="true"
          ref="table"
        >
        <template slot="orderNumber" slot-scope="{row}">
          <span>{{row.orderNumber.toUpperCase()}}</span>
        </template>
          <template slot="status" slot-scope="{row}">
            <!-- {{row.status}} -->
            <p  :style="row.status==='处理中'?'color:#FFA854;background:rgba(255, 168, 84,.1);width:54px;text-align: center;height:20px':'color:#0DD667;background:rgba(13, 214, 103,.1);width:54px;text-align: center;height:20px'">{{row.status}}</p>
            <!-- <p style="">{{row.status}}</p> -->
          </template>
        </Table>
        <!-- 分页 -->

        <div style="margin: 10px 10px 0 10px; overflow: hidden">
          <div style="float: right">
            <Page
              show-total
              :current="params.pageNo"
              @on-change="changePage"
              :total="total"
              show-elevator
            />
          </div>
        </div>
      </div>
    </div>
    <checkInput v-if="isCI" @send2="check" :inpdata='inpdata1' :isbz='bzFlag' />
    <maintenanceInput v-if="isMI" @send="check" :inpdata='inpdata' :isbz='bzFlag1' />
    <Modal
      v-model="modal"
      class-name="vertical-center-modal"
      width="600"
      :footer-hide="true"
    >
      <div class="main" :style="detail.workOrderType === '0'|| detail.workOrderType === 0?'height:300px':'height:450px'">
        <div class="modalL">
          <p>位置：{{ detail.addres }}</p>
          <p>
            <span>内容：</span><b>{{ detail.content }}</b>
          </p>
          <p>创建时间：{{ detail.createTime }}</p>
          <p v-if='detail.workOrderType === "0"|| detail.workOrderType === 0'>
            <span>巡检图片：</span>
            <span v-if="!detail.imgUrls">暂无</span>
            <!-- :src="detail.imgUrls" -->
            <img
              v-else
              v-for="(item) in detail.imgUrls"
              :key = item
              style="margin-left:5px"
              :src="item"
              alt=""
            />
          </p>
          <p v-else>
            <span>维保前图片：</span>
            <span v-if="!detail.imgUrls1">暂无</span>
            <img
              refs='before'
              v-else
              :src= detail.imgUrls1
              alt=""
              style="margin-left:5px"
            />
            <br><br>
            <span>维保后图片：</span>
            <span v-if="!detail.imgUrls2">暂无</span>
            <img
              v-else
              refs='after'
              style="margin-left:5px"
              :src= detail.imgUrls2
              alt=""
            />
          </p>
        </div>
        <div class="modalR">
          <p>设备号：{{ detail.mac }}</p>
          <p>设备别名：{{ detail.macName }}</p>
          <p style="float:left;">状态：</p>
          <p :style="detail.status === 0||detail.status === '0' ?'float:left;color:#FFA854;background:rgba(255, 168, 84,.1);width:54px;text-align: center;height:20px':'float:left;color:#0DD667;background:rgba(13, 214, 103,.1);width:54px;text-align: center;height:20px'">{{ detail.status === 0||detail.status === "0" ? "处理中" : "已处理" }}</p>
          <p></p>
          <p>
            工单类型：{{
              detail.workOrderType === "0"|| detail.workOrderType === 0  ? "巡检工单" : "维保工单"
            }}
          </p>
        </div>
      </div>
      <div slot="footer"></div>
      <div slot="header">
        <h3>工单详情</h3>
      </div>
    </Modal>
  </div>
</template>
<script>
// 新建工单的组件
    import checkInput from './checkInput.vue';
    import maintenanceInput from './maintenanceInput.vue';

    // 引入表格数据的api
    import { detailInput, inquireInput } from '@/api/multiManage/workOrder';
    export default {
        data () {
            return {
                data: [],
                days: [this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00', this.$Date().format('YYYY-MM-DD hh:mm:ss')],
                mouths: '',
                cityList1: [
                    {
                        value: 2,
                        type: '全部'
                    },
                    {
                        value: 0,
                        type: '巡检工单'
                    },
                    {
                        value: 1,
                        type: '维保工单'
                    }
                ],
                cityList2: [
                    {
                        value: 2,
                        type: '全部'
                    },
                    {
                        value: 0,
                        type: '处理中'
                    },
                    {
                        value: 1,
                        type: '已处理'
                    }
                ],
                model1: '',
                model2: '',
                device: '',
                tableData1: [],
                inpdata: {},
                inpdata1: {},
                tableColumns1: [
                    {
                        title: '序号',
                        key: 'number',
                        width: 80
                    },
                    { title: '工单号', slot: 'orderNumber' },
                    { title: '工单类型', key: 'workOrderType' },
                    { title: '设备号', key: 'mac' },
                    { title: '设备别名', key: 'macName' },
                    { title: '位置', key: 'addres' },
                    { title: '状态', slot: 'status' },
                    { title: '处理人', key: 'handlerName' },
                    { title: '创建时间', key: 'createTime', sortable: true, width: 170 },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px',
                                            color: '#007EFF'
                                        },
                                        on: {
                                            click: () => {
                                                let typeid = '';
                                                params.row.workOrderType === '巡检工单'
                                                    ? (typeid = 0)
                                                    : (typeid = 1);
                                                let id = params.row.id;
                                                detailInput({ typeid, id }).then((res) => {
                                                    // 详情数据
                                                    this.modal = false;
                                                    this.detail = res.data;
                                                    this.modal = true;
                                                    //
                                                    if (!this.detail.imgUrls && params.row.workOrderType === '巡检工单') {
                                                        this.detail.imgUrls = ''
                                                    } else if (this.detail.imgUrls && params.row.workOrderType === '巡检工单') {
                                                        this.detail.imgUrls = this.detail.imgUrls.split(';')
                                                    }
                                                    if (!this.detail.imgUrls && params.row.workOrderType === '维保工单') {
                                                        this.detail.imgUrls = ''
                                                    } else if (params.row.workOrderType === '维保工单') {
                                                        //
                                                        let arr = this.detail.imgUrls.split(';')
                                                        this.detail.imgUrls1 = arr[0]
                                                        this.detail.imgUrls2 = arr[1]
                                                        // if (this.detail.imgUrls[0] === '[') { // 数组形式
                                                        //     this.detail.imgUrls.split(';')[0] ? this.detail.imgUrls1 = JSON.parse(this.detail.imgUrls.split(';')[0]) : this.detail.imgUrls1 = []
                                                        //     this.detail.imgUrlthis.inpdata1s.split(';')[1] ? this.detail.imgUrls2 = JSON.parse(this.detail.imgUrls.split(';')[1]) : this.detail.imgUrls2 = []
                                                        // } else {
                                                        //     let arr = this.detail.imgUrls.split(';')
                                                        //     if (arr[0] !== '') this.detail.imgUrls1 = [arr[0]]
                                                        //     if (arr[1] !== '') this.detail.imgUrls1 = [arr[1]]
                                                        // }
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    '工单详情'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px',
                                            color: '#007EFF'
                                        },
                                        on: {
                                            click: () => {
                                                //
                                                let typeid = '';
                                                params.row.workOrderType === '巡检工单'
                                                    ? (typeid = 0)
                                                    : (typeid = 1);
                                                this.switchs(typeid + 1, false)
                                                let id = params.row.id;
                                                detailInput({ typeid, id }).then((res) => {
                                                    // 详情数据
                                                    //
                                                    if (params.row.workOrderType === '巡检工单') this.inpdata1 = res.data
                                                    else this.inpdata = res.data
                                                });
                                            }
                                        }
                                    },
                                    '编辑工单'
                                )
                            ]);
                        }
                    }
                ],
                total: 0,
                isShow: true,
                isCI: false,
                isMI: false,
                modal: false,
                detail: {},
                params: {
                    projectCodeList: [],
                    workOrderType: '',
                    status: '',
                    keyword: '',
                    startTime: this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00',
                    endTime: this.$Date().format('YYYY-MM-DD HH:mm:SS'),
                    pageNo: 1,
                    pageSize: 10
                },
                bzFlag: true,
                bzFlag1: true
            };
        },
        methods: {
            // inputType (e) {
            //     // 工单类型
            //     this.params.workOrderType = this.model1;
            //     this.getTableData();
            // },
            // inputState (e) {
            //     this.params.status = e;
            //     this.getTableData();
            // },
            search () {
                this.params.keyword = this.device;
                this.params.pageNo = 1
                this.model1 === 2 ? this.params.workOrderType = '' : this.params.workOrderType = this.model1;
                this.model2 === 2 ? this.params.status = '' : this.params.status = this.model2;

                this.getTableData();
            },
            reset () {
                this.params = {
                    workOrderType: '',
                    status: '',
                    keyword: '',
                    startTime: this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00',
                    endTime: this.$Date().format('YYYY-MM-DD HH:mm:SS'),
                    pageNo: 1,
                    pageSize: 10
                };
                if (this.$route.params.projectCode !== undefined) {
                    this.params.projectCodeList = [this.$route.params.projectCode]
                } else {
                    this.params.projectCodeList = [this.$store.state.projectCode]
                }
                this.model1 = '';
                this.model2 = '';
                this.days = [this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00', this.$Date().format('YYYY-MM-DD hh:mm:ss')]
                this.device = '';
                this.getTableData();
            },
            init () {
                //
                // this.days = this.$Date().format('YYYY-MM-DD');
                // this.mouths = this.$Date().format('YYYY-MM');

                //
                if (this.$route.params.projectCode !== undefined) {
                    this.params.projectCodeList = [this.$route.params.projectCode]
                    this.params.status = this.$route.params.status
                    this.params.workOrderType = this.$route.params.workOrderType
                    this.model1 = this.params.workOrderType;
                    this.model2 = this.params.status
                    this.params.startTime = this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00'
                    this.params.endTime = this.$Date().format('YYYY-MM-DD HH:mm:ss')
                    this.days = [this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00', this.$Date().format('YYYY-MM-DD HH:mm:ss')]
                } else {
                    //
                    this.params.projectCodeList = [this.$store.state.projectCode]
                }
                this.getTableData();
            },
            searchDevice () {
                // 搜索处理人或者工单号
                this.params.keyword = this.device;
                this.getTableData();
            },
            changePage (e) {
                // 改变页码
                this.params.pageNo = e;
                this.getTableData();
            },
            output () {
                let arr = this.days

                this.$func.windowCountDown(
                    `${this.$func.ctxPaths()}/wo/xls/export.as?st=${arr[0]}&et=${arr[1]}&projectCode=${this.$store.state.projectCode}`
                );
            },

            switchs (e, status) {
                if (e === 1) {
                    this.isShow = false;
                    this.isCI = true;
                    this.bzFlag = !status
                } else {
                    this.isShow = false;
                    this.isMI = true;
                    this.bzFlag1 = !status
                }
            },
            check (e) {
                if (e === 1) {
                    this.isShow = true;
                    this.isCI = false;
                } else {
                    this.isShow = true;
                    this.isMI = false;
                }
                this.init()
            },
            getTableData () {
                inquireInput(this.params).then((res) => {
                    // 列表数据

                    this.tableData1 = res.data.datas;
                    this.total = res.data.total;
                    //
                    for (let i = 0; i < this.tableData1.length; i++) {
                        this.tableData1[i].number = (i + 1) + ((this.params.pageNo - 1) * (this.params.pageSize))

                        if (this.tableData1[i].workOrderType === 0 || this.tableData1[i].workOrderType === '0') {
                            this.tableData1[i].workOrderType = '巡检工单';
                        } else this.tableData1[i].workOrderType = '维保工单';
                        //
                        if (this.tableData1[i].status === '1' || this.tableData1[i].status === 1) {
                            this.tableData1[i].status = '已处理';
                        } else this.tableData1[i].status = '处理中';
                    }
                });
            },
            getdate (e) {
                this.params.startTime = e[0];
                this.params.endTime = e[1];
                this.days = e

                //
                // this.getTableData()
            }
        },
        mounted () {
            this.init();
        },
        destroyed () {
            this.params = null
        },
        components: {
            checkInput,
            maintenanceInput
        },
        watch: {
            detail: {
                handler (newVal, oldVal) {
                    this.detail = newVal
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
        }
    };
</script>

<style lang="less" scoped>

.btnb{
  background:#007EFF;color:#fff;border:none;margin-left: 10px;
}

.blocksss {
  margin-top: 70px;
  overflow: hidden;
  background: #1a202e;
  height: 52px;
  line-height: 52px;
  .inp {
    width: 260px;
    height: 36px;
  }
  span {
    margin-left: 30px;
    margin-right: 10px;
  }
  .outputs{
    border: 1px solid #007EFF;padding:3px;color:#007EFF;margin-left:10px;width:36px;height:32px;background-color: rgba(0, 126, 255, 0.1);border-radius: 5px;
  }
}
.table {
  width: 100%;
  float: left;
  margin-top: 30px;
  background-color: #1A202E;background: #1a202e;margin-top:-10px;padding:20px;height:850px;
  h2{
    color: #fff;
    margin-bottom: -20px;
    width: 96px;
    height: 16px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    float: left;
    // margin-top: 15px;
  }
}
.echarts {
  margin-top: 30px;
}
.main {
  width: 750px;

  .modalL {
    float: left;
    width: 300px;
    height: 300px;
    margin-left: 5px;

    p {
      margin-top: 20px;
      height: 30px;
      b {
        float: left;
        width: 150px;
        // height: 30px;
        word-wrap: break-word;
        word-break: break-all;
        // font-weight: normal;
        overflow: hidden;
        // white-space: nowrap;
        text-overflow: ellipsis;
      }
      span {
        float: left;
      }
      img {
        width: 120px;
        height: 120px;
        // position: relative;
        // top:50px
      }
    }
  }
  .modalR {
    float: left;
    width: 250px;
    height: 300px;
    margin-left: 30px;
    p {
      margin-top: 20px;
      height: 30px;
    }
  }
}
.export{
    background: rgba(0, 126, 255, 0.1);
    width: 20px;
    height: 20px;
    border: 1px solid #007EFF;
    border-radius: 5px;
    display: inline-block;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    .ivu-icon{
        color: #007EFF;
        margin: 0 !important;
    }
}
</style>
