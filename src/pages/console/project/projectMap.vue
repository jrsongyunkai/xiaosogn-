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
                    height: 80,
                    title: ''
                };
                // const _this = this
                // map.addEventListener('click', function (e) {
                //     let mercator = map.lnglatToMercator(e.latlng.lng, e.latlng.lat);
                //     _this.$emit('getLongitudes', mercator);
                // });
                maplist.forEach((item, index) => {
                    var point = new window.BMapGL.Point(
                        item.prjLocation.longitude,
                        item.prjLocation.latitude
                    );
                    map.centerAndZoom(point, 8);
                    var icon = new BMapGL.Icon(require('../../../assets/images/macNo.png'), new BMapGL.Size(50, 50))
                    var marker = new window.BMapGL.Marker(point, {
                        icon: icon
                    }); // 创建标注
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
                            '<div class="project-infoWindow">' +
                            maplist[idx].prjName +
                            '</div>';
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
 /deep/ .project-infoWindow {
      text-align: center;
      color: #fff;
    //   font-size: 14px;
    //   white-space: nowrap;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
      display: inline-block;
      width: 100%;
      animation: 5s wordsLoop linear infinite normal;

  }
   @keyframes wordsLoop {
      0% {
        transform: translateX(10px);
      }
      100% {
        transform: translateX(-100%);
      }
    }
}
/deep/.BMap_bubble_content{
    width: 100% !important;
}
/deep/.BMap_bubble_pop{
    overflow: hidden;
}
</style>
