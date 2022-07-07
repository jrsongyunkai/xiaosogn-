<template>
  <Layout class="i-layout">
    <Sider
      v-if="!isMobile && !hideSider"
      class="i-layout-sider"
      :class="siderClasses"
      :width="menuSideWidth"
    >
      <i-menu-side :hide-logo="isHeaderStick && headerFix && showHeader" />
    </Sider>
    <Layout class="i-layout-inside" :class="insideClasses">
      <transition name="fade-quick">
        <Header
          class="i-layout-header"
          :class="headerClasses"
          :style="headerStyle"
          v-show="showHeader"
          v-resize="handleHeaderWidthChange"
        >
          <i-header-logo v-if="isMobile && showMobileLogo" />
          <i-header-logo v-if="!isMobile && isHeaderStick && headerFix" />
          <!-- 伸展侧边栏按钮 -->
          <i-header-collapse
            v-if="(isMobile || showSiderCollapse) && !hideSider"
            @on-toggle-drawer="handleToggleDrawer"
          />
          <!-- <i-header-reload  @on-reload="handleReload" /> -->
          <i-menu-head v-if="headerMenu && !isMobile" ref="menuHead"/>
          <!-- 顶部面包屑 -->
          <!-- <i-header-breadcrumb v-if="showBreadcrumb && !headerMenu && !isMobile" ref="breadcrumb" /> -->
          <template >
                <span  v-if="$store.state.prjTitle !==''" style="font-size: 20px">{{$store.state.prjTitle}}</span>
                <span  v-if="$store.state.prjTitle ===''" style="font-size: 20px">{{$store.state.prjName}}</span>
          </template>
          <i-header-search
            v-if="showSearch && !headerMenu && !isMobile && !showBreadcrumb" @on-reload="handleReload"
          />

          <div class="i-layout-header-right" style="display: flex">
            <i-header-search
              v-if="
                (showSearch && isMobile) ||
                (showSearch && (headerMenu || showBreadcrumb))
              "
              @on-reload="handleReload"
            />

            <div class="set">
                <i-link to="/setting/projectInfo">
                  <span class="i-layout-header-trigger i-layout-header-trigger-min"><Icon custom="icon-v5 icon-v5-shezhi1" /></span>
                </i-link>
            </div>
            <!-- <i-menu-head v-if="headerMenu && isMobile" /> -->
            <!-- <i-header-log v-if="isDesktop && showLog" /> -->

            <div class="set">
                  <i-header-fullscreen v-if="isDesktop && showFullscreen" />
            </div>
            <div class="set">
                <i-header-notice v-if="showNotice" />
            </div>
             <div class="set">
                  <i
              @click="switchSound"
              class="icon-v5 layout_header_icon i-layout-header-trigger i-layout-header-trigger-min"
              :class="
                !$store.state.muted
                  ? 'icon-v5-shengyin-da_volume-notice'
                  : 'icon-v5-jingyin_volume-mute'
              "
            ></i>
            </div>

            <i-header-user />
            <div class="set">
                <i-header-i18n v-if="showI18n" />
            </div>

            <!-- <i-header-setting v-if="enableSetting && !isMobile" /> -->
          </div>
        </Header>
      </transition>
      <Content class="i-layout-content" :class="contentClasses">
        <transition name="fade-quick">
          <i-tabs v-if="tabs" v-show="showHeader" @on-reload="handleReload" />
        </transition>
        <div class="i-layout-content-main">
          <keep-alive :include="keepAlive">
            <router-view v-if="loadRouter" />
          </keep-alive>
        </div>
        <!-- 弹窗告警 -->
        <Modal
          width="785px;"
          id="alarmSocket2"
          @on-cancel="handleAlarms"
          v-model="alarmFlag"
          class="d-alm-wrap"
        >
          <span slot="header"
            >&nbsp;</span
          >
          <div class="d-alm-content d-alm-content-show">
            <div
              v-for="(item, index) in alarms"
              :key="index"
              class="d-alm-content"
            >
            <div class="d-alm">
                <span>{{ '[' + item.datetime + ']' }}</span>
                <span class="c-warning">{{
                  item.build
                    ? item.build + ',' + item.unit + ',' + item.room
                    : '未知位置'
                }}</span>
              <span class="c-warning">{{ '(' + item.mac + ')' }}</span>
              <span class="fw"
                >{{ item.node }}
                {{ item.status === true ? '发生' : '解除' }}</span
              >
              <span class="c-danger jump" @click="handleRoute(item.typeNo)">{{
                item.info
              }}</span>
              <span class="contacts"
                >{{ '(' + '\xa0\xa0' + '联系人:' + '' }}
                <i v-if="item.linkman">{{ item.linkman }}</i>
                <i v-if="item.linkman_tel">{{ item.linkman_tel }}</i>
                <i v-if="item.linkman2">{{ item.linkman2 }}</i>
                <i v-if="item.linkman_tel2">{{ item.linkman_tel2 }}</i> )
              </span>
            </div>

            </div>
            <!-- <div class="c-danger mt-20 abnormal">
              <span v-show="offlineAttention && !abnormalAttention">{{
                '请注意' +
                '：' +
                '设备离线可能是由于设备断电、通讯信号弱、或发生重大事故' +
                '请及时指派专人对电力线路进行巡查。'
              }}</span>
              <span v-show="abnormalAttention && !offlineAttention">{{
                '请注意' +
                '：' +
                '设备离线可能是由于设备断电、通讯信号弱、或发生重大事故' +
                '请及时指派专人对电力线路进行巡查。'
              }}</span>
              <span v-show="abnormalAttention && offlineAttention">
                <span class="treatment">请注意:</span>
                <span class="treatment">
                  设备离线可能是由于设备断电、通讯信号弱、或发生重大事故
                </span>
                <span class="treatment">
                  异常分闸可能是由于短路、漏电或手动分闸，
                </span>
                <span class="treatment">请及时指派专人对电力线路进行巡查。</span>
              </span>
            </div> -->
          </div>
          <div class="alarmBtn" @click="handleAlarms"/>
          <div slot="footer"></div>
        </Modal>
      </Content>
    </Layout>
    <div v-if="isMobile && !hideSider">
      <Drawer
        v-model="showDrawer"
        placement="left"
        :closable="false"
        :class-name="drawerClasses"
      >
        <i-menu-side />
      </Drawer>
    </div>
        <span v-if="audioFlag">
          <span v-if="$store.state.muted">
            <audio muted :src="'http://v5.sndtest.com/' + musicStr " v-if="musicStr !== undefined"></audio>
            <audio muted src="@/../static/audio/pelic.mp3" v-else></audio>
          </span>
          <span v-else>
            <audio autoplay :src="'http://v5.sndtest.com/' + musicStr " v-if="musicStr !== undefined"></audio>
            <audio autoplay src="@/../static/audio/pelic.mp3" v-else></audio>
          </span>
        </span>
  </Layout>
