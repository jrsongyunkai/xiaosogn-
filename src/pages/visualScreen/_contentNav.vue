<template>
    <div class="content">
        <div class="content_top">
            <div class="header">
            <Row class="img_row">
                <Col span="12" class="img_row_col tl">
                    <i class="img_row_art ml-10">用能趋势</i>
                </Col>
                <Col span="11" class=" img_row_col tr">
                    <i class="img_row_art" @click="handleControl('1')">远程管控 ></i>
                    <Modal title="选择项目" id="controlMod" v-model="controlState">
                            <input class="header-search" v-model="message" type="text" placeholder="搜索项目">
                            <div class="count" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleSelect(item)">
                                {{ item.projectName }}
                            </div>
                        <div slot="footer"></div>
                    </Modal>
                </Col>
            </Row>
        </div>
        <Row class="content_cont">
            <Col span="8" class="content_cont_st tc">
                <template v-if="statis.curYearPower ==='-'">
                    <p class="content_cont_st_icon fot">{{statis.curYearPower}}</p>
                </template>
                <template v-if="statis.curYearPower !=='-'">
                     <p class="content_cont_st_icon fot">{{Math.ceil(statis.curYearPower)}}</p>
                </template>
                <p class="content_cont_st_zi">本年用电量</p>
            </Col>

            <Col span="8" class="content_cont_st tc">
               <template v-if="statis.curMonthPower === '-' ">
                    <p class="content_cont_st_icon fot">{{statis.curMonthPower}}</p>
                </template>
                <template v-if="statis.curMonthPower !=='-'">
                     <p class="content_cont_st_icon fot" >{{Math.ceil(statis.curMonthPower)}}</p>
                </template>
                <p class="content_cont_st_zi">本月用电量</p>
            </Col>
            <Col span="8" class="content_cont_st tc">
                <template v-if="statis.yesterdayPower ==='-'">
                    <p class="content_cont_st_icon fot">{{statis.yesterdayPower}}</p>
                </template>
                <template v-if="statis.yesterdayPower !=='-'">
                     <p class="content_cont_st_icon fot">{{Math.ceil(statis.yesterdayPower)}}</p>
                </template>

                <p class="content_cont_st_zi">昨日用电量</p>
            </Col>
        </Row>
        <div>
            <line-area :options="trendOptions"></line-area>
        </div>
        </div>
        <div class="content_bom">
            <div class="bom" >
            <div style="display:flex;align-items:center">
                <Row class="img_row" >
                    <Col span="11" class="img_row_col tl">
                        <i class="img_row_art ml-10">工单管理</i>
                    </Col>
                    <Col span="12" class="report img_row_col tr">
                        <i class="img_row_art" @click="handleControl('2')">统计报告<Icon custom="icon-v5 icon-v5-xiazai" /></i>
                        <Modal title="选择项目" id="reportMod" v-model="reportState">
                                <input class="header-search" v-model="message" type="text" placeholder="搜索项目">
                                <div class="count" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleWork(item,'1')">
                                    {{ item.projectName }}
                                </div>
                            <div slot="footer"></div>
                        </Modal>
                    </Col>
                </Row>
            <!-- <img src="../../assets/images/border.gif" alt="" srcset=""> -->
            </div>
            <div class="content_bom_img">
                <div class="content_bom_img_div" @click="handleContent('1')" >
                    <div class="dfs">
                        <img src="../../assets/images/hidden.png" alt=""/>
                        <div class="div_font tc">隐患查询</div>
                    </div>
                    <div class="div_number div_color_f tc">{{workOrder.hiddenDangerCount}}</div>
                </div>
                <div class="content_bom_img_div" @click="handleControl('3')" >
                    <div class="dfs">
                        <img src="../../assets/images/handle.png" alt="" >
                        <div class="div_font tc">处理中</div>
                    </div>
                    <div class="div_number div_color_s tc">{{workOrder.workOrderProcessingCount}}</div>
                    <Modal title="选择项目" id="workMod" v-model="workOrderState">
                            <input class="header-search" v-model="message" type="text" placeholder="搜索项目">
                            <div class="count" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleWork(item,'2')">
                                {{ item.projectName }}
                            </div>
                        <div slot="footer"></div>
                    </Modal>
                </div>
                <div class="content_bom_img_div"  @click="handleControl('4')"  >
                     <div class="dfs">
                        <img src="../../assets/images/copy.png" alt="" >
                        <div class="div_font tc">完成工单</div>
                     </div>
                    <div class="div_number div_color_t tc">{{workOrder.workOrderProcessedCount}}</div>
                    <Modal title="选择项目" id="workMod2" v-model="workOrderState2">
                            <input class="header-search" v-model="message" type="text" placeholder="搜索项目">
                            <div class="count" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleWork(item,'3')">
                                {{ item.projectName }}
                            </div>
                        <div slot="footer"></div>
                    </Modal>
                </div>
            </div>
        </div>
        </div>

    </div>
