 <template>
  <div>
    <Form :model="ruleForm" ref="ruleForm" class="rule-form"  @submit.native.prevent>
      <FormItem>
        <Row>
          <Col :span="5" class="left-padding-right">
          <Input v-model="ruleForm.mac" placeholder="设备号"></Input>
        </Col>
        <Col :span="4" style="margin-left:10px">
          <Button type="primary" @click="queryMac">查 询</Button>
        </Col>
        <Col :span="15" v-if="false" class="tr">
          <Button type="text" @click="handleLine('')">所有设备</Button>
        </Col>
        </Row>

      </FormItem>
    </Form>
    <Table
      class="mt-20 device-wrap"
      :data="data"
      :columns="columns"
      >
        <template slot-scope="{row}" slot="macname">
            <div>{{row.name}}</div>
        </template>
        <template slot-scope="{row}" slot="action">
          <Button v-if="source === 'DetectionRules'" type="text" @click="handleLine(row.mac)">选中线路</Button>
          <Button v-if="source === 'BuiltInTiming'" type="text" @click="handleMac(row)">选中设备</Button>
        </template>
    </Table>
    <Page
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[20, 50, 100, 500]"
      :page-size="20"
      layout="sizes, prev, pager, next"
      :total="total">
    </Page>
    <Modal title="线路列表" :visible.sync="dialogVisible" width="60%" append-to-body="true">
      <LineList :mac="mac" source="DetectionRules" v-if="dialogVisible"  @handleLineListClose="handleLineListClose"></LineList>
      <div slot="footer"/>
    </Modal>
  </div>
</template>
<script>

    import LineList from '../Common/LineList.vue'
    import { queryBoxes } from '@/api/detectionRules/index'
    export default {
        props: {
            source: {
                type: String,
                default: function () {
                    return ''
                }
            },
            attrFlag: {
                type: String,
                default: function () {
                    return ''
                }
            }
        },
        data () {
            return {
                ruleForm: {
                    mac: ''
                },
                mac: '',
                data: [],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                dialogVisible: false,
                columns: [
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
                        title: '地点',
                        key: 'build',
                        align: 'center'
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        align: 'center'
                    },
                    {
                        title: '房间号',
                        key: 'room',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'action',
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
                this.queryList()
            },
            queryList (mac) {
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    projectCode: this.$store.state.projectCode
                }
                if (mac) params.key = mac
                if (this.attrFlag) params.attrFlag = 'enableAdvancedTiming'
                queryBoxes(params)
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
            queryMac () {
                this.currentPage = 1
                this.queryList(this.ruleForm.mac)
            },
            handleLine (mac) {
                this.dialogVisible = true
                this.mac = mac
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.queryList(this.ruleForm.mac)
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.queryList(this.ruleForm.mac)
            },
            handleLineClose () {
                this.dialogVisible = false
            },
            handleLineListClose () {
                this.$emit('handleDeviceClose')
            },
            handleMac (row) {
                this.$emit('sendBuiltInTimingMac', row.mac)
                this.$emit('sendBuiltInTimingName', row.name)
            }
        },
        components: {
            LineList
        }
    }
</script>
<style lang="less" scoped>
.device-wrap{
  border :none;
  color :#606266;
  .el-table__header-wrapper,.el-table__body-wrapper{
     th, tr, td{
       color :#606266;

     }

  }

}
  .Button--text{
    color: #409EFF;
  }

</style>
