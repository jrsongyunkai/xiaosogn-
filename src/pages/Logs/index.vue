<template>
  <div style="padding:20px">
    <Row class="header">
        <Col style="line-height:52px;margin-left:20px"><span class="span" @click="back">返回</span> &nbsp;>&nbsp; 操作日志</Col>
        <Col class="rightData">
              <span style="margin-right:10px">日期</span>
           <DatePicker type="daterange" placeholder="选择时间" style="width: 210px" separator=' 至 ' @on-change='datechange' v-model="dateArr"></DatePicker>
           <Select :clearable='true' v-model="model1" style="width: 210px;margin-left:10px"  placeholder="关联人员" @on-change='getstaffId' @on-clear='clearPeople'>
            <Option
              v-for="item in peopleList"
              :value="item.value"
              :key="item.staffId"
              >{{ item.value }}</Option
            >
          </Select>
          <Input placeholder="输入关键标识" style="width: 210px;margin-left:10px" v-model="params.keyword"></Input>
          <Button @click="search" type="primary" style="margin-left:10px" class="btnb">查询</Button>
          <Button @click="reset" style="margin-left:10px">重置</Button>
          <div class="export" >
          <Dropdown placement="bottom" @on-click="outputs">
            <a href="javascript:void(0)">
              <Icon custom="icon-v5 icon-v5-daochu" size="20" class="buts" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="current">导出当前页数据</DropdownItem>
              <DropdownItem name="all">导出全部数据</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        </Col>
    </Row>

    <div >
         <Table
          :data="tableData1"
          :columns="tableColumns1"
          :disabled-hover="true"
          ref="table"
        >
          <div slot="status" slot-scope="{row}">
            <Poptip content="content" placement="bottom" word-wrap>
                <Icon type="ios-eye-outline" @click.native="handleViewLogs(row)"></Icon>
                <div slot="content">
                    <json-viewer v-if="logsView" :value="logsView"></json-viewer>
                </div>
                <div slot="title">
                    参数结构
                </div>
            </Poptip>
          </div>
        </Table>
        <Button-group class="buttonGroup">
            <Button @click="handlePage('home')">首页</Button>
            <Button
                icon="el-icon-arrow-left"
                :disabled="params.pageNo === 1"
                @click="handlePage('prev')"
                >上一页
            </Button>
            <!-- :disabled="quantityData.length < quantityPageSize" -->
            <Button
                :disabled="tableData1 === undefined || tableData1.length !== 20"
                @click="handlePage('next')"
                >下一页<i class="el-icon-arrow-right el-icon--right"></i>
            </Button>
      </Button-group>
    </div>
  </div>
</template>

