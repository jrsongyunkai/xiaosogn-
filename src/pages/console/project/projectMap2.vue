<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
    import { loadBoxMap } from '@/api/public';
    export default {
        data () {
            return {
                loadbox: [],
                lastid: ''
            };
        },
        methods: {
            handelMapSwith () {
                var markers = []
                let params = {
                    projectCode: this.$store.state.projectCode,
                    lastId: 0,
                    pageSize: 100000
                };
                let content = '';
                let opts = {
                    height: 80,
                    title: ''
                };
                var map = new BMap.Map('container'); // 创建Map实例
                map.centerAndZoom(new BMap.Point(113.386762, 23.132214), 8); // 初始化地图,设置中心点坐标和地图级别
                map.setMapStyleV2({
                    styleId: '7ed66a1c1ac261f21388ced59d8bbcd3'
                });
                loadBoxMap(params).then((res) => {
                    var markerClusterer = null;
                    res.data.forEach((item, index) => {
                        var point = new BMap.Point(item.longitude, item.latitude);
                        // 创建标注
                        var icon = new BMap.Icon(require('../../../assets/images/macNo.png'), new BMap.Size(50, 50))
                        var marker = new BMap.Marker(point, {
                            icon: icon
                        });
                        marker.addEventListener('click', function (e) {
                            console.log(e);
                            content =
                                '<div class="project-infoWindow">' +
                                `${item.boxName}[${item.id}]` +
                                '</div>';
                            let infoWindow = new BMap.InfoWindow(content, opts);
                            map.openInfoWindow(infoWindow, point);
                        });
                        markers.push(marker)
                    });
                    var myStyles =
                        [
                            {
                                url: require('../../../assets/images/jhed.png'),
                                size: new BMap.Size(50, 50),
                                opt_anchor: [16, 0],
                                textColor: '#fff',
                                textSize: 12
                            }
                        ]

                    markerClusterer = new BMapLib.MarkerClusterer(map, { markers: markers, styles: myStyles });
                });

                // // 创建文本标注

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
  font-family: "微软雅黑";
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
/deep/.BMap_bubble_content {
  width: 100% !important;
}
/deep/.BMap_bubble_pop {
  overflow: hidden;
}

</style>
