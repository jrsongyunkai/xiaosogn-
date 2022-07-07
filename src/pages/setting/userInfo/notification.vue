<template>
  <div style="height: 100%">
    <Row class="wrap">
      <Col :span="18">
        <Row>
          <Col :span="8"> <span> 图区配置 </span></Col>
          <Col :span="8" offset="8">
            <Checkbox
              v-model="checked"
              @on-change="handleChange"
              class="custom-check"
              >自定义底图</Checkbox
            >
            <Upload
              style="display: inline-block"
              :action="uploadUrl"
              name="img"
              :data="imgData"
              :on-success="handleSuccess"
              :before-upload="handleBefore"
              :show-upload-list="false"
              :default-file-list="fileList"
              accept="picture"
            >
              <Button type="primary">导入底图</Button>
            </Upload>
          </Col>
        </Row>
        <div class="c-warning fs-14 ml-5" v-if="visibleIcon">
          <span><Icon type="logo-twitch" /></span>
          提示:启用自定义底图功能后，重新登陆后将不再显示地图，原地图区域显示导入的底图
          <span class="icon-fs"
            ><Icon type="md-close" @click="visibleIcon = false"
          /></span>
        </div>

        <Col
          class="static-upload"
          ref="static-upload"
          style="height: 90%; width: 100%"
        >
          <Col v-if="imgUrl === ''" class="tc"> 请导入图片... </Col>
          <Col v-if="imgUrl !== ''" class="img-wrap">
            <img class="ecology" ref="ecology" :src="imgUrl" :alt="imgUrl" />
            <div
              v-for="(item, index) in data"
              :key="item.projectCode"
              class="item-copy tc"
              :x="item.x"
              :y="item.y"
              :style="{ transform: `translate(${item.x}px, ${item.y}px)` }"
              :title="item.projectName"
              :ref="`project-${item.projectCode}`"
            >
              <span :ref="`project-name-${item.projectCode}`"
                >{{ item.projectName
                }}<i
                  class="el-icon-close pointer"
                  @click="handleClose(item, index)"
                ></i
              ></span>
              <div class="project-icon"><img :src="myIcon" alt="" /></div>
            </div>
          </Col>
        </Col>
      </Col>
      <Col :span="6">
        <Card class="box-card" style="height: 800px">
          <div slot="title" class="tc clearfix">
            <span>项目列表</span>
          </div>
          <div>
            <Scroll height="600">
              <div style="padding-bottom: 6px"></div>
              <div
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
              >
                <Checkbox
                  :value="checkAll"
                  :indeterminate="isIndeterminate"
                  @on-change="handleCheckAllChange"
                  >全选</Checkbox
                >
                <div
                  v-for="(item, index) in list"
                  :key="index"
                  class="pointer"
                  :ref="`project-${index}`"
                  @click="handleClick(item, index)"
                >
                  <Col class="item">
                    <CheckboxGroup
                      v-model="checkAllGroup"
                      @on-change="handleCheckedTypesChange"
                    >
                      <Checkbox :label="item.name" :value="item.name">
                        {{ item.name }}</Checkbox
                      >
                    </CheckboxGroup>
                  </Col>
                </div>
                <div class="fs-12 tc c-info" v-if="loading">
                  <span id="load-text">{{ loadText }}</span>
                </div>
              </div>
            </Scroll>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
    import {
        saveStaffProperty,
        findStaffProperty,
        queryProject4Select,
        delMapDetail,
        saveMapDetail
        // queryMapInfo
    } from '@/api/public';
    import myIcon from '../../../assets/images/nIcon.png';
    // import store from '@/store';
    // import interact from 'interactjs';
    export default {
        name: 'notification',
        data () {
            return {
                isIndeterminate: true,
                checkAll: false,
                checkAllGroup: [],
                visibleIcon: true,
                checked: false,
                uploadUrl: '/customMap/img/upload.as?v=' + new Date().getTime(),
                imgData: {
                    imgFile: 'img'
                },
                imgUrl: '',
                data: [],
                loading: false,
                mapId: 0,
                loadText: '正在加载...',
                dataMap: [],
                list: [],
                nWidth: 0,
                curWidth: 0,
                curHeight: 0,
                pageNo: 1,
                pageSize: 20,
                myIcon: myIcon,
                fileList: [],
                nHeight: 0
            };
        },

        // created () {
        //     window.onresize = () => {
        //         let _height;
        //         if (window.innerHeight < 969) {
        //             _height = 969;
        //         } else {
        //             _height = window.innerHeight;
        //         }
        //         store.commit('uploadHeight', _height - 208);
        //         this.queryList();
        //         this.queryMapInfos();
        //     };
        // },
        mounted () {
            this.init();
        },
        methods: {
            handleCheckAllChange (val) {
                this.checkAllGroup = val
                    ? this.list.map((item) => {
                        return item.name;
                    })
                    : [];
                this.isIndeterminate = false;
            },
            handleCheckedTypesChange (value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.list.length;
                this.isIndeterminate =
                    checkedCount > 0 && checkedCount < this.list.length;
            },
            init () {
                //         this.findProperty();
                this.queryList();
                //         this.queryMapInfos('mounted');
            },
            //     onloaded () {
            //         return new Promise((resolve) => {
            //             document.querySelector('.ecology').onload = () => {
            //                 resolve();
            //             };
            //         });
            //     },
            handleChange (val) {
                let params = {
                    useCustomMap: val.toString()
                };
                saveStaffProperty(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误,请刷新后重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新后重试'
                            });
                        }
                });
            },
            handleSuccess (response, file, fileList) {
                if (response.success) {
                    this.$Message.success({
                        content: response.message
                    });
                    this.imgUrl = response.data;
                } else {
                    this.$Message.error({
                        content: response.message
                    });
                }
            },
            handleBefore (file) {
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    this.$Message.error({
                        content: '上传图片大小不能超过 1MB!'
                    });
                } else {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (event) {
                        let img = new Image();
                        img.src = event.target.result;
                        img.onload = () => {
                            this.nWidth = img.width;
                            this.nHeight = img.height;
                        };
                    };
                }
                return isLt1M;
            },
            findProperty () {
                findStaffProperty({ property: 'CUSTOM_MAP' })
                    .then((res) => {
                        if (res.success) {
                            this.checked = JSON.parse(res.data);
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
            queryList (callBack) {
                let params = {
                    params: {
                        keyword: ''
                    },
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                };
                queryProject4Select(params)
                    .then((res) => {
                        if (res.success) {
                            let data = res.datas;
                            if (!data) data = [];
                            let len = this.list.length;
                            this.list = this.list.concat(data);
                            if (data && data.length === 0 && !len) {
                                this.loadText = '没有找到相关数据';
                            } else if (data && data.length < 20) {
                                this.loadText = '暂无更多数据';
                            } else {
                                this.loading = false;
                            }
                            callBack && callBack();
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
            //     queryMapInfos (lifeCycle) {
            //         queryMapInfo({})
            //             .then((res) => {
            //                 if (res.success) {
            //                     let _this = this;
            //                     this.imgUrl = res.imgUrl;
            //                     this.mapId = res.mapId;
            //                     this.data = res.data;
            //                     this.dataMap = this.data.map((item) => {
            //                         return item.projectCode;
            //                     });
            //                     this.$nextTick(async () => {
            //                         if (lifeCycle === 'mounted') await this.onloaded();
            //                         this.data.map((item) => {
            //                             this.curWidth = window.getComputedStyle(
            //                                 document.querySelector('.ecology')
            //                             ).width;
            //                             this.curHeight = window.getComputedStyle(
            //                                 document.querySelector('.ecology')
            //                             ).height;
            //                             this.curWidth = Number(
            //                                 this.curWidth.substring(0, this.curWidth.length - 2)
            //                             );
            //                             this.curHeight = Number(
            //                                 this.curHeight.substring(0, this.curHeight.length - 2)
            //                             );
            //                             this.$refs[
            //                                 `project-name-${item.projectCode}`
            //                             ][0].style.position = 'absolute';
            //                             this.$refs[
            //                                 `project-name-${item.projectCode}`
            //                             ][0].style.marginTop =
            //                                 -this.$refs[`project-name-${item.projectCode}`][0]
            //                                 .offsetHeight + 'px';
            //                             this.$refs[
            //                                 `project-name-${item.projectCode}`
            //                             ][0].style.marginLeft =
            //                                 -this.$refs[`project-name-${item.projectCode}`][0]
            //                                 .offsetWidth /
            //                                 2 +
            //                                 'px';
            //                             let element = this.$refs[`project-${item.projectCode}`][0];
            //                             const position = {
            //                                 x: (this.curWidth / item.curImgWidth) * item.offsetX,
            //                                 y: (this.curHeight / item.curImgHeight) * item.offsetY
            //                             };
            //                             element.style.transform = `translate(${
            //                                 (this.curWidth / item.curImgWidth) * item.offsetX +
            //                                 ((this.curWidth / item.curImgWidth) * 21 - 21) / 2
            //                             }px, ${
            //                                 (this.curHeight / item.curImgHeight) * item.offsetY +
            //                                 ((this.curHeight / item.curImgHeight) * 34 - 34)
            //                             }px)`;
            //                             interact(element).draggable({
            //                                 listeners: {
            //                                     start (event) {
            //                                         // console.log(event.type, event.target)
            //                                     },
            //                                     move (event) {
            //                                         position.x += event.dx;
            //                                         position.y += event.dy;
            //                                         element.style.transform = `translate(${position.x}px, ${position.y}px)`;
            //                                     },
            //                                     end (event) {
            //                                         let params = {
            //                                             mapId: _this.mapId,
            //                                             projectCode: item.projectCode,
            //                                             offsetX: position.x,
            //                                             offsetY: position.y,
            //                                             curImgWidth: Number(
            //                                                 window
            //                                                     .getComputedStyle(
            //                                                         document.querySelector('.ecology')
            //                                                     )
            //                                                     .width.substring(
            //                                                         0,
            //                                                         window.getComputedStyle(
            //                                                             document.querySelector('.ecology')
            //                                                         ).width.length - 2
            //                                                     )
            //                                             ),
            //                                             curImgHeight: Number(
            //                                                 window
            //                                                     .getComputedStyle(
            //                                                         document.querySelector('.ecology')
            //                                                     )
            //                                                     .height.substring(
            //                                                         0,
            //                                                         window.getComputedStyle(
            //                                                             document.querySelector('.ecology')
            //                                                         ).height.length - 2
            //                                                     )
            //                                             )
            //                                         };
            //                                         _this.saveMap(params);
            //                                     }
            //                                 }
            //                             });
            //                         });
            //                     });
            //                 } else if (res.code === '-1') {
            //                 } else {
            //                     if (res.message) {
            //                         this.$Message.error({
            //                             content: res.message
            //                         });
            //                     } else {
            //                         this.$Message.error({
            //                             content: '未知错误,请刷新重试'
            //                         });
            //                     }
            //                 }
            //             })
            //             .catch((err) => {
            //                 if (err) {
            //                     this.$Message.error({
            //                         content: '未知错误,请刷新重试'
            //                     });
            //                 }
            //         });
            //     },
            handleClose (row, index) {
                delMapDetail({ id: row.id })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.queryMapInfos();
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message,
                                    type: 'error'
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
            handleClick (row) {
                if (this.imgUrl === '') {
                    this.$Message.error({
                        content: '未上传底图'
                    });
                    return false;
                }
                if (this.dataMap.indexOf(row.code) !== -1) {
                    this.handleClose(this.data[this.dataMap.indexOf(row.code)]);
                } else {
                    let params = {
                        mapId: this.mapId,
                        projectCode: row.code,
                        offsetX: 200,
                        offsetY: 60,
                        curImgWidth: Number(
                            window
                                .getComputedStyle(document.querySelector('.ecology'))
                                .width.substring(
                                    0,
                                    window.getComputedStyle(document.querySelector('.ecology'))
                                        .width.length - 2
                                )
                        ),
                        curImgHeight: Number(
                            window
                                .getComputedStyle(document.querySelector('.ecology'))
                                .height.substring(
                                    0,
                                    window.getComputedStyle(document.querySelector('.ecology'))
                                        .height.length - 2
                                )
                        )
                    };
                    this.saveMap(params);
                }
            },
            saveMap (params) {
                saveMapDetail(params)
                    .then((res) => {
                        if (res.success) {
                            this.queryMapInfos();
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    message: res.message
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
            load () {
                this.loading = true;
                this.pageNo += 1;
                this.queryList();
            }
        }
    };
</script>

<style lang="less" scoped>
.wrap {
  position: relative;
}
.static-upload {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #eeeeee;
  width: 100px;
  height: 100%;
}
.ecology {
  position: absolute;
  max-width: 100%;
}
.item {
  margin-bottom: 18px;
  z-index: 9999;
}
.item-copy {
  display: inline-block;
  position: absolute;
  touch-action: none;
  z-index: 999;
  span {
    padding: 2px 5px;
    display: inline-block;
    border: 1px solid #fff;
    border-radius: 3px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.el-scrollbar__wrap {
  overflow-x: hidden;
  .custom-check {
    .el-checkbox__label:hover {
      color: #fff;
    }
  }
}
.project-icon {
  font-size: 0;
}
.fs-14 {
  padding: 5px;
  border: 1px solid #daa22f;
  margin: 5px;
}
.icon-fs {
  margin-left: 150px;
}
.not-allowed {
  cursor: not-allowed;
}
.img-wrap {
  position: relative;
}
.c-default:hover {
  color: #fff !important;
}
</style>
