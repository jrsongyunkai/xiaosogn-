<template>
  <div id="RegionalRelationshipBinding">
    <Row>
      <Col :span="20">
        <Col :span="24" class="mb-20"
          >{{ '当前绑定' + '：' }}
          <span v-for="(v, f) in list" :key="f">{{ v + '\xa0\xa0\xa0' }}</span
          ><span v-if="list.length > 0" @click="closeNodeTree"
            ><i class="pointer ml-10 c-hover fs-14 el-icon-close"></i></span
        ></Col>
      </Col>
      <Col :span="20">
        <Input
          v-model="input"
          clearable
          size="small"
          placeholder="请输入关键字进行过滤"
        ></Input>
      </Col>
      <Col :span="4">
        <Button
          class="ml-15"
          type="primary"
          size="small"
          @click="handleSeekAreaListTree"
          >查询</Button
        >
      </Col>
    </Row>
    <Row>
      <!-- <el-table
        :data="tableData"
        height="440px"
        ref="Table"
        v-el_scrollBar:scrollBar
        class="device-wrap mt-10"
        style="width: 100%"
        :row-key="
          (row) => {
            return row.id;
          }
        "
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        @current-change="currentChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="areaName" label="区域层级"> </el-table-column>
        <el-table-column align="center" prop="area" label="建筑面积(m²)">
        </el-table-column>
        <el-table-column align="center" prop="persons" label="用能人数">
        </el-table-column>
      </el-table> -->
      <Table
        :data="tableData"
        highlight-row
        ref="Table"
        class="device-wrap mt-10"
        row-key
        :columns="columnsTable"
        @on-current-change="currentChange"
        @on-selection-change="handleSelectionChange"
        style="width: 100%"
      ></Table>
    </Row>
    <Row class="tr mt-10">
      <Button size="small" @click="handleInformationClose">{{
        $t('btns.cancel2')
      }}</Button>
      <Button size="small" type="primary" @click="submitInformation">{{
        $t('btns.ok2')
      }}</Button>
    </Row>
  </div>
</template>

<script>
    import {
        seekAreaListTreeByProject,
        addAreaBoxMapping,
        seekAreaBoxMapping,
        delAreaBoxMapping
    } from '@/api/public';
    export default {
        components: {},
        props: {
            resId: String
        },
        data () {
            return {
                columnsTable: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '区域层级',
                        key: 'areaName'
                    },
                    {
                        title: '建筑面积(m²)',
                        key: 'area'
                    },
                    {
                        title: '用能人数',
                        key: 'persons'
                    }
                ],
                input: '',
                tableData: [],
                resList: [],
                list: [],
                areaList: []
            };
        },
        created () {},
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.handleSeekAreaListTree();
            },
            handleSeekAreaListTree () {
                seekAreaListTreeByProject({ searchName: this.input })
                    .then((res) => {
                        if (res.success) {
                            this.tableData = res.data;
                            this.handleViewRelationships();
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
                            })
                        }
                });
            },
            handleViewRelationships () {
                seekAreaBoxMapping({ resId: this.resId })
                    .then((res) => {
                        if (res.success) {
                            if (
                                JSON.stringify(res.data) !== '{}' &&
                                res.data[this.resId].length > 0
                            ) {
                                this.areaList = res.data[this.resId].split(',');
                                this.setTowName(this.tableData, res.data[this.resId].split(','));
                                if (this.list.length > 1) {
                                    for (let i in this.list) {
                                        if (+i !== this.list.length - 1) {
                                            this.list[i] = this.list[i] + '>';
                                        }
                                    }
                                }
                            } else {
                            }
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
            setTowName (datas, arr) {
                for (let i in datas) {
                    for (let j in arr) {
                        if (datas[i].id === +arr[j]) {
                            this.list.push(datas[i].areaName);
                            if (datas[i].children) {
                                this.setTowName(datas[i].children, arr);
                            } else {
                            }
                        } else {
                        }
                    }
                }
            },
            closeNodeTree () {
                let parmas = {
                    areaId: this.areaList[this.areaList.length - 1],
                    resId: this.resId
                };
                delAreaBoxMapping(parmas)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.list = [];
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
            handleSelectionChange (val) {
                if (val.length > 1) {
                    this.$refs.selection.selectAll(false);
                    this.$refs.Table.toggleSelect(val.pop());
                } else {
                }
                this.resList = val;
            },
            currentChange (currentRow, oldCurrentRow) {
                this.$refs.Table.toggleSelect(currentRow);
            },
            submitInformation () {
                if (this.resList.length === 0) {
                    this.$Message.error({
                        content: '请绑定区域关系'
                    });
                }
                let parmas = {
                    areaId: this.resList[0].id,
                    resId: this.resId
                };
                addAreaBoxMapping(parmas)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.handleInformationClose();
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
            handleInformationClose () {
                this.input = '';
                this.$emit('handleClose');
            }
        },
        watch: {}
    };
</script>

<style lang="less" scoped>
.device-wrap{
  border: none;
  color: #606266
}

   .el-table__header-wrapper .el-table__body-wrapper
      th, tr, td{
 color :#606266;
        border-bottom: 1px solid #EBEEF5
      }

      td, th .is-leaf{
border-bottom: 1px solid #EBEEF5
      }

/deep/ .el-table__header .el-table-column--selection .el-checkbox__inner{
 display :none !important
}
</style>
