<template>
<div class="batch">
    <div class="batchTable">
         <Row class="header">
        <Col :span="12">
            <span>配置设备列表</span>
        </Col>
        <Col :span="12" style="text-align: right;">
            <Button type="primary" @click.native.prevent="handleSelectDevice">选择设备</Button>
            <Button type="text" class="b-dger" @click.native.prevent="handleEmpty">全部清空</Button>
        </Col>
    </Row>

      <div class="scroll" :style="innerComponentHeight">
        <Table
          :data="devices"
          :columns="devicesColumn"
          style="width: 100%;">

            <template slot-scope="{row}" slot="macname">
              <div>{{ row.name }}</div>
            </template>
            <template slot-scope="{row,index}" slot="line">
               <Button class="btn" @click="handleLine(row,index)">选择</Button>
               <Tag
                    v-for="(tag, index) in devices[index].tags "
                    :key="index"
                    closable
                    @on-close="handleCloseTag(tag,index)">
                    {{tag.title}}
                </Tag>
            </template>
            <template slot-scope="{row}" slot="position">
              <div>{{ row.build + '\xa0\xa0\xa0' + row.unit + '\xa0\xa0\xa0' + row.room }}</div>
            </template>

            <template slot-scope="{row}" slot="status">
                <span v-show="row.others.online === -1" class="b-info">脱线</span>
                <span v-show="row.others.online === 0" class="b-danger">离线</span>
                <span v-show="row.others.online === 1" class="b-success">在线</span>
            </template>

            <template slot="operating">
              <Button
                @click.native="deleteRow(devices,index)"
                class="top-padding-bottom"
                type="text"
                >
               移除
              </Button>
            </template>

        </Table>
      </div>
    </div>
    <Row class="descriptionTitle">
        <Col>
          <div class="description-title">说明:</div>
          <div class="description">{{ '1. ' + '向服务器提交了指令,并非立即生效,指令将由服务器后台逐个下发到设备,根据网络情况可能会延迟.' }}</div>
          <div class="description">{{ '2. ' + '所选设备如果不在线,该设备将被自动忽略执行指令.' }}</div>
        </Col>
    </Row>
      <Row class="select-wrap">
        <Form ref="form" :model="cmd"  class="form-wrap" :label-width="120">
          <FormItem label="操作类型:">
            <Select v-model="cmd.value" placeholder="请选择" class="w100">
              <Option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </Option>
            </Select>
          </FormItem>
        </Form>
        <Col v-if="cmd.value === 'SET_TITLE'">
          <Form ref="titleForm" :model="titleForm" :rules="titleRules" class="form-wrap" :label-width="120">
            <FormItem label="线路名称" prop="name">
              <Input v-model="titleForm.name"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('titleForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'LIMIT_POWER'">
          <Form ref="powerForm" :model="powerForm" :rules="powerRules" class="form-wrap" :label-width="120">
            <FormItem label="功率上限" prop="limit">
                <div class="formt">
              <Input v-model="powerForm.limit"></Input><span class="power-unit">W</span>
            </div>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('powerForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'LIMIT_CURRENT'">
          <Form ref="currentForm" :model="currentForm" :rules="currentRules"  class="form-wrap" :label-width="120">
            <FormItem label="电流上限" prop="limit" >
                <div class="formt">
              <Input v-model="currentForm.limit"></Input><span class="power-unit">A</span>
            </div>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('currentForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'LIMIT_LEAKAGE_CURRENT'">
          <Form ref="leakagecurrentForm" :model="leakagecurrentForm" :rules="leakageCurrentRules"  class="form-wrap" :label-width="120">
            <FormItem label="漏电流上限" prop="limit" >
                <div class="formt">
              <Input v-model="leakagecurrentForm.limit"></Input><span class="power-unit">mA</span>
            </div>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('leakagecurrentForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'LIMIT_TEMPERATURE'">
          <Form ref="temperatureForm" :model="temperatureForm" :rules="temperatureRules"  class="form-wrap" :label-width="120">
            <FormItem label="温度上限" prop="limit" >
                <div class="formt">
              <Input v-model="temperatureForm.limit"></Input><span class="power-unit">℃</span>
            </div>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('temperatureForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'LIMIT_VOLTAGE'">
          <Form ref="voltageForm" :model="voltageForm" :rules="voltageRules"  class="form-wrap" :label-width="120">

            <FormItem label="电压上限" prop="voltageH" >
                <div class="formt">
                  <Input v-model="voltageForm.voltageH"></Input><span class="power-unit">V</span>
                </div>
            </FormItem>
            <FormItem label="电压下限" prop="voltageL" >
                <div class="formt">
              <Input v-model="voltageForm.voltageL"></Input><span class="power-unit">V</span>
            </div>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('voltageForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'SETWIRING'">
          <Form ref="setwiringForm" :model="setwiringForm" :rules="wiringRules" class="form-wrap" :label-width="120">

            <FormItem label="接线方式" prop="wiring">
              <Select v-model="setwiringForm.wiring" placeholder="请选择"  class="w100">
                <Option key="-1" label="进线直连" value="-1"></Option>
                <Option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? '总路' : ('线路' + (n - 1))"
                  :value="n">
                </Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('setwiringForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'SETLOGINPWD'">
          <Form ref="setloginpwdForm" :model="setloginpwdForm" :rules="passwordRules"  class="form-wrap" :label-width="120">
            <FormItem label="新密码" prop="newPassword">
              <Input v-model="setloginpwdForm.newPassword" type="password"></Input>
            </FormItem>
            <FormItem label="新密码确认" prop="confirmNewPassword">
              <Input v-model="setloginpwdForm.confirmNewPassword" type="password"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('setloginpwdForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'SETWIRELESS'">
          <Form ref="setwirelessForm" :model="setwirelessForm" :rules="wirelessRules"  class="form-wrap" :label-width="120">
            <FormItem label="SSID" prop="ssid">
              <Input v-model="setwirelessForm.ssid" type="password"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input v-model="setwirelessForm.password" type="password"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('setwirelessForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'UPDATETIMER'">
          <Form ref="upadatetimerForm" :model="upadatetimerForm"  :rules="timerRules" :label-width="120">
            <FormItem label="线路: " prop="checkedLines" style="width:100%">
              <label slot="label" class="slot-label pointer" @click="handleTimerLines">线路选择</label>
              <Tag
                :key="tag"
                v-for="tag in upadatetimerForm.checkedLines"
                closable
                :disable-transitions="false"
                @on-close="handleTimerClose(tag)">
                {{(tag === 1) ? '总路' : '线路' + (tag - 1) }}
              </Tag>
            </FormItem>
            <FormItem label="类型：">
              <Select  v-model="upadatetimerForm.type" @on-change="handleTypeChange">
                  <Option
                    v-for="item in types"
                    :key="item.value"
                    :value="item.value">
                    {{item.label}}
                  </Option>
                </Select>
            </FormItem>
            <FormItem label="时间：">
              <Col :span="24" v-if="upadatetimerForm.type === 'single' ">
                <DatePicker
                  @on-change="handleUpadate"
                  v-model="upadatetimerForm.time"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  :editable="false"
                  :clearable="false"
                  placeholder='请选择日期时间'>

                </DatePicker>
              </Col>
              <Col :span="24" v-if="upadatetimerForm.type === 'cycle' ">
                <TimePicker
                 @on-change="handleUpadate"
                  v-model="upadatetimerForm.time"
                  format="HH:mm"
                  value-format="HH:mm"
                   :editable="false"
                  :clearable="false"
                  placeholder="请选择日期时间">
                </TimePicker>
              </Col>
            </FormItem>
            <FormItem v-if="upadatetimerForm.type === 'cycle'">
              <label slot="label" class="slot-label pointer" @click="handleRepeat">+选择重复</label>
              <Tag
                :key="tag"
                v-for="tag in upadatetimerForm.week"
                closable
                :disable-transitions="false"
                @on-close="handleRepeatClose(tag)">
                <span>{{ "周" + tag }}</span>
                <span v-show="tag === '日'">7</span>
                <span v-show="tag === '一'">1</span>
                <span v-show="tag === '二'">2</span>
                <span v-show="tag === '三'">3</span>
                <span v-show="tag === '四'">4</span>
                <span v-show="tag === '五'">5</span>
                <span v-show="tag === '六'">6</span>
              </Tag>
            </FormItem>
            <FormItem label="动作：" prop="action">
              <Select v-model="upadatetimerForm.action" @on-change="handleAction">
                  <Option
                    v-for="item in actions"
                    :key="item.value"
                    :value="item.value">
                    {{item.label}}
                  </Option>
                </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('upadatetimerForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'SET_ENABLE_ALARM'">
          <Form ref="enableAlarmForm"  :model="enableAlarmForm" :rules="enableAlarmRules" class="" :label-width="120">

            <FormItem label="使能位设置:">
              <CheckboxGroup v-model="enableAlarmForm.enableBits" @on-change="handleCheckedBitsChange">
                <Checkbox v-for="(bit, index) in bits" :label="bit" :key="index" :disabled="bit === '保留'">{{ bit }}</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('enableAlarmForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="cmd.value === 'SET_ENABLE_TRIP'">
          <Form ref="enableTripForm"  :model="enableTripForm"  class="" :label-width="120">

            <FormItem label="使能位设置:">
              <CheckboxGroup v-model="enableTripForm.enableBits" @on-change="handleCheckedTripsChange">
                <Checkbox v-for="(bit, index) in trips" :label="bit" :key="index" :disabled="bit === '保留'">{{ bit }}</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitForm('enableTripForm')">保 存</Button>
            </FormItem>
          </Form>
        </Col>

      </Row>

    <Modal id="equipment" title="选择设备" :close-on-click-modal="false" custom-class="custom-select-dialog" :before-close="handleCancel" v-model="selectFlag" width="75%">
        <div>
          <Form :model="ruleForm" ref="ruleForm" class="rule-form" >
            <FormItem>
                <Row :gutter="16">
                    <Col :span="4" class="left-padding-right">
                <Input v-model="ruleForm.build" placeholder="楼栋"></Input>
              </Col>
              <Col :span="4" class="left-padding-right ml-5">
                <Input v-model="ruleForm.unit" placeholder="单元"></Input>
              </Col>
              <Col :span="4" class="left-padding-right ml-5">
                <Input v-model="ruleForm.mac" placeholder="设备号"></Input>
              </Col>
              <Col :span="8">
                <Button type="primary" @click="handleSearch">查询</Button>
              </Col>
              <Col :span="3" class="tr" style="padding-right: 0">
                  <Button type="primary" :disabled="selectionFalg" @click="handleOk">保存选择</Button>
              </Col>
                </Row>
            </FormItem>
          </Form>
          <Table
            class="mt-20 device-wrap"
            :data="boxesData"
            :columns="boxesColumn"
            @on-selection-change="handleSelectionChange">

              <template slot-scope="{row}" slot="macname">
                <div>{{ row.name }}</div>
            </template>
            <template slot-scope="{row,index}" slot="line">
               <Button class="btn" @click="handleLine(row,index)">选择</Button>
               <Tag
                    v-for="(tag, index) in boxesData[index].tags "
                    :key="index"
                    :closable="true"
                    @on-close="handleCloseTag(tag,index)">
                    {{tag.title}}
                </Tag>
            </template>
              <template slot-scope="{row}" slot="position">
                <div>{{ row.build + '\xa0\xa0\xa0' + row.unit + '\xa0\xa0\xa0' + row.room }}</div>
              </template>

              <template slot-scope="{row}" slot="status">
                <span v-show="row.others.online === -1" class="c-info">脱线</span>
                <span v-show="row.others.online === 0" class="c-danger">离线</span>
                <span v-show="row.others.online === 1" class="c-success">在线</span>
              </template>

              <template slot-scope="{row}" slot="operating">
                <Button style="color: #409eff" type="text" @click="handleMac(row)">选择设备</Button>
              </template>

          </Table>
        </div>
        <span slot="footer" style="height: 60px;">
          <Row style="padding:10px">
            <Col :span="24" class="tc">
              <Page
                @on-page-size-change="handleSizeChange"
                @on-change="handleCurrentChange"
                :current="currentPage"
                :page-size="20"
                layout="sizes, prev, pager, next"
                :total="total">
              </Page>
            </Col>
          </Row>
        </span>
    </Modal>
    <Modal id="equipment" title="线路列表" v-model="linesFlag" custom-class="channel-list">
      <Checkbox :indeterminate="isIndeterminate" v-model="checkAllLines" @change="handleCheckAllLinesChange">全选</Checkbox>
      <div style="margin: 15px 0;"></div>
      <CheckboxGroup v-model="enableAlarmForm.checkedLines" @change="handleCheckedLinesChange">
        <Checkbox v-for="o in 29" :label="o" :key="o">{{ (o - 1 === 0) ? '总路' : '操作类型' + (o - 1)}}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" class="dialog-footer">
        <Button type="primary" @click="linesFlag = false">确 定</Button>
      </div>
    </Modal>
    <Modal id="equipment" title="线路列表" v-model="tripLinesFlag" custom-class="channel-list">
      <Checkbox :indeterminate="tripIsIndeterminate" v-model="checkAllTripLines" @change="handleCheckAllTripLinesChange">全选</Checkbox>
      <div style="margin: 15px 0;"></div>
      <CheckboxGroup v-model="enableTripForm.checkedLines" @change="handleCheckedTripLinesChange">
        <Checkbox v-for="o in 29" :label="o" :key="o">{{ (o - 1 === 0) ? '总路' : '操作类型' + (o - 1)}}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" class="dialog-footer">
        <Button type="primary" @click="tripLinesFlag = false">确 定</Button>
      </div>
    </Modal>
    <Modal id="equipment" title="线路列表" v-model="timerLinesFlag" custom-class="channel-list">
      <Checkbox :indeterminate="timerIsIndeterminate" v-model="checkAllTimerLines" @on-change="handleCheckAllTimerLinesChange">全选</Checkbox>
      <div style="margin: 15px 0;"></div>
      <CheckboxGroup v-model="upadatetimerForm.checkedLines" @on-change="handleCheckedTimerLinesChange">
        <Checkbox v-for="o in 29" :label="o" :key="o">{{ (o - 1 === 0) ? '总路' : '操作类型' + (o - 1)}}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" class="dialog-footer">
        <Button type="primary" @click="timerLinesFlag = false">确 定</Button>
      </div>
    </Modal>
    <Modal id="equipment" title="选择重复" v-model="repeatFlag">
      <Checkbox :indeterminate="repeatIsIndeterminate" v-model="checkAllRepeat" @on-change="handleCheckAllRepeatChange">全选</Checkbox>
      <div style="margin: 15px 0;"></div>
      <CheckboxGroup v-model="upadatetimerForm.week" @on-change="handleCheckedWeekChange">
        <Checkbox v-for="item in week" :label="item.value" :key="item.value">{{ item.label }}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" class="dialog-footer">
        <Button type="primary" @click="repeatFlag = false">确 定</Button>
      </div>
    </Modal>
    <Modal title="线路列表" v-model="lineVisible" width="60%" append-to-body>
      <LineList :mac="mac" :tags="tags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
      <div slot="footer"></div>
    </Modal>
</div>

</template>
<script>
    import LineList from '../../Common/LineList.vue'
    import { queryBoxes, modifyBoxsChnlTitle, modifyBoxsChnlPower, modifyBoxsChnlCurrent, modifyBoxsChnlLeakageCurrent, modifyBoxsChnlTemperature, modifyBoxsChnlVoltage, modifyBoxsChnlWiring, modifyBoxsWireless, modifyBoxsLoginPasswrod, modifyBoxsChnlAlarmEbable, modifyBoxsChnlTripEnable, modifyBoxsChnlTimer } from '@/api/multiManage/batchConfig'
    export default {
        components: {
            LineList
        },
        data () {
            return {
                devices: [],
                selectData: [],
                selectFlag: false,
                selectionFalg: true,
                macs: [],
                linesFlag: false,
                tripLinesFlag: false,
                timerLinesFlag: false,
                repeatFlag: false,
                isIndeterminate: false,
                tripIsIndeterminate: false,
                timerIsIndeterminate: false,
                repeatIsIndeterminate: false,
                checkAllLines: '',
                checkAllTripLines: '',
                checkAllTimerLines: '',
                actionVal: '',
                checkAllRepeat: '',
                devicesColumn: [
                    {
                        title: '设备号',
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '设备别名',
                        slot: 'macname',
                        align: 'center'
                    },
                    {
                        title: '线路',
                        slot: 'line',
                        align: 'center'

                    },
                    {
                        title: '位置',
                        slot: 'position',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'status',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operating',
                        align: 'center'
                    }
                ],
                boxesColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '设备号',
                        key: 'mac',
                        align: 'center'
                    },
                    {
                        title: '设备别名',
                        slot: 'macname',
                        align: 'center'
                    },
                    {
                        title: '位置',
                        slot: 'position',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        slot: 'status',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        slot: 'operating',
                        align: 'center'
                    }
                ],
                datetime: '',
                time: '',
                enableAlarmForm: {
                    checkedLines: [],
                    enableBits: [],
                    enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join('')
                },
                enableTripForm: {
                    checkedLines: [],
                    enableBits: [],
                    enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join('')
                },
                upadatetimerForm: {
                    checkedLines: [],
                    week: [],
                    action: '',
                    type: 'single',
                    time: ''
                },
                boxesData: [],
                ruleForm: {
                    mac: '',
                    build: '',
                    unit: ''
                },
                currentPage: 1,
                pageSize: 20,
                total: 0,
                bits: ['短路报警', '浪涌报警', '过载报警', '温度预警', '漏电报警', '过流报警', '过压报警', '保留', '保留', '缺相报警', '电弧报警', '欠压报警', '过压预警', '欠压预警', '漏电预警', '电流预警', '保留', '保留', '保留', '保留', '保留', '温度A(单位:℃)', '不平衡报警', '错相报警', '保留', '保留', '保留', '保留', '保留', '保留', '保留', '保留'],
                trips: ['短路报警' + '脱扣', '浪涌报警' + '脱扣', '过载报警' + '脱扣', '温度预警' + '脱扣', '漏电报警' + '脱扣', '过流报警' + '脱扣', '过压报警' + '脱扣', '保留', '保留', '缺相报警' + '脱扣', '电弧报警' + '脱扣', '欠压报警' + '脱扣', '过压预警' + '脱扣', '欠压预警' + '脱扣', '漏电预警' + '脱扣', '电流预警' + '脱扣', '保留', '保留', '保留', '保留', '保留', '温度A(单位:℃)' + '脱扣', '不平衡报警' + '脱扣', '错相脱扣', '保留', '保留', '保留', '保留', '保留', '保留', '保留', '保留'],
                actions: [
                    {
                        value: '',
                        label: '请选择'
                    },
                    {
                        value: '1',
                        label: '合闸'
                    },
                    {
                        value: '2',
                        label: '分闸'
                    }
                ],
                types: [
                    {
                        value: 'single',
                        label: '单次定时'
                    },
                    {
                        value: 'cycle',
                        label: '循环定时'
                    }
                ],
                cmd: {
                    value: ''
                },
                options: [
                    {
                        value: '',
                        label: '请选择'
                    },
                    {
                        value: 'SET_TITLE',
                        label: '重命名'
                    },
                    {
                        value: 'LIMIT_POWER',
                        label: '功率上限' + '设置'
                    },
                    {
                        value: 'LIMIT_CURRENT',
                        label: '电流上限' + '设置'
                    },
                    {
                        value: 'LIMIT_LEAKAGE_CURRENT',
                        label: '漏电流上限' + '设置'
                    },
                    {
                        value: 'LIMIT_TEMPERATURE',
                        label: '温度上限' + '设置'
                    },
                    {
                        value: 'LIMIT_VOLTAGE',
                        label: '电压上下限' + '设置'
                    },
                    {
                        value: 'SETWIRING',
                        label: '接线方式' + '设置'
                    },
                    {
                        value: 'SETLOGINPWD',
                        label: '设备' + '密码' + '设置'
                    },
                    {
                        value: 'SETWIRELESS',
                        label: '设备' + '网络' + '设置'
                    },
                    {
                        value: 'UPDATETIMER',
                        label: '设备' + '定时' + '设置'
                    },
                    {
                        value: 'SET_ENABLE_ALARM',
                        label: '报警使能' + '设置'
                    },
                    {
                        value: 'SET_ENABLE_TRIP',
                        label: '脱扣使能' + '设置'
                    }
                ],
                week: [
                    {
                        value: '日',
                        label: '日'
                    },
                    {
                        value: '一',
                        label: '一'
                    },
                    {
                        value: '二',
                        label: '二'
                    },
                    {
                        value: '三',
                        label: '三'
                    },
                    {
                        value: '四',
                        label: '四'
                    },
                    {
                        value: '五',
                        label: '五'
                    },
                    {
                        value: '六',
                        label: '六'
                    }
                ],
                titleForm: {
                    line: '',
                    name: ''
                },
                titleRules: {
                    line: [{ required: true, message: '请选择' + '线路' + '!', trigger: 'change', type: 'number' }],
                    name: [{ required: true, message: '请输入' + '线路名称' + '!', trigger: 'blur' }]
                },
                powerForm: {
                    line: '',
                    limit: ''
                },
                powerRules: {
                    line: [{ required: true, message: '请选择' + '线路' + '!', trigger: 'change', type: 'number' }],
                    limit: [{ required: true, message: '请输入' + '功率上限' + '!', trigger: 'blur' }]
                },
                currentForm: {
                    line: '',
                    limit: ''
                },
                currentRules: {
                    line: [{ required: true, message: '请选择' + '线路' + '!', trigger: 'change', type: 'number' }],
                    limit: [{ required: true, message: '请输入' + '功率上限' + '!', trigger: 'blur' }]
                },
                leakagecurrentForm: {
                    line: '',
                    limit: ''
                },
                leakageCurrentRules: {
                    line: [{ required: true, message: '请选择' + '线路' + '!', trigger: 'change', type: 'number' }],
                    limit: [{ required: true, message: '请输入' + '漏电流上限' + '!', trigger: 'blur' }]
                },
                temperatureForm: {
                    line: '',
                    limit: ''
                },
                temperatureRules: {
                    line: [{ required: true, message: '请选择' + '线路' + '!', trigger: 'change', type: 'number' }],
                    limit: [{ required: true, message: '请输入' + '温度上限' + '!', trigger: 'blur' }]
                },
                voltageForm: {
                    line: '',
                    voltageH: '',
                    voltageL: ''
                },
                voltageRules: {
                    line: [{ required: true, message: '请选择' + '线路' + '!', trigger: 'change', type: 'number' }],
                    voltageH: [{ required: true, message: '请输入' + '电压上限' + '!', trigger: 'blur' }],
                    voltageL: [{ required: true, message: '请输入' + '电压下限' + '!', trigger: 'blur' }]
                },
                setwiringForm: {
                    wiring: ''
                },
                wiringRules: {

                    wiring: [{ required: true, message: '请选择' + '接线方式' + '!', trigger: 'blur' }]
                },
                setloginpwdForm: {
                    newPassword: '',
                    confirmNewPassword: ''
                },
                passwordRules: {
                    newPassword: [{ required: true, message: '请输入电箱密码！', trigger: 'blur' }],
                    confirmNewPassword: [{ required: true, message: '新密码确认无效，请再次输入新密码' + '!', trigger: 'blur' }]
                },
                setwirelessForm: {
                    ssid: '',
                    password: ''
                },
                wirelessRules: {
                    ssid: [{ required: true, message: '请输入SSID！', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码' + '!', trigger: 'blur' }]
                },
                enableAlarmRules: {
                    checkedLines: [
                        { type: 'array', required: true, message: '请选择' + '线路', trigger: 'change' }
                    ]
                },
                enableTripRules: {
                    checkedLines: [
                        { type: 'array', required: true, message: '请选择' + '线路', trigger: 'change' }
                    ]
                },
                timerRules: {
                    checkedLines: [
                        { type: 'array', required: true, message: '请选择' + '线路', trigger: 'change' }
                    ],
                    action: [
                        { required: true, message: '请选择' + '动作', trigger: 'change' }
                    ],
                    time: [
                        { required: true, message: '请选择' + '时间', trigger: 'change' }
                    ],
                    week: [
                        { required: true, message: '请选择' + '重复' + '时间', trigger: 'change' }
                    ]
                },
                batchHeight: {
                    position: 'relative',
                    height: this.$store.state.batchHeight
                },
                innerComponentHeight: {
                    position: 'relative',
                    height: this.$store.state.innerComponentHeight
                },
                lineVisible: false,
                mac: '',
                tagsList: [],
                tags: [],
                ts: '',
                index: ''
            }
        },
        mounted () {
            this.cmd.value = this.$route.params.value ? this.$route.params.value : ''
        },
        methods: {
            handleLine (row, index) {
                this.index = index
                this.mac = row.mac
                this.lineVisible = true
            },
            receiveChannels (val) {
                // this.boxesData[this.index].tags = val
                this.devices[this.index].tags = val

                //
                this.lineVisible = false
            },
            handleSelectDevice () {
                this.queryList()
                this.selectFlag = true
            },
            handleSearch () {
                this.currentPage = 1
                this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
            },
            queryList (build, unit, mac) {
                let params = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize,
                    projectCode: this.$store.state.projectCode
                }
                if (build) params.build = build
                if (unit) params.unit = unit
                if (mac) params.key = mac
                queryBoxes(params)
                    .then(res => {
                        if (res.success) {
                            this.total = res.total
                            let newArr = res.datas

                            this.boxesData = newArr.map(v => {
                                return { ...v, tags: [] }
                            })
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
            },
            handleSizeChange (val) {
                console.log(val);
                this.pageSize = val
                this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
            },
            handleCurrentChange (val) {
                console.log(val);
                if (this.selectData.length > 0) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '是否保存当前页所勾选设备？',
                        onOk: () => {
                            if (this.devices.length > 0) {
                                this.devices.forEach(item => {
                                    this.selectData = this.selectData.filter(keyItem => keyItem.mac !== item.mac)
                                })
                                this.devices = this.devices.concat(this.selectData)
                            } else {
                                this.devices = this.selectData
                            }
                            this.$Message.success({
                                coontent: '保存成功！'
                            })
                            this.currentPage = val
                            this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
                        },
                        onCancel: () => {
                            this.$Message.info({
                                coontent: '取消保存'
                            })
                            this.currentPage = val
                            this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
                        }
                    });
                } else {
                    this.currentPage = val
                    this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
                }
            },
            handleSelectionChange (val) {
                if (val.length === 0) {
                    this.selectionFalg = true
                } else {
                    this.selectionFalg = false
                }
                this.selectData = val
            },
            handleCloseTag (tag, index) {
                console.log(this.devices[this.index].tags);
                this.devices[this.index].tags.splice(index, 1)
                // this.devices[this.index].tags.splice(this.devices[this.index].indexOf(tag), 1)
                // row.channelAddrs.splice(index, 1)
            },
            handleMac (row) {
                if (this.devices.length > 0) {
                    this.devices = this.devices.filter(item => item.mac !== row.mac)
                    this.devices.push(row)
                } else {
                    this.devices.push(row)
                }
                this.selectFlag = false
            },
            handleOk () {
                if (this.devices.length > 0) {
                    this.devices.forEach(item => {
                        this.selectData = this.selectData.filter(keyItem => keyItem.mac !== item.mac)
                    })
                    this.devices = this.devices.concat(this.selectData)
                } else {
                    this.devices = this.selectData
                }
                this.selectFlag = false
            },
            handleEmpty () {
                this.devices = []
            },
            handleCancel () {
                this.ruleForm = {
                    mac: '',
                    build: '',
                    unit: ''
                }
                this.currentPage = 1
                this.selectFlag = false
            },
            deleteRow (rows, index) {
                rows.splice(index, 1)
            },
            submitForm (formName) {
                let that = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.devices.length === 0) {
                            this.$Message.error({
                                content: '请选择需要配置的设备！'
                            })
                            return false
                        }
                        this.macs = []
                        this.tagsList = []
                        this.macs = this.devices.map(item => ({
                            mac: item.mac,
                            addrs: item.tags.length > 0 ? JSON.parse(JSON.stringify(item.tags)) : ''
                        }))

                        let newAddrs = []
                        this.macs.forEach(item => {
                            if (item.addrs.length > 0) {
                                item.addrs.map(itm => {
                                    delete itm.title;
                                    newAddrs.push(itm.addr)
                                })
                                item.addrs = newAddrs
                            }
                        })

                        this.$nextTick(function () {
                            if (formName === 'titleForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.title = this.titleForm.name
                                modifyBoxsChnlTitle(params).then(res => {
                                    if (res.success) {
                                        that.$Message.success({
                                            content: '命令已提交，生效中..'
                                        })
                                    } else {
                                        let message = ''
                                        if (res.data) {
                                            for (let elem of res.data) {
                                                if (elem.errorMsg === '0') {
                                                    message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                } else {
                                                    message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                }
                                            }
                                        } else {
                                            message = res.message
                                        }
                                        that.$Modal.confirm({
                                            title: '',
                                            content: message
                                        })
                                    }
                                })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'powerForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.power = this.powerForm.limit
                                modifyBoxsChnlPower(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'currentForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.current = this.currentForm.limit
                                modifyBoxsChnlCurrent(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'leakagecurrentForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.leakageCurrent = this.leakagecurrentForm.limit
                                modifyBoxsChnlLeakageCurrent(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'temperatureForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.temperature = this.temperatureForm.limit
                                modifyBoxsChnlTemperature(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'voltageForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.voltageH = this.voltageForm.voltageH
                                params.voltageL = this.voltageForm.voltageL
                                modifyBoxsChnlVoltage(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'setwiringForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.wiring = this.setwiringForm.wiring
                                modifyBoxsChnlWiring(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'setloginpwdForm') {
                                this.macs = []
                                for (let elem of this.devices) {
                                    this.macs.push(elem.mac)
                                }
                                let params = {
                                    macs: this.macs.join(','),
                                    cmd: this.cmd.value
                                }
                                params.password = this.setloginpwdForm.newPassword
                                if (this.setloginpwdForm.confirmNewPassword === '' || this.setloginpwdForm.newPassword !== this.setloginpwdForm.confirmNewPassword) {
                                    this.$Message.error({
                                        content: '新密码确认无效，请再次输入新密码！'
                                    })
                                    return false
                                }
                                modifyBoxsLoginPasswrod(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'setwirelessForm') {
                                this.macs = []
                                for (let elem of this.devices) {
                                    this.macs.push(elem.mac)
                                }
                                let params = {
                                    macs: this.macs.join(','),
                                    cmd: this.cmd.value
                                }
                                params.ssid = this.setwirelessForm.ssid
                                params.password = this.setwirelessForm.password
                                modifyBoxsWireless(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'upadatetimerForm') {
                                this.macs = []
                                for (let elem of this.devices) {
                                    this.macs.push(elem.mac)
                                }
                                let params = {
                                    macs: this.macs.join(','),
                                    cmd: this.cmd.value
                                }
                                params.channel = this.upadatetimerForm.checkedLines.join(',')
                                params.autoid = 0
                                params.status = this.actionVal === '1' ? this.actionVal = true : this.actionVal = false
                                params.time = this.upadatetimerForm.time + ':00'
                                params.weekday = this.upadatetimerForm.week.join('')
                                modifyBoxsChnlTimer(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'enableAlarmForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.alarmEnable = this.enableAlarmForm.enableBitsObj
                                modifyBoxsChnlAlarmEbable(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            } else if (formName === 'enableTripForm') {
                                let params = {
                                    macAddrs: this.macs,
                                    cmd: this.cmd.value
                                }
                                params.tripEnable = this.enableTripForm.enableBitsObj
                                modifyBoxsChnlTripEnable(params)
                                    .then(res => {
                                        if (res.success) {
                                            that.$Message.success({
                                                content: '命令已提交，生效中..'
                                            })
                                        } else {
                                            let message = ''
                                            if (res.data) {
                                                for (let elem of res.data) {
                                                    if (elem.errorMsg === '0') {
                                                        message += '<div class="c-success tl">' + elem.mac + '：' + '生效中..' + '</div>'
                                                    } else {
                                                        message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                                                    }
                                                }
                                            } else {
                                                message = res.message
                                            }
                                            that.$Modal.confirm({
                                                title: '',
                                                content: message
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        if (err) {
                                            that.$Message.error({
                                                content: '未知错误，请刷新重试'
                                            })
                                        }
                                    })
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            handleLines () {
                this.linesFlag = true
            },
            handleTripLines () {
                this.tripLinesFlag = true
            },
            handleTimerLines () {
                this.timerLinesFlag = true
            },
            handleRepeat () {
                this.repeatFlag = true
            },
            handleCheckAllLinesChange (val) {
                this.enableAlarmForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
                this.isIndeterminate = false
            },
            handleUpadate (val) {
                this.upadatetimerForm.time = val
            },
            handleCheckAllTripLinesChange (val) {
                this.enableTripForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
                this.tripIsIndeterminate = false
            },
            handleCheckAllTimerLinesChange (val) {
                this.upadatetimerForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
                this.timerIsIndeterminate = false
            },
            handleCheckAllRepeatChange (val) {
                this.upadatetimerForm.week = val ? ['日', '一', '二', '三', '四', '五', '六'] : []
                this.repeatIsIndeterminate = false
            },
            handleCheckedLinesChange (value) {
                let checkedCount = value.length
                this.checkAllLines = checkedCount === 29
                this.isIndeterminate = checkedCount > 0 && checkedCount < 29
            },
            handleCheckedTripLinesChange (value) {
                let checkedCount = value.length
                this.checkAllTripLines = checkedCount === 29
                this.tripIsIndeterminate = checkedCount > 0 && checkedCount < 29
            },
            handleCheckedTimerLinesChange (value) {
                let checkedCount = value.length
                this.checkAllTimerLines = checkedCount === 29
                this.timerIsIndeterminate = checkedCount > 0 && checkedCount < 29
            },
            handleCheckedWeekChange (value) {
                let checkedCount = value.length
                this.checkAllRepeat = checkedCount === this.week.length
                this.repeatIsIndeterminate = checkedCount > 0 && checkedCount < this.week.length
            },
            handleClose (tag) {
                this.enableAlarmForm.checkedLines.splice(this.enableAlarmForm.checkedLines.indexOf(tag), 1)
            },
            handleTripClose (tag) {
                this.enableTripForm.checkedLines.splice(this.enableTripForm.checkedLines.indexOf(tag), 1)
            },
            handleTimerClose (tag) {
                this.upadatetimerForm.checkedLines.splice(this.upadatetimerForm.checkedLines.indexOf(tag), 1)
            },
            handleRepeatClose (tag) {
                this.upadatetimerForm.week.splice(this.upadatetimerForm.week.indexOf(tag), 1)
            },
            handleTypeChange (val) {
                this.upadatetimerForm.time = ''
            },
            handleAction (val) {
                this.actionVal = val
            },
            handleCheckedBitsChange (value) {
                let arr = []
                arr = [
                    value.indexOf('短路报警') > -1 ? 1 : 0,
                    value.indexOf('浪涌报警') > -1 ? 1 : 0,
                    value.indexOf('过载报警') > -1 ? 1 : 0,
                    value.indexOf('温度预警') > -1 ? 1 : 0,
                    value.indexOf('漏电报警') > -1 ? 1 : 0,
                    value.indexOf('过流报警') > -1 ? 1 : 0,
                    value.indexOf('过压报警') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('缺相报警') > -1 ? 1 : 0,
                    value.indexOf('电弧报警') > -1 ? 1 : 0,
                    value.indexOf('欠压报警') > -1 ? 1 : 0,
                    value.indexOf('过压预警') > -1 ? 1 : 0,
                    value.indexOf('欠压预警') > -1 ? 1 : 0,
                    value.indexOf('漏电预警') > -1 ? 1 : 0,
                    value.indexOf('电流预警') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('温度A(单位:℃)') > -1 ? 1 : 0,
                    value.indexOf('不平衡报警') > -1 ? 1 : 0,
                    value.indexOf('错相报警') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0
                ]
                this.enableAlarmForm.enableBitsObj = arr.reverse().join('')
            },
            handleCheckedTripsChange (value) {
                let arr = []
                arr = [
                    value.indexOf('短路报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('浪涌报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('过载报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('温度预警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('漏电报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('过流报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('过压报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('缺相报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('电弧报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('欠压报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('过压预警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('欠压预警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('漏电预警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('电流预警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('温度A(单位:℃)' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('不平衡报警' + '脱扣') > -1 ? 1 : 0,
                    value.indexOf('错相脱扣') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0,
                    value.indexOf('保留') > -1 ? 1 : 0
                ]
                this.enableTripForm.enableBitsObj = arr.reverse().join('')
            }
        },
        watch: {
            '$store.state.batchHeight': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.batchHeight.height = newVal
                    }
                }
            },
            '$store.state.innerComponentHeight': {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.innerComponentHeight.height = newVal
                    }
                }
            }
            // cmd: {
            //     handler (newVal, oldVal) {
            //         if (newVal) {
            //             let value = newVal.value.split('_')[1].toLowerCase() + 'Form'
            //
            //             this.$nextTick(() => {
            //                 this.$refs[value].resetFields();
            //             })
            //         }
            //     },
            //     deep: true
            // }
        }
    }
</script>
<style lang="less" scoped>
.batch {
  padding: 0 10px;
  .batchTable {
    background: #1a202e;
    padding: 20px;
    .header {
      display: flex;
      padding: 10px 0;
      span {
        font-size: 16px;
      }
      Button {
        margin: 0 5px;
      }
    }
  }
  .divided {
    height: 1px;
    background: #fff;
    margin-top: 10px;
  }
  .select-wrap {
      padding:20px 0;
    background: #1a202e;
  }
  .scroll {
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.descriptionTitle{
    margin: 20px 0;
}
.ivu-tag {
  height: 32px;
  line-height: 32px;
}
.formt{
    display: flex;
    span{
        margin-left: 5px;
    }
}
.btn {
  background: rgba(0, 126, 255, 0.1);
  border: 1px solid #007eff;
  border-radius: 5px;
  color: #007eff;
  margin-right: 10px;
}
/deep/.ivu-modal-footer{
    padding:0;
}
</style>
