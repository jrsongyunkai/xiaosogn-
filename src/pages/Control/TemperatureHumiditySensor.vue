<template>
  <div id="TemperatureHumiditySensor" >
    <div class="Temperature-header">
      <Row>
        <div class="fr">
          <Col >
          <Select
              v-model="formInline.line"
              @on-change="handleNodeName"
              style="width: 135px"
              :clearable ="false"
              popper-class="auto-complete"
              placeholder="请选择"
            >
              <Option
                v-for="item in options"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              >
              </Option> </Select
          >
        </Col>
        <Col @click.native="handleParameter">
          <Icon
            color="#0372e5"
            style="
              border: 1px solid;
              padding: 3px;
              padding-top:0px;
              border-radius: 5px;
              margin-left: 5px;
              width:42px;
              height:32px;
              line-height:32px
            "
            custom="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"
            size='20'
          />
        </Col>
        </div>

      </Row>
    </div>
    <!-- <Row style="margin-top:30px">
      <Col :span="12">
        <span class="tc" v-if="list.tem">
          <p>温度： {{ list.tem[0] ? list.tem[0] + '℃' : '-- ℃' }}</p>
          <p>
            {{ '上限：' + (list.tem[1] ? list.tem[1] + '℃' : '-- ℃') }}
          </p>
          <p>
            {{ '下限：' + (list.tem[2] ? list.tem[2] + '℃' : '-- ℃') }}
          </p>
        </span>
      </Col>
      <Col>
        <p v-if="list.hum">
         湿度： {{ list.hum[0] ? list.hum[0] + '%RH' : '-- %RH' }}
        </p>
        <p v-if="list.hum">
          {{ '上限：：' + (list.hum[1] ? list.hum[1] + '%RH' : '-- %RH') }}
        </p>
        <p v-if="list.hum">
          {{ '下限：' + (list.hum[2] ? list.hum[2] + '%RH' : '-- %RH') }}
        </p>
      </Col>
    </Row> -->
    <Row class="rowheight" style="margin-top: 30px">
      <Col :span="12">
        <p v-if="list.tem">
          温度： {{ list.tem[0] ? list.tem[0] + '℃' : '-- ℃' || '-- ℃' }}
        </p>
      </Col>
      <Col :span="12">
        <p v-if="list.hum">
          湿度： {{ list.hum[0] ? list.hum[0] + '%RH' : '-- %RH' }}
        </p></Col
      >
    </Row>
    <Row class="rowheight">
      <Col :span="12">
        <p v-if="list.tem">
          {{ '上限：' + (list.tem[1] ? list.tem[1] + '℃' : '-- ℃') }}
        </p></Col
      >
      <Col :span="12">
        <p v-if="list.hum">
          {{ '上限：：' + (list.hum[1] ? list.hum[1] + '%RH' : '-- %RH') }}
        </p></Col
      >
    </Row>
    <Row class="rowheight">
      <Col :span="12"
        ><p v-if="list.tem">
          {{ '下限：' + (list.tem[2] ? list.tem[2] + '℃' : '-- ℃') }}
        </p></Col
      >
      <Col :span="12">
        <p v-if="list.hum">
          {{ '下限：' + (list.hum[2] ? list.hum[2] + '%RH' : '-- %RH') }}
        </p></Col
      >
    </Row>
    <Modal
      title="设备参数调整"
      custom-class="details-dialog"
      :mask="false"
      width="1323px"
      footer-hide
      v-model="equipmentFlag"
      @on-cancel="handleEquipmentClose"
    >
      <TemperatureHumidityConfiguration
        v-if="equipmentFlag"
        :online="online"
        :equipmentNum="param.equipmentType"
      ></TemperatureHumidityConfiguration>
    </Modal>
  </div>
</template>

<script>
/* global  */
    import store from '@/store';
    import TemperatureHumidityConfiguration from './TemperatureHumidityConfiguration';
    import { getEffectAddr, findByMacAndNode } from '@/api/public';
    export default {
        props: {
            param: {
                type: Object
            },
            online: {
                type: Number
            }
        },
        components: {
            TemperatureHumidityConfiguration
        },
        data () {
            return {
                equipmentFlag: false,
                formInline: {
                    line: ''
                },
                options: {},
                list: {
                    hum: '',
                    tem: ''
                }
            };
        },
        created () {},
        mounted () {
            this.init();
            this.$nextTick(function () {
                // this.setTimer(
                this.queryFindByMacAndNode();
                // config.pollingInterval.findByMacAndNode * 1000
                //  );
            });
        },
        methods: {
            init () {
                this.getAddr();
            },
            getAddr () {
                let params = {
                    mac: this.param.mac
                };
                getEffectAddr(params)
                    .then((res) => {
                        if (res.success) {
                            //
                            this.formInline.line = res.datas[0].nodeName;
                            this.options = res.datas;
                            let val = res.datas[0].nodeId;
                            store.commit('nodeId', res.datas[0].nodeId);
                            this.handleNodeName(val);
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            // this.$Message.error({
                            //     content: '未知错误,请刷新重试'
                            // });
                        }
                });
            },
            handleNodeName (val) {
                let params = {
                    mac: this.param.mac,
                    nodeId: val
                };
                findByMacAndNode(params)
                    .then((res) => {
                        if (res.success) {
                            this.list = res.data;
                            // res.data.map((item) => {
                            //     if (item === 'hum') {
                            //         this.list.hum = item;
                            //     } else {
                            //         this.list.tem = item;
                            //     }
                            // });
                            store.commit('nodeId', val);
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            // this.$Message.error({
                            //     content: '未知错误,请刷新重试'
                            // });
                        }
                });
            },
            queryFindByMacAndNode () {
                let params = {
                    mac: this.param.mac,
                    nodeId: this.$store.state.nodeId
                };
                findByMacAndNode(params)
                    .then((res) => {
                        if (res.success) {
                            this.list = res.data;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            // this.$Message.error({
                            //     content: '未知错误,请刷新重试'
                            // });
                        }
                });
            },
            handleParameter () {
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
        watch: {},
        destroyed () {
            clearTimeout(this.timerID);
        }
    };
</script>

<style lang="less" scoped>
.Temperature-header {
  height: 43px;
  border-bottom: 1px solid #5e626c;
}
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
  // margin: 0 20.5px;
  // display: inline-block;
  // .grid-content {
  //   width: 431px;
  //   height: 183.4px;
  //   -webkit-border-radius: 5.85px;
  //   -moz-border-radius: 5.85px;
  //   border-radius: 5.85px;
  //   border: 1px solid #fff;
  // }

  span {
    vertical-align: middle;
    font-size: 22px;
    display: inline-block;
    width: calc(100% - 194px);
  }

  .zh-span {
    padding-left: 59px;
  }

  .en-span {
    padding-left: 30px;
  }

  .grid-content-unavailable {
    border: 1px solid #999;
    color: #999;
  }

  .grid-content-open {
    border: 1px solid #fff;
  }
}

.custom-input {
  .el-input__inner {
    margin-top: -6px;
    background-color: #0c1e32;
    color: #fff;
    font-size: 14px;
    text-align: center;
    border: none;
  }
}

.custom-input {
  .el-input--mini .el-input__icon {
    line-height: 22px;
  }
}
.rowheight {
  height: 50px;
}
#TemperatureHumiditySensor .details-dialog {
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
}
.fr{
  width: 100%;
  display: flex;
  justify-content:flex-end;
}
</style>
