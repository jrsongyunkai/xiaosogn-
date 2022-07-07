// Vue
import Vue from 'vue';
import App from './App';

// 配置
import Setting from './setting';

// 混合
import mixinApp from '@/mixins/app';

// 插件
import plugins from '@/plugins';

// store
import store from '@/store/index';

// 引入iconfont
import './styles/font/iconfont.css';

// iView 和 iView Pro
import ViewUI from 'view-design';
import iViewPro from '@/libs/iview-pro/iview-pro.min.js';

// 菜单和路由
import router from './router';
import menuHeader from '@/menu/header';
import menuSider from '@/menu/sider';
import { frameInRoutes } from '@/router/routes';

// 多语言
import i18n from '@/i18n';

// 方法
import { getHeaderName, getMenuSider, getSiderSubmenu } from '@/libs/system';

// 内置组件
import iLink from '@/components/link';
import iFrame from '@/components/frame';

// 使用样式，修改主题可以在 styles 目录下创建新的主题包并修改 iView 默认的 less 变量
// 参考 https://www.iviewui.com/docs/guide/theme
import './styles/index.less';
import './libs/iview-pro/iview-pro.css';
import func from '@/untils/func';
import '@/untils/height'
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

// 复制粘贴功能
import Clipboard from 'clipboard';

// import Rem from './rem'
// Vue.use(Rem);

if (window) window.$t = (key, value) => i18n.t(key, value);

Vue.use(VXETable);
Vue.prototype.Clipboard = Clipboard;
Vue.prototype.$XModal = VXETable.modal;
Vue.prototype.$XPrint = VXETable.print;
Vue.prototype.$XSaveFile = VXETable.saveFile;
Vue.prototype.$XReadFile = VXETable.readFile;

Vue.use(plugins);

Vue.use(ViewUI, {
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(iViewPro);

Vue.component('i-link', iLink);
Vue.component('i-frame', iFrame);
Vue.prototype.$func = func;
// vue的自定义指令
Vue.directive('watermark', (el, binding) => {
    let text1 = 'ManTunsci';
    let text2 = '曼顿科技'
    // 当前日期的月日时分
    let font = '26px PingFang SC';
    let textColor = 'rgba(234, 84, 32, 0.1)';
    let weight = 700;
    // 根据两个文字的长度设置每一个模块的长度
    let width = 250;
    let height = 250;
    // 倾斜角度
    let textRotate = -35;

    function addWaterMarker (parentNode) {
        var can = document.createElement('canvas');
        parentNode.appendChild(can);
        can.fontWeight = weight
        can.width = width;
        can.height = height;
        can.style.display = 'none';
        var cans = can.getContext('2d');
        cans.rotate(textRotate * Math.PI / 180);
        cans.font = font;
        cans.fillStyle = textColor;
        cans.textAlign = 'left';
        cans.textBaseline = 'Middle';
        cans.fillText(text1, 0, height);
        cans.fillText(text2, 0, height + 30);
        // 将水印返回成图片
        parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')';
    }
    addWaterMarker(el)
})

new Vue({
    mixins: [mixinApp],
    router,
    store,
    i18n,
    render: (h) => h(App),
    created () {
        // 处理路由 得到每一级的路由设置
        this.$store.commit('admin/page/init', frameInRoutes);
        // 设置顶栏菜单
        this.$store.commit('admin/menu/setHeader', menuHeader);
        // 加载用户登录的数据
        this.$store.dispatch('admin/account/load');
        // 初始化全屏监听
        this.$store.dispatch('admin/layout/listenFullscreen');
    },
    watch: {
        // 监听路由 控制侧边栏显示 标记当前顶栏菜单（如需要）
        $route (to, from) {
            let path = to.matched[to.matched.length - 1].path;
            if (!Setting.dynamicSiderMenu) {
                let headerName = getHeaderName(path, menuSider);
                if (headerName === null) {
                    path = to.path;
                    headerName = getHeaderName(path, menuSider);
                }
                // 在 404 时，是没有 headerName 的
                if (headerName !== null) {
                    this.$store.commit('admin/menu/setHeaderName', headerName);
                    this.$store.commit('admin/menu/setMenuSider', menuSider);

                    const filterMenuSider = getMenuSider(menuSider, headerName);
                    this.$store.commit('admin/menu/setSider', filterMenuSider);
                    this.$store.commit('admin/menu/setActivePath', to.path);

                    const openNames = getSiderSubmenu(path, menuSider);
                    this.$store.commit('admin/menu/setOpenNames', openNames);
                }
            }
            this.appRouteChange(to, from);
        }
    }
}).$mount('#app');
