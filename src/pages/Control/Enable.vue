<template>
  <Row>
    <Col>
      <Form ref="enableAlarmForm" :model="enableBits" class="">
        <FormItem label="使能位置设置'">
          <CheckboxGroup
            size="small"
            v-model="enableBits.enableBits"
            @change="handleCheckedBitsChange"
          >
            <Checkbox
              border
              v-for="(bit, index) in bits"
              :label="index + '-' + bit"
              :key="index"
              :disabled="bit === '保留'"
              >{{ bit }}</Checkbox
            >
          </CheckboxGroup>
        </FormItem>
        <FormItem>
          <Button
            size="small"
            type="primary"
            @click="submitForm(param.mac, param.nodeNo, param.cmd)"
            :disabled="enableBits.enableBitsObj.length === 0"
            >保存</Button
          >
        </FormItem>
      </Form>
    </Col>
    <Col>
      <div class="description-title">说明</div>
      <div class="description">
        1.
        向服务器提交了指令,并非立即生效,指令将由服务器后台逐个下发到设备,根据网络情况可能会延迟.
      </div>
      <div class="description">
        2. 所选设备如果不在线,该设备将被自动忽略执行指令.
      </div>
    </Col>
  </Row>
</template>
<script>
/* global  */
    import { modifyBoxsChnlTripEnable, modifyBoxsChnlAlarmEbable } from '@/api/public';
    export default {
        props: {
            enableBits: {
                type: Object,
                default () {
                    return {};
                }
            },
            param: {
                type: Object,
                default () {
                    return {};
                }
            },
            bits: {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        data () {
            return {};
        },
        mounted () {},
        methods: {
            handleCheckedBitsChange (value) {
                let arr = [];
                if (this.param.cmd === 'SET_ENABLE_ALARM') {
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
                    this.enableBits.enableBitsObj = arr.reverse().join('');
                } else if (this.param.cmd === 'SET_ENABLE_TRIP') {
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
                    this.enableBits.enableBitsObj = arr.reverse().join('');
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
                    params.tripEnable = this.enableBits.enableBitsObj;
                    modifyBoxsChnlTripEnable(params)
                        .then((res) => {
                            if (res.success) {
                                that.$Message.success({
                                    content: '命令已提交，生效中..'
                                });
                                this.$emit('refresh-init');
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
                                                this.$t('message.processing') +
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
                                that.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                    });
                } else if (type === 'SET_ENABLE_ALARM') {
                    params.alarmEnable = this.enableBits.enableBitsObj;
                    modifyBoxsChnlAlarmEbable(params)
                        .then((res) => {
                            if (res.success) {
                                that.$Message.success({
                                    content: '命令已提交，生效中..'
                                });
                                this.$emit('refresh-init');
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
                                                this.$t('message.processing') +
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
                                that.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                    });
                }
            }
        }
    };
</script>
<style lang="stylus" scoped></style>
