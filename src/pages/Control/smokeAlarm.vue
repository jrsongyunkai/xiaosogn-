<template>
  <div id="smokeAlarm">
    <div class="header">
      <Row>
        <!-- <Col :span="4"
          ><Icon
            custom="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"
            size="20"
        /></Col> -->
      </Row>
    </div>
    <Row>
      <Col :span="24" class="attention" v-show="alarmName !== ''"
        >报警状态：<span class="c-danger">{{ alarmName }}</span
        >{{
          '请注意!! 设备探测到可能发生' +
          alarmName +
          ',' +
          '请及时指派专人进行巡检!'
        }}</Col
      >
      <!-- <Col  class="border-botom:1px  solid">
        <Col class="tc primary-wrap">
          <Icon
            custom="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"
            size="20"
          />
        </Col>
      </Col> -->

      <Row class="box-wrap">
            <Col :span="12" class="pointer grid-content grid-content-open">
              <span>
                {{ '信号强度：' + (signal ? signal + '%' : '-- %') }}
              </span>
            </Col>
            <Col class="pointer grid-content grid-content-open" v-if="
              Object.prototype.toString.call(voltage) !== '[object Undefined]'
            ">
              <!-- <span style="padding-bottom: 20px"
                ><img src="../../assets/images/voltage.png" alt="Mantunsci"
              /></span> -->

              <span>
                <p>
                  {{
                    '电压(伏)：' +
                    (typeof voltage !== 'undefined' ? voltage + 'V' : '-- V')
                  }}
                </p>
              </span>
            </Col>
            <Col class="pointer grid-content grid-content-open"  v-if="
              Object.prototype.toString.call(concentration) !==
              '[object Undefined]'
            ">
              <span>
                {{
                  '浓度：' +
                  (typeof concentration !== 'undefined'
                    ? concentration > 0
                      ? concentration + '%'
                      : 0 + '%'
                    : '-- %')
                }}
              </span>
            </Col>
      </Row>
    </Row>
  </div>
</template>

<script>
/* global  */
    import store from '@/store';
    import { queryZacChannelMac } from '@/api/public';
    export default {
        props: {
            mac: {
                type: String
            }
        },
        data () {
            return {
                alarmName: '',
                datas: {},
                signal: '',
                voltage: '',
                concentration: ''
            };
        },
        created () {
            this.init();
        },
        activated () {
            this.queryChannelByMac();
            // this.setTimer(

            //     // config.pollingInterval.queryZacChnlHistory * 1000
            // );
        },
        deactivated () {
            clearTimeout(this.timerID);
        },
        methods: {
            init () {
                this.queryChannelByMac();
                // this.setTimer(
                //     this.queryChannelByMac
                //     // config.pollingInterval.queryZacChnlHistory * 1000
                // );
            },
            queryChannelByMac () {
                let params = {
                    mac: this.mac
                };
                queryZacChannelMac(params)
                    .then((res) => {
                        if (res.success) {
                            if (res.data) {
                                this.datas = res.data;
                                this.alarmName = this.datas.others.alarmName;
                                this.signal = this.datas.others.signal;
                                this.voltage = this.datas.others.voltage;
                                this.concentration = this.datas.others.concentration;
                                store.commit('smokeAlarmObj', this.datas);
                            } else {
                                store.commit('smokeAlarmObj', []);
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
                });
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
        }
    };
</script>

<style lang="less" scoped>
#smokeAlarm {
  margin-top: 15px;
}
.header {
  height: 22px;
  margin-top: 21px;
  border-bottom: 1px solid #5e626c;
}
.box {
  padding-left: 17px;
  width: 292px;
  height: 191px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.tc {
  margin-left: 50px;
}
.primary-wrap {
  margin-bottom: 25px;
  border: 1px solid #909399;
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
  margin-top: 30px;
}

.box-wrap {
  width: 958px;
  margin-top: 40px;
  overflow: hidden;
}

.box-right {
  margin: 0 20.5px;
  display: inline-block;
  .grid-content {
    width: 431px;
    height: 183.4px;
    -webkit-border-radius: 5.85px;
    -moz-border-radius: 5.85px;
    border-radius: 5.85px;
    border: 1px solid #fff;
  }

  img {
    padding-left: 60px;
    padding-top: 45px;
    float: left;
    vertical-align: middle;
  }

  i {
    padding-left: 60px;
    padding-top: 45px;
    float: left;
    font-size: 80px;
    vertical-align: middle;
  }

  span {
    vertical-align: middle;
    font-size: 22px;
    float: left;
    line-height: 140px;
    margin-left: 40px;
  }

  .grid-content-open {
    border: 1px solid #fff;
  }

  .grid-content-unavailable {
    border: 1px solid #999;
    color: #999;
  }
}
</style>
