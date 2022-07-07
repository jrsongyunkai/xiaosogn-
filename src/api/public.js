import request from '@/plugins/request';

export const getGroupType = (params) => {
    return request.POST('/v5/boxGroup/listBoxGroupTypes.as', params);
};
export const getGroupTree = (params) => {
    return request.POST('/v5/boxGroup/queryBoxGroupTree.as', params);
};
export const queryBoxes = (params) => {
    return request.POST('/project/main/query/boxes.as', params);
};
export const getBuildings = (params) => {
    return request.POST('/project/main/getBuildings.as', params);
};
export const queryAssociatedUsers = (params) => {
    return request.POST('/project/main/v3/queryAssociatedUsers.as', params);
};
export const saveFollowerForAssign = (params) => {
    return request.POST('/project/main/v3/saveFollowerForAssign.as', params);
};
export const findStaffInfo = (params) => {
    return request.POST('/project/main/v3/findStaffInfo.as', params);
};
export const updateStaffInfo = (params) => {
    return request.POST('/project/main/v3/updateStaffInfo.as', params);
};
export const listProjectForConfig = (params) => {
    return request.POST('/alarmPushConfig/listProjectForSelect.as', params);
};
export const preferences = (params) => {
    return request.POST('/prjAlarmConfig/load/preferences.as', params);
};
export const prjAlarmConfigSave = (params) => {
    return request.POST('/prjAlarmConfig/save.as', params);
};
export const prjAlarmConfigDel = (params) => {
    return request.POST('/prjAlarmConfig/del.as', params);
};
export const queryAlarmForConfig = (params) => {
    return request.POST('/project/main/v3/queryAlarmForConfig.as', params);
};
export const queryPoPup = (params) => {
    return request.POST('/alarmPopup/queryAlarmPoPupConfig.as', params);
};
export const updatePoPup = (params) => {
    return request.POST('/alarmPopup/updateAlarmPoPupConfig.as', params);
};
export const delAlarmSound = (params) => {
    return request.POST('/alarmPopup/soundFileDel.as', params);
};
export const saveAlarmSound = (params) => {
    return request.JPOST('/alarmPopup/soundSave.as', params);
};
export const queryAlarmSound = (params) => {
    return request.POST('/alarmPopup/soundQuery.as', params);
};
export const soundDel = (params) => {
    return request.POST('/alarmPopup/soundDel.as', params);
};
export const getPayQuotaConfig = (params) => {
    return request.POST('/app/wxPay/getPayQuotaConfig.as', params);
};
export const saveAlarmPushConfigInfo = (params) => {
    return request.POST('/alarmPushConfig/saveAlarmPushConfigInfo.as', params);
};
export const SMSPush = (params) => {
    return request.POST(
        '/alarmPushConfig/getAlarmPushConfigInfoOfStaff.as',
        params
    );
};
export const delAlarmPushConfig = (params) => {
    return request.POST('/alarmPushConfig/del.as', params);
};
export const modifyMacRate = (params) => {
    return request.POST('/project/main/ctl/boxes/rate.as', params);
};
export const queryStaffByAccount = (params) => {
    return request.POST('/project/main/v3/queryStaffByAccount.as', params);
};
export const saveStaffProperty = (params) => {
    return request.POST('/project/main/v3/updateStaff4CustomMap.as', params);
};
export const findStaffProperty = (params) => {
    return request.POST('/project/main/v3/findCustomMapOfEnable.as', params);
};
export const queryProject4Select = (params) => {
    return request.POST('/customMap/queryProject4Select.as', params);
};
export const queryMapInfo = (params) => {
    return request.POST('/customMap/queryMapInfo.as', params);
};
export const delMapDetail = (params) => {
    return request.POST('/customMap/delMapDetail.as', params);
};
export const saveMapDetail = (params) => {
    return request.POST('/customMap/saveMapDetail.as', params);
};
export const last2xLoadStats = (params) => {
    return request.POST('/project/main/v2/last2xLoadStats.as', params);
};
export const powerConsumptionTrend = (params) => {
    return request.POST('/energy/manage/v5/powerTrend.as', params);
};
export const getUserMessageListElecDetail = (params) => {
    return request.POST('/energy/manage/v5/powerData.as', params);
};
export const chgPwd = (params) => {
    return request.POST('/portal/chgpwd.as', params);
};
export const queryPower = (params) => {
    return request.POST('/project/main/query/project/mainline/power.as', params);
};
export const chnlPowerStatsOfBox = (params) => {
    return request.POST('/project/main/v2/chnlPowerStatsOfBox.as', params);
};
export const queryTimeRangePowerOfProject = (params) => {
    return request.POST(
        '/project/main/v3/queryTimeRangePowerOfProject.as',
        params
    );
};
export const statsPowerByTimeRange = (params) => {
    return request.POST('/project/main/v3/statsPowerByTimeRange.as', params);
};
export const last2yPowerStats = (params) => {
    return request.POST('/project/main/v2/last2yPowerStats.as', params);
};
export const queryGroup = (params) => {
    return request.POST('/stats-group/page.as', params);
};
export const chnlDetails = (params) => {
    return request.POST('/stats-group/queryChnlDetails.as', params);
};
export const delDetail = (params) => {
    return request.POST('/stats-group/delDetail.as', params);
};
export const addrEditGroup = (params) => {
    return request.POST('/stats-group/save.as', params);
};
export const delGroup = (params) => {
    return request.POST('/stats-group/del.as', params);
};
export const queryChannels = (params) => {
    return request.POST('/project/main/query/box/channels.as', params);
};
export const inspectionDetailQuery = (params) => {
    return request.POST('/inspection/detail/query.as', params);
};
export const inspectionDetailSave = (params) => {
    return request.POST('/inspection/detail/save.as', params);
};
export const remotectrl = (params) => {
    return request.POST('/app/remotectrl.as', params);
};
export const seekAreaListTreeByProject = (params) => {
    return request.FETCH('/energy/seekAreaListTreeByProject.as', params);
};
export const addAreaBoxMapping = (params) => {
    return request.POST('/energy/addAreaBoxMapping.as', params);
};
export const seekAreaBoxMapping = (params) => {
    return request.FETCH('/energy/seekAreaBoxMapping.as', params);
};
export const delAreaBoxMapping = (params) => {
    return request.POST('/energy/delAreaBoxMapping.as', params);
};
export const disableSelection = (params) => {
    return request.POST('/boxConfig/channel/disableSelection.as', params);
};
export const updateNodeTitle = (params) => {
    return request.POST('/box/updateChnlAttrTitle.as', params);
};
export const abnormalSwitchUnlock = (params) => {
    return request.POST('/box-control/abnormalSwitchUnlock.as', params);
};
export const getChannelCategory = (params) => {
    return request.FETCH('/energy/getChannelCategory.as', params);
};
export const addChannelCategory = (params) => {
    return request.POST2('/energy/addChannelCategory.as', params);
};
export const payQrCode = (params) => {
    return request.POST('/app/wxPay/getPayQrCode.as', params);
};
export const payStatus = (params) => {
    return request.POST('/app/wxPay/getTradeNoPayStatu.as', params);
};
export const confirmPayStatus = (params) => {
    return request.POST('/app/wxPay/confirmPayStatu.as', params);
};
export const getEffectAddr = (params) => {
    return request.POST('/app/compare/config/getEffectAddr.as', params);
};
export const saveServerPoint = (params) => {
    return request.POST('/project/saveServerPoint.as', params);
};
export const findProject = (params) => {
    return request.POST('/project/findProject.as', params);
};
export const getGblinfo = (params) => {
    return request.FETCH('/portal/gblinfo.as?v=' + new Date().getTime(), params);
};
export const queryAlarms4Custom = (params) => {
    return request.POST('/project-property/queryAlarms4Custom.as', params)
}
export const resetCustomAlarm = (params) => {
    return request.POST('/project-property/resetCustomAlarm.as', params)
}
export const saveCustomAlarms = (params) => {
    return request.POST('/project-property/saveCustomAlarms.as', params)
}
export const queryProjectMacDetails = (params) => {
    return request.POST('/project/main/v3/queryProjectMacDetails.as', params)
}
export const switchHover = (params) => {
    return request.POST('/portal/v5/switchToProject.as', params)
}
export const queryMacOcState = (params) => {
    return request.POST('/project/main/v2/queryMacOcState.as', params)
}
export const batchRemotectrl = (params) => {
    return request.POST('/project/main/v2/batchRemotectrl.as', params)
}
export const queryProjectMacAddrDetails = (params) => {
    return request.POST('/project/main/v2/queryProjectMacAddrDetails.as', params)
}
export const updateAlarmSound = (params) => {
    return request.JPOST('/alarmPopup/soundFileUpload.as', params)
}
export const pageInfoById = (params) => {
    return request.POST('/message/pageInfoById.as', params)
}
export const updateReadStatus = (params) => {
    return request.POST('/message/updateReadStatus.as', params)
}
export const delNewsStatus = (params) => {
    return request.POST('/message/del.as', params)
}
export const modifyBoxsChnlTripEnable = (params) => {
    return request.POST('/boxProperties/modifyBoxsChnlTripEnable.as', params)
}
export const modifyBoxsChnlAlarmEbable = (params) => {
    return request.POST('/boxProperties/modifyBoxsChnlAlarmEbable.as', params)
}
export const queryTlinkChannelByMac = (params) => {
    return request.POST('/tlink/queryTlinkChannelByMac.as', params)
}
export const macAlias = (params) => {
    return request.POST('/box/updateMacNameAndFloor.as', params)
}
export const tlinkDeviceCommand = (params) => {
    return request.POST('/norProperties/tlinkDeviceCommand.as', params)
}
export const queryTlinkConfig = (params) => {
    return request.POST('/tlink/queryTlinkConfig.as', params)
}
export const queryForsafeChannelByMac = (params) => {
    return request.POST('/forsafe/queryForsafeChannelByMac.as', params)
}
export const forsafeDeviceCommand = (params) => {
    return request.POST('/norProperties/forsafeDeviceCommand.as', params)
}
export const queryForsafeMsgTypeConfig = (params) => {
    return request.POST('/forsafe/queryForsafeMsgTypeConfig.as', params)
}
export const queryTlinkChnlHistory = (params) => {
    return request.POST('/tlink/queryTlinkChnlHistory.as', params)
}
export const querySmokeHistory = (params) => {
    return request.POST('/zac/queryZacChnlHistory.as', params)
}
export const queryRenkeChnlHistory = (params) => {
    return request.POST('/renke/queryRenkeChnlHistory.as', params)
}
export const winextlora = (params) => {
    return request.POST('/winextlora/queryChannelHistory.as', params)
}
export const queryChtqdqMeterReadingDataHistory = (params) => {
    return request.POST('/chtqdq/queryChtqdqMeterReadingDataHistory.as', params)
}
export const queryZacChannelMac = (params) => {
    return request.POST('/zac/findZacChannelByMac.as', params)
}
export const findByMacAndNode = (params) => {
    return request.POST('/renke/findByMacAndNode.as', params)
}
export const queryParamByMac = (params) => {
    return request.POST('/renke/queryParamByMac.as', params)
}
export const updateParam = (params) => {
    return request.POST('/renke/updateParam.as', params)
}
export const refreshParam = (params) => {
    return request.POST('/renke/refreshParam.as', params)
}
export const updateAlarmEnable = (params) => {
    return request.POST('/renke/updateAlarmEnable.as', params)
}
export const queryChtqdqMeterReadingData = (params) => {
    return request.POST('/chtqdq/queryChtqdqMeterReadingData.as', params)
}
export const eleRead = (params) => {
    return request.POST('/chtqdq/eleRead.as', params)
}
export const workOrderStatistics = (params) => {
    return request.POST('/large/screen/v5/workOrderStatistics.as', params)
}
export const findHuaxuChannelByMac = (params) => {
    return request.POST('/huaxu/findHuaxuChannelByMac.as', params)
}
export const valveControl = (params) => {
    return request.POST('/huaxu/valveControl.as', params)
}
export const queryPageAuth = (params) => {
    return request.POST('/portal/pageAuth.as', params)
}
export const findLastChannelByMac = (params) => {
    return request.POST('/chaobiaomao/findLastChannelByMac.as', params)
}
export const queryChaobiaomaoChannel = (params) => {
    return request.POST('/chaobiaomao/queryChaobiaomaoChannel.as', params)
}
export const pageBoxsSelect = (params) => {
    return request.POST('/stats-group/pageBoxs4Select.as', params)
}
export const queryChnlSelect = (params) => {
    return request.POST('/stats-group/queryChnl4Select.as', params)
}
export const saveDetail = (params) => {
    return request.POST('/stats-group/saveDetail.as', params)
}
export const queryTable = (params) => {
    return request.POST('/project/main/v5/queryEquipmentPowerSort.as', params)
}
export const infoDetail = (params) => {
    return request.GET('/wo/detail/info.as', params)
}
export const changeStatus = (params) => {
    return request.JPOST('/project/main/v2/batchRemotectrl.as?_operate_at=1', params);
}
export const powerReport = (params) => {
    return request.POST('/energy/manage/v5/powerReport.as', params);
}
export const findPowerConfigure = (params) => {
    return request.POST('/energy/manage/v5/findPowerConfigure.as', params);
}
export const powerConfigure = (params) => {
    return request.JPOST('/energy/manage/v5/powerConfigure.as', params);
}