<script>
    import { queryOperateLog, findParamsById, queryFollwerByStaff } from '@/api/index.js'
    import JsonViewer from 'vue-json-viewer'
    export default {
        data () {
            return {
                model1: '',
                peopleList: [],
                tableData1: [],
                tableColumns1: [
                    { title: '操作者', key: 'staffName' },
                    { title: '关键标识', key: 'keyId' },
                    { title: '登录渠道', key: 'loginChannel' },
                    { title: '操作时间', key: 'operateTime' },
                    { title: '描述', key: 'remark' },
                    { title: '客户端IP', key: 'clientIp' },
                    { title: '参数', slot: 'status' }
                ],
                params: {
                    pageNo: 1,
                    pageSize: 20,
                    order: 'desc',
                    startTime: this.$Date().format('YYYY-MM-DD'),
                    endTime: this.$Date().format('YYYY-MM-DD'),
                    keyword: '',
                    staffId: ''
                },
                logsView: {},
                total: 0,
                dateArr: [this.$Date().format('YYYY-MM-DD'), this.$Date().format('YYYY-MM-DD')]
            }
        },
        methods: {
            init () {
                this.handleLoadAll()
                this.queryOperateLogs()
            },
            handleLoadAll () {
                queryFollwerByStaff({})
                    .then(res => {
                        this.peopleList = res.data
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error(this.$t('message.unknown'))
                        }
                    })
            },
            queryOperateLogs () {
                queryOperateLog(this.params)
                    .then(res => {
                        if (res.success) {
                            this.tableData1 = res.datas
                            this.total = res.total
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error(res.message)
                            } else {
                                this.$Message.error(this.$t('message.unknown'))
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error(this.$t('message.unknown'))
                        }
                    })
            },
            getstaffId (e) {
                let arr = this.peopleList.filter(item => {
                    return e === item.value
                })
                this.params.staffId = arr[0].staffId
            },
            search () { // 搜索
                if (this.params.startTime === '' && this.params.endTime === '') {
                    this.$Message.error('请先选择日期')
                    return false
                }
                this.params.pageNo = 1
                this.queryOperateLogs()
            },
            reset () { // 重置
                this.model1 = ''
                this.dateArr = [this.$Date().format('YYYY-MM-DD'), this.$Date().format('YYYY-MM-DD')]
                this.params = {
                    pageNo: 1,
                    pageSize: 20,
                    order: 'desc',
                    startTime: this.$Date().format('YYYY-MM-DD'),
                    endTime: this.$Date().format('YYYY-MM-DD'),
                    keyword: '',
                    staffId: ''
                }
                this.queryOperateLogs()
            },
            handleViewLogs (obj) {
                findParamsById({ id: obj.id })
                    .then(res => {
                        this.logsView = ''
                        this.logsView = res
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error(this.$t('message.unknown'))
                        }
                    })
            },
            outputs (e) {
                let ctxPaths = this.$func.ctxPaths();
                // pageNo: this.params.pageNo,
                // pageSize: 20,
                // order: 'desc',
                // startTime: this.params.startTime,
                // endTime: this.params.endTime,
                // keyword: this.params.keyword,
                // staffId: this.params.staffId
                if (e === 'current') {
                    if (this.$func.checkDateOneYear(this.params.startTime, this.params.endTime) === 'true') {
                        this.$func.windowCountDown(ctxPaths + '/operateLog/exportPageList.as?keyword=' + this.params.keyword + '&startTime=' + this.params.startTime + '&endTime=' + this.params.endTime + '&staffId=' + this.params.staffId + '&pageNo=' + this.params.pageNo + '&pageSize=' + 20 + '&order=desc&export=' + e)
                    } else {
                        this.$Message.error(this.$t('btns.exportCurrent') + this.$t('message.limitYear'))
                    }
                }
                if (e === 'all') {
                    if (this.$func.checkDateOneMonth(this.params.startTime, this.params.endTime) === 'true') {
                        this.$func.windowCountDown(ctxPaths + '/operateLog/exportPageList.as?keyword=' + this.params.keyword + '&startTime=' + this.params.startTime + '&endTime=' + this.params.endTime + '&staffId=' + this.params.staffId + '&pageNo=' + this.params.pageNo + '&pageSize=' + 20 + '&order=desc&export=' + e)
                    } else {
                        this.$Message.error(this.$t('btns.exportAll') + this.$t('message.limitMonth'))
                    }
                }
            },
            datechange (e) {
                this.params.startTime = e[0]
                this.params.endTime = e[1]
            },
            handlePage (e) {
                if (e === 'home') {
                    this.params.pageNo = 1
                } else if (e === 'prev') {
                    if (this.params.pageNo !== 1) {
                        this.params.pageNo -= 1
                    } else {
                        return false
                    }
                } else if (e === 'next') {
                    this.params.pageNo += 1
                }
                this.queryOperateLogs()
            },
            clearPeople () {
                this.params.staffId = ''
            },
            back () {
                this.$router.go(-1)
            }
        },
        mounted () {
            this.init()
        },
        components: {
            JsonViewer
        }
    }
</script>

<style lang="less" scoped>
.btnb{
  background:#007EFF;color:#fff;border:none;margin-left: 10px;
}
.header{
    display: flex;
    width: 100%;
    justify-content: space-between;
}
.rightData{
    display: flex;
    align-items: center;
}
.export{
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007EFF;
    border-radius: 5px;
    width: 32px;
    height: 32px;
    margin-left: 10px;

    .ivu-icon{
        color: #007EFF;
        padding-top: 5px;
        margin: 0 !important;
    }
}
.buttonGroup{
    float: right;
    // margin-top: 10px;
    padding: 10px;
    button{
        margin-right: 20px;
    }
}
.span{
    cursor: pointer;
}
</style>
