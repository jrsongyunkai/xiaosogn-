<template>
  <div id="IlluminanceSensing">
    <div class="header" style="justify-content: end;">
      <Col
        ><Select
          v-model="formInline.line"
          @on-change="handleNodeName"
          style="width: 135px"
          :clearable ="false"
          placeholder="请选择"
        >
          <Option
            v-for="item in options"
            :key="item.nodeId"
            :label="item.nodeName"
            :value="item.nodeId"
          >
          </Option> </Select
      ></Col>
      <Button class="btn" @click.native="handleParameter">
        <span>
          <i class="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"></i>
        </span>
        </Button>

    </div>
    <Col v-if="list.tem">
      <p class="content">
        {{ '光照度：' + (list.tem[0] ? list.tem[0] + 'Lux' : '--Lux') }}
      </p>
      <p class="content">
        {{ '上限：' + (list.tem[1] ? list.tem[1] + 'Lux' : '-- Lux') }}
      </p>
      <p class="content">
        {{ '下限：' + (list.tem[2] ? list.tem[2] + 'Lux' : '-- Lux') }}
      </p>
    </Col>
    <Modal
      title="设备参数调整"
      custom-class="details-dialog"
      :mask="false"
      width="1323px"
      v-model="equipmentFlag"
      @on-cancel="handleEquipmentClose"
    >
      <!-- <Scroll style="height: 100%"> -->
        <TemperatureHumidityConfiguration
          v-if="equipmentFlag"
          :online="online"
          :equipmentNum="param.equipmentType"
        ></TemperatureHumidityConfiguration>
      <!-- </Scroll> -->
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
                list: {}
            };
        },
        created () {},
        mounted () {
            this.init();
            this.$nextTick(function () {
                this.queryFindByMacAndNode();
                // config.pollingInterval.findByMacAndNode * 1000
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
                        if (res.code === '0') {
                            if (res.datas.length > 0) {
                                this.formInline.line = res.datas[0].nodeName;
                                this.options = res.datas;
                                let val = res.datas[0].nodeId;
                                store.commit('nodeId', res.datas[0].nodeId);
                                this.handleNodeName(val);
                            }
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
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
                            store.commit('nodeId', val);
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    })
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
.box {
  padding-left: 17px;
  width: 292px;
  height: 191px;
  margin-right: 20px;
  margin-bottom: 20px;
}

.content{
  margin: 13px;
  padding: 13px;
}
.primary-icon {
  font-size: 42px;
  text-align: center;
}

.primary-title {
  margin: 0 0 5px;
}

.box-wrap {
  width: 958px;
  overflow: hidden;
}

.box-right {
  margin: 0 20.5px;
  display: inline-block;
  .grid-content {
    width: 908px;
    height: 183.4px;
    -webkit-border-radius: 5.85px;
    -moz-border-radius: 5.85px;
    border-radius: 5.85px;
  }
}

#IlluminanceSensing .details-dialog {
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
}
</style>
