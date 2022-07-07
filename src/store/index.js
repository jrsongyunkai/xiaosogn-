import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import admin from './modules/admin';

Vue.use(Vuex);

const state = {
    maintenanceObj: [],
    alarmId: '',
    mac: '',
    equipmentType: '',
    overview: {
        equipmentType: 1,
        mac: ''
    },
    filterSiders: '',
    prjName: '',
    prjTitle: '',
    nodeId: '',
    smokeAlarmObj: '',
    flammableGasObj: '',
    smokeObj: '',
    pressureObj: '',
    levelObj: '',
    alarmForConfig: '',
    modulus: null,
    exponent: null,
    uploadHeight: '',
    historyDate: '',
    detailsAddr: '',
    dateFlag: false,
    aliasName: '',
    customAlarm: '',
    classifyLabel: '',
    realName: null,
    totalStatus: false,
    sortBUR: {},
    windowHeight: '',
    projectCode: '',
    distribution: {
        projectCode: '',
        dateType: '',
        date: ''
    },
    switchData: null,
    devHis: null,
    distributionDateType: '',
    innerMessage: false,
    fullName: '',
    stralsundObj: [],
    systemFlag: 'home',
    loadMeta: 'all',
    password: '',
    heightGauge: '',
    heightOne: '',
    heightTwo: '',
    heightFour: '',
    heightSecond: '',
    heightThird: '',
    heighttimg: '',
    mapHeight: '',
    innerMainHeight: '',
    asideHeight: '',
    asideTowHeight: '',
    formulaHeight: '',
    overHeight: '',
    overTowHeight: '',
    manageHeight: '',
    consumHeight: '',
    manageTowHeight: '',
    innerComponentHeight: '',
    innerTableHeight: '',
    powerTableHeight: '',
    groupTableHeight: '',
    controlTableHeight: '',
    analysispieHeight: '',
    orviboTableHeight: '',
    channelsTableHeight: '',
    alarmTableHeight: '',
    channelsHeight: '',
    BuiltInTimingHeight: '',
    batchHeight: '',
    ruleId: '',
    projectName: '',
    allProjects: [],
    totalAlarm: '',
    totalMac: '',
    totalOnline: '',
    statisticsFlag: false,
    allTotalAlarm: '',
    totalProject: '',
    totalWarn: '',
    totalAddr: '',
    location: {},
    overviewMac: '',
    showMenus: '',
    muted: false,
    AddEditData: [
        {
            title: '项目主页',
            checked: true,
            children: [
                {
                    title: '设备概况',
                    checked: true,
                    value: '/console/device',
                    icon: 'icon-v5-shebeigaikuang1',
                    nodeKey: 1,
                    findIndexs: [0, 0]
                },
                {
                    title: '拓扑图',
                    value: '/console/topology',
                    checked: true,
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
                    indeterminate: false,
                    findIndexs: [1, 0]
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
                    icon: 'icon-v5-fenhezhajingshi1',
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
            checked: true,
            children: [
                {
                    checked: true,
                    title: '电量',
                    value: '/energyMonitor/power',
                    icon: 'icon-v5-dianliang1',
                    nodeKey: 18,
                    indeterminate: false,
                    findIndexs: [2, 0]
                },
                {
                    checked: true,
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
                    checked: true,
                    value: '/multiManage/sceneControl',
                    icon: 'icon-v5-changjingkongzhi',
                    nodeKey: 21,
                    findIndexs: [3, 0]
                },
                {
                    title: '内置定时配置',
                    checked: false,
                    value: '/multiManage/builtInTimer',
                    icon: 'icon-v5-jingweidingshi1',
                    nodeKey: 22
                },
                {
                    title: '内置经纬定时',
                    checked: false,
                    value: '/multiManage/latlongTimer',
                    icon: 'icon-v5-jingweidingshi1',
                    nodeKey: 23
                },
                {
                    title: '批量配置',
                    checked: false,
                    value: '/multiManage/batchConfig',
                    icon: 'icon-v5-piliangpeizhi1',
                    nodeKey: 24
                },
                {
                    title: '控制任务清单',
                    checked: false,
                    value: '/multiManage/contrlTasks',
                    icon: 'icon-v5-kongzhirenwuqingdan1',
                    nodeKey: 25
                },
                {
                    title: '分组管理',
                    checked: false,
                    value: '/multiManage/groupConfig',
                    icon: 'icon-v5-fenzuguanli1',
                    nodeKey: 26
                },
                {
                    title: '设备列表与控制',
                    checked: false,
                    value: '/multiManage/deviceListControl',
                    icon: 'icon-v5-shebeiliebiaoyukongzhi1',
                    nodeKey: 27
                },
                {
                    title: '异常状态检测配置',
                    checked: false,
                    value: '/multiManage/abnormalStateConfig',
                    icon: 'icon-v5-yichangzhuangtaijiancepeizhi1',
                    nodeKey: 28
                },
                {
                    title: '联动配置',
                    checked: false,
                    value: '/multiManage/linkageScene',
                    icon: 'icon-v5-liandongpeizhi1',
                    nodeKey: 29
                },
                {
                    title: '工单管理',
                    checked: false,
                    value: '/multiManage/workOrder',
                    icon: 'icon-v5-gongdanguanli1',
                    nodeKey: 30
                },
                {
                    title: '统计报告',
                    checked: true,
                    value: '/multiManage/report',
                    icon: 'icon-v5-tongji1',
                    nodeKey: 31,
                    indeterminate: false,
                    findIndexs: [3, 10]
                }
            ],
            nodeKey: 20,
            indeterminate: true,
            expand: true
        }
    ],
    dataArr: [
        {
            title: '设备概况',
            checked: true,
            value: '/console/device',
            icon: 'icon-v5-shebeigaikuang1',
            nodeKey: 1,
            findIndexs: [0, 0],
            indeterminate: false
        },
        {
            title: '拓扑图',
            value: '/console/topology',
            checked: true,
            icon: 'icon-v5-tuoputu1',
            nodeKey: 2,
            findIndexs: [0, 1],
            indeterminate: false
        },
        {
            checked: true,
            title: '电量',
            value: '/energyMonitor/power',
            icon: 'icon-v5-dianliang1',
            nodeKey: 18,
            indeterminate: false,
            findIndexs: [2, 0]
        }
    ]
};

export default new Vuex.Store({
    state,
    plugins: [createPersistedState()],
    modules: {
        admin
    },
    mutations: {
        filterSiders: (state, v) => {
            state.filterSiders = v;
        },
        showMenus: (state, v) => {
            state.showMenus = v;
        },
        location: (state, v) => {
            state.location = v;
        },
        switchData: (state, v) => {
            state.switchData = v;
        },
        devHis: (state, v) => {
            state.devHis = v;
        },

        totalProject: (state, v) => {
            state.totalProject = v;
        },
        realName: (state, v) => {
            state.realName = v;
        },
        smokeAlarmObj: (state, v) => {
            state.smokeAlarmObj = v;
        },
        smokeObj: (state, v) => {
            state.smokeObj = v;
        },
        prjName: (state, v) => {
            state.prjName = v;
        },
        prjTitle: (state, v) => {
            state.prjTitle = v;
        },
        nodeId: (state, v) => {
            state.nodeId = v;
        },
        flammableGasObj: (state, v) => {
            state.flammableGasObj = v;
        },
        totalWarn: (state, v) => {
            state.totalWarn = v;
        },
        pressureObj: (state, v) => {
            state.pressureObj = v;
        },
        totalAddr: (state, v) => {
            state.totalAddr = v;
        },
        totalOnlineAddr: (state, v) => {
            state.totalOnlineAddr = v;
        },
        allTotalAlarm: (state, v) => {
            state.allTotalAlarm = v;
        },
        statisticsFlag: (state, v) => {
            state.statisticsFlag = v;
        },
        totalStatus: (state, v) => {
            state.totalStatus = v;
        },
        alarmForConfig: (state, v) => {
            state.alarmForConfig = v;
        },
        password: (state, v) => {
            state.password = v;
        },
        maintenanceObj: (state, v) => {
            state.maintenanceObj = v;
        },
        alarmId: (state, v) => {
            state.alarmId = v;
        },
        allProjects: (state, v) => {
            state.allProjects = v;
        },
        mac: (state, v) => {
            state.mac = v;
        },
        innerMessage: (state, v) => {
            state.innerMessage = v;
        },
        equipmentType: (state, v) => {
            state.overview.equipmentType = v;
        },
        overviewMac: (state, v) => {
            state.overview.mac = v;
        },
        historyDate: (state, v) => {
            state.historyDate = v;
        },
        detailsAddr: (state, v) => {
            state.detailsAddr = v;
        },
        dateFlag: (state, v) => {
            state.dateFlag = v;
        },
        aliasName: (state, v) => {
            state.aliasName = v;
        },
        customAlarm: (state, v) => {
            state.customAlarm = v;
        },
        classifyLabel: (state, v) => {
            state.classifyLabel = v;
        },
        sortBUR: (state, v) => {
            state.sortBUR = v;
        },
        windowHeight: (state, v) => {
            state.windowHeight = v;
        },
        projectCode: (state, v) => {
            state.projectCode = v;
        },
        projectName: (state, v) => {
            state.projectName = v;
        },
        distributionProjectCode: (state, v) => {
            state.distribution.projectCode = v;
        },
        fullName: (state, v) => {
            state.fullName = v;
        },
        distributionDateType: (state, v) => {
            state.distribution.dateType = v;
        },
        stralsundObj: (state, v) => {
            state.stralsundObj = v;
        },
        systemFlag: (state, v) => {
            state.systemFlag = v;
        },
        loadMeta: (state, v) => {
            state.loadMeta = v;
        },
        heightGauge: (state, v) => {
            state.heightGauge = v;
        },
        heightOne: (state, v) => {
            state.heightOne = v;
        },
        heightTwo: (state, v) => {
            state.heightTwo = v;
        },
        heightFour: (state, v) => {
            state.heightFour = v;
        },
        heightSecond: (state, v) => {
            state.heightSecond = v;
        },
        heightThird: (state, v) => {
            state.heightThird = v;
        },
        heighttimg: (state, v) => {
            state.heighttimg = v;
        },
        mapHeight: (state, v) => {
            state.mapHeight = v;
        },
        innerMainHeight: (state, v) => {
            state.innerMainHeight = v;
        },
        asideHeight: (state, v) => {
            state.asideHeight = v;
        },
        asideTowHeight: (state, v) => {
            state.asideTowHeight = v;
        },
        formulaHeight: (state, v) => {
            state.formulaHeight = v;
        },
        overHeight: (state, v) => {
            state.overHeight = v;
        },
        overTowHeight: (state, v) => {
            state.overTowHeight = v;
        },
        consumHeight: (state, v) => {
            state.consumHeight = v;
        },
        manageHeight: (state, v) => {
            state.manageHeight = v;
        },
        manageTowHeight: (state, v) => {
            state.manageTowHeight = v;
        },
        innerComponentHeight: (state, v) => {
            state.innerComponentHeight = v;
        },
        innerTableHeight: (state, v) => {
            state.innerTableHeight = v;
        },
        powerTableHeight: (state, v) => {
            state.powerTableHeight = v;
        },
        groupTableHeight: (state, v) => {
            state.groupTableHeight = v;
        },
        controlTableHeight: (state, v) => {
            state.controlTableHeight = v;
        },
        analysispieHeight: (state, v) => {
            state.analysispieHeight = v;
        },
        orviboTableHeight: (state, v) => {
            state.orviboTableHeight = v;
        },
        channelsTableHeight: (state, v) => {
            state.channelsTableHeight = v;
        },
        alarmTableHeight: (state, v) => {
            state.alarmTableHeight = v;
        },
        channelsHeight: (state, v) => {
            state.channelsHeight = v;
        },
        BuiltInTimingHeight: (state, v) => {
            state.BuiltInTimingHeight = v;
        },
        batchHeight: (state, v) => {
            state.batchHeight = v;
        },
        dialogHeight: (state, v) => {
            state.dialogHeight = v;
        },
        uploadHeight: (state, v) => {
            state.uploadHeight = v;
        },
        ruleId: (state, v) => {
            state.ruleId = v;
        },
        totalAlarm: (state, v) => {
            state.totalAlarm = v;
        },
        totalMac: (state, v) => {
            state.totalMac = v;
        },
        totalOnline: (state, v) => {
            state.totalOnline = v;
        },
        muted: (state, v) => {
            state.muted = v;
        },
        AddEditData: (state, v) => {
            state.AddEditData = v;
        },
        dataArr: (state, v) => {
            state.dataArr = v;
        }
    },
    actions: {
        reset ({ commit }) {
            commit('alarmId', '');
            commit('allProjects', []);
            commit('totalStatus', false);
            commit('mac', '');
            commit('location', {});
            commit('historyDate', '');
            commit('detailsAddr', '');
            commit('dateFlag', false);
            commit('aliasName', '');
            commit('customAlarm', []);
            commit('classifyLabel', []);
            commit('projectCode', '');
            commit('fullName', '');
            commit('systemFlag', 'home');
            commit('loadMeta', 'all');
            commit('projectName', '');
            commit('ruleId', '');
            commit('innerMessage', false);
            commit('totalAlarm', '');
            commit('totalMac', '');
            commit('totalOnline', '');
            commit('statisticsFlag', false);
            commit('allTotalAlarm', '');
            commit('totalProject', '');
            commit('totalWarn', '');
            commit('totalAddr', '');
            commit('totalOnlineAddr', '');
        },
        resetMaintenanceObj ({ commit }) {
            commit('maintenanceObj', []);
        },
        resetEquipmentType ({ commit }) {
            commit('equipmentType', 1);
        },
        resetMac ({ commit }) {
            commit('mac', '');
        },
        resetHistoryDate ({ commit }) {
            commit('historyDate', '');
        }
    }
});
