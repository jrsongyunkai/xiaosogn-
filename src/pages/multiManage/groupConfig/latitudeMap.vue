<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
    export default {
        data () {
            return {};
        },
        methods: {
            handelMapSwith () {
                window.sessionStorage.setItem(
                    'prjId',
                    this.$store.state.switchData.prjId
                );
                var maplist = [];
                maplist.push(this.$store.state.switchData);
                var map = new window.BMapGL.Map('container'); // 创建Map实例
                map.setMapStyleV2({
                    styleId: '7ed66a1c1ac261f21388ced59d8bbcd3'
                });
                let content = '';
                let opts = {
                    width: 205,
                    height: 80,
                    title: ''
                };
                const _this = this;
                let mercator;
                let addComp
                map.addEventListener('click', function (e) {
                    mercator = map.lnglatToMercator(e.latlng.lng, e.latlng.lat);
                    _this.$emit('getLongitudes', [e.latlng.lng, e.latlng.lat]);
                    let points = e.latlng
                    var gc = new window.BMapGL.Geocoder();
                    gc.getLocation(points, function (rs) {
                        addComp = rs.addressComponents;
                        _this.$emit('getLocaltion', addComp);
                    });
                    map.clearOverlays()
                    let newPoint = new window.BMapGL.Point(e.latlng.lng, e.latlng.lat)
                    let newMarker = new window.BMapGL.Marker(newPoint)
                    map.addOverlay(newMarker)
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
            }
        },
        mounted () {
            this.handelMapSwith();
        }
    };
</script>
<style lang="less" scoped>
#container {
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
</style>
