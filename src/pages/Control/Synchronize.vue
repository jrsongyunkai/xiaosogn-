<template>
  <div>
      <div class="header">
          说明：将场景中的定时下发配置到设备端
      </div>
    <Row class="funcontent">
        <Col :span="12">
            <Button type="text" class="c-default" @click="handleBack"><Icon type="ios-arrow-back" />返回</Button>
        </Col>
        <Col :span="12">
            <Form ref="form" @submit.native.prevent :inline="true" :model="form" class="tr">
        <FormItem>
          <Input v-model="form.mac" @keyup.enter.native="queryList" placeholder="请输入设备号"></Input>
        </FormItem>
        <FormItem>

          <Button type="primary" @click="queryList">查询</Button>
          <Button style="margin-left:10px" @click="empty">重置</Button>
        </FormItem>
      </Form>
        </Col>
    </Row>
    <Row class="table">
        <div class="tableHeader">
            <span>推送列表</span>
            <Button :disabled="syncDisable" @click="handleSyncToDevice">
                批量推送到设备
            </Button>
        </div>
    <Col :span="24">
      <Table
      :data="syncData"
      :columns="synccolumns"
      ref="multipleTable"
      @on-sort-change="sortChange"
      @on-selection-change="handleSelectionChange">
        <template slot-scope="{row}" slot="others.address">
          {{row.others.address}}
        </template>

          <template slot-scope="{row}" slot="mac">
            <div>{{ row.mac }}</div>
            <div>{{ row.others.name }}</div>
          </template>
          <template slot-scope="{row}" slot="others.titles">
              {{row.others.titles}}
          </template>

           <template slot-scope="{row}" slot="status">
              <span v-if="row.status === 0" class="c-success">分闸</span>
              <span v-else class="c-danger">合闸</span>
           </template>

          <template slot-scope="{row}" slot="pushDownStatus">
            <span :class="row.pushStatus === 0 ? 'b-danger' : 'b-success'" @click="toBuiltIn(row)" >{{ row.pushStatus === 0 ? "未下发" : ("已推送" + '(' + row.pushTime + ')') }}</span>
          </template>

          <template slot-scope="{row}" slot="action">
            <Button  type="text" :disabled="row.others.syncFlag === '1'" @click="handleSync(row.id, row)">
                <span class="c-primary">推送</span>
              <span class="c-primary" v-if="row.others.syncFlag === '1'">{{ '(' + "推送中" + ')' }}</span>
              <span class="c-notProcess" v-if="row.others.syncFlag === '2'">{{ '(' + "未生效" + ')' }}</span>
            </Button>
          </template>
      </Table>
    </Col>
    </Row>

    <Col class="tc mt-5 page" >

      <Page
            @on-page-size-change ="handleSizeChange"
            :page-size = pageSize
            :page-size-opts="[10, 20, 30]"
            @on-prev ="handleCurrentChange('prev')"
            @on-next ="handleCurrentChange('next')"
        >
      </Page>
    </Col>
  </div>
</template>
<script>
    import { queryListData, queryListsync } from '@/api/control/index'
    export default {
        props: ['paramsId'],
        data () {
            return {
                form: {
                    mac: ''
                },
                syncDisable: false,
                currentPage: 1,
                pageSize: 20,
                syncData: [],
                synccolumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '地点',
                        slot: 'others.address',
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        slot: 'mac',
                        align: 'center'
                    },
                    {
                        title: '线路',
                        slot: 'others.titles',
                        align: 'center'
                    },
                    {
                        title: '周期',
                        key: 'weekday',
                        align: 'center'
                    },
                    {
                        title: '时间',
                        key: 'time',
                        align: 'center'
                    },
                    {
                        title: '动作',
                        slot: 'status',
                        align: 'center'
                    },
                    {
                        title: '下推的状态',
                        slot: 'pushDownStatus',
                        width: 210,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 210,
                        align: 'center'
                    }
                ],
                multipleSelection: []

            }
        },
        mounted () {
            this.queryList()
        },
        methods: {
            queryList () {
                this.$nextTick(() => {
                    this.$refs.multipleTable.clearCurrentRow()
                })
                this.currentPage = 1
                this.queryListDatas()
            },
            queryListDatas (prop, order) {
                let params = {
                    pageSize: this.pageSize,
                    pageNo: this.currentPage,
                    params: {
                        sceneId: this.paramsId,
                        mac: this.form.mac
                    }
                }
                if (prop) {
                    params.sortName = prop
                    if (order === 'ascending') {
                        params.order = 'asc'
                    } else if (order === 'descending') {
                        params.order = 'desc'
                    }
                }
                queryListData(params)
                    .then(res => {
                        this.syncDisable = true
                        if (res.success) {
                            this.syncData = res.datas
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                })
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                })
                            }
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
            sortChange ({ column, prop, order }) {
                this.queryListDatas(prop, order)
            },
            toBuiltIn (row) {
                if (row.pushStatus === 1) {
                    this.$router.push({
                        name: 'BuiltInTiming',
                        params: {
                            mac: row.mac
                        }
                    })
                }
            },
            handleBack () {
                this.$emit('handleBatchBack')
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
                this.syncDisable = val.length > 0 ? !1 : !0
            },
            handleSyncToDevice () {
                let params = this.multipleSelection.map(item => {
                    return item.id
                })
                this.handleSync(params.toString(), this.multipleSelection)
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.queryList()
            },
            handleSync (id, row) {
                queryListsync({ ids: id })
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: '命令已提交，生效中..'
                            })
                            if (row.length > 1) {
                                row.forEach(element => {
                                    if (element.timerAutoid === 0) {
                                        element.others.syncFlag = '1'
                                    }
                                })
                            } else {
                                row.others.syncFlag = '1'
                            }
                        } else if (res.code === '-1') {
                        } else {
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        this.$Message.success({
                                            content: elem.mac + '：' + '生效中..'
                                        })
                                        row.map(element => {
                                            if (elem.mac === element.mac && element.timerAutoid === 0) {
                                                element.others.syncFlag = '1'
                                            }
                                        })
                                    } else {
                                        this.$Message.error({
                                            content: elem.mac + '：' + elem.errorMsg
                                        })
                                    }
                                }
                            } else {
                                this.$Message.error({
                                    content: res.message
                                })
                            }
                        }
                    })
            },
            handleCurrentChange (e) {
                if (e === 'home') {
                    this.currentPage = 1
                } else if (e === 'prev') {
                    if (this.currentPage !== 1) {
                        this.currentPage -= 1
                    } else {
                        return false
                    }
                } else if (e === 'next') {
                    this.currentPage += 1
                }
                this.queryListDatas()
            },
            empty () {
                this.form.mac = ''
                this.queryList()
            }
        },
        watch: {

        }
    }
</script>
<style lang="less" scoped>
.header{
    background: rgba(153, 153, 153, 0.05);
    border: 1px solid #999999;
    padding: 10px;
}
.funcontent{
    margin-top: 10px;
    padding: 20px;
    background: #1a202e;
    .ivu-btn-primary{
        background: #007eff;
    }
}
/deep/.ivu-form-item{
    margin-bottom:0px
}
.table{
    margin-top: 10px;
    background: #1a202e;
    padding: 20px;
}
.tableHeader{
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
    span{
        font-size: 16px;
        font-family: PingFang SC;
    }
    Button{
        // background: #007eff;
        color: #999 !important;
    }
}
.page{
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
  button{
    margin-right: 10px;
  }
  .ivu-page{
      padding: 0;
  }
}
</style>
