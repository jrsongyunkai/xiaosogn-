<template>
  <div class="periodPage">
      <Row class="section">
        <Col class="type">
            <Input
                class="short-input"
                placeholder="输入设备号"
                clearable
                v-model="perInput"
            ></Input>
        </Col>
        <Col class="type">
          <Select
            v-model="packetTypes"
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
        </Col>
        <Col class="type">
         <TreeSelect
                placeholder="选择分组"
                multiple
                show-checkbox
                v-model="packetFilter"
                transfer
                :data="packetFilterList"
              />
        </Col>
        <Col class="type">
            <DatePicker type="daterange" :value="days"  @on-change="handelDataPicker" placement="bottom-end"  style="width: 200px"></DatePicker>
        </Col>
      <Button
        type="primary"
        @click="handleonSubmit"
        style="margin-left: 10px; background: #007eff"
        >查询</Button
      >
      <Button @click="reset" style="margin-left: 10px">重置</Button>
       <div class="export">
                <Icon custom="icon-v5 icon-v5-daochu" size="20" style="margin-left: 10px" @click="handleExport" />
        </div>
      </Row>

      <Row class="dataEchats">
            <Period :options="trendData"/>
      </Row>
      <Row class="listTable">
          <h3>分时段用电报表</h3>
           <Table style="width: 100%;" border :columns="columns" :data="reportData"></Table>
      </Row>
  </div>
