import BasicLayout from '@/layouts/basic-layout';
const meta = {
    auth: true
};
const pre = 'setting-';
export default {
    path: '/setting',
    name: 'setting',
    meta,
    redirect: {
        name: `${pre}userInfo`
    },
    component: BasicLayout,
    children: [
        {
            path: 'userInfo',
            name: `${pre}userInfo`,
            meta: {
                ...meta,
                title: '设置',
                closable: true
            },
            component: () => import('@/pages/setting/userInfo')
        },
        {
            path: 'projectInfo',
            name: `${pre}projectInfo`,
            meta: {
                ...meta,
                title: '项目配置',
                closable: true
            },
            component: () => import('@/pages/setting/projectInfo')
        }
    ]
};
