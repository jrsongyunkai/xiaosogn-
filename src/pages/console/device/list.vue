<template>
  <div id="overlist" v-show="post">
    <Col v-show="flag" :span="24">
      <Form
        ref="form"
        :model="form"
        inline
        style="background-color: #1a202e; padding-top: 20px; padding-left: 20px"
      >
        <Row :gutter="5" type="flex" id="buildings-form">
          <Col>
            <FormItem style="display: flex">
              <Select
                transfer
                style="width: 130px"
                v-model="packetTypes"
                :clearable="true"
                placeholder="选择分组类型"
                class="en-unit"
                @on-change="handleTypes"
              >
                <Option
                  v-for="item in packetList"
                  :key="item.id"
                  :label="item.type"
                  :value="item.id"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <TreeSelect
              placeholder="选择分组"
              multiple
              show-checkbox
              v-model="packetFilter"
              transfer
              :data="packetFilterList"
            />
          </Col>
          <Col>
            <FormItem style="display: flex; margin-left: 10px">
              <Select
                style="width: 130px"
                transfer
                clearable
                v-model="building"
                placeholder="请选择楼栋"
                @on-change="handleChange"
              >
                <Option
                  z-index="5"
                  v-for="item in buildings"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <FormItem style="display: flex">
              <Select
                transfer
                clearable
                style="width: 130px"
                v-model="unit"
                placeholder="请选择单元"
                @on-change="handleUnit"
              >
                <Option
                  v-for="item in units"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <FormItem style="display: flex">
              <Select
                transfer
                clearable
                style="width: 130px"
                v-model="status"
                placeholder="请选择状态"
                @on-change="handleStatus"
              >
                <Option
                  v-for="item in stats"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <FormItem>
              <Input
                v-model="form.mac"
                placeholder="房间号/设备号"
                title="房间号/设备号"
                @input.native="handleInputMac"
                :onkeyup="(form.mac = form.mac.replace(/[, ]/g, ''))"
                @on-keyup.enter.native="handleKeyWords"
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem>
              <Button type="primary" @click.stop="handleSearch">查询</Button>
              <Button
                type="default"
                style="margin-left: 20px"
                @click.stop="handleReset"
                >重置</Button
              >
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Col>
        <div :style="controlTableHeight" class="demo-scroll-top" ref="scroll">
          <Row :gutter="8">
            <Col
              :lg="6"
              :md="8"
              v-for="(v, k) in tableData"
              :key="k"
              style="min-width:300px"
              class="device-wrap"
              ref="tabData"
            >
              <div class="device grid-content"  >
                <div class="left-device" @click="macClick(v)">
                  <div class="device-img" style="width: 100%">
                    <span
                      v-show="v.equipmentType === 1 || v.equipmentType === 8"
                    >
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/Airopen-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/Airopen-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 2">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/ElectricalFire-Online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/ElectricalFire-Offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 3">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/Stralsund-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/Stralsund-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span
                      v-show="v.equipmentType === 4 || v.equipmentType === 5"
                    >
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/PressureLevel-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/PressureLevel-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 6">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/Smoke-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/Smoke-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 7">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/FlammableGas-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/FlammableGas-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 10">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/zac-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/zac-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 11">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/renke-wsd-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/renke-wsd-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 12">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/emeter-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/emeter-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 13">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/zac-gas-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/zac-gas-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 14">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/renke-gzd-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/renke-gzd-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 15">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/common-water-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/common-water-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                    <span v-show="v.equipmentType === 16">
                      <img
                        v-if="v.others.online === 1"
                        src="@/assets/images/chaobiaomao-water-online.png"
                        alt="Mantunsci"
                      />
                      <img
                        v-else
                        src="@/assets/images/chaobiaomao-water-offline.png"
                        alt="Mantunsci"
                      />
                    </span>
                  </div>
                </div>
                <div class="right-device device-a" style="overflow: hidden" @click="macClick(v)">
                  <!--文字与 tooltip -->
                  <div>
                    <div>
                      <div class="devicr-button" v-show="v.others.online === 1">
                        <span class="success-line">在线</span>
                      </div>
                      <div
                        class="devicr-button"
                        v-show="v.others.online === 0"
                        style="display: flex"
                      >
                        <span class="dangers">离线</span>
                        <span class="b-warning">异常</span>
                        <!-- <Tag color="red"></Tag> -->
                        <!-- <Tag  class="b-warning">异常</Tag> -->
                      </div>
                      <div
                        class="devicr-button"
                        v-show="v.others.online === -1"
                        style="display: flex"
                      >
                        <!-- <Tag color="default"
                          ><p style="color: #999999">脱线</p>
                        </Tag> -->
                        <span class="b-infos">脱线</span>
                        <span class="b-warning">异常</span>
                      </div>
                      <span
                        class="devicr-button"
                        style="
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          overflow: hidden;
                        "
                      >
                        <Tooltip :content="v.name" placement="top" max-width="200">{{
                          v.name
                        }}</Tooltip>
                      </span>
                      <div class="equipment-Id devicr-button">
                        <span
                          class="btnConnect"
                          style="
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            color: #007eff;
                          "
                        >
                          ID:
                          <Tooltip :content="v.mac" placement="top">
                            {{ v.mac }}
                          </Tooltip>
                          <!-- ID: {{ v.mac }} -->
                          <!-- <Icon
                              color="#007acc"
                              @click.stop="onCopy"
                              type="ios-copy-outline"
                          /> -->
                        </span>
                      </div>
                      <div
                        class="devicr-button"
                        style="
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          overflow: hidden;
                          color: #999999;
                        "
                      >
                        <i class="icon-v5 icon-v5-dingwei"></i>
                        <!-- {{ v.build + v.unit + v.room }} -->
                        <Tooltip
                        max-width="200"
                          :content="v.build + v.unit + v.room"
                          placement="top"
                          >{{ v.build + v.unit + v.room }}</Tooltip
                        >
                      </div>
                    </div>

                    <span style="color: #999999">
                      <Icon type="ios-options-outline" class="lineIcon"></Icon>
                      {{ v.others.countAddr ? v.others.countAddr : 0 }}</span
                    >
                  </div>
                </div>
                <span class="devicr-button" style="margin-left: 30px;margin-top: 30px;position: absolute;right: 22px;z-index:999;" >
                  <Dropdown
                    trigger="click"
                    transfer
                    :ref="`Dropdown-${k}`"
                    @on-click="handleCommand($event, v)"
                  >
                    <span style="color: #999999">
                      <Icon size="24" type="ios-list" />
                    </span>
                    <DropdownMenu slot="list">
                      <DropdownItem
                        v-if="v.equipmentType === 1 || v.equipmentType === 2"
                        name="command-list"
                        >查看线路列表</DropdownItem
                      >
                      <DropdownItem
                        v-if="v.equipmentType === 1 || v.equipmentType === 2"
                        name="orientation"
                        >修改服务指向</DropdownItem
                      >
                      <DropdownItem name="inspection"
                        >设备巡检记录</DropdownItem
                      >
                      <DropdownItem
                        v-if="v.equipmentType === 1 || v.equipmentType === 2"
                        name="equipment"
                        >设备参数调整</DropdownItem
                      >
                      <DropdownItem
                        v-if="v.equipmentType === 1 || v.equipmentType === 2"
                        name="builtIn"
                        >内置定时配置</DropdownItem
                      >
                      <DropdownItem
                        v-if="
                          (v.equipmentType === 1 || v.equipmentType === 2) &&
                          v.others.enableAdvancedTiming
                        "
                        name="longitude"
                        >内置经纬定时</DropdownItem
                      >
                      <!-- <DropdownItem
                        v-if="
                          (v.equipmentType === 1 || v.equipmentType === 2) &&
                          bandFlag
                        "
                        name="region"
                        >区域关系绑定</DropdownItem
                      > -->
                    </DropdownMenu>
                  </Dropdown>
                </span>
              </div>
            </Col>
          </Row>
        </div>
        <!-- 分页 -->
        <div class="block tc">
          <Page
            @on-page-size-change="handleSizeChange"
            @on-change="handleCurrentChange"
            :current="pageNo"
            :page-size="pageSize"
           show-elevator
            :total="total"
          ></Page>
        </div>
      </Col>
    </Col>
    <!-- 下面的逻辑待完善  还有七个弹窗 弹窗完成-->
    <div v-if="!flag && !equipmentFlag" >
      <Col class="left-padding-right" :span="24">
        <Row
          style="
            height: 50px;
            padding: 10px;
            background-color: #1a202e;
            padding-top: 15px;
            margin-bottom: 10px;
          "
        >
          <Col :span="1">
            <span @click="backToPrev"><Icon type="ios-undo" />返回 </span>
          </Col>
          <Col :span="4">位置：{{ obj.build + obj.unit + obj.room }}</Col>
          <Col :span="4">设备号：{{ obj.mac }}</Col>
          <Col :span="4"
            >版本：{{
              obj.others.version !== undefined ? obj.others.version : '无'
            }}</Col
          >
          <Col :span="3" class="channel-except"
            >在线状态：
            <span v-if="obj.others.online === 1" class="x-success">在线</span>
            <span v-else-if="obj.others.online === 0" class="dangers"
              >离线</span
            >
            <span v-else-if="obj.others.online === -1" class="b-infos">
              脱线
            </span></Col
          >
        </Row>
        <Row
          style="padding: 10px; background-color: #1a202e"
          type="flex"
          justify="end"
          class="header"
        >
          <Col style="padding-top: 5px; padding-left: 10px">
            <h3>线路列表</h3>
          </Col>
          <Col>
            <span style="padding-left: 40px">
              <Button
                class="pointer btn"
                type="primary"
                ghost
                @click="queryChannels"
                ><i class="icon-v5 icon-v5-refresh"></i
              ></Button>
              <!-- <Icon type=" icon-v5 icon-v5-refresh" size="10" color="#007EFF" /> -->
            </span>
            <span>
              <Button
                style="margin-left: 8px"
                type="primary"
                @click="handleInstructions"
                >指令历史</Button
              >

              <Button
                style="margin-left: 15px"
                :class="channels.length === 0 ? 'grays' : 'greens'"
                v-if="obj.equipmentType === 1"
                :disabled="channels.length === 0"
                @click="handleChannelsOC(false)"
                >一键分闸</Button
              >
              <Button
                style="margin-left: 15px"
                :class="channels.length === 0 ? 'grays' : 'reds'"
                v-if="obj.equipmentType === 1"
                :disabled="channels.length === 0"
                @click="handleChannelsOC(true)"
                >一键合闸</Button
              >
            </span>
          </Col>
        </Row>
      </Col>
      <Row>
        <Table
            ref="currentRowTable"
            :columns="custColumns8"
            :data="channelsData"
            @on-row-dblclick="handleDblClick"
            @on-selection-change="handleSelectionChange"
          >
            <template slot-scope="{ row, index }" slot="select">
              <span style="font-size: 20px">
                <Switch
                  v-model="row._checked"
                  @on-change="handleResetState(row, index)"
                />
              </span>
            </template>
            <template slot-scope="{ row, index }" slot="lineName">
              <Poptip
                placement="top"
                transfer
                trigger="click"
                :ref="`popover-${index}`"
                @on-popper-show="handleShow"
                @on-popper-hide="handleHide"
              >
                <div>{{ row.title }}</div>
                <div class="poptip" slot="content">
                  <Input
                    type="text"
                    placeholder="内容"
                    v-model.trim="channelsData[index].title"
                    maxlength="5"
                  ></Input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <Button
                      type="primary"
                      @click="handleEdit(index, row, channelsData[index].title)"
                      >确定</Button
                    >
                    <Button
                      type="primary"
                      @click="$refs[`popover-` + index].visible = false"
                      >取消</Button
                    >
                  </div>
                </div>
              </Poptip>
            </template>
            <template slot-scope="{ row }" slot="temperature">
              <span
                style="
                  border: 1px solid #414959;
                  border-radius: 5px;
                  padding: 1px 30px;
                  color: #999999;
                "
              >
                {{ row.gT > -60 ? '总路：' + row.gT : '' }}
                <i
                  class="icon-v5 icon-v5-jieruguanli"
                  title="未接探头"
                  v-show="row.gT < -60"
                ></i
              ></span>
              <div
                v-show="row.lineType === '180' || row.lineType === '380'"
                class="split-line"
              >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >A:{{ row.aT > -60 ? row.aT : '' }}
                  <i
                    class="icon-v5 icon-v5-jieruguanli"
                    title="未接探头"
                    v-show="row.bT < -60"
                  ></i
                ></span>

                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >B:{{ row.bT > -60 ? row.bT : '' }}
                  <i
                    class="icon-v5 icon-v5-jieruguanli"
                    title="未接探头"
                    v-show="row.cT < -60"
                  ></i
                ></span>

                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >C:{{ row.cT > -60 ? row.cT : '' }}
                  <i
                    class="icon-v5 icon-v5-jieruguanli"
                    title="未接探头"
                    v-show="row.cT < -60"
                  ></i
                ></span>
              </div>
            </template>
            <template slot-scope="{ row }" slot="ampere">
              <span
                style="
                  border: 1px solid #414959;
                  border-radius: 5px;
                  padding: 1px 30px;
                  color: #999999;
                "
                >{{ '总路：' + row.gA }}</span
              >

              <div
                v-show="row.lineType === '180' || row.lineType === '380'"
                class="split-line"
              >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >A:{{ row.aA }}</span
                >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >B:{{ row.bA }}</span
                >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >C:{{ row.cA }}</span
                >
              </div>
            </template>
            <template slot-scope="{ row }" slot="volt">
              <span
                style="
                  border: 1px solid #414959;
                  border-radius: 5px;
                  padding: 1px 30px;
                  color: #999999;
                "
              >
                {{ '总路：' + row.gV }}</span
              >

              <div
                v-show="row.lineType === '180' || row.lineType === '380'"
                class="split-line"
              >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >A:{{ row.aV }}</span
                >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >B:{{ row.bV }}</span
                >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >C:{{ row.cV }}</span
                >
              </div>
            </template>
            <template slot-scope="{ row }" slot="watt">
              <span
                style="
                  border: 1px solid #414959;
                  border-radius: 5px;
                  padding: 1px 30px;
                  color: #999999;
                "
              >
                {{ '总路：' + row.gW }}</span
              >

              <div
                v-show="row.lineType === '180' || row.lineType === '380'"
                class="split-line"
              >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >A:{{ row.aW }}</span
                >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >B:{{ row.bW }}</span
                >
                <span
                  style="
                    border: 1px solid #414959;
                    border-radius: 5px;
                    padding: 1px 5px;
                    color: #999999;
                  "
                  >C:{{ row.cW }}</span
                >
              </div>
            </template>
            <template slot-scope="{ row }" slot="status">
              <span v-show="!row.oc" class="dangers-text"> 已断 </span>
              <span v-show="row.oc" class="normals-text"> 已通 </span>
            </template>
            <template
              slot-scope="{ row }"
              slot="operating"
              v-if="obj.equipmentType === 1"
            >
              <span>
                <span class="verticallyCentered" v-if="row.enableNetCtrl">
                  <Button
                    type="text"
                    style="color: #f24e4c"
                    v-show="row.others.online !== 1"
                    :disabled="row.others.online !== 1 || row.localLock"
                    >合闸</Button
                  >
                  <span v-if="row.others.online === 1">
                    <Button
                      type="text"
                      style="color: #f24e4c"
                      v-if="row.oc"
                      :disabled="true"
                      >合闸</Button
                    >
                    <Button
                      type="text"
                      style="color: #f24e4c"
                      v-else-if="!row.oc && row.localLock"
                      :disabled="true"
                      >合闸</Button
                    >
                    <Button
                      type="text"
                      style="color: #f24e4c"
                      v-else
                      @click="
                        switcherCtlEvent(
                          row.mac,
                          row.addr,
                          true,
                          'lineList',
                          row
                        )
                      "
                      >合闸</Button
                    >
                  </span>

                  <Button
                    type="text"
                    style="color: #21f27f"
                    v-show="row.others.online !== 1"
                    :disabled="row.others.online !== 1 || row.localLock"
                    >分闸</Button
                  >
                  <span v-if="row.others.online === 1">
                    <Button
                      type="text"
                      style="color: #21f27f"
                      v-if="!row.oc"
                      :disabled="true"
                      >分闸</Button
                    >
                    <Button v-else-if="row.oc && row.localLock" :disabled="true"
                      >分闸</Button
                    >
                    <Button
                      type="text"
                      style="color: #21f27f"
                      v-else
                      @click="
                        switcherCtlEvent(
                          row.mac,
                          row.addr,
                          false,
                          'lineList',
                          row
                        )
                      "
                      >分闸</Button
                    >
                  </span>
                </span>
                <span class="verticallyCentered" v-else>
                  <Button
                    type="text"
                    style="color: #007eff"
                    @click="handleUnlock(row)"
                    :disabled="row.localLock"
                    >解锁</Button
                  >
                </span>
                <span class="verticallyCentered" v-if="subItemFlag">
                  <Button
                    type="text"
                    style="color: #007eff"
                    @click="handlesetUp(row)"
                    >设置分项</Button
                  >
                </span>
              </span>
            </template>
          </Table>
        </Row>
    </div>
    <div v-if="equipmentFlag">
      <div style="background-color:#1a202e">
            <Col :span="3" style="padding-top:20px;padding-left:20px">
            <span @click="goBackPrev"><Icon type="ios-undo" />返回 </span>
          </Col>
       <gurationList
        v-if="equipmentFlag"
        :param="obj"
        @queryList="queryList"
      ></gurationList>
      </div>
    </div>
    <Modal
      title="设置分项"
      :mask="false"
      v-model="setupFlag"
      width="50%"
      @on-ok="submitInformation"
      @on-cancel="handleInformationClose"
    >
      <Form :model="subItemForm" ref="informationForm">
        <FormItem label="分项类型:"></FormItem>
        <Select v-model="subItemForm.type" clearable style="width: 100%">
          <Option
            v-for="item in subItemOptions"
            :key="item.id"
            :label="item.CategoryName"
            :value="item.id"
          ></Option>
        </Select>
      </Form>
    </Modal>
    <Modal v-model="dblFlag" title="" :mask="false" custom-class="dbl-custom">
      <span class="dbl-title"> '功率(瓦):' </span>
      <div class="dbl-detail" :class="{ isThreePhase: !threePhaseDetail }">
        <span>{{ gw }}</span>
        <div
          v-if="threePhaseDetail"
          class="dbl-split-line"
          style="overflow: hidden"
        >
          <span>A:{{ aw }}</span>
          <span>B:{{ bw }}</span>
          <span>C:{{ cw }}</span>
        </div>
      </div>
    </Modal>
    <Modal id="Details" width="80%" v-model="detailsFlag" title="设备参数详情">
      <div slot="header">
        <span class="title">设备详情</span>
        <span
          class="offline-attention c-danger"
          v-show="obj.others.online !== 1"
          >设备离线可能是由于设备断电、通讯信号弱、或发生重大事故</span
        >
      </div>
      <div class="date-picker">
        <DatePicker
          v-if="obj.equipmentType === 16"
          v-model="value1"
          :editable="false"
          type="daterange"
          format="yyyy-MM-dd"
          @on-change="handleDateRangeChange"
          :clearable="false"
          style="width: 135px"
        ></DatePicker>
        <DatePicker
        v-else
          style="width: 135px"
          v-model="value"
          :type="
            obj.equipmentType === 6 || obj.equipmentType === 7
              ? 'month'
              : 'date'
          "
          @on-change="handleDateChange"
          :disabled="$store.state.dateFlag"
          :editable="false"
          :format="
            obj.equipmentType === 6 || obj.equipmentType === 7
              ? 'yyyy-MM'
              : 'yyyy-MM-dd'
          "
          placeholder="请选择日期"
          :clearable="false"
        >
        </DatePicker>
      </div>
      <Details v-if="detailsFlag" :param="obj"></Details>
      <div slot="footer"></div>
    </Modal>
    <Modal
      v-model="inspectionFlag"
      footer-hide
      title="设备巡检记录"
      :mask="false"
    >
      <div style="margin: 10px 20px">
        <InspectionDevice
          ref="inspection"
          v-if="inspectionFlag"
          :inspectionData="inspectionData"
          :titleFlag="false"
        ></InspectionDevice>
      </div>
    </Modal>
    <Modal
      title="立即修改设备服务指向"
      v-model="orientationVisible"
      footer-hide
      :mask="false"
    >
      <Form :model="orientationForm">
        <FormItem style="display: flex">
          <span>新指向类型：</span>
          <Select
            transfer
            clearable
            v-model="orientationForm.isDomain"
            placeholder="请选择"
            style="width: 200px"
            @input="
              handleInput(
                'isDomain',
                orientationForm.mac,
                orientationForm.isDomain
              )
            "
          >
            <Option
              z-index="5"
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></Option>
          </Select>
        </FormItem>
        <FormItem style="display: flex">
          <span style="margin-left: 25px">新指向：</span>
          <Input
            style="width: 205px"
            type="text"
            v-model="orientationForm.ipOrDomain"
            @input="
              handleInput(
                'ipOrDomain',
                orientationForm.mac,
                orientationForm.ipOrDomain
              )
            "
          />
        </FormItem>
        <FormItem style="display: flex">
          <span>新端口指向：</span>
          <Input
            style="width: 205px"
            @input="
              handleInput('port', orientationForm.mac, orientationForm.port)
            "
          />
        </FormItem>
        <FormItem style="display: flex">
          <span style="margin-left: 14px">服务入口：</span>
          <Input
            style="width: 205px"
            placeholder="格式举例/data/carry 或/evx-bishop/data/carry"
            v-model="orientationForm.dealEntry"
            @input="
              handleInput(
                'dealEntry',
                orientationForm.mac,
                orientationForm.dealEntry
              )
            "
          />
        </FormItem>
        <FormItem style="margin-left: 330px">
          <Button type="default" @click="orientationVisible = false"
            >取消</Button
          >
          <Button type="primary" style="margin-left: 10px" @click="handleSave"
            >发送</Button
          >
        </FormItem>
      </Form>
    </Modal>
    <!-- <Modal
      title="设备参数调整"
      v-model="equipmentFlag"
      width="1440px"
      footer-hide
      :transfer="false"
      class="editProjectsList_body"
      class-name="editProjectsList"
    >
      <gurationList
        v-if="equipmentFlag"
        :param="obj"
        @queryList="queryList"
      ></gurationList>
    </Modal> -->
    <Modal
      title="区域关系绑定"
      width="1000px"
      :mask="false"
      v-model="BindingFlag"
    >
      <div style="margin: 10px 20px">
        <RegionalRelationshipBinding
          :resId="resId"
          v-if="BindingFlag"
          @handleClose="handleClose"
        ></RegionalRelationshipBinding>
      </div>
    </Modal>
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
      >
        <CommandFeedback
          :classFlag="true"
          :instructionsData="instructionsData"
          :operateAt="5"
        ></CommandFeedback>
      </Modal>
    </div>
        <!-- <Modal
        title="提示"
        v-model="modal"
        :footer-hide="true"
        :styles="{top: '20px',width:'300px'}">
        <p>
          您确定要合闸?
        </p>
        <p v-for="(item,index) in opendatas" :key="index" :style="item.exeResult===1?'color:#f24e4c;text-align:center;line-height:25px':'color:#21f27f;text-align:center;line-height:25px'">{{
            item.exeResult===1?item.mac + "" +item.msg:item.mac + "命令已提交，生效中..."
            }}</p>
    </Modal> -->
  </div>
