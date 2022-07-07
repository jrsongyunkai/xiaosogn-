<template>
  <div>
    <div
      v-if="groupFlag"
      style="background: #1a202e; padding: 20px; height: 820px"
    >
      <div class="header-groupConfig">
        <h2>分组列表</h2>
        <button @click="goNewGroup">新增</button>
      </div>
      <!-- <br> -->
      <Table
        ref="selection"
        style="margin-top: 10px"
        :columns="columns"
        :data="list"
      >
        <template slot-scope="{ row, index }" slot="swith">
          <Switch
            @on-change="handeleState(row, index)"
            :value="row.status ? true : false"
          >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </Switch>
        </template>

        <template slot-scope="{ row }" slot="action">
          <div>
            <Button
              class="edit"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              :ghost="true"
              @click="goEditGroup(row)"
              >编辑</Button
            >
            <Button
              class="edit"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              :ghost="true"
              @click="groupManage(row)"
              >分组管理</Button
            >
            <!-- <Button
              class="delete"
              type="text"
              size="small"
              style="color: #e03c3a"
              @click="deleteGroup(row)"
              >删除</Button
            > -->
            <Poptip
              class="newgroupPoptip"
              confirm
              title="确定删除吗?"
              transfer
              placement="left"
              ok-text="删除"
              cancel-text="取消"
              @on-ok="deleteGroup(row)"
            >
              <Button
                class="delete"
                type="text"
                size="small"
                style="margin-right: 5px; color: #e03c3a"
                >删除</Button
              >
            </Poptip>
          </div>
        </template>
      </Table>
      <Page
        style="margin-top: 10px; float: right"
        class="page"
        :total="total"
        :page-size="10"
        show-total
        @on-change="change"
        :current="1"
        @on-page-size-change="changesize"
        show-elevator
      />
    </div>
    <Modal
      v-model="modalFlag"
      :title="modalTitlte"
      @on-ok="addGroupList"
      @on-cancel="cancelmodalFlag"
    >
      <Row style="margin-top: 10px">
        <Col :span="4">分组类型:</Col>
        <Col>
          <Input
            v-model="groupingTypeValue"
            placeholder="请输入分组类型"
          ></Input
        ></Col>
      </Row>
      <Row style="margin-top: 10px">
        <Col :span="4">分组描述:</Col>
        <Col>
          <Input
            v-model="groupingdecritionValue"
            placeholder="请输入分组描述"
          ></Input
        ></Col>
      </Row>
      <Row style="margin-top: 10px"
        ><Col :span="4">状态:</Col>
        <Switch v-model="groupingStatus">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </Switch></Row
      >
    </Modal>
    <div
      v-if="!groupFlag"
      style="background: #1a202e; padding: 20px; height: 820px"
    >
      <Button @click="groupFlag = true" type="text">
        <i class="icon-v5 icon-v5-xiangzuo">返回</i>
      </Button>
      <Table
        class="newgroupTable"
        :columns="newgroupTable"
        :data="newgroupList"
        row-key="id"
        height="620"
      >
        <template slot-scope="{ row, index }" slot="name" id="namesss">
          <Poptip placement="top" transfer>
            <Button type="text" class="">{{
              row.name ? row.name : "添加名称"
            }}</Button>
            <div slot="content">
              <div>
                <Input
                  v-model="row.name"
                  @on-blur="addName(row.name, row, index)"
                />
              </div>
              <!-- <div style="margin-left:120px"> <Button type="primary" size="small" @click="addName(row.name, row, index)"
                  >确定</Button
                ></div> -->
            </div>
          </Poptip>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <div>
            <Dropdown @on-click="addGroupChildParent($event, row, index)">
              <Button
                class="edit"
                type="text"
                size="small"
                style="margin-right: 5px; color: #007eff"
              >
                添加分组
              </Button>
              <DropdownMenu slot="list">
                <!-- <DropdownItem name = '添加上级'>添加上级</DropdownItem> -->
                <DropdownItem name="添加本级">添加本级</DropdownItem>
                <DropdownItem name="添加下级">添加下级</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              class="choose"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              @click="openAttributeFlag(row, index)"
              >属性管理</Button
            >
            <Button
              class="choose"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              @click="addDeviceModal(row)"
              >添加设备</Button
            >
            <Button
              class="choose"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              @click="addNodesLine(row)"
              >添加线路</Button
            >
            <Button
              class="choose"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              @click="addNodeLoad(row)"
              >添加负载</Button
            >
            <Poptip
              class="newgroupPoptip"
              confirm
              title="确定删除分组吗?"
              placement="left"
              ok-text="删除"
              cancel-text="取消"
              @on-ok="delBoxGroupNodeList(row)"
            >
              <Button
                class="delete"
                type="text"
                size="small"
                style="margin-right: 5px; color: #e03c3a"
                >删除分组</Button
              >
            </Poptip>
          </div>
        </template>
      </Table>
      <Modal
        title="分组-属性管理"
        v-model="attributeFlag"
        width="800"
        @on-ok="getModalvalue"
      >
        <h3>基础信息</h3>
        <div style="border-top: 1px solid #303542; margin-top: 5px"></div>
        <Form :label-width="90">
          <FormItem label="面积">
            <Input
              v-model.number="attributes.area"
              :maxlength="6"
              style="width: 200px; margin-top: 5px"
              placeholder="请输入"
              show-word-limit
              @on-change="getNumberValue(attributes.area)"
            ></Input>
            (平方)
          </FormItem>
          <FormItem label="人数">
            <Input
              v-model.number="attributes.people"
              :maxlength="6"
              show-word-limit
              @on-change="getNumberValue(attributes.people)"
              style="width: 200px"
              placeholder="请输入"
            >
            </Input>
            (人)
          </FormItem>
          <FormItem label="经纬度">
            <Input
              v-model.number="attributes.longitude"
              type="number"
              style="width: 200px"
              placeholder="请输入经度"
            >
            </Input>
            <Input
              v-model.number="attributes.latitude"
              type="number"
              style="width: 200px; margin-left: 10px"
              placeholder="请输入纬度"
            >
            </Input>
            <Button
              type="primary"
              style="margin-left: 10px"
              @click="changemapFlag"
              >地图标点</Button
            >
          </FormItem>
          <FormItem label="位置名称">
            <Input
              v-model="attributes.localtionName"
              style="width: 300px"
              placeholder="请输入位置名称"
            >
            </Input>
          </FormItem>
          <div v-if="mapFlag" style="height: 400px; width: 600px">
            <echartsMap
              @getLongitudes="getLongitudes"
              @getLocaltion="getLocaltion"
            ></echartsMap>
          </div>
          <h3 style="margin-top: 20px">分组负责人</h3>
          <div style="border-top: 1px solid #303542; margin-top: 5px"></div>
          <FormItem label="姓名">
            <Input
              v-model="attributes.peopleName"
              style="width: 300px"
              placeholder="请输入"
            >
            </Input>
          </FormItem>
          <FormItem label="职务">
            <Input
              v-model="attributes.dutyJob"
              style="width: 300px"
              placeholder="请输入"
            >
            </Input>
          </FormItem>
          <FormItem label="联系电话">
            <Input
              v-model.number="attributes.telephoneNum"
              :maxlength="11"
              show-word-limit
              style="width: 300px"
              placeholder="请输入"
              @on-blur="getTelValue(attributes.telephoneNum)"
            >
            </Input>
          </FormItem>
          <h3 style="margin-top: 20px">用电设置</h3>
          <div style="border-top: 1px solid #303542; margin-top: 5px"></div>
          <FormItem label="最大功率">
            <Input
              v-model.number="attributes.maxPower"
              @on-change="getNumberValue(attributes.maxPower)"
              style="width: 300px"
              placeholder="请输入"
              :maxlength="6"
              show-word-limit
            >
            </Input>
            (KW)
          </FormItem>
          <FormItem label="最大用电量">
            <Input
              v-model.number="attributes.maxElectri"
              :maxlength="6"
              show-word-limit
              @on-change="getNumberValue(attributes.maxElectri)"
              style="width: 300px"
              placeholder="请输入"
            >
            </Input>
            (KWh)
          </FormItem>
          <FormItem label="用电时段">
            <div
              v-for="(item, index) in timeList"
              :key="item"
              style="margin-top: 3px"
            >
              <TimePicker
                transfer
                v-model="timeValue[index]"
                :editable="false"
                format="HH:mm"
                type="timerange"
                placement="bottom-end"
                placeholder="选择时间"
                style="width: 168px"
              ></TimePicker>
              <span
                style="
                  margin-left: 5px;
                  background: rgba(224, 60, 58, 0.1);
                  padding: 4px;
                  border: 1px solid #e03c3a;
                  border-radius: 3px;
                "
                ><Icon
                  type="ios-trash-outline"
                  size="22"
                  color="#E03C3A"
                  @click="minusList(index)"
              /></span>
            </div>
            <Button
              style="
                margin-top: 5px;
                width: 168px;
                border: 1px dashed #007eff;
                background-color: rgba(0, 126, 255, 0.1);
              "
              type="primary"
              ghost
              @click="minusList('add')"
              >+ 添加时段</Button
            >
          </FormItem>
        </Form>
      </Modal>
      <Modal
        title="添加设备"
        v-model="addDeviceFlag"
        width="500"
        :footer-hide="true"
      >
        <Row style="width: 100%">
          <Col :span="24">
            <h4 style="padding: 5px">选择设备 {{ deviceNum }}</h4>
            <!-- 先不做搜索 @on-change="getOpenchange" <Input search enter-button placeholder="请输入设备号搜索" @on-search="searchDevice" v-model="" /> -->
            <Collapse accordion>
              <Panel name="1" style="background-color: #28313f">
                <Checkbox
                  v-model="airSwitch"
                  @on-change="getAllDeviceValue(airSwitch, deviceLIstOne, '1')"
                  >&nbsp;&nbsp;智能空开</Checkbox
                >
                <div slot="content">
                  <CheckboxGroup
                    v-model="checkAllGroups"
                    @on-change="allGroupSelect('1')"
                  >
                    <Checkbox
                      style="padding: 5px; display: block"
                      v-for="item in deviceLIstOne"
                      :key="Math.random() + item.mac"
                      :label="item.mac"
                      >{{ item.name + "(" + item.mac + ")" }}</Checkbox
                    >
                  </CheckboxGroup>
                </div>
              </Panel>
              <Panel name="2" style="background-color: #28313f">
                <Checkbox
                  v-model="fireSwitch"
                  @on-change="getAllDeviceValue(fireSwitch, deviceLIstTwo, '2')"
                >
                  &nbsp;&nbsp;电气火灾</Checkbox
                >
                <div slot="content">
                  <CheckboxGroup
                    v-model="checkAllGroupTwo"
                    @on-change="allGroupSelect('2')"
                  >
                    <Checkbox
                      style="padding: 5px; display: block"
                      v-for="item in deviceLIstTwo"
                      :key="Math.random() + item.name"
                      :label="item.mac"
                      >{{ item.name + "(" + item.mac + ")" }}</Checkbox
                    >
                  </CheckboxGroup>
                </div>
              </Panel>
              <Panel name="3" style="background-color: #28313f">
                <Checkbox
                  v-model="waterSwitch"
                  @on-change="
                    getAllDeviceValue(waterSwitch, deviceLIstThree, '3')
                  "
                >
                  &nbsp;&nbsp;水位水压</Checkbox
                >
                <div slot="content">
                  <CheckboxGroup
                    v-model="checkAllGroupThree"
                    @on-change="allGroupSelect('3')"
                  >
                    <Checkbox
                      style="padding: 5px; display: block"
                      v-for="item in deviceLIstThree"
                      :key="Math.random() + item.name"
                      :label="item.mac"
                      >{{ item.name + "(" + item.mac + ")" }}</Checkbox
                    >
                  </CheckboxGroup>
                </div>
              </Panel>
              <Panel name="4" style="background-color: #28313f">
                <Checkbox
                  v-model="smokeSwitch"
                  @on-change="
                    getAllDeviceValue(smokeSwitch, deviceLIstFour, '4')
                  "
                  >&nbsp;&nbsp;烟雾、可燃气体</Checkbox
                >
                <div slot="content">
                  <CheckboxGroup
                    v-model="checkAllGroupFour"
                    @on-change="allGroupSelect('4')"
                  >
                    <Checkbox
                      style="padding: 5px; display: block"
                      v-for="item in deviceLIstFour"
                      :key="Math.random() + item.resId"
                      :label="item.mac"
                      >{{ item.name + "(" + item.mac + ")" }}</Checkbox
                    >
                  </CheckboxGroup>
                </div>
              </Panel>
              <Panel name="5" style="background-color: #28313f">
                <Checkbox
                  v-model="LoRASwitch"
                  @on-change="
                    getAllDeviceValue(LoRASwitch, deviceLIstFive, '5')
                  "
                  >&nbsp;&nbsp;LORA专网</Checkbox
                >
                <div slot="content">
                  <CheckboxGroup
                    v-model="checkAllGroupFive"
                    @on-change="allGroupSelect('5')"
                  >
                    <Checkbox
                      style="padding: 5px; display: block"
                      v-for="item in deviceLIstFive"
                      :key="Math.random() + item.name"
                      :label="item.mac"
                      >{{ item.name + "(" + item.mac + ")" }}</Checkbox
                    >
                  </CheckboxGroup>
                </div>
              </Panel>
              <Panel name="6" style="background-color: #28313f">
                <Checkbox
                  v-model="tempraureSwitch"
                  @on-change="
                    getAllDeviceValue(tempraureSwitch, deviceLIstSix, '6')
                  "
                  >&nbsp;&nbsp;温度、湿度、光照</Checkbox
                >
                <div slot="content">
                  <CheckboxGroup
                    v-model="checkAllGroupSix"
                    @on-change="allGroupSelect('6')"
                  >
                    <Checkbox
                      style="padding: 5px; display: block"
                      v-for="item in deviceLIstSix"
                      :key="Math.random() + item.resId"
                      :label="item.mac"
                      >{{ item.name + "(" + item.mac + ")" }}</Checkbox
                    >
                  </CheckboxGroup>
                </div>
              </Panel>
              <Panel
                name="7"
                style="background-color: #28313f"
                v-if="deviceLIstSeven.length > 0"
              >
                <Checkbox
                  v-model="eletricSwitch"
                  @on-change="
                    getAllDeviceValue(eletricSwitch, deviceLIstSeven, '7')
                  "
                  >&nbsp;&nbsp;智能电表</Checkbox
                >
                <div slot="content">
                  <CheckboxGroup
                    v-model="checkAllGroupSeven"
                    @on-change="allGroupSelect('7')"
                  >
                    <Checkbox
                      style="padding: 5px; display: block"
                      v-for="item in deviceLIstSeven"
                      :key="Math.random() + item.mac"
                      :label="item.mac"
                      >{{ item.name + "(" + item.mac + ")" }}</Checkbox
                    >
                  </CheckboxGroup>
                </div>
              </Panel>
              <Panel
                name="8"
                style="background-color: #28313f"
                v-if="deviceLIstEight.length > 0"
              >
                <Checkbox
                  v-model="lastSwitch"
                  @on-change="
                    getAllDeviceValue(lastSwitch, deviceLIstEight, '8')
                  "
                  >&nbsp;&nbsp;智能水表</Checkbox
                >
                <div slot="content">
                  <CheckboxGroup
                    v-model="checkAllGroupEight"
                    @on-change="allGroupSelect('8')"
                  >
                    <Checkbox
                      style="padding: 5px; display: block"
                      v-for="item in deviceLIstEight"
                      :key="Math.random() + item.resId"
                      :label="item.mac"
                      >{{ item.name + "(" + item.mac + ")" }}</Checkbox
                    >
                  </CheckboxGroup>
                </div>
              </Panel>
            </Collapse>
          </Col>
        </Row>
        <Row :gutter="10" style="margin-top: 10px">
          <Col :span="12"></Col>
          <Col>
            <Button type="primary" @click="openLineMdoal">选择线路</Button></Col
          >
          <Col>
            <Button type="primary" @click="saveSelectDevice">保存</Button></Col
          >
          <Col><Button @click="addDeviceFlag = false">取消</Button></Col>
        </Row>
      </Modal>
      <Modal title="添加线路" v-model="addDeviceLineFlag">
        <Row>
          <Col :span="24">
            <Table :columns="columnsLineList" :data="DeviceLists">
              <template slot-scope="{ row }" slot="opretation">
                <Button type="text" @click="addLinesList(row)"
                  >+添加线路</Button
                >
              </template>
            </Table>
          </Col>
        </Row>
        <div slot="footer">
          <Button type="primary" @click="addDeviceLineFlag = false"
            >确定</Button
          >
        </div>
      </Modal>
      <Modal v-model="lineLIstFlag" title="线路列表" @on-ok="saveLineGroup">
        <div v-if="lineNodeList.length === 0">该设备没有线路</div>
        <Checkbox
          v-if="lineNodeList.length > 0"
          v-model="getLineValue"
          @on-change="getAllLineValue(getLineValue, lineNodeList)"
          >全选</Checkbox
        >
        <CheckboxGroup v-model="lineCheckList" @on-change="allSelectList">
          <Checkbox
            v-for="item in lineNodeList"
            :key="Math.random() + item.title"
            :label="item.addr"
            >{{ item.title }}</Checkbox
          >
        </CheckboxGroup>
      </Modal>
      <Modal title="添加负载" v-model="loadModalFlag" @on-ok="addLoadDevice">
        <Collapse v-model="value1">
          <Panel name="1" style="background-color: #28313f">
            <Checkbox
              v-model="getLoadValue"
              @on-change="getAllLoadList(getLoadValue, loadList)"
              >&nbsp;&nbsp;选择负载</Checkbox
            >
            <div slot="content">
              <Row :guttter="16">
                <Col :span="13"
                  ><Input
                    v-model="searchLoad"
                    placeholder="请输入负载名称搜索"
                  ></Input
                ></Col>
                <Col :span="8"> <Select v-model="typeLoad"  style="margin-left:10px">
        <Option v-for="item in LoadList" :value="item.type" :key="item.name">{{ item.name }}</Option>
          </Select></Col>
		          <Col :span="3"> <Button type="primary">查询</Button></Col>
              </Row>
              <CheckboxGroup v-model="checkLoad">
                <Checkbox
                  style="padding: 5px; display: block"
                  v-for="item in loadList"
                  :key="Math.random() + item.id"
                  :label="item.id + '-' + item.name"
                  >{{ item.name }}</Checkbox
                >
              </CheckboxGroup>
              <Page
                class="position-page"
                background
                @on-page-size-change="handleSizeChange"
                @on-change="handleCurrentChange"
                :current="loadPageNo"
                :page-size-opts="[10, 20, 30]"
                :page-size="loadPageSize"
                :total="loadtotal"
              ></Page>
            </div>
          </Panel>
        </Collapse>
      </Modal>
    </div>
  </div>
