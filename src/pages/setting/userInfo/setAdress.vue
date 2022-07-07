<template>
  <div style="height: 800px">
    <h3>地图</h3>
    <div style="margin-top: 20px">项目地址</div>
    <Row style="margin-top: 10px" :gutter="16">
      <Col
        ><Row
          ><Col :span="3">省 :</Col>
          <Col :span="20"
            ><Input size="small" v-model="provinceValue"></Input></Col
        ></Row>
      </Col>
      <Col>
        <Row
          ><Col :span="3">市 :</Col>
          <Col :span="20"> <Input size="small" v-model="cityValue"></Input></Col
        ></Row>
      </Col>
      <Col
        ><Row
          ><Col :span="3">区 :</Col
          ><Col :span="20">
            <Input size="small" v-model="areaValue"></Input></Col
        ></Row>
      </Col>
      <Col
        ><Row>
          <Col :span="4">街道 :</Col>
          <Col :span="19"
            ><Input size="small" v-model="streetValue"></Input></Col
        ></Row>
      </Col>
    </Row>
    <div style="margin-top: 20px">经纬度</div>
    <Row style="margin-top: 10px" :gutter="16">
      <Col
        ><Row
          ><Col :span="4">经度 :</Col>
          <Col :span="19"
            ><Input size="small" v-model="longitudeValue"></Input></Col
        ></Row>
      </Col>
      <Col>
        <Row
          ><Col :span="4">纬度 :</Col>
          <Col :span="19">
            <Input size="small" v-model="latitudeValue"></Input></Col
        ></Row>
      </Col>
    </Row>
    <div style="margin-top: 20px">地图查询</div>
    <Row style="margin-top: 10px" :gutter="16">
      <Col :span="10"
        ><Input
          size="small"
          v-model="checkMapValue"
          placeholder="请输入"
        ></Input
      ></Col>
      <Col :span="4"
        ><Button
          style="background: rgba(0, 126, 255, 0.1)"
          ghost
          size="small"
          type="primary"
          @click="getcheckMapValue"
          >查询</Button
        ></Col
      >
    </Row>
    <Row v-if="mapFlag" style="margin-top: 20px">
      <div style="height: 400px; width: 100%">
        <div id="containers"></div>
      </div>
    </Row>
    <Row style="margin-top: 30px"
      ><Button type="primary" @click="saveProjectAdress">保存</Button></Row
    >
  </div>
</template>

