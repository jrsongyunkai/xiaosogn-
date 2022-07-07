<template>
  <div id="NewGrouping">
    <div
      style="
        margin-top: 10px;
        background: #1a202e;
        padding: 20px;
        height: 750px;
      "
    >
      <div class="title" style="min-width: 1000px">
        <h2 class="titleNew">{{ title }}</h2>
        <div class="search">
          <Input
            v-model="value1"
            placeholder="输入分组类型"
            style="width: 200px"
            :disabled="isdisa"
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Input
            placeholder="输入分组描述"
            style="width: 200px"
            v-model="value2"
            :disabled="isdisa"
          ></Input>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>状态<i>*</i>：</span>
          <Switch v-model="status" :disabled="isdisa">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </Switch>
        </div>
      </div>
      <Table
        class="newgroupTable"
        :columns="columns"
        :data="data"
        row-key="id"
        :indent-size="16"
        height="520"
      >
        <template slot-scope="{ row, index }" slot="name">
          <div style="width: 280px; position: relative; left: 15px; top: -10px">
            <br />
            <span
              :style="
                row.num === 1
                  ? 'float:left;color:#fff;text-align:center;margin:2px;'
                  : 'float:left;color:#fff;text-align:center;margin:2px;margin-top: -22px;margin-left:' +
                    (10 + row.num * 15) +
                    'px'
              "
              >[{{ row.num }}]</span
            >
            <Input
              type="text"
              :style="
                row.num === 1
                  ? 'float:left;width:139px;'
                  : 'float:left;width:139px;margin-top:-25px'
              "
              v-model="row.name"
              :value="20 + row.num * 2"
              :disabled="isdisa"
              @on-enter="enter(row, index, 0)"
              @on-blur="enter(row, index, 0)"
            ></Input>
          </div>
        </template>

        <template slot-scope="{ row, index }" slot="counts">
          <span
            style="cursor: pointer; margin-left: 20px"
            @click="selectEquip(row, index)"
            >{{ row.devices ? row.devices.length : 0 }}</span
          >
        </template>
        <!-- 绑定线路数量和负载数量待完成 -->
        <template slot-scope="{ row }" slot="longitude">
          <span style="cursor: pointer; margin-left: 20px">{{
            row.lineNum
          }}</span>
        </template>

        <template slot-scope="{ row }" slot="latitude">
          <span style="cursor: pointer; margin-left: 20px">{{
            row.loadNum
          }}</span>
        </template>

        <!-- <slot name="floor"></slot> -->

        <template slot-scope="{ row, index }" slot="action">
          <div>
            <Dropdown @on-click="addLv($event, row, index)">
              <Button
                class="edit"
                type="text"
                size="small"
                style="margin-right: 5px; color: #007eff"
                :disabled="isdisa"
              >
                添加分组
              </Button>
              <DropdownMenu slot="list">
                <!-- <DropdownItem name = '添加上级'>添加上级</DropdownItem> -->
                <DropdownItem name="添加本级" :disabled="isdisa"
                  >添加本级</DropdownItem
                >
                <DropdownItem name="添加下级" :disabled="isdisa"
                  >添加下级</DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
            <Button
              class="choose"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              @click="openAttributeFlag"
              >属性管理</Button
            >
            <Button
              class="choose"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              @click="selectEquip(row, index)"
              :disabled="isdisa"
              >添加设备</Button
            >
            <Button
              class="choose"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              >添加线路</Button
            >
            <Button
              class="choose"
              type="text"
              size="small"
              style="margin-right: 5px; color: #007eff"
              >添加负载</Button
            >
            <Poptip
              class="newgroupPoptip"
              confirm
              title="确定删除分组吗?"
              placement="left"
              @on-ok="cancel(row.id, index)"
              ok-text="删除"
              cancel-text="取消"
            >
              <Button
                class="delete"
                type="text"
                size="small"
                style="margin-right: 5px; color: #e03c3a"
                :disabled="isdisa"
                >删除分组</Button
              >
            </Poptip>
            <Modal
              v-model="details"
              :mask="false"
              @on-ok="finish"
              width="650px"
              class-name
              title="选择设备"
            >
              <br />
              <Transfer
                :data="data3"
                :target-keys="targetKeys3"
                :list-style="listStyle"
                :render-format="render3"
                :operations="['去除', '添加']"
                :titles="['所有设备', '我的设备']"
                filterable
                @on-change="handleChange3"
              >
                <div :style="{ float: 'right', margin: '5px' }">
                  <Button size="small" @click="reloadMockData">重置</Button>
                </div>
              </Transfer>
            </Modal>
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
                    v-model="attributes.area"
                    style="width: 200px"
                    placeholder="请输入"
                  >
                  </Input>
                  (平方)
                </FormItem>
                <FormItem label="人数">
                  <Input
                    v-model.number="attributes.num"
                    type="number"
                    size="small"
                    style="width: 200px"
                    on-keypress="return(/^[0-9]*$/.test(String.fromCharCode(event.keyCode)))"
                    placeholder="请输入"
                  >
                  </Input>
                  (人)
                </FormItem>
                <FormItem label="经纬度">
                  <Input
                    v-model.number="attributes.latitude"
                    type="number"
                    size="small"
                    style="width: 200px"
                    placeholder="请输入经度"
                  >
                  </Input>
                  <Input
                    v-model.number="attributes.altitude"
                    type="number"
                    size="small"
                    style="width: 200px; margin-left: 10px"
                    placeholder="请输入纬度"
                  >
                  </Input>
                  <Button
                    type="primary"
                    style="margin-left: 10px"
                    size="small"
                    @click="changemapFlag"
                    >地图标点</Button
                  >
                </FormItem>
                <FormItem label="位置名称">
                  <Input
                    v-model="attributes.localtionName"
                    size="small"
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
                <div
                  style="border-top: 1px solid #303542; margin-top: 5px"
                ></div>
                <FormItem label="姓名">
                  <Input
                    v-model="attributes.peopleName"
                    size="small"
                    style="width: 300px"
                    placeholder="请输入"
                  >
                  </Input>
                </FormItem>
                <FormItem label="职务">
                  <Input
                    v-model="attributes.dutyJob"
                    size="small"
                    style="width: 300px"
                    placeholder="请输入"
                  >
                  </Input>
                </FormItem>
                <FormItem label="联系电话">
                  <Input
                    v-model="attributes.telephoneNum"
                    size="small"
                    style="width: 300px"
                    placeholder="请输入"
                  >
                  </Input>
                </FormItem>
                <h3 style="margin-top: 20px">用电设置</h3>
                <div
                  style="border-top: 1px solid #303542; margin-top: 5px"
                ></div>
                <FormItem label="最大功率">
                  <Input
                    v-model="attributes.maxPower"
                    type="number"
                    size="small"
                    style="width: 300px"
                    placeholder="请输入"
                  >
                  </Input>
                  (KW)
                </FormItem>
                <FormItem label="最大用电量">
                  <Input
                    v-model="attributes.maxElectri"
                    type="number"
                    size="small"
                    style="width: 300px"
                    placeholder="请输入"
                  >
                  </Input>
                  (KWh)
                </FormItem>
                <FormItem label="用电时段">
                  <div>
                    <TimePicker
                      v-model="attributes.usePowerTime"
                      transfer
                      format="HH:mm"
                      type="timerange"
                      placement="bottom-end"
                      placeholder="选择时间"
                      style="width: 168px"
                    ></TimePicker>
                  </div>
                  <div
                    v-for="(item, index) in timeList"
                    :key="item"
                    style="margin-top: 3px"
                  >
                    <TimePicker
                      transfer
                      v-model="timeValue[index]"
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
                        @click="minusList"
                    /></span>
                  </div>
                  <Button
                    style="margin-top: 5px"
                    type="primary"
                    @click="minusList('add')"
                    >+ 添加时段</Button
                  >
                </FormItem>
              </Form>
            </Modal>
          </div>
        </template>
      </Table>
    </div>
    <div class="header-grou" style="margin-top: 1px; background: #1a202e">
      <Button class="complete" @click="success" :disabled="isdisa">保存</Button>
      <Button class="deletes" v-if="isdisa" @click="back">取消</Button>
      <Poptip
        v-else
        confirm
        title="取消后，数据将会丢失，确定取消保存分组?"
        placement="left"
        @on-cancel="back"
        ok-text="取消"
        cancel-text="确定"
      >
        <Button class="delete">取消</Button>
      </Poptip>
    </div>
  </div>
