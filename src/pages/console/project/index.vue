<template>
  <div class="project">
    <!-- <div class="project_edit">
            <edit/>
        </div> -->
    <Row class="project_list mt">
      <Col span="24" style="padding: 0">
        <Row class="sw" style="">
          <Col span="24" class="df content">
            <Col span="24">
              <div class="content">
                <div class="project_map" style="padding-bottom: 1px">
                  <div
                    class="line"
                    style="margin-left: -20px; margin-top: -30px"
                  ></div>
                  <div
                    class="title"
                    style="margin-left: 0px; margin-top: -30px"
                  >
                    常用功能
                  </div>
                </div>
              </div>
              <Button
                type="primary"
                style="
                  background: #1a202e;
                  color: #e03c3a;
                  float: right;
                  margin-top: -30px;
                  margin-right: 20px;
                  border: 1px solid #1a202e;
                "
                v-show="flag"
                @click="cancel"
                >取消</Button
              >
              <Button
                type="primary"
                style="
                  background: #1a202e;
                  color: #007eff;
                  float: right;
                  margin-top: -30px;
                  margin-right: 20px;
                  border: 1px solid #1a202e;
                "
                @click="joinin"
                >{{ flag ? "保存" : "编辑" }}</Button
              >
              <div style="">
                <div
                  class="item"
                  v-for="(item, index) in dataArr"
                  :key="item.title"
                  @click="go(item)"
                  @mouseenter="enter(index)"
                  @mouseleave="leave"
                >
                  <i
                    :class="item.icon"
                    class="icon-v5"
                    :style="isHover === index ? 'color:#007EFF' : ''"
                  ></i>
                  <span :style="isHover === index ? 'color:#007EFF' : ''">{{
                    item.name
                  }}</span>

                  <span
                    type="text"
                    style="position: absolute; right: 8px; top: 0px"
                    @click.stop="deletes(item, index)"
                    v-show="flag"
                    class="icon-v5 icon-v5-shanchu2"
                  ></span>
                </div>
                <div
                  class="item"
                  style="
                    background: rgba(0, 126, 255, 0.1);
                    position: relative;
                    border: 1px dashed #007eff;
                  "
                  @click="add"
                  v-show="flag"
                >
                  <i
                    class="ivu-icon ivu-icon-md-add"
                    style="margin-left: 90px; font-size: 20px; color: #007eff"
                  ></i>

                  <span
                    type="text"
                    style="
                      position: absolute;
                      left: 98px;
                      top: 0px;
                      color: #007eff;
                    "
                    >添加</span
                  >
                </div>
              </div>
            </Col>
          </Col>
        </Row>
      </Col>
    </Row>
    <Modal
      title="添加常用功能"
      v-model="modal"
      class-name="mt"
      :mask="false"
      width="250"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Tree :data="AddEditData" show-checkbox class="treePut"></Tree>
    </Modal>
    <Modal title="控制设备数" v-model="macDialog">
      <Table :data="macData" :columns="macColumns"> </Table>
      <div slot="footer">
        <Button type="primary" @click="macDialog = false">确定</Button>
      </div>
    </Modal>
    <div class="map">
      <div class="tabs">
          <div class="tabpane" @click="change(0)" :class="{ active: isActive === 0 }">项目概况</div>
          <div class="tabpane" @click="change(1)" :class="{ active: isActive === 1 }">设备概况</div>
      </div>

      <div class="first1" v-if="isActive == 0"><projectmap /></div>
      <div class="second2" v-else-if="isActive == 1"><projectmap2 /></div>
    </div>

    <Row class="project_list mt" :gutter="10">
      <Col span="8">
        <div class="df content">
          <Col span="3">
            <div class="bx lb">
              <i
                ><img src="../../../assets/svg/icon-v5-shebeixinxi.svg" alt=""
              /></i>
            </div>
          </Col>
          <Col span="7" class="tx">
            <div class="tl" @click="changeUrl('/deviceList', '')">
              <span>{{ option.totalMac }}</span>
              <div>设备总数</div>
            </div>
          </Col>
          <Col span="7" class="tx">
            <div class="tl" @click="changeUrl('/deviceList', '1')">
              <span style="color: #21f27f">{{ option.totalOnlineMac }}</span>
              <div>在线设备数</div>
            </div>
          </Col>
          <Col span="7" class="tx">
            <div class="tl" @click="changeUrl('/deviceList', ['-1', '0'])">
              <span style="color: #999">{{ option.totalOfflineMac }}</span>
              <div>离线设备数</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col span="8">
        <div class="df content">
          <Col span="3">
            <div class="bx la">
              <i
                ><img src="../../../assets/svg/icon-v5-xianlu1.svg" alt=""
              /></i>
            </div>
          </Col>
          <Col span="7" class="tx">
            <div class="tl">
              <span>{{ option.totalLine }}</span>
              <div>线路总数</div>
            </div>
          </Col>
          <Col span="7" class="tx">
            <div class="tl">
              <span style="color: #21f27f">{{ option.totalOnlineLine }}</span>
              <div>在线线路数</div>
            </div>
          </Col>
          <Col span="7" class="tx">
            <div class="tl">
              <span style="color: #999">{{ option.totalOfflineLine }}</span>
              <div>离线线路数</div>
            </div>
          </Col>
        </div>
      </Col>

      <Col span="4">
        <div class="df content">
          <Col span="12">
            <div class="bx lr">
              <i
                ><img
                  src="../../../assets/svg/icon-v5-baojingjingbaoyujing.svg"
                  alt=""
              /></i>
            </div>
          </Col>
          <Col span="12" class="tx">
            <div class="tl" @click="changeUrl('/Alarms', '-100')">
              <span>{{ option.totalAlarmThisMonth }}</span>
              <div>报警总数(本月)</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col span="4">
        <div class="df content">
          <Col span="12">
            <div class="bx ly">
              <i
                ><img src="../../../assets/svg/icon-v5-guzhang.svg" alt=""
              /></i>
            </div>
          </Col>
          <Col span="12" class="tx">
            <div class="tl" @click="changeUrl('/Alarms', '-200')">
              <span>{{ option.totalWarnThisMonth }}</span>
              <div>预警总数(本月)</div>
            </div>
          </Col>
        </div>
      </Col>
    </Row>

    <Row class="project_list mt" :gutter="10">
      <Col span="4">
        <div class="df content">
          <Col span="12">
            <div class="bx lrs">
              <i><img src="../../../assets/svg/icon-v5-notice.svg" alt="" /></i>
            </div>
          </Col>
          <Col span="12" class="tx">
            <div class="tl" @click="$router.push('/safetyMonitor/allWarn')">
              <span>{{ option.totalAlarmBoxToday }}</span>
              <div>今日报警设备数</div>
            </div>
          </Col>
        </div>
      </Col>

      <Col span="7">
        <div class="df content">
          <Col span="4">
            <div class="bx lr">
              <i
                ><img
                  src="../../../assets/svg/icon-v5-baojingjingbaoyujing.svg"
                  alt=""
              /></i>
            </div>
          </Col>
          <Col span="10" class="tx">
            <div class="tl" @click="changeUrls('1', '')">
              <span>{{ option.totalAlarmToday }}</span>
              <div>今日报警总数</div>
            </div>
          </Col>
          <Col span="10" class="tx">
            <div class="tl" @click="changeUrls('-1', '')">
              <span>{{ option.totalAlarmYesterday }}</span>
              <div>昨日报警总数</div>
            </div>
          </Col>
        </div>
      </Col>

      <Col span="7">
        <div class="df content">
          <Col span="4">
            <div class="bx lg">
              <i
                ><img src="../../../assets/svg/icon-v5-yichuli.svg" alt=""
              /></i>
            </div>
          </Col>
          <Col span="10" class="tx">
            <div class="tl" @click="changeUrls('2', '2')">
              <span>{{ option.totalAlarmProcessedThisMonth }}</span>
              <div>本月已处理报警数</div>
            </div>
          </Col>
          <Col span="10" class="tx">
            <Circle :percent="Process" :size="60" trail-color="#eaeef2">
              <span class="demo-Circle-inner" style="font-size: 14px">{{
                Process + "%"
              }}</span>
            </Circle>
          </Col>
        </div>
      </Col>
      <Col span="6">
        <div class="df content">
          <Col span="4">
            <div class="bx lrs">
              <i
                ><img src="../../../assets/svg/icon-v5-weichuli.svg" alt=""
              /></i>
            </div>
          </Col>
          <Col span="10" class="tx">
            <div class="tl" @click="changeUrls('2', '0')">
              <span>{{ option.totalAlarmNoProcessThisMonth }}</span>
              <div>本月未处理报警数</div>
            </div>
          </Col>
          <Col span="10" class="tx">
            <Circle :percent="NoProcess" :size="60" stroke-color="#ff5500">
              <span class="demo-Circle-inner" style="font-size: 14px">{{
                NoProcess + "%"
              }}</span>
            </Circle>
          </Col>
        </div>
      </Col>
    </Row>
    <div class="project_table pd mt16 content">
      <div class="project_map" style="padding: 0">
        <div class="line"></div>
        <div class="title">报警列表</div>
      </div>
      <Tabs value="name1" @on-click="handletabCount" v-model="active">
        <TabPane
          v-for="(item, index) in tabsList"
          :key="index"
          :label="item.desc"
          :name="item.equipClassify"
        >
          <Table height="300" :columns="shortcolumns" :data="shortdata">
            <template slot-scope="{ row }" slot="valueDescribe">
              <span class="c-danger">{{ row.valueDescribe.value }}</span> /
              <span class="c-primary">{{ row.valueDescribe.threshold }}</span>
            </template>
            <template slot-scope="{ row }" slot="progress">
              <Progress :percent="row.progress" hide-info />
            </template>
            <template slot-scope="{ row }" slot="stage">
              <!-- 0未处理 1处理中 2已处理 -->
              <span v-if="row.stage === 0" class="b-danger">未处理</span>
              <span v-if="row.stage === 1" class="b-info">处理中</span>
              <span v-if="row.stage === 2" class="b-success">已处理</span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <span
                class="pointer"
                style="margin-right: 5px; color: #f56c6c"
                @click="handleUrge(row.id)"
                v-if="row.stage === 0"
                >催促</span
              >
              <template>
                <span
                  class="pointer"
                  style="color: #007eff"
                  @click="handleMaintenance(row)"
                  >处理</span
                >
              </template>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </div>
    <div class="project_chart pd mt16 content">
      <div class="project_map" style="padding: 0">
        <div class="line"></div>
        <div class="title">用电警情趋势及处理率</div>
      </div>
      <Processing :options="trendOptions"></Processing>
    </div>
    <Row :gutter="10" class="project_list mt16">
      <Col :span="6">
        <div class="content df">
          <Col :span="4" class="tb">
            <div>年</div>
          </Col>
          <Col :span="20" class="tx">
            <div class="tl">
              <span>{{ Statistics.curYearPower }}</span>
              <div>本年用电量</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="6">
        <div class="content df">
          <Col :span="4" class="tb">
            <div>月</div>
          </Col>
          <Col :span="20" class="tx">
            <div class="tl">
              <span>{{ Statistics.curMonthPower }}</span>
              <div>本月用电量</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="6">
        <div class="content df">
          <Col :span="4" class="tb">
            <div>周</div>
          </Col>
          <Col :span="20" class="tx">
            <div class="tl">
              <span>{{ Statistics.curWeekPower }}</span>
              <div>本周用电量</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="6">
        <div class="content df">
          <Col :span="4" class="tb">
            <div>日</div>
          </Col>
          <Col :span="20" class="tx">
            <div class="tl">
              <span>{{ Statistics.yesterdayPower }}</span>
              <div>昨日用电量</div>
            </div>
          </Col>
        </div>
      </Col>
    </Row>
    <Row :gutter="10" class="project_trend mt">
      <Col span="12">
        <div class="pd content">
          <div class="project_map" style="padding: 0">
            <div class="line"></div>
            <div class="title">前两天负载用电趋势</div>
          </div>
          <line-area-chart :options="HoursOptions"></line-area-chart>
        </div>
      </Col>
      <Col span="12">
        <div class="pd content">
          <div class="project_map" style="padding: 0">
            <div class="line"></div>
            <div class="title">近两周负载用电趋势</div>
          </div>
          <line-area-chart :options="WeekOptions"></line-area-chart>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="24" class="mt">
        <div class="pd content">
          <div class="project_map" style="padding: 0">
            <div class="line"></div>
            <div class="title">近两年负载用电趋势</div>
          </div>
          <line-area-chart :options="YearsOptions"></line-area-chart>
        </div>
      </Col>
    </Row>
    <Row :gutter="10" class="project_list mt16">
      <Col :span="4">
        <div class="pd df content">
          <Col :span="8">
            <div class="bx lb">
              <img src="../../../assets/svg/icon-v5-yonghu.svg" alt="" />
            </div>
          </Col>
          <Col :span="16" class="tx">
            <div class="tl">
              <span>{{ StatData.totalUser }}</span>
              <div>用户总数</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="5">
        <div class="pd df content">
          <Col :span="6">
            <div class="bx lb">
              <img src="../../../assets/svg/icon-v5-job.svg" alt="" />
            </div>
          </Col>
          <Col :span="18" class="tx">
            <div class="tl">
              <span>{{ StatData.totalTask }}</span>
              <div>任务总数</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="5">
        <div class="pd df content">
          <Col :span="8">
            <div class="bx ly">
              <img src="../../../assets/svg/icon-v5-shalou.svg" alt="" />
            </div>
          </Col>
          <Col :span="16" class="tx">
            <div class="tl">
              <span>{{ StatData.totalTaskWaitExec }}</span>
              <div>待执行任务总数（本月）</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="5">
        <div class="pd df content">
          <Col :span="6">
            <div class="bx lb">
              <img src="../../../assets/svg/icon-v5-xunjian.svg" alt="" />
            </div>
          </Col>
          <Col :span="18" class="tx">
            <div class="tl">
              <span>{{ StatData.totalInspection }}</span>
              <div>巡检总数（本月）</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="5">
        <div class="pd df content">
          <Col :span="6">
            <div class="bx lb">
              <img src="../../../assets/svg/icon-v5-routine.svg" alt="" />
            </div>
          </Col>
          <Col :span="18" class="tx">
            <div class="tl">
              <span>{{ StatData.totalMaintenance }}</span>
              <div>维保总数（本月）</div>
            </div>
          </Col>
        </div>
      </Col>
    </Row>
    <div class="project_table pd mt content">
      <div class="project_map mb" style="padding: 0">
        <div class="line"></div>
        <div class="title">控制任务列表（近一个周）</div>
      </div>
      <Table height="300" :data="taskData" :columns="taskcolumns">
        <template slot-scope="{ row }" slot="totalMac">
          <span class="pointer c-primary" @click="handleMac(row)">
            {{ row.totalMac }}
          </span>
        </template>
        <template slot-scope="{ row }" slot="actionTypeName">
          <!-- 1合闸 2分闸 -->
          <template v-if="row.actionType === 1">
            <span class="c-danger c-d">{{ row.action }}</span>
          </template>
          <template v-if="row.actionType === 0">
            <span class="c-success c-s">{{ row.action }}</span>
          </template>
        </template>

        <template slot-scope="{ row }" slot="statusValue">
          <!-- 0无效 1有效 -->
          <span v-if="row.statusValue === 0" class="c-danger c-d">无效</span>
          <span v-if="row.statusValue === 1" class="c-success c-s">有效</span>
        </template>
      </Table>
    </div>
    <div class="project_chart pd mt content">
      <div class="project_map" style="padding: 0">
        <div class="line"></div>
        <div class="title">维保趋势（近一个月）</div>
      </div>
      <line-area-chart :options="MainOptions"></line-area-chart>
    </div>

    <!-- 维保编辑 -->
    <Modal
      v-model="dialogVisible"
      title="编辑维保"
      @on-cancel="closeMaintenance"
      id="modal"
    >
      <maintenance-editor
        v-if="dialogVisible"
        :maintenanceObj="maintenanceObj"
        @close-maintenance="closeMaintenance"
      />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
    import store from '@/store/index';
    import edit from './edit.vue';
    import projectmap from './projectMap.vue';
    import projectmap2 from './projectMap2.vue';
    import LineAreaChart from '../../Common/LineArea.vue';
    import Processing from '../../Common/processing.vue';
    import MaintenanceEditor from '../../safetyMonitor/allWarn/MaintenanceEditor.vue';
    import {
        getSaveFastMenus, // 保存
        getQueryFastMenus, // 获取
        getfindMaintenance,
        alarmUrgePush,
        getEquipClassifys,
        getByEquipClassify,
        indexStatData,
        getMaintenanceTrand,
        getTrendAndProcessRate,
        getStatistics,
        getLoadHour,
        getLoadDay,
        getLoadYears,
        getTaskColStatData,
        getControlTaskList
    } from '@/api/console/project';
    export default {
        components: {
            edit,
            projectmap2,
            projectmap,
            LineAreaChart,
            Processing,
            MaintenanceEditor
        },
        data () {
            return {
                shortdata: [],
                isActive: 0,
                shortcolumns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 60,
                        align: 'left'
                    },
                    {
                        title: '事件ID',
                        key: 'id',
                        align: 'left'
                    },
                    {
                        title: '设备号',
                        key: 'mac',
                        width: 200,
                        align: 'left'
                    },
                    {
                        title: '设备别名',
                        key: 'macName',
                        align: 'left'
                    },
                    {
                        title: '线路',
                        key: 'channelTitle',
                        align: 'left'
                    },
                    {
                        title: '报警类型',
                        key: 'info',
                        align: 'left'
                    },
                    {
                        title: '报警值/阈值',
                        slot: 'valueDescribe',
                        align: 'left'
                    },
                    {
                        title: '进度',
                        slot: 'progress',
                        align: 'left'
                    },
                    {
                        title: '耗时',
                        key: 'passTime',
                        align: 'left',
                        width: 80
                    },
                    {
                        title: '状态',
                        slot: 'stage',
                        align: 'left',
                        width: 100
                    },
                    {
                        title: '报警时间',
                        key: 'time',
                        align: 'left',
                        width: 200
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'left'
                    }
                ],
                editText: '编辑',
                edit: false,
                AddEdit: false,
                Querylist: '',
                tabsList: [],
                active: '',
                option: {},
                addProcessed: '',
                newRatio: [],
                NoProcess: 0,
                Process: 0,
                trendOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                alarm: [],
                time: [],
                processedRatio: [],
                Statistics: '',
                HoursOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                afterPower: [],
                prePower: [],
                hourstime: [],
                WeekOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                wafterPower: [],
                wprePower: [],
                weekstime: [],
                YearsOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                yafterPower: [],
                yprePower: [],
                yeekstime: [],
                StatData: '',
                taskData: [],
                taskcolumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'left'
                    },
                    {
                        title: '任务名称',
                        key: 'taskName',
                        align: 'left'
                    },
                    {
                        title: '任务类型',
                        key: 'taskTypeDesc',
                        align: 'left'
                    },
                    {
                        title: '控制设备数',
                        slot: 'totalMac',
                        align: 'left'
                    },
                    {
                        title: '动作',
                        slot: 'actionTypeName',
                        align: 'left'
                    },
                    {
                        title: '状态',
                        slot: 'statusValue',
                        align: 'left'
                    },
                    {
                        title: '执行时间',
                        key: 'nextExecTime',
                        align: 'left'
                    }
                ],
                MainOptions: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                mainNumber: [],
                mainTime: [],
                modal: false,
                AddEditData: [],
                dataArr: [],
                flag: false,

                dialogVisible: false,
                macDialog: false,
                macData: [],
                macColumns: [
                    {
                        title: '设备ID',
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '设备别名',
                        key: 'name',
                        align: 'center'
                    }
                ],
                arr: [],
                isHover: false
            };
        },
        methods: {
            init () {
                this.EquipClass();
                this.getStatData();
                this.queryAlarmTrend();
                this.queryGetStatistics();
                this.queryGetLoadHour();
                this.queryGetLoadWeek();
                this.queryGetLoadYears();
                this.handleStatData();
                this.queryTaskData();
                this.queryMaintenanceTrand();
                setTimeout(() => {
                    this.handletabCount(this.active);
                }, 500);

                getQueryFastMenus({ projectCode: this.$store.state.projectCode }).then(
                    (res) => {
                        this.dataArr = res.data;
                        this.treeDate();
                    }
                );
            },
            handleMac (item) {
                this.macDialog = true;
                this.macData = item.macInfos;
            },
            change (index) {
                console.log(index);
                this.isActive = index; // 重要处
            },
            treeDate () {
                this.AddEditData = [
                    {
                        title: '项目主页',
                        checked: false,
                        children: [
                            {
                                title: '设备概况',
                                checked: false,
                                value: '/console/device',
                                icon: 'icon-v5-shebeigaikuang1',
                                nodeKey: 1,
                                findIndexs: [0, 0]
                            },
                            {
                                title: '拓扑图',
                                value: '/console/topology',
                                checked: false,
                                icon: 'icon-v5-tuoputu1',
                                nodeKey: 2,
                                findIndexs: [0, 1]
                            }
                        ],
                        nodeKey: 0
                    },
                    {
                        title: '安全监管',
                        checked: false,
                        children: [
                            {
                                title: '全部报警',
                                checked: false,
                                value: '/safetyMonitor/allWarn',
                                icon: 'icon-v5-quanbubaojing1',
                                nodeKey: 4,
                                indeterminate: false
                            },
                            {
                                title: '漏电流',
                                checked: false,
                                value: '/safetyMonitor/leakage',
                                icon: 'icon-v5-loudianliu1',
                                nodeKey: 5,
                                indeterminate: false
                            },
                            {
                                title: '温度',
                                checked: false,
                                value: '/safetyMonitor/temperature',
                                icon: 'icon-v5-wendu2',
                                nodeKey: 6,
                                indeterminate: false
                            },
                            {
                                title: '漏电报警',
                                checked: false,
                                value: '/safetyMonitor/leakageWarm',
                                icon: 'icon-v5-loudianbaojing1',
                                nodeKey: 7,
                                indeterminate: false
                            },
                            {
                                title: '温度报警',
                                checked: false,
                                value: '/safetyMonitor/temperatureWarn',
                                icon: 'icon-v5-wendubaojing1',
                                nodeKey: 8,
                                indeterminate: false
                            },
                            {
                                title: '漏保自检',
                                checked: false,
                                value: '/safetyMonitor/leakageSelfChecking',
                                icon: 'icon-v5-loubaozijian1',
                                nodeKey: 9,
                                indeterminate: false
                            },
                            {
                                title: '短路报警',
                                checked: false,
                                value: '/safetyMonitor/shortCircuitWarn',
                                icon: 'icon-v5-duanlubaojing1',
                                nodeKey: 10,
                                indeterminate: false
                            },
                            {
                                title: '过欠压',
                                checked: false,
                                value: '/safetyMonitor/abnormalVoltage',
                                icon: 'icon-v5-guoqianya1',
                                nodeKey: 11,
                                indeterminate: false
                            },
                            {
                                title: '过流过载',
                                checked: false,
                                value: '/safetyMonitor/abnormalCurrent',
                                icon: 'icon-v5-guoliuguozai1',
                                nodeKey: 12,
                                indeterminate: false
                            },
                            {
                                title: '电弧报警',
                                checked: false,
                                value: '/safetyMonitor/SparkWarn',
                                icon: 'icon-v5-dianhubaojing1',
                                nodeKey: 13,
                                indeterminate: false
                            },
                            {
                                title: '三相报警',
                                checked: false,
                                value: '/safetyMonitor/phaseWarn',
                                icon: 'icon-v5-sanxiangbaojing1',
                                nodeKey: 14,
                                indeterminate: false
                            },
                            {
                                title: '异常状态',
                                checked: false,
                                value: '/safetyMonitor/abnormalState',
                                icon: 'icon-v5-yichangzhuangtai1',
                                nodeKey: 15,
                                indeterminate: false
                            },
                            {
                                title: '分合闸警示',
                                checked: false,
                                value: '/safetyMonitor/ocWarn',
                                icon: 'icon-v5-fenhezha',
                                nodeKey: 16,
                                indeterminate: false
                            }
                        ],
                        nodeKey: 3,
                        selected: true,
                        expand: false,
                        indeterminate: false
                    },
                    {
                        title: '能耗监管',
                        checked: false,
                        children: [
                            {
                                checked: false,
                                title: '电量',
                                value: '/energyMonitor/power',
                                icon: 'icon-v5-dianliang1',
                                nodeKey: 18,
                                indeterminate: false,
                                findIndexs: [2, 0]
                            },
                            {
                                checked: false,
                                title: '负载',
                                value: '/energyMonitor/load',
                                icon: 'icon-v5-fuzai1',
                                nodeKey: 19,
                                indeterminate: false,
                                findIndexs: [2, 1]
                            }
                        ],
                        nodeKey: 17,
                        expand: true,
                        indeterminate: false
                    },
                    {
                        title: '综合监管',
                        checked: false,
                        children: [
                            {
                                title: '场景控制',
                                checked: false,
                                value: '/multiManage/sceneControl',
                                icon: 'icon-v5-changjingkongzhi',
                                nodeKey: 21,
                                indeterminate: false
                            },
                            {
                                title: '内置定时配置',
                                checked: false,
                                value: '/multiManage/builtInTimer',
                                icon: 'icon-v5-dingshipeizhi1',
                                nodeKey: 22,
                                indeterminate: false
                            },
                            {
                                title: '内置经纬定时',
                                checked: false,
                                value: '/multiManage/latlongTimer',
                                icon: 'icon-v5-jingweidingshi1',
                                nodeKey: 23,
                                indeterminate: false
                            },
                            {
                                title: '批量配置',
                                checked: false,
                                value: '/multiManage/batchConfig',
                                icon: 'icon-v5-piliangpeizhi1',
                                nodeKey: 24,
                                indeterminate: false
                            },
                            {
                                title: '控制任务清单',
                                checked: false,
                                value: '/multiManage/contrlTasks',
                                icon: 'icon-v5-kongzhiqingdan',
                                nodeKey: 25,
                                indeterminate: false
                            },
                            {
                                title: '分组管理',
                                checked: false,
                                value: '/multiManage/groupConfig',
                                icon: 'icon-v5-fenzukongzhi',
                                nodeKey: 26,
                                indeterminate: false
                            },
                            {
                                title: '设备列表与控制',
                                checked: false,
                                value: '/multiManage/deviceListControl',
                                icon: 'icon-v5-shebeiliebiaoyukongzhi1',
                                nodeKey: 27,
                                indeterminate: false
                            },
                            {
                                title: '异常状态检测配置',
                                checked: false,
                                value: '/multiManage/abnormalStateConfig',
                                icon: 'icon-v5-yichangzhuangtaijiancepeizhi1',
                                nodeKey: 28,
                                indeterminate: false
                            },
                            {
                                title: '联动配置',
                                checked: false,
                                value: '/multiManage/linkageScene',
                                icon: 'icon-v5-liandongkongzhi',
                                nodeKey: 29,
                                indeterminate: false
                            },
                            {
                                title: '工单管理',
                                checked: false,
                                value: '/multiManage/workOrder',
                                icon: 'icon-v5-gongdanguanli1',
                                nodeKey: 30,
                                indeterminate: false
                            },
                            {
                                title: '统计报告',
                                checked: false,
                                value: '/multiManage/report',
                                icon: 'icon-v5-tongjibaogao',
                                nodeKey: 31,
                                indeterminate: false
                            }
                        ],
                        nodeKey: 20,
                        selected: true,
                        expand: false,
                        indeterminate: false
                    }
                ];
                if (this.dataArr.length === 0) {
                    this.AddEditData.forEach((item) => {
                        item.checked = false;
                        item.children.forEach((items) => {
                            items.checked = false;
                        });
                    });
                } else {
                    this.dataArr.forEach((item1) => {
                        this.AddEditData.forEach((item2) => {
                            item2.checked = false;
                            let arr = item2.children.filter((item3) => {
                                // item3.checked = false
                                return item1.name === item3.title;
                            });

                            if (arr.length !== 0) {
                                arr[0].checked = true;
                            }
                        });
                    });
                }
            },
            add () {
                this.modal = true;
            },
            deletes (item, index) {
                this.dataArr.splice(index, 1);
                this.treeDate();
            },
            go (item) {
                this.$router.push(item.url);
            },
            ok () {
                let arr = [];
                this.AddEditData.forEach((item) => {
                    this.arr = item.children.filter((items) => {
                        return items.checked;
                    });
                    this.arr.forEach((items) => {
                        arr.push(items);
                        let flag = this.dataArr.some((itemd) => {
                            return itemd.title === items.title;
                        });
                        if (!flag) {
                            // 添加，没有的就加在后面 那如果是减少怎么办呢， 减了一部分，加了一部分怎么说呢
                            this.dataArr.push(items);
                        }
                        // 先把添加的写了，现在的状态就是添加了新的数组，但是不知道旧的数组有没有删除，所以这一步就应该是删掉。这一步不能写在这个循环里面，因为还没有变成最终的形态
                    });
                });

                for (let i = 0; i < 10; i++) {
                    this.dataArr.forEach((items, index) => {
                        // 判断arr里面没有的，但是dataArr里有的，这些就是被删除的 arr里面有的，dataArr已经全部都有了
                        let flag = arr.some((itemd) => {
                            return itemd.title === items.title;
                        });

                        //
                        if (!flag) {
                            this.dataArr.splice(index, 1);
                        }
                    });

                    if (this.dataArr.length === arr.length) break; // 中断循环
                }
                //  直接对此对象进行修改
                this.dataArr.forEach((item) => {
                    item.name = item.title;
                    item.url = item.value;
                    // delete item.title
                    // delete item.value
                    // delete item.checked
                    // delete item.nodeKey
                });
            },
            getStatData () {
                let params = {
                    projectCodes: this.$store.state.projectCode
                };
                indexStatData(params).then((res) => {
                    this.option = res.data;

                    this.NoProcess = this.toPercent(
                        this.option.totalAlarmNoProcessThisMonth,
                        this.option.totalAlarmThisMonth
                    );
                    this.Process = this.toPercent(
                        this.option.totalAlarmProcessedThisMonth,
                        this.option.totalAlarmThisMonth
                    );
                });
            },
            toPercent (num, total) {
                num = parseFloat(num);
                total = parseFloat(total);
                if (isNaN(num) || isNaN(total)) {
                    return '-';
                }
                return total <= 0 ? 0 : Math.round((num / total) * 10000) / 100.0;
            },
            EquipClass () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getEquipClassifys(params).then((res) => {
                    if (res.success) {
                        this.tabsList = res.data;
                        this.active = res.data.length === 0 ? '' : res.data[0].equipClassify;
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            handletabCount (data) {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    equipClassify: data
                };
                getByEquipClassify(params).then((res) => {
                    this.shortdata = res.data;
                });
            },
            queryAlarmTrend () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getTrendAndProcessRate(params).then((res) => {
                    var alarmTrend = res.data;

                    for (let i in alarmTrend) {
                        this.alarm.push(alarmTrend[i].alarm);
                        this.time.push(alarmTrend[i].time);
                        this.processedRatio.push(alarmTrend[i].processedRatio);
                    }

                    if (res.success) {
                        this.trendOptions.xAxis = [];
                        this.trendOptions.series = [];
                        this.trendOptions.xAxis = this.time;
                        this.trendOptions.yAxis.name = '报警次数（次）';
                        this.trendOptions.yAxis.name2 = '处理率（%）';
                        this.trendOptions.series[0] = {
                            name: '处理率',
                            type: 'line',
                            data: this.processedRatio,
                            itemStyle: {
                                color: '#0fb45c'
                            },
                            yAxisIndex: 1, // 选用那个坐标轴显示，默认为0
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(15, 180, 92, 0.2)' },
                                        { offset: 1, color: 'rgba(15, 180, 92, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                        this.trendOptions.series[1] = {
                            name: '报警数',
                            type: 'line',
                            data: this.alarm,
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(224, 74, 73, 0.2)' },
                                        { offset: 1, color: 'rgba(224, 74, 73, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            itemStyle: { color: '#ab3f42' },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4,
                            smooth: true
                        };
                    } else if (res.code === '-1') {
                    } else {
                        this.trendOptions.xAxis = [];
                        this.trendOptions.series = [];
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            queryGetStatistics () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getStatistics(params).then((res) => {
                    this.Statistics = res.data;
                });
            },
            queryGetLoadHour () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getLoadHour(params).then((res) => {
                    var hourList = res.data;
                    for (let i in hourList) {
                        this.afterPower.push(hourList[i].afterPower);
                        this.prePower.push(hourList[i].prePower);
                        this.hourstime.push(hourList[i].time);
                    }
                    if (res.success) {
                        this.HoursOptions.xAxis = [];
                        this.HoursOptions.series = [];
                        this.HoursOptions.xAxis = this.hourstime;
                        this.HoursOptions.yAxis.name = '电量（度）';
                        this.HoursOptions.series[0] = {
                            name: '前天',
                            type: 'line',
                            data: this.prePower,
                            itemStyle: {
                                color: '#0DD667'
                            },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                                        { offset: 1, color: 'rgba(13, 214, 103, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                        this.HoursOptions.series[1] = {
                            name: '昨天',
                            type: 'line',
                            data: this.afterPower,
                            itemStyle: {
                                color: '#0373e6'
                            },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                        { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                    } else if (res.code === '-1') {
                    } else {
                        this.HoursOptions.xAxis = [];
                        this.HoursOptions.series = [];
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            queryGetLoadWeek () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getLoadDay(params).then((res) => {
                    var weekList = res.data;
                    for (let i in weekList) {
                        this.wafterPower.push(weekList[i].afterPower);
                        this.wprePower.push(weekList[i].prePower);
                        this.weekstime.push(weekList[i].time);
                    }
                    if (res.success) {
                        this.WeekOptions.xAxis = [];
                        this.WeekOptions.series = [];
                        this.WeekOptions.xAxis = this.weekstime;
                        this.WeekOptions.yAxis.name = '电量（度）';
                        this.WeekOptions.series[0] = {
                            name: '上周',
                            type: 'line',
                            data: this.wprePower,
                            itemStyle: { color: '#0DD667' },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                                        { offset: 1, color: 'rgba(13, 214, 103, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                        //
                        this.WeekOptions.series[1] = {
                            name: '本周',
                            type: 'line',
                            data: this.wafterPower,
                            itemStyle: { color: '#0373e6' },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                        { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4,
                            smooth: true
                        };
                    } else if (res.code === '-1') {
                    } else {
                        this.WeekOptions.xAxis = [];
                        this.WeekOptions.series = [];
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            queryGetLoadYears () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getLoadYears(params).then((res) => {
                    var yearsList = res.data;
                    for (let i in yearsList) {
                        this.yafterPower.push(yearsList[i].afterPower);
                        this.yprePower.push(yearsList[i].prePower);
                        this.yeekstime.push(yearsList[i].time);
                    }
                    if (res.success) {
                        this.YearsOptions.xAxis = [];
                        this.YearsOptions.series = [];
                        this.YearsOptions.xAxis = this.yeekstime;
                        this.YearsOptions.yAxis.name = '电量（度）';
                        this.YearsOptions.series[0] = {
                            name: '去年',
                            type: 'line',
                            data: this.yprePower,
                            itemStyle: { color: '#0DD667' },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                                        { offset: 1, color: 'rgba(13, 214, 103, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                        this.YearsOptions.series[1] = {
                            name: '本年',
                            type: 'line',
                            data: this.yafterPower,
                            itemStyle: { color: '#0373e6' },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                        { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'emptyCircle',
                            symbolSize: 4,
                            smooth: true
                        };
                    } else if (res.code === '-1') {
                    } else {
                        this.YearsOptions.xAxis = [];
                        this.YearsOptions.series = [];
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            handleStatData () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getTaskColStatData(params).then((res) => {
                    this.StatData = res.data;
                });
            },
            queryTaskData () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getControlTaskList(params).then((res) => {
                    this.taskData = res.data;
                });
            },
            queryMaintenanceTrand () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                getMaintenanceTrand(params).then((res) => {
                    var mainTrand = res.data;

                    for (let i in mainTrand) {
                        this.mainNumber.push(mainTrand[i].number);
                        this.mainTime.push(mainTrand[i].time);
                    }

                    if (res.success) {
                        this.MainOptions.xAxis = [];
                        this.MainOptions.series = [];
                        this.MainOptions.xAxis = this.time;
                        this.MainOptions.yAxis.name = '次数（次）';
                        this.MainOptions.series[0] = {
                            name: '维保次数',
                            type: 'line',
                            data: this.mainNumber,
                            itemStyle: {
                                color: '#007EFF'
                            },
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                        { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                    ],
                                    global: false
                                }
                            },
                            showSymbol: true,
                            symbol: 'circle',
                            symbolSize: 4,
                            smooth: true
                        };
                    } else if (res.code === '-1') {
                    } else {
                        this.MainOptions.xAxis = [];
                        this.MainOptions.series = [];
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            handleMaintenance (obj) {
                let params = {
                    mac: obj.mac,
                    alarmId: obj.id,
                    id: ''
                };
                getfindMaintenance(params).then((res) => {
                    if (res.success) {
                        store.commit('maintenanceObj', res.data);
                        store.commit('alarmId', obj.id);
                        this.maintenanceObj = obj;
                        this.dialogVisible = true;
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            closeMaintenance () {
                store.dispatch('resetMaintenanceObj');
                this.dialogVisible = false;
            },
            handleUrge (id) {
                alarmUrgePush({ id: id }).then((res) => {
                    if (res.code === '0') {
                        this.$Message.success({
                            content: res.message
                        });
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            cancel () {
                // 取消
                this.flag = !this.flag;
                //
                //

                getQueryFastMenus({ projectCode: this.$store.state.projectCode }).then(
                    (res) => {
                        this.dataArr = res.data;
                        //

                        this.treeDate();
                    }
                );
            },
            joinin () {
                // 保存
                this.flag = !this.flag;
                if (this.flag) return false;
                let arr = [];
                this.dataArr.forEach((item) => {
                    arr.push({
                        name: item.name,
                        url: item.url,
                        icon: item.icon
                    });
                });
                //
                arr = JSON.stringify(arr);

                getSaveFastMenus({
                    fastMenus: arr,
                    projectCode: this.$store.state.projectCode
                }).then((res) => {
                    if (res.success) this.$Message.success(res.message);
                    else this.$Message.error(res.message);
                });
            },
            enter (index) {
                this.isHover = index;
            },
            leave () {
                this.isHover = false;
            },
            changeUrl (url, params) {
                this.$router.push({
                    path: url,
                    query: { projectCode: this.$store.state.projectCode, status: params }
                });
            },
            changeUrls (dateType, status) {
                this.$router.push({
                    name: 'Alarms',
                    params: {
                        projectCode: this.$store.state.projectCode,
                        typeNumber: '-100',
                        status,
                        oqp2: '',
                        type: dateType
                    }
                });
            }
        },
        mounted () {
            this.init();
        },
        destroyed () {
            store.commit('AddEditData', this.AddEditData);
            store.commit('dataArr', this.dataArr);
        },
        created () {},
        watch: {
            AddEditData: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.AddEditData = newVal;
                    }
                },
                deep: true
            },
            dataArr: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.dataArr = newVal;
                        // store.commit('dataArr', this.dataArr);
                    }
                },
                deep: true
            }
        }
    };
</script>
<style lang="less" scoped>
.project {
  margin-top: 80px;
  .line {
    width: 3px;
    height: 16px;
    background: #007eff;
    margin-right: 20px;
  }
  .title {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #fff;
  }
  .mt16 {
    margin-top: 16px;
  }
  .mt {
    margin-top: 10px;
  }
  .mb {
    margin-bottom: 20px;
  }
  .pd {
    padding: 20px;
  }
  .map {
    padding: 10px;
    background: #1a202e;
    margin-top: 10px;
    .active{
      color: #007EFF;
      border-bottom: 2px solid #007EFF;
    }
    .tabs{
      display: flex;
      margin-bottom: 10px;
      .tabpane{
        padding: 10px 20px 10px 20px;
        margin-right: 20px;
        cursor: pointer;
      }
    }

  }
  .project_map {
    display: flex;
    align-items: center;
    padding: 20px;
  }
  .project_detailsList {
    width: 100%;
    padding: 20px;
    ul {
      list-style: none;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      li {
        width: 214px;
        height: 100px;
        background: #000000;
        margin-top: 10px;
        padding: 24px;
        .title {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #fff;
          margin-bottom: 10px;
        }
        .num {
          margin-top: 10px;
        }
      }
    }
  }
  .project_list {
    .sw {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .item {
      width: 248px;
      height: 44px;
      background-color: #28313f;
      float: left;
      margin: 5px;
      cursor: pointer;
      line-height: 44px;
      position: relative;
      :hover {
        color: #007eff;
      }
      i {
        font-size: 28px;
        margin-left: 10px;
      }
      span {
        font-size: 14px;
        margin-left: 20px;
        position: relative;
        top: -5px;
      }
      .btn {
        font-size: 14px;
        margin-left: 50px;
        position: relative;
        top: -5px;
      }
    }
    .items {
      width: 253px;
      height: 52px;
      background-color: #28313f;
      float: left;
      margin: 20px;
      line-height: 52px;
      text-align: center;
      i {
        font-size: 28px;
      }
      position: relative;

      .btn {
        font-size: 14px;
        margin-left: 10px;
        position: absolute;
        top: -5px;
      }
    }
    .df {
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .tb {
      padding: 8px;
      color: #2d91f8;
      font-size: 28px;
      font-weight: 700;
      background: rgba(46, 149, 255, 0.2);
      border-radius: 10px;
      text-align: center;
    }
    .tl {
      text-align: left;
    }
    .tx {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
      }
      div {
        color: #dddddd;
      }
    }
    .bx {
      width: 60px;
      border-radius: 10px;
      img {
        width: 100%;
      }
    }
    .lb {
      background: rgba(46, 149, 255, 0.2);
      padding: 15px;
    }
    .la {
      background: rgba(68, 92, 219, 0.2);
      padding: 10px;
    }
    .lr {
      background: rgba(242, 78, 76, 0.2);
      padding: 10px;
    }
    .lrs {
      background: rgba(242, 78, 76, 0.2);
      padding: 13px;
    }
    .lg {
      background: rgba(33, 242, 127, 0.2);
      padding: 15px;
    }
    .ly {
      background: rgba(255, 168, 84, 0.2);
      padding: 8px;
      height: 66px;
    }
  }
  /deep/.ivu-progress-inner {
    background: #5c606a;
  }
  /deep/.ivu-table-cell {
    white-space: nowrap;
  }
  /deep/::-webkit-scrollbar {
    width: 6px; //竖轴宽度
    height: 6px; //横轴宽度
    // background-color: rgba(99, 110, 246, 0.5);
  } /* 滚动槽 */
  /deep/::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /deep/::-webkit-scrollbar-thumb {
    background-color: rgb(9, 15, 25);
  }
  .c-s {
    background: rgba(0, 186, 138, 0.15);
    border-radius: 5px;
    padding: 5px;
  }

  .c-d {
    background: rgba(255, 79, 79, 0.15);
    border-radius: 5px;
    padding: 5px;
  }
  /deep/.ivu-tabs {
    color: #999;
  }
  /deep/.ivu-tabs-bar {
    border-color: rgba(255, 255, 255, 0.6);
  }
  /deep/.ivu-tabs-ink-bar {
    position: absolute;
    left: 0;
    bottom: 0px;
    height: 3px;
  }
}
.treePut {
  height: 400px;
  overflow: auto;
}
/deep/.BMap_bubble_pop {
  border: 1px solid transparent !important;
  background: url("../../../assets/images/maptk.png") no-repeat;
  background-color: transparent !important;
  background-size: 100% 100%;
  .project-infoWindow {
    color: #fff;
  }
  img {
    width: 0 !important;
  }
}
/deep/.BMap_pop {
  border: 1px solid transparent !important;
  background: url("../../../assets/images/maptk.png") no-repeat;
  background-color: transparent !important;
  background-size: 100% 100%;
      width: 250px;
    height: 100px;
  div{
    background-color:transparent ;
     border:transparent;
     img{
      display: none;
     }
    div{
      background:transparent !important;
      border-top:transparent !important;
      border-left:transparent !important;
      border-right:transparent !important;
      border-bottom:transparent !important;
    }
  }
}
.ivu-tree .ivu-checkbox-wrapper {
  // margin-right: 4px;
  margin-left: 7px;
}

/deep/.ivu-modal-footer {
  border: none;
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
  background-color: #1a202e;
  // #1A202E
}
</style>