</template>
<script>
    import {
        listBoxGroups,
        delBoxGroup,
        saveBoxGroup,
        saveBoxGroupNode,
        delBoxGroupNode,
        saveBoxGroupAttributes,
        queryBoxGroupAttributes,
        listBoxGroupDevices,
        saveBoxGroupDevices,
        queryChannels,
        queryList,
        listBoxGroupLoads,
        saveBoxGroupLoads,
        getQueryBoxes,
        queryTypeList,
        queryBoxGroupTreeDetail
    } from '@/api/public';

    import echartsMap from './latitudeMap.vue';
    import '@/styles/pages/groupComfig.less';
    export default {
        name: 'multiManage-groupConfig',
        components: { echartsMap },
        data () {
            return {
                typeLoad: '',
                LoadList: [],
                searchLoad: '',
                visible: false,
                getLoadValue: false,
                getLineValue: false,
                lastSwitch: false,
                eletricSwitch: false,
                tempraureSwitch: false,
                LoRASwitch: false,
                smokeSwitch: false,
                waterSwitch: false,
                airSwitch: false,
                fireSwitch: false,
                nodeTableRow: '',
                loadModalFlag: false,
                checkLoad: [],
                value1: '1',
                loadList: [],
                macValue: '',
                lineCheckList: [],
                lineLIstFlag: false,
                lineNodeList: [],
                deviceNodeList: [],
                columnsLineList: [
                    { title: '已选设备', key: 'mac' },
                    { title: '操作', slot: 'opretation' }
                ],
                currentType: '',
                DeviceLists: [],
                addDeviceLineFlag: false,
                deviceNum: '',
                deviceList: [],
                deviceValue: '',
                getDeviceGroupNodeList: [],
                indeterminate: true,
                checkAll: false,
                allDevice: false,
                checkAllGroups: [],
                checkAllGroupTwo: [],
                checkAllGroupThree: [],
                checkAllGroupFour: [],
                checkAllGroupFive: [],
                checkAllGroupSix: [],
                checkAllGroupSeven: [],
                checkAllGroupEight: [],
                deviceLIstOne: [],
                deviceLIstTwo: [],
                deviceLIstThree: [],
                deviceLIstFour: [],
                deviceLIstFive: [],
                deviceLIstSix: [],
                deviceLIstSeven: [],
                deviceLIstEight: [],
                addDeviceFlag: false,
                mapFlag: false,
                attributeManage: '',
                timeList: 1,
                timeValue: [],
                attributes: {
                    area: '',
                    people: '',
                    longitude: '',
                    latitude: '',
                    localtionName: '',
                    peopleName: '',
                    dutyJob: '',
                    telephoneNum: '',
                    maxPower: '',
                    maxElectri: ''
                },
                attributeFlag: false,
                saveGroupId: '',
                nameValue: '',
                newgroupList: [],
                newgroupTable: [
                    {
                        title: '分组名称',
                        slot: 'name',
                        tree: true
                    },
                    {
                        title: '绑定设备数量',
                        key: 'deviceNum',
                        width: 130
                    },
                    {
                        title: '绑定线路数量',
                        key: 'addrNum',
                        width: 200
                    },
                    {
                        title: '绑定负载数量',
                        key: 'loadNum',
                        width: 200
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        align: 'center'
                    }
                ],
                modalTitlte: '新增列表数据',
                id: '',
                modalFlag: false,
                groupingStatus: false,
                groupingdecritionValue: '',
                groupingTypeValue: '',
                columns: [
                    {
                        title: '序号',
                        type: 'index'
                    },
                    {
                        title: '分组类型',
                        key: 'type'
                    },
                    {
                        title: '分组描述',
                        key: 'description'
                    },
                    {
                        title: '状态',
                        slot: 'swith'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        sortable: true
                    },
                    {
                        title: '操作',
                        slot: 'action'
                    }
                ],
                list: [],
                total: 0,
                groupFlag: true,
                isNew: true,
                datas: [],
                values1: '',
                values2: '',
                open: true,
                params: {
                    projectCode: this.$store.state.projectCode,
                    pageNo: 1,
                    pageSize: 10
                },
                loadPageNo: 1,
                loadPageSize: 10,
                loadtotal: ''
            };
        },
        methods: {
            init () {
                listBoxGroups(this.params)
                    .then((res) => {
                        if (res.success) {
                            this.list = res.datas;
                            this.total = res.total;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error(res.message);
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                    });

                // 所有设备列表
                let param = {
                    projectCode: this.$store.state.projectCode
                };
                getQueryBoxes(param)
                    .then((res) => {
                        if (res.success) {
                            this.deviceNum = res.data.length;
                            this.deviceList = res.data;
                            let newArrone = [];
                            let newArrtwo = [];
                            let newArrthree = [];
                            let newArrfour = [];
                            let newArrfive = [];
                            let newArrsix = [];
                            let newArrseven = [];
                            let newArreight = [];
                            res.data.forEach((item) => {
                                if (item.equipmentType === 1) {
                                    // this.deviceLIstOne = Array.from(new Set(newArr.push(item)))
                                    newArrone.push(item);
                                }
                                if (item.equipmentType === 2 || item.equipmentType === 3) {
                                    newArrtwo.push(item);
                                    // this.deviceLIstTwo.push(item)
                                    // this.deviceLIstTwo = Array.from(new Set(this.deviceLIstTwo.push(item)))
                                }
                                if (item.equipmentType === 4 || item.equipmentType === 5) {
                                    newArrthree.push(item);

                                    // this.deviceLIstThree.push(item)
                                }
                                if (
                                    item.equipmentType === 6 ||
                                    item.equipmentType === 7 ||
                                    item.equipmentType === 10 ||
                                    item.equipmentType === 13
                                ) {
                                    //  this.deviceLIstFour.push(item)
                                    newArrfour.push(item);
                                }
                                if (item.equipmentType === 8) {
                                    //  this.deviceLIstFive.push(item)
                                    newArrfive.push(item);
                                }
                                if (item.equipmentType === 11 || item.equipmentType === 14) {
                                    // this.deviceLIstSix.push(item)
                                    newArrsix.push(item);
                                }
                                if (item.equipmentType === 12) {
                                    // this.deviceLIstSeven.push(item)
                                    newArrseven.push(item);
                                }
                                if (item.equipmentType === 15 || item.equipmentType === 16) {
                                    // this.deviceLIstEight.push(item)
                                    newArreight.push(item);
                                }
                                this.deviceLIstOne = Array.from(new Set(newArrone));
                                this.deviceLIstTwo = Array.from(new Set(newArrtwo));
                                this.deviceLIstThree = Array.from(new Set(newArrthree));
                                this.deviceLIstFour = Array.from(new Set(newArrfour));
                                this.deviceLIstFive = Array.from(new Set(newArrfive));
                                this.deviceLIstSix = Array.from(new Set(newArrsix));
                                this.deviceLIstSeven = Array.from(new Set(newArrseven));
                                this.deviceLIstEight = Array.from(new Set(newArreight));
                            });
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
                queryTypeList().then(res => {
                    if (res.success) {
                        this.LoadList = res.data
                    }
                })
            },
            // getLoadType(){
            //  queryTypeList().then(res=>{
            //           if(res.success){
            //  })
            // },
            allSelectList () {
                if (
                    this.lineNodeList.length === this.lineCheckList.length &&
                    this.lineCheckList.length > 0
                ) {
                    this.getLineValue = true;
                } else {
                    this.getLineValue = false;
                }
            },
            allGroupSelect (type) {
                if (type === '1') {
                    if (
                        this.deviceLIstOne.length === this.checkAllGroups.length &&
                        this.deviceLIstOne
                    ) {
                        this.airSwitch = true;
                    } else {
                        this.airSwitch = false;
                    }
                } else if (type === '2') {
                    if (
                        this.deviceLIstTwo.length === this.checkAllGroupTwo.length &&
                        this.deviceLIstTwo
                    ) {
                        this.fireSwitch = true;
                    } else {
                        this.fireSwitch = false;
                    }
                } else if (type === '3') {
                    if (
                        this.deviceLIstThree.length === this.checkAllGroupThree.length &&
                        this.deviceLIstThree
                    ) {
                        this.waterSwitch = true;
                    } else {
                        this.waterSwitch = false;
                    }
                } else if (type === '4') {
                    if (
                        this.deviceLIstFour.length === this.checkAllGroupFour.length &&
                        this.deviceLIstFour
                    ) {
                        this.smokeSwitch = true;
                    } else {
                        this.smokeSwitch = false;
                    }
                } else if (type === '5') {
                    if (
                        this.deviceLIstFive.length === this.checkAllGroupFive.length &&
                        this.deviceLIstFive
                    ) {
                        this.LoRASwitch = true;
                    } else {
                        this.LoRASwitch = false;
                    }
                } else if (type === '6') {
                    if (
                        this.deviceLIstSix.length === this.checkAllGroupSix.length &&
                        this.deviceLIstSix
                    ) {
                        this.tempraureSwitch = true;
                    } else {
                        this.tempraureSwitch = false;
                    }
                } else if (type === '7') {
                    if (
                        this.deviceLIstSeven.length === this.checkAllGroupSeven.length &&
                        this.deviceLIstSeven
                    ) {
                        this.eletricSwitch = true;
                    } else {
                        this.eletricSwitch = false;
                    }
                } else if (type === '8') {
                    if (
                        this.deviceLIstEight.length === this.checkAllGroupEight.length &&
                        this.deviceLIstEight
                    ) {
                        this.lastSwitch = true;
                    } else {
                        this.lastSwitch = false;
                    }
                }
            },
            getLoadlistValue () {
                // 负载列表
                let parmars = {
                    projectCode: this.$store.state.projectCode,
                    pageNo: this.loadPageNo,
                    pageSize: this.loadPageSize
                };
                queryList(parmars)
                    .then((res) => {
                        if (res.success) {
                            this.loadList = res.datas;
                            this.loadtotal = res.total;
                            console.log(this.loadList, '======res.datas');
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
            handleCurrentChange (val) {
                this.loadPageNo = val;
                this.getLoadlistValue();
            },
            handleSizeChange (val) {
                this.loadPageSize = val;
                this.getLoadlistValue();
            },
            getNumberValue (val) {
                let reg = /^[0-9]+(.[0-9]{2})?$/;
                if (reg.test(val) === false) {
                    this.$Message.error({
                        content: '请输入正确数字'
                    });
                }
            },
            getTelValue (val) {
                let telReg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (telReg.test(val) === false) {
                    this.$Message.error({
                        content: '请输入正确电话号码'
                    });
                }
            },
            addGroupList () {
                if (!this.groupingTypeValue) {
                    this.$Message.error({
                        content: '分组类型不能为空'
                    });
                    return false;
                }
                let params;
                if (this.modalTitlte === '新增列表数据') {
                    params = {
                        projectCode: this.$store.state.projectCode,
                        type: this.groupingTypeValue,
                        description: this.groupingdecritionValue,
                        status: this.groupingStatus ? 1 : 0
                    };
                } else {
                    params = {
                        projectCode: this.$store.state.projectCode,
                        type: this.groupingTypeValue,
                        description: this.groupingdecritionValue,
                        status: this.groupingStatus ? 1 : 0,
                        id: this.id
                    };
                }

                saveBoxGroup(params)
                    .then((res) => {
                        if (res.success) {
                            this.cancelmodalFlag();
                            this.init();
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
            cancelmodalFlag () {
                this.modalFlag = false;
                this.groupingTypeValue = '';
                this.groupingdecritionValue = '';
                this.groupingStatus = false;
            },
            goNewGroup () {
                this.modalTitlte = '新增列表数据';
                this.modalFlag = true;
            },
            goEditGroup (row) {
                this.groupingTypeValue = row.type;
                this.groupingdecritionValue = row.description;
                this.groupingStatus = row.status === 1;
                this.modalTitlte = '编辑分组数据';
                this.id = row.id;
                this.modalFlag = true;
            },
            deleteGroup (row) {
                delBoxGroup({ groupId: row.id })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.init();
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
            handeleState (row, index) {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    type: row.type,
                    description: row.description,
                    id: row.id,
                    status: row.status === 0 ? 1 : 0
                };
                saveBoxGroup(params)
                    .then((res) => {
                        if (res.success) {
                            this.init();
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
            change (page) {
                this.params.pageNo = page;
                this.init();
            },
            changesize (e) {
                this.params.pageSize = e;
                this.init();
            },
            delBoxGroupNodeList (row) {
                // console.log(row);
                if (row.id) {
                    let params = {
                        nodeId: row.id
                    };
                    delBoxGroupNode(params).then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '删除成功'
                            });
                            let newObj = { id: this.saveGroupId };
                            this.groupManage(newObj);
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error({
                                content: res.message
                            });
                        }
                    });
                } else {
                    this.$Message.error({
                        content: '至少保留一个哦'
                    });
                    return false;
                }
            },
            getTree (tree = []) {
                let arr = [];
                if (!!tree && tree.length !== 0) {
                    tree.forEach((item) => {
                        let obj = {};
                        obj = { ...item, _showChildren: true };
                        // 其他你想要添加的属性
                        obj.children = this.getTree(item.children); // 递归调用
                        arr.push(obj);
                    });
                }
                return arr;
            },
            groupManage (row) {
                this.saveGroupId = row.id;
                let params = { groupId: row.id };
                queryBoxGroupTreeDetail(params)
                    .then((res) => {
                        if (res.success) {
                            if (res.data && res.data.length > 0) {
                                let newArr = res.data.map((item) => ({
                                    ...item,
                                    groupId: row.id,
                                    children: item.children ? item.children : []
                                }));
                                //  _showChildren: true
                                this.newgroupList = this.getTree(newArr);
                            } else {
                                this.newgroupList = [
                                    {
                                        addrNum: 0,
                                        children: [],
                                        deviceNum: 0,
                                        id: '',
                                        loadNum: 0,
                                        name: '',
                                        parentId: 0,
                                        groupId: row.id,
                                        _showChildren: true
                                    }
                                ];
                            }
                            this.groupFlag = false;
                            // console.log(this.newgroupList, ' this.newgroupList');
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
            newTimeFunction (str) {
                if (str) {
                    let newarr = str.split(',');
                    this.timeList = newarr.length > 0 ? newarr.length : 1;
                    let secondList = newarr.map((item) => item.split('-'));
                    return secondList;
                }
            },
            openAttributeFlag (row, index) {
                if (row.id === '') {
                    this.$Message.error({
                        content: '请添加名称'
                    });
                    return false;
                }

                this.attributeManage = row;
                let params = {
                    nodeId: row.id ? row.id : 0
                };
                queryBoxGroupAttributes(params).then((res) => {
                    if (res.success) {
                        // console.log(res, '=====属性管理');
                        let arr = Object.keys(res.data);
                        if (arr.length > 0) {
                            this.attributeFlag = true;
                            // let attribute = {
                            //     area: res.data.area ? res.data.area : '',
                            //     people: res.data.people ? res.data.people : '',
                            //     longitude: res.data.longitude ? res.data.longitude : '',
                            //     latitude: res.data.latitude ? res.data.latitude : '',
                            //     localtionName: res.data.localtionName ? res.data.localtionName : '',
                            //     peopleName: res.data.peopleName ? res.data.peopleName : '',
                            //     dutyJob: res.data.dutyJob ? res.data.dutyJob : '',
                            //     telephoneNum: res.data.telephoneNum ? res.data.telephoneNum : '',
                            //     maxPower: res.data.maxPower ? res.data.maxPower : '',
                            //     maxElectri: res.data.maxElectri ? res.data.maxElectri : ''
                            // };
                            this.attributes.area = res.data.area;
                            this.attributes.people = res.data.people;
                            this.attributes.longitude = res.data.longitude;
                            this.attributes.latitude = res.data.latitude;
                            this.attributes.localtionName = res.data.localtionName;
                            this.attributes.peopleName = res.data.peopleName;
                            this.attributes.dutyJob = res.data.dutyJob;
                            this.attributes.telephoneNum = res.data.telephoneNum;
                            this.attributes.maxPower = res.data.maxPower;
                            this.attributes.maxElectri = res.data.maxElectri;
                            console.log(222222);
                            if (res.data.time !== ' ') {
                                this.timeValue = this.newTimeFunction(res.data.time);
                                this.timeList = this.timeValue && this.timeValue.length;
                            } else {
                                this.timeValue = [[]];
                                this.timeList = 1;
                            }
                        } else {
                            // console.log(11111);
                            this.attributes = {
                                area: '',
                                people: '',
                                longitude: '',
                                latitude: '',
                                localtionName: '',
                                peopleName: '',
                                dutyJob: '',
                                telephoneNum: '',
                                maxPower: '',
                                maxElectri: ''
                            };
                            this.timeValue = [[]];
                            this.timeList = 1;
                            // console.log(11111111122222);
                        }
                        this.attributeFlag = true;
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            addName (val, row) {
                if (!val) {
                    this.$Message.error({
                        content: '请添加名称'
                    });
                    return false;
                } else {
                    row.name = val;
                }
                let params = {
                    groupId: this.saveGroupId,
                    parentId: row.parentId,
                    name: val,
                    id: row.id
                };
                // console.log(params, row, this.newgroupList);
                saveBoxGroupNode(params)
                    .then((res) => {
                        if (res.success) {
                            row.id = res.data;
                            this.$Message.success({
                                content: '保存名字成功'
                            });
                            this.visible = false;
                            let newObj = { id: this.saveGroupId };
                            this.groupManage(newObj);
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
            addGroupChildParent (e, row, index) {
                if (e === '添加本级') {
                    this.handleParentEditList(row, index);
                } else if (e === '添加下级') {
                    this.handleChildEdit(row, index);
                }
            },
            handleParentEditList (row, index) {
                // 添加第一级
                if (row.parentId === 0) {
                    let params = {
                        groupId: row.groupId,
                        parentId: row.parentId,
                        name: ''
                    };

                    saveBoxGroupNode(params).then((res) => {
                        if (res.success) {
                            queryBoxGroupTreeDetail({ groupId: row.groupId })
                                .then((res) => {
                                    if (res.success) {
                                        this.newgroupList = res.data.map((item) => ({
                                            ...item,
                                            groupId: row.groupId,
                                            children: item.children ? item.children : [],
                                            _showChildren: true
                                        }));
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
                        }
                    });
                } else {
                    let params = {
                        groupId: this.saveGroupId,
                        parentId: row.parentId,
                        name: ''
                    };
                    saveBoxGroupNode(params)
                        .then((res) => {
                            if (res.success) {
                                let newObj = { id: this.saveGroupId };
                                this.groupManage(newObj);
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
                }
            },
            handleChildEdit (row, index) {
                let params = {
                    groupId: this.saveGroupId,
                    parentId: row.id,
                    name: ''
                };
                saveBoxGroupNode(params)
                    .then((res) => {
                        if (res.success) {
                            let newObj = { id: this.saveGroupId };
                            this.groupManage(newObj);
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
            tiemFunction (arr) {
                if (arr.length > 0) {
                    let Arr = arr.map(([one, two]) => one + '-' + two);
                    return Arr;
                } else {
                    return [];
                }
            },
            getModalvalue () {
                console.log(this.tiemFunction(this.timeValue));
                let attributes = {
                    ...this.attributes,
                    time:
                        this.timeValue.length > 0
                            ? this.tiemFunction(this.timeValue).join(',')
                            : ''
                };
                console.log(1111111);
                let params = { id: this.attributeManage.id, attributes };
                console.log(params);
                saveBoxGroupAttributes(params).then((res) => {
                    if (res.success) {
                        this.$Message.success({
                            content: res.message
                        });
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            minusList (val) {
                if (val === 'add') {
                    if (this.timeList >= 5) {
                        this.$Message.error('不能再添加了');
                        return false;
                    } else {
                        this.timeList += 1;
                    }
                } else {
                    this.timeList -= 1;
                    this.timeValue.splice(val, 1);
                    if (this.timeList <= 0) {
                        this.timeList = 0;
                        this.timeValue = [];
                    }
                }
            },
            changemapFlag () {
                this.mapFlag = !this.mapFlag;
            },
            getLongitudes (val) {
                // console.log(val, '====getLongitudes');
                this.attributes.longitude = val[0];
                this.attributes.latitude = val[1];
            },
            getLocaltion (val) {
                if (!val) {
                    this.$Message.error('请再次点击地图获取位置');
                } else {
                    this.attributes.localtionName =
                        val.province +
                        val.city +
                        val.district +
                        val.street +
                        val.streetNumber;
                }
            },
            addDeviceModal (row) {
                if (row.id === '') {
                    this.$Message.error({
                        content: '请添加名称'
                    });
                    return false;
                }
                this.addDeviceFlag = true;
                this.deviceValue = row;
                let params = { nodeId: row.id };
                listBoxGroupDevices(params)
                    .then((res) => {
                        if (res.success) {
                            // console.log(res, '=======res');
                            if (res.data.length > 0) {
                                // ======================
                                let checkList = [];
                                for (let i = 0; i < this.deviceLIstOne.length; i++) {
                                    checkList[i] = res.data.filter(
                                        (item) => item.mac === this.deviceLIstOne[i].mac
                                    );
                                }
                                let newcheckList = checkList.filter((item) => item.length > 0);
                                let cheeclist = newcheckList.map(([item]) => ({ ...item }));
                                this.checkAllGroups = cheeclist.map((item) => item.mac);
                                if (
                                    this.checkAllGroups.length === this.deviceLIstOne.length &&
                                    this.deviceLIstOne.length > 0
                                ) {
                                    this.airSwitch = true;
                                } else {
                                    this.airSwitch = false;
                                }
                                // =======================================
                                let checkTwo = [];
                                for (let i = 0; i < this.deviceLIstTwo.length; i++) {
                                    checkTwo[i] = res.data.filter(
                                        (item) => item.mac === this.deviceLIstTwo[i].mac
                                    );
                                }
                                let newCheckTwo = checkTwo.filter((item) => item.length > 0);
                                let listCheckTwo = newCheckTwo.map(([item]) => ({ ...item }));
                                this.checkAllGroupTwo = listCheckTwo.map((item) => item.mac);
                                if (
                                    this.checkAllGroupTwo.length === this.deviceLIstTwo.length &&
                                    this.deviceLIstTwo.length > 0
                                ) {
                                    this.airSwitch = true;
                                } else {
                                    this.airSwitch = false;
                                }
                                // console.log(checkList, '=====checkList');
                                // ======================================================
                                let checkThree = [];
                                for (let i = 0; i < this.deviceLIstThree.length; i++) {
                                    checkThree[i] = res.data.filter(
                                        (item) => item.mac === this.deviceLIstThree[i].mac
                                    );
                                }
                                let newCheckThree = checkThree.filter((item) => item.length > 0);
                                let listCheckThree = newCheckThree.map(([item]) => ({ ...item }));
                                this.checkAllGroupThree = listCheckThree.map((item) => item.mac);
                                if (
                                    this.checkAllGroupThree.length ===
                                    this.deviceLIstThree.length &&
                                    this.deviceLIstThree.length > 0
                                ) {
                                    this.airSwitch = true;
                                } else {
                                    this.airSwitch = false;
                                }
                                // ======================================================
                                let checkFour = [];
                                for (let i = 0; i < this.deviceLIstFour.length; i++) {
                                    checkFour[i] = res.data.filter(
                                        (item) => item.mac === this.deviceLIstFour[i].mac
                                    );
                                }
                                let newcheckFour = checkFour.filter((item) => item.length > 0);
                                let listcheckFour = newcheckFour.map(([item]) => ({ ...item }));
                                this.checkAllGroupFour = listcheckFour.map((item) => item.mac);
                                if (
                                    this.checkAllGroupFour.length === this.deviceLIstFour.length &&
                                    this.deviceLIstFour.length > 0
                                ) {
                                    this.airSwitch = true;
                                } else {
                                    this.airSwitch = false;
                                }
                                // ======================================================
                                let checkFive = [];
                                for (let i = 0; i < this.deviceLIstFive.length; i++) {
                                    checkFive[i] = res.data.filter(
                                        (item) => item.mac === this.deviceLIstFive[i].mac
                                    );
                                }
                                let newCheckFive = checkFive.filter((item) => item.length > 0);
                                let listcheckFive = newCheckFive.map(([item]) => ({ ...item }));
                                this.checkAllGroupFive = listcheckFive.map((item) => item.mac);
                                if (
                                    this.checkAllGroupFive.length === this.deviceLIstFive.length &&
                                    this.deviceLIstFive.length > 0
                                ) {
                                    this.airSwitch = true;
                                } else {
                                    this.airSwitch = false;
                                }
                                // ======================================================
                                let checkSix = [];
                                for (let i = 0; i < this.deviceLIstSix.length; i++) {
                                    checkSix[i] = res.data.filter(
                                        (item) => item.mac === this.deviceLIstSix[i].mac
                                    );
                                }
                                let newCheckSix = checkSix.filter((item) => item.length > 0);
                                let listcheckSix = newCheckSix.map(([item]) => ({ ...item }));
                                this.checkAllGroupSix = listcheckSix.map((item) => item.mac);
                                if (
                                    this.checkAllGroupSix.length === this.deviceLIstSix.length &&
                                    this.deviceLIstSix.length > 0
                                ) {
                                    this.airSwitch = true;
                                } else {
                                    this.airSwitch = false;
                                }
                                // ======================================================
                                let checkSeven = [];
                                for (let i = 0; i < this.deviceLIstSeven.length; i++) {
                                    checkSeven[i] = res.data.filter(
                                        (item) => item.mac === this.deviceLIstSeven[i].mac
                                    );
                                }
                                let newCheckSeven = checkSeven.filter((item) => item.length > 0);
                                let listcheckSeven = newCheckSeven.map(([item]) => ({ ...item }));
                                this.checkAllGroupSeven = listcheckSeven.map((item) => item.mac);
                                if (
                                    this.checkAllGroupSeven.length ===
                                    this.deviceLIstSeven.length &&
                                    this.deviceLIstSeven.length > 0
                                ) {
                                    this.airSwitch = true;
                                } else {
                                    this.airSwitch = false;
                                }
                                // ======================================================
                                let checkEight = [];
                                for (let i = 0; i < this.deviceLIstEight.length; i++) {
                                    checkEight[i] = res.data.filter(
                                        (item) => item.mac === this.deviceLIstEight[i].mac
                                    );
                                }
                                let newCheckEight = checkEight.filter((item) => item.length > 0);
                                let listcheckEight = newCheckEight.map(([item]) => ({ ...item }));
                                this.checkAllGroupEight = listcheckEight.map((item) => item.mac);
                                if (
                                    this.checkAllGroupEight.length ===
                                    this.deviceLIstEight.length &&
                                    this.deviceLIstEight.length > 0
                                ) {
                                    this.airSwitch = true;
                                } else {
                                    this.airSwitch = false;
                                }
                            } else {
                                this.checkAllGroups = [];
                                this.checkAllGroupTwo = [];
                                this.checkAllGroupThree = [];
                                this.checkAllGroupFour = [];
                                this.checkAllGroupFive = [];
                                this.checkAllGroupSix = [];
                                this.checkAllGroupSeven = [];
                                this.checkAllGroupEight = [];
                            }
                            this.deviceNodeList = res.data;
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
            saveSelectDevice (val) {
                let getNewDeviceList = this.checkAllGroups.concat(
                    this.checkAllGroupTwo,
                    this.checkAllGroupThree,
                    this.checkAllGroupFour,
                    this.checkAllGroupFive,
                    this.checkAllGroupSix,
                    this.checkAllGroupSeven,
                    this.checkAllGroupEight
                );
                let NewDeviceList = Array.from(new Set(getNewDeviceList));
                let devices = NewDeviceList.map((item) => ({
                    mac: item,
                    addr: '',
                    resId: ''
                }));
                for (let i = 0; i < devices.length; i++) {
                    for (let j = 0; j < this.deviceNodeList.length; j++) {
                        if (devices[i].mac === this.deviceNodeList[j].mac) {
                            devices[i] = this.deviceNodeList[j];
                        }
                    }
                }
                let params = {
                    id: this.deviceValue.id,
                    devices
                };
                // console.log(params, 222222222222);
                saveBoxGroupDevices(params)
                    .then((res) => {
                        if (res.success) {
                            if (val === 'line') {
                            } else {
                                this.$Message.success({
                                    content: res.message
                                });
                                this.addDeviceFlag = false;
                                let newObj = { id: this.saveGroupId };
                                this.groupManage(newObj);
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
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
                // console.log(NewDeviceList, params);
            },
            openLineMdoal () {
                let getNewDeviceList = this.checkAllGroups.concat(
                    this.checkAllGroupTwo,
                    this.checkAllGroupThree,
                    this.checkAllGroupFour,
                    this.checkAllGroupFive,
                    this.checkAllGroupSix,
                    this.checkAllGroupSeven,
                    this.checkAllGroupEight
                );
                let NewDeviceList = Array.from(new Set(getNewDeviceList));
                let newLIst = NewDeviceList.map((item) => ({
                    mac: item,
                    addr: '',
                    resId: ''
                }));
                for (let i = 0; i < newLIst.length; i++) {
                    for (let j = 0; j < this.deviceNodeList.length; j++) {
                        if (newLIst[i].mac === this.deviceNodeList[j].mac) {
                            newLIst[i] = this.deviceNodeList[j];
                        }
                    }
                }
                this.DeviceLists = newLIst;
                this.addDeviceLineFlag = true;
            },
            addLinesList (val) {
                this.lineLIstFlag = true;
                this.macValue = val;
                let params = {
                    mac: val.mac
                };
                queryChannels(params)
                    .then((res) => {
                        if (res.success) {
                            // console.log(res, '====线路表');
                            this.lineNodeList = res.datas.map((item) => ({
                                addr: item.addr,
                                title: item.title
                            }));
                            if (val.addrs) {
                                this.lineCheckList = val.addrs;
                                if (
                                    this.lineCheckList.length === this.lineNodeList.length &&
                                    this.lineCheckList
                                ) {
                                    this.getLineValue = true;
                                } else {
                                    this.getLineValue = false;
                                }
                            } else {
                                this.lineCheckList = [];
                                this.getLineValue = false;
                            }
                            let newObj = { id: this.saveGroupId };
                            this.groupManage(newObj);
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
            saveLineGroup () {
                let arr = [];
                let newdevices =
                    this.DeviceLists &&
                    this.DeviceLists.map((item) => {
                        if (item.mac === this.macValue.mac && this.lineCheckList) {
                            item.addrs = this.lineCheckList;
                        }
                        if (item.resId) {
                            delete item.resId;
                        }
                        arr.push(item);
                        return arr;
                });
                //  console.log(this.lineCheckList, '=======this.lineCheckList');
                let devices = Array.from(new Set(newdevices));
                this.DeviceLists = devices[0];
                console.log(this.DeviceLists, '===== this.DeviceLists');
                let params = {
                    id: this.deviceValue.id,
                    devices: devices[0]
                };
                saveBoxGroupDevices(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
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
                // console.log(params, '======this.lineCheckList');
            },
            addNodesLine (val) {
                if (val.id === '') {
                    this.$Message.error({
                        content: '请添加名称'
                    });
                    return false;
                }
                this.deviceValue = val;
                let param = { nodeId: val.id };
                listBoxGroupDevices(param).then((res) => {
                    if (res.success) {
                        // console.log(res, '======查询分组节点设备线路');
                        this.DeviceLists = res.data;
                        this.addDeviceLineFlag = true;
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            addNodeLoad (val) {
                if (val.id === '') {
                    this.$Message.error({
                        content: '请添加名称'
                    });
                    return false;
                }
                this.loadModalFlag = true;
                this.nodeTableRow = val;
                let params = {
                    nodeId: val.id
                };
                listBoxGroupLoads(params).then((res) => {
                    if (res.success) {
                        if (res.data.length > 0) {
                            let newChecks = res.data.map((item) => [
                                item.loadId + '-' + item.name
                            ]);
                            // console.log(res.data, '=====res.data');
                            let checkNode = newChecks.map((item) => item.join('-'));
                            this.checkLoad = checkNode;
                            // console.log(this.checkLoad, this.loadList);
                        } else {
                            this.checkLoad = [];
                        }
                    }
                });
            },
            addLoadDevice () {
                let newcheckLoad =
                    this.checkLoad && this.checkLoad.map((item) => item.split('-'));
                // console.log(this.checkLoad, newcheckLoad, '======checkLoad');
                let loads = newcheckLoad.map(([a, b]) => ({ loadId: a, name: b }));
                let params = {
                    id: this.nodeTableRow.id,
                    loads
                };
                console.log(newcheckLoad);
                saveBoxGroupLoads(params).then((res) => {
                    if (res.success) {
                        this.$Message.success({
                            content: res.message
                        });
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            getAllDeviceValue (val, list, type) {
                if (type === '1') {
                    if (val) {
                        this.checkAllGroups = list.map((item) => item.mac);
                        this.airSwitch = true;
                    } else {
                        this.checkAllGroups = [];
                        this.airSwitch = false;
                    }
                } else if (type === '2') {
                    if (val) {
                        this.checkAllGroupTwo = list.map((item) => item.mac);
                        this.fireSwitch = true;
                    } else {
                        this.checkAllGroupTwo = [];
                        this.fireSwitch = false;
                    }
                } else if (type === '3') {
                    if (val) {
                        this.checkAllGroupThree = list.map((item) => item.mac);
                        this.waterSwitch = true;
                    } else {
                        this.checkAllGroupThree = [];
                        this.waterSwitch = false;
                    }
                } else if (type === '4') {
                    if (val) {
                        this.checkAllGroupFour = list.map((item) => item.mac);
                        this.smokeSwitch = true;
                    } else {
                        this.checkAllGroupFour = [];
                        this.smokeSwitch = false;
                    }
                } else if (type === '5') {
                    if (val) {
                        this.checkAllGroupFive = list.map((item) => item.mac);
                        this.LoRASwitch = true;
                    } else {
                        this.checkAllGroupFive = [];
                        this.LoRASwitch = false;
                    }
                } else if (type === '6') {
                    if (val) {
                        this.checkAllGroupSix = list.map((item) => item.mac);
                        this.tempraureSwitch = true;
                    } else {
                        this.checkAllGroupSix = [];
                        this.tempraureSwitch = false;
                    }
                } else if (type === '7') {
                    if (val) {
                        this.checkAllGroupSeven = list.map((item) => item.mac);
                        this.eletricSwitch = true;
                    } else {
                        this.checkAllGroupSeven = [];
                        this.eletricSwitch = false;
                    }
                } else if (type === '8') {
                    if (val) {
                        this.checkAllGroupEight = list.map((item) => item.mac);
                        this.lastSwitch = true;
                    } else {
                        this.checkAllGroupEight = [];
                        this.lastSwitch = false;
                    }
                }
            },
            getAllLineValue (val, list) {
                if (val) {
                    this.lineCheckList = list.map((item) => item.addr);
                    this.getLineValue = true;
                } else {
                    this.lineCheckList = [];
                    this.getLineValue = false;
                }
            },
            getAllLoadList (val, list) {
                if (val) {
                    //  console.log(list);
                    this.checkLoad = list.map((item) => item.id + '-' + item.name);
                    this.getLoadValue = true;
                } else {
                    this.checkLoad = [];
                    this.getLoadValue = false;
                }
            }
        },
        created () {
            this.init();
            this.getLoadlistValue();
        }
    };
</script>

<style lang="less" scoped>
.i-layout-content-main {
  width: 97%;
  height: 100%;
  position: relative;
}
/deep/ .ivu-table-cell-tree + .ivu-table-cell-slot {
  display: inline-block;
  width: 250px !important;
}

.header-groupConfig {
  width: 100%;
  height: 36px;
  padding: 0px;
  // padding-bottom: 0px;
  h2 {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    // margin-top: 15px;
    color: #ffffff;
    float: left;
    // margin-top: 36px;
  }
  button {
    width: 60px;
    height: 32px;
    color: #fff;
    cursor: pointer;
    border: 1px solid #007eff;
    border-radius: 5px;
    background: #007eff;
    float: right;
    // margin-top: 36px;
    // margin-bottom: 20px;
    // line-height:36px;
  }
}
.ivu-message {
  top: 40% !important;
  left: 5%;
}
</style>
