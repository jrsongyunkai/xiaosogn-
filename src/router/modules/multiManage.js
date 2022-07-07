import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'multiManage-';

export default {
    path: '/multiManage',
    name: 'multiManage',
    redirect: {
        name: `${pre}sceneControl`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'sceneControl',
            name: `${pre}sceneControl`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.sceneControl.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/sceneControl')
        },
        {
            path: 'builtInTimer',
            name: `${pre}builtInTimer`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.builtInTimer.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/builtInTimer')
        },
        {
            path: 'latlongTimer',
            name: `${pre}latlongTimer`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.latlongTimer.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/latlongTimer')
        },
        {
            path: 'batchConfig',
            name: `${pre}batchConfig`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.batchConfig.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/batchConfig')
        },
        {
            path: 'contrlTasks',
            name: `${pre}contrlTasks`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.contrlTasks.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/contrlTasks')
        },
        {
            path: 'groupConfig',
            name: `${pre}groupConfig`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.groupConfig.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/groupConfig')
        },
        {
            path: 'loadManagement',
            name: `${pre}loadManagement`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.loadManagement.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/loadManagement')
        },
        {
            path: 'deviceListControl',
            name: `${pre}deviceListControl`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.deviceListControl.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/deviceListControl')
        },
        {
            path: 'abnormalStateConfig',
            name: `${pre}abnormalStateConfig`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.abnormalStateConfig.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/abnormalStateConfig')
        },
        {
            path: 'linkageScene',
            name: `${pre}linkageScene`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.linkageScene.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/builtInTimer/LinkageScene.vue')
        },
        {
            path: 'workOrder',
            name: `${pre}workOrder`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.workOrder.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/workOrder')
        },
        {
            path: 'report',
            name: `${pre}report`,
            meta: {
                ...meta,
                title: '$t:page.multiManage.report.title',
                closable: true
            },
            component: () => import('@/pages/multiManage/report')
        }
    ]
};
