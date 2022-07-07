<template>
  <div id="maintenance">
      <div class="theader" v-if="$route.path !== '/MaintenanceRecords'">
        <div class="left">
            <div class="bor"></div>
            <span>维保记录  <i @click="handleMaintenance" class="icon-v5 icon-v5-add"></i></span>
        </div>
        <div class="right" @click="handleMore" >
            查看全部
        </div>
    </div>
    <Row :gutter="20" :style="$route.path !== '/MaintenanceRecords' ? {margin: 0} : {margin: 0, padding:'20px'}">
      <Col style="width:100%">
        <Breadcrumb separator-class="el-icon-arrow-right" v-if="$route.path === '/MaintenanceRecords'">
          <BreadcrumbItem class="pointer" @click.native="$router.go(-1)">返回</BreadcrumbItem>
          <BreadcrumbItem>维保记录</BreadcrumbItem>
        </Breadcrumb>
        <Col class="tr mt-20">
          <Form
            v-if="$route.path === '/MaintenanceRecords'"
            :inline="true"
            size="small"
            :model="maintenance"
            class="demo-form-inline tr"
            @submit.native.prevent
          >
            <FormItem>
                 <RadioGroup v-model="dateRadio" @on-change="handleDatePicker">
                    <Radio label="日"></Radio>
                    <Radio label="月"></Radio>
                </RadioGroup>

              <span class="block" v-show="dateRadio === '日'">
                  <DatePicker
                  v-model="maintenance.day"
                  type="date"
                  :editable="false"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                 >
                  </DatePicker>
                </span>
                <span class="block" v-show="dateRadio === '月'">
                  <DatePicker
                  v-model="maintenance.month"
                  value-format="yyyy-MM"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  >
                  </DatePicker>
                </span>
            </FormItem>
            <FormItem>
              <Input
                v-model="maintenance.mac"
                @keyup.enter.native="handleQueryRecords"
                placeholder=输入设备号
              ></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleQueryRecords">查询</Button>
            </FormItem>
          </Form>
        </Col>

      </Col>
       <Table
          :data="tableData"
          :height="$route.path === '/MaintenanceRecords' ? powerTableHeight : 200"
          style="width: 100%;margin-top: 10px"
          :columns="columns"
          >
          <template slot-scope="{row}" slot="projectName">
            <span v-if="$store.state.systemFlag !== '/MaintenanceRecords'">
                {{row.projectName}}
            </span>
          </template>
           <template slot-scope="{row}" slot="mac">
            <span v-if="$store.state.systemFlag !== '/MaintenanceRecords'">
                {{row.mac}}
            </span>
          </template>
          <template slot-scope="{row}" slot="action">
            <span class="pointer" @click="handleView(row)">查看</span>
          </template>
        </Table>
         <div class="block tc mt-10">
          <Page
            v-if="$route.path === '/MaintenanceRecords'"
            background
            @current-change="handleCurrentChange"
            @size-change="handleSize"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total">
          </Page>
        </div>
    </Row>
    <Modal
      title="维保编辑"
      id="modal"
      v-model="dialogVisible" @close="closeMaintenance">
      <MaintenanceEditor
      v-if="dialogVisible"
      :maintenanceBoxObj="maintenanceBoxObj"
      v-on:close-maintenance="closeMaintenance"
      ></MaintenanceEditor>
       <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
    import store from '@/store'
    import MaintenanceEditor from '../safetyMonitor/allWarn/MaintenanceEditor.vue'
    import { listMaintenance, findMaintenance } from '@/api/control/index'
    export default {
        props: {
            mac: {
                type: String
            },
            equipmentType: {
                type: Number
            }
        },
        data () {
            return {
                dateRadio: '日',
                maintenance: {
                    mac: this.$store.state.mac,
                    day: this.$func.getNowFormatDate(),
                    month: this.$func.getCurrentYearMonth()
                },
                dialogVisible: false,
                maintenanceBoxObj: {},
                tableData: [],
                currentPage: 1,
                total: 1,
                pageSize: this.$route.path === '/MaintenanceRecords' ? 20 : 10,
                powerTableHeight: this.$store.state.powerTableHeight,
                columns: [
                    {
                        title: '项目名称',
                        slot: 'projectName',
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        slot: 'mac',
                        align: 'center'
                    },
                    {
                        title: '地点',
                        key: 'addres',
                        align: 'center'
                    },
                    {
                        title: '维保时间',
                        key: 'maintenanceTime',
                        align: 'center'
                    },
                    {
                        title: '处理人员',
                        key: 'handlerName',
                        align: 'center'
                    },
                    {
                        title: '联系电话',
                        key: 'telephone',
                        align: 'center'
                    },
                    {
                        title: '处理内容 / 结果',
                        key: 'handledResult',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ]
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                this.queryRecords()
            },
            queryRecords () {
                let params = {
                    projectCode: this.$route.params.projectCode ? this.$route.params.projectCode : this.$store.state.projectCode,
                    mac: this.maintenance.mac,
                    dateType: this.dateRadio === '日' ? '1' : '2',
                    date: this.dateRadio === '日' ? this.maintenance.day : this.maintenance.month,
                    page: this.currentPage,
                    rows: this.pageSize
                }
                listMaintenance(params)
                    .then(res => {
                        if (res.success) {
                            this.tableData = res.datas
                            this.total = res.total
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
                    .finally(() => {
                        this.loading = false
                    })
            },
            handleMore () {
                this.$router.push({
                    name: 'MaintenanceRecords',
                    params: {
                        projectCode: ''
                    }
                })
            },
            handleDatePicker (val) {
                if (val === '日') {
                    // 日
                    this.dateRadio = '日'
                } else {
                    // 月
                    this.dateType = '月'
                }
                this.queryRecords()
            },
            handleMaintenance () {
                store.commit('alarmId', '')
                this.dialogVisible = true
            },
            handleView (obj) {
                let params = {
                    mac: obj.mac,
                    alarmId: '',
                    id: obj.id
                }
                findMaintenance(params)
                    .then(res => {
                        if (res.success) {
                            store.commit('maintenanceObj', res.data)
                            this.maintenanceBoxObj = obj

                            if (!this.maintenanceBoxObj.equipmentType) this.maintenanceBoxObj.equipmentType = this.equipmentType
                            this.dialogVisible = true
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
                    .catch(res => {
                        this.$Message.error({
                            content: '未知错误，请刷新重试'
                        })
                    })
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.queryRecords()
            },
            handleSize (val) {
                this.currentPage = 1
                this.pageSize = val
                this.queryRecords()
            },
            handleQueryRecords () {
                this.currentPage = 1
                this.queryRecords()
            },
            closeMaintenance () {
                store.dispatch('resetMaintenanceObj')
                this.queryRecords()
                this.dialogVisible = false
            }
        },
        watch: {
            '$route' (to, from) {
                if (from.path === '/MaintenanceBox') this.queryRecords()
            }
        },
        components: {
            MaintenanceEditor
        }
    }
</script>
<style lang="less" scoped>
#maintenance{
  margin-top: 10px;
  .bnt{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 8px;
    margin: 0 5px;
  }
  .block{
    width: 100%;
    margin-top: 10px;
  }
}
/deep/.ivu-modal-footer{
    padding: 0;
}
</style>
