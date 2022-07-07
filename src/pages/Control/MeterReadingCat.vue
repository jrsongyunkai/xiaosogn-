<template>
  <div id="IntelligentWaterMeter" style="width: 120%;">
    <div class="header"></div>
    <Row class="tc">
      <Col style="padding:15px">
        <span>最新抄表度数：</span>
        <span>{{ lastScale + '吨' }}</span>
      </Col>
    </Row>
    <Table :data="tableData" :columns="columnstable" style="" height="200"></Table>
  </div>
</template>

<script>
    import { findLastChannelByMac, queryChaobiaomaoChannel } from '@/api/public';
    export default {
        components: {},
        props: {
            param: {
                type: Object
            }
        },
        data () {
            return {
                columnstable: [
                    {
                        title: '上期度数',
                        key: 'preScale'
                    },
                    {
                        title: '本期度数',
                        key: 'curScale'
                    },
                    {
                        title: '用量',
                        key: 'waterVolume'
                    },
                    {
                        title: '用量日期范围',
                        key: 'timeRange'
                    },
                    {
                        title: '抄表时间',
                        key: 'meterReadTime'
                    }
                ],
                lastScale: '',
                tableTime: this.$store.state.historyDate,
                tableData: []
            };
        },
        mounted () {
            this.init();
            this.queryChaoBiaoMaoTable();
        },
        methods: {
            init () {
                let params = {
                    mac: this.param.mac
                };
                findLastChannelByMac(params)
                    .then((res) => {
                        if (res.success) {
                            this.lastScale = res.data.lastScale;
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
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
            queryChaoBiaoMaoTable () {
                let parmas = {
                    mac: this.param.mac,
                    startTime: this.tableTime[0],
                    endTime: this.tableTime[1]
                };
                queryChaobiaomaoChannel(parmas)
                    .then((res) => {
                        if (res.success) {
                            this.tableData = res.data;
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
            }
        },
        watch: {
            '$store.state.historyDate': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.tableTime = newVal;
                        this.$nextTick(() => {
                            this.queryChaoBiaoMaoTable();
                        });
                    }
                }
            }
        }
    };
</script>

<style lang="less" scoped>

.header {
  height: 43px;
  border-bottom: 1px solid #5e626c;
}
/deep/::-webkit-scrollbar {
  width: 6px; //竖轴宽度
  height: 6px; //横轴宽度
  // background-color: rgba(99, 110, 246, 0.5);
}

/* 滚动槽 */
/deep/::-webkit-scrollbar-track {
  border-radius: 10px;
}

/deep/::-webkit-scrollbar-thumb {
  background-color: #1a202e;
  // #1A202E
}
</style>
