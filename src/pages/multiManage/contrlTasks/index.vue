<template>
  <div id="contick">
    <div class="top">

      <Input
        v-model="params.taskName"
        placeholder="输入任务名称"
        class="inp"
        style="margin-left:20px"
        @on-enter="serach(params.taskName)"
      />

      <DatePicker
        type="date"
        placeholder="选择"
        class="inp"
        @on-change="changedate"
        v-model="date"
        :editable="false"
        :clearable="false"
      ></DatePicker>

      <Select v-model="model1" :clearable='true' style="width: 200px" class="inp" @on-change="changetype">
        <Option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <Button class="button" @click="getworkList">查询</Button>
      <Button class="button1" @click="result">重置</Button>

    </div>
    <!-- <br> -->
    <div style="background: #1a202e;margin-top:10px;padding:20px;height:685px">
      <h2 class="h2">控制任务清单</h2>
      <div class="table">
        <Table
          ref="currentRowTable"
          :columns="columns3"
          :data="data1"
          :disabled-hover="true"
          :height="520"
        >
        <template
          slot="active"
          slot-scope="{ row }"
        >
        <span style="color: #007EFF; cursor: pointer" @click="check(row)">
           查看
        </span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <span v-if="row.action === '合闸'" style="color: #21F27F">
            {{ row.action }}
          </span>
          <span v-else-if="row.action === '分闸'" style="color: #F24E4C">
            {{ row.action }}
          </span>
          <span v-else>
            {{ row.action }}
          </span>
        </template>
      </Table>
      <div style="float: right; margin-top: 10px">
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
    </div>
    <linkageScene :id='id' ref="linkageStatus"></linkageScene>
    <builtInTimer :id="id1" ref="builtInTimer"></builtInTimer>
    <sceneControl :id='id2' ref="sceneControl"></sceneControl>
    <latlongTimer :id='id3' ref="latlongTimer"></latlongTimer>
  </div>
</template>
<script>
    import { typeList, workList } from '@/api/multiManage/contrlTasks.js';
    import linkageScene from './linkageScene.vue'
    import sceneControl from './sceneControl.vue'
    import builtInTimer from './builtInTimer.vue'
    import latlongTimer from './latlongTimer.vue'
    export default {
        data () {
            return {
                cityList: [
                    {
                        value: '',
                        label: '全部'
                    }
                ],
                model1: '',
                columns3: [
                    {
                        key: 'number',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },
                    {
                        title: '任务名称',
                        key: 'taskName',
                        align: 'center'
                    },
                    {
                        title: '任务类型',
                        key: 'taskTypeDesc',
                        align: 'center'
                    },
                    {
                        title: '动作',
                        key: 'action',
                        align: 'center',
                        slot: 'action'
                    },
                    {
                        title: '执行时间',
                        key: 'execTime',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'active'
                    }
                ],
                data1: [],
                params: {
                    projectCode: this.$store.state.projectCode,
                    taskType: '', // 任务类型，从控制任务列表接口返回的type取值
                    taskName: '', // 任务名称（搜索）
                    execTime: '', // 执行时间（条件筛选）
                    pageNo: '1', // 页码，默认=1
                    pageSize: '10' // 每页记录数，默认=20
                },
                value: '',
                date: '',
                total: 0,
                page: 1,
                id: null,
                id1: null,
                id2: null,
                id3: null
            };
        },
        methods: {
            init () {
                this.gettypeList();
                this.getworkList();
            },
            change (e) {

            },
            gettypeList () {
                // 获取类型的列表
                typeList().then((res) => {
                    res.data.forEach((item) => {
                        let obj = {
                            value: item.taskType,
                            label: item.taskTypeDesc
                        };
                        this.cityList.push(obj);
                    });
                });
            },
            getworkList () {
                workList(this.params).then((res) => {
                    this.total = res.total;
                    this.page = res.page;
                    this.data1 = res.datas;
                    for (let i = 0; i < this.data1.length; i++) {
                        this.data1[i].number = (i + 1) + ((this.params.pageNo - 1) * (this.params.pageSize))
                    }
                });
            },
            serach (e) {
                this.params.taskName = e;
            },
            changedate (e) {
                this.params.execTime = e;
            },
            changetype (e) {
                this.params.taskType = e;
            },
            changePage (e) {
                this.params.pageNo = e;
                this.getworkList();
            },
            changesize (e) {
                this.params.pageSize = e;
                this.getworkList();
            },
            result () {
                this.params = {
                    projectCode: this.$store.state.projectCode,
                    taskType: '', // 任务类型，从控制任务列表接口返回的type取值
                    taskName: '', // 任务名称（搜索）
                    execTime: '', // 执行时间（条件筛选）
                    pageNo: '1', // 页码，默认=1
                    pageSize: '10' // 每页记录数，默认=20
                };
                this.value = '';
                this.date = '';
                this.model1 = '';
                this.getworkList();
            },
            check (row) {
                if (row.taskTypeDesc === '场景控制') {
                    this.id2 = '100' + row.id
                    this.$refs.sceneControl.handleViewScene()
                } else if (row.taskTypeDesc === '内置定时') {
                    this.id1 = row.id
                    this.$refs.builtInTimer.handleEdit()
                } else if (row.taskTypeDesc === '联动配置') {
                    this.id = row.id
                    this.$refs.linkageStatus.handleViewScene()
                } else {
                    this.id3 = row.id
                    this.$refs.latlongTimer.handleEdit()
                }
            }
        },
        created () {
            this.init();
        },
        components: {
            linkageScene, builtInTimer, sceneControl, latlongTimer
        }
    };
</script>
<style lang="less" scoped>
#contick{
  .top {
  margin-top: 70px;
  overflow: hidden;
  background: #1a202e;
  height: 52px;
  line-height: 52px;
  .inp {
    width: 260px;
    height: 32px;
    margin-left: 10px;
  }
  span {
    margin-left: 30px;
    margin-right: 10px;
  }
  .button{
    border-radius: 5px;
    width: 60px;
    height: 32px;
    color: #fff;
    // line-height: 20px;
    margin-left: 10px;
    // margin-top: 10px;
    // float: left;
    border: none;
    background-color: #007EFF;
  }
  .button1 {
    width: 60px;
    height: 32px;
    margin-left: 10px;
  }
}
.h2 {
  width: 96px;
  height: 16px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
}
.table {
  margin-top: 30px;
}
}
/deep/::-webkit-scrollbar {
  width: 6px; //竖轴宽度
  height: 6px; //横轴宽度
  // background-color: rgba(99, 110, 246, 0.5);
}

/* 滚动槽 */
/deep/::-webkit-scrollbar-track {
  border-radius: 10px;
}

/deep/::-webkit-scrollbar-thumb {
  background-color: #ccc;
}
</style>
