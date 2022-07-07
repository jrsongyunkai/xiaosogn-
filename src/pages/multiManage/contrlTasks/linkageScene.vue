<template>
  <div id="linkageScene">
    <Modal
      title="新增编辑联动名称"
      :close-on-click-modal="false"
      v-model="linkageFlag"
      @close="detailsFlag = false"
      width="30%"
      top="30vh"
      id="scenes-form"
    >
      <Form :model="scenes">
        <FormItem v-show="false" label="ID" :label-width="formLabelWidth">
          <Input v-model="scenes.id" autocomplete="off"></Input>
        </FormItem>
        <FormItem label="联动名称" :label-width="formLabelWidth">
          <Input v-model="scenes.name" autocomplete="off"></Input>
        </FormItem>
        <FormItem label="联动备注" :label-width="formLabelWidth">
          <Input v-model="scenes.remark" type="textarea" :rows="4" />
        </FormItem>
      </Form>
      <div slot="footer" class="threeBtn">
        <Button class="b-blue" v-if="detailsFlag" @click="handleLinkageSceneDetails"
          >联动配置</Button
        >
        <div style="text-align: right; width: 100%;">
          <Button class="b-blue" @click="handleLinkageSceneSave">保 存</Button>
          <Button @click="handleLinkageSceneClose">取 消</Button>
        </div>
      </div>
    </Modal>

    <Modal
      title="联动配置"
      :close-on-click-modal="false"
      v-model="dialogDetails"
      width="40%"
      top="20vh"
      id="scene-view"
      @close="dialogDetails = false"
    >
      <Row>
        <Col :span="24">
          <Form class="scene-form" label-position="left">
            <FormItem :label-width="0" required>
              <div class="dis_f">
                  <div class="slot-label pointer">联动名称</div>
                  <Input v-model="scenes.name" readonly autocomplete="off" style="width:300px"></Input>
              </div>
            </FormItem>
            <FormItem
              label="生效时间段"
              :label-width="100"
              class="auto-complete"
              required
            >
              <DatePicker
                style="width: 300px"
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                format="yyyy-MM-dd HH:mm"
                :editable="false"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm"
              >
              </DatePicker>
            </FormItem>
            <FormItem label="如果" style="text-align: center;" :label-width="100" required>
              <template>
                <Row>
                  <Col :span="18" style="display: flex">
                    <Select
                    :clearable='true'
                      v-model="equipmentrValue"
                      :disabled="equipmentFlag"
                      style="width: 155px; margin-right: 20px"
                      placeholder="请选择"
                    >
                      <Option
                        v-for="item in equipmentTypeAttr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </Option>
                    </Select>
                    <Select
                    :clearable='true'
                      v-model="ifValue"
                      style="width: 125px"
                      placeholder="请选择"
                    >
                      <Option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </Option>
                    </Select>
                  </Col>
                </Row>
              </template>
            </FormItem>
            <FormItem>
              <div class="header">
                <span>条件列表</span>
                <Button class="b-blue" @click="handleIfAdd">添加条件</Button>
              </div>
              <Col :span="24" class="tc">
                <Table
                  class="mt-10 device-wrap"
                  style="width: 100%"
                  :data="preList"
                  :columns="preListcolumns"
                  border
                >
                  <template slot-scope="{ row }" slot="name">
                    <span>{{
                      row.others.macName + "(" + row.others.mac + ")"
                    }}</span>
                  </template>

                  <template slot-scope="{ row }" slot="mac">
                    <span>{{ row.others.title }}</span>
                  </template>

                  <template slot-scope="{ row }" slot="equipmentrValue">
                    <span
                      v-if="
                        row.equipmentrValue === 11 ||
                        row.others.equipmentType === 11
                      "
                      >{{
                        (row.elecType === 4 ? "温度" : "湿度") +
                        (row.compType === 1 ? "高于" : "低于") +
                        "\xa0\xa0" +
                        row.compValue
                      }}</span
                    >
                    <span
                      v-if="
                        row.equipmentrValue === 14 ||
                        row.others.equipmentType === 14
                      "
                      >{{
                        "光照" +
                        "度" +
                        (row.compType === 1 ? "高于" : "低于") +
                        "\xa0\xa0" +
                        row.compValue
                      }}</span
                    >
                    <span
                      v-if="
                        row.equipmentrValue !== '1,2' &&
                        row.others.equipmentType !== 1 &&
                        row.others.equipmentType !== 2 &&
                        row.equipmentrValue !== 11 &&
                        row.others.equipmentType !== 11 &&
                        row.equipmentrValue !== 14 &&
                        row.others.equipmentType !== 14
                      "
                      >{{
                        row.typeNumber === 2002
                          ? "烟雾报警"
                          : row.typeNumber === 2006
                          ? "燃气报警"
                          : "设备故障报警"
                      }}</span
                    >
                    <span
                      v-if="
                        row.equipmentrValue === '1,2' ||
                        row.others.equipmentType === 1 ||
                        row.others.equipmentType === 2
                      "
                      >{{
                        row.elecType === 1
                          ? "功率(瓦)"
                          : row.elecType === 2
                          ? "电流"
                          : row.elecType === 3
                          ? "漏电流"
                          : row.elecType === 4
                          ? "温度"
                          : row.elecType === 5
                          ? "电压"
                          : "开关状态"
                      }}</span
                    >
                    <span
                      v-if="
                        row.equipmentrValue === '1,2' ||
                        row.others.equipmentType === 1 ||
                        row.others.equipmentType === 2
                      "
                      >{{
                        row.calcType === 1
                          ? "求和值"
                          : row.calcType === 2
                          ? "求差值"
                          : row.calcType === 3
                          ? "最大值"
                          : row.calcType === 4
                          ? "最小值"
                          : row.calcType === 5
                          ? "平均值"
                          : row.calcType === 6
                          ? "全部线路"
                          : "单一线路"
                      }}</span
                    >
                    <span
                      v-if="
                        row.equipmentrValue === '1,2' ||
                        row.others.equipmentType === 1 ||
                        row.others.equipmentType === 2
                      "
                      >{{
                        row.compType === 1
                          ? "大于"
                          : row.compType === 2
                          ? "小于"
                          : "等于"
                      }}</span
                    >
                    <span
                      v-if="
                        row.equipmentrValue === '1,2' ||
                        row.others.equipmentType === 1 ||
                        row.others.equipmentType === 2
                      "
                      >{{
                        row.compValue === "false"
                          ? "分闸"
                          : row.compValue === "true"
                          ? "合闸"
                          : row.compValue
                      }}</span
                    >
                  </template>

                  <template slot-scope="{ row }" slot="operating">
                    <Button
                      class="c-blue"
                      type="text"
                      @click="handlelinkageScenePre(row, $index)"
                      >编辑</Button
                    >
                    <Button
                      class="c-danger"
                      type="text"
                      @click="handleSceneDelPre($index)"
                      >删除</Button
                    >
                  </template>
                </Table>
              </Col>
            </FormItem>
            <FormItem>
              <Col :span="24" class="header">
                  <span>执行列表</span>
                  <Button class="b-blue" @click="handleAddAction"
                    >添加执行</Button
                  >
              </Col>
            </FormItem>
            <FormItem>
              <Col :span="24">
                <Table
                  class="mt-10 device-wrap"
                  style="width: 100%"
                  :data="actionsList"
                  :columns="actionsListcolumns"
                  border
                >
                  <template slot-scope="{ row }" slot="name">
                    <span>{{
                      row.others.macName + "(" + row.others.mac + ")"
                    }}</span>
                  </template>

                  <template slot-scope="{ row }" slot="others.title">
                    <span>{{ row.others.title }}</span>
                  </template>

                  <template slot-scope="{ row }" slot="actionType">
                    <span>{{
                      row.actionType === "1,3"
                        ? "分闸"
                        : row.actionType === "2,3"
                        ? "合闸"
                        : row.actionType === "1"
                        ? "分闸"
                        : row.actionType === "2"
                        ? "合闸"
                        : ""
                    }}</span>
                    <span>{{ row.alarmTypeNo }}</span>
                  </template>

                  <template slot-scope="{ row }" slot="operating">
                    <Button
                      class="c-blue"
                      type="text"
                      @click="handlelinkageSceneAction(row, index)"
                      >编辑</Button
                    >
                    <Button
                      class="c-danger"
                      type="text"
                      @click="handleSceneDelAction(index)"
                      >删除</Button
                    >
                  </template>
                </Table>
              </Col>
            </FormItem>

          </Form>
        </Col>
      </Row>
      <div slot="footer" class="dialog-footer">
        <Button class="b-blue" @click="handleLinkageDetailsSave">保 存</Button>
        <Button @click="handleLinkageDetailsClose">取 消</Button>

      </div>
    </Modal>

    <Modal
      title="新增前置条件"
      :close-on-click-modal="false"
      v-model="preconditionFlag"
      :before-close="handlePreClose"
      width="35%"
      top="30vh"
      id="scenes-form"
    >
      <Form :model="preData">
        <FormItem required>
          <div class="dis_f">
              <div
              slot="label"
              class="slot-label pointer"
              >选择设备</div
            >
            <Button class="btn" @click="handlePreAdd('pre')">选择设备</Button>
            <Input v-model="preData.mac" placeholder="请选择" style="width:200px" readonly></Input>
          </div>

        </FormItem>
        <FormItem
        v-show="equipmentrValue === '1,2' && preData.mac"
        >
        <div class="dis_f">
          <div
            slot="label"
            class="slot-label pointer"
            >选择线路</div
          >
           <Button class="btn" @click="handleLine('pre')">选择线路</Button>
          <Tag
            v-show="tag.title.length > 0"
            v-for="(tag, index) in preData.tags"
            :key="index"
            closable
            @close="handleCloseTag('pre', tag)"
          >
            {{ tag.title }}
          </Tag>
        </div>
        </FormItem>
        <FormItem
          required
          v-if="
            equipmentrValue === 11 ||
            equipmentrValue === 14 ||
            equipmentrValue === '1,2'
          "
        >
          <Row class="dis_f">
            <div
            class="slot-label pointer"
            > 条件类型</div
          >
            <Col
              style="padding-left: 0"
              v-if="equipmentrValue === 11"
            >
              <Select
               style="width:150px;margin-right:10px"
              :clearable='true' v-model="attrValue" placeholder="请选择">
                <Option
                  v-for="item in conditionsAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </Option>
              </Select>
            </Col>
            <Col
              style="padding-left: 0"
              v-if="equipmentrValue === 14"
            >
              <Select
              style="width:150px;margin-right:10px"
              :clearable='true' v-model="attrValue" placeholder="请选择">
                <Option
                  v-for="item in illuminanceAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </Option>
              </Select>
            </Col>
            <Col
              style="padding-right: 0"
              v-if="equipmentrValue === 11 || equipmentrValue === 14"
            >
              <Select
              style="width:150px;margin-right:10px"
              :clearable='true' v-model="typeValue" placeholder="请选择">
                <Option
                  v-for="item in conditionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </Option>
              </Select>
            </Col>
            <Col

              style="padding-left: 0"
              v-if="equipmentrValue === '1,2'"
            >
              <Select
              style="width:150px;margin-right:10px"
              :clearable='true'
                v-model="microBreakValue"
                @change="handlemicroBreak"
                placeholder="请选择"
              >
                <Option
                  v-for="item in microBreakAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </Option>
              </Select>
            </Col>
            <Col

              v-if="equipmentrValue === '1,2' && microBreakValue !== 13"
            >
              <Select
              style="width:150px;margin-right:10px"
              :clearable='true' v-model="evaluateValue" placeholder="请选择">
                <Option
                  v-for="item in evaluateAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </Option>
              </Select>
            </Col>
            <Col

              v-if="equipmentrValue === '1,2' && microBreakValue === 13"
            >
              <Select
              style="width:150px;margin-right:10px"
              :clearable='true' v-model="lineValue" placeholder="请选择">
                <Option
                  v-for="item in lineAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </Option>
              </Select>
            </Col>
            <Col

              style="padding-right: 0"
              v-if="equipmentrValue === '1,2'"
            >
              <Select
              style="width:150px;margin-right:10px"
              :clearable='true'
                v-if="microBreakValue === 13"
                v-model="comparisonValue"
                placeholder="请选择"
              >
                <Option key="3" label="等于" value="3"> </Option>
              </Select>
              <Select
              style="width:150px;margin-right:10px"
              :clearable='true' v-else v-model="comparisonValue" placeholder="请选择">
                <Option
                  v-for="item in comparisonAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem
          label="报警类型:"
          required
          v-if="
            equipmentrValue !== 11 &&
            (equipmentrValue === 6 || equipmentrValue === 10)
          "
        >
          <Select
          style="width:150px;margin-right:10px"
          :clearable='true' v-model="smokeValue" placeholder="请选择">
            <Option
              v-for="item in smokeType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </Option>
          </Select>
        </FormItem>
        <FormItem
          label="报警类型:"
          required
          v-if="
            equipmentrValue !== 11 &&
            (equipmentrValue === 7 || equipmentrValue === 13)
          "
        >
          <Select
          style="width:150px;margin-right:10px"
          :clearable='true' v-model="gasValue" placeholder="请选择">
            <Option
              v-for="item in gasType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </Option>
          </Select>
        </FormItem>
        <FormItem
          required
          v-if="
            equipmentrValue === 11 ||
            equipmentrValue === 14 ||
            equipmentrValue === '1,2'
          "
        >
        <div class="dis_f">
           <div class="slot-label pointer">数值</div>
          <Col  style="padding-left: 0" v-if="microBreakValue === 13">
            <Select
            style="width:150px;margin-right:10px"
            :clearable='true' v-model="openCloseValue" placeholder="请选择">
              <Option
                v-for="item in openClose"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </Option>
            </Select>
          </Col>
          <Input
           style="width:150px;"
            v-model="preData.num"
            :onkeyup="
              (preData.num = preData.num
                .replace(/[^\d.]/g, '')
                .replace(/\.{2,}/g, '.')
                .replace('.', '$#$')
                .replace(/\./g, '')
                .replace('$#$', '.')
                .replace(/^(\-)*(\d+)\.(\d)$/, '$1$2.$3')
                .replace(/^[^0-9.]*(\d*[\.]?\d{0,2})\w*$/, '$1'))
            "
            placeholder="请输入"
            autocomplete="off"
          ></Input>
        </div>

        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="handlePreClose">取 消</Button>
        <Button class="b-blue" @click="handlePreSave">确 定</Button>
      </div>
    </Modal>

    <Modal
      title="新增执行动作"
      :close-on-click-modal="false"
      v-model="actionFlag"
      :before-close="handleActionClose"
      width="35%"
      top="30vh"
      id="scenes-form"
    >
      <Form :model="actionData">
        <FormItem required>
          <div class="dis_f">
            <label
            slot="label"
            class="slot-label pointer"
            >选择设备</label
          >
          <Button class="btn"  @click="handlePreAdd('action')">点击选择</Button>
          <Input v-model="actionData.mac" readonly style="width:200px"></Input>
          </div>

        </FormItem>
        <FormItem v-show="actionData.mac">
          <div class="dis_f">
            <label
            slot="label"
            class="slot-label pointer"
            >选择线路</label
          >
          <Button class="btn"  @click="handleLine('action')">点击选择</Button>
          <Tag
            v-show="tag.title.length > 0"
            v-for="(tag, index) in actionData.tags"
            :key="index"
            closable
            @close="handleCloseTag('action', tag)"
          >
            {{ tag.title }}
          </Tag>
          </div>

        </FormItem>
        <FormItem>
           <div class="dis_f">
            <label
            slot="label"
            class="slot-label pointer"
            >动作</label
          >
            <Select
            :clearable='true'
            v-model="actionData.openCloseValue"
            style="width:150px;margin-right:10px"
            placeholder="请选择"
          >
            <Option
              v-for="item in openClose"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </Option>
          </Select>
           </div>

        </FormItem>
        <FormItem v-if="equipmentrValue === '1,2'">
          <div class="dis_f">
            <label
            slot="label"
            class="slot-label pointer"
            >产生报警</label
          >
          <Cascader
            v-model="actionData.alarm"
            clearable
            :data="alarms"
            :show-all-levels="false"
            style="width:200px"
          >
          </Cascader>
          </div>

        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="handleActionClose">取 消</Button>
        <Button class="b-blue" @click="handleActionSave">确 定</Button>
      </div>
    </Modal>
    <Modal
      title="添加设备线路"
      :close-on-click-modal="false"
      v-model="deviceVisible"
      custom-class="custom-device-dialog"
      width="75%"
    >
      <div>
        <Form :model="ruleForm" ref="ruleForm" class="rule-form">
          <FormItem>
            <Row>
              <Col :span="5" class="left-padding-right">
                <Input v-model="ruleForm.mac" placeholder="设备号"></Input>
              </Col>
              <Col :span="4" style="margin-left: 20px">
                <Button class="b-blue" @click="handleSearch">查询</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
        <Table class="mt-20 device-wrap" :data="data" :columns="datacolumns">
          <template slot-scope="{ row }" slot="operating">
            <Button type="text" @click="handleMac(row)">请选择设备</Button>
          </template>
        </Table>
        <Page
          @on-page-size-change="handleSizeChange"
          @on-change="handleCurrentChange"
          :current.sync="currentPage"
          :page-size-opts="[20, 50, 100, 500]"
          :page-size="20"
          layout="sizes, prev, pager, next"
          :total="total"
          style="margin-top: 20px"
        >
        </Page>
      </div>
    </Modal>
    <Modal title="线路列表" v-model="lineVisible" width="60%" append-to-body>
      <LineList
        :mac="lineMac"
        :tags="lineTags"
        @sendChannels="receiveChannels"
        source="BuiltInTiming"
        v-if="lineVisible"
      ></LineList>
      <div slot="footer" />
    </Modal>
  </div>
