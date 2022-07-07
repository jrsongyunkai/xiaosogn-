<template>
  <div id="smartMeter">
    <div class="header">
        <Button @click="handelMeterReading"><i class="icon-v5 icon-v5-banshou"></i></Button>
    </div>
    <Col style="margin-top:30px">
      <Row>
        <Col :span="12">
          <!-- <Icon type="logo-usd" /> -->
          <span>
            剩余金额:
            <span v-if="meterData.money">
              {{ meterData.money + '元' }}
            </span>
          </span>
        </Col>
        <Col>
          <!-- <Icon type="ios-battery-charging" /> -->
          <span >
            总用电量:
            <span v-if="meterData.money">{{ meterData.electro + 'KWh' }}</span>
          </span>
        </Col>

      </Row>

    </Col>
  </div>
</template>

<script>
    import { queryChtqdqMeterReadingData, eleRead } from '@/api/public';
    export default {
        props: {
            mac: {
                type: String
            },
            model: {
                type: String
            }
        },
        data () {
            return {
                meterData: {
                    money: '',
                    electro: ''
                }
            };
        },
        created () {},
        mounted () {
            this.init();
        },
        methods: {
            init () {
                let params = {
                    cid: this.mac,
                    type: '3,22'
                };
                queryChtqdqMeterReadingData(params)
                    .then((res) => {
                        if (res.code === '0') {
                            if (res.data.length > 0) {
                                this.meterData = {
                                    electro: res.data[0].value,
                                    money: res.data[1].value
                                };
                            } else {
                                this.meterData = {
                                    money: '',
                                    electro: ''
                                };
                            }
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
            handelMeterReading () {
                this.$Modal.confirm({
                    title: '提示',
                    content: '即将进行抄表,由于网络等原因,更新需要一些时间...',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        let params = {
                            cid: this.mac,
                            address: this.mac,
                            model: this.model
                        };
                        eleRead(params)
                            .then((res) => {
                                if (res.code === '0') {
                                    if (res.data.status === 'SUCCESS') {
                                        this.$Message.success({
                                            content: '命令已提交，生效中..'
                                        });
                                    } else {
                                        if (res.data.error_msg) {
                                            this.$Message.error({
                                                content: res.data.error_msg
                                            });
                                        } else {
                                            this.$Message.error({
                                                message: '抄表失败'
                                            });
                                        }
                                    }
                                } else {
                                    if (res.data.status) {
                                    } else {
                                        this.$Message.error({
                                            content: '未知错误，请刷新重试'
                                        });
                                    }
                                }
                            })
                            .catch((err) => {
                                if (err) {
                                    this.$Message.error({
                                        content: '未知错误，请刷新重试'
                                    });
                                }
                        });
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消'
                        });
                    }
                });
            }
        },
        watch: {}
    };
</script>

<style lang="less" scoped>
#smartMeter {
  height: 191px;
}

.box {
  margin-top: 30px;
  width: 160px;
  height: 70px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  border: 1px solid #fff;
  display: inline-block;
  margin-right: 15px;

  .tl {
    float: left;
    padding-top: 20px !important;
  }
  .tc {
    float: center;
  }
}
.header {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    border-bottom: 1px solid #5e626c;
    justify-content: space-between;
    Button{
        background: rgba(0, 126, 255, 0.1);
        border: 1px solid #007EFF;
        border-radius: 5px;
        margin-left: 10px;

    }
}
.primary-wrap {
  width: 95.5px;
  height: 70px;
  border: 1px solid #fff;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  display: inline-block;
  .primary-icon {
    font-size: 42px;
    text-align: center;
  }

  .primary-title {
    margin: 0 0 5px;
  }
}

</style>
