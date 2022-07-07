<template>
  <div>
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <Col style="width: 100%">
        <Breadcrumb separator-class="el-icon-arrow-right">
          <BreadcrumbItem class="pointer" @click.native="$router.go(-1)"
            >返回</BreadcrumbItem
          >
          <BreadcrumbItem>线路列表</BreadcrumbItem>
        </Breadcrumb>
        <Form inline :model="formInline" class="demo-form-inline tr mt-20">
          <FormItem>
            <Button
              :disabled="channelAbled"
              @click="batchClosingOrOpening((val = true))"
              >批量合闸</Button
            >
          </FormItem>
          <FormItem>
            <Button
              :disabled="channelAbled"
              @click="batchClosingOrOpening((val = false))"
              >批量分闸</Button
            >
          </FormItem>
          <FormItem>
            <Select
              v-model="formInline.projectCode"
              :clearable='true'
              filterable
              placeholder="请输入项目名称"
            >
              <Option
                v-for="item in projectNames"
                :key="item.projectCode"
                :label="item.projectName"
                :value="item.projectCode"
              ></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input
              v-model="formInline.mac"
              clearable
              placeholder="请输入设备号"
              @on-keyup.enter.native="onSubmit"
            />
          </FormItem>
          <FormItem>
            <Select
              v-model="formInline.status"
             :clearable='true'
              style=" width: '130px'"
              placeholder="请选择"
            >
              <Option
                v-for="item in stats"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select
              v-model="formInline.state"
              :clearable='true'
              style=" width: '130px'"
              placeholder="请选择"
            >
              <Option
                v-for="item in state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="onSubmit">查询</Button>
          </FormItem>
          <FormItem>
            <Button :disabled="refreshAbled" @click="queryMacOcList">
              刷新
            </Button>
          </FormItem>
        </Form>
        <Table
          :data="tableData"
          :columns="columns"
          @on-selection-change="handleSelectionChange"
        >
          <template slot-scope="{ row }" slot="status">
            <span v-show="row.stats === -1" class="c-info">脱线 |</span>
            <span v-show="row.stats === 0" class="c-danger">离线 |</span>
            <span v-show="row.stats === 1" class="c-success">在线 |</span>
            <span v-if="row.stats" class="c-success">已通</span>
            <span v-else class="c-danger">已断</span>
          </template>
        </Table>
        <Page
          @on-page-size-change="handleSizeChange"
          @on-change="handleCurrentChange"
          :page-size-opts="[20, 50, 100, 500]"
          :current="currentPage"
          :page-size="pageSize"
          :total="channelTotal"
        ></Page>
      </Col>
    </Row>
  </div>
</template>

<script>
    import {
        queryMacOcState,
        batchRemotectrl,
        queryProjectMacAddrDetails
    } from '@/api/public';
    export default {
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '项目名称',
                        key: 'projectName',
                        align: 'center'
                    },
                    {
                        title: '位置',
                        key: 'projectAddress',
                        align: 'center'
                    },
                    {
                        title: '线路名称',
                        key: 'chnlTitle',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'status',
                        align: 'center'
                    },
                    {
                        title: '分/合闸时间',
                        key: 'onOffTime',
                        align: 'center'
                    }
                ],
                stats: [
                    {
                        value: '',
                        label: '请选择'
                    },
                    {
                        value: '0',
                        label: '离线'
                    },
                    {
                        value: '1',
                        label: '在线'
                    },
                    {
                        value: '-1',
                        label: '脱线'
                    }
                ],
                state: [
                    {
                        value: '',
                        label: '请选择'
                    },
                    {
                        value: 1,
                        label: '合闸'
                    },
                    {
                        value: 0,
                        label: '分闸'
                    }
                ],
                formInline: {
                    projectCode: this.$route.query.projectCode,
                    status: this.$route.query.status,
                    mac: this.$route.query.mac
                },
                projectNames: [],
                currentPage: 1,
                channelTotal: 0,
                pageSize: 20,
                tableData: [],
                channelAbled: true,
                refreshAbled: true,
                multipleSelection: [],
                disableRefresh: null,
                disableClosingOrOpening: null
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.queryChannel();
            },
            queryChannel () {
                this.tableData = [];
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    mac: this.formInline.mac,
                    onOrOff: this.formInline.state === 1 ? true : this.formInline.state === 0 ? false : '',
                    onlineStats: this.formInline.status,
                    projectCode: this.formInline.projectCode
                };
                queryProjectMacAddrDetails(params)
                    .then((res) => {
                        if (res.success) {
                            this.tableData = res.datas;
                            this.channelTotal = res.total;
                            this.projectNames = this.$store.state.allProjects.data;
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
            onSubmit () {
                this.currentPage = 1;
                this.queryChannel();
            },
            handleSizeChange (val) {
                this.currentPage = 1;
                this.pageSize = val;
                this.queryChannel();
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.queryChannel();
            },
            handleSelectionChange (val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length > 0) {
                    this.refreshAbled = false;
                    let onlineStatsArr = this.multipleSelection.map((item) => {
                        return item.onlineStats;
                    });
                    this.channelAbled =
                        onlineStatsArr.includes(0) || onlineStatsArr.includes(-1) ? !0 : !1;
                } else {
                    this.refreshAbled = this.channelAbled = true;
                }
            },
            queryMacOcList () {
                this.refreshAbled = true;
                this.disableRefresh = setTimeout(() => {
                    this.refreshAbled = this.multipleSelection.length > 0 ? !1 : !0;
                }, 2000);
                let params = this.multipleSelection.map((item) => {
                    return item.mac + '-' + item.chnlAddr;
                });
                this.$nextTick(function () {
                    queryMacOcState({ macAddr: params.join(',') })
                        .then((res) => {
                            if (res.success) {
                                for (let j = 0; j < this.tableData.length; j++) {
                                    for (let i = 0; i < res.data.length; i++) {
                                        if (
                                            res.data[i].mac === this.tableData[j].mac &&
                                            res.data[i].chnlAddr === +this.tableData[j].chnlAddr
                                        ) {
                                            this.tableData[j].onOffTime = res.data[i].onOffTime;
                                            this.tableData[j].onlineStats = res.data[i].onlineStats;
                                            this.tableData[j].stats = res.data[i].state;
                                        }
                                    }
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
                });
            },
            batchClosingOrOpening (val) {
                this.channelAbled = true;
                this.disableClosingOrOpening = setTimeout(() => {
                    let onlineStatsArr = this.multipleSelection.map((item) => {
                        return item.onlineStats;
                    });
                    if (this.multipleSelection.length > 0) {
                        this.channelAbled =
                            onlineStatsArr.includes(0) || onlineStatsArr.includes(-1) ? !0 : !1;
                    } else {
                        this.channelAbled = true;
                    }
                }, 2000);
                let params = this.multipleSelection.map((item) => {
                    return item.mac + '-' + item.chnlAddr;
                });
                batchRemotectrl({
                    macAddr: params.join(','),
                    onOrOff: val
                })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '命令已提交，生效中..'
                            });
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
            destroyed () {
                clearTimeout(this.disableRefresh);
                clearTimeout(this.disableClosingOrOpening);
            }
        }
    };
</script>

<style lang="less" scoped>
.channel {
  float: left;
}

.closing-button {
  margin-left: 17px;
}
</style>