</template>

<script>
    import Device from '../../DetectionRules/Device';
    import LineList from '../../Common/LineList';
    import {
        linkageSceneList,
        linkageSceneSave,
        linkageSceneDel,
        linkageDetail,
        linkagedeLock,
        queryBoxes

    } from '@/api/multiManage/builtlnTimer';
    export default {
        data () {
            return {
                linkageFlag: false,
                detailsFlag: false,

                dialogDetails: false,
                preconditionFlag: false,
                actionFlag: false,
                deviceVisible: false,
                lineVisible: false,
                linkageData: [],
                formLabelWidth: 80,
                equipmentTypesNum: '',
                lineMac: '',
                lineTags: [],
                form: {},
                scenes: {
                    id: '',
                    name: '',
                    remark: '',
                    status: '',
                    timeRanges: ''
                },
                preData: {
                    mac: '',
                    line: '',
                    name: '',
                    num: '',
                    tags: []
                },
                preList: [],
                actionData: {
                    mac: '',
                    macName: '',
                    openCloseValue: '',
                    tags: [],
                    alarm: []
                },
                actionsList: [],
                value1: [],
                tableComponentHeight: this.$store.state.channelsTableHeight,
                options: [
                    {
                        value: 1,
                        label: '满足全部条件'
                    },
                    {
                        value: 2,
                        label: '满足单一条件'
                    }
                ],
                equipmentTypeAttr: [
                    {
                        value: '1,2',
                        label: '微断/电气检测' + '(Md)'
                    },
                    {
                        value: 11,
                        label: '温湿度探测' + '(Renke)'
                    },
                    {
                        value: 14,
                        label: '光照度采集器' + '(Renke)'
                    },
                    {
                        value: 6,
                        label: '烟感火灾探测' + '(Fs)'
                    },
                    {
                        value: 7,
                        label: '可燃气体探测' + '(Fs)'
                    },
                    {
                        value: 10,
                        label: '烟感火灾探测' + '(Zac)'
                    },
                    {
                        value: 13,
                        label: '可燃气体探测' + '(Zac)'
                    }
                ],
                microBreakAttr: [
                    {
                        value: 1,
                        label: '功率(瓦)'
                    },
                    {
                        value: 2,
                        label: '电流'
                    },
                    {
                        value: 3,
                        label: '漏电流'
                    },
                    {
                        value: 4,
                        label: '温度'
                    },
                    {
                        value: 5,
                        label: '电压'
                    },
                    {
                        value: 13,
                        label: '开关状态'
                    }
                ],
                evaluateAttr: [
                    {
                        value: 1,
                        label: '求和值'
                    },
                    {
                        value: 2,
                        label: '求差值'
                    },
                    {
                        value: 3,
                        label: '最大值'
                    },
                    {
                        value: 4,
                        label: '最小值'
                    },
                    {
                        value: 5,
                        label: '平均值'
                    }
                ],
                lineAttr: [
                    {
                        value: 6,
                        label: '全部线路'
                    },
                    {
                        value: 7,
                        label: '任一线路'
                    }
                ],
                comparisonAttr: [
                    {
                        value: 1,
                        label: '大于'
                    },
                    {
                        value: 2,
                        label: '小于'
                    },
                    {
                        value: 3,
                        label: '等于'
                    }
                ],
                conditionsAttr: [
                    {
                        value: 4,
                        label: '温度'
                    },
                    {
                        value: 10,
                        label: '湿度'
                    }
                ],
                illuminanceAttr: [
                    {
                        value: 12,
                        label: '光照度'
                    }
                ],
                conditionsType: [
                    {
                        value: 1,
                        label: '高于'
                    },
                    {
                        value: 2,
                        label: '低于'
                    }
                ],
                smokeType: [
                    {
                        value: 2002,
                        label: '烟雾报警'
                    },
                    {
                        value: 9000,
                        label: '设备故障报警'
                    }
                ],
                gasType: [
                    {
                        value: 2006,
                        label: '燃气报警'
                    },
                    {
                        value: 9000,
                        label: '设备故障报警'
                    }
                ],
                openClose: [
                    {
                        value: '1',
                        label: '分闸'
                    },
                    {
                        value: '2',
                        label: '合闸'
                    }
                ],
                alarms: [
                    {
                        value: 'alarms',
                        label: '报警',
                        children: []
                    },
                    {
                        value: 'warns',
                        label: '预警',
                        children: []
                    }
                ],
                ifValue: '',
                equipmentrValue: '1,2',
                attrValue: '',
                microBreakValue: '',
                evaluateValue: '',
                lineValue: '',
                openCloseValue: '',
                comparisonValue: '',
                typeValue: '',
                smokeValue: '',
                gasValue: '',
                edit: false,
                actionEdit: false,
                tags: [],
                index: 0,
                actionIndex: 0,
                ruleForm: {
                    mac: ''
                },
                mac: '',
                data: [],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                equipmentFlag: false,
                linkagecolumns: [
                    {
                        title: '联动名称',
                        slot: 'name',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'status',
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operating',
                        align: 'center'
                    }
                ],
                preListcolumns: [
                    {
                        title: '设备名称',
                        slot: 'name',
                        align: 'center'
                    },
                    {
                        title: '线路',
                        slot: 'mac',
                        align: 'center'
                    },
                    {
                        title: '条件',
                        slot: 'equipmentrValue',
                        width: '200px',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operating',
                        align: 'center'
                    }
                ],
                actionsListcolumns: [
                    {
                        title: '设备名称',
                        slot: 'name',
                        width: '200px',
                        align: 'center'
                    },
                    {
                        title: '线路',
                        slot: 'others.title',
                        width: '150px',
                        align: 'center'
                    },
                    {
                        title: '动作类型',
                        slot: 'actionType',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operating',
                        align: 'center'
                    }
                ],
                datacolumns: [
                    {
                        title: '设备号',
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '位置',
                        key: 'build',
                        align: 'center'
                    },
                    {
                        title: '单元',
                        key: 'unit',
                        align: 'center'
                    },
                    {
                        title: '房间号',
                        key: 'room',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operating',
                        align: 'center'
                    }
                ],
                linkageId: ''
            };
        },
        mounted () {
            this.queryLinkageSceneList(1)
        },
        methods: {

            handleLinkageSceneSave () {
                if (this.scenes.name === '') {
                    this.$Message.error({
                        content: '请输入联动名称'
                    });
                    return false;
                }
                let params = {
                    name: this.scenes.name,
                    status: this.scenes.status,
                    remark: this.scenes.remark,
                    id: this.scenes.id,
                    timeRanges: this.scenes.timeRanges,
                    extValue: this.$store.state.projectCode
                };
                linkageSceneSave(params)
                    .then((res) => {
                        if (res.success) {
                            this.handleLinkageSceneClose();
                            this.queryLinkageSceneList(1);
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
            handleLinkageSceneClose () {
                this.linkageFlag = false;
                this.scenes = {
                    id: '',
                    name: '',
                    remark: ''
                };
            },
            handleLinkageDetailsClose () {
                this.dialogDetails = false;
            },
            handleLinkageDetailsSave () {
                if (this.value1 === null || this.ifValue === '') {
                    this.$Message.error({
                        content: '内容未填写完整'
                    });
                    return false;
                }
                let alarmsArr = this.alarms[0].children.concat(this.alarms[1].children);
                let actonsArr = [];
                let preArr = [];
                this.actionsList.forEach((item) => {
                    let alarmTypeNo = alarmsArr.filter(
                        (val) => val.label === item.alarmTypeNo
                    );
                    let obj = {
                        mac: item.others.mac,
                        addrs: item.addrs,
                        actionType: item.actionType,
                        alarmTypeNo: alarmTypeNo.length > 0 ? alarmTypeNo[0].value : ''
                    };
                    actonsArr.push(obj);
                });
                this.preList.forEach((item) => {
                    let obj = {
                        mac: item.others.mac,
                        addrs: item.addrs,
                        elecType: item.elecType,
                        calcType: item.calcType,
                        compType: item.compType,
                        compValue: item.compValue,
                        logicType: this.ifValue,
                        typeNumber: item.typeNumber
                    };
                    preArr.push(obj);
                });
                let params = {
                    name: this.scenes.name,
                    status: this.scenes.status,
                    timeRanges: this.value1[0].length
                        ? this.value1[0] + '~' + this.value1[1]
                        : this.$func
                            .formatDate('yyyy-MM-dd HH:mm:ss', this.value1[0])
                            .slice(0, 16) +
                            '~' +
                            this.$func
                                .formatDate('yyyy-MM-dd HH:mm:ss', this.value1[1])
                                .slice(0, 16),
                    extValue: this.$store.state.projectCode,
                    id: this.scenes.id,
                    remark: this.scenes.remark,
                    conditions: JSON.stringify(preArr),
                    actions: JSON.stringify(actonsArr)
                };
                linkageSceneSave(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.handleLinkageDetailsClose();
                            this.queryLinkageSceneList(1);
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
            handleLinkageSceneDetails () {
                this.linkageFlag = false;
                this.preconditionFlag = false;
                this.actionFlag = false;
                this.handleViewScene(this.scenes);
            },
            handleSceneDel (id) {
                let params = {
                    sceneId: id,
                    projectCode: this.$store.state.projectCode
                };
                this.$confirm(
                    this.$t('message.confirmDeleteGroup'),
                    this.$t('dialog.prompt'),
                    {
                        confirmButtonText: this.$t('btns.ok'),
                        cancelButtonText: this.$t('btns.cancel'),
                        type: 'warning'
                    }
                )
                    .then(() => {
                        linkageSceneDel(params)
                            .then((res) => {
                                if (res.success) {
                                    this.$Message.success({
                                        content: res.message
                                    });
                                    this.queryLinkageSceneList(1);
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
                    })
                    .catch(() => {
                        this.$Message.info({
                            content: '已取消删除'
                        });
                });
            },
            handleLinkageScene (obj, val) {
                this.detailsFlag = false;
                this.linkageFlag = true;
                this.scenes = {
                    id: '',
                    name: '',
                    remark: '',
                    status: '',
                    timeRanges: ''
                };
                this.ifValue = this.options[0].value;
                if (val) {
                    this.detailsFlag = true;
                    this.scenes = {
                        id: obj.id,
                        name: obj.name,
                        remark: obj.remark,
                        status: obj.status,
                        timeRanges: obj.timeRanges
                    };
                }
            },
            handleLinkagedeLock (row) {
                let params = {
                    sceneId: row.id,
                    projectCode: this.$store.state.projectCode,
                    oper: row.status === 2 ? 'unlock' : 'lock'
                };
                linkagedeLock(params)
                    .then((res) => {
                        if (res.success) {
                            this.queryLinkageSceneList(1);
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
            handleIfAdd () {
                this.dialogDetails = false;
                this.edit = false;
                this.preconditionFlag = true;
                this.preData = {
                    mac: '',
                    name: '',
                    num: '',
                    tags: []
                };
                this.lineValue =
                    this.comparisonValue =
                    this.openCloseValue =
                    this.evaluateValue =
                    this.microBreakValue =
                    this.smokeValue =
                    this.gasValue =
                    this.attrValue =
                    this.typeValue =
                    '';
            },
            handleAddAction () {
                this.actionEdit = false;
                this.dialogDetails = false;
                this.actionFlag = true;
                this.actionData = {
                    mac: '',
                    macName: '',
                    openCloseValue: '',
                    tags: [],
                    alarm: ''
                };
            },
            queryLinkageSceneList (pageNo) {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    pageSize: 10,
                    pageNo
                };

                linkageSceneList(params)
                    .then((res) => {
                        if (res.success) {
                            this.linkageData = res.datas;
                            this.totals = res.total
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
            },
            handleViewScene () {
                this.$nextTick(function () {
                    let row = this.linkageData.filter(item => {
                        return item.id === this.id
                    })
                    //
                    row = row[0]
                    this.scenes.id = row.id;
                    // this.scenes.id = this.id
                    this.scenes.status = row.status;
                    this.value1 = [];
                    let params = {
                        projectCode: this.$store.state.projectCode,
                        sceneId: row.id
                    };
                    linkageDetail(params)
                        .then((res) => {
                            if (res.success) {
                                this.scenes.name = res.data.scene.name;
                                let arr = res.data.scene.timeRanges.split('~');
                                arr.forEach((element) => {
                                    this.value1.push(element);
                                });
                                if (res.data.actions !== []) {
                                    res.data.actions.forEach((item) => {
                                        if (item.alarmTypeNo) {
                                            this.alarms[0].children
                                                .concat(this.alarms[1].children)
                                                .forEach((element) => {
                                                    if (element.value === item.alarmTypeNo + '') {
                                                        item.alarmTypeNo = element.label;
                                                    }
                                            });
                                        }
                                        if (item.alarmTypeNo === 0) item.alarmTypeNo = '';
                                    });
                                }
                                this.ifValue =
                                    res.data.conditions.length > 0
                                        ? res.data.conditions[0].logicType
                                        : this.options[0].value;
                                this.equipmentrValue =
                                    res.data.conditions.length > 0
                                        ? res.data.conditions[0].others.equipmentType === 1 ||
                                            res.data.conditions[0].others.equipmentType === 2
                                            ? '1,2'
                                            : res.data.conditions[0].others.equipmentType
                                        : '1,2';
                                this.preList = res.data.conditions;
                                this.actionsList = res.data.actions;
                                this.dialogDetails = true;
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
                })
            },
            handlePreClose () {
                this.preconditionFlag = false;
                this.dialogDetails = true;
            },
            handleActionClose () {
                this.actionFlag = false;
                this.dialogDetails = true;
            },
            handlePreAdd (val) {
                this.equipmentTypesNum = '';
                if (val === 'pre') {
                    this.equipmentTypesNum = this.equipmentrValue;
                } else {
                    this.equipmentTypesNum = 1;
                }
                this.deviceVisible = true;
                this.ruleForm.mac = '';
                this.queryList(this.ruleForm.mac);
            },
            handleSearch () {
                this.currentPage = 1;
                this.queryList(this.ruleForm.mac);
            },
            handleLine (val) {
                if (val === 'pre') {
                    this.lineMac = this.preData.mac;
                    this.lineTags = this.preData.tags;
                } else {
                    this.lineMac = this.actionData.mac;
                    this.lineTags = this.actionData.tags;
                }
                this.lineVisible = true;
            },
            receiveChannels (val) {
                if (this.preconditionFlag) {
                    this.preData.tags = val;
                } else if (this.actionFlag) {
                    this.actionData.tags = val;
                }
                this.lineVisible = false;
            },
            handleCloseTag (val, tag) {
                if (val === 'pre') {
                    this.preData.tags.splice(this.preData.tags.indexOf(tag), 1);
                } else if (val === 'action') {
                    this.actionData.tags.splice(this.actionData.tags.indexOf(tag), 1);
                }
            },
            handlemicroBreak (val) {
                if (val === 13) {
                    this.preData.num = this.evaluateValue = this.comparisonValue = '';
                }
            },
            handlePreSave () {
                if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
                    if (
                        this.preData.mac === '' ||
                        this.typeValue === '' ||
                        this.attrValue === '' ||
                        this.preData.num === '' ||
                        (this.preData.num.indexOf('.') !== -1 &&
                        this.preData.num.toString().split('.')[1].length === 0)
                    ) {
                        this.$Message.error({
                            content: '内容未填写完整'
                        });
                        return false;
                    }
                } else if (this.equipmentrValue === 6 || this.equipmentrValue === 10) {
                    if (this.preData.mac === '' || this.smokeValue === '') {
                        this.$Message.error({
                            content: '内容未填写完整'
                        });
                        return false;
                    }
                } else if (this.equipmentrValue === '1,2') {
                    if (this.microBreakValue === 13) {
                        if (
                            this.preData.mac === '' ||
                            this.preData.tags.length === 0 ||
                            this.lineValue === '' ||
                            this.comparisonValue === '' ||
                            this.openCloseValue === ''
                        ) {
                            this.$Message.error({
                                content: '内容未填写完整'
                            });
                            return false;
                        }
                    } else {
                        if (
                            this.preData.mac === '' ||
                            this.preData.tags.length === 0 ||
                            this.microBreakValue === '' ||
                            this.evaluateValue === '' ||
                            this.comparisonValue === '' ||
                            this.preData.num === ''
                        ) {
                            this.$Message.error({
                                content: '内容未填写完整'
                            });
                            return false;
                        }
                    }
                } else {
                    if (this.preData.mac === '' || this.gasValue === '') {
                        this.$Message.error({
                            content: '内容未填写完整'
                        });
                        return false;
                    }
                }
                if (this.edit) {
                    if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
                        this.preList[this.index].others.mac = this.preData.mac;
                        this.preList[this.index].compType = this.typeValue;
                        this.preList[this.index].others.macName = this.preData.name;
                        this.preList[this.index].elecType = this.attrValue;
                        this.preList[this.index].compValue = this.preData.num;
                        if (this.preList.length >= 1) {
                            let i = 0;
                            this.preList.forEach((element) => {
                                if (
                                    element.compType === this.preList[this.index].compType &&
                                    element.others.mac === this.preList[this.index].others.mac &&
                                    element.others.macName ===
                                    this.preList[this.index].others.macName &&
                                    element.compValue === this.preList[this.index].compValue &&
                                    element.elecType === this.preList[this.index].elecType
                                ) {
                                    i++;
                                }
                            });
                            if (i > 1) {
                                this.preList.splice(this.index, 1);
                            }
                        }
                    } else if (this.equipmentrValue === '1,2') {
                        let titleArr = [];
                        let addrArr = [];
                        if (this.preData.tags.length > 0) {
                            this.preData.tags.forEach((item) => {
                                titleArr.push(item.title);
                                addrArr.push(item.addr);
                            });
                        }
                        this.preList[this.index].others.mac = this.preData.mac;
                        this.preList[this.index].compType = this.comparisonValue;
                        this.preList[this.index].others.macName = this.preData.name;
                        this.preList[this.index].elecType = this.microBreakValue;
                        this.preList[this.index].compValue = this.preData.num
                            ? this.preData.num
                            : this.openCloseValue === '1'
                                ? 'false'
                                : 'true';
                        this.preList[this.index].calcType = this.evaluateValue
                            ? this.evaluateValue
                            : this.lineValue;
                        this.preList[this.index].others.title = titleArr.join(',');
                        this.preList[this.index].addrs = addrArr.join(',');
                        if (this.preList.length >= 1) {
                            let i = 0;
                            this.preList.forEach((element) => {
                                if (
                                    element.compType === this.preList[this.index].compType &&
                                    element.others.mac === this.preList[this.index].others.mac &&
                                    element.others.macName ===
                                    this.preList[this.index].others.macName &&
                                    element.compValue === this.preList[this.index].compValue &&
                                    element.elecType === this.preList[this.index].elecType &&
                                    element.calcType === this.preList[this.index].calcType &&
                                    element.addrs === this.preList[this.index].addrs
                                ) {
                                    i++;
                                }
                            });
                            if (i > 1) {
                                this.preList.splice(this.index, 1);
                            }
                        }
                    } else {
                        if (this.equipmentrValue === 6 || this.equipmentrValue === 10) {
                            this.preList[this.index].typeNumber = this.smokeValue;
                        } else {
                            this.preList[this.index].typeNumber = this.gasValue;
                        }
                        if (this.preList.length >= 1) {
                            let i = 0;
                            this.preList.forEach((element) => {
                                if (
                                    element.typeNumber === this.preList[this.index].typeNumber &&
                                    element.others.mac === this.preList[this.index].others.mac &&
                                    element.others.macName ===
                                    this.preList[this.index].others.macName
                                ) {
                                    i++;
                                }
                            });
                            if (i > 1) {
                                this.preList.splice(this.index, 1);
                            }
                        }
                    }
                } else {
                    let params;
                    if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
                        params = {
                            others: {
                                mac: this.preData.mac,
                                macName: this.preData.name
                            },
                            addrs: '1',
                            elecType: this.attrValue,
                            calcType: '1',
                            compType: this.typeValue,
                            compValue: this.preData.num,
                            logicType: this.ifValue,
                            equipmentrValue: this.equipmentrValue
                        };
                    } else if (this.equipmentrValue === '1,2') {
                        let addr = '';
                        let titles = '';
                        if (this.preData.tags.length > 1) {
                            titles = this.preData.tags
                                .map((item) => {
                                    return item.title;
                                })
                                .join(',');
                            addr = this.preData.tags.map((item) => {
                                return item.addr;
                            });
                        } else {
                            addr = this.preData.tags[0].addr;
                            titles = this.preData.tags[0].title;
                        }
                        params = {
                            others: {
                                mac: this.preData.mac,
                                macName: this.preData.name,
                                title: titles
                            },
                            addrs: addr.length > 1 ? addr.join(',') : addr,
                            elecType: this.microBreakValue,
                            calcType: this.evaluateValue ? this.evaluateValue : this.lineValue,
                            compType: this.comparisonValue,
                            compValue: this.preData.num
                                ? this.preData.num
                                : this.openCloseValue === '1'
                                    ? 'false'
                                    : 'true',
                            logicType: this.ifValue,
                            equipmentrValue: this.equipmentrValue
                        };
                    } else {
                        params = {
                            others: {
                                mac: this.preData.mac,
                                macName: this.preData.name
                            },
                            typeNumber: this.smokeValue ? this.smokeValue : this.gasValue,
                            smokeValue: this.smokeValue,
                            gasValue: this.gasValue,
                            logicType: this.ifValue,
                            equipmentrValue: this.equipmentrValue
                        };
                    }
                    if (this.preList.length >= 1) {
                        let i = 0;
                        if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
                            this.preList.forEach((element) => {
                                if (
                                    element.compType === params.compType &&
                                    element.others.mac === params.others.mac &&
                                    element.others.macName === params.others.macName &&
                                    element.compValue === params.compValue &&
                                    element.elecType === params.elecType
                                ) {
                                    i++;
                                }
                            });
                        } else if (this.equipmentrValue === '1,2') {
                            this.preList.forEach((element) => {
                                if (
                                    element.compType === params.compType &&
                                    element.others.mac === params.others.mac &&
                                    element.others.macName === params.others.macName &&
                                    element.addrs === params.addrs &&
                                    element.compValue === params.compValue &&
                                    element.elecType === params.elecType &&
                                    element.calcType === params.calcType
                                ) {
                                    i++;
                                }
                            });
                        } else {
                            this.preList.forEach((element) => {
                                if (
                                    element.typeNumber === params.typeNumber &&
                                    element.others.mac === params.others.mac &&
                                    element.others.macName === params.others.macName
                                ) {
                                    i++;
                                }
                            });
                        }
                        if (i === 0) {
                            this.preList.push(params);
                        }
                    } else {
                        this.preList.push(params);
                    }
                }
                this.preconditionFlag = false;
                this.dialogDetails = true;
            },
            handleActionSave () {
                if (this.equipmentrValue === '1,2') {
                    if (
                        this.actionData.alarm === '' &&
                        this.actionData.openCloseValue === ''
                    ) {
                        this.$Message.error({
                            content: '内容未填写完整'
                        });
                        return false;
                    }
                    if (this.actionData.mac === '' || this.actionData.tags.length === 0) {
                        this.$Message.error({
                            content: '内容未填写完整'
                        });
                        return false;
                    }
                } else {
                    if (
                        this.actionData.mac === '' ||
                        this.actionData.openCloseValue === ''
                    ) {
                        this.$Message.error({
                            content: '内容未填写完整'
                        });
                        return false;
                    }
                }
                if (this.actionEdit) {
                    let titleArr = [];
                    let addrArr = [];
                    if (this.actionData.tags.length > 0) {
                        this.actionData.tags.forEach((item) => {
                            titleArr.push(item.title);
                            addrArr.push(item.addr);
                        });
                    }
                    this.actionsList[this.actionIndex].others.mac = this.actionData.mac;
                    this.actionsList[this.actionIndex].others.macName =
                        this.actionData.macName;
                    this.actionsList[this.actionIndex].actionType =
                        this.actionData.openCloseValue;
                    this.actionsList[this.actionIndex].others.title = titleArr.join(',');
                    this.actionsList[this.actionIndex].addrs = addrArr.join(',');
                    if (
                        this.equipmentrValue === '1,2' &&
                        this.actionData.alarm.length > 0
                    ) {
                        let Alarms = '';
                        if (this.actionData.alarm[0] === 'alarms') {
                            Alarms = this.alarms[0].children.filter((keyItem) => {
                                if (keyItem.value === this.actionData.alarm[1]) return keyItem;
                            });
                        } else if (this.actionData.alarm[0] === 'warns') {
                            Alarms = this.alarms[1].children.filter((keyItem) => {
                                if (keyItem.value === this.actionData.alarm[1]) return keyItem;
                            });
                        }
                        this.actionsList[this.actionIndex].actionType = this.actionData
                            .openCloseValue
                            ? this.actionData.openCloseValue + ',3'
                            : this.actionData.alarm !== ''
                                ? '3'
                                : '';
                        this.actionsList[this.actionIndex].alarmTypeNo = Alarms[0].label;
                    } else {
                        this.actionsList[this.actionIndex].actionType = this.actionData
                            .openCloseValue
                            ? this.actionData.openCloseValue + ',3'
                            : this.actionData.alarm !== ''
                                ? '3'
                                : '';
                        this.actionsList[this.actionIndex].alarmTypeNo = '';
                    }
                } else {
                    let titleArr = [];
                    let addrArr = [];
                    if (this.actionData.tags.length > 0) {
                        this.actionData.tags.forEach((item) => {
                            titleArr.push(item.title);
                            addrArr.push(item.addr);
                        });
                    }
                    let params = {
                        addrs: addrArr.length > 0 ? addrArr.join(',') : '',
                        others: {
                            mac: this.actionData.mac,
                            macName: this.actionData.macName,
                            title: titleArr.length > 0 ? titleArr.join(',') : titleArr
                        },
                        actionType: this.actionData.openCloseValue
                    };
                    if (
                        this.equipmentrValue === '1,2' &&
                        this.actionData.alarm.length > 0
                    ) {
                        let Alarms = '';
                        if (this.actionData.alarm[0] === 'alarms') {
                            Alarms = this.alarms[0].children.filter((keyItem) => {
                                if (keyItem.value === this.actionData.alarm[1]) return keyItem;
                            });
                        } else if (this.actionData.alarm[0] === 'warns') {
                            Alarms = this.alarms[1].children.filter((keyItem) => {
                                if (keyItem.value === this.actionData.alarm[1]) return keyItem;
                            });
                        }
                        params.actionType = this.actionData.openCloseValue
                            ? this.actionData.openCloseValue + ',3'
                            : this.actionData.alarm !== ''
                                ? '3'
                                : '';
                        params.alarmTypeNo = Alarms[0].label;
                    } else {
                        params.actionType = this.actionData.openCloseValue
                            ? this.actionData.openCloseValue + ',3'
                            : this.actionData.alarm !== ''
                                ? '3'
                                : '';
                        params.alarmTypeNo = '';
                    }
                    this.actionsList.push(params);
                }
                this.actionFlag = false;
                this.dialogDetails = true;
            },
            handlelinkageScenePre (row, index) {
                let titles = [];
                let tags = [];
                this.edit = true;
                this.dialogDetails = false;
                this.preconditionFlag = true;
                this.index = index;
                if (row.others.title) {
                    titles = this.preList[index].others.title.split(',');
                    this.preList[index].addrs.split(',').map((item, index) => {
                        tags.push({ addr: item, title: titles[index] });
                    });
                }
                this.preData = {
                    mac: row.others.mac,
                    num: row.compValue,
                    name: row.others.macName,
                    tags: tags
                };
                this.attrValue = row.elecType;
                this.typeValue = row.compType;
                this.equipmentrValue = row.equipmentrValue
                    ? row.equipmentrValue
                    : row.others.equipmentType === 1 || row.others.equipmentType === 2
                        ? '1,2'
                        : row.others.equipmentType;
                this.smokeValue = row.smokeValue ? row.smokeValue : row.typeNumber;
                this.gasValue = row.gasValue ? row.gasValue : row.typeNumber;
                this.microBreakValue = row.elecType;
                this.evaluateValue = row.calcType;
                this.comparisonValue = row.compType;
                if (row.elecType === 13) {
                    this.preData.num = this.evaluateValue = '';
                    this.lineValue = row.calcType;
                    this.openCloseValue = row.compValue === 'false' ? '1' : '2';
                }
            },
            handlelinkageSceneAction (row, index) {
                let Alarms = '';
                if (row.alarmTypeNo && row.alarmTypeNo.length > 0) {
                    Alarms = this.alarms[0].children.filter((keyItem) => {
                        if (keyItem.label === row.alarmTypeNo) return keyItem;
                    });
                    if (Alarms.length > 0) {
                        this.actionData.alarm = ['alarms', Alarms[0].value];
                    } else {
                        Alarms = this.alarms[1].children.filter((keyItem) => {
                            if (keyItem.label === row.alarmTypeNo) return keyItem;
                        });
                        this.actionData.alarm = ['warns', Alarms[0].value];
                    }
                } else {
                    this.actionData.alarm = [];
                }
                this.actionEdit = true;
                this.dialogDetails = false;
                this.actionFlag = true;
                this.actionIndex = index;
                this.actionData.mac = row.others.mac;
                this.actionData.macName = row.others.macName;
                this.actionData.openCloseValue =
                    row.actionType === '3' ? '' : row.actionType.split(',')[0];
                let titles = [];
                let tags = [];
                if (row.others.title) {
                    titles = this.actionsList[this.actionIndex].others.title.split(',');
                    this.actionsList[this.actionIndex].addrs
                        .split(',')
                        .map((item, index) => {
                            tags.push({ addr: item, title: titles[index] });
                    });
                }
                let titleEdit = [];
                let addrEdit = [];
                this.actionData.tags = tags;
                if (this.actionData.tags.length !== tags.length) {
                    this.actionData.tags.forEach((item) => {
                        titleEdit.push(item.title);
                        addrEdit.push(item.addr);
                    });
                }
            },
            handleSceneDelPre (index) {
                this.preList.splice(index, 1);
            },
            handleSceneDelAction (index) {
                this.actionsList.splice(index, 1);
            },
            queryList (mac) {
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    projectCode: this.$store.state.projectCode,
                    equipmentTypes: this.equipmentTypesNum
                };
                if (mac) params.key = mac;
                queryBoxes(params)
                    .then((res) => {
                        if (res.success) {
                            this.total = res.total;
                            this.data = res.datas;
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
            handleSizeChange (val) {
                this.pageSize = val;
                this.queryList();
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.queryList();
            },
            handleMac (row) {
                if (this.preconditionFlag) {
                    this.preData.mac = row.mac;
                    this.preData.name = row.name;
                    this.preData.tags = [];
                } else {
                    this.actionData.mac = row.mac;
                    this.actionData.macName = row.name;
                    this.actionData.tags = [];
                }
                this.deviceVisible = false;
            }

        },
        watch: {

            '$store.state.channelsTableHeight': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.tableComponentHeight = newVal;
                    }
                }
            },
            preList: {
                handler (newVal, oldVal) {
                    if (this.preList.length > 0) {
                        this.equipmentFlag = true;
                    } else {
                        this.equipmentFlag = false;
                    }
                }
            }
            // id: {
            //     handler (newVal, oldVal) {
            //         if (newVal) {
            //             this.id = newVal
            //             this.handleViewScene()
            //         }
            //     },
            //     deep: true
            // }
        },
        components: {
            Device,
            LineList
        },
        props: {
            id: {
                type: Number,
                default () {
                    return {};
                }
            }
        }
    };
</script>
<style lang="less" scoped>
.Scene{
  background:#1a202e ;
  padding: 0 20px 20px 20px;
}
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0;
  span{
    font-size: 16px;
  }
}
.threeBtn{
  display: flex;
  justify-content: space-between;
}
.slot-label{
  width: 100px;
  text-align: center;
}
.btn{
  background: rgba(0, 126, 255, 0.1);
  border: 1px solid #007EFF;
  border-radius: 5px;
  color: #007EFF;
  margin-right: 10px;
}
.ivu-tag{
  height: 32px;
  line-height: 32px;
}
.dis_f{
  display: flex;
}
/deep/.ivu-input {
    border: 1px solid #535B6C;
}
/deep/.ivu-modal-footer {
    border:none;
    text-align: right;
}
</style>
