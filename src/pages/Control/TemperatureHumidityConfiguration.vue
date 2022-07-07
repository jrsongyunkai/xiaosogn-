<template>
  <div id="TemperatureHumidityConfiguration">
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <Col :span="7" class="mb-20">
        <div class="ellipsis">
          <span
            class="label normal-label"
            >设备号：</span
          >
          <span :title="temperatureHumList.mac">{{
            temperatureHumList.mac
          }}</span>
        </div>
      </Col>
      <Col :span="7" class="mb-20">
        <div>
          <Poptip
            placement="top"
            width="250"
            v-model="aliasFlag"
            transfer
            @on-popper-hide="temperatureHumList.name = $store.state.aliasName"
          >
            <div slot="content">
              <Input
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="temperatureHumList.name"
                placeholder="
                 请输入设备别名
                "
              ></Input>
              <div style="text-align: right; margin: 5px 0 0">
                <Button
                  type="primary"
                  size="small"
                  @click="
                    handleAlias(temperatureHumList.mac, temperatureHumList.name)
                  "
                  >确定</Button
                >
                <Button
                  size="small"
                  type="default"
                  @click="
                    TemperatureHumList.name = $store.state.aliasName;
                    aliasFlag = false;
                  "
                  >取消</Button
                >
              </div>
            </div>
            <div
              @mouseover="aliasIndex = temperatureHumList.mac"
              @mouseout="aliasIndex = -1"
              class="pointer pRelative"
            >
              <div
                class="ellipsis"
                :class="aliasFlag ? 'dashed' : ''"
                :title="temperatureHumList.name"
              >
                <span
                  class="label"
                  :class="$i18n.locale === 'zh' ? 'normal-label' : ''"
                >
                  设备别名:</span
                >
                <span>{{ temperatureHumList.name }}</span>
              </div>
              <i
                v-if="
                  permission === 'true' && aliasIndex === temperatureHumList.mac
                "
                class="el-icon-edit pointer"
                :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"
              ></i>
            </div>
          </Poptip>
        </div>
      </Col>
      <Col :span="10" class="mb-20">
        <Col :span="12">
          <div>
            <Poptip
              placement="top"
              width="250"
              transfer
              v-model="buildFlag"
              @on-popper-hide="
                temperatureHumList.build = $store.state.sortBUR.build
              "
            >
              <div slot="content">
                <Input
                  size="small"
                  maxlength="20"
                  show-word-limit
                  v-model.trim="temperatureHumList.build"
                  placeholder="请输入楼栋"
                ></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button
                    type="primary"
                    size="small"
                    @click="
                      handleSort(
                        temperatureHumList.mac,
                        temperatureHumList.build,
                        temperatureHumList.unit,
                        temperatureHumList.room,
                        'build'
                      )
                    "
                    >确定</Button
                  >
                  <Button
                    size="small"
                    type="default"
                    @click="
                      temperatureHumList.build = $store.state.sortBUR.build;
                      buildFlag = false;
                    "
                    >取消</Button
                  >
                </div>
              </div>
              <div
                @mouseover="buildIndex = temperatureHumList.build"
                @mouseout="buildIndex = -1"
                class="pointer pRelative"
              >
                <div
                  class="ellipsis"
                  :class="buildFlag ? 'dashed' : ''"
                  :title="temperatureHumList.build"
                >
                  <span
                    class="label"
                    :class="$i18n.locale === 'zh' ? 'normal-label' : ''"
                    >位置：</span
                  >
                  <span>{{ temperatureHumList.build }}{{ temperatureHumList.unit }}{{ temperatureHumList.room }}</span>
                </div>
                <i
                  v-if="
                    permission === 'true' &&
                    (buildIndex === temperatureHumList.build ||
                      this.$func.checkDataType(temperatureHumList.build))
                  "
                  class="el-icon-edit pointer"
                  :class="
                    $i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'
                  "
                ></i>
              </div>
            </Poptip>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <Poptip
              placement="top"
              width="250"
              transfer
              v-model="unitFlag"
              @on-popper-hide="
                temperatureHumList.unit = $store.state.sortBUR.unit
              "
            >
              <div slot="content">
                <Input
                  size="small"
                  maxlength="20"
                  show-word-limit
                  v-model.trim="temperatureHumList.unit"
                  placeholder="请输入单位"
                ></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button
                    type="primary"
                    size="small"
                    @click="
                      handleSort(
                        temperatureHumList.mac,
                        temperatureHumList.build,
                        temperatureHumList.unit,
                        temperatureHumList.room,
                        'unit'
                      )
                    "
                    >确定</Button
                  >
                  <Button
                    size="small"
                    type="default"
                    @click="
                      temperatureHumList.unit = $store.state.sortBUR.unit;
                      unitFlag = false;
                    "
                    >取消</Button
                  >
                </div>
              </div>
              <div
                slot="reference"
                @mouseover="unitIndex = temperatureHumList.unit"
                @mouseout="unitIndex = -1"
                class="pointer pRelative"
              >
                <div
                  class="ellipsis"
                  :class="unitFlag ? 'dashed' : ''"
                  :title="temperatureHumList.unit"
                >
                  <span>{{ temperatureHumList.unit }}</span>
                </div>
                <i
                  slot="reference"
                  v-if="
                    permission === 'true' &&
                    (unitIndex === temperatureHumList.unit ||
                      $func.checkDataType(temperatureHumList.unit))
                  "
                  class="el-icon-edit pointer unit-icon"
                ></i>
              </div>
            </Poptip>
          </div>
        </Col>
        <Col :span="6">
          <div>
            <Poptip
              placement="top"
              width="250"
              transfer
              v-model="roomFlag"
              @on-popper-hide="
                temperatureHumList.room = $store.state.sortBUR.room
              "
            >
              <div slot="content">
                <Input
                  size="small"
                  maxlength="20"
                  show-word-limit
                  v-model.trim="temperatureHumList.room"
                  placeholder="请输入房号"
                ></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button
                    type="primary"
                    size="small"
                    @click="
                      handleSort(
                        temperatureHumList.mac,
                        temperatureHumList.build,
                        temperatureHumList.unit,
                        temperatureHumList.room,
                        'room'
                      )
                    "
                    >确定</Button
                  >
                  <Button
                    size="small"
                    type="default"
                    @click="
                      temperatureHumList.room = $store.state.sortBUR.room;
                      roomFlag = false;
                    "
                    >取消</Button
                  >
                </div>
              </div>
              <div
                slot="reference"
                @mouseover="roomIndex = temperatureHumList.room"
                @mouseout="roomIndex = -1"
                class="pointer pRelative"
              >
                <div
                  class="ellipsis"
                  :class="roomFlag ? 'dashed' : ''"
                  :title="temperatureHumList.room"
                >
                  <span>{{ temperatureHumList.room }}</span>
                </div>
                <i
                  slot="reference"
                  v-if="
                    permission === 'true' &&
                    (roomIndex === temperatureHumList.room ||
                      $func.checkDataType(temperatureHumList.room))
                  "
                  class="el-icon-edit pointer unit-icon"
                ></i>
              </div>
            </Poptip>
          </div>
        </Col>
      </Col>
      <Col :span="24">
        <span class="fs-14"> 告警阀值设定： </span>
        <i
          class="el-icon-refresh"
          :style="{ fontSize: '18px', color: '#fff' }"
          ref="refBtn"
        ></i>
        <Button
          type="text"
          ref="refreshBtn"
          style="fontsize: 14px"
          @click="
            handleTemperatureHumList(
              temperatureHumList.mac,
              temperatureHumList.name
            )
          "
          :disabled="disabledFlag"
          ><i class="icon-v5 icon-v5-shuaxin"></i></Button
        >
        <Table
          :data="TemHumList"
          :columns="columns1"
          @on-cell-click="handleCell"
        >
          <template slot-scope="{ row }" slot="nodeEnable">
            <Select
              v-model="row.alarmEnables"
              clearable
              transfer
              class="w100"
              @on-change="handleOpenClose"
            >
              <Option
                v-for="item in options"
                :key="item.value"
                :value="item.value"
              >
              {{item.label}}
              </Option>
            </Select>
          </template>
          <template slot-scope="{ row, index }" slot="temUpper">
            <Poptip
              placement="top"
              width="250"
               transfer
              :ref="`temUpper-popover-${index}`"
            >
              <div slot="content">
                <Input
                  size="small"
                  :maxlength="20"
                  show-word-limit
                  v-model="variable"
                  :onkeyup="(variable = variable.replace(/[^0-9\\.]/g, ''))"
                  placeholder="请输入内容"
                ></Input>
                <div class="tr mt-5">
                  <Button
                    type="primary"
                    :disabled="disabledRefresh"
                    size="small"
                    @click="
                      handleNodeAttr(temperatureHumList.mac, row, 'temUpper')
                    "
                    >确定</Button
                  >
                  <Button
                    size="small"
                    type="default"
                    @click="handleClosePopover"
                    >取消</Button
                  >
                </div>
              </div>
              <span class="pointer">{{
                row.temUpper ? row.temUpper : '-'
              }}</span>
            </Poptip>
          </template>
          <template slot-scope="{ row, index }" slot="temLower">
            <Poptip
              transfer
              placement="top"
              width="250"
              :ref="`temLower-popover-${index}`"
              trigger="click"
            >
              <div slot="content">
                <Input
                  size="small"
                  :maxlength="20"
                  show-word-limit
                  v-model="variable"
                  :onkeyup="(variable = variable.replace(/[^0-9\\.]/g, ''))"
                  placeholder="请输入内容"
                ></Input>
                <div class="tr mt-5">
                  <Button
                    type="primary"
                    size="small"
                    :disabled="disabledRefresh"
                    @click="
                      handleNodeAttr(temperatureHumList.mac, row, 'temLower')
                    "
                    >确定</Button
                  >
                  <Button
                    size="small"
                    type="default"
                    @click="handleClosePopover"
                    >取消</Button
                  >
                </div>
              </div>
              <span class="pointer">{{
                row.temLower ? row.temLower : '-'
              }}</span>
            </Poptip>

          </template>
          <template
            v-if="equipmentNum === 11"
            slot-scope="{ row, index }"
            slot="humUpper"
          >
            <Poptip
              placement="top"
              width="250"
              :ref="`humUpper-popover-${index}`"
              trigger="click"
              transfer
            >
              <div slot="content">
                <Input
                  size="small"
                  :maxlength="20"
                  show-word-limit
                  v-model="variable"
                  :onkeyup="(variable = variable.replace(/[^0-9\\.]/g, ''))"
                  placeholder="请输入内容"
                ></Input>
                <div class="tr mt-5">
                  <Button
                    type="primary"
                    size="small"
                    :disabled="disabledRefresh"
                    @click="
                      handleNodeAttr(temperatureHumList.mac, row, 'humUpper')
                    "
                    >确定</Button
                  >
                  <Button
                    size="small"
                    type="default"
                    @click="handleClosePopover"
                    >取消</Button
                  >
                </div>
              </div>
              <span class="pointer">{{
                row.humUpper ? row.humUpper : '-'
              }}</span>
            </Poptip>

          </template>
          <template
            v-if="equipmentNum === 11"
            slot-scope="{ row, index }"
            slot="humLower"
          >
            <Poptip
              transfer
              placement="top"
              width="250"
              :ref="`humLower-popover-${index}`"
              trigger="click"
            >
              <div slot="content">
                <Input
                  size="small"
                  :maxlength="20"
                  show-word-limit
                  :onkeyup="(variable = variable.replace(/[^0-9\\.]/g, ''))"
                  v-model="variable"
                  placeholder="请输入内容"
                ></Input>
                <div class="tr mt-5">
                  <Button
                    type="primary"
                    size="small"
                    :disabled="disabledRefresh"
                    @click="
                      handleNodeAttr(temperatureHumList.mac, row, 'humLower')
                    "
                    >确定</Button
                  >
                  <Button
                    size="small"
                    type="default"
                    @click="handleClosePopover"
                    >取消</Button
                  >
                </div>
              </div>
              <span class="pointer">{{
                row.humLower ? row.humLower : '-'
              }}</span>
            </Poptip>

          </template>
        </Table>
      </Col>
    </Row>
  </div>
