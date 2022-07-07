// import * as Request from '@/plugins/request';
import request from '@/plugins/request';
export const getindividual = () => {
    return request.GET('/portal/v5/gbl/individual.as')
}
export const getGblinfo = (params) => {
    return request.POST('/portal/v5/gbl/info.as?v=' + new Date().getTime(), params)
}
export const getBpk = () => {
    return request.GET('/portal/v5/gbl/bpk.as', { kf: 'base64' });
}

export const AccountLogin = (params) => {
    return request.POST('/portal/login.as', params)
}
export const AccountLogout = (params) => {
    return request.POST('/portal/logout.as', params)
}
export const getProject = (params) => {
    return request.POST('/project/main/loadAllHoldingProject.as', params)
}
export const loginRedirect = (params) => {
    return request.POST('/portal/v5/loginRedirect.as', params)
}