</template>
<script>
    import iMenuHead from './menu-head';
    import iMenuSide from './menu-side';
    import iHeaderLogo from './header-logo';
    import iHeaderCollapse from './header-collapse';
    import iHeaderReload from './header-reload';
    import iHeaderBreadcrumb from './header-breadcrumb';
    import iHeaderSearch from './header-search';
    import iHeaderLog from './header-log';
    import iHeaderFullscreen from './header-fullscreen';
    import iHeaderNotice from './header-notice';
    import iHeaderUser from './header-user';
    import iHeaderI18n from './header-i18n';
    import iHeaderSetting from './header-setting';
    import iTabs from './tabs';
    import iCopyright from '@/components/copyright';

    import store from '../../store/index';
    import { mapState, mapGetters, mapMutations } from 'vuex';
    import Setting from '@/setting';
    import { lastAlarm4tip } from '@/api/index';
    import { globalAlarmSound } from '@/api/visualScreen/index.js'
    import { requestAnimation } from '@/libs/util';

    export default {
        name: 'BasicLayout',
        components: {
            iMenuHead,
            iMenuSide,
            iCopyright,
            iHeaderLogo,
            iHeaderCollapse,
            iHeaderReload,
            iHeaderBreadcrumb,
            iHeaderSearch,
            iHeaderUser,
            iHeaderI18n,
            iHeaderLog,
            iHeaderFullscreen,
            iHeaderSetting,
            iHeaderNotice,
            iTabs
        },
        data () {
            return {
                showDrawer: false,
                ticking: false,
                headerVisible: true,
                oldScrollTop: 0,
                isDelayHideSider: false, // hack，当从隐藏侧边栏的 header 切换到正常 header 时，防止 Logo 抖动
                loadRouter: true,
                gainType: 1,
                excId: [],
                popText: [],
                alarms: [],
                alarmFlag: false,
                audioFlag: false,
                offlineAttention: false,
                abnormalAttention: false,
                AlarmSoundList: {},
                musicStr: ''
            };
        },
        computed: {
            ...mapState('admin/layout', [
                'siderTheme',
                'headerTheme',
                'headerStick',
                'tabs',
                'tabsFix',
                'siderFix',
                'headerFix',
                'headerHide',
                'headerMenu',
                'isMobile',
                'isTablet',
                'isDesktop',
                'menuCollapse',
                'showMobileLogo',
                'showSearch',
                'showNotice',
                'showFullscreen',
                'showSiderCollapse',
                'showBreadcrumb',
                'showLog',
                'showI18n',
                'showReload',
                'enableSetting'
            ]),
            ...mapState('admin/page', ['keepAlive']),
            ...mapGetters('admin/menu', ['hideSider']),
            // 如果开启 headerMenu，且当前 header 的 hideSider 为 true，则将顶部按 headerStick 处理
            // 这时，即使没有开启 headerStick，仍然按开启处理
            isHeaderStick () {
                let state = this.headerStick;
                if (this.hideSider) state = true;
                return state;
            },
            showHeader () {
                let visible = true;
                if (this.headerFix && this.headerHide && !this.headerVisible) {
                    visible = false;
                }
                return visible;
            },
            headerClasses () {
                return [
                    `i-layout-header-color-${this.headerTheme}`,
                    {
                        'i-layout-header-fix': this.headerFix,
                        'i-layout-header-fix-collapse': this.headerFix && this.menuCollapse,
                        'i-layout-header-mobile': this.isMobile,
                        'i-layout-header-stick': this.isHeaderStick && !this.isMobile,
                        'i-layout-header-with-menu': this.headerMenu,
                        'i-layout-header-with-hide-sider':
                            this.hideSider || this.isDelayHideSider
                    }
                ];
            },
            headerStyle () {
                const menuWidth = this.isHeaderStick
                    ? 0
                    : this.menuCollapse
                        ? 80
                        : Setting.menuSideWidth;
                return this.isMobile || !this.headerFix
                    ? {}
                    : {
                        width: `calc(100% - ${menuWidth}px)`
                };
            },
            siderClasses () {
                return {
                    'i-layout-sider-fix': this.siderFix,
                    'i-layout-sider-dark': this.siderTheme === 'dark'
                };
            },
            contentClasses () {
                return {
                    'i-layout-content-fix-with-header': this.headerFix,
                    'i-layout-content-with-tabs': this.tabs,
                    'i-layout-content-with-tabs-fix': this.tabs && this.tabsFix
                };
            },
            insideClasses () {
                return {
                    'i-layout-inside-fix-with-sider': this.siderFix,
                    'i-layout-inside-fix-with-sider-collapse':
                        this.siderFix && this.menuCollapse,
                    'i-layout-inside-with-hide-sider': this.hideSider,
                    'i-layout-inside-mobile': this.isMobile
                };
            },
            drawerClasses () {
                let className = 'i-layout-drawer';
                if (this.siderTheme === 'dark') className += ' i-layout-drawer-dark';
                return className;
            },
            menuSideWidth () {
                return this.menuCollapse ? 80 : Setting.menuSideWidth;
            }
        },
        watch: {
            hideSider () {
                this.isDelayHideSider = true;
                setTimeout(() => {
                    this.isDelayHideSider = false;
                }, 0);
            },
            $route (to, from) {
                if (to.name === from.name) {
                    // 相同路由，不同参数，跳转时，重载页面
                    if (Setting.sameRouteForceUpdate) {
                        this.handleReload();
                    }
                }
                if ('WebSocket' in window) {
                    if (to.path === '/console/project') {
                        window.removeEventListener('onmessageWS', this.getsocketData);
                        window.addEventListener('onmessageWS', this.getsocketData);
                    }
                    if (to.path === '/visualScreen') {
                        window.removeEventListener('onmessageWS', this.getsocketData);
                    }
                } else {
                    this.setTimer(this.getLastAlarms);
                }
            },
            immediate: true,
            audioFlag: {
                handler (newVal, oldVal) {

                }
            }
        },
        methods: {
            switchSound () {
                store.commit('muted', !this.$store.state.muted);
            },
            init () {
                if ('WebSocket' in window) {
                    window.addEventListener('onmessageWS', this.getsocketData, false);
                }
                this.getGlobalAlarmSound()
            },
            getGlobalAlarmSound () {
                globalAlarmSound()
                    .then(res => {
                        if (res.success) {
                            this.AlarmSoundList = res.data
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error(res.message)
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            ...mapMutations('admin/layout', ['updateMenuCollapse']),
            ...mapMutations('admin/page', ['keepAlivePush', 'keepAliveRemove']),
            handleToggleDrawer (state) {
                if (typeof state === 'boolean') {
                    this.showDrawer = state;
                } else {
                    this.showDrawer = !this.showDrawer;
                }
            },
            handleScroll () {
                if (!this.headerHide) return;

                const scrollTop =
                    document.body.scrollTop + document.documentElement.scrollTop;

                if (!this.ticking) {
                    this.ticking = true;
                    requestAnimation(() => {
                        if (this.oldScrollTop > scrollTop) {
                            this.headerVisible = true;
                        } else if (scrollTop > 300 && this.headerVisible) {
                            this.headerVisible = false;
                        } else if (scrollTop < 300 && !this.headerVisible) {
                            this.headerVisible = true;
                        }
                        this.oldScrollTop = scrollTop;
                        this.ticking = false;
                    });
                }
            },
            handleHeaderWidthChange () {
                const $breadcrumb = this.$refs.breadcrumb;
                if ($breadcrumb) {
                    $breadcrumb.handleGetWidth();
                    $breadcrumb.handleCheckWidth();
                }
                const $menuHead = this.$refs.menuHead;
                if ($menuHead) {
                    // todo $menuHead.handleGetMenuHeight();
                }
            },
            handleReload () {
                // 针对缓存的页面也生效
                const isCurrentPageCache = this.keepAlive.indexOf(this.$route.name) > -1;
                const pageName = this.$route.name;
                if (isCurrentPageCache) {
                    this.keepAliveRemove(pageName);
                }
                this.loadRouter = false;
                this.$nextTick(() => {
                    this.loadRouter = true;
                    if (isCurrentPageCache) {
                        this.keepAlivePush(pageName);
                    }
                });
            },
            handleAlarms () {
                this.gainType = 1;
                this.excId = [];
                this.popText = [];
                this.alarms = [];
                this.alarmFlag = false;
                this.audioFlag = false;
            },
            getsocketData (e) {
                this.wsData = JSON.parse(e && e.detail.data);
                if (!this.wsData.data) return false;
                this.audioKey = '';
                this.audioFlag = false;

                store.commit('innerMessage', true);

                this.socketStatsNumber(this.wsData);
            },
            handleRoute (type) {
                let path = '';
                if (type === 1) {
                    path = '/safetyMonitor/shortCircuitWarn';
                } else if (type === 2) {
                    path = '/safetyMonitor/leakageWarm';
                } else if (type === 3 || type === 4) {
                    path = '/safetyMonitor/abnormalCurrent';
                } else if (type === 5 || type === 6) {
                    path = '/safetyMonitor/abnormalVoltage';
                } else if (type === 7) {
                    path = '/safetyMonitor/temperatureWarn';
                } else if (type === 11) {
                    path = '/safetyMonitor/SparkWarn';
                } else if (type === 17) {
                    path = '/safetyMonitor/phaseWarn';
                } else {
                    path = '/safetyMonitor/allWarn';
                }
                this.$router.push({ path: `${path}` });
                this.alarmFlag = false;
                this.audioFlag = false;
            },
            showAlarmTip () {
                this.audioFlag = true;

                this.alarmFlag = true;
            },
            socketStatsNumber (wsData) {
                //
                let Mpauto = wsData.data.dataList[0].lastTypeNumber + ''
                this.musicStr = this.AlarmSoundList[Mpauto]

                this.$nextTick(() => {
                    if (wsData.data.dataList.length > 0) {
                        this.gainType = 2;
                        let curTxt = [];
                        let types = [];
                        if (wsData.data.dataList[0] && wsData.data.dataList.length > 0) {
                            wsData.data.dataList.forEach((v, i) => {
                                this.excId.push(v.id);
                                if (v.mac && v.projectCode === this.$store.state.projectCode) {
                                    this.alarms.unshift(v);
                                    curTxt.push(v);
                                    this.audioKey = String(v.typeNo);
                                }
                            });
                            if (curTxt.length > 0) {
                                this.popTxt = curTxt.concat(this.popTxt);
                                if (this.popTxt.length > 100) {
                                    this.gainType = 1;
                                    this.excId = [];
                                    this.alarms.splice(100, this.alarms.length - 100);
                                }
                                if (this.popTxt.length > 0) {
                                    this.showAlarmTip();
                                    this.alarms.forEach((item, index) => {
                                        types.unshift(item.typeNo);
                                    });

                                    if (types.indexOf(1002) > -1 && types.indexOf(1005) > -1) {
                                        this.offlineAttention = true;
                                        this.abnormalAttention = true;
                                    } else {
                                        types.indexOf(1002) > -1
                                            ? (this.offlineAttention = true)
                                            : (this.offlineAttention = false);
                                        types.indexOf(1005) > -1
                                            ? (this.abnormalAttention = true)
                                            : (this.abnormalAttention = false);
                                    }
                                }
                            }
                        }
                    }
                });
            },
            getLastAlarms () {
                let that = this;
                if (this.$store.state.projectCode) {
                    lastAlarm4tip({
                        projectCode: this.$store.state.projectCode,
                        gainType: this.gainType,
                        excId: this.excId.join(',')
                    })
                        .then((res) => {
                            if (res.success) {
                                this.gainType = 2;
                                let curTxt = [];
                                let types = [];
                                if (res.data && res.data.length > 0) {
                                    res.data.forEach((v, i) => {
                                        that.excId.push(v.id);
                                        if (v.mac) {
                                            that.alarms.unshift(v);
                                            curTxt.push(v);
                                            this.audioKey = String(v.typeNo);
                                        }
                                    });
                                    if (curTxt.length > 0) {
                                        that.popTxt = curTxt.concat(that.popTxt);
                                        if (that.popTxt.length > 100) {
                                            that.gainType = 1;
                                            that.excId = [];
                                            that.alarms.splice(100, that.alarms.length - 100);
                                        }
                                        if (that.popTxt.length > 0) {
                                            that.showAlarmTip();
                                            that.alarms.forEach((item, index) => {
                                                types.unshift(item.typeNo);
                                            });
                                            if (types.indexOf(1002) > -1 && types.indexOf(1005) > -1) {
                                                that.offlineAttention = true;
                                                that.abnormalAttention = true;
                                            } else {
                                                types.indexOf(1002) > -1
                                                    ? (that.offlineAttention = true)
                                                    : (that.offlineAttention = false);
                                                types.indexOf(1005) > -1
                                                    ? (that.abnormalAttention = true)
                                                    : (that.abnormalAttention = false);
                                            }
                                        }
                                    }
                                }
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error({
                                    content: res.message
                                });
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                    });
                }
            }
        },
        mounted () {
            this.init();
            document.addEventListener('scroll', this.handleScroll, { passive: true });
        },
        beforeDestroy () {
            document.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener('onmessageWS', this.getsocketData);
        },
        created () {
            if (this.isTablet && this.showSiderCollapse) this.updateMenuCollapse(true);
        }
    };
</script>
<style lang="less" scoped>
.set{
    width: 30px;
    text-align: center;
}

</style>
