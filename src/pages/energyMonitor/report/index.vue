<template>
  <div class="reportPage">
    <Row class="section">
      <Col class="type">
        <Input
          class="short-input"
          placeholder="输入设备号"
          clearable
          v-model="inputVal"
        ></Input>
      </Col>
      <Col class="type">
        <Select
          v-model="packetTypes"
          @on-change="handleTypes"
          style="width: 200px"
          placeholder="选择分组类型"
          :clearable="true"
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
        <DatePicker
          type="daterange"
          placement="bottom-end"
          placeholder="选择起始时间"
          style="width: 200px"
          @on-change="handelDataPicker"
        ></DatePicker>
      </Col>
      <Button
        type="primary"
        @click="handleonSubmit"
        style="margin-left: 10px; background: #007eff"
        >查询</Button
      >
      <Button @click="reset" style="margin-left: 10px">重置</Button>
      <div class="export">
        <Icon
          custom="icon-v5 icon-v5-daochu"
          size="20"
          style="margin-left: 10px"
          @click="handleExport"
        />
      </div>
    </Row>
    <div class="Table">
      <Row class="listTable">
        <!-- <h3>用电报表</h3> -->
        <table align="center" style="width: 100%" class="dataTable">
          <tr>
            <th v-for="(item, index) in columns" :key="index">
              {{ item.title }}
            </th>
          </tr>

          <tr v-for="(item, index) in data" :key="index">
            <td v-for="(item, index) in data[index]" :key="index">
              {{ item }}
            </td>
          </tr>
        </table>
        <template v-if="this.data.length === 0">
          <table align="center" style="width: 100%" class="datasT">
            <tr>

              <th>设备号</th>
              <th>设备别名</th>
              <th>线路名称</th>
              <th>合计</th>
            </tr>
          </table>
          <div class="dataNull">最近七天暂无数据</div>
        </template>
      </Row>
    </div>
  </div>
</template>
<script>
    import { getGroupType, getGroupTree, powerReport } from '@/api/public';
    export default {
        data () {
            return {
                inputVal: '',
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                columns: [],
                data: [],
                dataPickerStart: this.$Date().format('YYYY-MM-DD'),
                dataPickerEnd: this.$Date().format('YYYY-MM-DD')
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            getNowFormatDate () {
                let date = new Date();
                let seperator = '-';
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let strDate = date.getDate() - 7;
                if (month >= 1 && month <= 9) {
                    month = '0' + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = '0' + strDate;
                }
                let currentDate = year + seperator + month + seperator + strDate;
                return currentDate;
            },
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
                this.getGroupTypes();
                this.handleData();
            },
            reset () {
                this.inputVal = '';
                this.packetTypes = '';
                this.packetFilter = [];
                this.init();
            },
            handleExport () {
                this.$func.windowCountDown(
                    '/energy/manage/v5/xls/powerReport.as?' +
                        '&startTime=' +
                        this.dataPickerStart +
                        '&endTime=' +
                        this.dataPickerEnd +
                        '&projectCode=' +
                        this.$store.state.projectCode +
                        '&mac=' +
                        this.inputVal +
                        '&nodeId=' +
                        this.packetFilter
                );
            },
            handelDataPicker (val) {
                this.dataPicker = val;
                this.dataPickerStart = val[0];
                this.dataPickerEnd = val[1];
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
            handleData () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    startTime: this.dataPickerStart,
                    endTime: this.dataPickerEnd,
                    nodeId: this.packetFilter
                        ? this.packetFilter.join()
                        : this.packetFilter,
                    mac: this.inputVal
                };
                powerReport(params).then((res) => {
                    if (res.code === '0') {
                        this.columns = [];
                        for (let i = 0; i < res.data.headerList.length; i++) {
                            this.columns.push({
                                title: res.data.headerList[i]
                            });
                            this.data = res.data.powerReportList;
                        }
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
.reportPage {
  .section {
    background: #1a202e;
    padding: 20px;
    .type {
      margin-right: 10px;
    }
  }
  .dataEchats {
    margin-top: 10px;
    padding: 20px 10px 20px 10px;
    background: #1a202e;
  }
  .export {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    .ivu-icon {
      color: #007eff;
      margin: 0 !important;
    }
  }
  .Table {
     background: #1a202e;
     padding: 20px;
     overflow: hidden;
    .listTable {
      overflow: auto;
      margin-top: 10px;
      width: 100%;
      h3 {
        margin-bottom: 20px;
      }
      .dataTable {
        table-layout: auto !important;
        word-break: keep-all !important;
        table-layout: fixed;
      }
      td,
      th {
        padding: 0 5px;
        // width: 100%;
      }

      .dataTable tr th:nth-last-child(2),
      .dataTable tr td:nth-last-child(2) {
        padding-right: 170px;
      }
      .dataTable tr th:nth-child(4),
      .dataTable tr td:nth-child(4) {
        padding-left: 450px;
      }
      .dataTable tr th,
      .dataTable tr td {
        font-size: 14px;
        text-align: center;
        height: 50px;
        overflow: auto;
      }
      .dataTable tr td {
        line-height: 50px;
      }
      .dataTable tr:first-child {
        background: #28313f;
      }
      .dataTable th {
        height: 50px;
      }
      .dataTable th:last-child,
      .dataTable tr td:last-child {
        border-left: 1px solid #090f19;
        width: 150px;
        text-align: center;
        position: fixed;
        right: 28px;
        z-index: 2;
      }
      .dataTable th:first-child,
      .dataTable th:nth-child(2),
      .dataTable th:nth-child(3),
      .dataTable th:last-child {
        line-height: 50px;
        background: #28313f;
      }
      .dataTable td:first-child,
      .dataTable td:nth-child(2),
      .dataTable td:nth-child(3),
      .dataTable td:last-child {
        background: #1a202e;
      }
      .dataTable th:first-child,
      .dataTable tr td:first-child {
        width: 150px;
        text-align: center;
        position: fixed;
        z-index: 2;
      }
      .dataTable th:nth-child(2),
      .dataTable tr td:nth-child(2) {
        width: 150px;
        text-align: center;
        position: fixed;
        z-index: 2;
        margin-left: 150px;
      }
      .dataTable th:nth-child(3),
      .dataTable tr td:nth-child(3) {
        border-right: 2px solid #090f19;
        width: 150px;
        text-align: center;
        position: fixed;
        z-index: 2;
        margin-left: 300px;
      }
      .dataTable th:first-child,
      .dataTable tr td:first-child {
        width: 150px;
        text-align: center;
        position: fixed;
        z-index: 2;
      }
      .datasT th {
        background: #28313f;
        height: 50px;
      }
      .dataNull {
        width: 100%;
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>
