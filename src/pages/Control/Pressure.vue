<template>
  <div id="pressure">
    <div class="header">
      <Button class="btn" @click.native="handleConfiguration">
        <span>
          <i class="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"></i>
        </span>
        </Button>
    </div>
    <Col
      style="margin-top: 30px"
      :span="24"
      class="attention"
      v-show="alarmName !== ''"
      >报警状态:<span class="c-danger">{{ alarmName }}</span>
      (请注意!!
      对没有进行报警状态复位的的监控设备,系统将不再对同一报警回路进行预警,直至手动复位.请及时指派专人对电力线路进行巡检并复位监控设备!)
    </Col>
    <Col class="box-wrap">
      <Row>
        <Col
          :span="12"
          @click.native="handleSwitch(datas, 'f')"
          class="pointer grid-content grid-content-open"
          :class="datas['f-alarmInfo'] ? 'grid-content-close' : ''"
        >
          <span>
            <p style="margin-top: 10px">
              {{ '压力: ' + (datas!== undefined ? datas.F + datas['f-Unit'] : '--') }}
            </p>
            <p style="margin-top: 10px">
              {{ '上限：' + (datas!== undefined ? datas.FH + datas['f-Unit'] : '--') }}
            </p>
            <p style="margin-top: 10px">
              {{ '下限：' + (datas!== undefined ? datas.FL + datas['f-Unit'] : '--') }}
            </p>
          </span>
        </Col>
        <Col
          @click.native="handleSwitch(datas, 't')"
          class="pointer grid-content grid-content-open"
          :class="datas['t-alarmInfo'] ? 'grid-content-close' : ''"
        >
          <span>
            <p style="margin-top: 10px">
              {{ '温度：' + (datas!== undefined ? datas.T + datas['t-Unit'] : '--') }}
            </p>
            <p style="margin-top: 10px">
              {{ '上限：' + (datas!== undefined ? datas.TH + datas['t-Unit'] : '--') }}
            </p>
            <p style="margin-top: 10px">
              {{ '下限：' + (datas!== undefined ? datas.TL + datas['t-Unit'] : '--') }}
            </p>
          </span>
        </Col>
      </Row>
    </Col>
    <Modal
      title="设备参数调整"
      custom-class="details-dialog"
      :mask="false"
      width="1323px"
      height="700px"
      v-model="equipmentFlag"
      footer-hide
      @on-cancel="handleEquipmentClose"
    >
      <!-- <Scroll style="height: 100%"> -->
      <HydrologicalConfiguration
        v-if="equipmentFlag"
         :equipmentNum = 5
      ></HydrologicalConfiguration>
      <!-- </Scroll> -->
    </Modal>
  </div>
</template>
<script>
/* global  */
    import store from '@/store';
    import HydrologicalConfiguration from './HydrologicalConfiguration.vue';
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
                datas: [],
                type: 'f',
                equipmentFlag: false,
                timerID: null
            };
        },
        created () {
            this.init();
        },
        activated () {
            this.queryNorChannel();
            // this.setTimer(

            //     // config.pollingInterval.queryTlinkChannelByMac * 1000
            // );
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
                                store.commit('pressureObj', this.datas);
                                this.$set(this.$store.state.pressureObj, 'type', this.type);
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
                this.$set(this.$store.state.pressureObj, 'type', type);
                store.commit('pressureObj', item);
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

.box {
  padding-left: 17px;
  width: 292px;
  height: 191px;
  margin-right: 20px;
  margin-bottom: 20px;
}

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

.box-wrap {
  width: 958px;
  overflow: hidden;
}

.box-right {
  margin: 0 20.5px;
  display: inline-block;
  .grid-content {
    -webkit-border-radius: 5.85px;
    -moz-border-radius: 5.85px;
    border-radius: 5.85px;
  }

  i {
    padding-left: 50px;
    display: inline-block;
    line-height: 183.4px;
    font-size: 80px;
    vertical-align: middle;
  }
}

.not-allowed {
  cursor: not-allowed;
  color: #999;
  .iconfont {
    cursor: not-allowed;
  }
}

#pressure .details-dialog {
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
}
</style>
