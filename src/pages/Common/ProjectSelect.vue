<template>
  <div class="project-selection">
    <Scroll>
      <Form
        ref="form"
        inline
        size="small"
        :model="form"
        @submit.native.prevent
        class="demo-form-inline"
      >
        <FormItem>
          <Input
            v-model="form.name"
            clearable
            placeholder="项目编号/Home项目名称"
          ></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="onSubmit">查询</Button>
        </FormItem>
      </Form>
      <Col :span="24">
        <Table
          ref="multipleTable"
          :data="tableData"
          :columns="columnsTable"
          @on-selection-change="handleSelection"
        >
          <template slot-scope="{ row }" slot="chiose">
            <Button type="text" size="small" @click="handleSelect(row)"
              >选择</Button
            >
          </template>
        </Table>
      </Col>
    </Scroll>
    <Page
      class="position-page"
      background
      @on-page-size-change="handleSizeChange"
      @on-change="handleCurrentChange"
      :current="currentPage"
      :page-size-opts="[10, 20, 30]"
      :page-size="pageSize"
      :total="total"
    ></Page>
  </div>
</template>
<script>
    import { listProjectForConfig } from '@/api/public';
    export default {
        name: 'project-select',
        model: {
            prop: 'options',
            event: 'select-multiple'
        },
        props: {
            options: {
                type: Array,
                defalut () {
                    return [];
                }
            },
            type: {
                type: String,
                defalut () {
                    return '';
                }
            }
        },
        data () {
            return {
                columnsTable: [
                    { title: '选择', slot: 'chiose', with: 60 },
                    {
                        title: '项目编号',
                        key: 'code'
                    },
                    {
                        title: '项目名称',
                        key: 'name'
                    }
                ],
                form: {
                    name: ''
                },
                multipleSelection: [],
                tableData: [],
                pageNo: 1,
                pageSize: 10,
                currentPage: 1,
                total: 0,
                newOptions: this.options
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.initTable();
            },
            initTable () {
                //  let _this = this;
                let params = {
                    params: {
                        keyword: this.form.name
                    },
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                };
                listProjectForConfig(params)
                    .then((res) => {
                        if (res.success) {
                            this.tableData = res.datas;
                            this.total = res.total;
                            // bug 暂时无法解决
                            // this.$nextTick(function () {
                            //     _this.checked();
                            // });
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
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
            checked () {
                let _this = this;
                this.newOptions.forEach((item) => {
                    _this.tableData.forEach((value, index) => {
                        if (value.code === item.code) {
                            _this.$refs.multipleTable.toggleRowSelection(
                                _this.tableData[index],
                                true
                            );
                        }
                    });
                });
            },
            handleSelection (row) {
                //
                let _index = JSON.stringify(this.newOptions).indexOf(
                    JSON.stringify({ code: row.code, name: row.name, others: {} })
                );

                if (_index === -1) {
                    row.map((item) => {
                        this.options.push({ code: item.code, name: item.name, others: {} });
                        this.$Message.info({
                            content: '项目选择' + ' "' + item.name + '"'
                        });
                    });
                } else {
                    this.newOptions.forEach((item, i) => {
                        if (item.code === row.code) {
                            this.newOptions.splice(i, 1);
                        }
                    });
                }
                this.$emit('select-multiple', this.newOptions);
            },
            handleSelectable (row, index) {
                let _index = JSON.stringify(this.newOptions).indexOf(
                    JSON.stringify({ code: row.code, name: row.name, others: {} })
                );
                return _index === -1;
            },
            handleSizeChange (val) {
                this.pageSize = val;
                this.initTable();
            },
            handleCurrentChange (val) {
                this.pageNo = val;
                this.initTable();
            },
            cellStyle (row) {
                if (row.columnIndex === 0 && this.type !== 'firstChoice') {
                    return 'choose-cell';
                }
            },
            onSubmit () {
                this.initTable();
            },
            handleSelect (val) {
                this.newOptions = [];
                this.newOptions.push(val);

                this.$emit('select-multiple', this.newOptions);
                this.$emit('closeProjects');
            }
        },
        watch: {
            newOptions: {
                handler (newVal, oldVal) {
                    this.initTable();
                }
            }
        }
    };
</script>
<style lang="less" scoped>
.project-selection {
  height: 400px;
}
.position-page {
  margin-left: 150px;
}
.el-table,
.el-table th,
.el-table td {
  border: 1px solid #ebeef5;
  color: #909399;
}
.el-table .choose-cell .cell {
  .el-checkbox__inner {
    display: none;
    position: relative;
    &::before {
      content: '选择';
      position: absolute;
      right: 8px;
    }
  }
}
</style>
