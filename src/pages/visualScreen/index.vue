<template>
  <div id="visualScreen" style="min-width: 1024px; min-height: 1200px">
    <echarts-map
      class="echarts_map"
      @showDetail="showDetail"
      :projectsOption="projectsOption"
    ></echarts-map>
    <hNav class="layout_header tc" />
    <div class="layout_content_left">
      <lNav />
    </div>
    <div class="layout_content_middle tc">
      <mNav />
    </div>
    <div class="layout_content_middleSec tc">
      <msNav :industryTypesData="industryTypesData"></msNav>
    </div>
    <div class="layout_content_right">
      <rNav />
    </div>
    <div class="layout_content_bottom">
      <bNav />
    </div>
    <Modal
      v-model="dialogVisible"
      :mask-closable="false"
      :footer-hide="true"
      width="80vw"
      id="map-wrap"
      class-name="vertical-center-modal"
    >
      <div id="contain" style="height: 600px; margin: 20px"></div>
    </Modal>
    <Modal
      width="400px"
      id="alarmSocket"
      @on-cancel="handleAlarmClose"
      v-model="dialogAlarmVisible"
      class="d-alm-wrap"
    >
      <div slot="header">&nbsp;</div>
      <div
        class="d-alm-content"
        v-for="(item, index) in localData"
        :key="index"
      >
        <div class="d-alm">
          <div class="d-alm-title"></div>
          <span
            @click="handleAlarm(item.code, item.name)"
            class="handle-alarm"
            :style="{ color: item.color }"
            >{{ item.name }}</span
          >
        </div>
        <div class="alarmBtn" @click="handleAlarmClose" />
      </div>

      <div slot="footer"></div>
    </Modal>
    <span v-if="audioFlag">
      <span v-if="$store.state.muted">
        <audio
          muted
          :src="'http://v5.sndtest.com/' + musicStr"
          v-if="musicStr !== undefined"
        ></audio>
        <audio muted src="@/../static/audio/pelic.mp3" v-else></audio>
      </span>
      <span v-else>
        <audio
          autoplay
          :src="'http://v5.sndtest.com/' + musicStr"
          v-if="musicStr !== undefined"
        ></audio>
        <audio autoplay src="@/../static/audio/pelic.mp3" v-else></audio>
      </span>
    </span>
    <Modal
      title="版本更新信息"
      v-model="NotifyVisible"
      :close-on-click-modal="false"
      width="1000px"
      top="20vh"
    >
      <div class="notifyV" style="height: 500px">
        <Timeline>
          <TimelineItem
            :timestamp="versionHistory.current.deploy_time"
            placement="top"
          >
            <Card>
              <h4 style="margin-top: 0px">
                {{ versionHistory.current.version_no }}
              </h4>
              <p
                v-for="(item, index) in versionHistory.current.content"
                :key="index"
              >
                {{ item }}
              </p>
            </Card>
          </TimelineItem>
          <TimelineItem
            v-for="(hislistItem, hislistIndex) in versionHistory.hislist"
            :key="hislistIndex"
            :timestamp="hislistItem.deploy_time"
            placement="top"
          >
            <Card>
              <h4 style="margin-top: 0px">{{ hislistItem.version_no }}</h4>
              <p v-for="(Item, Index) in hislistItem.content" :key="Index">
                {{ Item }}
              </p>
            </Card>
          </TimelineItem>
        </Timeline>
      </div>
    </Modal>
  </div>
</template>

