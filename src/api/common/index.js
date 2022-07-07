import request from '@/plugins/request';
export const cmdFeedBack = (params) => {
    return request.POST('/cmd-feedback/page.as', params)
}
export const cmdQueryHistory = (params) => {
    return request.POST('/cmd-feedback/queryHistory.as', params)
}
export const queryChannels = (params) => {
    return request.POST('/project/main/query/box/channels.as', params)
}
export const saveDeStatuscanConfDetail = (params) => {
    return request.POST('/deStatuscan/confDetail/save.as', params)
}
