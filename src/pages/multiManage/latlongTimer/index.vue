<template>
  <div id="LatitudeLongitudeTiming">
      <Row class="LatitudeLongitudeTiming-head">
          <Col :span="24">
             <Form :inline="true" :model="formInline" ref="formInline"  class="form-wrap" @submit.native.prevent>
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
                  <Button class="b-blue" @click="onSubmit('formInline')">查询</Button>
                </FormItem>
                <FormItem>
                  <Button @click="empty">重置</Button>
                </FormItem>
                <FormItem>
                  <Dropdown trigger="click"  @on-click="handleCommand" :transfer="true">
                    <Button class="export">
                        <Icon custom="icon-v5 icon-v5-daochu" />
                    </Button>
                    <DropdownMenu slot="list">
                      <DropdownItem name="all">从设备中提取</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </FormItem>
          </Form>
          </Col>
    </Row>
    <Row class="table">
        <Row class="tableHeader">
            <Col :span="12">内置经纬定时</Col>
            <Col :span="12" style="text-align: right;">
                <Button class="b-blue pointer" @click="handleAdd">新增定时</Button>
                <Button type="text" class="b-dger" :class="multipleSelection.length <= 0 ? 'c-info pointer' : 'c-danger pointer'" :disabled="multipleSelection.length <= 0" @click="handleforceDel"> 批量删除</Button>
            </Col>
        </Row>

        <Col :span="24">
      <Table
        :data="latitudeData"
        :columns="columns"
        :height="BuiltInTimingHeight"
        :max-height="BuiltInTimingHeight"
        @on-selection-change="handleSelectionChange"
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
          <span :class="row.status === 'true' ? 'b-danger' : 'b-success'">{{ row.status === 'true' ? "合闸" : "分闸" }}</span>
        </template>
        <template slot-scope="{row}" slot="operating">
          <Button class="c-primary" @click="handleEdit(row)" type="text">编辑</Button>
          <Button class="c-danger" @click="handleDelete(row)" type="text">删除</Button>
          <Dropdown :transfer="true">
                <a href="javascript:void(0)" class="btn">
                    更多
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem>
                          <Button class="c-default" @click="handleLatitudeLongitude(row)" type="text">设置经纬度</Button>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>

        </template>
      </Table>
    </Col>
      <Col :span="24" class="tc mt-5">
     <Page
        @on-page-size-change ="handleSizeChange"
        :page-size = pageSize
        :page-size-opts="[10, 20, 30]"
        @on-change="currentpage"
        :total = total
        @on-prev ="handleCurrentChange('prev')"
        @on-next ="handleCurrentChange('next')"
        style="margin-top:20px"
        >
      </Page>
    </Col>
    </Row>

    <Modal :title="timingTitle" :close-on-click-modal="false" v-model="timingFlag" width="680px">
      <Edit ref="child" :options="timing" v-if="timingFlag" @queryList="init" @closeEdit="timingFlag = false" @handleLatitudeLongitude="handleLatitudeLongitude"></Edit>
      <div slot="footer">
      </div>
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
      <div slot="footer" class="dialog-footer" style="display:flex">
        <Col :span="12" class="tl mt-10" v-show="msgboxFlag">
          <Checkbox v-model="checked">强制删除平台上的记录</Checkbox>
        </Col>
        <Col :span="12" class="fr">
          <Button  @click="handleCancel">取 消</Button>
          <Button  class="b-blue" @click="handleOk">确 定</Button>
        </Col>
      </div>
    </Modal>
    <Modal title="设置经纬度" :close-on-click-modal="false" v-model="latitudeFlag"   width="680px">
        <div class="title">
        <div class="description-title">
            <i class="icon-v5 icon-v5-huifu"></i> 说明:
        </div>
        <div class="description-text">
            <div class="description">
                  {{ '1. ' + '向服务器提交了指令,并非立即生效,指令将由服务器后台逐个下发到设备,根据网络情况可能会延迟.' }}
            </div>
            <div class="description">
                {{ '2. ' +'提交后,要等待设备响应后方可查询可见.' }}
            </div>
        </div>
    </div>
      <Form :model="setupForm" :label-width="80" style="margin-top:20px" >
        <FormItem label="设备号:">
          <Input style="width: 260px" :disabled="true" v-model="setupForm.mac"></Input>
        </FormItem>

        <FormItem label="经度值" style="margin-top:20px">
            <Row>
                <Col>
                    <Input style="width: 150px" placeholder="经度" v-model="setupForm.longitude"></Input>
                </Col>
                <Col style="margin:0 10px">
                    <Input style="width:150px"  placeholder="纬度" v-model="setupForm.latitude"></Input>
                </Col>
                <Col>
                    <Button class="pointer c-primary bg" @click="handleRefresh" style="margin: 0 10px;">刷新</Button>
                    <Button class="pointer c-primary bg" @click="handleExtract(setupForm.mac)"  style="margin: 0 10px;">从设备中提取</Button>
                </Col>
            </Row>

        </FormItem>
        <!-- @click="latitudeFlag = false" timingFlag" -->
        <FormItem class="footerBtn">
          <Button class="b-blue" @click="handleSubmit" :disabled="setupForm.mac === '' || setupForm.longitude === '' || setupForm.latitude === ''">保 存</Button>
          <Button  @click="latitudeFlagCancel">取 消</Button>
        </FormItem>
      </Form>
       <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
    import { getGroupType, getGroupTree } from '@/api/public';
    import { timeingList, findById, delTiming, longitudeAndLatitude, refreshLongitudeLatitude, setLongitudeLatitude, downGetTime } from '@/api/multiManage/latlongTimer'
    import Edit from './Edit'
    export default {
        components: {
            Edit
        },
        data () {
            return {
                formInline: {
                    mac: '',
                    packetTypes: '',
                    packetFilter: []
                },
                setupForm: {
                    mac: '',
                    longitude: '',
                    latitude: ''
                },
                multipleSelection: [],
                packetList: [],
                packetFilterList: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                rowList: {},
                latitudeData: [],
                timingTitle: '',
                checked: false,
                timingFlag: false,
                msgboxFlag: false,
                delVisible: false,
                latitudeFlag: false,
                returnFlag: false,
                forceDelData: [],
                BuiltInTimingHeight: this.$store.state.BuiltInTimingHeight,
                timing: {
                    mac: '',
                    autoid: '',
                    channel: '',
                    weekday: '',
                    time: '',
                    type: '',
                    monitorTime: '',
                    status: '',
                    tags: ''
                },
                columns: [
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
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '设备别名',
                        slot: 'macname',
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
                        title: '状态',
                        slot: 'status',
                        align: 'center',
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
            queryList () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    mac: this.formInline.mac,
                    type: '2,3',
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    nodeId: this.formInline.packetFilter ? this.formInline.packetFilter.join() : this.formInline.packetFilter
                }
                timeingList(params)
                    .then(res => {
                        if (res.success) {
                            this.total = res.total
                            this.latitudeData = res.datas
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
            handleAdd () {
                this.timing = {
                    mac: '',
                    autoid: '',
                    channel: '',
                    weekday: '',
                    time: '',
                    type: '',
                    monitorTime: '',
                    status: '',
                    tags: ''
                }
                this.timingTitle = '新增内置经纬定时'
                this.timingFlag = true
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
                                type: data.type,
                                monitorTime: data.monitorTime,
                                status: data.status,
                                tags: tags
                            }
                            this.timingTitle = '编辑内置经纬定时'
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
                                        return `<div style="color: #67C23A">${item.mac + ':\xa0' + '命令已提交，生效中..'}</div>`
                                    } else {
                                        return `<div style="color: #F56C6C">${item.mac + ':\xa0' + item.errorMsg}</div>`
                                    }
                                }) : res.message
                                this.$Modal.info({
                                    title: '',
                                    content: (res.data !== undefined && res.data.length > 0) ? errMsg.join('\n') : errMsg
                                });
                            }
                        })
                        .catch(err => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'

                                })
                            }
                        })
                }
            },
            handleSizeChange (val) {
                this.pageSize = val
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
            handleLatitudeLongitude (row) {
                this.rowList = row
                this.setupForm.mac = row.mac

                if (row.flag === 'ture') {
                    this.returnFlag = true
                } else {
                    this.returnFlag = false
                }
                this.setLatitudeLongitude()
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
            },
            setLatitudeLongitude () {
                this.timingFlag = false
                this.latitudeFlag = true
            },
            handleRefresh () {
                refreshLongitudeLatitude({ mac: this.setupForm.mac })
                    .then(res => {
                        if (res.success) {
                            this.setupForm = {
                                mac: this.setupForm.mac,
                                longitude: res.data.longitude,
                                latitude: res.data.latitude
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
            handleExtract (mac) {
                longitudeAndLatitude({ mac: mac })
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            })
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
            handleSubmit () {
                setLongitudeLatitude(this.setupForm)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            })
                            this.handlelatitudeClose()
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
            },
            handleCommand (command) {
                if (command === 'all') {
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
                }
            },
            handlelatitudeClose () {
                if (this.returnFlag) {
                    this.latitudeFlag = false
                    this.timingFlag = true
                    this.timing = {
                        mac: this.rowList.mac,
                        autoid: this.rowList.autoid,
                        weekday: this.rowList.week,
                        time: this.rowList.time,
                        type: this.rowList.type,
                        monitorTime: this.rowList.monitorTime,
                        status: this.rowList.action,
                        tags: this.rowList.tags
                    }
                } else {
                    this.latitudeFlag = false
                }
            },
            empty () {
                this.formInline.mac = ''
                this.formInline.packetTypes = ''
                this.formInline.packetFilter = ''
            },
            latitudeFlagCancel () {
                this.timingFlag = true
                this.latitudeFlag = false
            },
            currentpage (val) {
                this.currentPage = val
                this.queryList()
            }
        },
        watch: {
            '$store.state.projectCode': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.init()
                    }
                }
            },
            '$store.state.BuiltInTimingHeight': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.BuiltInTimingHeight.height = newVal
                    }
                }
            }
        }
    }
</script>
<style lang="less" scoped>
.ivu-form-item {
    margin-bottom: 0;
}
#LatitudeLongitudeTiming{
  .LatitudeLongitudeTiming-head{
    display: flex;
    padding-top:10px;
    padding: 10px;
    background:#1a202e ;
  }

}
.table{
    margin-top: 10px;
    background: #1a202e;
    padding: 0 20px 20px 20px;
    .tableHeader{
        font-size: 16px ;
        padding: 20px 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        Button{
        margin: 0 5px;
    }
    }

}
/deep/.ivu-modal-footer {
    border:none;
}
.title{
    background: rgba(153, 153, 153, 0.05);
    border: 1px solid #999999;
    font-size: 14px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    display: flex;
    padding: 10px;
    .description-title{
        width: 66px;
    }
    .description-text{

    }
}
.bg{
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007EFF;
    border-radius: 5px;
}
.footerBtn{
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    Button{
        margin: 5px;
    }
}
</style>
