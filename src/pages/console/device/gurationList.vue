<template>
  <div id="gurationList" style="background-color:#1a202e">
    <Row :gutter="16" style="margin: 0; padding: 20px">
      <Col :span="4" >
        <div class="ellipsis">
          <span class="label">设备号：</span>
          <span :title="adjustment.mac">{{ adjustment.mac }}</span>
        </div>
      </Col>
      <Col :span="5" class="mb-20">
        <div class="ellipsis">
          <Poptip
            placement="top"
            width="250"
            transfer
            v-model="aliasFlag"
            @hide="adjustment.name = $store.state.aliasName"
          >
            <div slot="content">
              <Input
                maxlength="20"
                clearable
                show-word-limit

                v-model.trim="adjustment.name"
                placeholder="请输入设备别名"
              ></Input>
              <div style="text-align: right; padding: 3px ">
                <Button @click="handleAlias(adjustment.mac, adjustment.name)"
                  >确定</Button
                >
                <Button
                  @click="
                    adjustment.name = $store.state.aliasName;
                    aliasFlag = false;
                  "
                  >取消</Button
                >
              </div>
            </div>

            <div
              @mouseover="aliasIndex = adjustment.mac"
              @mouseout="aliasIndex = -1"
              class="pointer pRelative"
            >
              <div
                class="ellipsis"
                :class="aliasFlag ? 'dashed' : ''"
                :title="adjustment.name"
              >
                <span class="label">设备别名：</span>
                <span>{{ adjustment.name }}</span>
              </div>
              <i
                v-if="permission === 'true' && aliasIndex === adjustment.mac"
                class="pointer"
              ></i>
            </div>
          </Poptip >
        </div>
      </Col>
       <Col :span="14">
      <div style="width: 100%; display: flex; ">
        <Col :span="8" style="display: flex">
          <Col :span="11">
            <div class="ellipsis">
              <Poptip
                placement="top"
                width="250"
                transfer
                trigger="click"
                v-model="customFlag"
                :append-to-body="false"
                @hide="adjustment.customAlarm = $store.state.customAlarm"
              >
                <div slot="content">
                  <Input
                    maxlength="20"
                    show-word-limit

                    clearable
                    v-model.trim="adjustment.customAlarm"
                    placeholder="请输入报警:"
                  ></Input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <Button
                      @click="
                        handleCustomAlarm(
                          adjustment.mac,
                          adjustment.customAlarm
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      @click="
                        adjustment.customAlarm = $store.state.customAlarm;
                        customFlag = false;
                      "
                      >取消</Button
                    >
                  </div>
                </div>

                <div
                  @mouseover="customIndex = adjustment.mac"
                  @mouseout="customIndex = -1"
                  class="pointer pRelative"
                >
                  <div
                    class="ellipsis"
                    :class="customFlag ? 'dashed' : ''"
                    :title="adjustment.customAlarm"
                  >
                    <span class="label">输入报警:</span>
                    <span>{{ adjustment.customAlarm }}</span>
                  </div>
                  <i
                    v-if="
                      permission === 'true' && customIndex === adjustment.mac
                    "
                    class="pointer"
                  ></i>
                </div>
              </Poptip>
            </div>
          </Col>
          <Col :span="12" class="mb-20">
            <div class="ellipsis">
              <Poptip
                placement="top"
                width="250"
                transfer
                trigger="click"
                v-model="classifyFlag"
                :append-to-body="false"
                @hide="adjustment.classifyLabel = $store.state.classifyLabel"
              >
                <div slot="content">
                  <Input
                    maxlength="10"
                    show-word-limit

                    clearable
                    v-model.trim="adjustment.classifyLabel"
                    placeholder="请输入类识标签"
                  ></Input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <Button
                      @click="
                        handleClassifyLabel(
                          adjustment.mac,
                          adjustment.classifyLabel
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      @click="
                        adjustment.classifyLabel = $store.state.classifyLabel;
                        classifyFlag = false;
                      "
                      >取消</Button
                    >
                  </div>
                </div>

                <div
                  @mouseover="classifyIndex = adjustment.mac"
                  @mouseout="classifyIndex = -1"
                  class="pointer pRelative"
                >
                  <div
                    class="ellipsis"
                    :class="classifyFlag ? 'dashed' : ''"
                    :title="adjustment.classifyLabel"
                  >
                    <span class="label">类识标签:</span>
                    <span>{{ adjustment.classifyLabel }}</span>
                  </div>
                  <i
                    v-if="
                      permission === 'true' && classifyIndex === adjustment.mac
                    "
                    class="pointer"
                  ></i>
                </div>
              </Poptip>
            </div>
          </Col>
        </Col>
      </div>
      </Col>
      <Col :span="10" style="padding:10px">
      <Row>
      <Col :span="20">位置:   <span>{{deviceAdress||'--'}} </span>
      <span>
        <i class="icon-v5 icon-v5-bianji" @click="editDeviceModal"></i>
         </span>
      </Col>
      </Row>

      </Col>
      <!-- <Col :span="11" class="mb-20" style="display: flex;padding:10px" >
        <Col :span="12">
          <div class="ellipsis">
            <Poptip
              placement="top"
              width="250"
              trigger="click"
              transfer
              :append-to-body="false"
              v-model="buildFlag"
              @hide="adjustment.build = $store.state.sortBUR.build"
            >
              <div slot="content">
                <Input
                  maxlength="20"
                  clearable
                  show-word-limit

                  v-model.trim="adjustment.build"
                  placeholder="请输入楼栋"
                ></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button
                    @click="
                      handleSort(
                        adjustment.mac,
                        adjustment.build,
                        adjustment.unit,
                        adjustment.room,
                        adjustment.linkman,
                        adjustment.linkman2,
                        'build'
                      )
                    "
                    >确定</Button
                  >
                  <Button
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
                <div
                  class="ellipsis"
                  :class="buildFlag ? 'dashed' : ''"
                  :title="adjustment.build"
                >
                  <span class="label">楼层信息：</span>
                  <span>{{ adjustment.build }}</span>
                </div>
                <i
                  v-if="
                    permission === 'true' &&
                    (buildIndex === adjustment.build ||
                      this.$func.checkDataType(adjustment.build))
                  "
                  class="pointer"
                ></i>
              </div>
            </Poptip>
          </div>
        </Col>
        <Col :span="6">
          <div class="ellipsis">
            <Poptip
              placement="top"
              width="250"
              transfer
              trigger="click"
              :append-to-body="false"
              v-model="unitFlag"
              @hide="adjustment.unit = $store.state.sortBUR.unit"
            >
              <div slot="content">
                <Input
                  maxlength="20"
                  clearable
                  show-word-limit

                  v-model.trim="adjustment.unit"
                  placeholder="请输入单位"
                ></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button
                    @click="
                      handleSort(
                        adjustment.mac,
                        adjustment.build,
                        adjustment.unit,
                        adjustment.room,
                        adjustment.linkman,
                        adjustment.linkman2,
                        'unit'
                      )
                    "
                    >确定</Button
                  >
                  <Button
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
                  class="ellipsis"
                  :class="unitFlag ? 'dashed' : ''"
                  :title="adjustment.unit"
                >
                  <span>{{ adjustment.unit }}</span>
                </div>
                <i
                  v-if="
                    permission === 'true' &&
                    (unitIndex === adjustment.unit ||
                      $func.checkDataType(adjustment.unit))
                  "
                  class="pointer unit-icon"
                ></i>
              </div>
            </Poptip>
          </div>
        </Col>
        <Col :span="6">
          <div class="ellipsis">
            <Poptip
              placement="top"
              width="250"
              transfer
              trigger="click"
              :append-to-body="false"
              v-model="roomFlag"
              @hide="adjustment.room = $store.state.sortBUR.room"
            >
              <div slot="content">
                <Input
                  maxlength="20"
                  show-word-limit

                  clearable
                  v-model.trim="adjustment.room"
                  placeholder="请输入房间号"
                ></Input>
                <div style="text-align: right; margin: 5px 0 0">
                  <Button
                    @click="
                      handleSort(
                        adjustment.mac,
                        adjustment.build,
                        adjustment.unit,
                        adjustment.room,
                        adjustment.linkman,
                        adjustment.linkman2,
                        'room'
                      )
                    "
                    >确定</Button
                  >
                  <Button
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
                  class="ellipsis"
                  :class="roomFlag ? 'dashed' : ''"
                  :title="adjustment.room"
                >
                  <span>{{ adjustment.room }}</span>
                </div>
                <i
                  v-if="
                    permission === 'true' &&
                    (roomIndex === adjustment.room ||
                      $func.checkDataType(adjustment.room))
                  "
                  class="el-icon-edit pointer unit-icon"
                ></i>
              </div>
            </Poptip>
          </div>
        </Col>
      </Col> -->
      <Col :span="24" v-if="false">
        <LoraDeviceSettings></LoraDeviceSettings>
      </Col>
      <Col :span="24" v-if="param.equipmentType !== 8">
        <span class="fs-14">告警阀值设定:</span>
        <!-- <Icon type="md-refresh" /> -->
        <Button
          type="text"
          icon="md-refresh alarm-threshold-refresh"
          :style="{ fontSize: '18px', color: '#fff' }"
          :disabled="disabledFlag"
          @click="handleAdjustment(adjustment.mac, adjustment.name)"
        ></Button>
        <Button type="text" @click="handleInstructions">指令历史</Button>
      </Col>
      <Col :span="24" v-if="param.equipmentType !== 8">
        <Table
          :data="
            adjustments.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          :columns="columns"
          class="fs-12"
        >
          <!-- <template slot-scope="{}" slot="props">
            <Col :span="12">
            </Col>
          </template> -->
          <template slot-scope="{ row, index }" slot="title">
            <Poptip
              transfer
              :ref="`title-popover-${index}`"
              @on-popper-show="titleVal = row.title"
            >
              <Button type="text" class="tag-add pointer">{{
                row.title
              }}</Button>
              <div slot="content">
                <Input
                  maxlength="10"
                  show-word-limit
                  clearable
                  v-model.trim="titleVal"
                  placeholder="内容"
                ></Input>
                <div class="tr" style="margin: 5px 0 0">
                  <Button
                    type="primary" size="small"
                    @click="
                      handleNodeTitle(
                        adjustment.mac,
                        row.nodeNo,
                        titleVal,
                        index,
                        'title',
                        row
                      )
                    "
                    >确定</Button
                  >
                  <Button
                    type="primary" size="small"
                    @click="handleClosePopover('title', scope.$rowIndex)"
                    >取消</Button
                  >
                </div>
              </div>
            </Poptip>
          </template>
          <template slot-scope="{ row, index }" slot="curL">
            <Poptip
              v-if="index === `curL-popover-${index}`"
              transfer
              :ref="`curL-popover-${index}`"
            >
              <Button type="text" class="tag-add pointer">{{
                row.curL
              }}</Button>
              <div slot="content">
                <Input
                  maxlength="20"
                  clearable
                  show-word-limit

                  v-model.trim="variable"
                  placeholder="请输入内容"
                ></Input>
                <div class="tr" style="margin: 5px 0 0">
                  <Button
                    type="primary" size="small"
                    @click="
                      handleNodeAttr(
                        adjustment.mac,
                        row.nodeNo,
                        variable,
                        row.curH,
                        '0xC8',
                        index,
                        'curL',
                        row
                      )
                    "
                    >确定</Button
                  >
                  <Button type="primary" size="small" @click="handleClosePopover"
                    >取消</Button
                  >
                </div>
              </div>
            </Poptip>
            <span class="pointer" v-else>
              {{ row.curL }}
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="warnCur">
            <span>
              <Poptip
                @on-popper-show="curhVal = row.curH"
                transfer
                :ref="`curH-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.curH ? row.curH : '-'
                }}</Button>
                <div slot="content">
                  报警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="curhVal"
                    :onkeyup="(curhVal = curhVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      ></span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          curhVal,
                          '0xC8',
                          index,
                          'curH',
                          row
                        )
                      "
                      >确定</Button
                    >
                    <Button type="primary" size="small" @click="handleClosePopover('curH', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
            <span style="margin: 0 5px">/</span>
            <span>
              <Poptip
                :disabled="!row.enableWarnModify"
                @on-popper-show="warnCurhVal = row.warnCurh"
                transfer
                :ref="`warnCurh-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.warnCurh ? row.warnCurh : '-'
                }}</Button>
                <div slot="content">
                  预警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="warnCurhVal"
                    :onkeyup="(warnCurhVal = warnCurhVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >预警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          warnCurhVal,
                          '0xCC',
                          index,
                          'warnCurh',
                          row,
                          '3'
                        )
                      "
                      >确定</Button
                    >
                    <Button type="primary"
                    size="small" @click="handleClosePopover('warnCurh', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="voils">
            <span>
              <Poptip
                @on-popper-show="volLVal = row.volL"
                transfer
                :ref="`volL-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.volL ? row.volL : '-'
                }}</Button>
                <div slot="content">
                  报警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="volLVal"
                    :onkeyup="(volLVal = volLVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >报警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          volLVal,
                          '0xC7',
                          index,
                          'volL',
                          row
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('volL', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
            <span style="margin: 0 5px">/</span>
            <span>
              <Poptip
                :disabled="!row.enableWarnModify"
                @on-popper-show="warnVollVal = row.warnVoll"
                transfer
                :ref="`warnVoll-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.warnVoll ? row.warnVoll : '-'
                }}</Button>
                <div slot="content">
                  预警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="warnVollVal"
                    :onkeyup="(warnVollVal = warnVollVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >预警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          warnVollVal,
                          '0xCC',
                          index,
                          'warnVoll',
                          row,
                          '2'
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('warnVoll', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="volhs">
            <span>
              <Poptip
                @on-popper-show="volHVal = row.volH"
                transfer
                :ref="`volH-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.volH ? row.volH : '-'
                }}</Button>
                <div slot="content">
                  报警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="volHVal"
                    :onkeyup="(volHVal = volHVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >报警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          volHVal,
                          '0xC7',
                          index,
                          'volH',
                          row
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('volH', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
            <span style="margin: 0 5px">/</span>
            <span>
              <Poptip
                :disabled="!row.enableWarnModify"
                @on-popper-show="warnVolhVal = row.warnVolh"
                transfer
                :ref="`warnVolh-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.warnVolh ? row.warnVolh : '-'
                }}</Button>
                <div slot="content">
                  预警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="warnVolhVal"
                    :onkeyup="(warnVolhVal = warnVolhVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >预警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          warnVolhVal,
                          '0xCC',
                          index,
                          'warnVolh',
                          row,
                          '1'
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('warnVolh', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="pwrls">
            <Poptip
              transfer
              v-if="index === `pwrL-popover-${index}`"
              :ref="`pwrL-popover-${index}`"
            >
              <Button type="text" class="tag-add pointer">{{
                row.pwrL
              }}</Button>
              <div slot="content">
                <Input
                  maxlength="10"
                  show-word-limit
                   style="width:100px"
                  clearable
                  v-model.trim="variable"
                  placeholder="内容"
                ></Input>
                <div class="tr" style="margin: 5px 0 0">
                  <Button
                    type="primary"
                    size="small"
                    @click="
                      handleNodeTitle(
                        adjustment.mac,
                        row.nodeNo,
                        variable,
                        row.pwrH,
                        '0xC6',
                        index,
                        'pwrL',
                        row
                      )
                    "
                    >确定</Button
                  >
                  <Button type="primary"
                  size="small" @click="handleClosePopover"
                    >取消</Button
                  >
                </div>
              </div>
            </Poptip>
            <div class="pointer" v-else>
              {{ row.pwrL }}
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="pwrhs">
            <span>
              <Poptip
                @on-popper-show="pwrHVal = row.pwrH"
                transfer
                :ref="`pwrH-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.pwrH ? row.pwrH : '-'
                }}</Button>
                <div slot="content">
                  报警值：
                  <Input
                    maxlength="20"
                    style="width:100px"
                    show-word-limit
                    clearable
                    v-model.trim="pwrHVal"
                    :onkeyup="(pwrHVal = pwrHVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >报警值: </span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          pwrHVal,
                          '0xC6',
                          index,
                          'pwrH',
                          row
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('pwrH', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
            <span style="margin: 0 5px">/</span>
            <span>
              <Poptip
                :disabled="!row.enableWarnModify"
                @on-popper-show="warnPwrhVal = row.warnPwrh"
                transfer
                :ref="`warnPwrh-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.warnPwrh ? row.warnPwrh : '-'
                }}</Button>
                <div slot="content">
                  预警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="warnPwrhVal"
                    :onkeyup="(warnPwrhVal = warnPwrhVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >预警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          warnPwrhVal,
                          '0xCC',
                          index,
                          'warnPwrh',
                          row,
                          '6'
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('warnPwrh', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="lkils">
            <Poptip
              transfer
              v-if="index === `lkiL-popover-${index}`"
              :ref="`lkiL-popover-${index}`"
            >
              <Button type="text" class="tag-add pointer">{{
                row.lkiL
              }}</Button>
              <div slot="content">
                <Input
                  maxlength="10"
                  show-word-limit
                   style="width:100px"
                  v-model.trim="variable"
                  placeholder="内容"
                ></Input>
                <div class="tr" style="margin: 5px 0 0">
                  <Button
                    type="primary"
                    size="small"
                    @click="
                      handleNodeTitle(
                        adjustment.mac,
                        row.nodeNo,
                        variable,
                        row.lkiH,
                        '0xC9',
                        index,
                        'lkiL',
                        row
                      )
                    "
                    >确定</Button
                  >
                  <Button type="primary"
                  size="small" @click="handleClosePopover"
                    >取消</Button
                  >
                </div>
              </div>
            </Poptip>
            <div class="pointer" v-else>
              {{ row.lkiL }}
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="lkihs">
            <span>
              <Poptip
                @on-popper-show="lkiHVal = row.lkiH"
                transfer
                :ref="`lkiH-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.lkiH ? row.lkiH : '-'
                }}</Button>
                <div slot="content">
                  报警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="lkiHVal"
                    :onkeyup="(lkiHVal = lkiHVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >报警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          lkiHVal,
                          '0xC9',
                          index,
                          'lkiH',
                          row
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('lkiH', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
            <span style="margin: 0 5px">/</span>
            <span>
              <Poptip
                :disabled="!row.enableWarnModify"
                @on-popper-show="warnLkihVal = row.warnLkih"
                transfer
                :ref="`warnLkih-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.warnLkih ? row.warnLkih : '-'
                }}</Button>
                <div slot="content">
                  预警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="warnLkihVal"
                    :onkeyup="(warnLkihVal = warnLkihVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >预警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          warnLkihVal,
                          '0xCC',
                          index,
                          'warnLkih',
                          row,
                          '4'
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('warnLkih', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="tmpls">
            <Poptip
              transfer
              v-if="index === `tmpL-popover-${index}`"
              :ref="`tmpL-popover-${index}`"
            >
              <Button type="text" class="tag-add pointer">{{
                row.tmpL
              }}</Button>
              <div slot="content">
                <Input
                  maxlength="10"
                  clearable
                  show-word-limit
                   style="width:100px"
                  v-model.trim="variable"
                  placeholder="内容"
                ></Input>
                <div class="tr" style="margin: 5px 0 0">
                  <Button
                    type="primary"
                    size="small"
                    @click="
                      handleNodeTitle(
                        adjustment.mac,
                        row.nodeNo,
                        variable,
                        row.tmpH,
                        '0xCA',
                        index,
                        'tmpL',
                        row
                      )
                    "
                    >确定</Button
                  >
                  <Button type="primary"
                  size="small" @click="handleClosePopover"
                    >取消</Button
                  >
                </div>
              </div>
            </Poptip>
            <div class="pointer" v-else>
              {{ row.tmpL }}
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="tmpHs">
            <span>
              <Poptip
                @on-popper-show="tmpHVal = row.tmpH"
                transfer
                :ref="`tmpH-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.tmpH ? row.tmpH : '-'
                }}</Button>
                <div slot="content">
                  报警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="tmpHVal"
                    :onkeyup="(tmpHVal = tmpHVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >报警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          tmpHVal,
                          '0xCA',
                          index,
                          'tmpH',
                          row
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('tmpH', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
            <span style="margin: 0 5px">/</span>
            <span>
              <Poptip
                :disabled="!row.enableWarnModify"
                @on-popper-show="warnTmphVal = row.warnTmph"
                transfer
                :ref="`warnTmph-popover-${index}`"
              >
                <Button type="text" class="tag-add pointer">{{
                  row.warnTmph ? row.warnTmph : '-'
                }}</Button>
                <div slot="content">
                  预警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="warnLkihVal"
                    :onkeyup="(warnTmphVal = warnTmphVal.replace(/[^\d]/g, ''))"
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >预警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          warnTmphVal,
                          '0xCC',
                          index,
                          'warnTmph',
                          row,
                          '5'
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('warnTmph', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="adjPower">
            <span>
              <Poptip

                @on-popper-show="adjPowerDnVal = row.malLoadAdjPowerDn"
                transfer
                :ref="`adjPower-popover-${index}`"
              >
                <Button  :disabled="!row.enableTerribleLoad" type="text" class="tag-add pointer">{{
                  row.malLoadAdjPowerDn ? row.malLoadAdjPowerDn : '-'
                }}</Button>
                <div slot="content">
                  报警值:
                  <Input
                    maxlength="20"
                    show-word-limit
                     style="width:100px"
                    clearable
                    v-model.trim="adjPowerDnVal"
                    :onkeyup="
                      (adjPowerDnVal = adjPowerDnVal.replace(/[^\d]/g, ''))
                    "
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >报警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handMalignantLoad(
                          adjustment.mac,
                          row.nodeNo,
                          adjPowerDnVal,
                          'MALLOAD_ADJPOWER_DN',
                          index,
                          'adjPower',
                          row
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('adjPower', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
            <span style="margin: 0 5px">/</span>
            <span>
              <Poptip
                @on-popper-show="resPowerDnVal = row.malLoadResPowerDn"
                transfer
                :ref="`resPower-popover-${index}`"
              >
                <Button :disabled="!row.enableTerribleLoad" type="text" class="tag-add pointer">{{
                  row.malLoadResPowerDn ? row.malLoadResPowerDn : '-'
                }}</Button>
                <div slot="content">
                  预警值:
                  <Input
                    maxlength="20"
                    clearable
                    show-word-limit
                     style="width:100px"
                    v-model.trim="resPowerDnVal"
                    :onkeyup="
                      (resPowerDnVal = resPowerDnVal.replace(/[^\d]/g, ''))
                    "
                    placeholder="请输入内容"
                  >
                    <!-- <span slot="prefix" style="font-size: 12px; color: #909399"
                      >预警值:</span
                    > -->
                  </Input>
                  <div class="tr" style="margin: 5px 0 0">
                    <Button
                      type="primary"
                      size="small"
                      @click="
                        handleNodeAttr(
                          adjustment.mac,
                          row.nodeNo,
                          resPowerDnVal,
                          'MALLOAD_RESPOWER_DN',
                          index,
                          'resPower',
                          row
                        )
                      "
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      size="small"
                      @click="handleClosePopover('resPower', index)"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </span>
          </template>
        </Table>
      </Col>
      <Page
        v-if="adjustments.length > 10"
        :current="pageNo"
        :total="total"
        :page-size="pageSize"
        show-elevator
        @on-change="handleCurrentChange"
        @on-page-size-change="handleSizeChange"
      />
      <div>
        <Modal
          title="指令历史记录"
          :mask="false"
          closable
          :transfer="false"
          footer-hide
          v-if="instructionsFlag"
          v-model="instructionsFlag"
          width="1323px"
          style="padding: 5px 30px"
        >
          <CommandFeedback
            :classFlag="true"
            :instructionsData="adjustment"
            :operateAt="5"
          ></CommandFeedback>
        </Modal>
      </div>
    </Row>
    <Modal v-model="deviceFlag" footer-hide width="1000" title="设备位置修改"><DeviceAdress v-if="deviceFlag" :propmapValue="propmapValue"  @closeFlag="closeFlag"></DeviceAdress></Modal>
  </div>
</template>

<script>
    import store from '@/store';
    import LoraDeviceSettings from '../../Control/LoraDeviceSettings.vue';
    import CommandFeedback from '../../Common/CommandFeedback.vue';
    import DeviceAdress from './deviceAdress.vue'
    import {
        queryChnlAttr,
        updateChnlAttr,
        updateNodeTitle,
        macAlias,
        modifyBoxsChnlWiring,
        saveBoxProperty,
        modifyBoxRemoteControl,
        terriblePower
    } from '@/api/control/index';
    import expandRow from './expand-row.vue';
    import { findBoxByMac } from '@/api/public'
    export default {
        props: {
            param: {
                type: Object
            }
        },
        components: {
            // Enable,
            DeviceAdress,
            LoraDeviceSettings,
            CommandFeedback,
            expandRow
        },
        data () {
            return {
                propmapValue: '',
                deviceFlag: false,
                deviceAdress: '',
                enableControl: '1',
                adjustments: [],
                adjustment: {
                    mac: this.param.mac,
                    name: this.$store.state.aliasName,
                    build: this.param.build,
                    unit: this.param.unit,
                    room: this.param.room,
                    linkman: this.param.linkman,
                    linkman2: this.param.linkman2,
                    linkmanTel: this.param.linkmanTel,
                    linkmanTel2: this.param.linkmanTel2,
                    customAlarm: this.param.others.customAlarm,
                    classifyLabel: this.param.others.classifyLabel
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
                    enableBitsObj: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0
                    ]
                        .reverse()
                        .join('')
                },
                bits: [],
                pageNo: 1,
                pageSize: 10,
                currentPage: 1,
                total: 0,
                columns: [
                    {
                        slot: 'props',
                        type: 'expand',
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row,
                                    currentPage: this.pageNo,
                                    index: params.index
                                }
                            });
                        },
                        align: 'center'
                    },
                    { title: '线路名称', slot: 'title', align: 'center' },
                    {
                        title: '电流下限(A)/(报警值/预警值)',
                        slot: 'curL',
                        align: 'center'
                    },
                    {
                        title: '电流上限(A)/(报警值/预警值)',
                        slot: 'warnCur',
                        align: 'center'
                    },
                    {
                        title: '电压下限(V)/(报警值/预警值)',
                        slot: 'voils',
                        align: 'center'
                    },
                    {
                        title: '电压上限(V)/(报警值/预警值)',
                        slot: 'volhs',
                        align: 'center'
                    },
                    {
                        title: '功率下限(W)/(报警值/预警值)',
                        slot: 'pwrls',
                        align: 'center'
                    },
                    {
                        title: '功率上限(W)/(报警值/预警值)',
                        slot: 'pwrhs',
                        align: 'center'
                    },
                    {
                        title: '漏电流下限(mA)/(报警值/预警值)',
                        slot: 'lkils',
                        align: 'center'
                    },
                    {
                        title: '漏电流上限(mA)/(报警值/预警值)',
                        slot: 'lkihs',
                        align: 'center'
                    },
                    {
                        title: '温度下限(℃)/(报警值/预警值)',
                        slot: 'tmpls',
                        align: 'center'
                    },
                    {
                        title: '温度上限(℃)/(报警值/预警值)',
                        slot: 'tmpHs',
                        align: 'center'
                    },
                    {
                        title: '恶性负载(W)/(调整型功率/阻性功率)',
                        slot: 'adjPower',
                        align: 'center'
                    }
                ]
            };
        },
        created () {
            this.getDeviceAdres()
        },
        mounted () {
            if (this.param.equipmentType !== 8) this.init();
            this.linkmanIndex =
                this.$store.state.sortBUR.linkman === '' ||
                this.$store.state.sortBUR.linkman === undefined
                    ? this.$store.state.sortBUR.linkman === undefined
                        ? undefined
                        : ''
                    : -1;
            this.linkman2Index =
                this.$store.state.sortBUR.linkman2 === '' ||
                this.$store.state.sortBUR.linkman2 === undefined
                    ? this.$store.state.sortBUR.linkman2 === undefined
                        ? undefined
                        : ''
                    : -1;
            this.linkmanTelIndex =
                this.$store.state.sortBUR.linkmanTel === '' ||
                this.$store.state.sortBUR.linkmanTel === undefined
                    ? this.$store.state.sortBUR.linkmanTel === undefined
                        ? undefined
                        : ''
                    : -1;
            this.linkmanTel2Index =
                this.$store.state.sortBUR.linkmanTel2 === '' ||
                this.$store.state.sortBUR.linkmanTel2 === undefined
                    ? this.$store.state.sortBUR.linkmanTel2 === undefined
                        ? undefined
                        : ''
                    : -1;
        },
        methods: {
            init () {
                this.handleAdjustment(this.adjustment.mac, this.adjustment.name);
            },
            editDeviceModal () {
                this.deviceFlag = true
            },
            closeFlag () {
                this.deviceFlag = false
                this.getDeviceAdres()
            },
            getDeviceAdres () {
                let params = {
                    mac: this.param.mac
                }
                findBoxByMac(params).then(res => {
                    if (res.success) {
                        //  console.log(res, '===========res');
                        this.propmapValue = res.data
                        this.deviceAdress = res.data.provinceName + ' ' + res.data.cityName + '  ' + res.data.countyName + '     ' + res.data.street + ' ' + res.data.build + '     ' + res.data.unit + '     ' + res.data.room
                    }
                })
            },
            handleAdjustment (mac, name) {
                let ele = document.querySelector('.alarm-threshold-refresh');
                if (ele) {
                    this.disabledFlag = true;
                    setTimeout(() => {
                        this.disabledFlag = false;
                    }, 1000);
                }
                queryChnlAttr({ mac })
                    .then((res) => {
                        if (res.success) {
                            res.data.map((item, index) => {
                                item.index = index;
                            });
                            this.adjustments = res.data;
                            this.total = res.data.length;
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: '未知错误,请刷新重试'
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
                    .finally(() => {});
            },
            handleTel (mac, linkmanTel, linkmanTel2, type) {
                let params = {
                    mac: mac
                };
                if (type === 'linkmanTel') {
                    params.linkmanTel = linkmanTel;
                    if (
                        !this.$func.checkPhone(linkmanTel) &&
                        linkmanTel !== '' &&
                        linkmanTel2 !== undefined
                    ) {
                        this.$Message.error({
                            content: '号码格式错误'
                        });
                        return false;
                    }
                } else if (type === 'linkmanTel2') {
                    params.linkmanTel2 = linkmanTel2;
                    if (
                        !this.$func.checkPhone(linkmanTel2) &&
                        linkmanTel2 !== '' &&
                        linkmanTel2 !== undefined
                    ) {
                        this.$Message.error({
                            content: '号码格式错误'
                        });
                        return false;
                    }
                }
                macAlias(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                message: '修改成功！'
                            });
                            store.commit('sortBUR', {
                                build: this.adjustment.build,
                                unit: this.adjustment.unit,
                                room: this.adjustment.room,
                                linkman: this.adjustment.linkman,
                                linkman2: this.adjustment.linkman2,
                                linkmanTel: this.adjustment.linkmanTel,
                                linkmanTel2: this.adjustment.linkmanTel2
                            });
                            if (type === 'linkmanTel') {
                                this.linkmanTelFlag = false;
                                this.linkmanTelIndex =
                                    this.adjustment.linkmanTel === '' ||
                                    this.adjustment.linkmanTel === undefined
                                        ? this.adjustment.linkmanTel === undefined
                                            ? undefined
                                            : ''
                                        : -1;
                            } else if (type === 'linkmanTel2') {
                                this.linkmanTel2Flag = false;
                                this.linkmanTel2Index =
                                    this.adjustment.linkmanTel2 === '' ||
                                    this.adjustment.linkmanTel2 === undefined
                                        ? this.adjustment.linkmanTel2 === undefined
                                            ? undefined
                                            : ''
                                        : -1;
                            }
                            this.$emit('queryList');
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
            handleControl (nodeNo, enableControl) {
                let that = this;
                let params = {
                    macs: this.adjustment.mac,
                    cmd: 'SETCONTROL',
                    nodeNo: nodeNo,
                    operType: enableControl ? '1' : '0'
                };
                modifyBoxRemoteControl(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '命令已提交，生效中..'
                            });
                        } else if (res.code === '-1') {
                        } else {
                            let message = '';
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        message +=
                                            '<div class="c-success tl">' +
                                            elem.mac +
                                            '：' +
                                            this.$t('message.processing') +
                                            '</div>';
                                    } else {
                                        message +=
                                            '<div class="c-danger tl">' +
                                            elem.mac +
                                            '：' +
                                            elem.errorMsg +
                                            '</div>';
                                    }
                                }
                            } else {
                                message = res.message;
                            }
                            that.$alert(message, '', {
                                dangerouslyUseHTMLString: true,
                                showConfirmButton: false,
                                customClass: 'alert-content',
                                callback: (action) => {}
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
            },
            handleAlias (mac, name) {
                macAlias({ mac: mac, name: name })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '设备别名修改成功!'
                            });
                            store.commit('aliasName', name);
                            this.aliasFlag = false;
                            this.aliasIndex = -1;
                            this.adjustment.name = name;
                            this.$emit('queryList');
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
            handleSort (mac, build, unit, room, linkman, linkman2, type) {
                let params = {
                    mac: mac
                };
                if (type === 'build') {
                    params.build = build;
                } else if (type === 'unit') {
                    params.unit = unit;
                } else if (type === 'room') {
                    params.room = room;
                } else if (type === 'linkman') {
                    params.linkman = linkman;
                } else if (type === 'linkman2') {
                    params.linkman2 = linkman2;
                }
                macAlias(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '修改成功!'
                            });
                            store.commit('sortBUR', {
                                build: this.adjustment.build,
                                unit: this.adjustment.unit,
                                room: this.adjustment.room,
                                linkman: this.adjustment.linkman,
                                linkman2: this.adjustment.linkman2,
                                linkmanTel: this.adjustment.linkmanTel,
                                linkmanTel2: this.adjustment.linkmanTel2
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
                            } else if (type === 'linkman') {
                                this.linkmanFlag = false;
                                this.linkmanIndex =
                                    this.adjustment.linkman === '' ||
                                    this.adjustment.linkman === undefined
                                        ? this.adjustment.linkman === undefined
                                            ? undefined
                                            : ''
                                        : -1;
                                this.adjustment.linkman = linkman;
                            } else if (type === 'linkman2') {
                                this.linkman2Flag = false;
                                this.linkman2Index =
                                    this.adjustment.linkman2 === '' ||
                                    this.adjustment.linkman2 === undefined
                                        ? this.adjustment.linkman2 === undefined
                                            ? undefined
                                            : ''
                                        : -1;
                                this.adjustment.linkman2 = linkman2;
                            }
                            this.$emit('queryList');
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
            handleCustomAlarm (mac, val) {
                let params = {
                    mac: mac,
                    property: 'CUSTOM_ALARM',
                    value: val
                };
                saveBoxProperty(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '输入报警修改成功'
                            });
                            store.commit('customAlarm', val);
                            this.customFlag = false;
                            this.customIndex = -1;
                            this.adjustment.customAlarm = val;
                            this.$emit('queryList');
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
            handleClassifyLabel (mac, val) {
                let params = {
                    mac: mac,
                    property: 'CLASSIFY_LABEL',
                    value: val
                };
                saveBoxProperty(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '类识标签'
                            });
                            store.commit('classifyLabel', val);
                            this.classifyFlag = false;
                            this.classifyIndex = -1;
                            this.adjustment.classifyLabel = val;
                            this.$emit('queryList');
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
            handleInstructions () {
                this.instructionsFlag = true;
                this.adjustment.projectCode = this.$store.state.projectCode;
            },
            handleWiring (nodeNo, gatherAddr) {
                let that = this;
                let params = {
                    macs: this.adjustment.mac,
                    cmd: 'SETWIRING',
                    nodeNo: nodeNo,
                    wiring: gatherAddr
                };
                modifyBoxsChnlWiring(params)
                    .then((res) => {
                        if (res.success) {
                            that.$Message.success({
                                content: '命令已提交，生效中..'
                            });
                        } else if (res.code === '-1') {
                        } else {
                            let message = '';
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        message +=
                                            '<div class="c-success tl">' +
                                            elem.mac +
                                            '：' +
                                            '生效中..' +
                                            '</div>';
                                    } else {
                                        message +=
                                            '<div class="c-danger tl">' +
                                            elem.mac +
                                            '：' +
                                            elem.errorMsg +
                                            '</div>';
                                    }
                                }
                            } else {
                                message = res.message;
                            }
                            that.$alert(message, '', {
                                dangerouslyUseHTMLString: true,
                                showConfirmButton: false,
                                customClass: 'alert-content',
                                callback: (action) => {}
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
            },
            handleNodeTitle (mac, nodeNo, title, index, field, row) {
                if (title === '') {
                    this.$Message.error({
                        content: '请输入内容'
                    });
                    return false;
                }
                updateNodeTitle({ mac, nodeNo, title })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '命令已提交，生效中..'
                            });
                            this.$refs[`${field}-popover-${index}`].visible = false;
                            row.title = this.titleVal;
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
            handleClosePopover (field, index) {
                this.$refs[`${field}-popover-${index}`].visible = false;
                // this.$refs[`${field}-popover-${index}`].doClose();
                this.$nextTick(() => {
                    this[`${field}Val`] = '';
                });
            },
            handleNodeAttr (mac, nodeNo, val, type, index, field, row, warnType) {
                if (val === '') {
                    this.$Message.error({
                        content: '请输入内容'
                    });
                    return false;
                }
                let params = {
                    mac: mac,
                    nodeNo: nodeNo,
                    warnType: warnType,
                    type: type,
                    _operate_at: '5'
                };
                if (
                    field === 'curH' ||
                    field === 'warnCurh' ||
                    field === 'pwrH' ||
                    field === 'warnPwrh' ||
                    field === 'lkiH' ||
                    field === 'warnLkih' ||
                    field === 'tmpH' ||
                    field === 'warnTmph'
                ) {
                    params.upper = val;
                } else if (field === 'volL') {
                    params.lower = val;
                    params.upper = row.volH;
                } else if (field === 'warnVoll') {
                    params.lower = val;
                    params.upper = row.warnVolh;
                } else if (field === 'volH') {
                    params.upper = val;
                    params.lower = row.volL;
                } else if (field === 'warnVolh') {
                    params.upper = val;
                    params.lower = row.warnVoll;
                }
                updateChnlAttr(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '命令已提交，生效中..'
                            });
                            this.$refs[`${field}-popover-${index}`].visible = false;
                            // this.$refs[`${field}-popover-${index}`].doClose();
                            if (field === 'curH') {
                                row.curH = this.curhVal;
                            } else if (field === 'warnCurh') {
                                row.warnCurh = this.warnCurhVal;
                            } else if (field === 'volL') {
                                row.volL = this.volLVal;
                            } else if (field === 'warnVoll') {
                                row.warnVoll = this.warnVollVal;
                            } else if (field === 'volH') {
                                row.volH = this.volHVal;
                            } else if (field === 'warnVolh') {
                                row.warnVolh = this.warnVolhVal;
                            } else if (field === 'pwrH') {
                                row.pwrH = this.pwrHVal;
                            } else if (field === 'warnPwrh') {
                                row.warnPwrh = this.warnPwrhVal;
                            } else if (field === 'lkiH') {
                                row.lkiH = this.lkiHVal;
                            } else if (field === 'warnLkih') {
                                row.warnLkih = this.warnLkihVal;
                            } else if (field === 'tmpH') {
                                row.tmpH = this.tmpHVal;
                            } else if (field === 'warnTmph') {
                                row.warnTmph = this.warnTmphVal;
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
            },
            handMalignantLoad (mac, nodeNo, val, type, index, field, row) {
                let that = this;
                if (val === '') {
                    this.$Message.error({
                        content: '请输入内容'
                    });
                    return false;
                }
                let params = {
                    macs: mac,
                    nodeNo: nodeNo,
                    cmd: 'LIMIT_TERRIBLE_LOAD_POWER',
                    type: type,
                    lower: val
                };
                terriblePower(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '命令已提交，生效中..'
                            });
                            this.$refs[`${field}-popover-${index}`].visible = false;
                            // this.$refs[`${field}-popover-${index}`].doClose();
                            if (field === 'adjPower') {
                                row.malLoadAdjPowerDn = this.adjPowerDnVal;
                            } else if (field === 'resPower') {
                                row.malLoadResPowerDn = this.resPowerDnVal;
                            }
                        } else if (res.code === '-1') {
                        } else {
                            let message = '';
                            if (res.data) {
                                for (let elem of res.data) {
                                    if (elem.errorMsg === '0') {
                                        message +=
                                            '<div class="c-success tl">' +
                                            elem.mac +
                                            '：' +
                                            '生效中..' +
                                            '</div>';
                                    } else {
                                        message +=
                                            '<div class="c-danger tl">' +
                                            elem.mac +
                                            '：' +
                                            elem.errorMsg +
                                            '</div>';
                                    }
                                }
                            } else {
                                message = res.message;
                            }
                            that.$alert(message, '', {
                                dangerouslyUseHTMLString: true,
                                showConfirmButton: false,
                                customClass: 'alert-content',
                                callback: (action) => {}
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
            },
            handleSizeChange (val) {
                this.pageSize = val;
            },
            handleCurrentChange (val) {
                this.currentPage = val;
            }
        }
    };
</script>

<style lang="less" scoped>
.ivu-btn{
  margin-right: 5px;
}
/deep/.ellipsis{
  .ellipsis:hover{
    cursor: pointer;
  }
  .ellipsis:hover::after{
        content: " ";
        background-size: 100% 100%;
        width: 15px;
        height: 15px;
        background-image: url('../../../assets/images/modify.png');
        position: absolute;
        top: 6px;
        right: -18px;
        color: #fff;
        display: block;
  }
  }
</style>
