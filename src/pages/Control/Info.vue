<template>
  <div id="info">
      <div class="theader">
        <div class="left">
          <div class="bor"></div>
          <span>基本信息</span>
        </div>
        <div class="right" style="display:flex">
            <Upload class="upload"
                    ref="upload"
                    :action="uploadUrl"
                    :name="imgData.name"
                    :data="imgData"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                    @mouseover.native="flag = true"
                    :show-upload-list="false"
                    :format="['jpg', 'jpeg', 'png']"
                    :max-size="2048"
                    multiple
                >
                <Button class="btn"><i class="icon-v5 icon-v5-upload-images"></i></Button>
            </Upload>
            <Poptip
              placement="bottom-start"
              trigger="hover"
              v-if="others.imsi"
              >
              <div slot="content">
                <Row style="display: flex;align-items: center;">
                  <Col :span="21">SIM信息</Col>
                  <Col :span="3"><span style="color:#007eff" @click="simRefresh">刷新</span></Col>
                </Row>
                <Form :label-width="80" >
                    <FormItem :label="'IMSI' + ':' + '\xa0\xa0'"><span>{{ others.imsi }}</span></FormItem>
                    <FormItem :label="'ICCID' + ':' + '\xa0\xa0'"><span v-if="others.iccid">{{ others.iccid }}</span></FormItem>
                    <FormItem :label="'过期时间' + ':' + '\xa0\xa0'"><span v-if="others.expireDate">{{ others.expireDate }}</span></FormItem>
                    <FormItem :label="'更新时间' + ':' + '\xa0\xa0'"><span v-if="others.simUpdateDate">{{ others.simUpdateDate }}</span></FormItem>
                </Form>
              </div>
              <Button class="btn"><i class="icon-v5 icon-v5-ziyuanguanli-simkaguanli"></i></Button>
            </Poptip >

        </div>

      </div>
      <div class="content">
        <Row class="rowH">
            <Col :span="8">
            <div class="avat">
                 <Avatar
                fit="cover"
                shape="square"
                @mouseover.native="flag = true"
                @mouseout.native="flag = false"
                :src="url"
                style="width: 140px; height: 140px;border: 1px solid #485661"
                :preview-src-list="srcList"
              />
              <span v-show="onlineStatus === 1" class="c-success pa bg1">在线</span>
              <span v-show="onlineStatus === 0"><span class="c-danger pa bg2">离线</span></span>
              <span v-show="onlineStatus === -1" class="c-info pa bg3">脱线</span>
            </div>

            </Col>
            <Col :span="16">
                <Row :gutter="16" class="detail">
                    <Col :span="12">
                        <Poptip :transfer="true" trigger="click" v-model="aliasFlag" width="250" @on-popper-hide="aliasFlag = false; aliasName = $store.state.aliasName">
                            <div class="devic">
                                <span>设备别名:</span>
                                <span class="num">{{ aliasName }}</span>
                            </div>
                            <div style="text-align: right; margin: 5px 0 0" slot="content">
                                  <Button @click="handleInfo(mac, aliasName, 'alias')">确定</Button>
                                  <Button @click="aliasName = $store.state.aliasName;aliasFlag = false">取消</Button>
                            </div>
                            <div slot="title" @mouseover="aliasIndex = mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
                                 <div class="ellipsis">
                                     <Input class="input" maxlength="20" show-word-limit v-model.trim="aliasName" placeholder="请输入设备别名"></Input>
                                 </div>
                            </div>
                        </Poptip>
                    </Col>
                    <Col :span="12">
                    <span>版本:</span>
                    <span class="ml-20 num" v-show="others.version !== undefined">{{others.version }}</span>
                    </Col>
                </Row>
                <Row :gutter="16" class="detail">
                    <Col :span="12">
                        <span>设备ID:</span>
                        <span class="ml-20 num">{{info.mac }}</span>
                    </Col>
                </Row>
                <Row :gutter="16" class="detail">
                    <Col :span="12">
                        <Poptip
                            width="250"
                            trigger="click"
                            :append-to-body="false"
                            v-model="linkmanFlag"
                            :transfer="true"
                            @on-popper-hide="linkmanFlag = false; linkman = info.linkman">
                              <div class="devic">
                                <span>联系人1:</span>
                                <span class="num">{{ info.linkman !== undefined ? info.linkman : '' }}</span>
                              </div>
                              <div style="text-align: right; margin: 5px 0 0"  slot="content">
                                <Button  @click="handleInfo(mac, linkman, 'linkman')">确定</Button>
                                <Button  @click="linkmanFlag = false">取消</Button>
                              </div>
                              <div slot="title" @mouseover="linkmanIndex = mac" @mouseout="linkmanIndex = -1" class="pointer pRelative">
                                <div class="ellipsis" :title="info.linkman">
                                  <Input class="input" maxlength="20" show-word-limit v-model.trim="linkman" placeholder="请输入联系人"></Input>
                                </div>
                                <i slot="title" v-if="linkmanIndex === mac  || $func.checkDataType(linkman)" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-linkman' : 'unusual-linkman'"></i>
                              </div>
                        </Poptip>
                    </Col>
                    <Col :span="12">
                       <Poptip
                            placement="top"
                            width="250"
                            trigger="click"
                            :append-to-body="false"
                            v-model="linkmanTelFlag"
                            @on-popper-hide="linkmanTelFlag = false; linkmanTel = info.linkmanTel">
                            <div class="devic">
                                <span>联系人方式:</span>
                                <span class="num">{{ info.linkmanTel }}</span>
                              </div>
                              <div style="text-align: right; margin: 5px 0 0"  slot="content">
                                <Button @click="handleInfo(mac, linkmanTel, 'linkmanTel')">确定</Button>
                                <Button @click="linkmanTelFlag = false">取消</Button>
                              </div>
                              <div slot="title" @mouseover="linkmanTelIndex = mac" @mouseout="linkmanTelIndex = -1" class="pointer pRelative">
                                <div class="ellipsis" :title="info.linkmanTel">
                                  <Input class="input"  maxlength="20" show-word-limit v-model="linkmanTel" placeholder="请输入联系电话1"></Input>
                                </div>
                                <i slot="title" v-if="linkmanTelIndex === mac || $func.checkDataType(info.linkmanTel)" class="el-icon-edit pointer unit-icon"></i>
                              </div>
                        </Poptip>
                    </Col>
                </Row>
                <Row :gutter="16" class="detail">
                    <Col :span="12">
                        <Poptip
                            placement="top"
                            width="250"
                            trigger="click"
                            :append-to-body="false"
                            v-model="linkman2Flag"
                            @on-popper-hide="linkman2Flag = false; linkman2 = info.linkman2">
                            <div class="devic">
                                <span>联系人2:</span>
                                <span class="num">{{ info.linkman2 !== undefined ? info.linkman2 : '' }}</span>
                              </div>
                              <div style="text-align: right; margin: 5px 0 0" slot="content">
                                <Button @click="handleInfo(mac, linkman2, 'linkman2')">确定</Button>
                                <Button @click="linkman2Flag = false">取消</Button>
                              </div>
                              <div slot="title" @mouseover="linkman2Index = mac" @mouseout="linkman2Index = -1" class="pointer pRelative">
                                <div class="ellipsis" style="margin-top: 0;" :title="info.linkman2">
                                  <Input class="input" maxlength="20" show-word-limit v-model.trim="linkman2" placeholder="请输入联系人"></Input>
                                </div>
                                <i slot="title" v-if="linkman2Index === mac || $func.checkDataType(linkman2)" class="el-icon-edit pointer"></i>
                              </div>
                        </Poptip>
                    </Col>
                    <Col :span="12">
                        <Poptip
                            placement="top"
                            width="250"
                            trigger="click"
                            :append-to-body="false"
                            v-model="linkmanTel2Flag"
                            @on-popper-hide="linkmanTel2Flag = false; linkmanTel2 = info.linkmanTel2">
                            <div class="devic">
                                <span>联系人方式:</span>
                                <span class="num">{{ info.linkmanTel2 }}</span>
                              </div>

                              <div style="text-align: right; margin: 5px 0 0" slot="content">
                                <Button @click="handleInfo(mac, linkmanTel2, 'linkmanTel2')">确定</Button>
                                <Button @click="linkmanTel2Flag = false">取消</Button>
                              </div>
                              <div slot="title" @mouseover="linkmanTel2Index = mac" @mouseout="linkmanTel2Index = -1" class="pointer pRelative">
                               <Input class="input" maxlength="20" show-word-limit v-model="linkmanTel2" placeholder="请输入联系电话2"></Input>
                                <i slot="title" v-if="linkmanTel2Index === mac || $func.checkDataType(info.linkmanTel2)" class="el-icon-edit pointer unit-icon"></i>
                              </div>
                        </Poptip>
                    </Col>
                </Row>
            </Col>
        </Row>
      </div>

  </div>
