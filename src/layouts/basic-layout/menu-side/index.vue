<template>
    <div>
        <div class="i-layout-sider-logo" :class="{ 'i-layout-sider-logo-dark': siderTheme === 'dark' }">
            <transition name="fade-quick">
                <i-link to="/" v-show="!hideLogo">
                    <img src="@/assets/images/logo-small.png" v-if="menuCollapse">
                    <img src="@/assets/images/logo.png" v-else-if="siderTheme === 'light'">
                    <img src="@/assets/images/logo-dark.png" v-else>
                </i-link>
            </transition>
        </div>
        <Menu
                ref="menu"
                class="i-layout-menu-side i-scrollbar-hide"
                :class="{ 'i-layout-menu-side-collapse': menuCollapse }"
                :theme="siderTheme"
                :accordion="menuAccordion"
                :active-name="activePath"
                :open-names="openNames"
                width="auto">
                <template v-if="this.$store.state.filterSiders !==''">
                    <template v-if="!menuCollapse" v-for="(item, index) in datas">
                        <i-menu-side-item v-if="item.children === undefined || !item.children.length" :menu="item" :key="index" />
                        <i-menu-side-submenu v-else :menu="item" :key="index" />
                    </template>
                     <template v-else>
                <Tooltip :content="tTitle(item.title)" placement="right" v-if="item.children === undefined || !item.children.length" :key="index">
                    <i-menu-side-item :menu="item" hide-title />
                </Tooltip>
                <i-menu-side-collapse v-else :menu="item" :key="index" top-level />
            </template>
                </template>
                <template v-if="this.$store.state.filterSiders ===''">
                    <template v-if="!menuCollapse" v-for="(item, index) in filterSider">
                        <i-menu-side-item v-if="item.children === undefined || !item.children.length" :menu="item" :key="index" />
                        <i-menu-side-submenu v-else :menu="item" :key="index" />
                    </template>
                     <template v-else>
                <Tooltip :content="tTitle(item.title)" placement="right" v-if="item.children === undefined || !item.children.length" :key="index">
                    <i-menu-side-item :menu="item" hide-title />
                </Tooltip>
                <i-menu-side-collapse v-else :menu="item" :key="index" top-level />
            </template>
                </template>

        </Menu>
    </div>
</template>
<script>
    import iMenuSideItem from './menu-item';
    import iMenuSideSubmenu from './submenu';
    import iMenuSideCollapse from './menu-collapse';
    import tTitle from '../mixins/translate-title';
    import { mapState, mapGetters } from 'vuex';
    import store from '@/store/index'
    // 元素是否在可视区域
    function isElementInViewport (el) {
        let rect = el.getBoundingClientRect();
        return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth));
    }

    export default {
        name: 'iMenuSide',
        data () {
            return {
                filterNews: [],
                showMenus: this.$store.state.showMenus,
                datas: this.$store.state.filterSiders
            }
        },
        mixins: [ tTitle ],
        components: { iMenuSideItem, iMenuSideSubmenu, iMenuSideCollapse },
        props: {
            hideLogo: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapState('admin/layout', [
                'siderTheme',
                'menuAccordion',
                'menuCollapse'
            ]),
            ...mapState('admin/menu', [
                'activePath',
                'openNames'
            ]),
            ...mapGetters('admin/menu', [
                'filterSider'
            ])
        },
        mounted () {
            store.commit('filterSiders', this.filterSider)
            this.handleFilter()
        },
        watch: {
            '$route': {
                handler () {
                    this.handleUpdateMenuState();
                },
                immediate: true
            },
            // 在展开/收起侧边菜单栏时，更新一次 menu 的状态
            menuCollapse () {
                this.handleUpdateMenuState();
            }
        },
        methods: {
            handleUpdateMenuState () {
                this.$nextTick(() => {
                    if (this.$refs.menu) {
                        this.$refs.menu.updateActiveName();
                        if (this.menuAccordion) this.$refs.menu.updateOpened();
                        // 聚焦当前项
                        this.$nextTick(() => {
                            const $activeMenu = document.getElementsByClassName('ivu-menu-item ivu-menu-item-active ivu-menu-item-selected');
                            if ($activeMenu && $activeMenu.length && !isElementInViewport($activeMenu[0])) {
                                const activeMenuTop = $activeMenu[0].getBoundingClientRect().top;
                                const $menu = this.$refs.menu.$el;
                                setTimeout(() => {
                                    this.$ScrollTop($menu, {
                                        to: activeMenuTop,
                                        time: 0
                                    });
                                }, 300);
                            }
                        });
                    }
                });
            },
            handleFilter () {
                var datast = [{
                                  path: `/safetyMonitor/allWarn`,
                                  title: '全部报警',
                                  custom: 'icon-v5 icon-v5-quanbubaojing1'
                              },
                              {
                                  path: `/safetyMonitor/leakage`,
                                  title: '漏电流',
                                  custom: 'icon-v5 icon-v5-loudianliu1'
                              },
                              {
                                  path: `/safetyMonitor/temperature`,
                                  title: '温度',
                                  custom: 'icon-v5 icon-v5-wendu2'
                              },
                              {
                                  path: `/safetyMonitor/leakageWarm`,
                                  title: '漏电报警',
                                  custom: 'icon-v5 icon-v5-loudianbaojing1'
                              },
                              {
                                  path: `/safetyMonitor/temperatureWarn`,
                                  title: '温度报警',
                                  custom: 'icon-v5 icon-v5-wendubaojing1'
                              },
                              {
                                  path: `/safetyMonitor/leakageSelfChecking`,
                                  title: '漏保自检',
                                  custom: 'icon-v5 icon-v5-loubaozijian1'
                              },
                              {
                                  path: `/safetyMonitor/shortCircuitWarn`,
                                  title: '短路报警',
                                  custom: 'icon-v5 icon-v5-duanlubaojing1'
                              },
                              {
                                  path: `/safetyMonitor/abnormalVoltage`,
                                  title: '过欠压',
                                  custom: 'icon-v5 icon-v5-guoqianya1'
                              },
                              {
                                  path: `/safetyMonitor/abnormalCurrent`,
                                  title: '过流过载',
                                  custom: 'icon-v5 icon-v5-guoliuguozai1'
                              },
                              {
                                  path: `/safetyMonitor/SparkWarn`,
                                  title: '电弧报警',
                                  custom: 'icon-v5 icon-v5-dianhubaojing1'
                              },
                              {
                                  path: `/safetyMonitor/phaseWarn`,
                                  title: '三相报警',
                                  custom: 'icon-v5 icon-v5-sanxiangbaojing1'
                              },
                              {
                                  path: `/safetyMonitor/abnormalState`,
                                  title: '异常状态',
                                  custom: 'icon-v5 icon-v5-yichangzhuangtai1'
                              },
                              {
                                  path: `/safetyMonitor/ocWarn`,
                                  title: '分合闸警示',
                                  custom: 'icon-v5 icon-v5-fenhezha'
                }]
                this.showMenus.forEach(item => {
                    datast.forEach(items => {
                        if (item === items.title) {
                            this.filterNews.push(items)
                        }
                    })
                });
                this.datas[2].children = this.filterNews
            }
        }
    }
</script>
