<template>
  <div style="margin-top: 60px">
    <Form
      ref="form"
      :model="form"
      inline
      style="background-color: #1a202e; padding-top: 20px; padding-left: 20px"
    >
      <Row type="flex" id="buildings-form">
        <Col :span="2">
          <FormItem>
            <Select
              transfer
              clearable
              style="width: 130px"
              v-model="packetTypes"
              placeholder="选择分组类型"
              class="en-unit"
              @on-change="handleTypes"
            >
              <Option
                v-for="item in packetList"
                :key="item.id"
                :label="item.type"
                :value="item.id"
              ></Option>
            </Select>
          </FormItem>
        </Col>
        <Col >
          <FormItem style="display: flex">
            <TreeSelect
              placeholder="选择分组"
              show-checkbox
              v-model="packetFilter"
              transfer
              multiple
              :data="packetFilterList"

            />
          </FormItem>
        </Col>

        <Col :span="2">
          <FormItem style="display: flex">
            <Select
              transfer
              clearable
              v-model="building"
              style="width: 130px"
              placeholder="请选择楼栋"
              @on-change="handleChange"
            >
              <Option
                z-index="5"
                v-for="item in buildings"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="2">
          <FormItem style="display: flex">
            <Select
              transfer
              clearable
              v-model="unit"
              style="width: 130px"
              placeholder="请选择单元"
              @on-change="handleUnit"
            >
              <Option
                v-for="item in units"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="2">
          <FormItem style="display: flex">
            <Select
              transfer
              clearable
              style="width: 130px"
              v-model="status"
              placeholder="请选择状态："
              @on-change="handleStatus"
            >
              <Option
                v-for="item in stats"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="2">
          <FormItem>
            <Input
              v-model="form.mac"
              placeholder="房间号/设备号"
              title="房间号/设备号"
              :onkeyup="(form.mac = form.mac.replace(/[, ]/g, ''))"
              @on-keyup.enter.native="handleKeyWords"
            />
          </FormItem>
        </Col>

        <Col :span="1">
          <Button type="primary" @click.stop="handleSearch">查询</Button>
        </Col>
        <Col>
          <Button type="default" @click.stop="handleReset">重置</Button>
        </Col>
      </Row>
    </Form>
    <h3 style="background-color: #1a202e; margin-top: 10px; padding: 20px">
      设备列表与控制
    </h3>
    <Row style="padding: 0px 20px; background-color: #1a202e;height:630px">
      <Table
        style="width: 100%"
        ref="currentRowTable"
        :columns="columns3"
        :data="dataList"
      >
        <template slot-scope="{ row }" slot="status">
          <span v-if="row.status == '1'" class="x-success"> 在线 </span>
          <span v-if="row.status == '0'" class="dangers"> 离线</span>
          <span v-if="row.status == '-1'"
            ><Tag color="#272c39">
              <span style="color: #999999">脱线</span>
            </Tag></span
          >
        </template>
        <template slot-scope="{ row }" slot="operation">
          <Button type="text" style="color: #337efd" @click="listModal(row)">
            线路列表
          </Button>
        </template>
      </Table>

    </Row>
    <div style=" background-color: #1a202e">
 <Page
      :current="currentPage"
      :page-size="pageSize"
      :total="total"
      @on-change="change"
      @on-page-size-change="Changesize"
    >
    </Page>
    </div>

    <Modal v-model="listModalFlag" footer-hide border width="630px" @on-visible-change="visibleChange">
      <div style="margin-bottom:-20px">
        <span style="margin-left: 20px">线路列表</span>
        <br>
        <span style="margin-left: 380px">
          <Button
            class="red"
            type="primary"
            @click="oneButtonClose(true)"
            :disabled="checkSelect.length === 0"
            >一键合闸</Button
          >
        </span>
        <span style="margin-left: 20px">
          <Button
            class="green"
            type="primary"
            @click="oneButtonClose(false)"
            :disabled="checkSelect.length === 0"
            >一键分闸</Button
          >
        </span>
      </div>
      <Row style="padding: 0px 20px; background-color: #1a202e">
        <Table
          ref="currentRowTable"
          style="width: 600px; margin-top: 30px"
          @on-selection-change="changeSelect"
          :columns="switchColumns"
          :data="switchList"
        >
          <template slot-scope="{ row }" slot="linestatus">
            <span :class="row.oc ? 'reds' : 'greens'">{{
              row.oc ? '合闸' : '分闸'
            }}</span>
          </template>
          <template slot-scope="{ row }" slot="operation">
            <Col>
              <span
                ><Button
                  type="text"
                  style="color: #f24e4c"
                  @click="coloseSwith(row, true)"
                  >合闸</Button
                ></span
              >
              <span
                ><Button
                  type="text"
                  style="color: #21f27f"
                  @click="coloseSwith(row, false)"
                  >分闸</Button
                ></span
              >
            </Col>
          </template>
        </Table>
      </Row>
    </Modal>
    <Modal
        title=""
        v-model="modal"
        :footer-hide="true"

        :styles="{top: '20px',width:'300px'}">
        <br>
        <p v-for="(item,index) in opendatas" :key="index" :style="item.exeResult===1?'color:#f24e4c;text-align:center;line-height:25px':'color:#21f27f;text-align:center;line-height:25px'">{{
            item.exeResult===1?item.mac + "" +item.msg:item.mac + "命令已提交，生效中..."
            }}</p>
    </Modal>
  </div>
