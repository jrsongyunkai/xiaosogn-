<template>
  <div id="level">
    <div class="header">
      <Button class="btn" @click.native="handleConfiguration">
          <i class="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"></i>
        </Button>

    </div>
    <Col
      style="margin-top: 20px"
      :span="24"
      class="attention"
      v-show="alarmName !== ''"
      >报警状态<span class="c-danger">{{ alarmName }}</span>
      (请注意!!
      对没有进行报警状态复位的的监控设备,系统将不再对同一报警回路进行预警,直至手动复位.请及时指派专人对电力线路进行巡检并复位监控设备!)
    </Col>
    <Row style="margin-top: 20px">
      <Col
        :span="12"
        @click.native="handleSwitch(datas, 'f')"
        class=" "
        :class="datas['f-alarmInfo'] ? 'grid-content-close' : ''"
      >
        <Col>
          <div style="margin-top: 20px"></div>
          {{
            '液位: ' +
            (datas.F !== undefined ? datas.F + datas['f-Unit'] : '--')
          }}</Col
        >
        <Col>
          <div style="margin-top: 20px"></div>
          {{
            '上限: ' +
            (datas.F !== undefined ? datas.FH + datas['f-Unit'] : '--')
          }}
        </Col>
        <Col>
          <div style="margin-top: 20px"></div>
          {{
            '下限: ' +
            (datas.F !== undefined ? datas.FL + datas['f-Unit'] : '--')
          }}
        </Col>
      </Col>
      <Col @click.native="handleSwitch(datas, 't')">
        <Col>
          <div style="margin-top: 20px"></div>
          {{
            '温度: ' +
            (datas.T !== undefined ? datas.T + datas['t-Unit'] : '--')
          }}</Col
        >
        <Col>
          <div style="margin-top: 20px"></div>
          {{
            '上限: ' +
            (datas.T !== undefined ? datas.TH + datas['t-Unit'] : '--')
          }}</Col
        >
        <Col>
          <div style="margin-top: 20px"></div>
          {{
            '下限: ' +
            (datas.T !== undefined ? datas.TL + datas['t-Unit'] : '--')
          }}</Col
        >
      </Col>
    </Row>

    <Modal
      title="设备参数调整"
      custom-class="details-dialog"
      :mask="false"
      width="1323px"
      v-model="equipmentFlag"
      footer-hide
      @on-cancel="handleEquipmentClose"
    >
      <!-- <Scroll style="height: 100%"> -->
        <HydrologicalConfiguration
          v-if="equipmentFlag"
          :equipmentNum = 4
        ></HydrologicalConfiguration>
      <!-- </Scroll> -->
    </Modal>
  </div>
</template>
<script>
/* global  */
    import store from '@/store';
    import HydrologicalConfiguration from './HydrologicalConfiguration';
    import { queryTlinkChannelByMac } from '@/api/public';
    export default {
        props: {
            mac: {
                type: String
            }
        },
        data () {
            return {
                alarmName: '',
                equipmentFlag: false,
                datas: [],
                type: 'f',
                timerID: null
            };
        },
        created () {
            this.init();
        },
        activated () {
            this.queryNorChannel();
            // config.pollingInterval.queryTlinkChannelByMac * 1000
        },
        deactivated () {
            clearTimeout(this.timerID);
        },
        methods: {
            init () {
                this.queryNorChannel();
                // this.setTimer(
                //     this.queryNorChannel
                //     // config.pollingInterval.queryTlinkChannelByMac * 1000
                // );
            },
            queryNorChannel () {
                let params = {
                    mac: this.mac
                };
                queryTlinkChannelByMac(params)
                    .then((res) => {
                        if (res.success) {
                            if (JSON.stringify(res.data) !== '{}') {
                                this.datas = res.data;
                                if (res.data['f-alarmInfo'] !== '') {
                                    this.alarmName = res.data['f-alarmInfo'];
                                }
                                store.commit('levelObj', this.datas);
                                this.$set(this.$store.state.levelObj, 'type', this.type);
                                store.commit('dateFlag', false);
                            } else {
                                this.datas = {};
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
                                content: '未知错误,请刷新重试'
                            });
                        }
                    })
                    .finally(() => {});
            },
            handleSwitch (item, type) {
                if (!item.mac) return false;
                this.type = type;
                if (type === 't') {
                    this.alarmName = item['t-alarmInfo'];
                } else {
                    this.alarmName = item['f-alarmInfo'];
                }
                this.$set(this.$store.state.levelObj, 'type', type);
                store.commit('levelObj', item);
            },
            handleConfiguration () {
                this.equipmentFlag = true;
            },
            handleEquipmentClose () {
                this.equipmentFlag = false;
            },
            setTimer (fn, delay) {
                let _this = this;
                function timer () {
                    _this.timerID = setTimeout(function () {
                        timer();
                        fn();
                    }, delay);
                }
                timer();
            }
        },
        destroyed () {
            clearTimeout(this.timerID);
        },
        components: {
            HydrologicalConfiguration
        }
    };
</script>
<style lang="less" scoped>

.primary-wrap {
  width: 95.5px;
  margin-bottom: 25px;
  border: 1px solid #fff;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.primary-icon {
  font-size: 42px;
  text-align: center;
}

.primary-title {
  margin: 0 0 5px;
}

.attention {
  margin-bottom: 20px;
}

.grid-content {
  width: 431px;
  height: 183.4px;
  -webkit-border-radius: 5.85px;
  -moz-border-radius: 5.85px;
  border-radius: 5.85px;
}

span {
  vertical-align: middle;
  padding-left: 59px;
  font-size: 22px;
  display: inline-block;
  width: calc(100% - 194px);
}

.grid-content-open {
  border: 1px solid #fff;
}
.grid-content-close {
  border: 1px solid #f9482e;
  color: #f9482e;
}

.not-allowed {
  cursor: not-allowed;
  color: #999;
}

.iconfont {
  cursor: not-allowed;
}

#level .details-dialog {
  background-color: #0c1e32;
  position: absolute;
  top: 96px;
  left: 50%;
  margin-left: -661.5px;
  bottom: 0;
  margin-top: 0 !important;
  max-height: calc(100% - 116px);
  max-width: calc(100% - 20px);
  min-width: 1323px;
  display: flex;
  flex-direction: column;
  border: 1px solid #fff;
}

.el-dialog__title,
.el-dialog__headerbtn .el-dialog__close {
  color: #fff;
  font-size: 18px;
}

.el-dialog__header {
  padding: 14px 17px 0;
  height: 19px;
}

.el-dialog__body {
  color: #fff;
  padding: 0 17px;
  overflow: auto;
  overflow-y: hidden;
}

.el-dialog__headerbtn {
  top: 10px;
  right: 5px;
}
</style>
