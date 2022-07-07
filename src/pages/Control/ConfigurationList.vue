<template>
  <div id="ConfigurationList">
    <Row :gutter="20" style="margin: 0; padding:20px" >
      <Col :span="5" class="mb-20">
        <div class="ellipsis">
          <span class="label">设备号:</span>
          <span :title="adjustment.mac">{{ adjustment.mac }}</span>
        </div>
      </Col>
      <Col :span="8" class="mb-20">
        <div>
          <Poptip
            :transfer="true"
            placement="top"
            width="250"
            v-model="aliasFlag"
            @hide="adjustment.name = $store.state.aliasName">
            <div slot="content">
               <Input maxlength="20" show-word-limit v-model.trim="adjustment.name" placeholder="请输入设备别名"></Input>
              <div style="text-align: right; margin: 5px 0 0">
                <Button @click="handleAlias(adjustment.mac, adjustment.name)">确定</Button>
                <Button @click="adjustment.name = $store.state.aliasName;aliasFlag = false">取消</Button>
              </div>
            </div>

              <div  @mouseover="aliasIndex = adjustment.mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
                <div class="ellipsis" :class="aliasFlag ? 'dashed' : ''" :title="adjustment.name">
                  <span class="label">设备别名:</span>
                  <span>{{ adjustment.name }}</span>
                </div>
                <i v-if="permission === 'true' && aliasIndex === adjustment.mac" class=" pointer"></i>
              </div>
          </Poptip>
        </div>
      </Col>
       <Col :span="11" class="mb-20" style="display:flex">
        <Col :span="12">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              :append-to-body="false"
              v-model="buildFlag"
              @hide="adjustment.build = $store.state.sortBUR.build">
              <div slot="content">
                 <Input maxlength="20" show-word-limit v-model.trim="adjustment.build" placeholder="请输入楼栋"></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'build')">确定</Button>
                  <Button @click="adjustment.build = $store.state.sortBUR.build;buildFlag = false">取消</Button>
                </div>
              </div>
                <div @mouseover="buildIndex = adjustment.build" @mouseout="buildIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="buildFlag ? 'dashed' : ''" :title="adjustment.build">
                    <span class="label">楼层信息:</span>
                    <span>{{ adjustment.build }}</span>
                  </div>
                  <i v-if="permission === 'true' && (buildIndex === adjustment.build || this.$func.checkDataType(adjustment.build))" class="pointer"></i>
                </div>
            </Poptip>
          </div>
        </Col>
      <Col :span="6">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              :append-to-body="false"
              v-model="unitFlag"
              @hide="adjustment.unit = $store.state.sortBUR.unit">
              <div slot="content">
                <Input maxlength="20" show-word-limit v-model.trim="adjustment.unit" placeholder="请输入单位"></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'unit')">确定</Button>
                  <Button @click="adjustment.unit = $store.state.sortBUR.unit;unitFlag = false">取消</Button>
                </div>
              </div>
                <div @mouseover="unitIndex = adjustment.unit" @mouseout="unitIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="unitFlag ? 'dashed' : ''" :title="adjustment.unit">
                    <span>{{ adjustment.unit }}</span>
                  </div>
                  <i v-if="permission === 'true' && (unitIndex === adjustment.unit || $func.checkDataType(adjustment.unit))" class=" pointer unit-icon"></i>
                </div>
            </Poptip>
          </div>
        </Col>
          <Col :span="6">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              :append-to-body="false"
              v-model="roomFlag"
              @hide="adjustment.room = $store.state.sortBUR.room">
              <div slot="content">
                <Input maxlength="20" show-word-limit v-model.trim="adjustment.room" placeholder="请输入房间号"></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button  @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'room')">确定</Button>
                  <Button  @click="adjustment.room = $store.state.sortBUR.room;roomFlag = false">取消</Button>
                </div>
              </div>
                <div @mouseover="roomIndex = adjustment.room" @mouseout="roomIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="roomFlag ? 'dashed' : ''" :title="adjustment.room">
                    <span>{{ adjustment.room }}</span>
                  </div>
                  <i v-if="permission === 'true' && (roomIndex === adjustment.room || $func.checkDataType(adjustment.room))" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </Poptip>
          </div>
        </Col>
      </Col>
      <div style="width: 100%;display: flex;margin:20px 0">
        <Col :span="5" class="mb-20" style="display:flex;">
        <Col :span="12">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              :append-to-body="false"
              v-model="linkmanFlag"
              @hide="adjustment.linkman = $store.state.sortBUR.linkman">
              <div slot="content">
                <Input maxlength="20" show-word-limit v-model.trim="adjustment.linkman" placeholder="请输入联系人 1"></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button  @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'linkman')">确定</Button>
                  <Button  @click="adjustment.linkman = $store.state.sortBUR.linkman;linkmanFlag = false">取消</Button>
                </div>
              </div>
                <div @mouseover="linkmanIndex = adjustment.linkman" @mouseout="linkmanIndex = adjustment.linkman === '' ? '' : -1" class="pointer pRelative">
                  <div class="ellipsis" :class="linkmanFlag ? 'dashed' : ''" :title="adjustment.linkman">
                    <span class="label" >联系人 1:</span>
                    <span>{{ adjustment.linkman }}</span>
                  </div>
                  <i v-if="permission === 'true' && (linkmanIndex === adjustment.linkman || $func.checkDataType(adjustment.linkman))" class="el-icon-edit pointer"></i>
                </div>
            </Poptip>
          </div>
        </Col>
        <Col :span="12">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              :append-to-body="false"
              v-model="linkmanTelFlag"
              @hide="adjustment.linkmanTel = $store.state.sortBUR.linkmanTel">
              <div slot="content">
                <Input maxlength="20" show-word-limit v-model="adjustment.linkmanTel" placeholder="请输入联系人电话 1"></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button  @click="handleTel(adjustment.mac, adjustment.linkmanTel, adjustment.linkmanTel2, 'linkmanTel')">确定</Button>
                  <Button  @click="adjustment.linkmanTel = $store.state.sortBUR.linkmanTel;linkmanTelFlag = false">取消</Button>
                </div>
              </div>
                <div @mouseover="linkmanTelIndex = adjustment.linkmanTel" @mouseout="linkmanTelIndex = adjustment.linkmanTel === '' ? '' : -1" class="pointer pRelative">
                  <div class="ellipsis" :class="linkmanTelFlag ? 'dashed' : ''" :title="adjustment.linkmanTel">
                    <span>{{ adjustment.linkmanTel }}</span>
                  </div>
                  <i v-if="permission === 'true' && (linkmanTelIndex === adjustment.linkmanTel || $func.checkDataType(adjustment.linkmanTel))" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </Poptip>
          </div>
        </Col>
      </Col>
     <Col :span="8" class="mb-20" style="display:flex">
        <Col :span="10">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              :append-to-body="false"
              v-model="linkman2Flag"
              @hide="adjustment.linkman2 = $store.state.sortBUR.linkman2">
              <div slot="content">
                 <Input maxlength="20" show-word-limit v-model.trim="adjustment.linkman2" placeholder="请输入联系人 2 "></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button  @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'linkman2')">确定</Button>
                  <Button  @click="adjustment.linkman2 = $store.state.sortBUR.room;linkman2Flag = false">取消</Button>
                </div>
              </div>

                <div @mouseover="linkman2Index = adjustment.linkman2" @mouseout="linkman2Index = adjustment.linkman2 === '' ? '' : -1" class="pointer pRelative">
                  <div class="ellipsis" :class="linkman2Flag ? 'dashed' : ''" :title="adjustment.linkman2">
                    <span class="label" >联系人 2:</span>
                    <span>{{ adjustment.linkman2 }}</span>
                  </div>
                  <i v-if="permission === 'true' && (linkman2Index === adjustment.linkman2 || $func.checkDataType(adjustment.linkman2))" class="el-icon-edit pointer"></i>
                </div>
            </Poptip>
          </div>
        </Col>
        <Col :span="7">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              :append-to-body="false"
              v-model="linkmanTel2Flag"
              @hide="adjustment.linkmanTel2 = $store.state.sortBUR.linkmanTel2">
              <div slot="content">
                  <Input maxlength="20" show-word-limit v-model="adjustment.linkmanTel2" placeholder="请输入联系人电话2"></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button  @click="handleTel(adjustment.mac, adjustment.linkmanTel, adjustment.linkmanTel2, 'linkmanTel2')">确定</Button>
                  <Button  @click="adjustment.linkmanTel2 = $store.state.sortBUR.linkmanTel2;linkmanTel2Flag = false">取消</Button>
                </div>
              </div>

                <div @mouseover="linkmanTel2Index = adjustment.linkmanTel2" @mouseout="linkmanTel2Index = adjustment.linkmanTel2 === '' ? '' : -1" class="pointer pRelative">
                  <div class="ellipsis" :class="linkmanTel2Flag ? 'dashed' : ''" :title="adjustment.linkmanTel2">
                    <span>{{ adjustment.linkmanTel2 }}</span>
                  </div>
                  <i v-if="permission === 'true' && (linkmanTel2Index === adjustment.linkmanTel2 || $func.checkDataType(adjustment.linkmanTel2))" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </Poptip>
          </div>
        </Col>
      </Col>
      <Col :span="11" style="display:flex">
        <Col :span="11">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              v-model="customFlag"
              :append-to-body="false"
              @hide="adjustment.customAlarm = $store.state.customAlarm">
              <div slot="content">
                 <Input maxlength="20" show-word-limit v-model.trim="adjustment.customAlarm" placeholder="请输入报警:"></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button  @click="handleCustomAlarm(adjustment.mac, adjustment.customAlarm)">确定</Button>
                  <Button  @click="adjustment.customAlarm = $store.state.customAlarm;customFlag = false">取消</Button>
                </div>
              </div>

                <div @mouseover="customIndex = adjustment.mac" @mouseout="customIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="customFlag ? 'dashed' : ''" :title="adjustment.customAlarm">
                    <span class="label" >输入报警:</span>
                    <span>{{ adjustment.customAlarm }}</span>
                  </div>
                  <i v-if="permission === 'true' && customIndex === adjustment.mac" class=" pointer"></i>
                </div>
            </Poptip>
          </div>
        </Col>
        <Col :span="12" class="mb-20">
          <div>
            <Poptip
            :transfer="true"
              placement="top"
              width="250"

              v-model="classifyFlag"
              :append-to-body="false"
              @hide="adjustment.classifyLabel = $store.state.classifyLabel">
              <div slot="content">
                <Input maxlength="10" show-word-limit v-model.trim="adjustment.classifyLabel" placeholder="请输入类识标签"></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button  @click="handleClassifyLabel(adjustment.mac, adjustment.classifyLabel)">确定</Button>
                  <Button  @click="adjustment.classifyLabel = $store.state.classifyLabel;classifyFlag = false">取消</Button>
                </div>
              </div>

                <div @mouseover="classifyIndex = adjustment.mac" @mouseout="classifyIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="classifyFlag ? 'dashed' : ''" :title="adjustment.classifyLabel">
                    <span class="label" >类识标签:</span>
                    <span>{{ adjustment.classifyLabel }}</span>
                  </div>
                  <i v-if="permission === 'true' && classifyIndex === adjustment.mac" class=" pointer"></i>
                </div>
            </Poptip>
          </div>
        </Col>
      </Col>
      </div>

     <Col :span="24" v-if="false">
        <LoraDeviceSettings></LoraDeviceSettings>
      </Col>
     <Col :span="24" v-if="param.equipmentType !== 8">
        <span class="fs-14">告警阀值设定:</span>
        <Button
          type="text"
          :style="{ fontSize: '18px', color: '#fff' }"
          :disabled="disabledFlag"
          @click="handleAdjustment(adjustment.mac, adjustment.name)"
        ></Button>
        <Button type="text" class="c-default" @click="handleInstructions">指令历史</Button>
          <Table :data="adjustments.slice((currentPage-1)*pageSize, currentPage*pageSize)" :columns="columns" class="fs-12">
               <template slot-scope="props" slot="props">
                <Col :span="12">
                  <Form ref="wiringForm" :model="wiringForm" class="form-wrap" :inline="true">
                    <FormItem label="接线方式" class="mb-0">
                      <Select class="gatherAddr" :clearable='true' :disabled="permission !== 'true'" v-model="props.row.gatherAddr" placeholder="请选择" @change="handleWiring(props.row.nodeNo, props.row.gatherAddr)">
                        <Option value="0">请选择</Option>
                        <Option value="-1">进线直连</Option>
                        <Option v-for="n in 29" :key="n" :value="n">{{ (n - 1 === 0) ? "总路" : ("线路" + (n - 1)) }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="漏保档位:" class="mb-0" style="margin-left: 70px">
                      {{ props.row.leakageGear }}
                    </FormItem>
                    <FormItem label="远程遥控" class="mb-0" style="margin-left: 70px">
                      <Select class="gatherAddr" :clearable='true' :disabled="permission !== 'true'" v-model="props.row.enableControl" placeholder="请选择" @change="handleControl(props.row.nodeNo, props.row.enableControl)">
                        <Option :value="true">允许</Option>
                        <Option :value="false">不允许</Option>
                      </Select>
                    </FormItem>
                  </Form>
                </Col>
                <Col :span="4" class="enable" v-if="props.row.isEnableAlarm">
                  <span class="pointer" @click="handleEnable(props.row.enableAlarm, 'alarm', props.$index, props.row.enableAlarmShowHide)">报警使能配置</span>
                </Col>
                <Col :span="4" class="enable" v-if="props.row.isEnableTrip">
                  <span class="pointer" @click="handleEnable(props.row.enableTrip, 'trip', props.$index, props.row.enableTripShowHide)">脱扣使能配置</span>
                </Col>
                <Col :span="24" class="mt-20" v-if="props.row.enableAlarmShowHide || props.row.enableTripShowHide">
                  <Enable @refresh-init="init" :enableBits="enableForm" :bits="bits" :param="{mac: adjustment.mac, nodeNo: props.row.nodeNo, cmd: props.row.enableAlarmShowHide ? 'SET_ENABLE_ALARM' : 'SET_ENABLE_TRIP'}"></Enable>
                </Col>
               </template>

              <template slot-scope="{row}" slot="title">
                <Poptip
                  :transfer="true"
                  placement="top"
                  width="250"
                  @show="titleVal = row.title"
                  :ref="`title-popover-${row.$index}`"
                  >
                  <div slot="content">
                    <Input show-word-limit v-model="titleVal" placeholder="请输入内容"></Input>
                  <div class="tr mt-5">
                    <Button  @click="handleNodeTitle(adjustment.mac, row.nodeNo, titleVal, row.index, 'title', row)">确定</Button>
                    <Button  @click="handleClosePopover('title', row.$index)">取消</Button>
                  </div>
                  </div>
                  <span class="pointer">{{ row.title }}</span>
                </Poptip>
              </template>

            <el-table-column
              prop="curL">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.currentLowerLimit') + '(A)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <Poptip
                :transfer="true"
                  v-if="index === `curL-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`curL-popover-${scope.$index}`"
                  >
                  <Input type="text" :maxlength="20" show-word-limit v-model="variable" :placeholder="$t('placeholder.content')">
                  </Input>
                  <div class="tr mt-5">
                    <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, variable, row.curH, '0xC8', scope.$index, 'curL', row)">确定</Button>
                    <Button  @click="handleClosePopover">取消</Button>
                  </div>
                  <span class="pointer">{{ row.curL }}</span>
                </Poptip>
                <span class="pointer" v-else>
                  {{ row.curL }}
                </span>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.currentLimit') + '(A)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    @show="curhVal = row.curH"
                    :ref="`curH-popover-${scope.$index}`"
                    >
                    <Input :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'"  prefix-icon="currency" show-word-limit v-model="curhVal" :onkeyup="curhVal = curhVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, curhVal, '0xC8', scope.$index, 'curH', row)">确定</Button>
                      <Button  @click="handleClosePopover('curH', scope.$index)">取消</Button>
                    </div>
                    <span class="pointer">{{ row.curH ? row.curH : '-' }}</span>
                  </Poptip>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    :disabled="!row.enableWarnModify"
                    @show="warnCurhVal = row.warnCurh"
                    :ref="`warnCurh-popover-${scope.$index}`"
                    >
                    <Input :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnCurhVal" :onkeyup="warnCurhVal = warnCurhVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, warnCurhVal, '0xCC', scope.$index, 'warnCurh', row, '3')">确定</Button>
                      <Button  @click="handleClosePopover('warnCurh', scope.$index)">取消</Button>
                    </div>
                    <span :class="row.enableWarnModify ? 'pointer' : 'cursor'">{{ row.warnCurh ? row.warnCurh : '-' }}</span>
                  </Poptip>
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.voltageLowerLimit') + '(V)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    @show="volLVal = row.volL"
                    :ref="`volL-popover-${scope.$index}`"
                    >
                    <Input :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="volLVal" :onkeyup="volLVal = volLVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, volLVal, '0xC7', scope.$index, 'volL', row)">确定</Button>
                      <Button  @click="handleClosePopover('volL', scope.$index)">取消</Button>
                    </div>
                    <span class="pointer">{{ row.volL ? row.volL : '-' }}</span>
                  </Poptip>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    :disabled="!row.enableWarnModify"
                    @show="warnVollVal = row.warnVoll"
                    :ref="`warnVoll-popover-${scope.$index}`"
                    >
                    <Input :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnVollVal" :onkeyup="warnVollVal = warnVollVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, warnVollVal, '0xCC', scope.$index, 'warnVoll', row, '2')">确定</Button>
                      <Button  @click="handleClosePopover('warnVoll', scope.$index)">取消</Button>
                    </div>
                    <span :class="row.enableWarnModify ? 'pointer' : 'cursor'">{{ row.warnVoll ? row.warnVoll : '-' }}</span>
                  </Poptip>
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.voltageLimit') + '(V)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    @show="volHVal = row.volH"
                    :ref="`volH-popover-${scope.$index}`"
                    >
                    <Input :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="volHVal" :onkeyup="volHVal = volHVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, volHVal, '0xC7', scope.$index, 'volH', row)">确定</Button>
                      <Button  @click="handleClosePopover('volH', scope.$index)">取消</Button>
                    </div>
                    <span class="pointer">{{ row.volH ? row.volH : '-' }}</span>
                  </Poptip>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    :disabled="!row.enableWarnModify"
                    @show="warnVolhVal = row.warnVolh"
                    :ref="`warnVolh-popover-${scope.$index}`"
                    >
                    <Input :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnVolhVal" :onkeyup="warnVolhVal = warnVolhVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, warnVolhVal, '0xCC', scope.$index, 'warnVolh', row, '1')">确定</Button>
                      <Button  @click="handleClosePopover('warnVolh', scope.$index)">取消</Button>
                    </div>
                    <span :class="row.enableWarnModify ? 'pointer' : 'cursor'">{{ row.warnVolh ? row.warnVolh : '-' }}</span>
                  </Poptip>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pwrL">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.powerLowerLimit') + '(W)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <Poptip
                :transfer="true"
                  v-if="index === `pwrL-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`pwrL-popover-${scope.$index}`"
                  >
                  <Input :maxlength="20" show-word-limit v-model="variable" :placeholder="$t('placeholder.content')"></Input>
                  <div class="tr mt-5">
                    <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, variable, row.pwrH, '0xC6', scope.$index, 'pwrL', row)">确定</Button>
                    <Button  @click="handleClosePopover">取消</Button>
                  </div>
                  <span class="pointer">{{ row.pwrL }}</span>
                </Poptip>
                <div class="pointer" v-else>
                  {{ row.pwrL }}
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.powerLimit') + '(W)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    @show="pwrHVal = row.pwrH"
                    :ref="`pwrH-popover-${scope.$index}`"
                    >
                    <Input :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="pwrHVal" :onkeyup="pwrHVal = pwrHVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, pwrHVal, '0xC6', scope.$index, 'pwrH', row)">确定</Button>
                      <Button  @click="handleClosePopover('pwrH', scope.$index)">取消</Button>
                    </div>
                    <span class="pointer">{{ row.pwrH ? row.pwrH : '-' }}</span>
                  </Poptip>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    :disabled="!row.enableWarnModify"
                    @show="warnPwrhVal = row.warnPwrh"
                    :ref="`warnPwrh-popover-${scope.$index}`"
                    >
                    <Input :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnPwrhVal" :onkeyup="warnPwrhVal = warnPwrhVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, warnPwrhVal, '0xCC', scope.$index, 'warnPwrh', row, '6')">确定</Button>
                      <Button  @click="handleClosePopover('warnPwrh', scope.$index)">取消</Button>
                    </div>
                    <span :class="row.enableWarnModify ? 'pointer' : 'cursor'">{{ row.warnPwrh ? row.warnPwrh : '-' }}</span>
                  </Poptip>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="lkiL" min-width="90">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.leakageLowerLimit') + '(mA)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <Poptip
                :transfer="true"
                  v-if="index === `lkiL-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`lkiL-popover-${scope.$index}`"
                  >
                  <Input :maxlength="20" show-word-limit v-model="variable" :placeholder="$t('placeholder.content')"></Input>
                  <div class="tr mt-5">
                    <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, variable, row.lkiH, '0xC9', scope.$index, 'lkiL', row)">确定</Button>
                    <Button  @click="handleClosePopover">取消</Button>
                  </div>
                  <span class="pointer">{{ row.lkiL }}</span>
                </Poptip>
                <div class="pointer" v-else>
                  {{ row.lkiL }}
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="90">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.leakageLimit') + '(mA)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    @show="lkiHVal = row.lkiH"
                    :ref="`lkiH-popover-${scope.$index}`"
                    >
                    <Input :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="lkiHVal" :onkeyup="lkiHVal = lkiHVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, lkiHVal, '0xC9', scope.$index, 'lkiH', row)">确定</Button>
                      <Button  @click="handleClosePopover('lkiH', scope.$index)">取消</Button>
                    </div>
                    <span class="pointer">{{ row.lkiH ? row.lkiH : '-' }}</span>
                  </Poptip>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    :disabled="!row.enableWarnModify"
                    @show="warnLkihVal = row.warnLkih"
                    :ref="`warnLkih-popover-${scope.$index}`"
                    >
                    <Input :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnLkihVal" :onkeyup="warnLkihVal = warnLkihVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, warnLkihVal, '0xCC', scope.$index, 'warnLkih', row, '4')">确定</Button>
                      <Button  @click="handleClosePopover('warnLkih', scope.$index)">取消</Button>
                    </div>
                    <span :class="row.enableWarnModify ? 'pointer' : 'cursor'">{{ row.warnLkih ? row.warnLkih : '-' }}</span>
                  </Poptip>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="tmpL">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.temperatureLowerLimit') + '(℃)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <Poptip
                :transfer="true"
                  v-if="index === `tmpL-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`tmpL-popover-${scope.$index}`"
                  >
                  <Input :maxlength="20" show-word-limit v-model="variable" :placeholder="$t('placeholder.content')"></Input>
                  <div class="tr mt-5">
                    <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, variable, row.tmpH, '0xCA', scope.$index, 'tmpL', row)">确定</Button>
                    <Button  @click="handleClosePopover">取消</Button>
                  </div>
                  <span class="pointer">{{ row.tmpL }}</span>
                </Poptip>
                <div class="pointer" v-else>
                  {{ row.tmpL }}
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.temperatureLimit') + '(℃)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="{row}">
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    @show="tmpHVal = row.tmpH"
                    :ref="`tmpH-popover-${scope.$index}`"
                    >
                    <Input :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="tmpHVal" :onkeyup="tmpHVal = tmpHVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, tmpHVal, '0xCA', scope.$index, 'tmpH', row)">确定</Button>
                      <Button  @click="handleClosePopover('tmpH', scope.$index)">取消</Button>
                    </div>
                    <span class="pointer">{{ row.tmpH ? row.tmpH : '-' }}</span>
                  </Poptip>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    :disabled="!row.enableWarnModify"
                    @show="warnTmphVal = row.warnTmph"
                    :ref="`warnTmph-popover-${scope.$index}`"
                    >
                    <Input :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnTmphVal" :onkeyup="warnTmphVal = warnTmphVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handleNodeAttr(adjustment.mac, row.nodeNo, warnTmphVal, '0xCC', scope.$index, 'warnTmph', row, '5')">确定</Button>
                      <Button  @click="handleClosePopover('warnTmph', scope.$index)">取消</Button>
                    </div>
                    <span :class="row.enableWarnModify ? 'pointer' : 'cursor'">{{ row.warnTmph ? row.warnTmph : '-' }}</span>
                  </Poptip>
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="105">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('types.malignantLoad') + '(W)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('main.adjustablePower') + '/' + $t('main.resistivePower') }}</div>
              </template>
              <template slot-scope="{row}">
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    :disabled="!row.enableTerribleLoad"
                    @show="adjPowerDnVal = row.malLoadAdjPowerDn"
                    :ref="`adjPower-popover-${scope.$index}`"
                    >
                    <Input :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="adjPowerDnVal" :onkeyup="adjPowerDnVal = adjPowerDnVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handMalignantLoad(adjustment.mac, row.nodeNo, adjPowerDnVal, 'MALLOAD_ADJPOWER_DN', scope.$index, 'adjPower', row)">确定</Button>
                      <Button  @click="handleClosePopover('adjPower', scope.$index)">取消</Button>
                    </div>
                    <span :class="row.enableTerribleLoad ? 'pointer' : 'cursor'">{{ row.malLoadAdjPowerDn ? row.malLoadAdjPowerDn : '-' }}</span>
                  </Poptip>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <Poptip
                  :transfer="true"
                    placement="top"
                    width="250"
                    :disabled="!row.enableTerribleLoad"
                    @show="resPowerDnVal = row.malLoadResPowerDn"
                    :ref="`resPower-popover-${scope.$index}`"
                    >
                    <Input :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="resPowerDnVal" :onkeyup="resPowerDnVal = resPowerDnVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </Input>
                    <div class="tr mt-5">
                      <Button  @click="handMalignantLoad(adjustment.mac, row.nodeNo, resPowerDnVal, 'MALLOAD_RESPOWER_DN', scope.$index, 'resPower', row)">确定</Button>
                      <Button  @click="handleClosePopover('resPower', scope.$index)">取消</Button>
                    </div>
                    <span :class="row.enableTerribleLoad ? 'pointer' : 'cursor'">{{ row.malLoadResPowerDn ? row.malLoadResPowerDn : '-' }}</span>
                  </Poptip>
                </span>
              </template>
            </el-table-column>
          </Table>
          <!-- <div class="block tc">
            <el-pagination
              v-if="adjustments.length > 10"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNo"
              :page-size="pageSize"
              :small="true"
              background
              layout="prev, pager, next"
              :total="total"
            ></el-pagination>
          </div> -->
      </Col>
    </Row>
    <!-- <el-dialog :title="$t('table.instruction') + $t('table.history') + $t('control.recording')" :close-on-click-modal="false" :modal="false" v-if="instructionsFlag" :visible.sync="instructionsFlag" custom-class="custom-select-dialog" width="1323px">
      <CommandFeedback :classFlag="true" :instructionsData="adjustment" :operateAt="5"></CommandFeedback>
    </el-dialog> -->
  </div>
