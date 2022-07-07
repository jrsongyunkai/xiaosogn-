<template>
  <div id="stralsund" >
    <div class="header">
      <Col
        class="tc"
        :class="orderFlag ? 'not-allowed' : ''"
        @click.native="handleReset"
      >
        <Button class="btn">
        <span>
          <i class="icon-v5 icon-v5-qingchu"></i>
        </span>
        </Button>
      </Col>
      <Col
        class="tc"
        :class="orderFlag ? 'not-allowed' : ''"
        @click.native="handleTrip"
      >
       <Button class="btn">
        <span>
          <i class="icon-v5 icon-v5-guanlianduankai"></i>
        </span>
        </Button>

      </Col>
      <Col
        class="tc"
        :class="orderFlag ? 'not-allowed' : ''"
        @click.native="handleQuery"
      >
      <Button class="btn">
        <span>
          <i class="icon-v5 icon-v5-chaxun"></i>
        </span>
        </Button>

      </Col>
      <Col class="tc" @click.native="handleConfiguration">
      <Button class="btn">
        <span>
          <i class="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"></i>
        </span>
        </Button>

      </Col>
    </div>
    <Row>
      <Col :span="24" class="attention" v-show="alarmName !== ''"
        >报警状态:<span class="c-danger">{{ alarmName }}</span
        >请注意!!
        对没有进行报警状态复位的的监控设备,系统将不再对同一报警回路进行预警,直至手动复位.请及时指派专人对电力线路进行巡检并复位监控设备!
      </Col>
      <Col class="box-wrap" style="margin-top: 30px">
        <Row>
          <span
            style="margin-bottom: 10px"
            v-for="(item, index) in datas"
            :key="index"
            class="box-right"
            @click="handleSwitch(item, index)"
          >
            <Col
              @click="handleSwitch(item, index)"
              class="pointer"
              :class="
                item.alarmValue === 0
                  ? 'grid-content grid-content-open'
                  : 'grid-content grid-content-close'
              "
            >
              <!-- <i
                v-show="item.loopType === 0"
                class="icon-v5 icon-v5-yangan"
              ></i>
              <i
                v-show="item.loopType === 1"
                class="icon-v5 icon-v5-dianya"
              ></i>
              <i
                v-show="item.loopType === 2"
                class="icon-v5 icon-v5-shandian"
              ></i>
              <i v-show="item.loopType === 4" class="icon-v5 icon-v5-wendu"></i>
              <i v-show="item.loopType === 8" class="icon-v5 icon-v5-AApay"></i> -->
              <!-- <i
                v-show="item.loopType === 17"
                class="icon-v5 icon-v5-yangan"
              ></i>
              <i
                v-show="item.loopType === 18"
                class="icon-v5 icon-v5-yangan"
              ></i>
              <i
                v-show="item.loopType === 40"
                class="icon-v5 icon-v5-yangan"
              ></i>
              <i
                v-show="item.loopType === 41"
                class="icon-v5 icon-v5-yangan"
              ></i> -->
              <span
                :class="
                  item.loopType === 32 ||
                  item.loopType === 33 ||
                  item.loopType === 34 ||
                  item.loopType === 35
                    ? 'empty'
                    : ''
                "
              >
                <span
                  v-show="item.loopType === 0"
                  :title="'烟雾' + '回路:' + item.loopAddr"
                >
                  {{ '烟雾' + '回路' + item.loopAddr }}：
                </span>
                <span
                  v-show="item.loopType === 1"
                  :title="'电压' + '回路' + item.loopAddr"
                >
                  {{ '电压' + '回路' + item.loopAddr }}：
                </span>
                <span v-show="item.loopType === 2">
                  {{ '漏电' + '回路' + item.loopAddr }}：
                </span>
                <span
                  v-show="item.loopType === 8"
                  :title="'电流' + '回路' + item.loopAddr"
                >
                  {{ '电流' + '回路' + item.loopAddr }}：
                </span>
                <span
                  v-show="item.loopType === 4"
                  :title="'温度' + '回路' + item.loopAddr"
                >
                  {{ '温度' + '回路' + item.loopAddr }}：
                </span>
                <span
                  v-show="item.loopType === 17"
                  :title="'压力' + '回路' + item.loopAddr"
                >
                  {{ '压力' + '回路' + item.loopAddr }}：
                </span>
                <span
                  v-show="item.loopType === 18"
                  :title="'液位' + '回路' + item.loopAddr"
                >
                  {{ '液位' + '回路' + item.loopAddr }}：
                </span>
                <span v-show="item.loopType === 32" :title="'额定电流'">
                  额定电流：
                </span>
                <span v-show="item.loopType === 33" :title="'电度'"
                  >电度：</span
                >
                <span v-show="item.loopType === 34" :title="'有功功率'">
                  有功功率：
                </span>
                <span v-show="item.loopType === 35" :title="'功率因数'">
                  功率因数：
                </span>
                <span
                  v-show="item.loopType === 40"
                  :title="'电池' + '电量' + '回路' + item.loopAddr"
                >
                  {{ '电池' + '电量' + '回路' + item.loopAddr }}：
                </span>
                <span
                  v-show="item.loopType === 41"
                  :title="'信号' + '回路' + item.loopAddr"
                >
                  {{ '信号' + '回路' + item.loopAddr }}：
                </span>
                <span v-if="item.loopType === 0">
                  {{ item.alarmValue === 0 ? '正常' : '异常' }}
                </span>
                <span
                  v-else-if="
                    item.loopType === 32 ||
                    item.loopType === 33 ||
                    item.loopType === 34 ||
                    item.loopType === 35
                  "
                >
                  {{ item.detectValue + item.others.unit }}
                </span>
                <span v-else style="width: 50px">
                  {{
                    item.detectValue +
                    '/' +
                    item.tripUpperLimit +
                    item.others.unit
                  }}
                </span>
              </span>
            </Col>
          </span>
        </Row>
      </Col>
    </Row>

    <Modal title="设备参数调整" v-model="equipmentFlag" width="1323px">
      <StralsundConfiguration v-if="equipmentFlag"></StralsundConfiguration>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
    import store from '@/store/index';
    import StralsundConfiguration from './StralsundConfiguration';
    import {
        queryNorChannelByMac,
        strlStatusQuery,
        strlAlarmReset,
        strlTripOut
    } from '@/api/control';
    export default {
        props: {
            param: {
                type: Object
            }
        },
        data () {
            return {
                datas: [],
                alarmName: '',
                orderFlag: false,
                equipmentFlag: false,
                timer: '',
                timerID: null,
                index: 0
            };
        },
        created () {
            this.init();
        },
        activated () {
            // this.setTimer(this.queryNorChannel)
        },
        deactivated () {
            clearTimeout(this.timer);
            clearTimeout(this.timerID);
        },
        methods: {
            init () {
                this.queryNorChannel();
                // this.setTimer(this.queryNorChannel)
            },
            queryNorChannel () {
                let params = {
                    mac: this.param.mac
                };
                queryNorChannelByMac(params)
                    .then((res) => {
                        if (res.success) {
                            if (res.data.length > 0) {
                                this.datas = res.data;
                                if (res.data[this.index].others.alarmName) {
                                    this.alarmName = res.data[this.index].others.alarmName;
                                } else {
                                    this.alarmName = '';
                                }
                                store.commit('stralsundObj', res.data[this.index]);
                                store.commit('dateFlag', false);
                            } else {
                                store.commit('dateFlag', true);
                                store.commit('stralsundObj', []);
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
                    })
                    .finally(() => {});
            },
            handleSwitch (item, index) {
                this.index = index;
                if (item.others.alarmName) this.alarmName = item.others.alarmName;
                store.commit('stralsundObj', item);
            },
            handleReset () {
                if (this.orderFlag) return false;
                let params = {
                    mac: this.param.mac,
                    cmd: 'STRL_ALARM_RESET'
                };
                strlAlarmReset(params)
                    .then((res) => {
                        if (res.success) {
                            if (res.code === '0') {
                                this.$Message.success({
                                    content: '命令已提交，生效中..'
                                });
                                this.queryNorChannel();
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
                    })
                    .finally(() => {
                        this.orderFlag = true;
                        // this.liftRestrictions()
                });
            },
            handleQuery () {
                if (this.orderFlag) return false;
                let params = {
                    mac: this.param.mac,
                    cmd: 'STRL_STATUS_QUERY'
                };
                strlStatusQuery(params)
                    .then((res) => {
                        if (res.success) {
                            if (res.code === '0') {
                                this.$Message.success({
                                    content: '命令已提交，生效中..'
                                });
                                this.queryNorChannel();
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
                    })
                    .finally(() => {
                        this.orderFlag = true;
                        // this.liftRestrictions()
                });
            },
            handleTrip () {
                if (this.orderFlag) return false;
                let params = {
                    mac: this.param.mac,
                    cmd: 'STRL_TRIP_OUT'
                };
                this.$Modal.confirm({
                    content:
                        '警告！脱扣只针对特定设备且已安装脱口功能的设备,使用远程脱扣可能会导致用户造成经济和社会损失，包括直接停电损失,和间接停电损失。是否确定脱扣？',
                    onOk: () => {
                        strlTripOut(params)
                            .then((res) => {
                                if (res.success) {
                                    if (res.code === '0') {
                                        this.$Message.success({
                                            content: '命令已提交，生效中..'
                                        });
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
                            })
                            .finally(() => {
                                this.orderFlag = true;
                                // this.liftRestrictions()
                        });
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消'
                        });
                    }
                });
                return false;
            },
            handleConfiguration () {
                if (this.$store.state.stralsundObj.dataCategory === undefined) {
                    this.$Message.error({
                        content: '配置不可用'
                    });
                    return false;
                }
                store.commit('systemFlag', 'StralsundConfiguration');
                this.equipmentFlag = true;
            },
            handleEquipmentClose () {
                this.equipmentFlag = false;
            }
            // liftRestrictions () {
            //     this.timer = setTimeout(() => {
            //         this.orderFlag = false
            //     }, 5000)
            // },
            // setTimer (fn, delay) {
            //     let _this = this
            //     function timer () {
            //         _this.timerID = setTimeout(function () {
            //             timer()
            //             fn()
            //         }, delay)
            //     }
            //     timer()
            // }
        },
        destroyed () {
            // clearTimeout(this.timer)
            // clearTimeout(this.timerID)
        },
        components: {
            StralsundConfiguration
        }
    };
</script>
<style lang="less" scoped>
#stralsund {
  .primary-wrap {
    padding: 2px;
    border: 1px solid #fff;
    border-radius: 5px;
  }
  .header {
    height: 43px;
    border-bottom: 1px solid #5e626c;
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
  .box {
    padding-left: 17px;
    width: 292px;
    height: 282px;
    margin-right: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    .tc {
      .primary-icon {
        font-size: 42px;
        text-align: center;
      }
      .primary-title {
        margin: 0 0 5px;
      }
    }
  }
  .box-wrap {
    width: 958px;
    overflow: hidden;
    .grid-content {
      width: 194px;
    }
    .box-right {
      span {
        vertical-align: middle;
        margin-left: 16px;
        font-size: 16px;
        display: inline-block;
      }

      .empty {
        display: block !important;
        margin: 0 !important;
        padding-top: 10px;
        max-width: 100% !important;
        text-align: center;
      }
    }

    .box-right {
      &:nth-child(1) {
        margin-top: 0;
      }
      &:nth-child(2) {
        margin-top: 0;
      }
      &:nth-child(3) {
        margin-top: 0;
      }
      &:nth-child(4) {
        margin-top: 0;
      }
    }
  }
}
/deep/.ivu-modal-footer{
  border-color: transparent;
}
</style>