</template>

<script>
    import {
        queryBoxes,
        getBuildings,
        getGroupType,
        getGroupTree,
        queryChannels,
        remotectrl,
        disableSelection,
        getChannelCategory,
        abnormalSwitchUnlock,
        addChannelCategory,
        queryPageAuth,
        updateNodeTitle,
        modifyMacRate,
        changeStatus
    } from '@/api/public';
    import store from '@/store';
    import Details from '../../Control/Details.vue';
    import { queryBoxDetails } from '@/api/control/index';
    // import Clipboard from 'clipboard';
    import gurationList from './gurationList.vue';
    import CommandFeedback from '../../Common/CommandFeedback.vue';
    import InspectionDevice from '../../Common/InspectionDevice.vue';
    import RegionalRelationshipBinding from '../../Common/RegionalRelationshipBinding.vue';
    export default {
        components: {
            Details,
            InspectionDevice,
            gurationList,
            CommandFeedback,
            RegionalRelationshipBinding
        },
        name: 'overviewList',
        props: {
            options: { type: Object, default: () => {} }
        },
        data () {
            return {
                value: '',
                value1: '',
                custColumns8: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '勾选态',
                        width: 80,
                        slot: 'select'
                    },
                    { title: '线路名称', slot: 'lineName', width: 110 },
                    { title: '型号', key: 'clearModel', width: 90 },
                    { title: '漏电流(毫安)', key: 'gLd', width: 90 },
                    { title: '温度(摄氏度)', slot: 'temperature', width: 170 },
                    { title: '电流(安)', slot: 'ampere', width: 170 },
                    { title: '电压(伏)', slot: 'volt', width: 170 },
                    { title: '功率', slot: 'watt', width: 170 },
                    { title: '功率因数', key: 'gPF', width: 100 },
                    { title: '状态', slot: 'status', width: 90 },
                    { title: '操作', align: 'center', slot: 'operating', width: 180 }
                ],
                grid: {
                    xl: 3,
                    lg: 3,
                    md: 12,
                    sm: 24,
                    xs: 24
                },
                bandFlag: false,
                detailsFlag: false,
                tableData: [],
                loading: false,
                flag: true,
                form: {
                    mac: this.options.mac
                },
                obj: {
                    others: {
                        version: '',
                        online: ''
                    }
                },
                instructionsFlag: false,
                buildings: [],
                building: '',
                post: true,
                units: [],
                unit: '',
                status: '',
                stats: [
                    { value: '', text: '全部' },
                    {
                        value: '1',
                        text: '在线'
                    },
                    {
                        value: '0',
                        text: '离线'
                    },
                    {
                        value: '-1',
                        text: '脱线'
                    }
                ],
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                controlTableHeight: {
                    position: 'relative'
                    //  height: this.$store.state.controlTableHeight
                },
                pageNo: 1, // 当前页码
                pageSize: 20, // 每页条数
                total: 0, // 数据总数
                channelsPageSize: 10,
                channelsPageNo: 1,
                channels: [],
                subItemFlag: false,
                channelsData: [],
                dblFlag: false,
                gw: '',
                aw: '',
                bw: '',
                cw: '',
                threePhaseDetail: false,
                inspectionData: {
                    projectCode: '',
                    macs: ''
                },
                orientationForm: {
                    _SPECIAL_FLAG: 'INR_CHK_ONR',
                    cmd: 'SETSERVERPOINT_DA',
                    mac: '',
                    isDomain: '0',
                    ipOrDomain: '',
                    port: '',
                    dealEntry: ''
                },
                BindingFlag: false,
                resId: '',
                option: [
                    {
                        label: 'IP',
                        value: '0'
                    },
                    {
                        label: '域名',
                        value: '1'
                    }
                ],
                orientationVisible: false,
                online: 0,
                equipmentNum: 0,
                equipmentFlag: false,
                inspectionFlag: false,
                instructionsData: {},
                setupFlag: false,
                subItemForm: {
                    type: ''
                },
                subItemOptions: [],
                enableNetCtrls: [],
                packNewlist: [],
                newArr: [],
                modal: false,
                opendatas: []
            };
        },
        created () {

        },
        mounted () {
            this.queryList();
            this.getGroupTypes();
            this.init();
            //
        },
        destroyed () {
            store.commit('overviewMac', '')
        },
        methods: {
            handleDateRangeChange (val) {
                this.value1 = val;
                store.commit('historyDate', val);
            },
            goBackPrev () {
                this.flag = true
                this.equipmentFlag = false
            },
            handleDateChange (val) {
                this.value = val;
                store.commit('historyDate', val);
            },
            handleClose () {
                this.BindingFlag = false;
            },
            getGroupTypes () {
                let params = {
                    projectCode: this.$store.state.projectCode // 'P00000000012'
                };
                getGroupType(params)
                    .then((res) => {
                        //
                        if (res.success) {
                            this.packetList = res && res.data;
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
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            // 递归遍历数组为树状结构
            getTree (tree = []) {
                let arr = [];
                if (!!tree && tree.length !== 0) {
                    tree.forEach((item) => {
                        let obj = {};
                        obj.id = item.id;
                        obj.value = item.id;
                        obj.parentId = item.parentId;
                        obj.title = item.name;
                        // 其他你想要添加的属性
                        obj.expand = true;
                        obj.selected = false;
                        obj.checked = false;
                        obj.children = this.getTree(item.children); // 递归调用
                        arr.push(obj);
                    });
                }
                return arr;
            },

            cloneTree (score, parentId = 0) {
                let tree = [];
                score.map((item) => {
                    if (item.parentId === parentId) {
                        // 递归寻找
                        item.children = this.cloneTree(score, item.id);
                        tree.push(item);
                    }
                });

                return tree;
            },

            getGroupTrees () {
                // if (!this.packetTypes) {
                //     this.$Message.error({
                //         content: '请先选择分组类型'
                //     });
                // }
                getGroupTree({ groupId: this.packetTypes })
                    .then((res) => {
                        if (res.code === '0') {
                            this.packNewlist = res.data;
                            // this.packetFilterList = res.data
                            let resData = this.getTree(res.data);
                            this.packetFilterList = this.cloneTree(resData);
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            init () {
                this.flag = true;
                if (this.$store.state.overviewMac.mac !== undefined) {
                    this.form.mac = this.$store.state.overviewMac.mac;
                }
                this.getBuilding();
                this.queryTreePageAuth();
            },
            queryTreePageAuth () {
                let params = {
                    resKeys: 'AUTH_PROJECT_USE,AUTH_PROJECT_USE',
                    operKeys: 'ENERGY_AREA,ENERGY_CATEGORY'
                };
                queryPageAuth(params)
                    .then((res) => {
                        if (res.success) {
                            this.bandFlag = res.data[0].result;
                            this.subItemFlag = res.data[1].result;
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
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            getBuilding () {
                let all = '全部';
                let params = {
                    projectCode: this.$store.state.projectCode, //  'P00000000012'
                    equipmentTypes: this.options.type,
                    build: this.build
                };
                this.$nextTick(() => {
                    getBuildings(params)
                        .then((res) => {
                            //
                            if (res.success) {
                                if (params.build && params.build !== '') {
                                    this.units = [{ text: all, value: '' }].concat(res.data);
                                    this.unit = '';
                                } else {
                                    this.buildings = [{ text: all, value: '' }].concat(res.data);
                                    this.units = [];
                                    this.unit = '';
                                }
                                this.queryList();
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
                    //     .finally(() => {
                    //         this.post = true;
                    //         this.loading = false;
                    //         this.loadingData = false;
                    // });
                });
            },
            handleChange (val) {
                this.build = val;
                //
                this.pageNo = 1;
                this.getBuilding();
            },
            handleUnit (val) {
                this.unit = val;
                //
                this.pageNo = 1;
                this.queryList();
            },
            handleStatus (val) {
                //
                this.pageNo = 1;
                this.status = val;
                // this.queryList();
            },
            handleSearch () {
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    this.pageNo = 1;
                    this.queryList();
                }
            },
            // 调取取接口方法
            queryList () {
                this.loading = true;
                let params = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize, // 24,
                    projectCode: this.$store.state.projectCode, // 'P00000000012',
                    build: this.build,
                    unit: this.unit,
                    status: this.status,
                    key: this.options.mac,
                    equipmentTypes: this.options.type, // 1
                    nodeId: this.packetFilter ? this.packetFilter.join() : this.packetFilter
                };
                if (this.activeName === 'first') {
                    params.equipmentTypes = '1';
                }
                if (localStorage.getItem('dblLineObj')) {
                    this.handleModifyMacRate(localStorage.getItem('dblLineObj'), false);
                    localStorage.setItem('dblLineObj', '');
                }
                this.$nextTick(function () {
                    queryBoxes(params)
                        .then((res) => {
                            if (res.success) {
                                //
                                this.post = true;
                                this.tableData = res.datas;
                                console.log(this.tableData, '======this.tableData');
                                this.total = res.total;
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error({ content: res.message });
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                    });
                    //     .finally(() => {
                    //         this.post = true;
                    //         this.loading = false;
                    //         this.loadingData = false;
                    // });
                });
            },
            handleInputMac (e) {
                this.$emit('sendMac', e.target.value);
            },
            handleInput (key, index, value) {
                sessionStorage.setItem(key + '-' + index, value);
                this.orientationForm[key] = value;
            },
            handleSave () {
                let params = {
                    _SPECIAL_FLAG: this.orientationForm._SPECIAL_FLAG,
                    cmd: this.orientationForm.cmd,
                    mac: JSON.stringify([this.orientationForm.mac]),
                    isDomain: JSON.stringify([this.orientationForm.isDomain]),
                    ipOrDomain: JSON.stringify([this.orientationForm.ipOrDomain]),
                    port: JSON.stringify([this.orientationForm.port]),
                    dealEntry: JSON.stringify([this.orientationForm.dealEntry])
                };
                this.$Modal.confirm({
                    title: '提示',
                    content:
                        '<div>此操作将会使设备指向到新的服务器上，请谨慎操作。同时设备将会脱离当前平台，请您再次确认。操作确认</div>q',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        remotectrl(params)
                            .then((res) => {
                                if (res.success) {
                                    if (res.code === '0') {
                                        this.orientationVisible = false;
                                        this.$Message.success({
                                            content: '命令已提交，生效中..'
                                        });
                                    }
                                } else if (res.code === '-1') {
                                } else {
                                    if (res.message) {
                                        this.$Message.error({
                                            content: res.message
                                        });
                                    } else {
                                        this.$Message.error({
                                            content: '未知错误，请刷新重试'
                                        });
                                    }
                                }
                            })
                            .catch((err) => {
                                if (err) {
                                    this.$Message.error({
                                        content: '未知错误，请刷新重试'
                                    });
                                }
                        });
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消'
                        });
                    }
                });
            },
            handleKeyWords (event) {
                this.$emit('sendMac', event.target.value);
                this.form.mac = event.target.value;
                this.pageNo = 1;
                this.queryList();
            },

            handleTypes (val) {
                this.packetTypes = val;
                this.getGroupTrees();
            },
            handleCommand (val, row) {
                if (val === 'command-list') {
                    //
                    this.handleDblLineList(row);
                } else if (val === 'orientation') {
                    //
                    this.handleOrientation(row);
                } else if (val === 'inspection') {
                    this.handleInspection(row);
                    //
                } else if (val === 'equipment') {
                    //
                    this.handleEquipment(row);
                } else if (val === 'builtIn') {
                    //
                    this.handleBuiltIn(row);
                } else if (val === 'longitude') {
                    //
                    this.handleLongitude(row);
                } else if (val === 'region') {
                    //
                    this.handleRegionalRelations(row);
                }
            },
            handleRegionalRelations (row) {
                this.BindingFlag = true;
                this.resId = row.resId;
            },
            handleBuiltIn (row) {
                const pre = 'multiManage-';
                this.$router.push({
                    name: `${pre}builtInTimer`,
                    params: {
                        mac: row.mac
                    }
                });
            },
            handleLongitude (row) {
                const pre = 'multiManage-';
                this.$router.push({
                    name: `${pre}latlongTimer`,
                    params: {
                        mac: row.mac
                    }
                });
            },
            handleEquipment (row) {
                this.obj = row;
                this.flag = false
                queryBoxDetails({ mac: row.mac })
                    .then((res) => {
                        if (res.success) {
                            store.commit('aliasName', res.data.name);
                            store.commit('customAlarm', res.data.others.customAlarm);
                            store.commit('classifyLabel', res.data.others.classifyLabel);
                            store.commit('sortBUR', {
                                build: res.data.build,
                                unit: res.data.unit,
                                room: res.data.room,
                                linkman: res.data.linkman,
                                linkman2: res.data.linkman2,
                                linkmanTel: res.data.linkmanTel,
                                linkmanTel2: res.data.linkmanTel2
                            });
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({
                                    content: res.message
                                });
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
                this.equipmentNum = row.equipmentType;
                this.online = row.others.online;
                store.commit('mac', row.mac);
                store.commit('equipmentType', row.equipmentType);
                this.equipmentFlag = true;
            },
            handleOrientation (row) {
                if (row.others.online === 1) {
                    this.orientationVisible = true;
                    this.orientationForm.mac = row.mac;
                    this.orientationForm.isDomain = sessionStorage.getItem(
                        'isDomain-' + row.mac
                    )
                        ? sessionStorage.getItem('isDomain-' + row.mac)
                        : '0';
                    this.orientationForm.ipOrDomain = sessionStorage.getItem(
                        'ipOrDomain-' + row.mac
                    )
                        ? sessionStorage.getItem('ipOrDomain-' + row.mac)
                        : '';
                    this.orientationForm.port = sessionStorage.getItem('port-' + row.mac)
                        ? sessionStorage.getItem('port-' + row.mac)
                        : '';
                    this.orientationForm.dealEntry = sessionStorage.getItem(
                        'dealEntry-' + row.mac
                    )
                        ? sessionStorage.getItem('dealEntry-' + row.mac)
                        : '';
                } else {
                    this.$Message.error({
                        content: '设备不在线'
                    });
                }
            },
            handleDblLineList (obj) {
                localStorage.setItem('dblLineObj', obj.mac);
                if (obj.equipmentType !== 1 && obj.equipmentType !== 2) return false;
                if (obj) this.obj = obj;
                this.detailsFlag = false;
                this.flag = false;
                this.$nextTick(() => {
                    this.$refs.currentRowTable.selectAll(false)
                })
                this.queryChannels();
            },
            handleReset () {
                this.form.mac = '';
                store.commit('mac', '');
                this.options.mac = ''
                this.packetTypes = '';
                this.packetFilter = [];
                this.unit = '';
                this.building = '';
                this.status = '';
                this.queryList();
                this.init();
            },
            //  初始化页面 完善
            queryChannels () {
                let params = {
                    pageNo: this.pageNo,
                    pageSize: this.channelsPageSize,
                    mac: this.obj.mac
                };
                this.$nextTick(() => {
                    queryChannels(params)
                        .then((res) => {
                            if (res.success) {
                                // this.channelsData = res.datas;
                                this.channelsData = res.datas.map((item) => ({
                                    ...item,
                                    _checked: !item.disableSelectState,
                                    _disabled: item.disableSelectState
                                }));

                                // if (this.channelsData._checked === undefined) {
                                //     this.channelsData_checked = false
                                // }

                                // this.channelDatas = JSON.parse(JSON.stringify(res.datas));
                                if (this.dblFlag) {
                                    res.datas.forEach((v, i) => {
                                        if (v.addr === this.dblAddr) {
                                            this.gw = v.gW;
                                            this.aw = v.aW;
                                            this.bw = v.bW;
                                            this.cw = v.cW;
                                        }
                                    });
                                }
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error({ content: res.message });
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                    });
                });
            },
            // 一键合闸待完善 完善 有未知bug
            handleChannelsOC (type) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '您确定要一键' + (type === true ? '合闸' : '分闸') + '吗？',
                    onOk: () => {
                        let arr = this.channels
                        let str = []
                        arr.forEach(item => {
                            str.push(
                                {
                                    'mac': item.mac,
                                    'addrOptInfos': [
                                        {
                                            'onOrOff': type,
                                            'addrs': [
                                                item.addr
                                            ]

                                        }
                                    ]

                                }
                            )
                        })

                        str = JSON.stringify(str)
                        changeStatus(str).then(res => {
                            this.modal = true
                            if (res.code === '0') {
                                this.$Message.success('命令已提交，生效中...')
                            } else {
                                this.opendatas = res.data
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消'
                        });
                    }
                });
            },
            handleInspection (row) {
                this.inspectionFlag = true;
                this.inspectionData = {
                    projectCode: row.projectCode,
                    macs: row.mac
                };
            },
            handleEdit (index, e, title) {
                //  完善
                updateNodeTitle({ mac: e.mac, nodeNo: e.addr, title: title })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '命令已提交，生效中..'
                            });
                            this.$refs[`popover-` + index].visible = false;
                            this.queryChannels();
                        } else if (res.code === '-1') {
                        } else {
                            if (res.message) {
                                this.$Message.error({ content: res.message });
                            } else {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            handleShow () {

                //  线路弹窗显示时方法待完善
            },
            handleHide () {

                //  线路弹窗关闭时方法待完善
            },
            handleInformationClose () {
                this.subItemForm.type = '';
                this.setupFlag = false;
            },
            submitInformation () {
                if (this.subItemForm.type === '') {
                    this.$Message.error({
                        content: '请选择分项'
                    });
                }
                if (this.channel.gatherAddr === '-1') {
                    this.$Modal.confirm({
                        title: '提示',
                        content:
                            '如果同时存在进线直连和非进线直连线路的分项配置，可能导致按分项统计时电量不准。 是否继续？',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            let parmas = {
                                categoryId: this.subItemForm.type,
                                channelAddr: this.channelAddr,
                                resId: this.obj.resId
                            };
                            addChannelCategory(parmas)
                                .then((res) => {
                                    if (res.success) {
                                        this.$Message.success({
                                            content: res.message
                                        });
                                        this.setupFlag = false;
                                        this.queryChannels();
                                        // this.setTimer(
                                        //     this.queryChannels,
                                        //     config.pollingInterval.channel * 1000
                                        // );
                                    } else if (res.code === '-1') {
                                    } else {
                                        this.$Message.error({ content: res.message });
                                    }
                                })
                                .catch((err) => {
                                    if (err) {
                                        this.$Message.error({
                                            content: '未知错误，请刷新重试'
                                        });
                                    }
                            });
                        },
                        onCancel: () => {
                            this.$Message.info({
                                content: '已取消'
                            });
                        }
                    });
                } else {
                    let parmas = {
                        categoryId: this.subItemForm.type,
                        channelAddr: this.channelAddr,
                        resId: this.obj.resId
                    };
                    addChannelCategory(parmas)
                        .then((res) => {
                            if (res.success) {
                                this.$Message.success({
                                    content: res.message
                                });
                                this.setupFlag = false;
                                this.queryChannels();
                                // this.setTimer(
                                //     this.queryChannels,
                                //     config.pollingInterval.channel * 1000
                                // );
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error({ content: res.message });
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                    });
                }
            },
            backToPrev () {
                this.flag = true;
                //  this.$refs.selection.selectAll(false);
                this.handleModifyMacRate(this.obj.mac, false);
                //  待完善
            },
            handleResetState (row, index) {
                this.channelsData.forEach((item, idx) => {
                    if (idx === index) {
                        // item._disabled = row._checked;
                        item.disableSelectState = !row._checked
                        if (item.disableSelectState === false) {
                            item._disabled = false;
                        } else {
                            item._disabled = true;
                        }
                    }
                });
                let addrs = []
                this.channelsData.map((item) => {
                    if (item.disableSelectState) return addrs.push(item.addr);
                });
                let parmas = {
                    mac: row.mac,
                    addrs: addrs ? addrs.join(',') : ''
                };
                disableSelection(parmas)
                    .then((res) => {
                        if (res.success) {
                            if (res.code === '0') {
                                if (!row._checked) {
                                    this.$Message.success({
                                        content: '已设置为不可以勾选'
                                    });
                                } else {
                                    this.$Message.success({
                                        content: '已设置为可以勾选'
                                    });
                                }
                            }
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({ content: res.message });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            handleModifyMacRate (mac, flag) {
                if (!mac) return false;
                modifyMacRate({
                    fastMac: flag === true ? mac : '',
                    slowMac: flag === true ? '' : mac
                });
            },
            handleUnlock (row) {
                if (!row.enableNetCtrl && row.localLock) {
                    this.$Message.error({
                        content: '设备已被硬件锁定, 请现场查看设备'
                    });
                }
                this.$Modal.confirm({
                    title: '提示',
                    content:
                        '开关可能由于现场人为手动分闸或短路、漏电保护等故障锁定，需要确认现场可以安全合闸后才能解锁。此解锁操作后远程合闸不受限制，解锁、合闸造成的风险自行承担。',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        let params = {
                            cmd: 'ABNORMAL_SWITCH_UNLOCK',
                            mac: row.mac,
                            addr: row.addr
                        };
                        abnormalSwitchUnlock(params)
                            .then((res) => {
                                if (res.success) {
                                    if (res.code === '0') {
                                        this.$Message.success({
                                            content: res.message
                                        });
                                    }
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
                                        content: '未知错误,请重新刷新'
                                    });
                                }
                        });
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消'
                        });
                    }
                });
            },
            handlesetUp (row) {
                this.subItemForm.type = '';
                this.channel = row;
                this.channelAddr = row.addr;
                //  clearTimeout(this.timerID);
                this.setupFlag = true;
                getChannelCategory()
                    .then((res) => {
                        if (res.success) {
                            this.subItemOptions = res.data;
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
                                content: '未知错误,请重新刷新'
                            });
                        }
                });
            },
            switcherCtlEvent (mac, addr, opr, lineList, row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '您确定要' + (opr === true ? '合闸' : '分闸') + '吗？',
                    onOk: () => {
                        let str = [ {
                            'mac': mac,
                            'addrOptInfos': [
                                {
                                    'onOrOff': opr,
                                    'addrs': [
                                        addr
                                    ]

                                }
                            ]

                        }]

                        str = JSON.stringify(str)
                        changeStatus(str).then(res => {
                            if (res.code === '0') {
                                this.$Message.success('命令已提交，生效中...')
                            } else {
                                this.$Message.error(res.data[0].mac + res.data[0].msg)
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info({
                            content: '已取消'
                        });
                    }
                });

                // if (
                //     (row && row.enableNetCtrl === false) ||
                //     (this.enableNetCtrls.length === 1 && this.enableNetCtrls[0] === false)
                // ) {
                //     this.$Message.error({
                //         content:
                //             (row ? row.title : this.titles[0]) +
                //             '已因用电报警断电或现场关断,遥控功能关闭.'
                //     });
                //     return false;
                // }
                // this.$Modal.confirm({
                //     title: '提示',
                //     content:
                //         (this.enableNetCtrls.indexOf(false) > -1
                //             ? '线路已因用电报警断电或现场关断,遥控功能关闭.'
                //         : '') +
                //         '您确定要' +
                //         (opr ? '合闸' : '分闸'),
                //     okText: '确定',
                //     cancelText: '取消',
                //     onOk: () => {
                //         let _param = {
                //             macAddr: mac + '-' + addr,
                //             value1: opr,
                //             _operate_at: lineList ? '2' : '1'
                //         };
                //         batchRemotectrl(_param)
                //             .then((res) => {
                //                 if (res.success) {
                //                     if (res.code === '0') {
                //                         this.$Message.success({
                //                             content: '命令已提交，生效中..'
                //                         });
                //                     }
                //                 } else if (res.code === '-1') {
                //                 } else {
                //                     this.$Message.error({
                //                         content: res.message
                //                     });
                //                 }
                //             })
                //             .catch((err) => {
                //                 if (err) {
                //                     this.$Message.error({
                //                         content: '未知错误,请重新刷新'
                //                     });
                //                 }
                //         });
                //     },
                //     onCancel: () => {
                //         this.$Message.info({
                //             content: '已取消'
                //         });
                //     }
                // });
            },
            handleInstructions () {
                this.instructionsData = {
                    mac: this.obj.mac,
                    projectCode: this.$store.state.projectCode
                };
                this.instructionsFlag = true;
            },
            handleDblClick (row, index) {
                if (row.title === '功率') {
                    this.dblFlag = true;
                    this.gw = row.gW;
                    this.aw = row.aW;
                    this.bw = row.bW;
                    this.cw = row.cW;
                    this.dblAddr = row.addr;
                    if (row.lineType === '380' || row.lineType === '180') {
                        this.threePhaseDetail = true;
                    } else {
                        this.threePhaseDetail = false;
                    }
                }
            },
            handleSelectionChange (val) {
                this.titles = [];
                this.channels = [];
                this.enableNetCtrls = [];

                val.forEach((item, index) => {
                    if (
                        item.others.online === 1 &&
                        (item.lineType === '220' || item.lineType === '380')
                    ) {
                        this.channels.push({ addr: item.addr, mac: item.mac });
                        this.titles.push(item.title);
                        this.enableNetCtrls.push(item.enableNetCtrl);
                    }
                });
            },
            macClick (obj) {
                this.obj = obj;
                obj.boxName = obj.name
                store.commit('mac', obj.mac);
                store.commit('equipmentType', obj.equipmentType);
                store.commit('maintenanceObj', obj);
                if (obj.equipmentType === 6 || obj.equipmentType === 7) {
                    this.value = this.$func.getCurrentYearMonth();
                } else if (obj.equipmentType === 15) {
                    this.value = this.$func.formatDate(
                        'yyyy-MM-dd',
                        new Date(new Date().setDate(new Date().getDate() - 1))
                    );
                } else if (obj.equipmentType === 16) {
                    this.value1 = [
                        this.$func.formatDate(
                            'yyyy-MM-dd',
                            new Date(new Date().setDate(new Date().getDate() - 7))
                        ),
                        this.$func.formatDate(
                            'yyyy-MM-dd',
                            new Date(new Date().setDate(new Date().getDate() - 1))
                        )
                    ];
                } else {
                    this.value = this.$func.getNowFormatDate();
                }
                if (obj.equipmentType === 16) {
                    store.commit('historyDate', this.value1);
                } else {
                    store.commit('historyDate', this.value);
                }
                this.detailsFlag = true;
                this.handleModifyMacRate(obj.mac, true);
            },
            // 切换每页条数的事件
            handleSizeChange (val) {
                this.pageSize = val;
                this.queryList();
            },
            // 页面改变发生的事件
            handleCurrentChange (val) {
                this.pageNo = val;
                this.queryList();
            }
        }
    };
</script>

<style lang="less" scoped>
.header{
  display: flex;
  justify-content: space-between;
}
.demo-scroll-top {
  height: 30%;
}
.grid-content {
  background-color: #1a202e;
  margin-top: 10px;
  border-radius: 5px;
  display: flex;
}
.grid-content:hover {
  background-color: #21293c;
}
.dangers {
  background: rgba(255, 79, 79, 0.15) !important;
  color: #f56c6c !important;
  width: 40px;
  height: 22px;
  padding: 2px 5px;
}
.success-line {
  color: #21f27f !important;
  background: rgba(0, 186, 138, 0.15);
  width: 40px;
  height: 22px;
  padding: 2px 5px;
}
.b-infos {
  color: #909399;
  background: rgba(144, 147, 153, 0.15);
  width: 40px;
  height: 22px;
  padding: 2px 5px;
}
// .device-wrap {
// }
// .device-wrap:hover {

// }
.devicr-button {
  padding: 1px;
}
.left-device {
  flex: 1;
  padding: 30px;
}
.right-device {
  flex: 2;
  padding: 30px;
}
.ivu-icon {
  margin-left: 0px;
}
.device-container {
  padding: 5px;
  -webkit-border-bottom-left-radius: '5px';
  -webkit-border-bottom-right-radius: '5px';
  -moz-border-bottom-left-radius: '5px';
  -moz-border-bottom-right-radius: '5px';
  border-bottom-left-radius: '5px';
  border-bottom-right-radius: '5px';
  a {
    display: 'table';
    width: '100%';

    table-layout: 'fixed';
    word-wrap: 'break-word';
    overflow: 'hidden';
    text-decoration: 'none';
  }
}
// .split-line {
//   border-top: 1px solid #c6e7ffcf;
//   overflow-x: auto;
// }
.device-a {
  display: flex;
}
.grays {
  color: #1a202e;
  background: #1a202e;
}
.reds {
  background: rgba(242, 78, 76, 0.1);
  color: #F24E4C;
  border:1px solid #F24E4C;
}
.greens {
  color: #21f27f;
   border:1px solid #21f27f;
   background: rgba(33, 242, 127, 0.1);
}
.ivu-table-small td {
  height: 40px !important;
}
/deep/table{
  width: 100% !important;
}
.verticallyCentered {
  display: inline-block;
  vertical-align: middle;
}
.equipment-Id {
  color: #007acc;
}
.date-picker {
  position: absolute;
  right: 40px;
  top: 14px;
  z-index: 999;
  .circle {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    padding: 3px;
    margin-right: 10px;
  }
  span {
    margin-right: 5px;
  }
}
.device-img {
  width: '30%';
  display: flex;
  vertical-align: 'middle';
  text-align: 'center';
  img {
    display: 'inline-block';
    max-width: '100%';
  }
}
.outline-icon {
  transform: rotateZ(90deg);
}
.device-desc {
  margin-top: 20px;
}
.editProjectsList {
  z-index: 900 !important;
}
.editProjectsList_body .ivu-modal-mask {
  z-index: 900 !important;
}
/deep/.ivu-modal-footer{
  border: none;
}
</style>