</template>
<script>
    import store from '@/store'
    import LoraDeviceSettings from './LoraDeviceSettings.vue'
    // import Enable from './Enable'
    // import CommandFeedback from '../Common/CommandFeedback'
    import { queryChnlAttr, updateChnlAttr, updateNodeTitle, macAlias, modifyBoxsChnlWiring, saveBoxProperty, modifyBoxRemoteControl, terriblePower } from '@/api/control/index'
    export default {
        props: {
            param: {
                type: Object
            }
        },
        data () {
            return {
                adjustments: [],
                adjustment: {
                    mac: this.$store.state.mac,
                    name: this.$store.state.aliasName,
                    build: this.$store.state.sortBUR.build,
                    unit: this.$store.state.sortBUR.unit,
                    room: this.$store.state.sortBUR.room,
                    linkman: this.$store.state.sortBUR.linkman,
                    linkman2: this.$store.state.sortBUR.linkman2,
                    linkmanTel: this.$store.state.sortBUR.linkmanTel,
                    linkmanTel2: this.$store.state.sortBUR.linkmanTel2,
                    customAlarm: this.$store.state.customAlarm,
                    classifyLabel: this.$store.state.classifyLabel
                },
                wiringForm: {
                    wiring: ''
                },
                disabledFlag: false,
                aliasIndex: -1,
                aliasFlag: false,
                buildFlag: false,
                unitFlag: false,
                roomFlag: false,
                linkmanFlag: false,
                linkman2Flag: false,
                linkmanTelFlag: false,
                linkmanTel2Flag: false,
                customFlag: false,
                classifyFlag: false,
                instructionsFlag: false,
                permission: false,
                buildIndex: -1,
                unitIndex: -1,
                roomIndex: -1,
                linkmanIndex: -1,
                linkmanTelIndex: -1,
                linkman2Index: -1,
                linkmanTel2Index: -1,
                customIndex: -1,
                classifyIndex: -1,
                index: 0,
                titleVal: '',
                curhVal: '',
                warnCurhVal: '',
                volLVal: '',
                warnVollVal: '',
                volHVal: '',
                warnVolhVal: '',
                pwrHVal: '',
                warnPwrhVal: '',
                lkiHVal: '',
                warnLkihVal: '',
                tmpHVal: '',
                warnTmphVal: '',
                adjPowerDnVal: '',
                resPowerDnVal: '',
                enableForm: {
                    enableBits: [],
                    enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join('')
                },
                bits: [],
                pageNo: 1,
                pageSize: 10,
                currentPage: 1,
                total: 0,
                columns: [
                    {

                    },
                    {
                        title: '线路名称',
                        slot: 'title',
                        align: 'center'
                    },
                    {
                        title: '线路名称',
                        slot: 'header',
                        align: 'center'
                    },
                    {
                        title: '线路名称',
                        slot: 'title',
                        align: 'center'
                    },
                    {
                        title: '线路名称',
                        slot: 'title',
                        align: 'center'
                    },
                    {
                        title: '线路名称',
                        slot: 'title',
                        align: 'center'
                    },
                    {
                        title: '线路名称',
                        slot: 'title',
                        align: 'center'
                    }

                ]
            }
        },
        mounted () {
            if (this.param.equipmentType !== 8) this.init()
            this.linkmanIndex = (this.$store.state.sortBUR.linkman === '' || this.$store.state.sortBUR.linkman === undefined) ? (this.$store.state.sortBUR.linkman === undefined ? undefined : '') : -1
            this.linkman2Index = (this.$store.state.sortBUR.linkman2 === '' || this.$store.state.sortBUR.linkman2 === undefined) ? (this.$store.state.sortBUR.linkman2 === undefined ? undefined : '') : -1
            this.linkmanTelIndex = (this.$store.state.sortBUR.linkmanTel === '' || this.$store.state.sortBUR.linkmanTel === undefined) ? (this.$store.state.sortBUR.linkmanTel === undefined ? undefined : '') : -1
            this.linkmanTel2Index = (this.$store.state.sortBUR.linkmanTel2 === '' || this.$store.state.sortBUR.linkmanTel2 === undefined) ? (this.$store.state.sortBUR.linkmanTel2 === undefined ? undefined : '') : -1
        },
        methods: {
            init () {
                this.handleAdjustment(this.adjustment.mac, this.adjustment.name)
            },
            handleAdjustment (mac, name) {
                let ele = document.querySelector('.alarm-threshold-refresh')
                if (ele) {
                    this.disabledFlag = true
                    setTimeout(() => {
                        this.disabledFlag = false
                    }, 1000)
                }
                queryChnlAttr({ mac: mac })
                    .then(res => {
                        if (res.success) {
                            res.data.map((item, index) => {
                                item.index = index
                            })
                            this.adjustments = res.data
                            this.total = res.data.length
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
                                    content: '未知错误,请刷新重试'
                                });
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                    })
                    .finally(() => {

                    })
            },
            handleSizeChange (val) {
                this.pageSize = val
            },
            handleCurrentChange (val) {
                this.currentPage = val
            },
            handleAlias (mac, name) {
                macAlias({ mac: mac, name: name })
                    .then(res => {
                        if (res.success) {
                            this.$message({
                                message: this.$t('dialog.deviceAlias') + this.$t('message.successfulModified') + '！',
                                type: 'success'
                            })
                            store.commit('aliasName', name)
                            this.aliasFlag = false
                            this.aliasIndex = -1
                            this.adjustment.name = name
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: this.$t('message.unknown'),
                                    type: 'error'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleSort (mac, build, unit, room, linkman, linkman2, type) {
                let params = {
                    mac: mac
                }
                if (type === 'build') {
                    params.build = build
                } else if (type === 'unit') {
                    params.unit = unit
                } else if (type === 'room') {
                    params.room = room
                } else if (type === 'linkman') {
                    params.linkman = linkman
                } else if (type === 'linkman2') {
                    params.linkman2 = linkman2
                }
                macAlias(params)
                    .then(res => {
                        if (res.success) {
                            this.$message({
                                message: this.$t('message.successfulModified') + '！',
                                type: 'success'
                            })
                            store.commit('sortBUR', { build: this.adjustment.build, unit: this.adjustment.unit, room: this.adjustment.room, linkman: this.adjustment.linkman, linkman2: this.adjustment.linkman2, linkmanTel: this.adjustment.linkmanTel, linkmanTel2: this.adjustment.linkmanTel2 })
                            if (type === 'build') {
                                this.buildFlag = false
                                this.buildIndex = -1
                                this.adjustment.build = build
                            } else if (type === 'unit') {
                                this.unitFlag = false
                                this.unitIndex = -1
                                this.adjustment.unit = unit
                            } else if (type === 'room') {
                                this.roomFlag = false
                                this.roomIndex = -1
                                this.adjustment.room = room
                            } else if (type === 'linkman') {
                                this.linkmanFlag = false
                                this.linkmanIndex = this.adjustment.linkman === '' || this.adjustment.linkman === undefined ? (this.adjustment.linkman === undefined ? undefined : '') : -1
                                this.adjustment.linkman = linkman
                            } else if (type === 'linkman2') {
                                this.linkman2Flag = false
                                this.linkman2Index = this.adjustment.linkman2 === '' || this.adjustment.linkman2 === undefined ? (this.adjustment.linkman2 === undefined ? undefined : '') : -1
                                this.adjustment.linkman2 = linkman2
                            }
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: this.$t('message.unknown'),
                                    type: 'error'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleTel (mac, linkmanTel, linkmanTel2, type) {
                let params = {
                    mac: mac
                }
                if (type === 'linkmanTel') {
                    params.linkmanTel = linkmanTel
                    if (!this.$func.checkPhone(linkmanTel) && linkmanTel !== '' && linkmanTel2 !== undefined) {
                        this.$message({
                            message: this.$t('message.numberFormatError'),
                            type: 'error'
                        })
                        return false
                    }
                } else if (type === 'linkmanTel2') {
                    params.linkmanTel2 = linkmanTel2
                    if (!this.$func.checkPhone(linkmanTel2) && linkmanTel2 !== '' && linkmanTel2 !== undefined) {
                        this.$message({
                            message: this.$t('message.numberFormatError'),
                            type: 'error'
                        })
                        return false
                    }
                }
                macAlias(params)
                    .then(res => {
                        if (res.success) {
                            this.$message({
                                message: this.$t('message.successfulModified') + '！',
                                type: 'success'
                            })
                            store.commit('sortBUR', { build: this.adjustment.build, unit: this.adjustment.unit, room: this.adjustment.room, linkman: this.adjustment.linkman, linkman2: this.adjustment.linkman2, linkmanTel: this.adjustment.linkmanTel, linkmanTel2: this.adjustment.linkmanTel2 })
                            if (type === 'linkmanTel') {
                                this.linkmanTelFlag = false
                                this.linkmanTelIndex = this.adjustment.linkmanTel === '' || this.adjustment.linkmanTel === undefined ? (this.adjustment.linkmanTel === undefined ? undefined : '') : -1
                            } else if (type === 'linkmanTel2') {
                                this.linkmanTel2Flag = false
                                this.linkmanTel2Index = this.adjustment.linkmanTel2 === '' || this.adjustment.linkmanTel2 === undefined ? (this.adjustment.linkmanTel2 === undefined ? undefined : '') : -1
                            }
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: this.$t('message.unknown'),
                                    type: 'error'
                                })
                            }
                        }
                    }).catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleNodeTitle (mac, nodeNo, title, index, field, row) {
                if (title === '') {
                    this.$message({
                        message: this.$t('placeholder.content'),
                        type: 'error'
                    })
                    return false
                }
                updateNodeTitle({ mac: mac, nodeNo: nodeNo, title: title })
                    .then(res => {
                        if (res.success) {
                            this.$message({
                                message: this.$t('message.controlSuccess'),
                                type: 'success'
                            })
                            this.$refs[`${field}-popover-${index}`].doClose()
                            row.title = this.titleVal
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: this.$t('message.unknown'),
                                    type: 'error'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handMalignantLoad (mac, nodeNo, val, type, index, field, row) {
                let that = this
                if (val === '') {
                    this.$message({
                        message: this.$t('placeholder.content'),
                        type: 'error'
                    })
                    return false
                }
                let params = {
                    macs: mac,
                    nodeNo: nodeNo,
                    cmd: 'LIMIT_TERRIBLE_LOAD_POWER',
                    type: type,
                    lower: val
                }
                terriblePower(params)
                    .then(res => {
                        if (res.success) {
                            this.$message({
                                message: this.$t('message.controlSuccess'),
                                type: 'success'
                            })
                            this.$refs[`${field}-popover-${index}`].doClose()
                            if (field === 'adjPower') {
                                row.malLoadAdjPowerDn = this.adjPowerDnVal
                            } else if (field === 'resPower') {
                                row.malLoadResPowerDn = this.resPowerDnVal
                            }
                        } else if (res.code === '-1') {
                        } else {
                            let message = ''
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                                    } else {
                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                    }
                                }
                            } else {
                                message = res.message
                            }
                            that.$alert(message, '', {
                                dangerouslyUseHTMLString: true,
                                showConfirmButton: false,
                                customClass: 'alert-content',
                                callback: action => {}
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleNodeAttr (mac, nodeNo, val, type, index, field, row, warnType) {
                if (val === '') {
                    this.$message({
                        message: this.$t('placeholder.content'),
                        type: 'error'
                    })
                    return false
                }
                let params = {
                    mac: mac,
                    nodeNo: nodeNo,
                    warnType: warnType,
                    type: type,
                    _operate_at: '5'
                }
                if (field === 'curH' || field === 'warnCurh' || field === 'pwrH' || field === 'warnPwrh' || field === 'lkiH' || field === 'warnLkih' || field === 'tmpH' || field === 'warnTmph') {
                    params.upper = val
                } else if (field === 'volL') {
                    params.lower = val
                    params.upper = row.volH
                } else if (field === 'warnVoll') {
                    params.lower = val
                    params.upper = row.warnVolh
                } else if (field === 'volH') {
                    params.upper = val
                    params.lower = row.volL
                } else if (field === 'warnVolh') {
                    params.upper = val
                    params.lower = row.warnVoll
                }
                updateChnlAttr(params)
                    .then(res => {
                        if (res.success) {
                            this.$message({
                                message: this.$t('message.controlSuccess'),
                                type: 'success'
                            })
                            this.$refs[`${field}-popover-${index}`].doClose()
                            if (field === 'curH') {
                                row.curH = this.curhVal
                            } else if (field === 'warnCurh') {
                                row.warnCurh = this.warnCurhVal
                            } else if (field === 'volL') {
                                row.volL = this.volLVal
                            } else if (field === 'warnVoll') {
                                row.warnVoll = this.warnVollVal
                            } else if (field === 'volH') {
                                row.volH = this.volHVal
                            } else if (field === 'warnVolh') {
                                row.warnVolh = this.warnVolhVal
                            } else if (field === 'pwrH') {
                                row.pwrH = this.pwrHVal
                            } else if (field === 'warnPwrh') {
                                row.warnPwrh = this.warnPwrhVal
                            } else if (field === 'lkiH') {
                                row.lkiH = this.lkiHVal
                            } else if (field === 'warnLkih') {
                                row.warnLkih = this.warnLkihVal
                            } else if (field === 'tmpH') {
                                row.tmpH = this.tmpHVal
                            } else if (field === 'warnTmph') {
                                row.warnTmph = this.warnTmphVal
                            }
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: this.$t('message.unknown'),
                                    type: 'error'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleWiring (nodeNo, gatherAddr) {
                let that = this
                let params = {
                    macs: this.adjustment.mac,
                    cmd: 'SETWIRING',
                    nodeNo: nodeNo,
                    wiring: gatherAddr
                }
                modifyBoxsChnlWiring(params)
                    .then(res => {
                        if (res.success) {
                            that.$message({
                                message: this.$t('message.controlSuccess'),
                                type: 'success'
                            })
                        } else if (res.code === '-1') {
                        } else {
                            let message = ''
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                                    } else {
                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                    }
                                }
                            } else {
                                message = res.message
                            }
                            that.$alert(message, '', {
                                dangerouslyUseHTMLString: true,
                                showConfirmButton: false,
                                customClass: 'alert-content',
                                callback: action => {}
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            that.$message({
                                message: that.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleControl (nodeNo, enableControl) {
                let that = this
                let params = {
                    macs: this.adjustment.mac,
                    cmd: 'SETCONTROL',
                    nodeNo: nodeNo,
                    operType: enableControl ? '1' : '0'
                }
                modifyBoxRemoteControl(params)
                    .then(res => {
                        if (res.success) {
                            that.$message({
                                message: this.$t('message.controlSuccess'),
                                type: 'success'
                            })
                        } else if (res.code === '-1') {
                        } else {
                            let message = ''
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                                    } else {
                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                    }
                                }
                            } else {
                                message = res.message
                            }
                            that.$alert(message, '', {
                                dangerouslyUseHTMLString: true,
                                showConfirmButton: false,
                                customClass: 'alert-content',
                                callback: action => {}
                            })
                        }
                    })
                    .catch(err => {
                        if (err) {
                            that.$message({
                                message: that.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleEnable (obj, type, index, flag) {
                if (type === 'alarm') {
                    this.adjustments[index].enableAlarmShowHide = !this.adjustments[index].enableAlarmShowHide
                    this.adjustments[index].enableTripShowHide = false
                    this.bits = [this.$t('types.shortCircuitA'), this.$t('types.surgeA'), this.$t('types.overloadA'), this.$t('types.temperatureW'), this.$t('types.leakageA'), this.$t('types.overcurrentA'), this.$t('types.overpressureA'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.missingPhaseA'), this.$t('types.fireA'), this.$t('types.undervoltageA'), this.$t('types.overpressureW'), this.$t('types.undervoltageW'), this.$t('types.leakageW'), this.$t('types.currentW'), this.$t('types.reserved'), this.$t('types.localMaintenance'), this.$t('types.malignantLoad'), this.$t('message.remoteLock'), this.$t('types.reserved'), this.$t('types.temperatureA'), this.$t('types.unbalancedA'), this.$t('types.wrongPhaseA'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved')]
                } else if (type === 'trip') {
                    this.adjustments[index].enableTripShowHide = !this.adjustments[index].enableTripShowHide
                    this.adjustments[index].enableAlarmShowHide = false
                    this.bits = [this.$t('types.shortCircuitA') + this.$t('btns.trip'), this.$t('types.surgeA') + this.$t('btns.trip'), this.$t('types.overloadA') + this.$t('btns.trip'), this.$t('types.temperatureW') + this.$t('btns.trip'), this.$t('types.leakageA') + this.$t('btns.trip'), this.$t('types.overcurrentA') + this.$t('btns.trip'), this.$t('types.overpressureA') + this.$t('btns.trip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.missingPhaseA') + this.$t('btns.trip'), this.$t('types.fireA') + this.$t('btns.trip'), this.$t('types.undervoltageA') + this.$t('btns.trip'), this.$t('types.overpressureW') + this.$t('btns.trip'), this.$t('types.undervoltageW') + this.$t('btns.trip'), this.$t('types.leakageW') + this.$t('btns.trip'), this.$t('types.currentW') + this.$t('btns.trip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.temperatureA') + this.$t('btns.trip'), this.$t('types.unbalancedA') + this.$t('btns.trip'), this.$t('types.wrongPhaseTrip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved')]
                }
                let arr = obj.split('').reverse()
                let _arr = []
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === '1') _arr.push(i + '-' + this.bits[i])
                }
                this.enableForm.enableBits = _arr
                this.enableForm.enableBitsObj = obj
                let _len = this.adjustments.length
                for (let i = 0; i < _len; i++) {
                    if (index !== i) {
                        this.adjustments[i].enableAlarmShowHide = false
                        this.adjustments[i].enableTripShowHide = false
                    }
                }
            },
            handleClosePopover (field, index) {
                this.$refs[`${field}-popover-${index}`].doClose()
                this.$nextTick(() => {
                    this[`${field}Val`] = ''
                })
            },
            handleCustomAlarm (mac, val) {
                let params = {
                    mac: mac,
                    property: 'CUSTOM_ALARM',
                    value: val
                }
                saveBoxProperty(params)
                    .then(res => {
                        if (res.success) {
                            this.$message({
                                message: this.$t('system.customAlarm') + this.$t('message.successfulModified') + '！',
                                type: 'success'
                            })
                            store.commit('customAlarm', val)
                            this.customFlag = false
                            this.customIndex = -1
                            this.adjustment.customAlarm = val
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: this.$t('message.unknown'),
                                    type: 'error'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleClassifyLabel (mac, val) {
                let params = {
                    mac: mac,
                    property: 'CLASSIFY_LABEL',
                    value: val
                }
                saveBoxProperty(params)
                    .then(res => {
                        if (res.success) {
                            this.$message({
                                message: this.$t('system.genericLabel') + this.$t('message.successfulModified') + '！',
                                type: 'success'
                            })
                            store.commit('classifyLabel', val)
                            this.classifyFlag = false
                            this.classifyIndex = -1
                            this.adjustment.classifyLabel = val
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: this.$t('message.unknown'),
                                    type: 'error'
                                })
                            }
                        }
                    })
                    .catch(err => {
                        if (err) {
                            this.$message({
                                message: this.$t('message.unknown'),
                                type: 'error'
                            })
                        }
                    })
            },
            handleInstructions () {
                this.instructionsFlag = true
                this.adjustment.projectCode = this.$store.state.projectCode
            }
        },
        components: {
            // Enable,
            LoraDeviceSettings
            // CommandFeedback
        }
    }
</script>
