<template>
  <div>
    <warnS
      :datas="datas"
      @sendPage="changePage"
      @sendSize="changesize"
      @search="search"
      @reset="reset"

    >
    </warnS>
  </div>
</template>
<script>
// 引入面积图组件
// import LineChart from "@/pages/Common/Line";
    import warnS from '@/components/seftcontrol';
    // 引入异常状态的api
    import { warnList } from '@/api/safetyMonitor/abnormalState';

    // 引入面积图组件

    export default {
        data () {
            return {
                datas: {
                    tableData1: [],
                    tableColumns1: [
                        {
                            title: '事件ID',
                            key: 'id'
                        },
                        {
                            title: '地点',
                            key: 'onBur'
                        },
                        {
                            title: '设备号',
                            key: 'mac',
                            slot: 'mac'
                        },
                        {
                            title: '设备别名',
                            key: 'boxName'
                        },
                        {
                            title: '线路',
                            key: 'chnl'
                        },
                        {
                            title: '检查的规则',
                            key: 'ruleDesc'
                        },
                        {
                            title: '异常的描述',
                            key: 'erreoState'
                        },
                        {
                            title: '联系人',
                            key: 'linkInfo'
                        }
                    ],
                    isoutput: true,
                    date: true
                },
                params: {
                    projectCode: this.$store.state.projectCode,
                    pageNo: 1,
                    pageSize: 10,
                    mac: '',
                    startTime: this.$Date().format('YYYY-MM') + '-01',
                    endTime: this.$Date().format('YYYY-MM-DD'),
                    nodeIds: ''
                }
            };
        },
        methods: {
            init () {
                this.getTableData()
            },
            getTableData () {
                warnList(this.params).then((res) => {
                    // 获取数据

                    this.datas.tableData1 = res.datas;
                    // createTime: "2022-05-17 11:13:05"
                    // errDesc: "状态未知，设备已脱线"
                    this.datas.tableData1.forEach(item => {
                        item.erreoState = item.createTime + item.errDesc
                    })
                    this.datas.total = res.total;
                    // if(res.data.code == -1) this.$Message.error('你的登录信息已过期，请重新登录'); // 会话过期
                });
            },
            changePage (e) {
                // 改变页码
                this.params.pageNo = e;

                this.getTableData();
            },
            changesize (e) {
                // 改变每页显示数据
                this.params.rows = e;
                this.getTableData();
            },
            changemac (e) {
                // 搜索设备号
                this.params.mac = e;
                this.getTableData();
            },
            changeID (e) {
                this.params.nodeIds = e;
                this.getTableData();
            },
            search (e) {
                this.params.pageNo = 1
                this.params.mac = e.mac
                this.params.startTime = e.startTime
                this.params.endTime = e.endTime
                this.params.nodeIds = e.nodeIds

                this.getTableData();
            },
            reset () {
                this.params = {
                    projectCode: this.$store.state.projectCode,
                    pageNo: 1,
                    pageSize: 20,
                    mac: '',
                    startTime: '2022-01-01',
                    endTime: '2022-02-28',
                    nodeIds: ''
                }
                this.init()
            }
        },
        created () {
            this.init();
        },
        components: {
            warnS
        }
    };
</script>
