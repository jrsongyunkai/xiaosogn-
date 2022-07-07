const pre = '/multiManage/';

export default {
    path: '/multiManage',
    title: '$t:page.multiManage.title',
    header: 'home',
    custom: 'icon-v5 icon-v5-zongheguankong',
    children: [
        {
            path: `${pre}sceneControl`,
            title: '$t:page.multiManage.sceneControl.title',
            custom: 'icon-v5 icon-v5-changjingkongzhi'
        },
        {
            path: `${pre}builtInTimer`,
            title: '$t:page.multiManage.builtInTimer.title',
            custom: 'icon-v5 icon-v5-dingshipeizhi1'
        },
        {
            path: `${pre}latlongTimer`,
            title: '$t:page.multiManage.latlongTimer.title',
            custom: 'icon-v5 icon-v5-jingweidingshi1'
        },
        {
            path: `${pre}batchConfig`,
            title: '$t:page.multiManage.batchConfig.title',
            custom: 'icon-v5 icon-v5-piliangpeizhi1'
        },
        {
            path: `${pre}contrlTasks`,
            title: '$t:page.multiManage.contrlTasks.title',
            custom: 'icon-v5 icon-v5-kongzhiqingdan'
        },
        {
            path: `${pre}groupConfig`,
            title: '$t:page.multiManage.groupConfig.title',
            custom: 'icon-v5 icon-v5-fenzukongzhi'
        },
        {
            path: `${pre}loadManagement`,
            title: '$t:page.multiManage.loadManagement.title',
            custom: 'icon-v5 icon-v5-fenzukongzhi'
        },
        {
            path: `${pre}deviceListControl`,
            title: '$t:page.multiManage.deviceListControl.title',
            custom: 'icon-v5 icon-v5-shebeiliebiaoyukongzhi1'
        },
        {
            path: `${pre}abnormalStateConfig`,
            title: '$t:page.multiManage.abnormalStateConfig.title',
            custom: 'icon-v5 icon-v5-yichangzhuangtaijiancepeizhi1'
        },
        {
            path: `${pre}linkageScene`,
            title: '$t:page.multiManage.linkageScene.title',
            custom: 'icon-v5 icon-v5-liandongkongzhi'
        },
        {
            path: `${pre}workOrder`,
            title: '$t:page.multiManage.workOrder.title',
            custom: 'icon-v5 icon-v5-gongdanguanli1'
        },
        {
            path: `${pre}report`,
            title: '$t:page.multiManage.report.title',
            custom: 'icon-v5 icon-v5-tongjibaogao'
        }
    ]
}
