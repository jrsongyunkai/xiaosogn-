<template>
  <div id="BuiltInTiming">
        <Row class="BuiltInTiming-head">
                <Form :inline="true" :model="formInline" ref="formInline" class="form-wrap" @submit.native.prevent>
                    <FormItem>
                    <Select
                      v-model="formInline.packetTypes"
                      @on-change="handleTypes"
                      style="width: 200px"
                      placeholder="选择分组类型"
                      :clearable='true'
                    >
                      <Option
                        v-for="item in packetList"
                        :value="item.id"
                        :key="item.id"
                        :label="item.type"
                      ></Option>
                    </Select>
                    </FormItem>
                    <FormItem>
                      <TreeSelect
                          placeholder="选择分组"
                          multiple
                          show-checkbox
                          v-model="formInline.packetFilter"
                          transfer
                          :data="packetFilterList"
                        />
                    </FormItem>
                    <FormItem>
                      <Input v-model="formInline.mac" placeholder="输入设备号"></Input>
                    </FormItem>
                    <FormItem>
                      <Select style="width:200px" @on-change="handleActionTypes"  v-model="formInline.action" :clearable='true' class="w-100" placeholder="动作">
                        <Option
                          v-for="item in actionTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></Option>
                      </Select>
                    </FormItem>
                    <FormItem>
                      <Button class="b-blue" @click="onSubmit('formInline')">查询</Button>
                    </FormItem>
                    <FormItem>
                      <Button @click="empty">重置</Button>
                    </FormItem>
                    <FormItem>
                      <Dropdown @on-click="handleCommand" >
                        <Button class="export">
                          <Icon custom="icon-v5 icon-v5-daochu" />
                        </Button>
                        <DropdownMenu slot="list">
                          <DropdownItem name ="all">导出全部</DropdownItem>
                          <DropdownItem name ="current">导出当前页</DropdownItem>
                          <DropdownItem name ="extract">从设备中提取</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </FormItem>
                </Form>

        </Row>
        <div class="table">
            <Col :span="24" class="tableHeader">
                <h3>内置定时列表</h3>
                <div>
                    <Button type="text" class="pointer b-primary" @click="viewAllInstruction"><i class="el-icon-plus"></i>查看全部历史指令</Button>
                    <Button type="text" class="pointer b-primary" @click="handleAdd"><i class="el-icon-plus"></i>新增定时</Button>
                    <Button type="text" class="pointer b-dger" :class="multipleSelection.length <= 0 ? 'c-info pointer' : 'c-default pointer'" :disabled="multipleSelection.length <= 0" @click="handleforceDel"><i class="el-icon-close"></i>批量删除</Button>
                    <Button type="text" class="b-olg" :class="multipleSelection.length <= 0 ? 'c-info pointer' : 'c-default pointer'" :disabled="multipleSelection.length <= 0" @click="handleforceEdit"><i class="el-icon-edit-outline"></i>批量编辑</Button>
                </div>
            </Col>
            <Col :span="24">
                <Table
                  :data="data"
                  :columns="columns"
                  @on-selection-change="handleSelectionChange"
                  @on-sort-change="sortChange"
                  style="width: 100%;">
                   <template slot-scope="{row}" slot="others.address">
                      <div>{{ row.others.address}}</div>
                    </template>
                    <template slot-scope="{row}" slot="macname">
                      <div>{{ row.others.name }}</div>
                    </template>
                    <template slot-scope="{row}" slot="others.titles">
                        <div>{{ row.others.titles}}</div>
                    </template>
                    <template slot-scope="{row}" slot="status">
                      <span :class="row.status === 'true' ? 'b-danger' :'b-success'">{{ row.status === 'true' ? "合闸" : "分闸" }}</span>
                    </template>
                      <template slot-scope="{row}" slot="operating">
                        <Button class="c-primary" @click="handleEdit(row)" type="text">编辑</Button>
                        <Button class="c-danger" @click="handleDelete(row)" type="text">删除</Button>
                        <Dropdown :transfer="true">
                            <Button class="c-danger" type="text">
                                <a href="javascript:void(0)" class="btn">
                                    更多<Icon type="ios-arrow-down"></Icon>
                                </a>
                            </Button>

                            <DropdownMenu slot="list" transfer='true'>
                                <DropdownItem>
                                     <Button class="c-default" @click="handleExecute(row.mac, row.channelAddrs, row.status === 'true' ? true : false, row, row.autoId)"  type="text">执行</Button>
                                </DropdownItem>
                                <DropdownItem>
                                    <Button class="c-default" @click="handleInstructions(row)" type="text">指令历史</Button>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                      </template>
                </Table>
            </Col>
            <Col class="tc mt-5" style="margin:20px">
               <Page
                 @on-change ="handlePageSize"
                 @on-page-size-change = changesize

                 :current="currentPage"
                 :page-size-opts="[10, 20, 30]"
                 :total = total
                 >
               </Page>
            </Col>
        </div>

    <Modal :title="timingTitle" v-model="timingFlag"  width="680px">
      <Edit :options="timing" v-if="timingFlag" @closeEdit="timingFlag = false"></Edit>
      <div slot="footer"></div>
    </Modal>
    <div v-if="instructionsFlag">
        <Modal id="equipment" title="指令历史记录" v-model="instructionsFlag"  custom-class="custom-select-dialog" width="1323px">
            <CommandFeedback :classFlag="true" :instructionsData="instructionsData" :operateAt="4" :allInstructions="allInstructions"></CommandFeedback>
            <div slot="footer"></div>
        </Modal>
    </div>

     <Modal title="批量编辑内置定时" :close-on-click-modal="false" v-model="batchEditFlag" width="1000px">
      <BatchEdit :options="batchEditData" v-if="batchEditFlag" @closeBatchEdit="batchEditFlag = false"></BatchEdit>
       <div slot="footer"></div>
    </Modal>
    <Modal
      title="提示"
      v-model="delVisible"
      width="420px"
      top="45vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <Row>
        <Col :span="24"  class="ml-20">
          <div class="el-message-box__status el-icon-warning" ></div>
        </Col>
        <Col :span="24" style="margin-left:50px">
          <div class="el-message-box__message">您确定要删除此内置定时配置吗？</div>
        </Col>
      </Row>
      <div slot="footer" class="dialog-footer" >
        <Col :span="12" class="tl mt-10" v-show="msgboxFlag">
          <Checkbox v-model="checked">强制删除平台上的记录</Checkbox>
        </Col>
        <Col :span="12" class="fr">
          <Button @click="handleCancel">取 消</Button>
          <Button class="b-blue" @click="handleOk">确 定</Button>
        </Col>
      </div>
    </Modal>
  </div>