<script>
    import store from '@/store/index';
    import echartsMap from '../../components/common/echartsMap.vue';
    // import myIcon1 from '../../assets/images/nIcon.png'
    import myIcon2 from '../../assets/images/map2.png';
    import _headerNav from './_headerNav.vue';
    import _contentNav from './_contentNav.vue';
    import _rightNav from './_rightNav.vue';
    import _bottomNav from './_bottomNav.vue';
    import _middleNav from './_middleNav.vue';
    import _middleSecNav from './_middleSecNav.vue';
    import { versionHistory } from '../../../public/history/version-history';
    import pkg from '../../../package.json';
    import {
        loadAllProject,
        loadMetaData,
        switchHover,
        statisticalNumber,
        globalAlarmSound
    } from '@/api/visualScreen/index.js';
    export default {
        components: {
            echartsMap,
            hNav: _headerNav,
            lNav: _contentNav,
            rNav: _rightNav,
            bNav: _bottomNav,
            mNav: _middleNav,
            msNav: _middleSecNav
        },
        data () {
            return {
                versionHistory: versionHistory,
                industryTypesData: [
                    {
                        code: 'all',
                        imgSrc: require('../../assets/images/btn.gif'),
                        name: '全部'
                    }
                ],
                projectsOption: [],
                dialogVisible: false,
                mapPointData: [],
                dialogAlarmVisible: false,
                localDatas: [],
                localData: [],
                excId: [],
                audioFlag: false,
                AlarmSoundList: {},
                musicStr: '',
                NotifyVisible: false,
                devicePasswordValue: false,
                notifyValue: false,
                mapData: ''
            };
        },
        created () {},
        mounted () {
            this.initMap();
            this.$nextTick(() => {
                this.loadAllProject();
            });
            this.init();
            let _this = this;
            window.openPrjAction = (name, code) => {
                let item = {
                    value: name,
                    projectCode: code
                };
                _this.handleSelect(item);
            };
        },
        activated () {
            if ('WebSocket' in window) {
                window.addEventListener('onmessageWS', this.getsocketData);
            }
        },
        deactivated () {
            window.removeEventListener('onmessageWS', this.getsocketData);
        },

        methods: {
            init () {
                if ('WebSocket' in window) {
                    window.addEventListener('onmessageWS', this.getsocketData, false);
                    this.statisticalNumber();
                }
                this.getGlobalAlarmSound();
                this.initAllProjects();
                if (this.$store.state.devHis === true) {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            if (
                                this.$func.getDaysBetween(
                                    Date.parse(new Date(versionHistory.current.deploy_time)),
                                    new Date()
                                ) <= 7
                            ) {
                                if (document.cookie.indexOf('notify') === -1) {
                                    this.openNotifyInstance();
                                } else {
                                    if (!this.$func.getCookie(`notify-${pkg.version}`)) {
                                        this.openNotifyInstance();
                                    }
                                }
                            }
                        }, 3000);
                        setTimeout(() => {
                            if (document.cookie.indexOf('devicePassword') === -1) {
                                this.openDevicePasswordInstance();
                            } else {
                                if (!this.$func.getCookie(`devicePassword-${pkg.version}`)) {
                                    this.openDevicePasswordInstance();
                                }
                            }
                        }, 3100);
                    });
                    store.commit('devHis', false);
                }
            },

            initAllProjects () {
                let params = {
                    provinceId: this.provinceId ? this.provinceId : '',
                    cityId: this.cityId ? this.cityId : '',
                    countyId: this.countyId ? this.countyId : ''
                };
                loadAllProject(params).then((res) => {
                    store.commit('allProjects', res);
                });
            },

            getGlobalAlarmSound () {
                globalAlarmSound().then((res) => {
                    if (res.success) {
                        this.AlarmSoundList = res.data;
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            initMap () {
                loadMetaData().then((res) => {
                    res.data.industryTypes.forEach((item) => {
                        this.industryTypesData.push({
                            code: item.code,
                            imgSrc: require('../../assets/images/code-single.png'),
                            name: item.name
                        });
                    });
                });
            },
            openNotifyInstance () {
                let _that = this;
                let newData = [];
                const h = this.$createElement;
                versionHistory.current.content.forEach((item) =>
                    newData.push(h('p', null, item))
                );
                this.notifyInstance = this.$Notice.open({
                    title: versionHistory.current.version_no,
                    top: 5,
                    duration: 20,
                    dangerouslyUseHTMLString: true,
                    onClose: function () {
                        if (_that.notifyValue) {
                            _that.$func.setCookie(`notify-${pkg.version}`, _that.notifyValue);
                        }
                    },
                    render: (h) => {
                        return h('div', [
                            [
                                h(
                                    'div',
                                    {
                                        class: 'd-alm-content d-alm-content-show',
                                        style: 'width: 280px;color: #fff;'
                                    },
                                    newData
                                ),
                                h('div', { style: 'color: #fff;margin-top:10px;display:flex' }, [
                                    [
                                        h(
                                            'div',
                                            {
                                                style: 'color: #fff;',
                                                on: {
                                                    click: (e) => {
                                                        this.changeCheckbox(e);
                                                    }
                                                }
                                            },
                                            [
                                                h('Checkbox'),
                                                h(
                                                    'span',
                                                    {
                                                        style: 'color: #fff;'
                                                    },
                                                    '不再提醒'
                                                )
                                            ]
                                        )
                                    ],
                                    h(
                                        'button',
                                        {
                                            class: 'notifyMore',
                                            on: { click: this.clickBtn }
                                        },
                                        '显示更多'
                                    )
                                ])
                            ]
                        ]);
                    }
                });
            },
            openDevicePasswordInstance () {
                let _that = this;
                let newData = [];
                const H = this.$createElement;
                newData.push(
                    H('div', { class: 'fs-20 tc' }, '注意修改设备初始密码哦~'),
                    H(
                        'div',
                        {
                            class: 'fs-12 tc',
                            style: 'color: #007EFF;font-weight: 700;margin-top:10px;'
                        },
                        '进入设备归属项目>综合管理>批量配置'
                    )
                );
                this.DevicePasswordInstance = this.$Notice.open({
                    title: '提示',
                    top: 5,
                    duration: 20,
                    dangerouslyUseHTMLString: true,
                    onClose: function () {
                        if (_that.devicePasswordValue) {
                            _that.$func.setCookie(
                                `devicePassword-${pkg.version}`,
                                _that.devicePasswordValue
                            );
                        }
                    },
                    render: (H) => {
                        return H(
                            'div',
                            {
                                style: 'padding-top: 10px;height: 90px;color: #fff;'
                            },
                            [
                                H(
                                    'div',
                                    {
                                        class: 'd-alm-content',
                                        style: 'height: 70px;width: 280px;color: #fff;'
                                    },
                                    newData
                                ),
                                H('div', { style: 'color: #fff;' }, [
                                    H(
                                        'div',

                                        {
                                            style: 'color: #fff;',
                                            on: {
                                                click: (e) => {
                                                    this.changeCheckbox1(e);
                                                }
                                            }
                                        },
                                        [
                                            H('Checkbox'),
                                            H(
                                                'span',
                                                {
                                                    style: 'color: #fff;'
                                                },
                                                '不再提醒'
                                            )
                                        ]
                                    )
                                ])
                            ]
                        );
                    }
                });
            },
            clickBtn () {
                this.NotifyVisible = true;
            },
            changeCheckbox (e) {
                this.notifyValue = e;
            },
            changeCheckbox1 (e) {
                this.devicePasswordValue = e;
            },
            loadAllProject () {
                let params = {
                    provinceId: this.provinceId ? this.provinceId : '',
                    cityId: this.cityId ? this.cityId : '',
                    countyId: this.countyId ? this.countyId : ''
                };
                loadAllProject(params).then((res) => {
                    store.commit('allProjects', res);
                    this.localDatas = [];
                    res.data.forEach((item, index) => {
                        let latitude = Number(item.latitude.toFixed(2));
                        let longitude = Number(item.longitude.toFixed(2));
                        this.localDatas.push({
                            type: true,
                            number: 0,
                            numberWarn: 0,
                            code: item.projectCode,
                            name: item.projectName
                        });
                        this.projectsOption.push({
                            industryCode: item.industryCode,
                            degree: [longitude, latitude],
                            projectCode: item.projectCode,
                            projectName: item.projectName,
                            localtion: item.provinceName + item.cityName + item.countyName
                        });
                    });
                    this.mapPointData = res.data;
                });
            },
            showDetail (projectCode) {
                // 展示 弹窗
                let data = {};
                this.mapPointData.forEach((item, index) => {
                    if (projectCode === item.projectCode) {
                        data = {
                            code: item.projectCode,
                            name: item.projectName,
                            tude: this.$func.BD09_To_GCJ02(item.longitude, item.latitude)
                        };
                    }
                });

                this.map(data);
                this.dialogVisible = true;
                // 其他逻辑
            },
            map (data) {
                let opts = {
                    width: 205,
                    height: 90,
                    title: ''
                };
                let map = new window.BMapGL.Map('contain'); // 创建Map实例
                setTimeout(() => {
                    var point = new window.BMapGL.Point(data.tude.lat, data.tude.lng);

                    map.centerAndZoom(point, 15);
                }, 500);

                // 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
                map.setMapStyleV2({
                    styleId: '7ed66a1c1ac261f21388ced59d8bbcd3'
                });
                // 创建图标
                let myIcon = new window.BMapGL.Icon(
                    myIcon2,
                    new window.BMapGL.Size(15, 31)
                );
                // 创建Marker标注，使用图标
                let pt = new window.BMapGL.Point(data.tude.lat, data.tude.lng);
                let marker = new window.BMapGL.Marker(pt, {
                    icon: myIcon
                });
                // 将标注添加到地图
                map.addOverlay(marker);
                map.panBy(700, 300); // 中心标点偏移量
                function onmarkerClick (e) {
                    let point = new window.BMapGL.Point(data.tude.lat, data.tude.lng);
                    _content =
                        '<div class="project-infoWindow"><h3 class="txt">' +
                        data.name +
                        '</h3></div>' + '<a href="javascript:;" onclick="openPrjAction(' +
                        "'" +
                        data.name +
                        "'" +
                        ', ' +
                        "'" +
                        data.code +
                        "'" +
                        ')" class="goWarn">' +
                        '进入项目' +
                        '</a>';
                    let infoWindow = new window.BMapGL.InfoWindow(_content, opts);
                    map.openInfoWindow(infoWindow, point);
                }
                let _content = '';
                onmarkerClick();
                // marker.addEventListener('click', onmarkerClick)
            },
            handleSelect (item) {
                var path = '/console/project'
                store.commit('overviewMac', '')
                this.$func.switchToProject(item, path)
            },

            handleAlarmClose () {
                this.localData = [];
                this.dialogAlarmVisible = false;
            },
            getsocketData (e) {
                this.wsData = JSON.parse(e && e.detail.data);
                if (!this.wsData.data) return false;
                this.audioKey = '';
                this.audioFlag = false;
                store.commit('innerMessage', true);
                this.wsData.data.dataList.map((item) => {
                    this.localDatas.map((itm) => {
                        if (item.projectCode.indexOf(itm.code) > -1) {
                            this.localData.push({ code: itm.code, name: itm.name });
                        }
                    });
                });

                this.socketStatsNumber(this.wsData);
            },

            showAlarmTip () {
                this.audioFlag = true;
                this.dialogAlarmVisible = true;
            },
            statisticalNumber () {
                store.commit('statisticsFlag', false);
                this.$nextTick(function () {
                    let params = {
                        provinceId: this.provinceId ? this.provinceId : '',
                        cityId: this.cityId ? this.cityId : '',
                        countyId: this.countyId ? this.countyId : ''
                    };
                    statisticalNumber(params)
                        .then((res) => {
                            if (res.success) {
                                store.commit('totalAlarm', res.data.totalAlarm);
                                store.commit('totalMac', res.data.totalMac);
                                store.commit('totalOnline', res.data.totalOnline);
                                store.commit('allTotalAlarm', res.data.allTotalAlarm);
                                store.commit('totalProject', res.data.totalProject);
                                store.commit('totalWarn', res.data.totalWarn);
                                store.commit('totalAddr', res.data.totalAddr);
                                store.commit('totalOnlineAddr', res.data.totalOnlineAddr);
                            } else if (res.code === '-1') {
                            } else {
                                store.commit('totalAlarm', 0);
                                store.commit('totalMac', 0);
                                store.commit('totalOnline', 0);
                                store.commit('totalProject', 0);
                                store.commit('totalWarn', 0);
                                store.commit('allTotalAlarm', 0);
                                store.commit('totalAddr', 0);
                                store.commit('totalOnlineAddr', 0);
                                this.$Message.error({
                                    content: res.message
                                });
                            }
                        })
                        .finally(() => {
                            store.commit('statisticsFlag', true);
                    });
                });
            },
            socketStatsNumber (wsData) {
                let Mpauto = wsData.data.dataList[0].lastTypeNumber + '';
                this.musicStr = this.AlarmSoundList[Mpauto];
                this.$nextTick(() => {
                    if (wsData.data.dataList.length > 0) {
                        this.gainType = 2;
                        let curTxt = [];
                        let types = [];
                        if (wsData.data.dataList[0] && wsData.data.dataList.length > 0) {
                            this.showAlarmTip();
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
            handleAlarm (code, name) {
                this.audioFlag = false;
                this.dialogAlarmVisible = false;
                this.localDatas = [];
                let params = {
                    projectCode: code
                };
                switchHover(params).then((res) => {
                    if (res.success) {
                        store.commit('projectName', name);
                        store.commit('projectCode', code);
                        this.$router.push({ path: '/console/project' });
                        if (this.$parent.md !== 17) {
                            this.$emit('handleFullScreen');
                        }
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            }
        },
        watch: {},
        beforeDestroy () {
            window.removeEventListener('onmessageWS', this.getsocketData);
        }
    };
</script>

<style lang="less" scoped>
#visualScreen {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/chinaBG.png');
  position: relative;
  overflow: hidden;
  .echarts_map {
    top: -33vh;
    z-index: 1;
  }
  .layout_header {
    position: absolute;
    top: 0;
    background-color: transparent;
    z-index: 10;
    width: 100%;
  }
  .layout_content_left {
    position: absolute;
    box-sizing: border-box;
    top: 60px;
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 12px;
    background-color: transparent;
    height: 65%;
    z-index: 10;
  }
  .layout_content_middle {
    position: absolute;
    box-sizing: border-box;
    top: 60px;
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 20px;
    background-color: transparent;
    width: 100%;
    height: 13%;
    z-index: 7;
    display: flex;
    justify-content: center;
  }
  .layout_content_middleSec {
    position: absolute;
    box-sizing: border-box;
    background-color: transparent;
    width: 100%;
    height: 10%;
    z-index: 9;
    display: flex;
    align-items: center;
  }
  .layout_content_right {
    position: absolute;
    box-sizing: border-box;
    right: 0;
    top: 60px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 12px;
    background-color: transparent;
    height: 65%;
    z-index: 7;
  }
  .layout_content_bottom {
    position: absolute;
    box-sizing: border-box;
    left: 0;
    bottom: 0;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    background-color: transparent;
    width: 100%;
    height: 30%;
    z-index: 10;
  }
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    #contain {
      width: 100%;
      height: 415px;
      margin: 0;
      font-family: '微软雅黑';
    }
  }
  /deep/.project-infoWindow {

    &::after {
      content: '';
      width: 0;
      height: 0;
      border-top: 8px solid rgba(96, 100, 112, 0.9);
      border-bottom: 0;
      border-right: 8px solid rgba(96, 100, 112, 0);
      border-left: 8px solid rgba(96, 100, 112, 0);
      position: absolute;
      bottom: -23px;
      left: 41%;
      transform: translateX(-41%);
      -ms-transform: translateX(-41%);
    }
    h3 {
      text-align: center;
      color: #fff;
      font-size: 14px;
    //   white-space: nowrap;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    }
    .goWarn {
      display: block;
      width: 100%;
      height: 24px;
      text-align: center;
      line-height: 24px;
      border-radius: 3px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      background-color: #6193f2;
      text-decoration: none;
    }
  }
}
/deep/.BMap_bubble_content {
//   overflow: visible !important;
//   word-wrap: break-word;
//   word-break: break-all;
 white-space: nowrap;
  text-align: center;
  overflow: hidden !important;
}
/deep/.BMap_bubble_pop {
  border: 1px solid transparent !important;
  background: url('.././../assets/images/maptk.png');
  background-color: transparent !important;
  background-size: 100% 101%;
overflow: hidden;
  .project-infoWindow {
    color: #fff;
     .txt {
      display: inline-block;
      width: 100%;
      animation: 5s wordsLoop linear infinite normal;

    }
    @keyframes wordsLoop {
      0% {
        transform: translateX(0px);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  }
  img {
    width: 0 !important;
  }
}

@media only screen and (max-width: 1024px) {
  .layout_content_left,
  .layout_content_right {
    width: 25%;
  }
}
@media only screen and (min-width: 1024px) {
  .layout_content_left,
  .layout_content_right {
    width: 25%;
  }
  .layout_content_middleSec {
    top: 55%;
  }
}
@media only screen and (min-width: 1366px) {
  .layout_content_left,
  .layout_content_right {
    width: 23%;
  }
  .layout_content_middleSec {
    top: 60%;
  }
}
@media only screen and (min-width: 1920px) {
  .layout_content_left,
  .layout_content_right {
    width: 20%;
  }
  .layout_content_middleSec {
    top: 62%;
  }
}
</style>
