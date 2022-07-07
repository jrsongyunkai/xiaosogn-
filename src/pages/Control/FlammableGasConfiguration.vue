<template>
  <div id="flammableGasConfiguration">
    <Row style="margin: 0; padding: 20px">
      <Col :span="5">
        <div class="ellipsis">
          <span class="normal-label">设备号：{{ adjustment.mac }}</span>
        </div>
      </Col>
      <Col :span="8">
        <div>
          <Poptip
            placement="top"
            transfer
            v-model="aliasFlag"
            @on-popper-hide="adjustment.name = $store.state.aliasName"
          >
            <div
              @mouseover="aliasIndex = adjustment.mac"
              @mouseout="aliasIndex = -1"
              class="pointer pRelative"
            >
              <div class="ellipsis" :class="aliasFlag ? 'dashed' : ''">
                <span class="normal-label">
                  设备别名：{{ adjustment.name }}</span
                >
              </div>
              <i
                v-if="aliasIndex === adjustment.mac"
                class="el-icon-edit pointer normal-icon"
              ></i>
            </div>
            <div slot="content">
              <Input
                class="input"
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="adjustment.name"
                placeholder="请输入设备别名"
              ></Input>
              <div style="text-align: right; margin: 5px 0 0">
                <Button
                  type="primary"
                  size="small"
                  @click="handleAlias(adjustment.mac, adjustment.name)"
                  >确定</Button
                >
                <Button
                  size="small"
                  type="default"
                  @click="
                    adjustment.name = $store.state.aliasName;
                    aliasFlag = false;
                  "
                  >取消</Button
                >
              </div>
            </div>
          </Poptip>
        </div>
      </Col>
      <Col :span="11">
        <Row>
          <Col>
            <div>
              <Poptip
                placement="top"
                transfer
                v-model="buildFlag"
                @on-popper-hide="adjustment.build = $store.state.sortBUR.build"
              >
                <div slot="content">
                  <Input
                    class="input"
                    size="small"
                    maxlength="20"
                    show-word-limit
                    v-model.trim="adjustment.build"
                    placeholder="
                   请输入楼栋
                  "
                  ></Input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleSort(
                          adjustment.mac,
                          adjustment.build,
                          adjustment.unit,
                          adjustment.room,
                          'build'
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      size="small"
                      type="default"
                      @click="
                        adjustment.build = $store.state.sortBUR.build;
                        buildFlag = false;
                      "
                      >取消</Button
                    >
                  </div>
                </div>
                <div
                  @mouseover="buildIndex = adjustment.build"
                  @mouseout="buildIndex = -1"
                  class="pointer pRelative"
                >
                  <div :class="buildFlag ? 'dashed' : ''">
                    <span class="label normal-label"> 楼层信息：</span>
                    <span>{{ adjustment.build }}</span>
                  </div>
                  <!-- <Icon
                    type="md-create"
                    v-if="
                      buildIndex === adjustment.build ||
                      $func.checkDataType(adjustment.build)
                    "
                  /> -->
                </div>
              </Poptip>
            </div>
          </Col>
          <Col>
            <div>
              <Poptip
                placement="top"
                width="250"
                transfer
                v-model="unitFlag"
                @on-popper-hide="adjustment.unit = $store.state.sortBUR.unit"
              >
                <div slot="content">
                  <Input
                    class="input"
                    size="small"
                    maxlength="20"
                    show-word-limit
                    v-model.trim="adjustment.unit"
                    placeholder="请输入单位"
                  ></Input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleSort(
                          adjustment.mac,
                          adjustment.build,
                          adjustment.unit,
                          adjustment.room,
                          'unit'
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      size="small"
                      type="default"
                      @click="
                        adjustment.unit = $store.state.sortBUR.unit;
                        unitFlag = false;
                      "
                      >取消</Button
                    >
                  </div>
                </div>
                <div
                  @mouseover="unitIndex = adjustment.unit"
                  @mouseout="unitIndex = -1"
                  class="pointer pRelative"
                >
                  <div
                    :class="unitFlag ? 'dashed' : ''"
                    :title="adjustment.unit"
                  >
                    <span>{{ adjustment.unit }}</span>
                  </div>
                  <!-- <Icon
                    type="md-create"
                    v-if="
                      unitIndex === adjustment.unit ||
                      $func.checkDataType(adjustment.unit)
                    "
                    class="el-icon-edit pointer unit-icon"
                  /> -->
                </div>
              </Poptip>
            </div>
          </Col>
          <Col>
            <div>
              <Poptip
                placement="top"
                transfer
                v-model="roomFlag"
                @on-popper-hide="adjustment.room = $store.state.sortBUR.room"
              >
                <div slot="content">
                  <Input
                    class="input"
                    size="small"
                    maxlength="20"
                    show-word-limit
                    v-model.trim="adjustment.room"
                    placeholder="请输入房号"
                  ></Input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleSort(
                          adjustment.mac,
                          adjustment.build,
                          adjustment.unit,
                          adjustment.room,
                          'room'
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      size="small"
                      type="default"
                      @click="
                        adjustment.room = $store.state.sortBUR.room;
                        roomFlag = false;
                      "
                      >取消</Button
                    >
                  </div>
                </div>
                <div
                  @mouseover="roomIndex = adjustment.room"
                  @mouseout="roomIndex = -1"
                  class="pointer pRelative"
                >
                  <div
                    :class="roomFlag ? 'dashed' : ''"
                    :title="adjustment.room"
                  >
                    <span>{{ adjustment.room }}</span>
                  </div>
                  <!-- <Icon
                    type="md-create"
                    v-if="
                      roomIndex === adjustment.room ||
                      $func.checkDataType(adjustment.room)
                    "
                    class="el-icon-edit pointer unit-icon"
                  /> -->
                </div>
              </Poptip>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row >
        <Form :model="adjustment" inline :label-width="90">
          <FormItem label="上报周期:" style="width: 200px">
            <Select v-model="adjustment.reportingCycle" :clearable='true' placeholder="请选择">
              <Option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </Option>
            </Select>
          </FormItem>
        </Form>

    </Row>
    <Row style="text-align: right;display: flex;justify-content: end;">
        <Button
        style="margin:20px"
        type="primary"
        @click="onSubmit"
        :disabled="orderFlag"
        >保存</Button
        >

    </Row>

  </div>
</template>
<script>
    import store from '@/store';
    import {
        macAlias,
        forsafeDeviceCommand,
        queryForsafeMsgTypeConfig
    } from '@/api/public';
    export default {
        data () {
            return {
                adjustment: {
                    mac: this.$store.state.mac,
                    name: this.$store.state.aliasName,
                    reportingCycle: 24,
                    build: this.$store.state.sortBUR.build,
                    unit: this.$store.state.sortBUR.unit,
                    room: this.$store.state.sortBUR.room
                },
                aliasFlag: false,
                aliasIndex: -1,
                datas: [],
                orderFlag: false,
                timer: null,
                buildFlag: false,
                unitFlag: false,
                roomFlag: false,
                buildIndex: -1,
                unitIndex: -1,
                roomIndex: -1,
                options: [
                    { value: 1, label: '1小时' },
                    { value: 8, label: '8小时' },
                    { value: 12, label: '12小时' },
                    { value: 24, label: '24小时' },
                    { value: 48, label: '48小时' }
                ]
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.queryConfig();
            },
            queryConfig () {
                let params = {
                    mac: this.$store.state.flammableGasObj.mac,
                    msgType: 'DevInfo',
                    devType: this.$store.state.flammableGasObj.devType
                };
                queryForsafeMsgTypeConfig(params)
                    .then((res) => {
                        if (res.success) {
                            this.adjustment.reportingCycle = res.data.period;
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
            handleAlias (mac, name) {
                macAlias({ mac: mac, name: name })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '设备别名修改成功！'
                            });
                            this.aliasFlag = false;
                            this.aliasIndex = -1;
                            this.adjustment.name = name;
                            store.commit('aliasName', name);
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
            onSubmit () {
                let params = {
                    mac: this.adjustment.mac,
                    cmd: 'FORSAFE_SET_PERIOD',
                    equipmentType: 7,
                    data: this.adjustment.reportingCycle
                };
                forsafeDeviceCommand(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                message: '命令已提交，生效中..'
                            });
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
                    })
                    .finally(() => {
                        this.orderFlag = true;
                        this.liftRestrictions();
                });
            },
            liftRestrictions () {
                this.timer = setTimeout(() => {
                    this.orderFlag = false;
                }, 3e3);
            },
            handleSort (mac, build, unit, room, type) {
                let params = {
                    mac: mac
                };
                if (type === 'build') {
                    params.build = build;
                } else if (type === 'unit') {
                    params.unit = unit;
                } else if (type === 'room') {
                    params.room = room;
                }
                macAlias(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '修改成功！'
                            });
                            store.commit('sortBUR', {
                                build: this.adjustment.build,
                                unit: this.adjustment.unit,
                                room: this.adjustment.room
                            });
                            if (type === 'build') {
                                this.buildFlag = false;
                                this.buildIndex = -1;
                                this.adjustment.build = build;
                            } else if (type === 'unit') {
                                this.unitFlag = false;
                                this.unitIndex = -1;
                                this.adjustment.unit = unit;
                            } else if (type === 'room') {
                                this.roomFlag = false;
                                this.roomIndex = -1;
                                this.adjustment.room = room;
                            }
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
            }
        },
        destroyed () {
            clearTimeout(this.timer);
        }
    };
</script>
<style lang="less" scoped>
.adjustment-modal {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -15px;
  margin-top: -15px;
  font-size: 30px;
  color: #23b48c;
  z-index: 9999;
}

#flammableGasConfiguration {
  margin: 0 auto;
  width: 1200px;
  .el-form-item__label {
    color: #fff;
  }
}
.adjustment-mac .el-input .el-input__inner {
  color: #fff;
  width: 200px;
  padding-left: 0;
  border: none;
  background-color: transparent;
}

.el-form-item {
  padding-right: 20px;
}

.el-form-item__label {
  vertical-align: top;
}

.el-input {
  display: inline-block;
  width: 100px;
}

.alias {
  width: 200px;
}

.title {
  width: 143px;
  text-align: right;
}

#position .el-input {
  width: 150px;
}

span {
  margin-right: 15px;
}

.label {
  display: inline-block;
  width: 130px;
  text-align: left;
}

.normal-label {
  width: 85px;
}

.ellipsis {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pRelative {
  position: relative;
  i {
    position: absolute;
    top: 12px;
  }

  .normal-icon {
    left: 75px;
  }

  .unusual-icon {
    left: 120px;
  }

  .unit-icon {
    left: -12px;
  }
}

.input {
  width: 100%;
}

.dashed {
  box-sizing: border-box;
  border-bottom: 1px dashed #303a5e;
}
</style>
