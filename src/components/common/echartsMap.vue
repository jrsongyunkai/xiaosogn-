<template>
     <div id='myEchart' ref='myEchart'/>
</template>

<script>
    import echarts from 'echarts'
    import { alarmTypeStats, loadAllProject } from '@/api/visualScreen/index.js'
    import '@/../node_modules/echarts/map/js/china.js' // 引入中国地图数据
    export default {
        components: {},
        props: {
            projectsOption: {
                type: Array,
                default () {
                    return {}
                }
            },
            mapData: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                dataValue: [],
                loadMeta: this.$store.state.loadMeta,
                AlarmTypeData: [],
                data: '',
                mapH: '8%',
                zoom: 0.6,
                screenWidth: document.body.clientWidth,
                projects: []
            }
        },
        created () {},
        mounted () {
            this.loadAllProject()
            const that = this
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth
                    that.screenWidth = window.screenWidth
                })()
            }
        },
        methods: {
            dealWithData () {
                this.dataValue = []
                let names = []
                let geoCoordMap = this.projectsOption
                this.projects.forEach((item) => {
                    names.push(item.projectName)
                })
                for (let i = 0; i < geoCoordMap.length; i++) {
                    this.dataValue.push({ name: names[i], value: geoCoordMap[i].degree, industryCode: geoCoordMap[i].industryCode, projectCode: geoCoordMap[i].projectCode, location: this.projectsOption[i].localtion })
                }
            },
            queryAlarmTypeStats () {
                let arr = []
                console.log(this.projectsOption, 333);
                this.projectsOption.forEach(item => {
                    arr.push(item.projectCode)
                })
                let params = {
                    projectCode: arr.join(',')
                }
                alarmTypeStats(params)
                    .then(res => {
                        if (res.success) {
                            this.AlarmTypeData = res.data
                            console.log(this.AlarmTypeData);
                        }
                    })
            },
            loadAllProject () {
                let params = {
                    provinceId: this.provinceId ? this.provinceId : '',
                    cityId: this.cityId ? this.cityId : '',
                    countyId: this.countyId ? this.countyId : ''
                }
                loadAllProject(params)
                    .then(res => {
                        console.log(res);
                        this.localDatas = []
                        res.data.forEach((item, index) => {
                            let latitude = Number(item.latitude.toFixed(2))
                            let longitude = Number(item.longitude.toFixed(2))
                            this.localDatas.push({ type: true, number: 0, numberWarn: 0, code: item.projectCode, name: item.projectName })
                            this.projects.push(
                                {
                                    industryCode: item.industryCode,
                                    degree: [longitude, latitude],
                                    projectCode: item.projectCode,
                                    projectName: item.projectName
                                }
                            )
                        })
                        this.mapPointData = res.data
                    })
            },

            chinaConfigure () {
                const _this = this
                let data1 = []
                let data2 = []
                this.queryAlarmTypeStats()
                setTimeout(() => {
                    if (this.AlarmTypeData.length > 0 && this.AlarmTypeData !== '') {
                        this.AlarmTypeData.forEach(item => {
                            this.dataValue.forEach(ele => {
                                console.log(ele);
                                if (item.projectCode === ele.projectCode && item.number > 0) {
                                    data2.push(ele)
                                } else {
                                    data1.push(ele)
                                }
                            })
                        })
                    } else {
                        this.dataValue.forEach(ele => {
                            data1.push(ele)
                        })
                    }

                    const myChart = echarts.init(document.getElementById('myEchart')) // 这里是为了获得容器所在位置
                    myChart.setOption({ // 进行相关配置
                        // backgroundColor: '#161b2e', // 设置背景色
                        tooltip: {// 鼠标移到图里面的浮动提示框
                            show: false,
                            transitionDuration: 0

                        },
                        geo: { // 此处为真正的地图
                            name: '', // 浮动框的标题
                            type: 'map',
                            map: 'china',
                            roam: true,
                            zlevel: 1, // 设置地图的层级，将该地图上移（类似z-index）
                            center: [105.194115019531, 35.582111640625], // 设置地图中心
                            zoom: this.zoom,
                            geoIndex: 1,
                            scaleLimit: {
                                // max: '1',
                                min: '0.8'
                            },
                            top: this.mapH,
                            aspectScale: 0.75, // 长宽比
                            emphasis: {
                                label: {
                                    show: false
                                },
                                itemStyle: {
                                    areaColor: '#3683a5'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    areaColor: '#192846',
                                    borderColor: '#192846',
                                    borderWidth: 2,
                                    shadowColor: '#3683a5',
                                    shadowBlur: 2,
                                    shadowOffsetX: 6,
                                    shadowOffsetY: 10,
                                    opacity: 1
                                }
                            },
                            label: { // 地图标注
                                normal: {
                                    show: false // 是否显示对应地名
                                },
                                emphasis: {
                                    show: false
                                }
                            }
                        },
                        series: [ // 地图标点
                            {
                                type: 'effectScatter',
                                coordinateSystem: 'geo',
                                data: data1,
                                symbol: 'image://' + require('../../assets/images/map2.png'),
                                symbolSize: [26, 52],
                                effectType: 'ripple',
                                tooltip: {
                                    show: true,
                                    trigger: 'item',
                                    extraCssText: 'height:auto;color:#fff;font-size:20px',
                                    formatter: function (params) {
                                        // console.log(params);
                                        let res = ''
                                        res =
                                            '<div style="height:100px;background:#0d0f1b;border:1px solid #0d0f1b;padding:20px 10px 20px 10px">' +
                                            '<div style="font-size:18px;color:#fff;font-style:normal;transform:rotateY(45deg)">' + params.data.name + '</div>' +
                                            '<div style="font-size:16px;color:#8f9095;font-style:normal;transform:rotateY(45deg);margin-top:20px">' + params.data.location + '</div>' +
                                            '</div>'

                                        // res += params.data.name + '<br>' + params.data.location

                                        return res
                                    }
                                },
                                encode: {
                                    value: 2
                                },
                                showEffectOn: 'emphasis',
                                rippleEffect: {
                                    period: 4,
                                    brushType: 'stroke',
                                    scale: 3
                                },
                                cursor: 'pointer',
                                hoverAnimation: true,
                                label: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                itemStyle: {
                                    color: '#f00',
                                    shadowBlur: 2,
                                    shadowColor: '#333'
                                },
                                zlevel: 1
                            },
                            {
                                type: 'effectScatter',
                                effectType: 'ripple',
                                coordinateSystem: 'geo',
                                data: data2,
                                symbol: 'image://' + require('../../assets/images/map1.png'),
                                symbolSize: [26, 52],
                                tooltip: {
                                    show: true,
                                    trigger: 'item',
                                    extraCssText: 'height:auto;color:#fff;font-size:20px',
                                    formatter: function (params) {
                                        let res = ''

                                        res += '<div style="height:100px;background:#0d0f1b;border:1px solid #0d0f1b;padding:20px 10px 20px 10px">' +
                                            '<div style="font-size:18px;color:#fff;font-style:normal;transform:rotateY(12deg)">' + params.data.name + '</div>' +
                                            '<div style="font-size:16px;color:#8f9095;font-style:normal;transform:rotateY(12deg);margin-top:20px">' + params.data.location + '</div>' +
                                            '</div>'

                                        return res
                                    }
                                },
                                encode: {
                                    value: 2
                                },
                                showEffectOn: 'emphasis',
                                rippleEffect: {
                                    brushType: 'fill',
                                    number: 1,
                                    color: '#0efacc',
                                    period: 4,
                                    scale: 1.5
                                },
                                cursor: 'pointer',
                                hoverAnimation: true,
                                label: {
                                    show: false
                                },
                                itemStyle: {
                                    color: '#f00',
                                    shadowBlur: 2,
                                    shadowColor: '#333'
                                },
                                zlevel: 1
                            }
                        ]
                    })
                    myChart.off('click')
                    myChart.on('click', function (params) {
                        console.log(params.data);
                        if (params.seriesType) {
                            _this.$emit('showDetail', params.data.projectCode);
                        }
                    });
                    // let chart = echarts.init(document.getElementById(this.uniqueID))
                    // this.echart = chart
                    // chart.clear()
                    // chart.setOption(myChart, true)
                    window.addEventListener('resize', () => { // 地图自适应缩放
                        this.mapH = this.mapH
                        myChart.resize()
                    })
                }, 200);
            }
        },
        watch: {
            screenWidth (val) {
                // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
                if (!this.timer) {
                    // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
                    this.screenWidth = val
                    this.timer = true
                    let that = this
                    setTimeout(function () {
                        // 打印screenWidth变化的值
                        if (that.screenWidth < 1366) {
                            that.mapH = '20%'
                            that.zoom = 1
                            that.chinaConfigure()
                        } else if (that.screenWidth >= 1400) {
                            that.mapH = '10%'
                            that.zoom = 0.8
                            that.chinaConfigure()
                        }
                        that.timer = false
                    }, 400)
                }
            },

            projectsOption: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.projectsOption = newVal
                        this.dealWithData()
                        this.chinaConfigure()
                    }
                },
                deep: true
            },
            '$store.state.loadMeta': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.dataValue = []
                        this.loadMeta = newVal

                        if (this.loadMeta === 'all') {
                            for (let i = 0; i < this.projectsOption.length; i++) {
                                this.dataValue.push({ name: '', value: this.projectsOption[i].degree, industryCode: this.projectsOption[i].industryCode, projectCode: this.projectsOption[i].projectCode, location: this.projectsOption[i].localtion })
                            }

                            this.$nextTick(() => {
                                this.chinaConfigure()
                            })
                        } else {
                            for (let i = 0; i < this.projectsOption.length; i++) {
                                if (this.projectsOption[i].industryCode === this.loadMeta) {
                                    this.dataValue.push({ name: '', value: this.projectsOption[i].degree, projectCode: this.projectsOption[i].projectCode, industryCode: this.projectsOption[i].industryCode, location: this.projectsOption[i].localtion })
                                }
                            }
                            this.$nextTick(() => {
                                this.chinaConfigure()
                            })
                        }
                    }
                }
            }
        }
    }
</script>

<style lang='less' scoped>
#myEchart {
    height:160%;
    width:100%;
    transform: rotateX(50deg);
}
</style>
