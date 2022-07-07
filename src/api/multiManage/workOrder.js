// 新建工单 api
import request from '@/plugins/request';

export const detailInput = ({ typeid, id }) => {
    return request.GET(`/wo/detail/info.as?type=${typeid}&id=${id}`);
}

export const inquireInput = (params) => {
    return request.POST('/wo/list.as', params)
}

export const inquireDetail = (params) => {
    return request.POST('/wo/detail/record.as', params)
}

export const createinput = (params) => {
    return request.POST('/inspection/detail/save.as', params)
}

export const pushinput = (params) => {
    return request.POST('/maintenance/updateMaintenance.as', params)
}