</template>

<script>
    import '@/styles/pages/newGrouping.less';
    import { groupingList, tree } from '@/api/safetyMonitor/public';
    import {
        equipmentList,
        editGroupType,
        newGroupType
    } from '@/api/multiManage/groupConfig.js';

    import echartsMap from './latitudeMap.vue';
    export default {
        components: { echartsMap },
        data () {
            return {
                timeValue: [],
                timeList: 1,
                mapFlag: false,
                attributes: {
                    num: '',
                    latitude: '',
                    altitude: '',
                    localtionName: '',
                    peopleName: '',
                    dutyJob: '',
                    telephoneNum: '',
                    maxPower: '',
                    maxElectri: '',
                    usePowerTime: ''
                },
                attributeFlag: false,
                value1: '',
                value2: '',
                type: '',
                describe: '',
                details: false, // 选择设备弹窗
                value: '',
                equiplist: [],
                fruit: [],
                columns: [
                    {
                        title: '分组名称',
                        slot: 'name',
                        width: 330,
                        tree: true,
                        display: 'inline'
                    },
                    {
                        title: '绑定设备数量',
                        slot: 'counts',
                        width: 130,
                        display: 'inline'
                    },
                    {
                        title: '绑定线路数量',
                        slot: 'longitude',
                        width: 200,
                        display: 'inline'
                    },
                    {
                        title: '绑定负载数量',
                        slot: 'latitude',
                        width: 200,
                        display: 'inline'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        align: 'center',
                        display: 'inline'
                    }
                ],
                data: [],
                arr: [],
                editIndex: -1, // 当前聚焦的输入框的行数
                edittype: '', // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
                editdescribe: '', // 第二列输入框
                data3: [],
                targetKeys3: [],
                listStyle: {
                    width: '250px',
                    height: '300px'
                },
                parmars: {},
                model1: '',
                model2: '',
                cityList1: [],
                cityList2: [],
                status: true,
                device: [],
                id: '',
                index: '',
                projectCode: '',
                label: '',
                models: '',
                isdisa: false
            };
        },
        methods: {
            getModalvalue () {
                console.log(this.timeValue, '====timeValue');
            },
            minusList (val) {
                console.log(11111111111);
                if (val === 'add') {
                    this.timeList++;
                } else {
                    this.timeList -= 1;
                    if (this.timeList <= 0) {
                        this.timeList = 0;
                    }
                }
                if (this.timeList > 10) {
                    this.$Message.error('不能再添加了');
                }
            },
            getLongitudes (val) {
                // console.log(val, '====getLongitudes');
                this.attributes.latitude = val[0];
                this.attributes.altitude = val[1];
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
            changemapFlag () {
                this.mapFlag = !this.mapFlag;
            },
            openAttributeFlag () {
                this.attributeFlag = true;
            },
            selectEquip (row, index) {
                this.targetKeys3 = [];
                this.id = row.id;
                this.index = index;
                row.devices.forEach((item) => {
                    this.targetKeys3.push(item.mac);
                });

                this.devices = JSON.parse(JSON.stringify(this.targetKeys3)); // 用于重置

                if (
                    this.data3.length > 0 &&
                    this.projectCode === this.$store.state.projectCode
                ) {
                    this.details = true;
                } else {
                    equipmentList({
                        projectCode: this.$store.state.projectCode,
                        key: ''
                    }).then((res) => {
                        this.projectCode = this.$store.state.projectCode;
                        this.data3 = res.data;
                        this.data3.forEach((item, index) => {
                            item.disabled = false;
                            item.key = item.mac.toString();
                            item.label = item.mac + item.equipmentTypeDesc + item.name;
                        });
                        this.details = true;
                    });
                }
            },
            finish () {
                let arrs = [];
                this.targetKeys3.forEach((item) => {
                    this.data3.forEach((items) => {
                        if (item === items.key) {
                            arrs.push({
                                mac: items.mac,
                                id: items.resId
                            });
                        }
                    });
                });

                let index = this.index;
                function sys (id, arr) {
                    let flag = false;
                    arr.forEach((item) => {
                        if (item.id === id) {
                            flag = true;
                        }
                    });

                    if (flag) {
                        arr[index].devices = arrs;
                    } else {
                        arr.forEach((item) => {
                            sys(id, item.children);
                        });
                    }
                }
                sys(this.id, this.data);
            },
            success () {
                // window.location.href = 'https://v3.sndtest.com/#/Home'
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.handleSumbit();
                    } else {
                        this.$Message.error({
                            content: '表单验证失败！'
                        });
                        return false;
                    }
                });
            },
            handleSumbit () {
                function sys (arr) {
                    arr.forEach((item) => {
                        if (item.attributes[0]) {
                            item.attributes[0] = {
                                attributeName: 'area',
                                attributeValue: item.area
                            };
                        } else {
                            item.attributes.push({
                                attributeName: 'area',
                                attributeValue: item.area
                            });
                        }
                        if (item.attributes[1]) {
                            item.attributes[1] = {
                                attributeName: 'people',
                                attributeValue: item.people
                            };
                        } else {
                            item.attributes.push({
                                attributeName: 'people',
                                attributeValue: item.people
                            });
                        }
                        if (item.attributes[2]) {
                            item.attributes[2] = {
                                attributeName: 'longitude',
                                attributeValue: item.longitude
                            };
                        } else {
                            item.attributes.push({
                                attributeName: 'longitude',
                                attributeValue: item.longitude
                            });
                        }
                        if (item.attributes[3]) {
                            item.attributes[3] = {
                                attributeName: 'latitude',
                                attributeValue: item.latitude
                            };
                        } else {
                            item.attributes.push({
                                attributeName: 'latitude',
                                attributeValue: item.latitude
                            });
                        }
                        if (item.children.length === 0) return false;
                        else sys(item.children);
                    });
                }
                sys(this.data);

                let that = this;
                let flag = true;
                function isNone (arr) {
                    arr.forEach((item) => {
                        if (item.name === '') {
                            that.$Message.error('您有未填的分组名称');
                            flag = false;
                            return false;
                        } else {
                            if (item.children.length === 0) {
                                // 空数组
                                return false;
                            } else {
                                isNone(item.children);
                            }
                        }
                    });
                }
                isNone(this.data);

                if (flag) {
                    if (this.title === '编辑分组') {
                        this.parmars.projectCode = this.$store.state.projectCode;
                        this.parmars.status = this.status ? 1 : 0;
                        this.parmars.type = this.value1 === '' ? '暂无' : this.value1;
                        this.parmars.description = this.value2 === '' ? '暂无' : this.value2;
                        this.parmars.nodes = JSON.stringify(this.data);
                        editGroupType(this.parmars).then((res) => {
                            if (res.code === '0') {
                                this.$Message.success('保存成功');
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.data = [];
                            this.$emit('cancel', true);
                        });
                    } else {
                        let param = {
                            projectCode: this.$store.state.projectCode,
                            type: this.value1 === '' ? '暂无' : this.value1,
                            description: this.value2 === '' ? '暂无' : this.value2,
                            status: this.status ? 1 : 0,
                            nodes: JSON.stringify(this.data)
                        };
                        //
                        newGroupType(param).then((res) => {
                            if (res.success) {
                                this.$Message.success(res.message);
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.data = [];
                            this.$emit('cancel', true);
                        });
                    }
                }
            },
            back () {
                this.data = [];
                this.$emit('cancel', true);
            },
            cancel (id, index) {
                if (this.data.length === 1 && id === this.data[0].id) {
                    // 当前是第一级，不能删除
                    this.$Message.error('不能继续删除啦');
                    return false;
                }
                function sys (id, arr, father) {
                    let flag = false;
                    let i = 0;
                    arr.forEach((item) => {
                        //
                        if (item.id === id) {
                            //
                            flag = true;
                            i++;
                        }
                    });
                    if (flag) {
                        //
                        if (i === 1) {
                            // 说明是第一级
                            arr.splice(index, 1);
                        } else {
                            father.children.splice(index, 1);
                        }
                    } else {
                        // 否则就不是这一级，然后一直往下面找
                        arr.forEach((item) => {
                            sys(id, item.children, item);
                        });
                    }
                }

                sys(id, this.data);
            },
            ok () {
                this.$Message.info('Clicked ok');
            },
            enter (row, index, key) {
                let arr = ['name', 'area', 'people', 'longitude', 'latitude'];
                function sys (id, arr, keys) {
                    let flag = false;
                    arr.forEach((item) => {
                        //
                        if (item.id === id) {
                            //
                            flag = true;
                        }
                    });
                    if (flag) {
                        //
                        arr[index][keys] = row[keys];
                    } else {
                        // 否则就不是这一级，然后一直往下面找
                        arr.forEach((item) => {
                            sys(id, item.children, keys);
                        });
                    }
                }
                sys(row.id, this.data, arr[key]);
            },
            handleEdit (row, index) {
                // 添加下级
                if (row.num === 7) {
                    this.$Message.error('最多只能添加7级分组');
                    return false;
                }
                function sys (id, arr) {
                    let flag = false;
                    arr.forEach((item) => {
                        //
                        if (item.id === id) {
                            //
                            flag = true;
                        }
                    });

                    if (flag) {
                        if (!arr[index].children) arr[index].children = [];
                        arr[index].children.push({
                            id: Math.random(),
                            name: '',
                            _showChildren: true,
                            attributes: [
                                {
                                    attributeValue: ''
                                },
                                {
                                    attributeValue: ''
                                },
                                {
                                    attributeValue: ''
                                },
                                {
                                    attributeValue: ''
                                }
                            ],
                            devices: [],
                            children: [],
                            area: '',
                            people: '',
                            longitude: '',
                            latitude: '',
                            num: arr[index].num + 1
                        });
                        //
                    } else {
                        arr.forEach((item) => {
                            sys(id, item.children);
                        });
                        //
                    }
                }

                sys(row.id, this.data);
            },
            handleEdit1 (row, index) {
                // 添加本级
                function sys (id, arr) {
                    let flag = false;
                    arr.forEach((item) => {
                        //
                        if (item.id === id) {
                            //
                            flag = true;
                        }
                    });
                    if (flag) {
                        //
                        // if (!arr[index].children)arr[index].children = []
                        //
                        arr.push({
                            id: Math.random(),
                            name: '',
                            _showChildren: true,
                            attributes: [
                                {
                                    attributeValue: ''
                                },
                                {
                                    attributeValue: ''
                                },
                                {
                                    attributeValue: ''
                                },
                                {
                                    attributeValue: ''
                                }
                            ],
                            devices: [],
                            children: [],
                            area: '',
                            people: '',
                            longitude: '',
                            latitude: '',
                            num: arr[0].num
                        });
                        //
                    } else {
                        arr.forEach((item) => {
                            sys(id, item.children);
                        });
                        //
                    }
                }

                sys(row.id, this.data);
            },
            handleEdit2 (row, index) {
                // 添加上级
                // function sys (id, arr, father) {
                //     let flag = false;
                //     arr.forEach((item) => {
                //         //
                //         if (item.id === id) {
                //             //
                //             flag = true;
                //         }
                //     });
                //     if (flag) {
                //         //
                //         let arrs =
                //             {
                //                 id: Math.random(),
                //                 name: '',
                //                 _showChildren: true,
                //                 attributes: [
                //                     {
                //                         attributeValue: ''
                //                     },
                //                     {
                //                         attributeValue: ''
                //                     },
                //                     {
                //                         attributeValue: ''
                //                     },
                //                     {
                //                         attributeValue: ''
                //                     }
                //                 ],
                //                 devices: [],
                //                 children: arr,
                //                 area: '',
                //                 people: '',
                //                 longitude: '',
                //                 latitude: ''
                //             }
                //         //
                //         if (father) {
                //             father.children.push(arrs)
                //         } else {
                //             // arr.push(arrs)
                //             let arrs = JSON.parse(JSON.stringify([
                //                 {
                //                     id: Math.random(),
                //                     name: '',
                //                     _showChildren: true,
                //                     attributes: [
                //                         {
                //                             attributeValue: ''
                //                         },
                //                         {
                //                             attributeValue: ''
                //                         },
                //                         {
                //                             attributeValue: ''
                //                         },
                //                         {
                //                             attributeValue: ''
                //                         }
                //                     ],
                //                     devices: [],
                //                     children: arr,
                //                     area: '',
                //                     people: '',
                //                     longitude: '',
                //                     latitude: ''
                //                 }
                //             ]))
                //             return arrs
                //         }
                //     } else {
                //         arr.forEach((item) => {
                //             sys(id, item.children, item);
                //         });
                //     }
                // }
                // this.data = sys(row.id, this.data)
                // // sys(row.id, this.data);
                //
            },
            changeTreeNode (arr) {
                {
                    let data = [];
                    arr.map((item) => {
                        let arr = [];
                        arr.push(item);
                        data.push(this.sys(arr));
                    });
                    // 将数组中的多条对象遍历调用递归
                    return data;
                }
            },
            sys (arr) {
                let obj = {};
                arr.map((item, index) => {
                    // 遍历对象里面的数据
                    if (item.name) {
                        obj['name'] = item.name;
                        obj['counts'] = item.counts;
                        obj['_showChildren'] = true;
                        if (item.id) {
                            obj['id'] = item.id;
                        } else {
                            obj['id'] = index + Math.random() + new Date().valueOf();
                        }
                        var newobj = this.sys(item.attributes); // 将自定义属性数组里的值全部取出，重新组合成key：value的形式  走else
                        obj = { ...obj, ...newobj };
                        if (item.children) {
                            let childrenArr = this.changeTreeNode(item.children); // 将children里存放的子节点重新整合 走上面的  if(item.name)
                            obj['children'] = childrenArr;
                        }
                    } else {
                        obj[item.attributeName] = item.attributeValue;
                    }
                });
                return obj;
            },
            handleChange3 (newTargetKeys) {
                this.targetKeys3 = newTargetKeys;
            },
            render3 (item) {
                return item.name;
            },
            reloadMockData () {
                this.targetKeys3 = this.devices;
            },
            try (arr) {
                let data = [];
                //
                function sys (arr, data, Lvnum) {
                    arr.forEach((item) => {
                        let area = '';
                        let people = '';
                        let longitude = '';
                        let latitude = '';
                        if (item.attributes) {
                            item.attributes.length > 0
                                ? (area = item.attributes[0].attributeValue)
                                : (area = '');
                            item.attributes.length > 1
                                ? (people = item.attributes[1].attributeValue)
                                : (people = '');
                            item.attributes.length > 2
                                ? (longitude = item.attributes[2].attributeValue)
                                : (longitude = '');
                            item.attributes.length > 3
                                ? (latitude = item.attributes[3].attributeValue)
                                : (latitude = '');
                        }

                        let arrs = {
                            id: item.id,
                            num: Lvnum,
                            name: item.name,
                            devices: item.devices ? item.devices : [],
                            attributes: item.attributes ? item.attributes : [],
                            children: [],
                            area,
                            people,
                            longitude,
                            latitude,
                            _showChildren: true
                        };
                        data.push(arrs);
                        if (!item.children) item.children = [];
                        if (item.children.length === 0) return false;
                        else {
                            sys(item.children, arrs.children, Lvnum + 1);
                        }
                    });
                }
                // let that = this
                //
                sys(arr, data, 1);

                this.data = data;
                //
            },
            groupingType (e) {
                //
                this.changeType(this.model1);
                this.label = e.label;
            },
            groupingChoise (e) {
                //
                this.cityList2.forEach((item) => {
                    if (item.value === e) {
                        this.models = item.title;
                    }
                });
                //
            },
            changeType (groupId) {
                this.$nextTick(() => {
                    tree({ groupId }).then((res) => {
                        //
                        // 使用递归
                        function sys (arr, parentId) {
                            let data2 = [];
                            if (arr.length !== 0) {
                                // 经过一系列过滤去筛选，如果后面筛选出来的数组为空，就结束递归
                                let pArr = res.data.filter((value) => {
                                    // 筛选出满足条件的
                                    return value.parentId === parentId;
                                });
                                let mArr = arr.filter((value) => {
                                    // 筛选出不满足条件的 剩下的就是之前筛选出来的子集
                                    return value.parentId !== parentId;
                                });
                                pArr.forEach((value, i) => {
                                    let arr = {};
                                    arr.title = value.name;
                                    arr.value = value.id;
                                    arr.children = sys(mArr, value.id);
                                    data2.push(arr);
                                });
                                return data2;
                            } else {
                                return false;
                            }
                        }
                        if (!res.data) {
                            this.cityList2 = [];
                            return false;
                        } else {
                            this.cityList2 = sys(res.data, 0);
                        }
                    });
                });
            },
            getdata () {
                groupingList({ projectCode: this.$store.state.projectCode }).then(
                    (res) => {
                        if (res.data) {
                            this.cityList1 = res.data;
                            for (let i = 0; i < res.data.length; i++) {
                                this.cityList1[i].value = res.data[i].id;
                            }
                        }
                    }
                );
            },
            addLv (e, row, index) {
                if (e === '添加本级') {
                    this.handleEdit1(row, index);
                } else if (e === '添加下级') {
                    this.handleEdit(row, index);
                } else {
                    this.handleEdit2(row, index);
                }
            }
        },
        created () {
            this.getdata();
        },
        props: {
            title: {
                type: String,
                default () {
                    return {};
                }
            },
            datas: {
                type: Array,
                default () {
                    return {};
                }
            },
            values1: {
                type: String,
                default () {
                    return {};
                }
            },
            values2: {
                type: String,
                default () {
                    return {};
                }
            },
            open: {
                type: Boolean,
                default () {
                    return {};
                }
            }
        },
        watch: {
            datas: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.datas = newVal;
                        this.isdisa = newVal[2];

                        if (this.title === '新建分组') {
                            this.try(this.datas);
                        } else {
                            //
                            this.parmars = {
                                id: this.datas[1]
                            };
                            this.try(this.datas[0]);
                        }
                    }
                },
                deep: true
            },
            data: {
                handler (newVal, oldVal) {
                    if (newVal && newVal.length !== 0) {
                        // this.data[0].name = newVal[0].name;
                        if (newVal[0].name === '' && oldVal.length > 0) {
                            // 为了改bug
                            this.data[0].name = oldVal[0].name;
                            this.data[0].people = oldVal[0].people;
                            this.data[0].longitude = oldVal[0].longitude;
                            this.data[0].latitude = oldVal[0].latitude;
                        }
                    }
                },
                deep: true
            },
            values1: {
                handler (newVal, oldVal) {
                    this.value1 = newVal;
                    if (this.value1 === '暂无') this.value1 = '';
                }
            },
            values2: {
                handler (newVal, oldVal) {
                    this.value2 = newVal;
                    if (this.value2 === '暂无') this.value2 = '';
                }
            },
            open: {
                handler (newVal, oldVal) {
                    this.status = newVal;
                }
            }
        }
    };
</script>
<style lang="less">
.header-grou {
  width: 120%;
  height: 50px;
  margin-left: -10%;
  line-height: 50px;
  margin-top: -40px;
  .complete {
    background: #2d8cf0;
    float: right;
    color: #fff;
    margin-right: 180px;
    width: 80px;
    margin-top: 10px;
  }
  .deletes {
    margin-right: 20px;
    width: 80px;
    float: right;
    margin-top: 10px;
  }
  .ivu-poptip.ivu-poptip-confirm {
    float: right;
    .delete {
      margin-right: 20px;
      width: 80px;
    }
  }
}
.ivu-theme-dark .ivu-table-cell-tree {
  float: left;
  margin-right: 5px;
  margin-top: 17px;
}
.ivu-theme-dark .ivu-transfer-list-header {
  background: #1a202e;
}
.title {
  //   margin-left: 20px;
  margin-bottom: 20px;
  .search {
    margin-top: 14px;
    i {
      color: red;
    }
    .typeinput {
      margin-right: 30px;
    }
    .describeinput {
      margin-right: 40px;
    }
  }
  .titleNew {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