</template>
<script>
    import store from '@/store'
    import { queryBoxDetails, checkMacOnlineStatus, macAlias, refreshSim } from '@/api/control/index'
    export default {
        props: {
            mac: {
                type: String
            }
        },
        data () {
            return {
                info: [],
                others: {
                    imsi: '',
                    iccid: '',
                    expireDate: '',
                    simUpdateDate: ''
                },
                formInline: {},
                expireDay: '',
                url: '',
                srcList: [''],
                timerID: null,
                flag: false,
                uploadUrl: '/box/icon/upload.as?v=' + new Date().getTime(),
                imgData: {
                    name: 'imgFile',
                    mac: ''
                },
                onlineStatus: '',
                onlineTime: '',
                input: '',
                aliasName: this.$store.state.aliasName,
                aliasFlag: false,
                aliasIndex: -1,
                linkman: '',
                linkmanFlag: false,
                linkmanIndex: -1,
                linkmanTel: '',
                linkmanTelFlag: false,
                linkmanTelIndex: -1,
                linkman2: '',
                linkman2Flag: false,
                linkman2Index: -1,
                linkmanTel2: '',
                linkmanTel2Flag: false,
                linkmanTel2Index: -1,
                imgUrls: ''
            }
        },

        mounted () {
            this.$nextTick(function () {
                this.init()
            })
        },
        methods: {
            init () {
                this.queryInfo()
                this.queryStatus()
            },
            queryInfo () {
                let params = {
                    'mac': this.mac
                }
                queryBoxDetails(params)
                    .then(res => {
                        if (res.success) {
                            this.info = res.data
                            this.linkman = res.data.linkman
                            this.linkmanTel = res.data.linkmanTel
                            this.linkman2 = res.data.linkman2
                            this.linkmanTel2 = res.data.linkmanTel2
                            this.imgData.mac = res.data.mac
                            this.aliasName = res.data.name
                            store.commit('aliasName', res.data.name)
                            store.commit('customAlarm', res.data.others.customAlarm)
                            store.commit('classifyLabel', res.data.others.classifyLabel)
                            store.commit('sortBUR', { build: res.data.build, unit: res.data.unit, room: res.data.room, linkman: res.data.linkman, linkman2: res.data.linkman2, linkmanTel: res.data.linkmanTel, linkmanTel2: res.data.linkmanTel2 })
                            this.others = {
                                imsi: res.data.others.imsi,
                                iccid: res.data.others.iccid,
                                expireDate: res.data.others.expireDate,
                                simUpdateDate: res.data.others.simUpdateDate,
                                address: res.data.others.address,
                                version: res.data.others.version,
                                online: res.data.others.online
                            }
                            if (this.info.equipmentType === 1) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Airopen-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Airopen-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Airopen-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Airopen-offline.png']
                                }
                            } else if (this.info.equipmentType === 2) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/ElectricalFire-Online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/ElectricalFire-Online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/ElectricalFire-Offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/ElectricalFire-Offline.png']
                                }
                            } else if (this.info.equipmentType === 3) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Stralsund-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Stralsund-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Stralsund-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Stralsund-offline.png']
                                }
                            } else if (this.info.equipmentType === 4 || this.info.equipmentType === 5) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/PressureLevel-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/PressureLevel-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/PressureLevel-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/PressureLevel-offline.png']
                                }
                            } else if (this.info.equipmentType === 6) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Smoke-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Smoke-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Smoke-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/Smoke-offline.png']
                                }
                            } else if (this.info.equipmentType === 7) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/FlammableGas-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/FlammableGas-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/FlammableGas-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/FlammableGas-offline.png']
                                }
                            } else if (this.info.equipmentType === 8) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/FlammableGas-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/FlammableGas-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/FlammableGas-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/FlammableGas-offline.png']
                                }
                            } else if (this.info.equipmentType === 10) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-offline.png']
                                }
                            } else if (this.info.equipmentType === 11) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/renke-wsd-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/renke-wsd-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/renke-wsd-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/renke-wsd-offline.png']
                                }
                            } else if (this.info.equipmentType === 12) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/emeter-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/emeter-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/emeter-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/emeter-offline.png']
                                }
                            } else if (this.info.equipmentType === 13) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-gas-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-gas-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-gas-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-gas-offline.png']
                                }
                            } else if (this.info.equipmentType === 14) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/renke-gzd-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/renke-gzd-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/zac-gas-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/renke-gzd-offline.png']
                                }
                            } else if (this.info.equipmentType === 15) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/common-water-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/common-water-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/common-water-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/common-water-offline.png']
                                }
                            } else if (this.info.equipmentType === 16) {
                                if (this.others.online === 1) {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/chaobiaomao-water-online.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/chaobiaomao-water-online.png']
                                } else {
                                    this.url = this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/chaobiaomao-water-offline.png'
                                    this.srcList = [this.info.imgUrl ? this.info.imgUrl : 'http://sndtest.com/static/images/chaobiaomao-water-offline.png']
                                }
                            }
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error(
                                '未知错误，请刷新重试'
                            )
                        }
                    })
            },
            queryStatus () {
                let params = {
                    'mac': this.mac
                }
                checkMacOnlineStatus(params)
                    .then(res => {
                        if (res.success) {
                            this.onlineStatus = res.data.online
                            this.onlineTime = res.data.onlineTime
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            })
                        }
                    })
            },
            // handleBeforeUpload (file) {
            //     this.imgUrls = URL.createObjectURL(file);
            // },
            beforeUpload (file) {
                const isLt1M = file.size / 1024 / 1024 < 1
                if (!isLt1M) {
                    this.$Message.error({
                        content: '上传图片大小不能超过 1MB!'
                    })
                }
                return isLt1M
            },
            handleSuccess (res, file) {
                if (res.success) {
                    this.queryInfo()
                    this.queryStatus()
                } else if (res.code === '-1') {
                } else {
                    this.$Message.error({
                        content: res.message
                    })
                }
            },
            handleInfo (mac, value, type) {
                let params = {
                    mac: mac
                }
                if (type === 'linkmanTel' || type === 'linkmanTel2') {
                    if (!this.$func.checkPhone(value)) {
                        this.$Message.error({
                            content: '号码格式错误'
                        })
                        return false
                    }
                }
                if (type === 'alias') params.name = value
                if (type === 'linkman') params.linkman = value
                if (type === 'linkmanTel') params.linkmanTel = value
                if (type === 'linkman2') params.linkman2 = value
                if (type === 'linkmanTel2') params.linkmanTel2 = value
                macAlias(params)
                    .then(res => {
                        if (res.success) {
                            this.$Message.success({
                                content: (type === 'alias' ? '设备别名' : '') + '修改成功' + '！'
                            })
                            if (type === 'alias') {
                                store.commit('aliasName', value)
                                this.aliasFlag = false
                            } else if (type === 'linkman') {
                                this.info.linkman = value
                                this.linkmanFlag = false
                            } else if (type === 'linkmanTel') {
                                this.info.linkmanTel = value
                                this.linkmanTelFlag = false
                            } else if (type === 'linkman2') {
                                this.info.linkman2 = value
                                this.linkman2Flag = false
                            } else if (type === 'linkmanTel2') {
                                this.info.linkmanTel2 = value
                                this.linkmanTel2Flag = false
                            }
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                })
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            })
                        }
                    })
            },
            simRefresh () {
                try {
                    let params = {
                        mac: this.mac,
                        imsi: this.others.imsi ? this.others.imsi : ''
                    }
                    refreshSim(params)
                        .then(res => {
                            if (res.success) {
                                if (res.data) {
                                    this.others = {
                                        imsi: res.data.imsi,
                                        iccid: res.data.iccid,
                                        expireDate: res.data.expireDate,
                                        simUpdateDate: res.data.simUpdateData
                                    }
                                    this.$Message.success({
                                        content: res.message

                                    })
                                } else {
                                    this.$Message.success({
                                        content: res.message

                                    })
                                }
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
                            }
                        })
                } catch (error) {
                    this.$Message.error({
                        content: '刷新失败'
                    })
                }
            }
        },
        destroyed () {
            clearTimeout(this.timerID)
        },
        watch: {
            '$route' (to, from) {
                if (from.path === '/ConfigurationList') this.queryInfo()
            }
        }
    }
</script>
<style lang="less" scoped>
.ivu-form-item{
    margin-bottom: 0px;
}
/deep/.ivu-form-item-label {
    color: #8e9095 !important;
}
.theader{
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    border-bottom: 1px solid #5e626c;
    span{
        height: 32px;
        line-height: 32px;
    }
    .bor{
        width: 2px;
        height: 14px;
        background: #0372e5;
        margin-right: 10px;
    }
    .ivu-btn{
      padding: 0 12px;
    }
}
.content{
    padding: 20px;
    .rowH{
        height: 180px;
    }
    .title{
        border: 1px solid #fff;
        padding:  4px 16px;
    }
    /deep/.avat{
        width: 140px;
        position: relative;
        .pa{
            position: absolute;
            right: 0;
            font-size: 12px;
            font-family: PingFang SC;
            padding: 2px 4px;
            margin: 5px;
        }
        .bg1{
            background:rgba(14, 209, 101,0.3) ;
        }
        .bg2{
            background:rgba(242, 78, 76,0.3) ;
        }
        .bg3{
            background:rgba(153, 153, 153,0.3) ;
        }
    }
    .detail{
        padding: 10px 0px;
        .num{
            color: #fff;
            margin-left: 10px;
        }
    }

}

</style>
