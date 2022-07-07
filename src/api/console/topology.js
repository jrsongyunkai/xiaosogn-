import request from '@/plugins/request';

// 获取前三层节点信息
export const getBuildingList = (params) => {
    return request.POST('/project/main/getBuildings.as', params);
}

// 开闸合闸    http://localhost:8081/project/main/v2/batchRemotectrl.as?_operate_at=1
export const changeStatus = (params) => {
    return request.JPOST('/project/main/v2/batchRemotectrl.as?_operate_at=1', params);
}

// 第四层数据——根据房屋号查询设备
export const queryRoomEquipmentList = (params) => {
    return request.POST('/project/main/v5/queryRoomEquipmentList.as', params);
}

// 第五层数据——根据设备mac号查询线路
export const queryEquipmentInfo = (params) => {
    return request.GET('/project/main/v5/getEquipmentInfo.as', params);
}

// 模拟在一条在线设备
export const mockOline = (params) => {
    return request.GET('/mock/data/makeOnline.as', params);
}

// 模糊查询
export const searchEquipment = (params) => {
    return request.POST('/project/main/v5/queryEquipmentListByKeyword.as', params);
}
// 上传图片
export const uploadImg = (params) => {
    return request.POST('/box/icon/upload.as', params);
}
