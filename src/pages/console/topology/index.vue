<template>
<div id="topology">
    <Row style="height: 100%">
    <Col span="12" id="left">
      <div class="header">
        <span class="span">拓扑图</span>
        <Button @click="allPackUp" class="Button">收起全部</Button>
        <Input
          placeholder="搜索设备名称"
          :border="false"
          v-model.trim="inputValue"
          @on-enter="search"
          class="search"
          style="border: none"
          clearable
        >
          <Icon type="ios-search" slot="prefix" />
        </Input>
      </div>
      <div class="tree">
        <Tree
          @on-select-change="change"
          :data="treeData"
          :render="renderContent"
          :load-data="loadData"
          class="demo-tree-render topology"
        >
        </Tree>
        <Modal
          v-model="batchModal"
          class-name="vertical-center-modal"
          :title="butType ? '批量合闸操作' : '批量分闸操作'"
        >
          <div>
            <Tag class="tab" color="primary"
              ><Icon color="#999" type="md-chatboxes" />
              <span style="color: #999"
                >&nbsp;&nbsp;&nbsp;&nbsp;{{
                  butType
                    ? "提示：请先勾选线路后，再进行合闸操作。"
                    : "提示：请先勾选线路后，再进行分闸操作。"
                }}</span
              >
            </Tag>
            <br/><br/><br/>
            <Table
              ref="selection"
              :columns="columns4"
              :data="batchdata"
              @on-selection-change="changestate"
              :max-height="520"
            >
              <div slot="oc" slot-scope="{ row }">
                <!-- <Button style="color:#F24E4C;border:1px solid #F24E4C" v-if="row.on">合闸</Button>
                <Button style="color:#21F27F;border:1px solid #21F27F" v-else>分闸</Button> -->
                <p
                  :style="
                    row.on
                      ? 'color:#F24E4C;background:rgba(242, 78, 76,.1);width:54px;text-align: center;height:20px'
                      : 'color:#0DD667;background:rgba(13, 214, 103,.1);width:54px;text-align: center;height:20px'
                  "
                >
                  <!-- {{row.status}} -->
                  {{ row.on ? "合闸" : "分闸" }}
                </p>
              </div>
            </Table>
          </div>
          <div slot="footer">
            <Button
              style="color: #f24e4c; border: 1px solid #f24e4c"
              v-if="butType"

              @click="batchOperation('close')"
              >合闸</Button
            >
            <Button
              style="color: #21f27f; border: 1px solid #21f27f"
              v-else
              @click="batchOperation('open')"
              >分闸</Button
            >
            <Button style="color: #fff" @click="batchModal = false"
              >取消</Button
            >
          </div>
        </Modal>
      </div>
    </Col>
    <Col span="12" id="right">
      <div class="narrator"></div>
      <div class="header">
        <span class="span">设备实景图</span>
        <Upload
            ref="upload"
            :action="uploadUrl"
            :name="imgData.name"
            :data="imgData"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            @mouseover.native="flag = true"
            :show-upload-list="false"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            multiple
            v-if="stopclick"
        >
          <!-- <Button>上传图片</Button> -->
          <Button class="Button" type="text">{{
            imgtext
          }}</Button>
          <!-- <Button icon="ios-cloud-upload-outline" class="Button">Upload files</Button> -->
        </Upload>
        <Tooltip content="请先选择具体设备" placement="bottom" v-else style="float:right;margin-top:15px;margin-right:19px">
            <Button class="Button" disabled>{{
            imgtext
          }}</Button>
        </Tooltip>
      </div>
      <div class="imgbox">
        <div v-show="img">
            <img src="@/assets/images/topology-default.png"  v-if="equipmentType===1" />
            <img src="@/assets/images/topology-dqhz.png" v-show="img" v-else-if="equipmentType===2" />
            <img src="@/assets/images/topology-default.png" v-show="img" v-else-if="equipmentType===4" />
            <img src="@/assets/images/topology-ywkr.png" v-show="img" v-else-if="equipmentType===5" />
            <img src="@/assets/images/wsdgz.png" v-show="img" v-else-if="equipmentType===6" />
            <img src="@/assets/images/topology-ywkr.png" v-show="img" v-else-if="equipmentType===10" />
            <img src="@/assets/images/wsdgz.png" v-show="img" v-else-if="equipmentType===11" />
            <img src="@/assets/images/topology-zndb.png" v-show="img" v-else-if="equipmentType===12" />
            <img src="@/assets/images/topology-zndb.png" v-show="img" v-else-if="equipmentType===16" />
            <img ref="img" refs="img" id="img" src="" v-show="img" v-else />
        </div>

        <div v-show="!img" class="null">
          <img
            src="@/assets/images/noImg.png"
            alt=""
            style="width: 320px; height: 250px"
          />
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请选择左边设备
          </p>
        </div>
      </div>
    </Col>
    <!-- 是否分合闸 -->
    <Modal
      v-model="isOpen"
      class-name="vertical-center-modal"
      @on-ok="operationStatus(opendata, status)"
      :title="status === 'open' ? '分闸提示' : '合闸提示'"
    >
      <p
        v-text="
          status === 'open'
            ? `确定将${opendata.title}进行分闸操作吗？`
            : `确定将${opendata.title}进行合闸操作吗？`
        "
      ></p>
    </Modal>
    <!-- 分合闸结果弹窗 -->
    <Modal
        title=""
        v-model="modal"
        :footer-hide="true"
        :styles="{top: '20px',width:'300px'}">
        <br>
        <p v-for="(item,index) in opendatas" :key="index" :style="item.exeResult===1?'color:#f24e4c;text-align:center;line-height:25px':'color:#21f27f;text-align:center;line-height:25px'">{{
            item.exeResult===1?item.mac + "" +item.msg:item.mac + "命令已提交，生效中..."
            }}</p>
    </Modal>
  </Row>