</template>

<script>
    import screenElectricArea from '../../components/common/screenElectricArea.vue';
    import { mapState } from 'vuex';
    import { energyStatistics, energyTrend, workOrderStatistics } from '@/api/visualScreen/index.js'
    export default {
        components: {
            lineArea: screenElectricArea
        },
        data () {
            return {
                Ysearch: '',
                controlState: false,
                reportState: false,
                workOrderState: false,
                workOrderState2: false,
                statis: '',
                message: '',
                trendOptions: {
                    title: {
                        show: true,
                        text: '电量（度）'
                    },
                    xAxis: [],
                    series: []
                },
                curMonthPower: [],
                preMonthPower: [],
                time: [],
                workOrder: '',
                baseStyle: {
                    height: this.$store.state.heighttimg
                }
            }
        },
        computed: {
            ...mapState('admin/layout', [
                'headerMenu',
                'isMobile',
                'menuCollapse',
                'showSearch',
                'showBreadcrumb'
            ]),
            matchedOptions () {
                if (this.message !== '') {
                    return this.checkedProjectStr.filter(item => item.projectName.indexOf(this.message) > -1)
                } else {
                    return this.checkedProjectStr
                }
            }
        },
        created () { this.init() },
        mounted () {

        },
        methods: {
            init () {
                this.handleStatistics()
                this.queryTrend()
                this.handleWorkOrder()
                var storage = window.sessionStorage;
                this.checkedProjectStr = JSON.parse(storage.getItem('checkedProjectStr')); // 取值时转为对象
            },
            handleStatistics () {
                energyStatistics().then(res => {
                    this.statis = res.data
                })
            },
            queryTrend () {
                energyTrend().then(res => {
                    var trend = res.data
                    trend.forEach(item => {
                        this.curMonthPower.push(item.curMonthPower)
                        this.preMonthPower.push(item.preMonthPower)
                        this.time.push(item.time)
                    });
                    if (res.success) {
                        this.trendOptions.xAxis = []
                        this.trendOptions.series = []
                        this.trendOptions.xAxis = this.time
                        this.trendOptions.series.push({ name: '本月', type: 'line', data: this.curMonthPower, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(65, 105, 225, .6)' }, { offset: 1, color: 'rgba(65, 105, 225, .1)' }], global: false } }, itemStyle: { color: '#34ACE7' }, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true })
                        this.trendOptions.series.push({ name: '上月', type: 'line', data: this.preMonthPower, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0, 201, 78, .6)' }, { offset: 1, color: 'rgba(0, 201, 78, .1)' }], global: false } }, itemStyle: { color: '#00b582' }, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true })
                    } else if (res.code === '-1') {
                    } else {
                        this.trendOptions.xAxis = []
                        this.trendOptions.series = []
                        this.$Message.error({
                            content: res.message
                        })
                    }
                })
            },
            handleSelect (item) {
                var path = '/console/topology'
                this.$func.switchToProject(item, path)
            },
            handleWork (item, type) {
                switch (type) {
                case '1':
                    var path = '/multiManage/report'
                    this.$func.switchToProject(item, path)
                    break;
                case '2':
                    var path2 = 'multiManage-workOrder'
                    this.$func.switchToProject(item, path2, '1')
                    break;
                case '3':
                    var path3 = 'multiManage-workOrder'
                    this.$func.switchToProject(item, path3, '2')
                    break;
                default: break;
                }
            },
            handleWorkOrder () {
                workOrderStatistics().then(res => {
                    this.workOrder = res.data
                })
            },
            handleControl (num) {
                if (num === '1') {
                    this.controlState = true
                } else if (num === '2') {
                    this.reportState = true
                } else if (num === '3') {
                    this.workOrderState = true
                } else if (num === '4') {
                    this.workOrderState2 = true
                }
            },
            handleContent (status) {
                if (status === '1') {
                    this.$router.push({
                        name: 'Alarms'
                    })
                }
            }
        },
        watch: {

            '$store.state.heighttimg': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.baseStyle.height = newVal
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.fot{
    font-family: PangMenZhengDao;
    font-weight: 400;
    font-style: italic;
}
.content{
    width: 100%;
    background-color: transparent;
    height: 100%;
    z-index: 999;
.content_top{
    background: url('../../assets/images/contentTop.png') no-repeat;
    width: 100%;
    background-size:100% 100%;
    margin-bottom: 10px;
    height: 60%;
}

    .header{
        width: 100%;
        display: flex;
        align-items: center;
        background: url('../../assets/images/border.gif') no-repeat;
        background-size: 100% 100%;
        height: 35px;
        img{
            width: 100%;
        }
        .img_row{
            width: 100%;
            .img_row_col{
                width: 100%;
                .img_row_art{
                    font-weight: 600;
                    color: white;
                }

            }
        }
    }
    .ivu-icon{
        margin-left: 5px;
    }
    .content_cont{
        display: flex;
        .content_cont_st{
            margin: 10px 0;
        }
        .content_cont_st_icon{
            font-weight: 600;
            color: #327cff;
        }
        .content_cont_st_zi{
            // font-family: 'SimHei';
            font-weight: 600;
            color: #fff;
        }
    }
    .content_bom{
        background: url('../../assets/images/contenBottom.png') no-repeat;
        background-size: 100% 100%;
        margin-bottom: 10px;
            height: 40%;
        .bom{
        width: 100%;
        position: relative;
        img{
            width: 100%;
            position: relative;
        }
        .img_row{
            width: 100%;
            display: flex;
            align-items: center;
            background: url('../../assets/images/border.gif') no-repeat;
            background-size: 100% 100%;
            height: 35px;
            .img_row_col{
                width: 100%;
                z-index: 999;
                .img_row_art{
                    // font-style:italic;
                    // font-family: 'SimHei';

                    font-weight: 600;
                    font-size: 14px;
                    // text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
                    color: white;
                    vertical-align: middle;
                    .iconfont{
                        margin-left: 5px;
                        font-size: 20px;
                    }
                }
            }
        }
        .content_bom_img{
            display: flex;
            justify-content: space-around;

            // width: 100%;
            // display: grid;
            // display: -ms-grid;
            // display: -moz-grid;
            // gap: 40px;
            // grid-template-columns: .8fr .8fr .8fr;
            // grid-template-rows: 1fr;
            margin: 60px 0;
            .content_bom_img_div{
                position: relative;
                cursor: pointer;
                .dfs{
                    display: flex;
                    flex-wrap: wrap;
                    position: relative;
                    width: 110%;
                    min-width: 80px;
                    img{
                        width: 100%;
                    }                }
                .div_font{
                    width: 100%;
                    position: absolute;
                    bottom: 2%;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #D0F1F7;
                }
                .div_number{
                    font-weight: 600;
                    vertical-align: middle;
                    font-size: 26px;
                    font-family: PangMenZhengDao;
                    font-weight: 400;
                    font-style: italic;
                    color: #327CFF;
                }
                .div_color_f{
                    color: #327CFF;
                }
                .div_color_s{
                    color: #FF4F4F;
                }
                .div_color_t{
                    color: #00BA8A;
                }
            }
        }
    }
    }

    @media only screen and (min-width: 1024px) {
        .content_top,.content_bom{
            padding: 10px;
        }
        .content_cont_st_icon{
            font-size: 16px;
        }
        .content_cont_st_zi{
            font-size: 12px;
        }
        .div_font{
            font-size: 12px;
        }
        .content_top{
            margin-bottom: 6px;
        }
    }
    @media only screen and (min-width: 1366px) {
        .content_cont_st_icon{
            font-size: 18px;
        }
        .content_cont_st_zi{
            font-size: 12px;
        }
        .div_font{
            font-size: 14px;
        }
        .content_top{
            margin-bottom: 10px;
        }
    }
    @media only screen and (min-width: 1920px) {
        .content_cont_st_icon{
            font-size: 22px;
        }
        .content_top,.content_bom{
            padding: 20px;
        }
        .content_cont_st_zi{
            font-size: 16px;
        }
        .div_font{
            font-size: 16px;
        }
        .content_top{
            margin-bottom: 10px;
        }
    }
}

</style>
