<template>
  <div id="CommandFeedback">
    <Row>
      <Col class="date" v-if="classFlag" :span="24">
        <Col class="left-padding-right ml-5">
          <DatePicker
          :editable="false"
            v-model="value1"
            :clearable='false'
            type="daterange">
          </DatePicker>
        </Col>
        <Col :span="4" class="left-padding-right ml-5" v-if="allInstructions">
          <Input v-model="allInstructionsMac" clearable  placeholder="请输入设备号"></Input>
        </Col>
        <Col :span="4" class="left-padding-right ml-5">
          <Button type="primary" @click="searchList">查询</Button>
        </Col>
      </Col>
      <Col class="mt-5" :span="24">
          <div>
            <Table
              :class="classFlag ? 'device-wrap' : ''"
              :data="tableData"
              :columns="columns"
              style="width: 100%">
               <template slot-scope="{row}" slot="paramDesc">
                  <div style="white-space: pre-line;">{{row.paramDesc }}</div>
                </template>
                <template slot-scope="row" slot="stage">
                  <span>{{ row.stage === 0 ? $t('table.launched') : row.stage === 1 ? "已下发" : row.stage === 2 ? "设备接收到了指令" : row.stage === 3 ? "发起查询" : row.stage === 4 ? "收到设备的结果响应" : "异常" }}</span>
                </template>
                <template slot-scope="row" slot="action">
                    <Button style="color: #409eff" type="text" @click="handleView(row)" >查看</Button>
                </template>
            </Table>
          </div>
      </Col>
      <Col class="tc mt-5">
        <Col :span="5" class="tr">
          <Page
            @on-page-size-change ="handleSizeChange"
            :page-size = pageSize
            :page-size-opts="[10, 20, 30]"
            :total = total
            @on-prev ="handleCurrentChange('prev')"
            @on-next ="handleCurrentChange('next')"
            >
            </Page>
        </Col>
      </Col>
      <Modal
      v-model="commandViewFlag"
      title="指令详细记录"
      custom-class="custom-select-Modal"
      width="1323px"
      >
        <Table
          class="device-wrap mt-10"
          :data="viewData"
          :columns="viewcolumns"
          style="width: 100%">
            <template slot-scope="{row}" slot="responseDesc">
              <span v-if="row.stage === 0">发起</span>
              <span v-else-if="row.stage === 1">已下发</span>
              <span v-else-if="row.stage === 2">设备接收到了指令</span>
              <span v-else-if="row.stage === 3">发起查询</span>
              <span v-else-if="row.stage === 4">收到设备的结果响应</span>
              <span v-else-if="row.stage === 9">异常</span>
            </template>
            <template slot-scope="{row}" slot="stage">
              <span v-if="row.stage === 0">正常</span>
              <span v-else-if="row.stage === 1">正常</span>
              <span v-else-if="row.stage === 2">正常</span>
              <span v-else-if="row.stage === 3">正常</span>
              <span v-else style="white-space: pre-line;">{{ row.responseDesc }}</span>
            </template>

        </Table>
        </Modal>
    </Row>
  </div>
</template>

<script>
    import { cmdFeedBack, cmdQueryHistory } from '../../api/common'
    export default {
        components: {},
        props: {
            instructionsData: {
                type: [Object, Array],
                default () {
                    return {}
                }
            },
            operateAt: {
                type: Number
            },
            classFlag: {
                type: Boolean
            },
            allInstructions: {
                type: Boolean
            },
            feedbackTime: {
                type: Array
            }
        },
        data () {
            return {
                tableData: [],
                columns: [
                    {
                        title: '位置',
                        key: 'location',
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '发起时间',
                        key: 'createTime',
                        align: 'center'
                    },

                    {
                        title: '指令描述',
                        slot: 'paramDesc',
                        align: 'center'
                    },
                    {
                        title: '电流执行状态',
                        slot: 'stage',
                        align: 'center'
                    },
                    {
                        title: '详细',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }

                ],
                viewData: [],
                viewcolumns: [
                    {
                        title: '时间',
                        key: 'stageTime',
                        align: 'center'
                    },
                    {
                        title: '命令阶段',
                        slot: 'responseDesc',
                        align: 'center'
                    },
                    {
                        title: '结果描述',
                        slot: 'stage',
                        align: 'center'
                    }

                ],
                commandViewFlag: false,
                allInstructionsMac: '',
                currentPage: 1,
                pageSize: 10,
                total: 0,
                lastId: '',
                prevId: [''],
                value1: ''
            }
        },
        created () {},
        mounted () {
            this.value1 = this.feedbackTime ? this.feedbackTime : [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
            this.init()
        },
        methods: {
            init () {
                this.queryList()
            },
            searchList () {
                if (this.allInstructions) {
                    this.instructionsData.mac = this.allInstructionsMac
                }
                this.lastId = ''
                this.queryList()
            },
            queryList () {
                let params = {
                    lastId: this.lastId,
                    pageSize: this.pageSize,
                    operateAt: this.operateAt,
                    mac: this.instructionsData.mac,
                    projectCode: this.instructionsData.projectCode,
                    operateParam: this.operateAt === 4 ? this.instructionsData.autoId : this.instructionsData.sceneId,
                    startTime: this.value1 ? this.$func.formatDate('yyyy-MM-dd', this.value1[0]) : '',
                    endTime: this.value1 ? this.$func.formatDate('yyyy-MM-dd', this.value1[1]) : ''
                }
                cmdFeedBack(params)
                    .then(res => {
                        if (res.success) {
                            this.total = res.total
                            this.tableData = res.data
                            if (res.data.length > 0 && res.data.length === this.pageSize) {
                                this.lastId = res.data[res.data.length - 1].id
                            } else {
                                this.lastId = ''
                            }
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.prevId = ['']
                this.lastId = ''
                this.currentPage = 1
                this.queryList()
            },
            handleCurrentChange (e) {
                if (e === 'home') {
                    this.prevId = ['']
                    this.lastId = ''
                    this.currentPage = 1
                } else if (e === 'prev') {
                    if (this.currentPage !== 1) {
                        this.currentPage -= 1
                        this.prevId.pop()
                        this.lastId = this.prevId[this.prevId.length - 1]
                    } else {
                        return false
                    }
                } else if (e === 'next') {
                    this.currentPage += 1
                    this.prevId.push(this.tableData[this.tableData.length - 1].id)
                }
                this.queryList()
            },
            handleView (row) {
                this.commandViewFlag = true
                let params = {
                    feedBackId: row.row.id
                }

                cmdQueryHistory(params)
                    .then(res => {
                        if (res.success) {
                            this.viewData = res.data
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
            },
            handleFeedBackList () {
                this.lastId = ''
                this.queryList()
            }
        },
        watch: {
            'feedbackTime': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.value1 = newVal
                    }
                    if (newVal === null) {
                        this.value1 = ''
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.device-wrap{
  border :none;
  color: #606266;
}
#CommandFeedback{
  Button{
    margin-left: 10px;
  }
  .ivu-row{
    .date{
      margin-bottom: 10px;
      display: flex;
    }
    .tc{
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-top: 20px;
      .tl{
        text-align: center;
        button{
          margin:0;
        }
      }
    }
  }
}
</style>