</template>

<script>
/* global  */
    import store from '@/store';
    import {
        queryParamByMac,
        macAlias,
        updateParam,
        refreshParam,
        updateAlarmEnable
    } from '@/api/public';
    export default {
        components: {},
        props: {
            online: {
                type: Number
            },
            equipmentNum: {
                type: Number
            }
        },
        data () {
            return {
                columns1: [
                    { title: '节点名称', key: 'nodeName' },
                    { title: '节点使能', slot: 'nodeEnable' },
                    {
                        title: this.equipmentNum === 11 ? '温度上限(℃)' : '光照度上限(Lux)',
                        slot: 'temUpper'
                    },
                    {
                        title: this.equipmentNum === 11 ? '温度下限(℃)' : '光照度下限(Lux)',
                        slot: 'temLower'
                    },
                    {
                        title: this.equipmentNum === 11 ? '湿度报警上限(%RH)' : '',
                        slot: 'humUpper'
                    },
                    {
                        title: this.equipmentNum === 11 ? '湿度报警下限(%RH)' : '',
                        slot: 'humLower'
                    }
                ],
                temperatureHumList: {
                    mac: this.$store.state.mac,
                    name: this.$store.state.aliasName,
                    build: this.$store.state.sortBUR.build,
                    unit: this.$store.state.sortBUR.unit,
                    room: this.$store.state.sortBUR.room
                },
                disabledRefresh: false,
                disabledFlag: false,
                aliasFlag: false,
                aliasIndex: -1,
                buildFlag: false,
                buildIndex: -1,
                unitFlag: false,
                unitIndex: -1,
                roomFlag: false,
                roomIndex: -1,
                index: 0,
                variable: '',
                TemHumList: [],
                TemHumName: '',
                permission: '', // config.authority.BOX_ATTR_MODIFY,
                options: [
                    {
                        value: '1',
                        label: '开'
                    },
                    {
                        value: '2',
                        label: '关'
                    }
                ]
            };
        },
        created () {},
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.queryTemHumList();
                this.handleTemperatureHumList();
            },
            queryTemHumList () {
                let params = {
                    mac: this.temperatureHumList.mac
                };
                queryParamByMac(params)
                    .then((res) => {
                        if (res.code === '0') {
                            res.data.map((item, index) => {
                                item.index = index;
                            });
                            this.TemHumList = res.data.map(item => ({
                                ...item,
                                alarmEnables: item.alarmEnable ? '1' : '2'

                            }));
                            //  console.log(res.data, '==========data');
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            }
                        }
                    })
            },
            handlerefresh () {
                this.disabledRefresh = true;
                let parmas = {
                    mac: this.temperatureHumList.mac
                };
                refreshParam(parmas)
                    .then((res) => {
                        if (res.success) {
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            }
                        }
                    })
            },
            handleCell (row, column, cell, event) {
                if (column.property === 'nodeName' || column.property === 'nodeEnable') {
                    return false;
                }
                this.index = `${column.property}-popover-${row.index}`;
                this.variable = row[column.property];
            },
            handleClosePopover () {
                this.$nextTick(() => {
                    this.index = 0;
                    this.variable = '';
                });
            },
            handleTemperatureHumList (mac, name) {
                this.handlerefresh();
                //
                // this.$refs.refBtn.className = 'el-icon-refresh iconfont-loading';
                // this.$refs.refreshBtn.className = 'iconfont-grey';
                this.disabledFlag = true;
                let timer = setTimeout(() => {
                    // this.$refs.refBtn.className = 'el-icon-refresh';
                    this.disabledFlag = false;
                    // this.$refs.refreshBtn.className = 'c-default';
                    if (this.variable.length > 0) this.disabledRefresh = false;
                    this.queryTemHumList();
                    clearTimeout(timer);
                }, 1000);
            },
            handleOpenClose (row) {
                let params = {
                    mac: this.temperatureHumList.mac,
                    alarmEnable: row === '1' ? 'open' : 'false',
                    nodeId: row.nodeId
                };
                updateAlarmEnable(params)
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
                            }
                        }
                    })
            },
            handleAlias (mac, name) {
                macAlias({ mac: mac, name: name })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '设备别名修改成功！'
                            });
                            store.commit('aliasName', name);
                            this.aliasFlag = false;
                            this.aliasIndex = -1;
                            this.temperatureHumList.name = name;
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            }
                        }
                    })
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
                                message: '修改成功！'
                            });
                            store.commit('sortBUR', {
                                build: this.temperatureHumList.build,
                                unit: this.temperatureHumList.unit,
                                room: this.temperatureHumList.room
                            });
                            if (type === 'build') {
                                this.buildFlag = false;
                                this.buildIndex = -1;
                                this.temperatureHumList.build = build;
                            } else if (type === 'unit') {
                                this.unitFlag = false;
                                this.unitIndex = -1;
                                this.temperatureHumList.unit = unit;
                            } else if (type === 'room') {
                                this.roomFlag = false;
                                this.roomIndex = -1;
                                this.temperatureHumList.room = room;
                            }
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            }
                        }
                    })
            },
            handleNodeAttr (mac, row, val) {
                if (this.online === 0) {
                    this.$Message.error({
                        content: `设备[{0}]不在线,请检查网络!${mac}`
                    });
                    return;
                }
                if (val === 'temUpper') {
                    if (this.equipmentNum === 14 && this.variable > 200000) {
                        this.$Message.error({
                            content: '光照度上限不能超过200000Lux！'
                        });
                        return;
                    } else if (this.equipmentNum === 11 && this.variable > 80) {
                        this.$Message.error({
                            content: '温度上限不能超过80℃！'
                        });
                        return;
                    }
                    if (this.variable <= row.temLower) {
                        this.$Message.error({
                            content: '上限值不能低于下限值！'
                        });
                        return;
                    }
                } else if (val === 'temLower') {
                    if (this.variable < -40) {
                        this.$Message.error({
                            content: '温度下限不能低于-40℃！'
                        });
                        return;
                    }
                    if (this.variable >= row.temUpper) {
                        this.$Message.error({
                            content: '下限值不能高于上限值！'
                        });
                        return;
                    }
                } else if (val === 'humUpper') {
                    if (this.variable > 100) {
                        this.$Message.error({
                            content: '湿度上限不能超过100%RH！'
                        });
                        return;
                    }
                    if (this.variable <= row.humLower) {
                        this.$Message.error({
                            content: '上限值不能低于下限值！'
                        });
                        return;
                    }
                } else if (val === 'humLower') {
                    if (this.variable < 0) {
                        this.$Message.error({
                            content: '湿度下限不能低于0%RH！'
                        });
                        return;
                    }
                    if (this.variable >= row.humUpper) {
                        this.$Message.error({
                            content: '下限值不能高于上限值！'
                        });
                        return;
                    }
                }
                let params = {
                    mac: mac,
                    nodeId: row.nodeId,
                    paramName: val,
                    value: this.variable
                };
                this.disabledFlag = true;
                updateParam(params)
                    .then((res) => {
                        if (res.success) {
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                            this.handleClosePopover();
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
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
                        let timer = setTimeout(() => {
                            this.disabledFlag = false;
                            clearTimeout(timer);
                        }, 5000);
                });
            }
        },
        watch: {
            variable: {
                handler (newVal, oldVal) {
                    if (newVal === '') {
                        this.disabledRefresh = true;
                    } else {
                        this.disabledRefresh = false;
                    }
                }
            }
        }
    };
</script>

<style lang="less" scoped>
/deep/ .el-col {
  padding: 0 !important;
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

.label {
  display: inline-block;
  width: 130px;
  text-align: right;
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

.dashed {
  box-sizing: border-box;
  border-bottom: 1px dashed #303a5e;
}

.enable {
  height: 40px;
  line-height: 40px;
}

/deep/ .el-table__expand-icon {
  color: #fff;
}

.iconfont-grey {
  color: #909399 !important;
}

.iconfont-loading {
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: rotating;
  display: inline-block;
}

.w100 {
  width: 100px;
}
</style>