</template>
<script>
    import {
        queryBoxes,
        getBuildings,
        getGroupType,
        getGroupTree,
        getEffectAddr,
        // queryChannels,
        // remotectrl,
        changeStatus
        // disableSelection,
        // getChannelCategory,
        // abnormalSwitchUnlock,
        // addChannelCategory,
        // updateNodeTitle,
        // modifyMacRate
    } from '@/api/public';

    export default {
        name: 'multiManage-deviceListControl',
        data () {
            return {
                dataList: [],
                switchList: [],
                switchColumns: [
                    { type: 'selection', width: 80, align: 'center', title: '全选' },
                    { type: 'index', title: '序号', align: 'center' },
                    { title: '线路名称', key: 'title', align: 'center', width: 120 },
                    { title: '状态', slot: 'linestatus', align: 'center' },
                    { title: '操作', slot: 'operation', width: 200, align: 'center' }
                ],
                columns3: [
                    {
                        key: 'number',
                        title: '序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        key: 'mac'
                    },
                    {
                        title: '设备别名',
                        key: 'name'
                    },
                    {
                        title: '位置',
                        key: 'address'
                    },
                    {
                        title: '线路数',
                        key: 'lineNum'
                    },
                    {
                        title: '状态',
                        slot: 'status'
                    },
                    {
                        title: '操作',
                        slot: 'operation'
                    }
                ],
                listModalFlag: false,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                form: {
                    mac: ''
                },
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                buildings: [],
                building: '',
                units: [],
                unit: '',
                status: '',
                checkSelect: [],
                stats: [
                    { value: '', text: '全部' },
                    {
                        value: '1',
                        text: '在线'
                    },
                    {
                        value: '0',
                        text: '离线'
                    },
                    {
                        value: '-1',
                        text: '脱线'
                    }
                ],
                modal: false,
                opendatas: []
            };
        },
        created () {
            this.init();
        },
        mounted () {
            this.queryList();
            this.getGroupTypes();
        },
        methods: {
            handleTypes (val) {
                this.packetTypes = val;
                this.getGroupTrees();
            },
            queryList () {
                this.loading = true;
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize, // 24,
                    projectCode: this.$store.state.projectCode, // 'P00000000012',
                    build: this.building,
                    unit: this.unit,
                    status: this.status,
                    key: this.form.mac,
                    equipmentTypes: 1, // 只是智能空开表
                    nodeId: this.packetFilter ? this.packetFilter.join() : this.packetFilte
                };

                if (localStorage.getItem('dblLineObj')) {
                    this.handleModifyMacRate(localStorage.getItem('dblLineObj'), false);
                    localStorage.setItem('dblLineObj', '');
                }
                this.$nextTick(function () {
                    queryBoxes(params)
                        .then((res) => {
                            if (res.success) {
                                // this.post = true;
                                // this.tableData = res.datas;
                                this.dataList = res.datas.map((item) => ({
                                    ...item,
                                    lineNum: item.others.countAddr ? item.others.countAddr : 0,
                                    address: item.build + item.unit + item.room,
                                    status: item.others.online
                                }));
                                for (let i = 0; i < this.dataList.length; i++) {
                                    this.dataList[i].number = (i + 1) + ((this.currentPage - 1) * (this.pageSize))
                                }
                                this.total = res.total;
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error({ content: res.message });
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                    });
                    //     .finally(() => {
                    //         this.post = true;
                    //         this.loading = false;
                    //         this.loadingData = false;
                    // });
                });
            },
            getGroupTrees () {
                if (!this.packetTypes) {
                    this.$Message.error({
                        content: '请先选择分组类型'
                    });
                } else {
                    getGroupTree({ groupId: this.packetTypes })
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
                }
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
            getGroupTypes () {
                let params = {
                    projectCode: this.$store.state.projectCode // 'P00000000012'
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
            handleChange (val) {
                this.build = val;

                this.pageNo = 1;
                this.getBuilding();
            },
            init () {
                this.flag = true;
                // clearTimeout(this.timerID)
                this.getBuilding();
            },
            getBuilding () {
                let all = '全部';
                let params = {
                    projectCode: this.$store.state.projectCode, //  'P00000000012'
                    equipmentTypes: '1',
                    build: this.build
                };
                this.$nextTick(() => {
                    getBuildings(params)
                        .then((res) => {
                            if (res.success) {
                                if (params.build && params.build !== '') {
                                    this.units = [{ text: all, value: '' }].concat(res.data);
                                    this.unit = '';
                                } else {
                                    this.buildings = [{ text: all, value: '' }].concat(res.data);
                                    this.units = [];
                                    this.unit = '';
                                }
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
                                    content: '未知错误,请刷新重试'
                                });
                            }
                    });
                    //     .finally(() => {
                    //         this.post = true;
                    //         this.loading = false;
                    //         this.loadingData = false;
                    // });
                });
            },
            handleReset () {
                this.unit = '';
                this.status = '';
                this.form.mac = '';
                this.packetTypes = '';
                this.packetFilter = '';
                this.building = '';
                this.pageNo = 1;
                this.currentPage = 1;
                this.queryList();
            },
            handleUnit (val) {
                this.unit = val;

                this.pageNo = 1;
                this.queryList();
            },
            handleStatus (val) {
                this.pageNo = 1;
                this.status = val;
                this.queryList();
            },
            handleSearch () {
                this.currentPage = 1;
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });

                    return false;
                } else {
                    this.pageNo = 1;
                    this.queryList();
                }
            },
            handleKeyWords (event) {
                //  this.$emit('sendMac', event.target.value);
                this.form.mac = event.target.value;
                this.pageNo = 1;
                this.queryList();
            },
            // handleFilter (val) {
            //
            //     this.pageNo = 1;
            //     this.packetFilter.push(val);
            //     this.queryList();
            // },
            change (val) {
                this.currentPage = val;
                this.queryList();
            },
            Changesize (val) {
                this.pageSize = val;
                this.queryList();
            },
            listModal (val) {
                this.listModalFlag = true;

                this.getAddrs(val);
            },
            getAddrs (val) {
                let params = {
                    mac: val.mac
                };
                getEffectAddr(params)
                    .then((res) => {
                        if (res.success) {
                            this.switchList = res.datas;

                            // this.lines = res.datas;
                            // if (res.datas.length === 0) {
                            //    // store.commit('detailsAddr', '');
                            //     return false;
                            // }
                            //  this.formInline.line = res.datas[0].addr;
                            //  store.commit('detailsAddr', this.formInline.line);
                            //  this.queryChannel();
                            // this.setTimer(
                            //     this.queryChannel,
                            // );
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
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
            },
            coloseSwith (val, type, lineList) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '您确定要' + (type ? '合闸吗?' : '分闸吗?'),
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        let _param = [
                            {
                                'mac': val.mac,
                                'addrOptInfos': [
                                    {
                                        'onOrOff': type,
                                        'addrs': [
                                            val.addr
                                        ]

                                    }
                                ]

                            }
                        ]
                        _param = JSON.stringify(_param)

                        changeStatus(_param)
                            .then((res) => {
                                if (res.success) {
                                    if (res.code === '0') {
                                        this.$Message.success({
                                            content: '命令已提交，生效中..'
                                        });
                                    }
                                } else if (res.code === '-1') {
                                } else {
                                    this.$Message.error({
                                        content: res.data[0].mac + res.data[0].msg
                                    });
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
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消'
                        });
                    }
                });
            },
            changeSelect (val) {
                this.checkSelect = val;
            },
            oneButtonClose (type) {
                if (this.checkSelect.length > 0) {
                    this.switcherCtlEvent(type);
                }
            },
            switcherCtlEvent (type) {
                // if (
                //     (row && row.enableNetCtrl === false) ||
                //     (this.enableNetCtrls.length === 1 && this.enableNetCtrls[0] === false)
                // ) {
                //     this.$Message.error({
                //         content:
                //             (row ? row.title : this.titles[0]) +
                //             '已因用电报警断电或现场关断,遥控功能关闭.'
                //     });
                //     return false;
                // }
                this.$Modal.confirm({
                    title: '提示',
                    content: '您确定要一键' + (type ? '合闸吗?' : '分闸吗?'),
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        let arr = this.checkSelect
                        let str = []
                        arr.forEach(item => {
                            str.push(
                                {
                                    'mac': item.mac,
                                    'addrOptInfos': [
                                        {
                                            'onOrOff': type,
                                            'addrs': [
                                                item.addr
                                            ]

                                        }
                                    ]

                                }
                            )
                        })
                        str = JSON.stringify(str)
                        changeStatus(str).then(res => {
                            this.modal = true
                            if (res.code === 0) {
                                this.$message.success('命令已提交，生效中...')
                            } else {
                                this.opendatas = res.data
                            }
                        })
                        // let _param = {
                        //     cmd: 'OCSWITCH',
                        //     mac: mac,
                        //     value1: opr ? 'open' : 'close',
                        //     value2: addr,
                        //     _operate_at: lineList ? '2' : '1'
                        // };
                        // changeStatus(_param)
                        //     .then((res) => {
                        //         if (res.success) {
                        //             if (res.code === '0') {
                        //                 this.$Message.success({
                        //                     content: '命令已提交，生效中..'
                        //                 });
                        //             }
                        //         } else if (res.code === '-1') {
                        //         } else {
                        //             this.$Message.error({
                        //                 content: res.message
                        //             });
                        //         }
                        //     })
                        //     .catch((err) => {
                        //         if (err) {
                        //             this.$Message.error({
                        //                 content: '未知错误,请重新刷新'
                        //             });
                        //         }
                        //     })
                        //     .finally(() => {
                        //         this.listModalFlag = false;
                        // });
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消'
                        });
                    }
                });
            },
            visibleChange (e) {
                if (!e) this.checkSelect = []
            }
        },
        watch: {
            currentPage: {
                handler (newVal, oldVal) {

                }
            }
        }
    };
</script>
<style lang="less" scoped>
.greens {
  color: #21f27f;
  background: rgba(0, 186, 138, 0.15);
  padding: 3px;
}
.reds {
  color: #f24e4c;
  background: rgba(255, 79, 79, 0.15);
  padding: 3px;
}
.grays {
  color: #1a202e;
  background: #1a202e;
}
.red {
  background: rgba(242, 78, 76, 0.1);
  color: #F24E4C;
  border:1px solid #F24E4C;
}
.green {
   color: #21f27f;
   border:1px solid #21f27f;
   background: rgba(33, 242, 127, 0.1);
}
.dangers {
  background: rgba(255, 79, 79, 0.15) !important;
  color: #f56c6c !important;
  width: 40px;
  height: 22px;
  padding: 2px 5px;
}
</style>
