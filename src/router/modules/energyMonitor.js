import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'energyMonitor-';

export default {
    path: '/energyMonitor',
    name: 'energyMonitor',
    redirect: {
        name: `${pre}power`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'power',
            name: `${pre}power`,
            meta: {
                ...meta,
                title: '$t:page.energyMonitor.power.title',
                closable: true
            },
            component: () => import('@/pages/energyMonitor/power')
        },
        {
            path: 'load',
            name: `${pre}load`,
            meta: {
                ...meta,
                title: '$t:page.energyMonitor.load.title',
                closable: true
            },
            component: () => import('@/pages/energyMonitor/load')
        },
        {
            path: 'period',
            name: `${pre}period`,
            meta: {
                ...meta,
                title: '$t:page.energyMonitor.period.title',
                closable: true
            },
            component: () => import('@/pages/energyMonitor/period')
        },
        {
            path: 'report',
            name: `${pre}report`,
            meta: {
                ...meta,
                title: '$t:page.energyMonitor.report.title',
                closable: true
            },
            component: () => import('@/pages/energyMonitor/report')
        },
        {
            path: 'price',
            name: `${pre}price`,
            meta: {
                ...meta,
                title: '$t:page.energyMonitor.price.title',
                closable: true
            },
            component: () => import('@/pages/energyMonitor/price')
        }
    ]
};
