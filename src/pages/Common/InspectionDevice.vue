<template>
  <div id="Inspction">
    <div class="inspction" v-if="titleFlag">
      <Form
        label-position="left"
        ref="ruleForm"
        :rules="rules"
        size="small"
        :model="inspectionForm"
      >
        <FormItem field="time" required label="巡检时间">
          <DatePicker
            :editable="false"
            @on-change="timer"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="请选择日期"
            :clearable="false"
          >
          </DatePicker>
        </FormItem>
        <FormItem field="name" required label="巡检人">
          <Input clearable v-model="inspectionForm.name"></Input>
        </FormItem>
        <FormItem field="content" required label="巡检内容">
          <Input
            type="textarea"
            clearable
            :autosize="{ minRows: 2, maxRows: 5 }"
            v-model="inspectionForm.content"
          ></Input>
        </FormItem>
        <FormItem label="巡检结果" prop="result" class="MT">
          <Input
            v-model="inspectionForm.result"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="输入巡检结果"
          ></Input>
        </FormItem>
        <!-- 照片待完善  -->
        <FormItem class="MT" label="巡检照片">
          <Modal title="图片展示" v-model="visible">
            <img :src="imgUrls" v-if="visible" style="width: 100%" />
          </Modal>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
            type="drag"
            :action="action"
            name="beforeImgFile"
            :data="beforeImgData"
            style="display: inline-block; width: 58px"
          >
            <div style="width: 58px; height: 58px; line-height: 58px">
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>

          &nbsp;
          <div
            class="demo-upload-list"
            v-for="item in uploadList"
            :key="item.name"
          >
            <template>
              <img :src="item.imgUrl ? item.imgUrl : imgUrls" />
              <div class="demo-upload-list-cover">
                <!-- 获取大图 -->
                <Icon
                  type="ios-eye-outline"
                  @click.native="handleView(item.imgUrl)"
                ></Icon>
                <Icon
                  type="ios-trash-outline"
                  @click.native="handleRemove(item)"
                ></Icon>
              </div>
            </template>
          </div>
        </FormItem>
      </Form>
    </div>
    <div v-else style="height: 430px">
      <Table
        :data="tableData"
        :columns="columns3"
        style="width: 100%"
        height="430"
      ></Table>
    </div>
  </div>
</template>

