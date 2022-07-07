<template>
    <div id="containers"></div>
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
                var maplist2 = [];
                maplist2.push(this.$store.state.switchData);

                var map2 = new window.BMapGL.Map('containers'); // 创建Map实例
                map2.setMapStyleV2({
                    styleId: '7ed66a1c1ac261f21388ced59d8bbcd3'
                });
                let content2 = '';
                let opts2 = {
                    height: 80,
                    title: ''
                };
                // const _this = this
                // map.addEventListener('click', function (e) {
                //     let mercator = map.lnglatToMercator(e.latlng.lng, e.latlng.lat);
                //     _this.$emit('getLongitudes', mercator);
                // });
                maplist2.forEach((item, index) => {
                    var point = new window.BMapGL.Point(
                        item.prjLocation.longitude,
                        item.prjLocation.latitude
                    );
                    map2.centerAndZoom(point, 8);
                    var marker = new window.BMapGL.Marker(point); // 创建标注
                    map2.addOverlay(marker); // 将标注添加到地图中
                    marker.idx = index;
                    marker.addEventListener('click', function (e) {
                        let p2 = e.target;
                        let point2 = new window.BMapGL.Point(
                            p2.getPosition().lng,
                            p2.getPosition().lat
                        );
                        let idx = p2.idx;
                        content2 =
                            '<div class="project-infoWindow2">' +
                            maplist2[idx].prjName +
                            '</div>';
                        let infoWindow2 = new window.BMapGL.InfoWindow(content2, opts2);
                        map2.openInfoWindow(infoWindow2, point2);
                    });
                });

                // 创建文本标注

                // map.centerAndZoom(new window.BMapGL.Point(116.404, 39.915), 12); // 初始化地图,设置中心点坐标和地图级别
                map2.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            }
        },
        created () {
            this.handelMapSwith();
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
 /deep/ .project-infoWindow2 {
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