</div>
</template>
<script>
    import '@/styles/pages/topology.less';
    import {
        getBuildingList,
        queryEquipmentInfo,
        queryRoomEquipmentList,
        changeStatus,
        searchEquipment
    } from '@/api/console/topology.js';
    import { queryBoxDetails } from '@/api/control/index'
    import hezha from '../../../assets/images/hezha.png'
    import fenzha from '../../../assets/images/fenzha.png'
    export default {
        data () {
            return {
                // 控制批量操作弹窗内容 1为开闸，0为分闸
                batchContent: 1,
                batchModal: false,
                batchdata: [],
                opendata: '',
                inputValue: '',
                status: '',
                treeData: [],
                img: false,
                imgUrls: '',
                // 当前查看的设备，用于给上传的图片命名
                pictureName: '',
                buttonProps: {
                    type: 'default',
                    size: 'small'
                },
                // 上传图片
                defaultList: [],
                // action:
                //      '/box/icon/upload.as?v=' + new Date().getTime(),${}
                uploadUrl: '/box/icon/upload.as?v=' + new Date().getTime(),
                beforeImgData: {
                    name: 'imgFile',
                    mac: ''
                },
                imgData: {
                    name: 'imgFile',
                    mac: ''
                },
                params: {
                    equipmentType: '',
                    id: '',
                    imgUrl: '',
                    mac: '',
                    projectCode: this.$store.state.projectCode
                },
                imgtext: '上传图片',
                arr: [],
                flag: false,
                isOpen: false,
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '线路名称',
                        key: 'title'
                    },
                    {
                        title: '线路状态',
                        slot: 'oc'
                    }
                ],
                butType: null,
                stateArr: [],
                stopclick: false,
                equipmentType: '',
                modal: false,
                opendatas: []
            };
        },
        methods: {
            handleMaxSize (file) {
                // 超过2M
                this.$Notice.warning({
                    title: '图片超出大小限制',
                    desc: '图片  ' + file.name + ' 太大，不能超过2M.'
                });
            },
            handleBeforeUpload (file) {
                if (!this.img) {
                    this.$Notice.error({
                        title: '请先选择具体设备'
                    });
                    return false;
                }
            },
            // 文件格式验证失败
            handleFormatError (file) {
                this.$Notice.success({
                    title: '图片格式不正确',
                    desc:
                        '图片格式 ' + file.name + ' 不正确,请选择png、jpg、jpeg格式的文件'
                });
            },
            // 文件上传失败
            handleError (file) {
                this.$Notice.warning({
                    title: '图片上传失败',
                    desc: '图片 ' + file.name + ' 上传失败, 请尝试重新上传'
                });
            },
            queryInfo () {
                let params = {
                    'mac': this.imgData.mac
                }

                queryBoxDetails(params)
                    .then(res => {
                        if (res.success) {
                            this.equipmentType = '图片地址'
                            this.$nextTick(() => {
                                this.$refs.img.src = res.data.imgUrl
                            })
                        }
                    })
            },
            beforeUpload (file) {
                const isLt1M = file.size / 1024 / 1024 < 1

                if (!isLt1M) {
                    this.$Message.error({
                        content: '上传图片大小不能超过 1MB!'
                    })
                }
            },
            handleSuccess (res, file) {
                if (res.success) {
                    this.$Message.success('上传成功')
                    this.queryInfo()
                } else if (res.code === '-1') {
                } else {
                    this.$Message.error(res.message)
                }
            },
            // 查询
            search () {
                if (this.inputValue) {
                    let params = {
                        keyword: this.inputValue,
                        projectCode: ''
                    };

                    this.flag = true;
                    searchEquipment(params).then((res) => {
                        let that = this;
                        this.treeData = this.handleSearchValue(res.data, that);
                    });
                } else {
                    this.flag = false;
                    this.init();
                }
            },
            // 异步加载第4层数据,第5层数据
            loadData (item, callback) {
                // 存放请求回来的子节点数据
                this.arr = [item]
                return false
            },
            // 图片的显示渲染
            changeImg (item) {
                this.img = true;
                if (item.imgUrl) {
                    // 有图
                    //
                    setTimeout(() => {
                        this.$refs.img.src = item.imgUrl;
                        this.imgtext = '重新上传';
                    }, 200);
                } else {
                    this.equipmentType = item.equipmentType
                    this.imgtext = '上传图片';
                }
            },
            change (e) {
                this.arr = e;
            },
            // 定义拓扑图基本结构样式
            renderContent (h, { root, node, data }) {
                return h(
                    'span',
                    {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    },
                    [
                        h('span', [h('span', data.title)]),
                        h(
                            'span',
                            {
                                style: {
                                    display: 'inline-block',
                                    color: 'red'
                                }
                            }
                        )
                    ]
                );
            },
            // 收起全部
            allPackUp () {
                this.treeData.map((item) => {
                    changelist(item);
                    function changelist (item) {
                        if (item.expand) {
                            item.expand = false;
                        }
                        if (item.children) {
                            item.children.map((item) => {
                                changelist(item);
                            });
                        }
                    }
                    return item;
                });
            },
            // 控制开闸合闸
            operationStatus (data, status) {
                let str = [{
                    'mac': data.mac,
                    'addrOptInfos': [
                        {
                            'onOrOff': status === 'close',
                            'addrs': [
                                data.addr
                            ]

                        }
                    ]
                }]
                str = JSON.stringify(str)
                this.isOpen = false
                changeStatus(str).then((res) => {
                    if (res.code === 0) {
                        this.$message.success('命令已提交，生效中...')
                    } else {
                        // this.opendatas = res.data
                        this.$Message.error(res.data[0].mac + res.data[0].msg)
                    }
                });
            },
            changestate (e) {
                this.stateArr = e;
            },
            // 批量发送请求操作开关
            batchOperation (status) {
                if (this.stateArr.length === 0) {
                    this.$Message.error('请先选择线路')
                    return false
                }
                let arr = this.stateArr;

                let str = []
                arr.forEach(item => {
                    str.push(
                        {
                            'mac': item.mac,
                            'addrOptInfos': [
                                {
                                    'onOrOff': status === 'close',
                                    'addrs': [
                                        item.addr
                                    ]

                                }
                            ]

                        }
                    )
                })

                str = JSON.stringify(str)
                this.isOpen = false
                changeStatus(str).then((res) => {
                    this.modal = true
                    if (res.code === 0) {
                        this.$message.success('命令已提交，生效中...')
                    } else {
                        this.opendatas = res.data
                    }
                });
            },
            // 树形控件数据处理方法
            initTreeData (data) {
                // 给第3层数据添加前两级父节点的value值
                // 用于懒加载第4层数据 分别对应楼栋号，单元号，房屋号
                let arr = [];
                // 递归处理数据
                function recursive (data) {
                    let obj = data.map((item) => {
                        let newobj = {};
                        newobj['title'] = item.name;
                        newobj['expand'] = true;
                        arr.push(item.name);
                        if (item.mac) {
                            newobj['mac'] = item.mac;
                            newobj['children'] = [];
                            newobj['loading'] = false;
                            // newobj['expand'] = true
                            // 必须使用深拷贝，否则数据为引用类型，下一行删除数组就会影响par的值
                            newobj['par'] = JSON.parse(JSON.stringify(arr));
                        } else {
                            newobj['expand'] = false;
                        }
                        if (item.childs) {
                            newobj['children'] = recursive(item.childs);
                        }
                        // 每次遍历完删除数组都会删除对应的数据
                        // 例：每遍历完一条房屋号之后都会删除房号，下一条房屋号重新添加进去
                        // 同理，每次遍历完一条  单元/楼栋  之后都会删除  单元号/楼栋号，  下次调用重新添加
                        arr.pop();
                        return newobj;
                    });
                    return obj;
                }
                return recursive(data);
            },
            init () {
                let params = {
                    projectCode: this.$store.state.projectCode,
                    all: true
                };
                // 获取树形结构数据
                getBuildingList(params).then((res) => {
                    this.treeData = this.initTreeData(res.data);
                    function recursion (data, father) {
                        if (data.length > 0) {
                            data.forEach((item) => {
                                item.expand = true;
                                item['select-node'] = true;
                                recursion(item.children, item);
                            });
                        } else {
                            father.expand = false;
                            return false;
                        }
                    }
                    recursion(this.treeData);
                });
            },
            handleSearchValue (res, that) {
                let searchData = res.map((item) => {
                    if (item.equipmentType === 1) {
                        let obj = {};
                        obj['title'] = item.build;
                        obj['expand'] = true;
                        obj['children'] = [
                            {
                                title: item.unit,
                                expand: true,
                                children: [
                                    {
                                        title: item.room,
                                        expand: true,
                                        children: [
                                            {
                                                title: item.name,
                                                expand: true,
                                                mac: item.mac,
                                                imgUrl: item.imgUrl,
                                                loading: false,
                                                children: [],
                                                par: [ item.build, item.unit, item.room ],
                                                equipmentType: item.equipmentType,
                                                render: (h, { root, node, data }) => {
                                                    return h(
                                                        'span',
                                                        {
                                                            style: {
                                                                display: 'inline-block',
                                                                width: '100%'
                                                            },
                                                            on: {
                                                                click: () => {
                                                                    that.pictureName = '';
                                                                    // 当前查看的设备，用于给上传的图片命名
                                                                    let newstr =
                                                                        item.build +
                                                                        '-' +
                                                                        item.unit +
                                                                        '-' +
                                                                        item.room +
                                                                        '-' +
                                                                        data.title;
                                                                    JSON.parse(
                                                                        JSON.stringify((that.pictureName = newstr))
                                                                    );
                                                                }
                                                            }
                                                        },
                                                        [
                                                            h('span', [h('span', data.title)]),
                                                            h(
                                                                'span',
                                                                {
                                                                    style: {
                                                                        display: 'inline-block'
                                                                    }
                                                                },
                                                                [
                                                                    // 分闸合闸按钮
                                                                    h(
                                                                        'Button',
                                                                        {
                                                                            style: {
                                                                                width: '52px',
                                                                                height: '18px',
                                                                                borderColor: '#F24E4C',
                                                                                backgroundColor: 'none',
                                                                                color: '#F24E4C',
                                                                                borderRadius: '8px',
                                                                                padding: '0',
                                                                                marginLeft: '15px'
                                                                            },
                                                                            on: {
                                                                                click: (e) => {
                                                                                    e.stopPropagation();

                                                                                    this.batchdata = [];
                                                                                    if (data.children.length === 0) {
                                                                                        this.sys(data, true, true);
                                                                                    } else {
                                                                                        this.batchModal = true;
                                                                                        this.butType = true;
                                                                                        data.children.forEach((item) => {
                                                                                            this.batchdata.push({
                                                                                                addr: item.addr,
                                                                                                title: item.title,
                                                                                                mac: item.mac,
                                                                                                on: item.on,
                                                                                                _disabled:
                                                                                                    item.on === this.butType
                                                                                            });
                                                                                        });

                                                                                        this.batchContent = 1;
                                                                                    }
                                                                                    console.log(this.batchdata);
                                                                                }
                                                                            }
                                                                        },
                                                                        [
                                                                            h('i', {
                                                                                class: 'icon-v5 icon-v5-hezha',
                                                                                color: '#F24E4C',
                                                                                borderColor: '#F24E4C'
                                                                            }),
                                                                            h('span', { class: 'on' }, '合闸')
                                                                        ]
                                                                    ),
                                                                    h(
                                                                        'Button',
                                                                        {
                                                                            style: {
                                                                                width: '52px',
                                                                                height: '18px',
                                                                                borderColor: '#21F27F',
                                                                                backgroundColor: 'none',
                                                                                color: '#21F27F',
                                                                                borderRadius: '8px',
                                                                                padding: '0',
                                                                                marginLeft: '10px'
                                                                            },
                                                                            on: {
                                                                                click: (e) => {
                                                                                    e.stopPropagation();

                                                                                    this.batchdata = [];
                                                                                    if (data.children.length === 0) {
                                                                                        this.sys(data, true, false);
                                                                                    } else {
                                                                                        this.batchModal = true;
                                                                                        this.butType = false;
                                                                                        data.children.forEach((item) => {
                                                                                            this.batchdata.push({
                                                                                                addr: item.addr,
                                                                                                title: item.title,
                                                                                                mac: item.mac,
                                                                                                on: item.on,
                                                                                                _disabled:
                                                                                                    item.on === this.butType
                                                                                            });
                                                                                        });

                                                                                        this.batchContent = 1;
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        [
                                                                            h('i', {
                                                                                class: 'icon-v5 icon-v5-fenzha'
                                                                            }),
                                                                            h(
                                                                                'span',
                                                                                {
                                                                                    class: 'off'
                                                                                },
                                                                                '分闸'
                                                                            )
                                                                        ]
                                                                    )
                                                                ]
                                                            )
                                                        ]
                                                    );
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ];
                        return obj;
                    } else {
                        let obj = {};
                        obj['title'] = item.build;
                        obj['expand'] = true;
                        obj['children'] = [
                            {
                                title: item.unit,
                                expand: true,
                                children: [
                                    {
                                        title: item.room,
                                        expand: true,
                                        children: [
                                            {
                                                title: item.name,
                                                expand: true,
                                                mac: item.mac,
                                                imgUrl: item.imgUrl,
                                                loading: false,
                                                children: [],
                                                par: [ item.build, item.unit, item.room ],
                                                equipmentType: item.equipmentType,
                                                render: (h, { root, node, data }) => {
                                                    return h(
                                                        'span',
                                                        {
                                                            style: {
                                                                display: 'inline-block',
                                                                width: '100%'
                                                            },
                                                            on: {
                                                                click: () => {
                                                                    that.pictureName = '';
                                                                    // 当前查看的设备，用于给上传的图片命名
                                                                    let newstr =
                                                                        item.build +
                                                                        '-' +
                                                                        item.unit +
                                                                        '-' +
                                                                        item.room +
                                                                        '-' +
                                                                        data.title;
                                                                    JSON.parse(
                                                                        JSON.stringify((that.pictureName = newstr))
                                                                    );
                                                                }
                                                            }
                                                        },
                                                        [
                                                            h('span', [h('span', data.title)]),
                                                            h(
                                                                'span',
                                                                {
                                                                    style: {
                                                                        display: 'inline-block'
                                                                    }
                                                                },
                                                                []
                                                            )
                                                        ]
                                                    );
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ];
                        return obj;
                    }
                });
                return searchData;
            },
            sys (item, flags) {
                // if (this.flag) this.changeImg(item);
                const childrenData = [];
                let par = item.par;

                if (item.father) {
                    this.stopclick = false;// 第五级

                    let params = {
                        projectCode: this.$store.state.projectCode,
                        build: item.father[0],
                        unit: item.father[1],
                        room: item.father[2]
                    };
                    queryRoomEquipmentList(params).then((res) => {
                        if (res.success) {
                            let arr = res.data.filter(items => {
                                return items.name === item.fatherName
                            })
                            this.changeImg(arr[0]);
                        }
                    })
                    return false
                }
                this.stopclick = true;// 第四级
                //
                //
                if (item.children === undefined) {
                    let params = {
                        projectCode: this.$store.state.projectCode,
                        build: item.par[0],
                        unit: item.par[1],
                        room: item.par[2]
                    };
                    queryRoomEquipmentList(params).then((res) => {
                        if (res.success) {
                            let arr = res.data.filter(items => {
                                return items.name === item.title
                            })
                            this.changeImg(arr[0]);
                        }
                    })
                    return false
                }
                if (item.children.length === 0) {
                    item.loading = true;

                    if (!item.equipmentType) {
                        let params = {
                            projectCode: this.$store.state.projectCode,
                            build: item.par[0],
                            unit: item.par[1],
                            room: item.par[2]
                        };
                        queryRoomEquipmentList(params).then((res) => {
                            item.loading = false;
                            if (!res.data.length) {
                                this.$Message.error('该设备下面没有线路哦');
                                delete item.loading;
                                return false;
                            }
                            if (res.data.length) {
                                res.data.map((item) => {
                                    // 判断是不是空开设备，if添加开闸分闸 else没有开分闸
                                    if (item.equipmentType === 1) {
                                        childrenData.push({
                                            title: item.name,
                                            mac: item.mac,
                                            expand: false,
                                            children: [],
                                            loading: false,
                                            par: [ item.build, item.unit, item.room ],
                                            equipmentType: item.equipmentType,
                                            render: (h, { root, node, data }) => {
                                                return h(
                                                    'span',
                                                    {
                                                        style: {
                                                            display: 'inline-block',
                                                            width: '100%'
                                                        },
                                                        on: {
                                                            click: () => {
                                                                this.pictureName = '';
                                                                // 当前查看的设备，用于给上传的图片命名
                                                                par.map((item) => {
                                                                    this.pictureName += item + '-';
                                                                });

                                                                this.changeImg(item);
                                                                let newstr = this.pictureName + data.title;
                                                                JSON.parse(
                                                                    JSON.stringify((this.pictureName = newstr))
                                                                );

                                                                this.params.id = item.id;
                                                                this.params.equipmentType = item.equipmentType;
                                                                this.params.mac = item.mac;
                                                            }
                                                        }
                                                    },
                                                    [
                                                        h('span', [h('span', data.title)]),
                                                        h(
                                                            'span',
                                                            {
                                                                style: {
                                                                    display: 'inline-block'
                                                                }
                                                            },
                                                            [
                                                                h(
                                                                    'Button',
                                                                    {
                                                                        style: {
                                                                            width: '52px',
                                                                            height: '18px',
                                                                            backgroundColor: '#F24E4C',
                                                                            color: '#fff',
                                                                            borderRadius: '4px',
                                                                            padding: '0',
                                                                            marginLeft: '15px',
                                                                            boxShadow: '0px 1px 1px 0px #f9a8a7 inset,0px 0px 0px 0px #611f1e'
                                                                        },
                                                                        on: {
                                                                            click: (e) => {
                                                                                e.stopPropagation();

                                                                                this.batchdata = [];
                                                                                if (data.children.length === 0) {
                                                                                    this.sys(data, true, true);
                                                                                } else {
                                                                                    this.batchModal = true;
                                                                                    this.butType = true;
                                                                                    data.children.forEach((item) => {
                                                                                        this.batchdata.push({
                                                                                            addr: item.addr,
                                                                                            title: item.title,
                                                                                            mac: item.mac,
                                                                                            on: item.on,
                                                                                            _disabled: item.on === this.butType
                                                                                        });
                                                                                    });

                                                                                    this.batchContent = 1;
                                                                                }
                                                                                console.log(this.batchdata);
                                                                            }
                                                                        }
                                                                    },
                                                                    [
                                                                        h('img', {
                                                                            borderColor: '#21F27F',
                                                                            attrs: {
                                                                                src: hezha,
                                                                                width: '16px'
                                                                            }
                                                                        }),
                                                                        h('span', { class: 'on' }, '合闸')
                                                                    ]
                                                                ),
                                                                h(
                                                                    'Button',
                                                                    {
                                                                        style: {
                                                                            width: '52px',
                                                                            height: '18px',

                                                                            backgroundColor: '#22cb72',
                                                                            color: '#fff',
                                                                            borderRadius: '4px',
                                                                            padding: '0',
                                                                            marginLeft: '15px',
                                                                            boxShadow: '0px 1px 1px 0px #91f9c0 inset,0px 0px 0px 0px #0d6133'

                                                                        },
                                                                        on: {
                                                                            click: (e) => {
                                                                                e.stopPropagation();

                                                                                this.batchdata = [];
                                                                                if (data.children.length === 0) {
                                                                                    this.sys(data, true, false);
                                                                                } else {
                                                                                    this.batchModal = true;
                                                                                    this.butType = false;
                                                                                    data.children.forEach((item) => {
                                                                                        this.batchdata.push({
                                                                                            addr: item.addr,
                                                                                            title: item.title,
                                                                                            mac: item.mac,
                                                                                            on: item.on,
                                                                                            _disabled: item.on === this.butType
                                                                                        });
                                                                                    });

                                                                                    this.batchContent = 1;
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    [
                                                                        h('img', {
                                                                            borderColor: '#21F27F',
                                                                            attrs: {
                                                                                src: fenzha,
                                                                                width: '16px'
                                                                            }
                                                                        }),
                                                                        h('span', { class: 'on' }, '分闸')
                                                                    ]
                                                                )
                                                            ]
                                                        )
                                                    ]
                                                );
                                            }
                                        });
                                    } else {
                                        // let items = item

                                        childrenData.push({
                                            title: item.name,
                                            mac: item.mac,
                                            equipmentType: item.equipmentType,
                                            par: [ item.build, item.unit, item.room ],
                                            render: (h, { root, node, data }) => {
                                                return h(
                                                    'span',
                                                    {
                                                        style: {
                                                            display: 'inline-block',
                                                            width: '100%'
                                                        },
                                                        on: {
                                                            click: () => {
                                                                this.pictureName = '';
                                                                // 当前查看的设备，用于给上传的图片命名
                                                                par.map((item) => {
                                                                    this.pictureName += item + '-';
                                                                });

                                                                let newstr = this.pictureName + data.title;
                                                                JSON.parse(
                                                                    JSON.stringify((this.pictureName = newstr))
                                                                );

                                                                if (item.imgUrl) { document.querySelector('img').src = item.imgUrl; }
                                                                this.img = true;
                                                                this.params.id = item.id;
                                                                this.params.equipmentType = item.equipmentType;
                                                                this.params.mac = item.mac;
                                                            }
                                                        }
                                                    },
                                                    [
                                                        h('span', [h('span', data.title)]),
                                                        h(
                                                            'span',
                                                            {
                                                                style: {
                                                                    display: 'inline-block'
                                                                }
                                                            },
                                                            []
                                                        )
                                                    ]
                                                );
                                            }
                                        });
                                    }
                                });
                            } else {
                                this.$Message.error({
                                    content: '获取失败，请重试'
                                });
                            }
                            item.children = childrenData; // 放在子节点

                            if (flags) {
                                childrenData.forEach((item) => {
                                    this.batchdata.push({
                                        addr: item.addr,
                                        title: item.title,
                                        mac: item.mac,
                                        on: item.on,
                                        _disabled: item.on === this.butType
                                    });
                                });
                            }
                        });
                    } else if (item.equipmentType === 1) {
                        // 空开类型给线路添加开闸合闸按钮
                        queryEquipmentInfo({ mac: item.mac }).then((res) => {
                            item.loading = false;

                            if (!res.data.length) {
                                item.expand = false;
                                // delete item.render
                                // item = { title: 23135135 }
                                this.$Message.error('该设备下面没有线路哦');
                                delete item.loading;
                            } else {
                                res.data.map((item) => {
                                    childrenData.push({
                                        addr: item.addr,
                                        title: item.title ? item.title : item.mac,
                                        mac: item.mac,
                                        on: item.oc,
                                        expand: false,
                                        render: (h, { root, node, data }) => {
                                            return h(
                                                'span',
                                                {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }
                                                },
                                                [

                                                    h('span', [h('span', data.title)]),
                                                    h(
                                                        'span',
                                                        {
                                                            style: {
                                                                display: 'inline-block'
                                                            }
                                                        },
                                                        [
                                                            h(
                                                                'Button',
                                                                {
                                                                    style: {
                                                                        boxShadow: data.on === true ? '' : '0px 1px 1px 0px #f9a8a7 inset,0px 0px 0px 0px #611f1e',
                                                                        width: '52px',
                                                                        height: '18px',
                                                                        backgroundColor: data.on === true ? 'rgba(242, 78, 76, 0.2)' : '#f24e4c',
                                                                        color: '#fff',
                                                                        borderRadius: '4px 0px 0px 4px',
                                                                        cursor: data.on === true ? 'not-allowed' : '',
                                                                        padding: '0',
                                                                        marginLeft: '15px',
                                                                        border: 'none'
                                                                    },
                                                                    on: {
                                                                        click: () => {
                                                                            if (data.on !== true) {
                                                                                // this.operationStatus(data, 'open')
                                                                                this.isOpen = true;
                                                                                this.opendata = data;
                                                                                this.status = 'close';
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                [
                                                                    h('img', {
                                                                        borderColor: '#21F27F',
                                                                        attrs: {
                                                                            src: hezha,
                                                                            width: '16px'
                                                                        }
                                                                    }),
                                                                    h('span', { class: 'on' }, '合闸')
                                                                ]
                                                            ),
                                                            h(
                                                                'Button',
                                                                {
                                                                    style: {
                                                                        boxShadow: data.on === false ? '' : '0px 1px 1px 0px #91f9c0 inset,0px 0px 0px 0px #0d6133',
                                                                        width: '52px',
                                                                        height: '18px',
                                                                        backgroundColor: data.on === false ? 'rgba(33, 242, 127, 0.2)' : ' rgba(33, 242, 127, 0.8)',
                                                                        cursor: data.on === false ? 'not-allowed' : '',
                                                                        color: '#fff',
                                                                        borderRadius: '0px 5px 5px 0px',
                                                                        padding: '0',
                                                                        border: 'none'
                                                                    },

                                                                    on: {
                                                                        click: () => {
                                                                            if (data.on !== false) {
                                                                                // this.operationStatus(data, 'open')
                                                                                this.isOpen = true;
                                                                                this.opendata = data;
                                                                                this.status = 'open';
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                [
                                                                    h('img', {
                                                                        // class: 'icon-v5 icon-v5-hezha',
                                                                        // color: '#21F27F',
                                                                        borderColor: '#21F27F',

                                                                        attrs: {
                                                                            src: fenzha,
                                                                            width: '16px'
                                                                        }
                                                                    }),
                                                                    h(
                                                                        'span',
                                                                        {
                                                                            class: 'off'
                                                                        },
                                                                        '分闸'
                                                                    )
                                                                ]
                                                            )
                                                        ]
                                                    )
                                                ]
                                            );
                                        }
                                    });
                                });
                                item.children = childrenData;
                                item.children.forEach((itemc) => {
                                    itemc.father = item.par;
                                    itemc.fatherName = item.title;
                                });
                                //
                                if (flags) {
                                    this.batchModal = true;
                                    this.butType = false;
                                    childrenData.forEach((item) => {
                                        this.batchdata.push({
                                            addr: item.addr,
                                            title: item.title,
                                            mac: item.mac,
                                            on: item.on,
                                            _disabled: item.on === this.butType
                                        });
                                    });
                                    this.batchContent = 1;
                                }
                            }
                        });
                    }
                    setTimeout(() => {
                        if (item.loading) {
                            item.loading = false;
                            this.$Message.error = '加载失败';
                        }
                    }, 6000);
                }
            },
            changebutType (newVal, data) {
                this.butType = newVal;
                // this.columns4

                data.forEach((item) => {
                    // 删掉禁用
                    if (item._disabled) delete item._disabled;
                    // item._disabled = false
                });
                data.forEach((item) => {
                    if (item.on === this.butType) {
                        // 同类型就禁掉
                        item._disabled = true;
                    }
                });
                this.batchdata = data;
            }
        },
        created () {
            this.init();
        },
        watch: {
            '.$refs.img.src': {
                handler (newVal, oldVal) {
                }
            },
            childrenData: {
                handler (newVal, oldVal) {
                    this.childrenData = newVal;
                }
            },
            arr: {
                handler (newVal, oldVal) {
                    if (newVal.length !== 0) {
                        this.arr[0].expand = !newVal[0].expand;
                        if (newVal[0].mac) {
                            if (newVal[0].par === undefined) {
                                newVal[0].par = [
                                    this.treeData[0].title,
                                    this.treeData[0].children[0].title,
                                    this.treeData[0].children[0].children[0].title
                                ]
                            }
                            if (newVal[0].father) {
                                this.sys(this.arr[0]);
                                return false
                            }
                            if (newVal[0].title !== newVal[0].par[2]) {
                                this.img = true;
                            } else {
                                this.img = false;
                            }

                            this.sys(this.arr[0]);
                        } else {
                            this.img = false;
                        }
                    } else {
                        this.arr = oldVal;
                    }
                }
            },
            treeData: {
                handler (newVal, oldVal) {
                    //
                    if (newVal) {
                        this.treeData = newVal;
                        //
                    }
                },
                deep: true
            },
            batchdata: {
                handler (newVal, oldVal) {
                    this.batchdata = newVal;
                },
                deep: true
            },
            butType: {
                handler (newVal, oldVal) {
                    this.butType = newVal;
                }
            },
            img: {
                handler (newVal, oldVal) {
                    this.img = newVal;
                }
            },
            params: {
                handler (newVal, oldVal) {
                    this.imgData.mac = newVal.mac;
                },
                deep: true
            }
        }
    };
</script>
<style lang="less" scoped>
#left {
  width: 100%;
  height: 800px;
  margin-top: 10px;
  background-color: #1a202e;
  .header {
    width: 100%;
    height: 96px;
    border-bottom: 1px solid #3d3d41;
    position: relative;
    .span {
      display: block;
      padding-top: 23px;
      margin-left: 23px;
      font-size: 16px;
      font-weight: 600;
    }
    .Button {
      width: 80px;
      height: 36px;
      position: absolute;
      top: 15px;
      right: 19px;
      // text-align: center;
      color: #007eff;
      border: 1px solid #007eff;
      span {
        margin-left: -4px;
      }
    }
    .search.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text {
      position: absolute;
      left: 12px;
      bottom: 10px;
      width: 500px;
      border: none;
    }
    .search.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text
      .ivu-input.ivu-input-default.ivu-input-no-border.ivu-input-with-prefix {
      border-color: #1a202e;
    }
  }
  .tree {
    width: 100%;
    height: 672px;
    overflow: hidden;
    overflow-y: auto;
  }
  .tree::-webkit-scrollbar {
    display: none;
  }
}
#right {
  width: 100%;
  height: 800px;
  margin-top: 10px;
  background: #1a202e;
  position: relative;
  .Button {
      width: 80px;
      height: 36px;
      color: #007eff;
      border: 1px solid #007eff;
      background-color: #1a202e;
      span {
        margin-left: -4px;
      }
    }
  .narrator {
    float: left;
    width: 10px;
    height: 100%;
    background: #090f19;
  }

    .ivu-upload{
        margin-top: 8px;
        margin-right: 10px;
        float: right;
    }
  .ivu-upload-drag {
    width: 80px;
    height: 36px;

    border: none;
    .Button {
      width: 80px;
      height: 36px;
      color: #007eff;
      border: 1px solid #007eff;
      background-color: #1a202e;
      span {
        margin-left: -4px;
      }
    }
  }
//   .ivu-upload-drag {
//     background: #fff;
//     border: 1px dashed #dcdee2;
//     border-radius: 4px;
//     text-align: center;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//     transition: border-color 0.2s ease;
//   }
  .header {
    width: 100%;
    // float: left;
    height: 70px;
    position: relative;
    .span {
      // display: inline-block;
      float: left;
      width: 100px;
      padding-top: 23px;
      margin-left: 43px;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .imgbox {
    width: 90%;
    height: 700px;
    overflow: hidden;
    overflow-y: auto;
    img {
      width: 100%;
      height: 562px;
      text-align: center;
      position: relative;
      top: 5%;
      padding: 0 5% 0 10%;
    }
    .null {
      width: 100%;
      text-align: center;
      position: relative;
      top: 20%;
      color: #999;
      font-size: 16px;
    }
  }
  .imgbox::-webkit-scrollbar {
    display: none;
  }
  .ivu-upload-drag {
    width: 80px;
    height: 36px;
    // background: #007EFF;
    border: none;
  }
}
.tab {
  width: 100%;
  height: 42px;
  line-height: 42px;
  border: 1px solid #999;
  // margin-top: 0px;
  font-size: 15px;
  margin-bottom: -20px;
  //   text-align: center;
}

</style>
