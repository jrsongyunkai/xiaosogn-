import request from '@/plugins/request';

export const queryBoxes = (params) => {
    return request.POST('/project/main/query/boxes.as', params)
}
export const modifyBoxsChnlTitle = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlTitle.as', params)
}
export const modifyBoxsChnlPower = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlPower.as', params)
}
export const modifyBoxsChnlCurrent = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlCurrent.as', params)
}

export const modifyBoxsChnlLeakageCurrent = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlLeakageCurrent.as', params)
}

export const modifyBoxsChnlTemperature = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlTemperature.as', params)
}

export const modifyBoxsChnlVoltage = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlVoltage.as', params)
}

export const modifyBoxsChnlWiring = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlWiring.as', params)
}

export const modifyBoxsWireless = (params) => {
    return request.POST('/boxProperties/modifyBoxsWireless.as', params)
}
export const modifyBoxsLoginPasswrod = (params) => {
    return request.POST('/boxProperties/modifyBoxsLoginPasswrod.as', params)
}

export const modifyBoxsChnlAlarmEbable = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlAlarmEbable.as', params)
}

export const modifyBoxsChnlTripEnable = (params) => {
    return request.POSTS('/v5/boxProperties/modifyBoxsChnlTripEnable.as', params)
}

export const modifyBoxsChnlTimer = (params) => {
    return request.POST('/boxProperties/modifyBoxsChnlTimer.as', params)
}
export const findById = (params) => {
    return request.POST('/timing/findById.as', params)
}
