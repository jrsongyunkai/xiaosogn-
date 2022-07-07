<template>
  <div >
    <Row :span="24">
      <Col :span="5">
      接线方式：
        <Select
          style="width: 150px"
          class="gatherAddr"
          transfer
          clearable
          v-model="row.gatherAddr"
          placeholder="接线方式"
          @on-change="handleWiring(row.nodeNo, row.gatherAddr)"
        >
          <Option :value="0">请选择</Option>
          <Option :value="-1">进线直连</Option>
          <Option v-for="n in 29" :key="n" :value="n">{{
            n - 1 === 0 ? '总路' : '线路' + (n - 1)
          }}</Option>
        </Select>
      </Col>
      <Col :span="3" style="margin-top:5px"
        ><span> 漏保档位: {{ row.leakageGear }} </span></Col
      >
      <Col :span="5">
      远程遥控：
        <span>
          <Select
            class="gatherAddr"
            style="width: 150px"
            transfer
            clearable
            v-model="enableControl"
            placeholder="远程遥控"
            @on-change="handleControl(row.nodeNo, enableControl)"
          >
            <Option :value="1">允许</Option>
            <Option :value="0">不允许</Option>
          </Select>
        </span></Col
      >

      <Col :span="4" class="enable" v-if="row.isEnableAlarm">
        <Button
          class="pointer button-style"
          @click="
            handleEnable(
              row.enableAlarm,
              'alarm',
              row._index,
              !row.enableAlarmShowHide
            )
          "
          >报警使能配置</Button
        >
      </Col>
      <Col :span="4" class="enable" v-if="row.isEnableTrip">
        <Button
        class="button-style"
          @click="
            handleEnable(row.enableTrip, 'trip', row._index, row.enableTripShowHide)
          "
          >脱扣使能配置</Button
        >
      </Col>
      <!-- <Col
        :span="24"
        class="mt-20"
        v-if="row.enableAlarmShowHide || row.enableTripShowHide"
      >
        <Enable
          @refresh-init="init"
          :enableBits="enableForm"
          :bits="bits"
          :param="{
            mac: adjustment.mac,
            nodeNo: row.nodeNo,
            cmd: row.enableAlarmShowHide
              ? 'SET_ENABLE_ALARM'
              : 'SET_ENABLE_TRIP'
          }"
        ></Enable>
      </Col> -->
    </Row>
    <Row
      style="margin-top:20px"
      v-show="ListShow"
    >
      <Col :span="24" style="border-top:1px solid #3d3d41;padding-top:10px">
        <Form ref="enableAlarmForm" :model="enableForm" >
          <FormItem label="使能位置设置：">
            <CheckboxGroup
              size="small"
              v-model="enableForm.enableBits"
              @on-change="handleCheckedBitsChange"
            >
            <template>

            </template>
              <Checkbox
                border
                v-for="(bit, index) in bits"
                :label="index + '-' + bit"
                :key="index"
                :disabled="bit === '保留'"
                :style="bit === '保留'? 'display:none' :''"
                >{{ bit }}</Checkbox
              >
            </CheckboxGroup>
          </FormItem>
          <FormItem>
            <Button
              size="small"
              type="primary"
              @click="
                submitForm(
                  adjustment.mac,
                  row.nodeNo,
                  row.enableAlarmShowHide
                    ? 'SET_ENABLE_ALARM'
                    : 'SET_ENABLE_TRIP'
                )
              "
              :disabled="enableForm.enableBitsObj.length === 0"
              >保存</Button
            >
          </FormItem>
        </Form>
      </Col>
      <Col style="border:1px solid #3d3d41;padding:10px;color:#999999;background: rgba(153, 153, 153, 0.05);" :span="24">
        <div class="description-title"> </div>
        <div>
         <i class="icon-v5 icon-v5-xiaoxi"></i> 说明:    1. 向服务器提交了指令,并非立即生效,指令将由服务器后台逐个下发到设备,根据网络情况可能会延迟.
        </div>
        <div class="description" style="margin-left:55px">
          2. 所选设备如果不在线,该设备将被自动忽略执行指令.
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
    import {
        queryChnlAttr,
        modifyBoxsChnlWiring,
        modifyBoxRemoteControl
    } from '@/api/control/index';
    import {
        modifyBoxsChnlTripEnable,
        modifyBoxsChnlAlarmEbable
    } from '@/api/public';
    import Enable from '@/pages/Control/Enable.vue';
    export default {
        props: {
            row: Object,
            currentPage: { type: Number || String, default: '' },
            index: Number
        },
        components: { Enable },
        data () {
            return {
                bits: [],
                enableForm: {
                    enableBits: [],
                    enableBitsObj: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0
                    ]
                        .reverse()
                        .join('')
                },
                enableControl: this.row.enableControl ? 1 : 0,
                adjustment: {
                    mac: this.$store.state.mac,
                    name: this.$store.state.aliasName,
                    build: this.$store.state.sortBUR.build,
                    unit: this.$store.state.sortBUR.unit,
                    room: this.$store.state.sortBUR.room,
                    linkman: this.$store.state.sortBUR.linkman,
                    linkman2: this.$store.state.sortBUR.linkman2,
                    linkmanTel: this.$store.state.sortBUR.linkmanTel,
                    linkmanTel2: this.$store.state.sortBUR.linkmanTel2,
                    customAlarm: this.$store.state.customAlarm,
                    classifyLabel: this.$store.state.classifyLabel
                },
                permission: false,
                checkedChange: false,
                ListShow: false
            };
        },
        created () {
            this.init();
        },
        methods: {
            handleCheckedBitsChange (value) {
                console.log(value);
                let arr = [];

                let cmd = this.checkedChange ? 'SET_ENABLE_ALARM' : 'SET_ENABLE_TRIP'
                if (cmd === 'SET_ENABLE_ALARM') {
                    arr = [
                        value.indexOf('0-短路报警') > -1 ? 1 : 0,
                        value.indexOf('1-浪涌报警') > -1 ? 1 : 0,
                        value.indexOf('2-过载报警') > -1 ? 1 : 0,
                        value.indexOf('3-温度预警') > -1 ? 1 : 0,
                        value.indexOf('4-漏电报警') > -1 ? 1 : 0,
                        value.indexOf('5-过流报警') > -1 ? 1 : 0,
                        value.indexOf('6-过压报警') > -1 ? 1 : 0,
                        value.indexOf('7-保留') > -1 ? 1 : 0,
                        value.indexOf('8-保留') > -1 ? 1 : 0,
                        value.indexOf('9-缺相报警') > -1 ? 1 : 0,
                        value.indexOf('10-电弧报警') > -1 ? 1 : 0,
                        value.indexOf('11-欠压报警') > -1 ? 1 : 0,
                        value.indexOf('12-过压预警') > -1 ? 1 : 0,
                        value.indexOf('13-欠压预警') > -1 ? 1 : 0,
                        value.indexOf('14-漏电预警') > -1 ? 1 : 0,
                        value.indexOf('15-电流预警') > -1 ? 1 : 0,
                        value.indexOf('16-保留') > -1 ? 1 : 0,
                        value.indexOf('17-本地检修') > -1 ? 1 : 0,
                        value.indexOf('18-恶性负载') > -1 ? 1 : 0,
                        value.indexOf('19-远程锁定') > -1 ? 1 : 0,
                        value.indexOf('20-保留') > -1 ? 1 : 0,
                        value.indexOf('21-温度报警') > -1 ? 1 : 0,
                        value.indexOf('22-不平衡报警') > -1 ? 1 : 0,
                        value.indexOf('23-错相报警') > -1 ? 1 : 0,
                        value.indexOf('24-保留') > -1 ? 1 : 0,
                        value.indexOf('25-保留') > -1 ? 1 : 0,
                        value.indexOf('26-保留') > -1 ? 1 : 0,
                        value.indexOf('27-保留') > -1 ? 1 : 0,
                        value.indexOf('28-保留') > -1 ? 1 : 0,
                        value.indexOf('29-保留') > -1 ? 1 : 0,
                        value.indexOf('30-保留') > -1 ? 1 : 0,
                        value.indexOf('31-保留') > -1 ? 1 : 0
                    ];
                    this.enableForm.enableBitsObj = arr.reverse().join('');
                } else if (cmd === 'SET_ENABLE_TRIP') {
                    arr = [
                        value.indexOf('0-短路报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('1-浪涌报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('2-过载报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('3-温度预警脱扣') > -1 ? 1 : 0,
                        value.indexOf('4-漏电报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('5-过流报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('6-过压报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('7-保留') > -1 ? 1 : 0,
                        value.indexOf('8-保留') > -1 ? 1 : 0,
                        value.indexOf('9-缺相报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('10-电弧报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('11-欠压报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('12-过压预警脱扣') > -1 ? 1 : 0,
                        value.indexOf('13-欠压预警脱扣') > -1 ? 1 : 0,
                        value.indexOf('14-漏电预警脱扣') > -1 ? 1 : 0,
                        value.indexOf('15-电流预警脱扣') > -1 ? 1 : 0,
                        value.indexOf('16-保留') > -1 ? 1 : 0,
                        value.indexOf('17-保留') > -1 ? 1 : 0,
                        value.indexOf('18-恶性负载脱扣使能') > -1 ? 1 : 0,
                        value.indexOf('19-保留') > -1 ? 1 : 0,
                        value.indexOf('20-保留') > -1 ? 1 : 0,
                        value.indexOf('21-温度报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('22-不平衡报警脱扣') > -1 ? 1 : 0,
                        value.indexOf('23-错相脱扣') > -1 ? 1 : 0,
                        value.indexOf('24-保留') > -1 ? 1 : 0,
                        value.indexOf('25-保留') > -1 ? 1 : 0,
                        value.indexOf('26-保留') > -1 ? 1 : 0,
                        value.indexOf('27-保留') > -1 ? 1 : 0,
                        value.indexOf('28-保留') > -1 ? 1 : 0,
                        value.indexOf('29-保留') > -1 ? 1 : 0,
                        value.indexOf('30-保留') > -1 ? 1 : 0,
                        value.indexOf('31-保留') > -1 ? 1 : 0
                    ];
                    this.enableForm.enableBitsObj = arr.reverse().join('');
                }
            },
            submitForm (mac, node, type) {
                let that = this;
                let params = {
                    macs: mac,
                    cmd: type,
                    nodeNos: node
                };
                if (type === 'SET_ENABLE_TRIP') {
                    params.tripEnable = this.enableForm.enableBitsObj;
                    modifyBoxsChnlTripEnable(params)
                        .then((res) => {
                            if (res.success) {
                                that.$Message.success({
                                    content: '命令已提交，生效中..'
                                });
                                this.init();
                                //   this.$emit('refresh-init');
                            } else if (res.code === '-1') {
                            } else {
                                if (res.data) {
                                    for (let elem of res.data) {
                                        if (elem.errorMsg === '0') {
                                            this.$Message.success({
                                                content: '生效中'
                                            })
                                        } else {
                                            this.$Message.error({
                                                content: elem.mac + '设备离线'
                                            })
                                        }
                                    }
                                } else {
                                    this.$Message.error({
                                        content: res.message
                                    })
                                }
                            }
                        })
                } else if (type === 'SET_ENABLE_ALARM') {
                    params.alarmEnable = this.enableForm.enableBitsObj;
                    modifyBoxsChnlAlarmEbable(params)
                        .then((res) => {
                            if (res.success) {
                                that.$Message.success({
                                    content: '命令已提交，生效中..'
                                });
                                this.init();
                                //  this.$emit('refresh-init');
                            } else if (res.code === '-1') {
                            } else {
                                if (res.data) {
                                    for (let elem of res.data) {
                                        if (elem.errorMsg === '0') {
                                            this.$Message.success({
                                                content: '生效中'
                                            })
                                        } else {
                                            this.$Message.error({
                                                content: elem.mac + '设备离线'
                                            })
                                        }
                                    }
                                } else {
                                    this.$Message.error({
                                        content: res.message
                                    })
                                }
                            }
                        })
                }
            },
            init () {
                this.handleAdjustment(this.adjustment.mac, this.adjustment.name);
            },
            handleAdjustment (mac, name) {
                let ele = document.querySelector('.alarm-threshold-refresh');
                if (ele) {
                    this.disabledFlag = true;
                    setTimeout(() => {
                        this.disabledFlag = false;
                    }, 100);
                }
                queryChnlAttr({ mac: mac })
                    .then((res) => {
                        if (res.success) {
                            res.data.map((item, index) => {
                                item.index = index;
                            });
                            this.adjustments = res.data;
                            this.total = res.data.length;
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                });
                            }
                        }
                    })
            },
            handleWiring (nodeNo, gatherAddr) {
                let that = this;
                let params = {
                    macs: this.adjustment.mac,
                    cmd: 'SETWIRING',
                    nodeNo,
                    wiring: gatherAddr
                };
                modifyBoxsChnlWiring(params)
                    .then((res) => {
                        if (res.success) {
                            that.$Message.success({
                                content: '命令已提交，生效中..'
                            });
                        } else if (res.code === '-1') {
                        } else {
                            let message = '';
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        message +=
                                            '<div class="c-success tl">' +
                                            elem.mac +
                                            '：' +
                                            '生效中..' +
                                            '</div>';
                                    } else {
                                        message +=
                                            '<div class="c-danger tl">' +
                                            elem.mac +
                                            '：' +
                                            elem.errorMsg +
                                            '</div>';
                                    }
                                }
                            } else {
                                message = res.message;
                            }
                            that.$alert(message, '', {
                                dangerouslyUseHTMLString: true,
                                showConfirmButton: false,
                                customClass: 'alert-content',
                                callback: (action) => {}
                            });
                        }
                    })
            },
            handleControl (nodeNo, enableControl) {
                let that = this;
                let params = {
                    macs: this.adjustment.mac,
                    cmd: 'SETCONTROL',
                    nodeNo: nodeNo,
                    operType: enableControl === 1 ? 1 : 0
                };
                modifyBoxRemoteControl(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '命令已提交，生效中..'
                            });
                        } else if (res.code === '-1') {
                        } else {
                            let message = '';
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        message +=
                                            '<div class="c-success tl">' +
                                            elem.mac +
                                            '：' +
                                            '生效中..' +
                                            '</div>';
                                    } else {
                                        message +=
                                            '<div class="c-danger tl">' +
                                            elem.mac +
                                            '：' +
                                            elem.errorMsg +
                                            '</div>';
                                    }
                                }
                            } else {
                                message = res.message;
                            }
                            that.$alert(message, '', {
                                dangerouslyUseHTMLString: true,
                                showConfirmButton: false,
                                customClass: 'alert-content',
                                callback: (action) => {}
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '设备不在线,请检查网络'
                            });
                        }
                });
            },
            handleEnable (obj, type, index, flag) {
                this.checkedChange = flag
                this.ListShow = true
                if (type === 'alarm') {
                    this.adjustments[index + (this.currentPage - 1) * 10].enableAlarmShowHide =
                        !this.adjustments[index + (this.currentPage - 1) * 10]
                            .enableAlarmShowHide;
                    this.adjustments[index + (this.currentPage - 1) * 10].enableTripShowHide = false;
                    this.bits = [
                        '短路报警',
                        '浪涌报警',
                        '过载报警',
                        '温度预警',
                        '漏电报警',
                        '过流报警',
                        '过压报警',
                        '保留',
                        '保留',
                        '缺相报警',
                        '电弧报警',
                        '欠压报警',
                        '过压预警',
                        '欠压预警',
                        '漏电预警',
                        '电流预警',
                        '保留',
                        '本地检修',
                        '恶性负载',
                        '远程锁定',
                        '保留',
                        '温度报警',
                        '不平衡报警',
                        '错相报警',
                        '保留',
                        '保留',
                        '保留',
                        '保留',
                        '保留',
                        '保留',
                        '保留',
                        '保留'
                    ];
                } else if (type === 'trip') {
                    this.adjustments[index + (this.currentPage - 1) * 10].enableTripShowHide =
                        !this.adjustments[index + (this.currentPage - 1) * 10]
                            .enableTripShowHide;
                    this.adjustments[index + (this.currentPage - 1) * 10].enableAlarmShowHide = false;
                    this.bits = [
                        '短路报警脱扣',
                        '浪涌报警脱扣',
                        '过载报警脱扣',
                        '温度预警脱扣',
                        '漏电报警脱扣',
                        '过流报警脱扣',
                        '过压报警脱扣',
                        '保留',
                        '保留',
                        '缺相报警脱扣',
                        '电弧报警脱扣',
                        '欠压报警脱扣',
                        '过压预警脱扣',
                        '欠压预警脱扣',
                        '漏电预警脱扣',
                        '电流预警脱扣',
                        '保留',
                        '恶性负载使能',
                        '保留',
                        '保留',
                        '保留',
                        '温度报警脱扣',
                        '不平衡报警脱扣',
                        '错相脱扣',
                        '保留',
                        '保留',
                        '保留',
                        '保留',
                        '保留',
                        '保留',
                        '保留',
                        '保留'
                    ];
                    let arr = obj.split('').reverse();
                    let _arr = [];
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] === '1') _arr.push(i + '-' + this.bits[i]);
                    }
                    this.enableForm.enableBits = _arr;
                    this.enableForm.enableBitsObj = obj;
                    let _len = this.adjustments.length;
                    for (let i = 0; i < _len; i++) {
                        if (index + (this.currentPage - 1) * 10 !== i) {
                            this.adjustments[i].enableAlarmShowHide = false;
                            this.adjustments[i].enableTripShowHide = false;
                        }
                    }
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.button-style{
   color:#007EFF;
   border:1px solid #007EFF;
   background: rgba(0, 126, 255, 0.1);
   }
/deep/.ivu-table-expanded-cell{
    background-color: #1a202e !important;
}
</style>
