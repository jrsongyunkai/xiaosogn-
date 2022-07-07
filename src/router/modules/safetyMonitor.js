import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'safetyMonitor-';

export default {
    path: '/safetyMonitor',
    name: 'safetyMonitor',
    redirect: {
        name: `${pre}allWarn`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'allWarn',
            name: `${pre}allWarn`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.allWarn.title',
                closable: true
            },
            component: () => import('@/pages/safetyMonitor/allWarn')
        },
        {
            path: 'leakage',
            name: `${pre}leakage`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.leakage.title',
                closable: true
            },
            component: () => import('@/pages/safetyMonitor/leakage')
        },
        {
            path: 'temperature',
            name: `${pre}temperature`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.temperature.title',
                closable: true
            },
            component: () => import('@/pages/safetyMonitor/temperature')
        },
        {
            path: 'leakageWarm',
            name: `${pre}leakageWarm`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.leakageWarm.title',
                closable: true,
                isShowtabbar: true
            },
            component: () => import('@/pages/safetyMonitor/leakageWarm')
        },
        {
            path: 'temperatureWarn',
            name: `${pre}temperatureWarn`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.temperatureWarn.title',
                closable: true,
                isShowtabbar: true
            },
            component: () => import('@/pages/safetyMonitor/temperatureWarn')
        },
        {
            path: 'leakageSelfChecking',
            name: `${pre}leakageSelfChecking`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.leakageSelfChecking.title',
                closable: true,
                isShowtabbar: true
            },
            component: () => import('@/pages/safetyMonitor/leakageSelfChecking')
        },
        {
            path: 'shortCircuitWarn',
            name: `${pre}shortCircuitWarn`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.shortCircuitWarn.title',
                closable: true,
                isShowtabbar: true
            },
            component: () => import('@/pages/safetyMonitor/shortCircuitWarn')
        },
        {
            path: 'abnormalVoltage',
            name: `${pre}abnormalVoltage`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.abnormalVoltage.title',
                closable: true
            },
            component: () => import('@/pages/safetyMonitor/abnormalVoltage')
        },
        {
            path: 'abnormalCurrent',
            name: `${pre}abnormalCurrent`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.abnormalCurrent.title',
                closable: true
            },
            component: () => import('@/pages/safetyMonitor/abnormalCurrent')
        },
        {
            path: 'SparkWarn',
            name: `${pre}SparkWarn`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.SparkWarn.title',
                closable: true,
                isShowtabbar: true
            },
            component: () => import('@/pages/safetyMonitor/SparkWarn')
        },
        {
            path: 'phaseWarn',
            name: `${pre}phaseWarn`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.phaseWarn.title',
                closable: true,
                isShowtabbar: true
            },
            component: () => import('@/pages/safetyMonitor/phaseWarn')
        },
        {
            path: 'abnormalState',
            name: `${pre}abnormalState`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.abnormalState.title',
                closable: true
            },
            component: () => import('@/pages/safetyMonitor/abnormalState')
        },
        {
            path: 'ocWarn',
            name: `${pre}ocWarn`,
            meta: {
                ...meta,
                title: '$t:page.safetyMonitor.ocWarn.title',
                closable: true
            },
            component: () => import('@/pages/safetyMonitor/ocWarn')
        }

    ]
};
