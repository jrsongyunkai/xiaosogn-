<template>
  <div class="loadManagement">
    <div class="tabsCount" v-if="newsAdd === 1">
      <Tabs @on-click="handletabCount">
        <TabPane v-for="item in TypeList" :key="item.type" :label="item.name">
          <Row class="section">
            <Col class="type">
              <Select
                v-model="packetTypes"
                @on-change="handleTypes"
                style="width: 200px"
                placeholder="选择分组类型"
                :clearable="true"
              >
                <Option
                  v-for="item in packetList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.type"
                ></Option>
              </Select>
            </Col>
            <Col class="type">
              <TreeSelect
                placeholder="选择分组"
                multiple
                show-checkbox
                v-model="packetFilter"
                transfer
                :data="packetFilterList"
              />
            </Col>
            <Col class="type">
              <Input
                class="short-input"
                placeholder="搜索负载名称/位置/线路"
                clearable
                v-model="shortInput"
              ></Input>
            </Col>
            <Button
              type="primary"
              style="margin-left: 10px; background: #007eff"
              @click="handleonSubmit"
              >查询</Button
            >
            <Button style="margin: 0 10px" @click="handleReset">重置</Button>
            <div class="export" @click="handleExport">
              <Icon
                custom="icon-v5 icon-v5-daochu"
                size="20"
                style="margin-left: 10px"
              />
            </div>
          </Row>
          <div class="tableCount">
            <div class="header">
              <h3>负载列表</h3>
              <Button type="primary" @click="addNews(2)">新增负载</Button>
            </div>
            <div class="count">
              <Table :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="mac">
                  {{ row.macName }}{{ `(${row.mac})` }}
                </template>
                <template slot-scope="{ row }" slot="power">
                  {{ row.workPowerMin }}-{{ row.workPowerMax }}
                </template>
                <template slot-scope="{ row }" slot="voltage">
                  {{ row.workVoltageMin }}-{{ row.workVoltageMax }}
                </template>
                <template slot-scope="{ row }" slot="action">
                  <span
                    class="pointer"
                    style="color: #007eff; margin: 0 5px"
                    @click="handleQueryDetail(row.id)"
                    >查看</span
                  >
                  <span
                    class="pointer"
                    style="color: #007eff; margin: 0 5px"
                    @click="hanleEdit(row.id)"
                    >编辑</span
                  >
                  <span
                    class="pointer"
                    style="color: #ff5722; margin: 0 5px"
                    @click="handleDelete(row.id)"
                    >删除</span
                  >
                </template>
              </Table>
            </div>
            <Page
              show-total
              :current="currentPage"
              @on-change="changePage"
              @on-page-size-change="changesize"
              :total="total"
              show-elevator
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
    <div class="newsCount" v-if="newsAdd === 2">
      <h3>基础信息</h3>
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="130"
        style="margin-top: 20px"
      >
        <FormItem label="负载照片" prop="imgUrl">
          <Upload
            :show-upload-list="false"
            :default-file-list="defaultList"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            multiple
            type="drag"
            :action="action"
            name="beforeImgFile"
            :data="beforeImgData"
            style="display: inline-block; width: 200px; higth: 200px"
          >
            <div v-if="formValidate.imageUrl">
              <div class="demo-upload-list" v-if="demoImg1 === true">
                <img :src="formValidate.imageUrl" style="width: 100%" />
              </div>
            </div>
            <div
              style="width: 200px; height: 100px; line-height: 100px"
              v-if="!formValidate.imageUrl"
            >
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>
          <div style="color: #3d3d41">图片格式必须为jpg,jpeg,png格式</div>
        </FormItem>
        <FormItem label="负载名称" prop="names">
          <Input
            placeholder="请输入负载名称"
            style="width: 400px"
            v-model="formValidate.names"
          ></Input>
        </FormItem>
        <FormItem label="负载品牌">
          <Input
            placeholder="请输入负载品牌名称或者厂家名称"
            style="width: 400px"
            prop="brandName"
            v-model="formValidate.brandName"
          ></Input>
        </FormItem>
        <FormItem label="负载类型" prop="typeLsit">
          <Select
            placeholder="请选择类型"
            style="width: 400px"
            v-model="formValidate.typeLsit"
          >
            <Option
              v-for="item in TypeLists"
              :key="item.type"
              :value="item.type"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="关联线路" prop="macInput">
          <div style="display: flex">
            <Button
              class="export"
              style="margin-right: 20px"
              @click="handleAddr"
              >选择路线</Button
            >
            <Input
              placeholder="请选择关联线路"
              style="width: 310px"
              v-model="formValidate.macInput"
            ></Input>
          </div>
        </FormItem>
        <FormItem label="位置" prop="location">
          <Input
            placeholder="请输入位置信息"
            style="width: 400px"
            v-model="formValidate.location"
          ></Input>
        </FormItem>
        <FormItem label="是否为关键负载" prop="Radio">
          <RadioGroup v-model="formValidate.Radio">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <h3 style="margin: 40px 0">负载电器参数</h3>
        <FormItem label="额定功率(W)" prop="Ratedpower">
          <Input
            placeholder="请输入额定功率"
            style="width: 400px"
            v-model="formValidate.Ratedpower"
          ></Input>
        </FormItem>
        <FormItem label="工作功率范围(W)" prop="MinOperatingpower">
          <Row>
            <Col>
              <Input
                placeholder="最小值"
                v-model="formValidate.MinOperatingpower"
                style="width: 168px"
              ></Input>
            </Col>
            <Col span="1" style="text-align: center">至</Col>
            <Col>
              <FormItem prop="MaxOperatingpower">
                <Input
                  placeholder="最大值"
                  v-model="formValidate.MaxOperatingpower"
                  style="width: 168px"
                ></Input>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="功率因数">
          <Input
            placeholder="0-1"
            style="width: 400px"
            v-model="formValidate.Factorpower"
          ></Input>
        </FormItem>
        <FormItem label="额定工作电压(V)" prop="MinVoltagepower">
          <Row>
            <Col>
              <Input
                placeholder="最小值"
                style="width: 168px"
                v-model="formValidate.MinVoltagepower"
              ></Input>
            </Col>
            <Col span="1" style="text-align: center">至</Col>
            <Col>
              <FormItem prop="MaxVoltagepower">
                <Input
                  placeholder="最大值"
                  style="width: 168px"
                  v-model="formValidate.MaxVoltagepower"
                ></Input>
              </FormItem>
            </Col>
          </Row>
        </FormItem>

        <FormItem style="text-align: right">
          <Button style="margin-right: 20px" @click="addNews(1)">取消</Button>
          <Button type="primary" @click="handleAdd('formValidate')"
            >保存</Button
          >
        </FormItem>
      </Form>
    </div>
    <div class="detCount" v-if="newsAdd === 3">
      <div class="back" @click="addNews(1)">
        <i class="icon-v5 icon-v5-xiangzuo"></i>返回
      </div>
      <Row style="margin-top: 10px">
        <Col :span="14" class="bacg">
          <Col :span="6" class="bcimg">
            <img src="../../../assets/images/Airopen-offline.png" alt="" />
          </Col>
          <Col>
            <Form :label-width="130">
              <FormItem label="负载名称:">
                <span>{{ detailData.name }}</span>
              </FormItem>
              <FormItem label="关联设备:">
                <span>{{ detailData.macName }}{{ `(${detailData.mac})` }}</span>
              </FormItem>
              <FormItem label="关联线路:">
                <span>{{ detailData.addrName }}</span>
              </FormItem>
              <FormItem label="是否为关键负载:">
                <span>{{ detailData.isKey === 0 ? "否" : "是" }}</span>
              </FormItem>
            </Form>
          </Col>
          <Col>
            <Form :label-width="130">
              <FormItem label="类型:">
                <span>{{ detailData.typeName }}</span>
              </FormItem>
              <FormItem label="位置:">
                <span>{{ detailData.location }}</span>
              </FormItem>
            </Form>
          </Col>
        </Col>
        <Col :span="10" style="display: flex">
          <Col :span="12">
            <div class="Rightbox">
              <div class="Vbox" style="display: flex">
                <div class="imgBox">
                  <i class="icon-v5 icon-v5-edinggongshuai"></i>
                </div>
                <div class="count">
                  <div class="num">{{ detailData.ratedPower }}</div>
                  <div class="type">额定功率</div>
                </div>
              </div>
            </div>
            <div class="Rightbox" style="margin-top: 10px">
              <div class="Vbox" style="display: flex">
                <div class="imgBox">
                  <i class="icon-v5 icon-v5-dianyuandianya"></i>
                </div>
                <div class="count">
                  <div class="num">
                    {{ detailData.workVoltageMin }}~{{
                      detailData.workVoltageMax
                    }}
                  </div>
                  <div class="type">额定功率电压</div>
                </div>
              </div>
            </div>
          </Col>
          <Col :span="12">
            <div class="Rightbox">
              <div class="Vbox" style="display: flex">
                <div class="imgBox">
                  <i class="icon-v5 icon-v5-fanwei"></i>
                </div>
                <div class="count">
                  <div class="num">
                    {{ detailData.workPowerMin }}~{{ detailData.workPowerMax }}
                  </div>
                  <div class="type">工作功率范围</div>
                </div>
              </div>
            </div>
            <div class="Rightbox" style="margin-top: 10px">
              <div class="Vbox" style="display: flex">
                <div class="imgBox">
                  <i class="icon-v5 icon-v5-yougong"></i>
                </div>
                <div class="count">
                  <div class="num">{{ detailData.powerFactor }}</div>
                  <div class="type">功率因数</div>
                </div>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
      <Row style="margin-top: 10px; background: #1a202e" class="data">
        <div class="header">
          <div class="left">
            <span class="icon"></span>
            <span class="name">运行数据态势</span>
          </div>
        </div>
      </Row>
      <div class="statuscount">
        <div class="header">开关情况</div>
        <OpecoStatus :options="statusData" />

        <template v-if="detailData.isKey === 0 ? false : true">
          <div class="header">用电量</div>
          <loadArea :options="powerData" />
        </template>
      </div>
    </div>
    <Modal
      title="添加设备"
      v-model="addr"
      width="30%"
      append-to-body
      @on-ok="handleSummit"
    >
      <Row class="addrBox">
        <Col :span="14" style="border-right: 1px solid #28313f">
          <div class="header">选择设备</div>
          <div class="search">
            <Input
              placeholder="请输入设备号搜索"
              v-model="mac"
              style="margin-right: 5px"
            />
            <Button type="primary" @click="handleSearch">搜索</Button>
          </div>
          <div class="tree">
            <Menu :theme="theme2" @on-select="handleTress" :open-names="['1']">
              <Submenu name="1" class="loadMune">
                <template slot="title"> 设备号 </template>
                <MenuItem
                  :name="`${item.mac}:${item.resId}`"
                  v-for="item in macData"
                  :key="item.id"
                  >{{ item.name }}{{ `(${item.mac})` }}</MenuItem
                >
              </Submenu>
            </Menu>
          </div>
        </Col>
        <Col :span="10">
          <div class="header">选择线路</div>
          <RadioGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <Radio
              v-for="item in lines"
              :key="item.addr"
              :label="`${item.title}:${item.addr}`"
              style="margin: 10px"
              ><span>{{ item.title }}</span></Radio
            >
          </RadioGroup>
        </Col>
      </Row>
    </Modal>
    <Modal title="负载功率提醒" v-model="reminder" width="30%" append-to-body>
      <span>负载功率超过线路自身功率,请慎重操作!</span>
      <div slot="footer">
        <Button class="b-dger" @click="Continueadding">继续添加</Button>
        <Button class="b-blue" @click="hanldeUnadd">取消添加</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    import OpecoStatus from '../../Common/OpecoStatus.vue';
    import loadArea from '../../Common/loadArea.vue';
    import {
        getGroupType,
        getGroupTree,
        queryTypeList,
        checkKeyLoadExist,
        saveLoad,
        queryDetail,
        loadDelete,
        queryList,
        queryBoxes,
        queryChannels,
        trand
    } from '@/api/public';
    export default {
        components: {
            OpecoStatus,
            loadArea
        },
        data () {
            return {
                packetTypes: '',
                packetList: [],
                packetFilter: [],
                packetFilterList: [],
                newsAdd: 1,
                deTails: false,
                reminder: false,
                TypeLists: '',
                theme2: 'dark',
                statusData: {},
                currentPage: 1,
                pageSize: 10,
                total: 0,
                powerData: {
                    title: {
                        show: false
                    },
                    xAxis: [],
                    series: [],
                    yAxis: []
                },
                columns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '负载名称',
                        key: 'name'
                    },
                    {
                        title: '负载类型',
                        key: 'typeName'
                    },
                    {
                        title: '关联设备',
                        slot: 'mac'
                    },
                    {
                        title: '关联线路',
                        key: 'addrName'
                    },
                    {
                        title: '位置',
                        key: 'location'
                    },
                    {
                        title: '额定功率 (W)',
                        key: 'ratedPower'
                    },
                    {
                        title: '功率范围 (W)',
                        slot: 'power'
                    },
                    {
                        title: '功率因数',
                        key: 'powerFactor'
                    },
                    {
                        title: '额定工作电压 (W)',
                        slot: 'voltage'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        align: 'center'
                    }
                ],
                data: [],
                demoImg1: true,
                formValidate: {
                    imgUrl: '',
                    names: '',
                    brandName: '',
                    Ratedpower: '',
                    MinOperatingpower: '',
                    MaxOperatingpower: '',
                    Factorpower: '',
                    MinVoltagepower: '',
                    MaxVoltagepower: '',
                    imageUrl: '',
                    Radio: '1',
                    typeLsit: '',
                    macInput: '',
                    location: ''
                },
                ruleValidate: {
                    imgUrl: [
                        {
                            required: true,
                            type: 'object',
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if (!value) {
                                    return callback(new Error('图片不能为空'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    names: [
                        {
                            required: true,
                            message: '请输入负载名称',
                            trigger: 'blur'
                        }
                    ],

                    typeLsit: [
                        {
                            required: true,
                            message: '请选择负载类型',
                            trigger: 'change',
                            type: 'number'
                        }
                    ],
                    macInput: [
                        {
                            required: true,
                            message: '请选择关联线路',
                            trigger: 'blur'
                        }
                    ],
                    location: [
                        {
                            required: true,
                            message: '请输入位置',
                            trigger: 'blur'
                        }
                    ],
                    Radio: [
                        { required: true, message: '请选择关键负载', trigger: 'change' }
                    ],
                    Ratedpower: [
                        {
                            required: true,
                            message: '请输入额定功率',
                            trigger: 'blur',
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                        }
                    ],

                    MinOperatingpower: [
                        {
                            required: true,
                            message: '请输入工作功率范围最小值',
                            trigger: 'blur',
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                        }
                    ],
                    MaxOperatingpower: [
                        {
                            required: true,
                            message: '请输入工作功率范围最大值',
                            trigger: 'blur',
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                        }
                    ],
                    MinVoltagepower: [
                        {
                            required: true,
                            message: '请输入额定工作电压最小值',
                            trigger: 'blur',
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                        }
                    ],
                    MaxVoltagepower: [
                        {
                            required: true,
                            message: '请输入额定工作电压最大值',
                            trigger: 'blur',
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                        }
                    ]
                },
                defaultList: [],
                TypeList: '',
                tagType: 0,
                addr: false,
                checkAllGroup: '',
                mac: '',
                resId: '',
                macData: [],
                lines: [],
                checkedLines: [],
                checkedAddr: [],
                newCheck: '',
                macVal: '',
                lineVal: null,
                addrVal: null,
                checkPower: true,
                action:
                    `${this.$func.ctxPaths()}/maintenance/imgUrl/before/upload.as?v=` +
                    new Date().getTime(),
                beforeImgData: { name: 'beforeImgFile' },
                detailData: '',
                shortInput: ''
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                this.getGroupTypes();
                this.hanldeQueryTypeList();
                this.handleQueryList();
            },
            handleonSubmit () {
                if (this.packetTypes && this.packetFilter.length === 0) {
                    this.$Message.error({ content: '请选择分组' });
                    return false;
                } else {
                    this.init();
                }
            },
            handleSuccess (res, file) {
                this.demoImg1 = true;
                if (res.success) {
                    this.formValidate.imgUrl = res.data;
                } else if (res.code === '-1') {
                } else {
                    this.$Message.error(res.message);
                }
            },
            // 图片大小判断
            beforeUpload (file) {
                this.formValidate.imageUrl = URL.createObjectURL(file);
                this.srcList = [this.formValidate.imageUrl];
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    this.$Message.error('上传图片大小不能超过 1MB!');
                }
                return isLt1M;
            },
            handleTypes (val) {
                this.packetTypes = val;
                this.getGroupTrees();
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
                            console.log(this.packetList);
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
            getGroupTrees () {
                getGroupTree({ groupId: this.packetTypes })
                    .then((res) => {
                        if (res.code === '0') {
                            this.packNewlist = res.data;
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
            unique (arr) {
                return Array.from(new Set(arr));
            },
            getListid (val) {
                val.map((itm) => {
                    this.packNewlist.map((item) => {
                        if (JSON.stringify(item).toLowerCase().indexOf(itm) > -1) {
                            // let index = JSON.stringify(item).toLowerCase().indexOf(itm);
                            this.newArr.push(item.id);
                        }
                        return this.newArr;
                    });
                });
                // let idArr = this.newArr.map((item) => item.id);
                this.packetFilter = this.unique(this.newArr);
                // this.queryList();
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
            addNews (val) {
                if (val === 1) {
                    this.newsAdd = 1;
                } else if (val === 2) {
                    this.formValidate = {
                        imgUrl: '',
                        names: '',
                        brandName: '',
                        Ratedpower: '',
                        MinOperatingpower: '',
                        MaxOperatingpower: '',
                        Factorpower: '',
                        MinVoltagepower: '',
                        MaxVoltagepower: '',
                        imageUrl: '',
                        Radio: '1',
                        typeLsit: '',
                        macInput: '',
                        location: ''
                    };
                    this.newsAdd = 2;
                    this.hanldeTypeList();
                }
            },
            hanldeQueryTypeList () {
                queryTypeList().then((res) => {
                    if (this.newsAdd === 2) {
                        this.TypeList = res.data;
                    } else {
                        this.TypeList = res.data;
                        var obj = {
                            name: '全部负载',
                            type: '0'
                        };
                        this.TypeList.unshift(obj);
                    }
                });
            },
            hanldeTypeList () {
                queryTypeList().then((res) => {
                    this.TypeLists = res.data;
                });
            },
            handletabCount (data) {
                this.tagType = data;
                this.handleQueryList();
            },
            handleQueryList () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    type: this.tagType,
                    nodeIds: this.packetFilter
                        ? this.packetFilter.join()
                        : this.packetFilter,
                    keyword: this.shortInput,
                    pageNo: this.currentPage,
                    pageSize: this.pageSize
                };
                queryList(params).then((res) => {
                    this.data = res.datas;
                    this.total = res.total;
                });
            },
            handleDelete (id) {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    id: id
                };
                loadDelete(params).then((res) => {
                    this.handleQueryList();
                });
            },
            handleAddr () {
                this.addr = true;
                this.queryList();
            },
            queryList (mac) {
                let params = {
                    pageNo: '1',
                    pageSize: 10000,
                    projectCode: this.$store.state.projectCode,
                    equipmentTypes: '1,2'
                };
                if (mac) params.key = mac;
                queryBoxes(params).then((res) => {
                    if (res.success) {
                        this.macData = res.datas;
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            handleSearch () {
                this.queryList(this.mac);
            },
            handleTress (data) {
                var datas = '';
                datas = data.split(':');
                this.lines = [];
                this.macVal = datas[0];
                this.resId = datas[1];
                this.handleChannels(this.macVal);
            },
            handleChannels (val) {
                queryChannels({ mac: val }).then((res) => {
                    if (res.success) {
                        this.lines = res.datas;
                        this.checkedLines = res.datas.map((item) => {
                            return item.title;
                        });
                    } else if (res.code === '-1') {
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },

            checkAllGroupChange (data) {
                this.newCheck = data;
            },
            handleSummit () {
                var data = '';
                this.lineVal = [];
                this.addrVal = [];
                data = this.newCheck.split(':');
                this.lineVal.push(data[0]);
                this.addrVal.push(data[1]);
                this.formValidate.macInput = this.macVal + `[${this.lineVal}]`;
            },

            hanldeUnadd () {
                this.reminder = false;
            },
            handleAdd (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = {
                            id: this.formValidate.id === undefined ? '' : this.formValidate.id,
                            projectCode: this.$store.state.projectCode,
                            name: this.formValidate.names,
                            brand: this.formValidate.brandName,
                            type: this.formValidate.typeLsit,
                            isKey: this.formValidate.Radio,
                            resId: this.resId === '' ? this.formValidate.resId : this.resId,
                            mac: this.macVal === '' ? this.formValidate.mac : this.macVal,
                            addr:
                                this.formValidate.addr !== undefined
                                    ? this.formValidate.addr
                                    : this.addrVal.join(','),
                            // addr: this.addrVal.join(',') === '' ? this.formValidate.addr : this.addrVal.join(','),
                            location: this.formValidate.location,
                            imgUrl: this.formValidate.imgUrl,
                            ratedPower: this.formValidate.Ratedpower,
                            workPowerMin: this.formValidate.MinOperatingpower,
                            workPowerMax: this.formValidate.MaxOperatingpower,
                            powerFactor: this.formValidate.Factorpower,
                            workVoltageMin: this.formValidate.MinVoltagepower,
                            workVoltageMax: this.formValidate.MaxVoltagepower,
                            checkPower: this.checkPower
                        };
                        console.log(params);
                        saveLoad(params).then((res) => {
                            if (res.code === '0') {
                                if (res.data.load_power_exceed !== true) {
                                    this.addNews(1);
                                    this.init();
                                } else {
                                    this.reminder = true;
                                    this.checkPower = false;
                                }
                            } else {
                                this.$Message.error({
                                    content: res.message
                                });
                            }
                        });
                    } else {
                        this.$Message.error('请输入必填项!');
                    }
                });
            },
            Continueadding () {
                let params = {
                    id: this.formValidate.id,
                    projectCode: this.$store.state.projectCode,
                    name: this.formValidate.names,
                    brand: this.formValidate.brandName,
                    type: this.formValidate.typeLsit,
                    isKey: this.formValidate.Radio,
                    resId: this.resId === '' ? this.formValidate.resId : this.resId,
                    mac: this.macVal === '' ? this.formValidate.mac : this.macVal,
                    addr:
                        this.formValidate.addr !== ''
                            ? this.formValidate.addr
                            : this.addrVal.join(','),
                    location: this.formValidate.location,
                    imgUrl: this.formValidate.imgUrl,
                    ratedPower: this.formValidate.Ratedpower,
                    workPowerMin: this.formValidate.MinOperatingpower,
                    workPowerMax: this.formValidate.MaxOperatingpower,
                    powerFactor: this.formValidate.Factorpower,
                    workVoltageMin: this.formValidate.MinVoltagepower,
                    workVoltageMax: this.formValidate.MaxVoltagepower,
                    checkPower: false
                };
                saveLoad(params).then((res) => {
                    if (res.code === '0') {
                        if (res.data.load_power_exceed !== true) {
                            this.reminder = false;
                            this.addNews(1);
                            this.init();
                        }
                    } else {
                        this.$Message.error({
                            content: res.message
                        });
                    }
                });
            },
            handleQueryDetail (id) {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    id: id
                };
                queryDetail(params).then((res) => {
                    this.newsAdd = 3;
                    this.hanldeTrand(id);
                    this.detailData = res.data;
                });
            },
            hanldeTrand (id) {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    id: id,
                    startTime: this.$Date().format('YYYY-MM-DD'),
                    endTime: this.$Date().format('YYYY-MM-DD')
                };
                trand(params).then((res) => {
                    var data = res.data;
                    console.log(data);
                    var time = [];
                    var ocStatus = [];
                    var main = [];
                    for (var i in data) {
                        time.push(
                            data[i].startTime.split(' ')[1] +
                                '-' +
                                data[i].endTime.split(' ')[1]
                        );
                        main.push(data[i].power);
                        if (data[i].ocStatus === 1) {
                            ocStatus.push('15');
                        } else {
                            ocStatus.push('5');
                        }
                    }
                    this.powerData.xAxis = [];
                    this.powerData.series = [];
                    this.powerData.xAxis = time;
                    this.powerData.yAxis.name = '次数（次）';
                    this.powerData.series[0] = {
                        name: '维保次数',
                        type: 'line',
                        data: main,
                        itemStyle: {
                            color: '#007EFF'
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                                    { offset: 1, color: 'rgba(3, 115, 230, 0.3)' }
                                ],
                                global: false
                            }
                        },
                        showSymbol: true,
                        symbol: 'circle',
                        symbolSize: 4,
                        smooth: true
                    };
                    this.statusData = {
                        time: time,
                        data: ocStatus
                    };
                });
            },

            hanleEdit (id) {
                this.hanldeTypeList();
                let params = {
                    projectCode: this.$store.state.projectCode,
                    id: id
                };
                queryDetail(params).then((res) => {
                    this.newsAdd = 2;
                    this.detailData = res.data;
                    this.formValidate = {
                        id: id,
                        names: this.detailData.name,
                        brandName: this.detailData.brand,
                        Ratedpower: this.detailData.ratedPower,
                        MinOperatingpower: this.detailData.workPowerMin,
                        MaxOperatingpower: this.detailData.workPowerMax,
                        Factorpower: this.detailData.powerFactor,
                        MinVoltagepower: this.detailData.workVoltageMin,
                        MaxVoltagepower: this.detailData.workVoltageMax,
                        imageUrl: this.detailData.imgUrl,
                        imgUrl: this.detailData.imgUrl,
                        Radio: String(this.detailData.isKey),
                        typeLsit: this.detailData.type,
                        macInput: this.detailData.mac + `[${this.detailData.addrName}]`,
                        location: this.detailData.location,
                        resId: this.detailData.resId,
                        mac: this.detailData.mac,
                        addr: this.detailData.addr
                    };
                    this.ruleValidate = {
                        names: [
                            {
                                required: true,
                                message: '请输入负载名称',
                                trigger: 'blur'
                            }
                        ],

                        typeLsit: [
                            {
                                required: true,
                                message: '请选择负载类型',
                                trigger: 'change',
                                type: 'number'
                            }
                        ],
                        macInput: [
                            {
                                required: true,
                                message: '请选择关联线路',
                                trigger: 'blur'
                            }
                        ],
                        location: [
                            {
                                required: true,
                                message: '请输入位置',
                                trigger: 'blur'
                            }
                        ],
                        Radio: [
                            { required: true, message: '请选择关键负载', trigger: 'change' }
                        ],
                        Ratedpower: [
                            {
                                required: true,
                                message: '请输入额定功率',
                                trigger: 'blur',
                                pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                            }
                        ],

                        MinOperatingpower: [
                            {
                                required: true,
                                message: '请输入工作功率范围最小值',
                                trigger: 'blur',
                                pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                            }
                        ],
                        MaxOperatingpower: [
                            {
                                required: true,
                                message: '请输入工作功率范围最大值',
                                trigger: 'blur',
                                pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                            }
                        ],
                        MinVoltagepower: [
                            {
                                required: true,
                                message: '请输入额定工作电压最小值',
                                trigger: 'blur',
                                pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                            }
                        ],
                        MaxVoltagepower: [
                            {
                                required: true,
                                message: '请输入额定工作电压最大值',
                                trigger: 'blur',
                                pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
                            }
                        ]
                    };
                });
            },
            handleReset () {
                this.packetTypes = '';
                this.packetFilter = [];
                this.shortInput = '';
                this.init();
            },
            handleExport () {
                this.$func.windowCountDown(
                    '/load/xls/exportList.as?&projectCode=' +
                        this.$store.state.projectCode +
                        '&type=' +
                        this.tagType +
                        '&nodeIds=' +
                        this.packetFilter +
                        '&keyword=' +
                        this.shortInput
                );
            },
            changePage (e) {
                this.currentPage = e;

                this.handleQueryList();
            },
            changesize (e) {
                this.pageSize = e;
                this.handleQueryList();
            }
        }
    };
</script>
<style lang="less" scoped>
.loadManagement {
  .section {
    background: #1a202e;
    padding: 20px;
    .type {
      margin-right: 10px;
    }
  }
  /deep/.ivu-tabs-nav-scroll {
    background: #1a202e;
    padding: 10px;
  }

  .export {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-icon {
      color: #007eff;
      margin: 0 !important;
    }
  }
  .tableCount {
    margin-top: 10px;
    padding: 20px;
    background: #1a202e;
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }
  .newsCount {
    background: #1a202e;
    padding: 20px;
  }
  /deep/.ivu-form-item-label {
    text-align: left;
  }
  .detCount {
    .back {
      cursor: pointer;
    }
    .bacg {
      background: #1a202e;
      display: flex;
      padding: 20px;
      /deep/.ivu-form-item-label {
        text-align: right;
        color: #818183;
      }
      .bcimg {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .Rightbox {
    margin-left: 10px;
    background: #1a202e;
    padding: 30px;
    .Vbox {
      margin-top: 11px;
      .imgBox {
        width: 60px;
        height: 60px;
        background: rgba(0, 126, 255, 0.2);
        border-radius: 10px;
        text-align: center;
        line-height: 60px;
        .icon-v5 {
          color: #007eff;
          font-size: 40px;
        }
      }
      .count {
        margin-left: 20px;
        .num {
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 500;
        }
        .type {
        }
      }
    }
  }
  .data {
    .header {
      padding: 10px;
      width: 100%;
      border-bottom: 1px solid #393e4a;
      margin: 0 10px;
      display: flex;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: center;
        .icon {
          display: block;
          width: 2px;
          height: 14px;
          background: #007eff;
          margin-right: 10px;
        }
        .name {
        }
      }
      .right {
        display: flex;
        .datepick {
          display: flex;
          align-items: center;
          .date {
            border: 1px solid #393e4a;
            padding: 5px 10px;
            margin-right: 5px;
            border-radius: 5px;
            color: #666666;
            cursor: pointer;
          }
        }
        .inputVal {
          margin-right: 10px;
          .input {
          }
        }
        Button {
          border: 1px solid #888a90;
        }
      }
    }
  }
}
.addrBox {
  border: 1px solid #28313f;
  .header {
    background: #28313f;
    padding: 10px;
  }
  .search {
    padding: 10px;
    display: flex;
    input {
    }
  }
  .tree {
  }
}
.loadMune {
  height: 300px;
  overflow-y: auto;
}
/deep/.ivu-menu {
  width: 100% !important;
}

/deep/.ivu-menu-submenu-title {
  background: #262c3b !important;
  width: 100%;
  padding: 10px;
}
/deep/.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active {
  background: transparent !important;
  color: #007eff;
}
/deep/.ivu-menu-item {
  padding-left: 10px !important;
}
/deep/.ivu-icon {
  right: 0px;
}
/deep/.ivu-menu-item-active {
  background: none !important;
}
.ivu-checkbox-group {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.ivu-checkbox-group-item {
  margin-bottom: 10px;
}
/deep/.ivu-checkbox {
  margin-right: 10px;
}
/deep/.ivu-modal-footer {
  border: none;
}
.statuscount {
  background: #1a202e;
  padding: 20px;
  .header {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