<script>
    import { switchHover, updateProjectInfo } from '@/api/public';
    export default {
        data () {
            return {
                provinceValue: '',
                areaValue: '',
                streetValue: '',
                longitudeValue: '',
                latitudeValue: '',
                checkMapValue: '',
                mapFlag: false,
                cityValue: '',
                adress: '',
                prjId: ''
            };
        },
        created () {
            this.getProjectAdress();
            this.mapFlag = true;
            // updateProjectInfo
        },
        mounted () {
            this.handelMapSwith();
        },
        methods: {
            handelMapSwith () {
                const _this = this;
                window.sessionStorage.setItem(
                    'prjId',
                    this.$store.state.switchData.prjId
                );
                var maplist = [];
                maplist.push(this.$store.state.switchData);
                var map = new window.BMapGL.Map('containers'); // 创建Map实例
                map.setMapStyleV2({
                    styleId: '7ed66a1c1ac261f21388ced59d8bbcd3'
                });
                let content = '';
                let opts = {
                    width: 205,
                    height: 80,
                    title: ''
                };
                // 通过输入地址 将地址解析结果显示在地图上，并调整地图视野
                var myGeo = new window.BMapGL.Geocoder();
                myGeo.getPoint(
                    _this.checkMapValue,
                    function (point) {
                        if (point) {
                            map.centerAndZoom(point, 16);
                            map.addOverlay(
                                new window.BMapGL.Marker(point, { title: _this.checkMapValue })
                            );
                        } else {
                            alert('您选择的地址没有查询到结果！');
                        }
                    },
                    '北京市'
                );
                // 通过点击获取地址
                let mercator;
                let addComp;
                var gc = new window.BMapGL.Geocoder();
                map.addEventListener('click', function (e) {
                    mercator = map.lnglatToMercator(e.latlng.lng, e.latlng.lat);
                    _this.longitudeValue = e.latlng.lng;
                    _this.latitudeValue = e.latlng.lat;
                    let points = e.latlng;
                    gc.getLocation(points, function (rs) {
                        addComp = rs.addressComponents;
                        _this.getLocaltion(addComp)
                    });
                    map.clearOverlays()
                    let newPoint = new window.BMapGL.Point(e.latlng.lng, e.latlng.lat)
                    let newMarker = new window.BMapGL.Marker(newPoint)
                    map.addOverlay(newMarker)
                    ;
                });
                maplist.forEach((item, index) => {
                    var point = new window.BMapGL.Point(
                        item.prjLocation.longitude,
                        item.prjLocation.latitude
                    );
                    map.centerAndZoom(point, 8);
                    var marker = new window.BMapGL.Marker(point); // 创建标注
                    map.addOverlay(marker); // 将标注添加到地图中
                    marker.idx = index;
                    marker.addEventListener('click', function (e) {
                        let p = e.target;
                        let point = new window.BMapGL.Point(
                            p.getPosition().lng,
                            p.getPosition().lat
                        );
                        let idx = p.idx;
                        content =
                            '<div class="project-infoWindow"><h3>' +
                            maplist[idx].prjName +
                            '</h3></div>';
                        let infoWindow = new window.BMapGL.InfoWindow(content, opts);
                        map.openInfoWindow(infoWindow, point);
                    });
                });

                // 创建文本标注

                // map.centerAndZoom(new window.BMapGL.Point(116.404, 39.915), 12); // 初始化地图,设置中心点坐标和地图级别
                map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            },
            saveProjectAdress () {
                let params = {
                    updateType: 1,
                    prjId: this.prjId,
                    longitude: this.longitudeValue,
                    latitude: this.latitudeValue,
                    provinceName: this.provinceValue,
                    cityName: this.cityValue,
                    countyName: this.areaValue,
                    street: this.streetValue
                };
                updateProjectInfo(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '修改成功'
                            });
                            this.getProjectAdress();
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
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
            getcheckMapValue () {
                if (this.checkMapValue) {
                    this.handelMapSwith();
                } else {
                    this.$Message.error({
                        content: '请输入地址查询'
                    });
                }
            },
            getProjectAdress () {
                let params = {
                    projectCode: this.$store.state.projectCode
                };
                this.$nextTick(function () {
                    switchHover(params)
                        .then((res) => {
                            this.provinceValue = res.data.prjLocation.provinceName;
                            this.cityValue = res.data.prjLocation.cityName;
                            this.areaValue = res.data.prjLocation.countyName;
                            this.streetValue = res.data.prjLocation.street;
                            this.longitudeValue = res.data.prjLocation.longitude;
                            this.latitudeValue = res.data.prjLocation.latitude;
                            this.checkMapValue = res.data.prjLocation.address;
                            this.prjId = res.data.prjId;
                        })
                        .catch((err) => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
                                });
                            }
                    });
                });
            },

            getLocaltion (val) {
                if (!val) {
                    this.$Message.error('请再次点击地图获取位置');
                } else {
                    this.provinceValue = val.province;
                    this.cityValue = val.city;
                    this.areaValue = val.district;
                    this.streetValue = val.street;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
#containers {
  overflow: hidden;
  width: 100%;
  height: 415px;
  margin: 0;
  font-family: '微软雅黑';
  .project-infoWindow {
    h3 {
      text-align: center;
      color: #fff;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.box{
   color: #A35FB3;
   font-size: 20px;
   line-height: 50px;
   .txt{
     display: inline-block;
     width: 100%;
     animation: 5s wordsLoop linear infinite normal;
   }
}

@keyframes wordsLoop {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-100%);
  }
}

</style>
