import BasicLayout from '@/layouts/basic-layout';
import Console from './modules/console';
import SafetyMonitor from './modules/safetyMonitor';
import EnergyMonitor from './modules/energyMonitor';
import MultiManage from './modules/multiManage';
import SetTing from './modules/setting';
import News from './modules/news';
import Logs from './modules/logs'
/**
 * 在主框架内显示
 */

const frameIn = [
    {
        path: '/',
        redirect: {
            name: 'login'
        },
        component: BasicLayout,
        children: [
            {
                path: 'index',
                name: 'index',
                redirect: {
                    name: 'console-project'
                }
            },

            {
                path: 'log',
                name: 'log',
                meta: {
                    title: '前端日志',
                    auth: true
                },
                component: () => import('@/pages/system/log')
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                component: {
                    beforeRouteEnter (to, from, next) {
                        next((instance) => instance.$router.replace(from.fullPath));
                    },
                    render: (h) => h()
                }
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: {
                    beforeRouteEnter (to, from, next) {
                        next((instance) =>
                            instance.$router.replace(JSON.parse(from.params.route))
                        );
                    },
                    render: (h) => h()
                }
            }
        ]
    },

    Console,
    SafetyMonitor,
    EnergyMonitor,
    MultiManage,
    SetTing,
    News,
    Logs
];

/**
 * 在主框架之外显示
 */

const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '$t:page.login.title'
        },
        component: () => import('@/pages/account/login')
    },
    {
        path: '/loading',
        name: 'loading',
        meta: {
            title: '$t:page.login.loading'
        },
        component: () => import('@/pages/account/login/loading.vue')
    },
    // 系统大屏
    {
        path: '/visualScreen',
        name: 'visualScreen',
        meta: {
            title: '$t:page.visualScreen.title'
        },
        component: () => import('@/pages/visualScreen')
    },
    {
        path: '/MaintenanceRecords',
        name: `MaintenanceRecords`,
        meta: {
            title: '$t:page.safetyMonitor.MaintenanceRecords.title',
            closable: true
        },
        component: () => import('@/pages/Control/MaintenanceRecords.vue')
    },
    {
        path: '/Alarms',
        name: `Alarms`,
        meta: {
            title: '$t:page.safetyMonitor.Alarms.title',
            closable: true
        },
        component: () => import('@/pages/Control/Alarm.vue')
    },
    {
        path: '/deviceList',
        name: `deviceList`,
        meta: {
            title: '$t:page.safetyMonitor.deviceList.title',
            closable: true
        },
        component: () => import('@/pages/Control/deviceList.vue')
    },
    {
        path: '/ChannelList',
        name: `ChannelList`,
        meta: {
            title: '$t:page.safetyMonitor.ChannelList.title',
            closable: true
        },
        component: () => import('@/pages/Control/ChannelList.vue')
    },
    {
        path: '/Overviews',
        name: `Overviews`,
        meta: {
            title: '$t:page.visualScreen.Overviews.title',
            closable: true
        },

        component: () => import('@/pages/visualScreen/Overview.vue')
    }
];

/**
 * 错误页面
 */

const errorPage = [
    {
        path: '/403',
        name: '403',
        meta: {
            title: '403'
        },
        component: () => import('@/pages/system/error/403')
    },
    {
        path: '/500',
        name: '500',
        meta: {
            title: '500'
        },
        component: () => import('@/pages/system/error/500')
    },
    {
        path: '*',
        name: '404',
        meta: {
            title: '404'
        },
        component: () => import('@/pages/system/error/404')
    }
];

// 导出需要显示菜单的
export const frameInRoutes = frameIn;

// 重新组织后导出
export default [...frameIn, ...frameOut, ...errorPage];
