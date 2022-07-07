<template>
  <div class="Maintenance">
    <Form :model="form" ref="form" :label-width="100" :rules="rules">
      <Row>
        <Col span="24">
          <FormItem label="所属项目:">
            {{ $store.state.maintenanceObj.projectName ? $store.state.maintenanceObj.projectName : $store.state.fullName }}
          </FormItem>
          <FormItem label="设备号:">
            {{ $store.state.maintenanceObj.mac ? $store.state.maintenanceObj.mac : this.$store.state.mac }}
          </FormItem>
          <FormItem label="设备别名:">
            <Col span="12">
            {{ $store.state.maintenanceObj.boxName }}
            </Col>
            <Col span="12">
                <span class="datetime">
                    <span>维保时间:</span>
                    <DatePicker v-model="form.maintenanceTime"
                        type="date"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        :editable="false"
                        placeholder="请选择日期时间"
                        :clearable="false"
                        style="width: 200px">
                    </DatePicker>
                </span>
            </Col>
          </FormItem>

          <FormItem label="维保内容:" prop="maintenanceContent">
            <Input v-model="form.maintenanceContent" type="textarea" :rows="4"  prop="maintenanceContent" />
          </FormItem>
          <FormItem label="故障内容:" prop="malfunctionContent">
            <Input v-model="form.malfunctionContent" type="textarea" :rows="4" prop="malfunctionContent" />
          </FormItem>
          <div>
            <FormItem label="处理结果:" style="margin-bottom:0">
                <Input v-model="form.handledResult" type="textarea" :rows="4" />
            </FormItem>
            <div class="title">小提示:未填写处理结果的工单，保存后状态将变成：处理中。填写处理结果的工单，状态变成:已完成</div>
          </div>

           <FormItem label="意见建议:">
            <Input v-model="form.suggest" type="textarea" :rows="4" />
          </FormItem>
          <FormItem label="设置图片:">
              <Row style="justify-content: space-between; width: 100%;">
                <Col span="12" style="display:flex;">
                    <span>维保前:</span>
                    <Upload
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :format="['jpg', 'jpeg', 'png']"
                        :max-size="2048"
                        :on-success="handleSuccess"
                        :before-upload="beforeUpload"
                        multiple
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

                </Col>

            <Col span="12" style="display:flex">
            <span>维保后:</span>
                <Upload
                   :show-upload-list="false"
                   :default-file-list="afterSrcList"
                   :format="['jpg', 'jpeg', 'png']"
                   :max-size="2048"
                   :on-success="handleAfterSuccess"
                   :before-upload="AfterUpload"
                   multiple
                   type="drag"
                   :action="afterUploadUrl"
                   name="afterImgFile"
                   :data="afterImgData"
                   style="display: inline-block; width: 58px"
                >
                <div style="width: 58px; height: 58px; line-height: 58px">
                  <Icon type="md-add" size="20"></Icon>
                </div>
                </Upload>

            </Col>
              </Row>

          </FormItem>
          <FormItem>
              <Row style="width:100%">
                  <Col :span="12" v-if="imageUrl">
                     <div class="demo-upload-list" v-if="demoImg1===true" >
                        <img  :src="imageUrl"/>
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-trash-outline" @click.native="handleRemove('1')"></Icon>
                        </div>
                     </div>
                  </Col>
                  <Col :span="12"  v-if="afterImageUrl">
                    <div class="demo-upload-list"  v-if="demoImg2===true">
                        <img :src="afterImageUrl"/>
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-trash-outline" @click.native="handleRemove('2')"></Icon>
                        </div>
                    </div>
                  </Col>
              </Row>
          </FormItem>
        </Col>
      </Row>
      <Row >
        <Col span="24">
        <FormItem class="footer">
            <Button type="primary" @click="submitForm('form')">确定</Button>
            <Button plain @click="cancelForm">取消</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
    import store from '@/store'
    import { updateMaintenance, modifyBoxsChnlClearAlarm, modifyBoxsChnlRemoteMute } from '@/api/safetyMonitor/allWarn';
    export default {
        props: {
            maintenanceObj: {
                type: [Object, Array],
                default () {
                    return []
                }
            }
        },
        watch: {

        },
        data () {
            return {
                mute: false,
                reset: false,
                defaultList: [],
                imgUrls: '',
                uploadList: [],
                demoImg1: true,
                demoImg2: true,
                form: {
                    maintenanceContent: this.$store.state.maintenanceObj.maintenanceContent ? this.$store.state.maintenanceObj.maintenanceContent : '',
                    malfunctionContent: this.$store.state.maintenanceObj.malfunctionContent ? this.$store.state.maintenanceObj.malfunctionContent : '',
                    handledResult: this.$store.state.maintenanceObj.handledResult ? this.$store.state.maintenanceObj.handledResult : '',
                    suggest: this.$store.state.maintenanceObj.suggest ? this.$store.state.maintenanceObj.suggest : '',
                    maintenanceTime: this.$store.state.maintenanceObj.maintenanceTime ? this.$store.state.maintenanceObj.maintenanceTime + ':00' : this.$func.getNowFormatDateTime() + ':00',
                    imgUrls: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';') : []
                },
                rules: {
                    maintenanceContent: [
                        { required: true, message: '请输入维保内容', trigger: 'blur' }
                    ],
                    malfunctionContent: [
                        { required: true, message: '请输入故障内容呢', trigger: 'blur' }
                    ]
                },
                action:
                    `${this.$func.ctxPaths()}/maintenance/imgUrl/before/upload.as?v=` +
                    new Date().getTime(),
                beforeImgData: { name: 'beforeImgFile' },
                afterImgData: { name: 'afterImgFile' },
                uploadUrl: '/maintenance/imgUrl/before/upload.as?v=' + new Date().getTime(),
                afterUploadUrl: '/maintenance/imgUrl/after/upload.as?v=' + new Date().getTime(),
                imageUrl: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[0] : '',
                srcList: [this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[0] : ''],
                afterImageUrl: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[1] : '',
                afterSrcList: [this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[1] : '']
            }
        },
        mounted () {

            // this.uploadList = this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[0] : '';
        },
        methods: {
            handleAlarm () {
                this.$emit('hanleAlarm')
            },
            submitForm (formName) {
                let params = this.form
                params.projectCode = this.$store.state.maintenanceObj.projectCode ? this.$store.state.maintenanceObj.projectCode : this.$store.state.projectCode
                params.mac = this.$store.state.maintenanceObj.mac ? this.$store.state.maintenanceObj.mac : this.$store.state.mac
                params.id = this.$store.state.maintenanceObj.id ? this.$store.state.maintenanceObj.id : ''
                params.alarmId = this.$store.state.alarmId ? this.$store.state.alarmId : ''
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        params.imgUrls = params.imgUrls.join(';')
                        if (this.mute) {
                            this.handleControl('REMOTE_MUTE')
                        }
                        if (this.reset) {
                            this.handleControl('CLEAR_ALARM')
                        }
                        updateMaintenance(params)
                            .then(res => {
                                if (res.success) {
                                    this.$Message.success({
                                        content: res.message
                                    })
                                    this.cancelForm()
                                    this.handleAlarm()
                                } else if (res.code === '-1') {
                                } else {
                                    this.$Message.error({
                                        content: res.message
                                    })
                                }
                            })
                            .catch(err => {
                                if (err) {
                                    this.$Message.error({
                                        content: '未知错误，请刷新重试'
                                    })
                                    this.cancelForm()
                                }
                            })
                            .finally(() => {})
                    } else {
                        return false
                    }
                })
            },
            handleControl (cmd) {
                let params = {
                    macs: this.maintenanceBoxObj.mac,
                    cmd: cmd,
                    nodeNo: this.maintenanceBoxObj.chnlAddr ? this.maintenanceBoxObj.chnlAddr : this.maintenanceBoxObj.addr ? this.maintenanceBoxObj.addr : this.maintenanceBoxObj.channelAddr
                }
                if (cmd === 'CLEAR_ALARM' && this.reset) {
                    modifyBoxsChnlClearAlarm(params)
                        .then(res => {
                            if (res.success) {
                                this.$Message.success({
                                    content: '命令已提交，生效中..'
                                })
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error({
                                    content: res.data[0].errorMsg
                                })
                            }
                        })
                        .catch(err => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                })
                            }
                        })
                } else if (cmd === 'REMOTE_MUTE' && this.mute) {
                    modifyBoxsChnlRemoteMute(params)
                        .then(res => {
                            if (res.success) {
                                this.$Message.success({
                                    content: '命令已提交，生效中..'
                                })
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error({
                                    content: res.data[0].errorMsg
                                })
                            }
                        })
                        .catch(err => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                })
                            }
                        })
                }
            },
            // 取消
            cancelForm () {
                store.dispatch('resetMaintenanceObj')
                this.$emit('close-maintenance')
            },
            handleSuccess (res) {
                this.demoImg1 = true
                if (res.success) {
                    this.form.imgUrls[1] = this.form.imgUrls[1] === undefined ? this.form.imgUrls[1] = '' : this.form.imgUrls[1]
                    this.form.imgUrls[0] = res.data
                } else if (res.code === '-1') {
                } else {
                    this.$Message.error(res.message);
                }
            },
            handleFormatError (file) {
                this.$Message.error('上传文件格式错误');
            },
            handleMaxSize (file) {
                // 超过2M
                this.$Message.error('图片不能大于2M');
            },
            // 图片大小判断
            beforeUpload (file) {
                this.imageUrl = URL.createObjectURL(file)
                this.srcList = [this.imageUrl]
                const isLt1M = file.size / 1024 / 1024 < 1
                if (!isLt1M) {
                    this.$Message.error('上传图片大小不能超过 1MB!')
                }
                return isLt1M
            },
            AfterUpload (file) {
                this.afterImageUrl = URL.createObjectURL(file)
                this.demoImg2 = true
                const isLt1M = file.size / 1024 / 1024 < 1
                if (!isLt1M) {
                    this.$Message.error('上传图片大小不能超过 1MB!')
                }
                return isLt1M
            },
            handleAfterSuccess (response, file, fileList) {
                if (response.success) {
                    this.form.imgUrls[0] = this.form.imgUrls[0] === undefined ? this.form.imgUrls[0] = '' : this.form.imgUrls[0]
                    this.form.imgUrls[1] = response.data
                    this.afterSrcList = [this.afterImageUrl]
                } else if (response.code === '-1') {
                } else {
                    this.$Message.error({ content: response.message })
                }
            },
            // 返回报错

            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                if (file === '1') {
                    this.demoImg1 = false

                    this.form.imgUrls[0] = ''
                } else if (file === '2') {
                    this.demoImg2 = false
                    this.form.imgUrls[1] = ''
                }
            }
        }
    }
</script>
<style lang="less" scoped>
.Maintenance{
    .title{
        text-align: center;
        color: #bcbcbc;
        margin-bottom: 20px;
        margin-right: 115px;
    }
  span{
    margin-right: 10px;

  }
  .footer{
      background-color: #1a202e;
      display: flex;
      justify-content: flex-end;
    button{
      margin: 0 10px;

    }
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
        margin:0px 4px;
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
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
}

</style>