</template>
<script>
    import { getGroupType, getGroupTree, periodPowerTrend, periodPowerReport } from '@/api/public';
    import Period from '../../Common/Period.vue';
    export default {
        components: {
            Period
        },
        data () {
            return {
                perInput: '',
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                columns: [
                    {
                        title: ' ',
                        key: 'date',
                        children: [
                            {
                                title: '设备名称',
                                key: 'boxName',
                                align: 'center'
                            },
                            {
                                title: '设备ID',
                                key: 'mac',
                                align: 'center'

                            },
                            {
                                title: '线路名',
                                key: 'addrName',
                                align: 'center'

                            }
                        ]

                    },
                    {
                        title: '尖时',
                        key: 'date',
                        align: 'center',
                        children: [
                            {
                                title: '电量',
                                key: 'topPeakPower',
                                align: 'center'
                            },
                            {
                                title: '单价',
                                key: 'topPeakAvgPrice',
                                align: 'center'

                            },
                            {
                                title: '金额',
                                key: 'topPeakMoney',
                                align: 'center'

                            }
                        ]
                    },
                    {
                        title: '峰时',
                        key: 'date',
                        align: 'center',
                        children: [
                            {
                                title: '电量',
                                key: 'peakPower',
                                align: 'center'
                            },
                            {
                                title: '单价',
                                key: 'peakAvgPrice',
                                align: 'center'

                            },
                            {
                                title: '金额',
                                key: 'peakMoney',
                                align: 'center'

                            }
                        ]
                    },
                    {
                        title: '谷时',
                        key: 'date',
                        align: 'center',
                        children: [
                            {
                                title: '电量',
                                key: 'valleyPower',
                                align: 'center'
                            },
                            {
                                title: '单价',
                                key: 'valleyAvgPrice',
                                align: 'center'

                            },
                            {
                                title: '金额',
                                key: 'valleyMoney',
                                align: 'center'

                            }
                        ]
                    },
                    {
                        title: '平时',
                        key: 'date',
                        align: 'center',
                        children: [
                            {
                                title: '电量',
                                key: 'flatPower',
                                align: 'center'
                            },
                            {
                                title: '单价',
                                key: 'flatAvgPrice',
                                align: 'center'

                            },
                            {
                                title: '金额',
                                key: 'flatMoney',
                                align: 'center'

                            }
                        ]
                    },
                    {
                        title: '合计',
                        key: 'date',
                        align: 'center',
                        children: [
                            {
                                title: '电量（kwh）',
                                key: 'totalPower',
                                align: 'center'
                            },
                            {
                                title: '金额（元）',
                                key: 'totalMoney',
                                align: 'center'

                            }
                        ]
                    }

                ],

                trendData: {},
                reportData: [],
                dataPickerStart: this.$Date().add(-1, 'day').format('YYYY-MM-DD'),
                dataPickerEnd: this.$Date().add(-1, 'day').format('YYYY-MM-DD'),
                days: [this.$Date().add(-1, 'day').format('YYYY-MM-DD'), this.$Date().add(-1, 'day').format('YYYY-MM-DD')]
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            // 初始化事件
            handleonSubmit () {
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    this.init()
                }
            },
            init () {
                this.getGroupTypes()
                this.handlePowerTrend()
                this.handlePowerReport()
            },
            reset () {

            },
            getNowFormatDate () {
                let date = new Date()
                let seperator = '-'
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let strDate = date.getDate() - 7
                if (month >= 1 && month <= 9) {
                    month = '0' + month
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = '0' + strDate
                }
                let currentDate = year + seperator + month + seperator + strDate
                return currentDate
            },
            handleTypes (val) {
                this.packetTypes = val;
                this.getGroupTrees();
            },
            getGroupTypes () {
                let params = {
                    projectCode: this.$store.state.projectCode // 'P00000000012'
                };
                getGroupType(params)
                    .then((res) => {
                        //
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
                getGroupTree({ groupId: this.packetTypes })
                    .then((res) => {
                        if (res.code === '0') {
                            this.packNewlist = res.data;
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
            unique (arr) {
                return Array.from(new Set(arr));
            },
            getListid (val) {
                val.map((itm) => {
                    this.packNewlist.map((item) => {
                        if (JSON.stringify(item).toLowerCase().indexOf(itm) > -1) {
                            // let index = JSON.stringify(item).toLowerCase().indexOf(itm);
                            this.newArr.push(item.id);
                        }
                        return this.newArr;
                    });
                });
                // let idArr = this.newArr.map((item) => item.id);
                this.packetFilter = this.unique(this.newArr);
                // this.queryList();
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
            handelDataPicker (val) {
                this.dataPickerStart = val[0]
                this.dataPickerEnd = val[1]
                this.days = [this.dataPickerStart, this.dataPickerEnd]
            },
            handlePowerTrend () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    startTime: this.dataPickerStart,
                    endTime: this.dataPickerEnd,
                    nodeId: this.packetFilter ? this.packetFilter.join() : this.packetFilter.join(),
                    mac: this.perInput
                }
                periodPowerTrend(params).then((res) => {
                    var timer = []
                    var data = []
                    var flatPower = []
                    var peakPower = []
                    var valleyPower = []
                    var topPeakPower = []
                    res.data.forEach((item) => {
                        console.log(item);
                        timer.push(item.time)
                        flatPower.push(item.flatPower)
                        peakPower.push(item.peakPower)
                        valleyPower.push(item.valleyPower)
                        topPeakPower.push(item.topPeakPower)
                    })
                    data.push(flatPower, peakPower, valleyPower, topPeakPower)
                    this.trendData = {
                        timer: timer,
                        data: data
                    }
                })
            },
            handlePowerReport () {
                this.reportData = []
                var objTotal = {}
                let params = {
                    projectCode: this.$store.state.projectCode,
                    startTime: this.dataPickerStart,
                    endTime: this.dataPickerEnd,
                    nodeId: this.packetFilter.join(),
                    mac: this.perInput
                }
                periodPowerReport(params).then((res) => {
                    if (res.code === '0') {
                        res.data.detailVoList.forEach((item) => {
                            this.reportData.push(item)
                        })
                        objTotal = {
                            boxName: '合计',
                            addrName: '-',
                            mac: '-',
                            totalMoney: res.data.allTotalMoney,
                            totalPower: res.data.allTotalPower,
                            flatAvgPrice: res.data.flatTotalAvgPrice,
                            flatMoney: res.data.flatTotalMoney,
                            flatPower: res.data.flatTotalPower,
                            peakAvgPrice: res.data.peakTotalAvgPrice,
                            peakMoney: res.data.peakTotalMoney,
                            peakPower: res.data.peakTotalPower,
                            valleyAvgPrice: res.data.valleyTotalAvgPrice,
                            valleyMoney: res.data.valleyTotalMoney,
                            valleyPower: res.data.valleyTotalPower,
                            topPeakPower: res.data.topPeakTotalPower,
                            topPeakAvgPrice: res.data.topPeakTotalAvgPrice,
                            topPeakMoney: res.data.topPeakTotalMoney
                        }
                        this.reportData.push(objTotal)
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                })
            },
            handleExport () {
                this.$func.windowCountDown('/energy/manage/v5/xls/periodPowerReport.as?' + '&startTime=' + this.dataPickerStart + '&endTime=' + this.dataPickerEnd + '&projectCode=' + this.$store.state.projectCode + '&mac=' + this.perInput + '&nodeId=' + this.packetFilter)
            }

        }

    }
</script>
<style lang="less" scoped>
.periodPage{
    .section{
        background: #1a202e;
        padding: 20px;
        .type{
            margin-right: 10px;
        }
    }
    .dataEchats{
        margin-top: 10px;
        padding: 20px 10px 20px 10px;
        background: #1a202e;
    }
    .listTable{
        background: #1a202e;
        margin-top: 10px;
        padding: 20px;
        h3{
            margin-bottom: 20px;
        }
    }
     .export{
        background: rgba(0, 126, 255, 0.1);
        border: 1px solid #007EFF;
        border-radius: 5px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
    .ivu-icon{
        color: #007EFF;
        margin: 0 !important;
    }
}
}
</style>
