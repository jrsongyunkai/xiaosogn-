import request from '@/plugins/request';

export const loadAllProject = () => {
    return request.POST('/project/main/loadAllHoldingProject.as')
}
export const globalAlarmSound = (params) => {
    return request.POST('/alarmPopup/gblSoundInfo.as', params)
}
export const loadMetaData = () => {
    return request.POST('/project/main/v3/loadMetadata.as')
}
export const getClosestRealTimeByAlarmTime = (params) => {
    return request.POST('/project/main/v3/getClosestRealTimeByAlarmTime.as', params)
}
export const alarmTypeStats = (params) => {
    return request.POST('/project/main/v2/alarmOfProjectStats.as', params)
}
export const realtimeAlarm = (params) => {
    return request.POST('/project/main/v5/queryRealtimeAlarm.as', params)
}
export const findMaintenance = (params) => {
    return request.POST('/maintenance/findMaintenance.as', params)
}
export const switchHover = (params) => {
    return request.POST('/portal/v5/switchToProject.as', params)
}
export const energyStatistics = (params) => {
    return request.POST('/large/screen/v5/energyStatistics.as', params)
}
export const energyTrend = (params) => {
    return request.POST('/large/screen/v5/energyTrend.as', params)
}
export const workOrderStatistics = (params) => {
    return request.POST('/large/screen/v5/workOrderStatistics.as', params)
}
export const alarmTypeDistribution = (params) => {
    return request.POST('/large/screen/v5/alarmTypeDistribution.as', params)
}
export const alarmTrend = (params) => {
    return request.POST('/large/screen/v5/alarmTrend.as', params)
}
export const getEquipClassifyStatList = (params) => {
    return request.POST('/project/main/v5/getEquipClassifyStatList.as', params)
}
export const getIndexStatData = (params) => {
    return request.POST('/project/main/v5/getIndexStatData.as', params)
}
export const statisticalNumber = (params) => {
    return request.POST('/project/main/v3/statisticalNumber.as', params)
}
export const getLeftTreeView = (params) => {
    return request.POST('/project/main/v2/loadGroupTreeProject.as', params)
}
export const queryProjectDetails = (params) => {
    return request.POST('/project/main/v3/queryProjectDetails.as', params)
}
export const loadTree = (params) => {
    return request.POST('/projectGroup/loadTree.as', params)
}
export const saveProjectGroup = (params) => {
    return request.POST('/projectGroup/save.as', params)
}
export const delProjectGroup = (params) => {
    return request.POST('/projectGroup/del.as', params)
}
export const pageRsOfProject = (params) => {
    return request.POST('/projectGroup/pageRsOfProject.as', params)
}
export const pageProject4SelectOfGroup = (params) => {
    return request.POST('/projectGroup/pageProject4SelectOfGroup.as', params)
}
export const saveProjectOfGroup = (params) => {
    return request.POST('/projectGroup/saveProjectOfGroup.as', params)
}
export const queryPageAuth = (params) => {
    return request.POST('/portal/pageAuth.as', params)
}
