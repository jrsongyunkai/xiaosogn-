<template>
    <div class="content_middle tc">
        <Row type="flex" justify="center">
            <Col class="content_middle_col" span="4" @click.native="handleProjects">
                <img src="../../assets/images/code-total.png" alt="" srcset="">
                <div class="img_row_art">项目总数</div>
                <div class="img_row_font">{{statData.totalProject}}</div>
            </Col>
            <Col class="content_middle_col" span="4" @click.native="handleDevice('100')">
                <img src="../../assets/images/code-total.png" alt="" srcset="">
                <div class="img_row_art">设备总数</div>
                <div class="img_row_font">{{statData.totalMac}}</div>
            </Col>
            <Col class="content_middle_col" span="4" @click.native="handleDevice('1')">
                <img src="../../assets/images/on-line.png" alt="" srcset="" >
                <div class="img_row_art">在线设备数</div>
                <div class="img_row_font">{{statData.totalOnlineMac}}</div>
            </Col>
            <Col class="content_middle_col" span="4" @click.native="handleDevice('0,-1')">
                <img src="../../assets/images/off-line.png" alt="" srcset="">
                <div class="img_row_art">离线设备数</div>
                <div class="img_row_font">{{statData.totalOfflineMac}}</div>
            </Col>
            <Col class="content_middle_col" span="4" @click.native="handleQuantity('1')">
                <img src="../../assets/images/alarm.png" alt="" srcset="">
                <div class="img_row_art" >今日报警数</div>
                <div class="img_row_font" @click="warnning('1')">{{statData.totalAlarmToday}}</div>
            </Col>
            <Col class="content_middle_col" span="4" @click.native="handleQuantity('2')">
                <img src="../../assets/images/alarm.png" alt="" srcset="">
                <div class="img_row_art">本月报警数</div>
                <div class="img_row_font" @click="warnning('2')">{{statData.totalAlarmThisMonth}}</div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import { getIndexStatData } from '@/api/visualScreen/index'
    export default {
        components: {},
        data () {
            return {
                statData: ''
            }
        },
        created () {},
        mounted () {
            this.queryIndexStatData()
        },
        methods: {
            queryIndexStatData () {
                getIndexStatData().then(res => {
                    this.statData = res.data
                })
            },
            warnning (dateType) {
                this.$router.push({
                    name: 'Alarms',
                    params: {
                        projectCode: this.$store.state.projectCode,
                        typeNumber: '-100',
                        status: '',
                        oqp2: '',
                        type: dateType
                    }
                })
            },
            handleProjects () {
                this.$router.push({
                    name: 'Overviews',
                    params: {
                        projectName: this.$store.state.fullName
                    }
                })
            },
            handleDevice (status) {
                this.$router.push({
                    name: 'deviceList',
                    params: {
                        projectCode: this.$store.state.projectCode,
                        status: status
                    }
                })
            },
            handleQuantity (dateType) {
                this.$router.push({
                    name: 'Alarms',
                    params: {
                        projectCode: this.$store.state.projectCode,
                        typeNumber: '-100',
                        status: '',
                        oqp2: '',
                        type: dateType
                    }
                })
            }

        },
        watch: {}
    }
</script>

<style lang="less" scoped>
.content_middle{
    width: 50%;
    .content_middle_col{
        padding: 0 8px;
        margin-top: 10px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        min-width: 120px;
        width: 100%;
        img{
            width: 100%;
        }
        .img_row_art{
            position: absolute;
            top: 4%;
            left: 50%;
            margin-left: -52%;
            width: 100%;
            // font-style:italic;
            // font-family: 'SimHei';
            font-size: 12px;
            // text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
            color: white;
        }
        .img_row_font{

            font-family: PangMenZhengDao;
            font-weight: 400;
            font-style: italic;
            color: #D0F1F7;
            position: absolute;
            margin:-5px -10px;
            top: 50%;
            width: 100%;
            // font-style:italic;
            // font-family: 'SimHei';

        }
    }
}
@media only screen and (min-width: 1024px) {
.img_row_font{ font-size: 1.8em;}
}
@media only screen and (min-width: 1366px) {
.img_row_font{ font-size: 1.8em;}
}
@media only screen and (min-width: 1920px) {
.img_row_font{ font-size: 2.2em;}
}
</style>
