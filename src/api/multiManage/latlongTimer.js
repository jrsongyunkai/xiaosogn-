import request from '@/plugins/request';
export const timeingList = (params) => {
    return request.POST('/timing/list.as', params)
}

export const findById = (params) => {
    return request.POST('/timing/findById.as', params)
}

export const modifyTiming = (params) => {
    return request.POST('/timing/modifyTiming.as', params)
}
export const longitudeAndLatitude = (params) => {
    return request.POST('/timing/longitudeAndLatitude/get.as', params)
}

export const refreshLongitudeLatitude = (params) => {
    return request.POST('/timing/longitudeAndLatitude/refresh.as', params)
}

export const setLongitudeLatitude = (params) => {
    return request.POST('/timing/longitudeAndLatitude/set.as', params)
}
export const downGetTime = (params) => {
    return request.POST('/timing/downGetTime.as', params)
}
export const queryPageAuth = (params) => {
    return request.POST('/portal/pageAuth.as', params)
}
export const delTiming = (params) => {
    return request.POST('/timing/delTiming.as', params)
}
