import request from '@/plugins/request';

export const getGroupType = (params) => { // 获取分组列表
    return request.POST('/v5/boxGroup/listBoxGroups.as', params)
}

export const geteditGroupType = (params) => { // 获取编辑列表
    return request.POST('/v5/boxGroup/queryBoxGroup.as', params)
}

export const editGroupType = (params) => { // 编辑列表
    return request.POST('/v5/boxGroup/modifyBoxGroup.as', params)
}

export const delGroupType = (params) => { // 删除列表
    return request.POST('/v5/boxGroup/delBoxGroup.as', params)
}

export const newGroupType = (params) => { // 新建分组
    return request.POST('/v5/boxGroup/addBoxGroup.as', params)
}

export const equipmentList = (params) => { // 设备列表
    return request.POST('/project/main/v5/query/boxes.as', params)
}
