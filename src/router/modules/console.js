import BasicLayout from '@/layouts/basic-layout';

const meta = {
    auth: true
};

const pre = 'console-';

export default {
    path: '/console',
    name: 'console',
    redirect: {
        name: `${pre}project`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'project',
            name: `${pre}project`,
            meta: {
                ...meta,
                title: '$t:page.console.project.title',
                closable: false
            },
            component: () => import('@/pages/console/project')
        },
        {
            path: 'device',
            name: `${pre}device`,
            meta: {
                ...meta,
                title: '$t:page.console.device.title',
                closable: true
            },
            component: () => import('@/pages/console/device')
        },

        {
            path: 'topology',
            name: `${pre}topology`,
            meta: {
                ...meta,
                title: '$t:page.console.topology.title',
                closable: true
            },
            component: () => import('@/pages/console/topology')
        }
    ]
};