export const updateProjectInfo = (params) => {
    return request.POST('/project/main/v3/updateProjectInfo.as', params)
}
export const periodPowerReport = (params) => {
    return request.POST('/energy/manage/v5/periodPowerReport.as', params);
}
export const periodPowerTrend = (params) => {
    return request.POST('/energy/manage/v5/periodPowerTrend.as', params);
}
export const queryTypeList = (params) => {
    return request.POST('/load/queryTypeList.as', params);
}
export const checkKeyLoadExist = (params) => {
    return request.POST('/load/checkKeyLoadExist.as', params);
}
export const saveLoad = (params) => {
    return request.POST('/load/saveLoad.as', params);
}
export const queryDetail = (params) => {
    return request.POST('/load/queryDetail.as', params);
}
export const loadDelete = (params) => {
    return request.POST('/load/delete.as', params);
}
export const queryList = (params) => {
    return request.POST('/load/queryList.as', params);
}
export const saveBoxGroup = (params) => {
    return request.POST('/v5/boxGroup/saveBoxGroup.as', params)
}
export const listBoxGroups = (params) => {
    return request.POST('/v5/boxGroup/listBoxGroups.as', params)
}
export const delBoxGroup = (params) => {
    return request.POST('/v5/boxGroup/delBoxGroup.as', params)
}
export const queryBoxGroupTreeDetail = (params) => {
    return request.POST('/v5/boxGroup/queryBoxGroupTreeDetail.as', params)
}
export const saveBoxGroupNode = (params) => {
    return request.POST('/v5/boxGroup/saveBoxGroupNode.as', params)
}
export const delBoxGroupNode = (params) => {
    return request.POST('/v5/boxGroup/delBoxGroupNode.as', params)
}
export const queryBoxGroupAttributes = (params) => {
    return request.POST('/v5/boxGroup/queryBoxGroupAttributes.as', params)
}
export const saveBoxGroupAttributes = (params) => {
    return request.JPOST('/v5/boxGroup/saveBoxGroupAttributes.as', params)
}
export const getQueryBoxes = (params) => {
    return request.POST('/project/main/v5/query/boxes.as', params)
}
export const listBoxGroupDevices = (params) => {
    return request.POST('/v5/boxGroup/listBoxGroupDevices.as', params)
}
export const saveBoxGroupDevices = (params) => {
    return request.JPOST('/v5/boxGroup/saveBoxGroupDevices.as', params)
}
export const listBoxGroupLoads = (params) => {
    return request.POST('/v5/boxGroup/listBoxGroupLoads.as', params)
}
export const saveBoxGroupLoads = (params) => {
    return request.JPOST('/v5/boxGroup/saveBoxGroupLoads.as', params)
}
export const querySafePageShowMenus = (params) => {
    return request.POST('/member/querySafePageShowMenus.as', params)
}
export const saveSafePageShowMenus = (params) => {
    return request.POST('/member/saveSafePageShowMenus.as', params)
}
export const trand = (params) => {
    return request.POST('/load/trand.as', params)
}
export const loadBoxMap = (params) => {
    return request.POST('/project/homePage/v5/loadBoxCoordinate4Map.as', params)
}
export const findBoxByMac = (params) => {
    return request.POST('/box/findBoxByMac.as', params)
}