</template>
<script>
    import { getGroupType, getGroupTree } from '@/api/public';
    import { timeingList, delTiming, findById, remotectrl, downGetTime } from '@/api/multiManage/builtlnTimer'
    import Edit from './Edit.vue'
    import BatchEdit from './BatchEdit.vue'
    import CommandFeedback from '../../Common/CommandFeedback'
    export default {
        data () {
            return {

                formInline: {
                    mac: '',
                    action: '',
                    packetTypes: '',
                    packetFilter: []
                },
                packetList: [],
                packetFilterList: [],
                formNum: '',
                data: [],
                page: 1,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                timingFlag: false,
                timingTitle: '',
                timing: null,
                instructionsFlag: false,
                allInstructions: false,
                instructionsData: [],
                multipleSelection: [],
                forceDelData: [],
                msgboxFlag: false,
                delVisible: false,
                checked: false,
                batchEditFlag: false,
                batchEditData: [],
                rowData: {},
                actionTypes: [
                    {
                        label: '合闸',
                        value: 1
                    },
                    {
                        label: '分闸',
                        value: 2
                    }
                ],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'left'
                    },
                    {
                        title: '地点',
                        slot: 'others.address',
                        align: 'left'
                    },
                    {
                        title: '设备号',
                        key: 'mac',
                        align: 'left'
                    },
                    {
                        title: '设备别名',
                        slot: 'macname',
                        align: 'left'
                    },
                    {
                        title: '线路',
                        slot: 'others.titles',
                        align: 'left'
                    },
                    {
                        title: '周期',
                        key: 'weekday',
                        align: 'left'
                    },
                    {
                        title: '时间',
                        key: 'time',
                        align: 'left'
                    },
                    {
                        title: '动作',
                        slot: 'status',
                        align: 'left',
                        width: 80
                    },
                    {
                        title: '操作',
                        slot: 'operating',
                        align: 'center',
                        width: 400
                    }
                ]
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                if (this.$route.params.mac) {
                    this.formInline.mac = this.$route.params.mac
                }
                this.queryList()
                this.getGroupTypes()
            },
            handleActionTypes (item) {
                if (item === 1) {
                    this.formNum = true
                } else if (item === 2) {
                    this.formNum = false
                } else if (item === undefined) {
                    this.formNum = ''
                }
            },
            handleTypes (val) {
                this.formInline.packetTypes = val;
                this.getGroupTrees();
            },
            getGroupTypes () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getGroupType(params)
                    .then((res) => {
                        if (res.success) {
                            this.packetList = res && res.data;
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
            getGroupTrees () {
                getGroupTree({ groupId: this.formInline.packetTypes })
                    .then((res) => {
                        if (res.code === '0') {
                            let resData = this.getTree(res.data);
                            this.packetFilterList = this.cloneTree(resData);
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
            cloneTree (score, parentId = 0) {
                let tree = [];
                score.map((item) => {
                    if (item.parentId === parentId) {
                        // 递归寻找
                        item.children = this.cloneTree(score, item.id);
                        tree.push(item);
                    }
                });

                return tree;
            },
            // 递归遍历数组为树状结构
            getTree (tree = []) {
                let arr = [];
                if (!!tree && tree.length !== 0) {
                    tree.forEach((item) => {
                        let obj = {};
                        obj.id = item.id;
                        obj.value = item.id;
                        obj.parentId = item.parentId;
                        obj.title = item.name;
                        // 其他你想要添加的属性
                        obj.expand = true;
                        obj.selected = false;
                        obj.checked = false;
                        obj.children = this.getTree(item.children); // 递归调用
                        arr.push(obj);
                    });
                }
                return arr;
            },
            changesize (e) {
                this.pageSize = e;
                this.queryList()
            },
            queryList (prop, order) {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    mac: this.formInline.mac,
                    status: this.formNum,
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    nodeId: this.formInline.packetFilter ? this.formInline.packetFilter.join() : this.formInline.packetFilter
                }
                if (prop) {
                    params.sortName = prop
                    if (order === 'ascending') {
                        params.order = 'asc'
                    } else if (order === 'descending') {
                        params.order = 'desc'
                    }
                }
                timeingList(params)
                    .then(res => {
                        if (res.success) {
                            this.total = res.total
                            this.data = res.datas
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
            sortChange ({ column, prop, order }) {
                this.queryList(prop, order)
            },
            onSubmit (formName) {
                if (this.formInline.packetTypes && this.formInline.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.currentPage = 1
                            this.queryList()
                        } else {
                            return false
                        }
                    })
                }
            },
            handleAdd () {
                this.timing = {
                    mac: '',
                    autoid: '',
                    channel: '',
                    weekday: '',
                    time: '',
                    status: 'true',
                    tags: []
                }
                this.timingTitle = '新增内置定时'
                this.timingFlag = true
            },
            handleEdit (row) {
                findById({ id: row.id })
                    .then(res => {
                        if (res.success) {
                            let data = res.data
                            let titles = data.others.titles.split(',')
                            let tags = []
                            data.channelAddrs.split(',').map((item, index) => {
                                tags.push({ addr: item, title: titles[index] })
                            })
                            this.timing = {
                                mac: data.mac,
                                autoid: data.autoId,
                                channel: data.channelAddrs,
                                weekday: data.weekday ? data.weekday.replace(/,/g, '') : '',
                                time: data.time,
                                status: data.status,
                                tags: tags
                            }
                            this.timingTitle = '编辑内置定时'
                            this.timingFlag = true
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
            handleDelete (row) {
                this.delVisible = true
                this.msgboxFlag = row.others.forceDeleteEnable
                this.rowData = row
            },
            handleforceDel () {
                this.msgboxFlag = this.delVisible = true
                this.rowData = {}
            },
            handleforceEdit () {
                this.batchEditFlag = true
            },
            handleBatchClose () {
                this.batchEditFlag = false
            },
            handleCancel () {
                this.$Message.info({
                    content: '已取消删除'
                })
                this.checked = this.delVisible = false
            },
            handleOk () {
                let arr = []
                let params = {}
                if (Object.keys(this.rowData).length > 0) {
                    params = {
                        mac_autoids: this.rowData.mac ? [this.rowData.mac, this.rowData.autoId].join('_') : this.multipleSelection.join(','),
                        _operate_at: 4
                    }
                } else {
                    params = {
                        mac_autoids: this.multipleSelection.join(','),
                        _operate_at: 4
                    }
                }
                this.forceDelData.forEach(item => {
                    if (!item.forceDel) arr.push(item.mac)
                })
                arr = Array.from(new Set(arr))
                if (this.checked && arr.length > 0 && Object.keys(this.rowData).length === 0) {
                    this.checked = this.delVisible = false
                    this.$Message.error({
                        content: `${'设备' + '\xa0\xa0' + arr.join('\n') + '\xa0\xa0' + '不支持删除平台上的配置记录'}`
                    })
                } else {
                    params.delFlag = this.checked ? 'Y' : ''
                    delTiming(params)
                        .then(res => {
                            this.checked = this.delVisible = false
                            if (res.success) {
                                this.$Message.success({
                                    content: res.message
                                })
                            } else if (res.code === '-1') {
                            } else {
                                let errMsg = (res.data !== undefined && res.data.length > 0) ? res.data.map((item) => {
                                    if (item.errorMsg === '0') {
                                        this.$Message.success({
                                            content: `${item.mac + ':\xa0' + '命令已提交，生效中..'}`
                                        })
                                    } else {
                                        this.$Message.error({
                                            content: `${item.mac + ':\xa0' + item.errorMsg}`
                                        })
                                    }
                                }) : res.message

                                this.$alert((res.data !== undefined && res.data.length > 0) ? errMsg.join('\n') : errMsg, '', {
                                    dangerouslyUseHTMLString: true,
                                    showConfirmButton: false,
                                    callback: action => {}
                                })
                            }
                        })
                }
            },
            handleSelectionChange (val) {
                this.multipleSelection = val.map((item) => {
                    return item.mac + '_' + item.autoId
                })
                this.forceDelData = val.map((item) => {
                    return {
                        mac: item.mac,
                        forceDel: item.others.forceDeleteEnable
                    }
                })
                this.batchEditData = val.map((item) => {
                    return {
                        autoId: item.autoId,
                        channelAddrs: item.channelAddrs.split(','),
                        mac: item.mac,
                        others: {
                            address: item.others.address,
                            name: item.others.name,
                            titles: item.others.titles.split(',')
                        },
                        weekday: item.weekday ? item.weekday.split('') : ''
                    }
                })
            },
            handlePageSize (val) {
                this.currentPage = val
                this.queryList()
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
                this.queryList()
            },
            handleCommand (command) {
                if (command === 'extract') {
                    if (this.formInline.mac === '') {
                        this.$Message.error({
                            content: '请输入设备号'
                        })
                        return false
                    }
                    downGetTime({ mac: this.formInline.mac })
                        .then(res => {
                            if (res.success) {
                                if (res.code === '0') {
                                    this.$Message.success({
                                        content: '命令已提交，生效中..'
                                    })
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
                } if (command === 'current') {
                    var action;
                    if (this.formInline.action === 1) {
                        action = true
                    } else if (this.formInline.action === 2) {
                        action = false
                    } else if (this.formInline.action === '') {
                        action = ''
                    }
                    this.$func.windowCountDown('/timing/export.as?projectCode=' + this.$store.state.projectCode + '&status=' + action + '&mac=' + this.formInline.mac + '&pageNo=' + this.currentPage + '&timingType=' + '1' + '&pageSize=' + this.pageSize + '&type=' + (command === 'all' ? 'exportAll' : ''))
                } else {
                    this.$func.windowCountDown('/timing/export.as?projectCode=' + this.$store.state.projectCode + '&mac=' + this.formInline.mac + '&pageNo=' + this.currentPage + '&timingType=' + '1' + '&pageSize=' + this.pageSize + '&type=' + (command === 'all' ? 'exportAll' : ''))
                }
            },
            handleExecute (mac, addr, opr, row, autoId) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '您确定要' + (opr ? '合闸' : '分闸') + '?',
                    onOk: () => {
                        let param = {
                            'cmd': 'OCSWITCH',
                            'mac': mac,
                            'value1': opr ? 'open' : 'close',
                            'value2': addr,
                            '_operate_at': 4 + ':' + autoId
                        }
                        remotectrl(param)
                            .then(res => {
                                if (res.success) {
                                    if (res.code === '0') {
                                        this.$Message.success({
                                            content: '命令已提交，生效中..'
                                        })
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

                                let _param = {
                                    'cmd': 'OCSWITCH',
                                    'mac': mac,
                                    'value1': opr ? 'open' : 'close',
                                    'value2': addr,
                                    '_operate_at': 4 + ':' + autoId
                                }
                                remotectrl(_param)
                                    .then(res => {
                                        if (res.success) {
                                            if (res.code === '0') {
                                                this.$Message.success({
                                                    content: '命令已提交，生效中..'
                                                })
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
                            }).catch(() => {
                                this.$Message.info({
                                    content: '已取消'
                                })
                            })
                    }
                })
            },
            handleInstructions (row) {
                this.allInstructions = false
                this.instructionsFlag = true
                this.instructionsData = row
                this.instructionsData.projectCode = this.$store.state.projectCode
            },
            viewAllInstruction () {
                this.allInstructions = this.instructionsFlag = true
                this.instructionsData = {
                    projectCode: this.$store.state.projectCode
                }
            },
            empty () {
                this.formInline.mac = ''
                this.formInline.action = ''
                this.formInline.packetTypes = ''
                this.formInline.packetFilter = ''
            }
        },
        watch: {
            '$store.state.projectCode': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.init()
                    }
                }
            }
        },
        components: {
            Edit,
            BatchEdit,
            CommandFeedback
        }
    }
</script>
<style lang="less" scoped>
#BuiltInTiming{
  .BuiltInTiming-head{
    display: flex;
    padding:10px;
    background: #1a202e;

  }
  .fr{
      text-align: right;
  }
  .table{
      background: #1a202e;
      padding:0 20px 20px 20px;
      margin-top: 10px;
  }
  .tableHeader{
      display: flex;
      align-items: center;
      justify-content:space-between;
      padding: 20px 0;
      span{
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
      }
      Button{
          margin: 0 5px;
      }

  }

}
.titles{
    background: #1A202E;
    border: 1px solid #535B6C;
    border-radius: 4px;
}
.ivu-form-item{
    margin-bottom: 0;
}
.ivu-btn-text:hover{
    color: #fff !important;
}
/deep/.ivu-table-body{
    height: 600px;
    overflow-y: auto;
    &::-webkit-scrollbar{
        display: none;
    }
}
/deep/.ivu-modal-footer{
    padding: 0;
    border:none;
}
.dialog-footer{
    padding: 10px;
    display:flex;
    justify-content: flex-end;
    align-items: center;
}
</style>
