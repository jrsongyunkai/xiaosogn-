import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'view-design';

import util from '@/libs/util'

import Setting from '@/setting';

import store from '@/store/index';

// 路由数据
import routes from './routes';
import { createSocket, sendWSPush } from '@/untils/websocket'
import { sessionState, checkLogin } from '../api/index'
Vue.use(VueRouter);

// 导出路由 在 main.js 里使用
const router = new VueRouter({
    routes,
    mode: Setting.routerMode,
    base: Setting.routerBase
});

/**
 * 路由拦截
 * 权限验证
 */
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
    if (whiteList.indexOf(to.path) !== -1) {
        next()
    } else {
        sessionState().then((res) => {
            if (res.code === '-1') {
                store.dispatch('reset')
                next({
                    path: '/login'
                })
            } else {
                if (from.path === '/login') {
                    const theHead = document.getElementsByTagName('head').item(0)
                    const myScript = document.createElement('script')
                    myScript.type = 'text/javascript'
                    myScript.innerHTML = 'var loginchk = function () {};'
                    myScript.defer = true
                    theHead.appendChild(myScript)
                    let script = document.createElement('script')
                    script.type = 'text/javascript'
                    document.head.appendChild(script)
                    setTimeout(() => {
                        next()
                    }, 100)
                } else {
                    next()
                }
                if (to.path === '/') {
                    next({
                        path: '/visualScreen'
                    })
                }
                if ('WebSocket' in window) {
                    setTimeout(() => {
                        new Promise(resolve => {
                            createSocket(sessionStorage.getItem('token'))
                            resolve('')
                        }).then(() => {
                            if (to.path === '/visualScreen' || '/console/project') {
                                let params = {
                                    eventType: 2,
                                    msgType: 1
                                }
                                sendWSPush(params)
                            }
                        })
                    }, 3000)
                }
            }
            let _tmp = store.state.projectCode
            if (to.path === '/visualScreen') {
                store.commit('projectCode', '')
            } else {
                store.commit('projectCode', _tmp)
            }
        })
    }
})
// router.beforeEach((to, from, next) => {
//     if (whiteList.indexOf(to.path) !== -1) {
//         next()
//     }
//     if (Setting.showProgressBar) iView.LoadingBar.start();
//     // 判断是否需要登录才可以进入
//     if (to.matched.some(_ => _.meta.auth)) {
//         // 这里依据 token 判断是否登录，可视情况修改
//         var storage = window.sessionStorage;
//         const token = storage.getItem('token');
//         if (token && token !== 'undefined') {
//             next();
//         } else {
//             // 没有登录的时候跳转到登录界面
//             // 携带上登陆成功之后需要跳转的页面完整路径
//             next({
//                 name: 'login',
//                 query: {
//                     redirect: to.fullPath
//                 }
//             });
//         }
//     } else {
//         // 不需要身份校验 直接通过
//         next();
//     }
// });

router.afterEach(to => {
    if (Setting.showProgressBar) iView.LoadingBar.finish();
    // 多页控制 打开新的页面
    if (!('meta' in to) || (to.meta && !('tabs' in to.meta)) || (to.meta && to.meta.tabs)) {
        store.dispatch('admin/page/open', to);
    }
    // 更改标题
    util.title({
        title: to.meta.title
    });
    // 返回页面顶端
    window.scrollTo(0, 0);
});
// 缓存原型上的push函数
const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace
// 给原型对象上的push指定新函数函数
VueRouter.prototype.push = function (location, onComplete, onAbort) {
    // 判断如果没有指定回调函数, 通过call调用源函数并使用catch来处理错误
    if (onComplete === undefined && onAbort === undefined) {
        return originPush.call(this, location, onComplete, onAbort).catch(() => {})
    } else { // 如果有指定任意回调函数, 通过call调用源push函数处理
        originPush.call(this, location, onComplete, onAbort)
    }
}
// replace同理处理
VueRouter.prototype.replace = function (location, onComplete, onAbort) {
    if (onComplete === undefined && onAbort === undefined) {
        return originReplace.call(this, location, onComplete, onAbort).catch(() => {})
    } else {
        originReplace.call(this, location, onComplete, onAbort)
    }
}
export default router;
