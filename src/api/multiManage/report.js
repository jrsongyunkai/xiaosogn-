// 统计报告 api
import request from '@/plugins/request';

export const getPrejectData = (params) => {
    return request.POST('/portal/v5/switchToProject.as', params)
}
export const getEmaginData = (params) => {
    return request.POST('/project/main/v5/getIndexStatData.as', params)
}
export const classifiedAlarm = (params) => {
    return request.POST('/project/main/v3/classifiedAlarmStatistics.as', params)
}
export const queryAlarmTrend = (params) => {
    return request.POST('/project/main/v3/queryAlarmStatisticsTrend.as', params)
}
