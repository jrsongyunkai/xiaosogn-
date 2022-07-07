<template>
  <div>
    <!-- 这里是一个表格 -->
    <Input
      v-model="value"
      placeholder="输入设备号"
      style="width: 300px;margin-right:10px"
    />
    <Button type="primary" @click="search">查询</Button>

    <div style="margin-top:10px">
      <Table
        ref="currentRowTable"
        :columns="columns1"
        :data="data1"
        :disabled-hover="true"
        :height="520"
      >
       <template slot="macname" slot-scope="{ row }" >
            <span>{{row.name}}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <Button type="text" style="color: #007eff" @click="compile(row)"
            >查看线路</Button>
        </template>
      </Table>
      <div style="float: right">
        <Page
          show-total
          :current="page"
          @on-change="changePage"
          @on-page-size-change="changesize"
          :total="total"
          show-elevator
        />
      </div>
    </div>

    <Modal v-model="flag" title="线路列表">
        <Checkbox
          :indeterminate="indeterminate"
          v-model="checkAll"
          @click.prevent.native="handleCheckAll"
          >全选</Checkbox
        >
      <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" style="margin-top:20px">
        <Checkbox :label="item.title" v-for="item in lines" :key="item.title" :disabled='item.isDisable'></Checkbox>
      </CheckboxGroup>

      <div slot="footer">
        <Button type="primary" @click="save"> 选择线路 </Button>
        <Button @click="flag = false" > 取消 </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import LineList from '../../Common/LineList'
    import {
        queryBoxes,
        queryChannels,
        saveDeStatuscanConfDetail
    } from '@/api/multiManage/abnormalStateConfig';
    export default {
        data () {
            return {
                value: '',
                columns1: [
                    {
                        title: '设备号',
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        slot: 'macname',
                        align: 'center'
                    },
                    {
                        title: '楼栋',
                        key: 'build',
                        align: 'center'
                    },
                    {
                        title: '单元',
                        key: 'unit',
                        align: 'center'
                    },
                    {
                        title: '房号',
                        align: 'center',
                        key: 'room'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action'
                    }
                ],
                data1: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                page: 1,
                checkedLines: [],
                lines: [],
                flag: false,
                indeterminate: true,
                checkAll: false,
                checkAllGroup: [],
                arr: [],
                allList: []
            };
        },
        methods: {
            init () {
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    projectCode: this.$store.state.projectCode,
                    key: this.value
                };
                // if (this.attrFlag) params.attrFlag = 'enableAdvancedTiming'
                queryBoxes(params).then((res) => {
                    if (res.success) {
                        this.total = res.total;
                        //
                        //
                        this.data1 = res.datas;
                    } else {
                        this.$Message.error('加载失败');
                    }
                });
            },
            search () {
                this.init();
            },
            changePage (e) {
                this.currentPage = e;
                this.init();
            },
            changesize (e) {
                this.page = e;
                this.init();
            },
            compile ({ mac }) {
                queryChannels({ mac }).then((res) => {
                    if (res.success) {
                        if (res.datas.length === 0) {
                            this.$Message.warning('没有可用的线路哦')
                        } else {
                            this.mac = mac
                            this.lines = [];
                            let data = this.$store.state.ruleId.line
                            let arr = data.filter(item => {
                                return item.mac === mac
                            })

                            res.datas.forEach((item) => {
                                this.lines.push({ title: item.title });
                            });

                            this.lines.forEach(item => {
                                if (arr.length) {
                                    arr.forEach(item1 => {
                                        let isarr = item1.chnlnames.split('，')
                                        isarr.forEach(items => {
                                            if (items === item.title) {
                                                item.isDisable = true
                                            }
                                        })
                                    })
                                }
                            })
                            this.checkedLines = JSON.parse(JSON.stringify(this.lines)) // 用于全选
                            this.checkedLines.forEach((item) => {
                                this.allList.push(item.title)
                            })
                            this.arr = res.datas.map((item) => { return { addr: item.addr, title: item.title } })

                            this.flag = true
                        }
                    } else {
                        this.$Message.error(res.message)
                    }
                });
            },
            handleCheckAll () {
                // console.log(this.checkedLines);
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = this.allList;
                } else {
                    this.checkAllGroup = [];
                }
            },
            checkAllGroupChange (data) {
                console.log(data);
                if (data.length === this.checkedLines.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            save () {
                let chnls = []
                let chnlNames = []

                let arr = []
                this.checkAllGroup.forEach(items => {
                    arr.push(this.arr.filter((item) => {
                        return items === item.title
                    })[0])
                })

                arr.forEach((item) => {
                    chnls.push(item.addr)
                    chnlNames.push(item.title)
                })
                let params = {
                    mac: this.mac ? this.mac : 'all',
                    ruleId: this.$store.state.ruleId.id,
                    chnls: chnls.join(','),
                    chnlNames: chnlNames.join('，')
                }

                saveDeStatuscanConfDetail(params)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success('保存成功')
                            this.flag = false
                            this.$parent.$parent.saveSuccess()// 这个方法是调用父组件的函数
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error('请选择有效线路')
                        }
                        this.checkAllGroup = []
                        this.checkAll = false
                    })
            }
        },
        mounted () {
            this.init();
        }
    };
</script>

<style>
</style>