<script>
    import {
        inspectionDetailQuery,
        inspectionDetailSave,
        infoDetail
    } from '@/api/public';
    export default {
        props: {
            inspectionData: {
                type: Object
            },
            infoData: {
                type: Object
            },
            titleFlag: {
                type: Boolean
            }
        },
        components: {},
        data () {
            return {
                uploadList: [],
                beforeImgData: { name: 'beforeImgFile' },

                action:
                    `${this.$func.ctxPaths()}/maintenance/imgUrl/before/upload.as?v=` +
                    new Date().getTime(),
                form: {
                    maintenanceContent: this.$store.state.maintenanceObj.maintenanceContent
                        ? this.$store.state.maintenanceObj.maintenanceContent
                        : '',
                    malfunctionContent: this.$store.state.maintenanceObj.malfunctionContent
                        ? this.$store.state.maintenanceObj.malfunctionContent
                        : '',
                    handledResult: this.$store.state.maintenanceObj.handledResult
                        ? this.$store.state.maintenanceObj.handledResult
                        : '',
                    suggest: this.$store.state.maintenanceObj.suggest
                        ? this.$store.state.maintenanceObj.suggest
                        : '',
                    maintenanceTime: this.$store.state.maintenanceObj.maintenanceTime
                        ? this.$store.state.maintenanceObj.maintenanceTime + ':00'
                        : this.$func.getNowFormatDateTime() + ':00',
                    imgUrls: this.$store.state.maintenanceObj.imgUrls
                        ? this.$store.state.maintenanceObj.imgUrls.split(';')
                        : []
                },
                imageUrl: this.$store.state.maintenanceObj.imgUrls
                    ? this.$store.state.maintenanceObj.imgUrls.split(';')[0]
                    : '',
                srcList: [
                    this.$store.state.maintenanceObj.imgUrls
                        ? this.$store.state.maintenanceObj.imgUrls.split(';')[0]
                        : ''
                ],
                defaultList: [],
                imgUrls: '',
                visible: false,
                columns3: [
                    {
                        title: '巡检日期',
                        key: 'completeTime',
                        width: 170,
                        align: 'center'
                    },
                    {
                        title: '巡检人',
                        key: 'completeStaffName',
                        width: 170,
                        align: 'center'
                    },
                    {
                        title: '巡检内容',
                        key: 'content'
                    }
                ],
                inspectionForm: {
                    name: '',
                    time: '',
                    result: '',
                    content: ''
                },
                tableData: [],
                rules: {
                    name: [
                        {
                            required: true,
                            message: '请输入巡检人',
                            trigger: 'blur'
                        }
                    ],
                    time: [{ required: true, message: '请输入日期时间', trigger: 'blur' }],
                    content: [
                        {
                            required: true,
                            message: '内容',
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        created () {},
        mounted () {
            this.init();
            this.infodetailData();
        },
        methods: {
            init () {
                if (!this.titleFlag) {
                    let params = {
                        projectCode: this.inspectionData.projectCode,
                        mac: this.inspectionData.macs
                    };
                    inspectionDetailQuery(params)
                        .then((res) => {
                            if (res.success) {
                                this.tableData = res.data;
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error({
                                    content: res.message
                                });
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
            infodetailData () {
                let param = {
                    type: this.infoData.type,
                    id: this.infoData.id
                };
                infoDetail(param).then((res) => {

                });
            },
            submitForm () {
                //
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            projectCode: this.inspectionData.projectCode,
                            macs: this.inspectionData.macs,
                            content: this.inspectionForm.content,
                            completeStaffName: this.inspectionForm.name,
                            completeTime: this.inspectionForm.time,
                            result: this.inspectionForm.result,
                            imgUrlList: this.form.imgUrls.join(';'), // 待完善 完善
                            id: ''
                        };
                        inspectionDetailSave(params)
                            .then((res) => {
                                if (res.success) {
                                    this.$Message.success({
                                        content: res.message
                                    });
                                    this.$emit('handleInspectionClose');
                                } else if (res.code === '-1') {
                                } else {
                                    this.$Message.error({
                                        content: res.message
                                    });
                                }
                            })
                            .catch((err) => {
                                if (err) {
                                    this.$Message.error({
                                        content: '未知错误,请刷新重试'
                                    });
                                }
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleFormatError (file) {
                this.$Message.error('上传文件格式错误');
            },
            handleMaxSize (file) {
                // 超过2M
                this.$Message.error('图片不能大于2M');
            },
            // 上传图片
            handleBeforeUpload (file) {
                this.imgUrls = URL.createObjectURL(file);

                const check = this.uploadList.length < 3;
                if (!check) {
                    this.$Notice.warning({
                        title: '不能超过5张图片'
                    });
                }
                return check;
            },
            handleSuccess (res, file) {
                this.uploadList.push({
                    imgUrl: this.imgUrls,
                    imgUrls: file.response.data
                });
            },
            beforeUpload (file) {
                this.imageUrl = URL.createObjectURL(file);

                this.srcList = [this.imageUrl];
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    this.$Message.error('上传图片大小不能超过 1MB!');
                }
                return isLt1M;
            },
            handleView (imgurl) {
                this.imgUrls = imgurl;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.uploadList.splice(fileList.indexOf(file), 1);
            },
            timer (item) {
                this.inspectionForm.time = item;
            }
        },
        watch: {}
    };
</script>

<style lang="less" scoped>
#Inspction .vxe-form-item__label {
  color: #606266;
}

#Inspction .vxe-form-item {
  margin-bottom: 60px;
}

.device-wrap {
  border: none;
  border: 1px solid #ebeef5;
  color: #606266;
}
.vxe-table__header-wrapper,
.vxe-table__body-wrapper th,
tr,
td {
  color: #606266;
  border-right: 1px solid #ebeef5;
}
.is-leaf {
  border-bottom: 1px solid #ebeef5;
}
.ivu-form-item {
  display: flex;
}
/deep/.ivu-form-item-label {
  width: 80px;
}
/deep/.ivu-form-item-content {
  width: 400px;
}
.demo-upload-list {
  display: inline-block;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin: 0px 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
