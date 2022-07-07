<template>
  <div id="first-choice" class="mt-20">
    <Row class="alarm-sound-tip" v-show="showTip">
      <Col :span="22">
        <span>
          <i class="icon-v5 icon-v5-xiaoxi"></i>
          ：未配置时,除浪涌、打火、通讯、缺相、三相、离线、分闸、合闸的告警外，其它告警默认接收
        </span>
      </Col>
      <!-- <Col :span="1" style="padding-left:90px"> <Icon type="md-close" @click="showTip=false" /></Col> -->
    </Row>
    <Row style="padding: 10px;display:flex;justify-content: space-between;">
      <Col style="display:flex">
        <Col>
          <Input
            style="width: 154px"
            v-model="projectName"
            placeholder="请输入项目名称"
          ></Input>
        </Col>
        <Col style="margin-left: 10px"
          ><Button type="primary" @click="onSubmit">查询</Button></Col
        >
      </Col>

      <Col style="margin-left: 10px">
        <Button type="primary" @click="handleAddProject"> 添加 </Button>
      </Col>
    </Row>
    <Table :data="data" :columns="columnsDatas">
      <template slot-scope="{ row, index }" slot="attitude">
        <Button
          type="primary"
          size="small"
          ghost
          @click="handleAddAlarm(row.alarmList, index)"
          >添加</Button
        >
        <Tag
          v-for="tag in row.alarmList"
          :key="tag.typeNumber"
          closable
          :name="tag.alarmInfo"
          :disable-transitions="false"
          @on-close="handleTypesClose(row.alarmList, tag)"
        >
          <span>{{ tag.alarmInfo }}</span>
        </Tag>
      </template>
      <template slot-scope="{ row }" slot="frequence">
        <Input
          size="small"
          v-if="row.acceptType === 1"
          v-model.number.trim="row.frequence"
          @input="handleFrequence"
          placeholder="请输入"
        ></Input>
      </template>
      <template slot-scope="{ row }" slot="acceptType">
        <Switch v-model="row.acceptType" :true-value="1" :false-value="2">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </Switch>
      </template>
      <template slot-scope="{ row }" slot="operation">
        <Button type="text" size="small" @click="handleSave(row)">
          <span style="color: #007eff">保存</span>
        </Button>
        <Button type="text" size="small" @click="handleDel(row, index)">
          <span style="color: #ff5b59">移除</span>
        </Button>
      </template>
    </Table>
    <!-- <Page :page-size="10"> </Page> -->
    <div class="tc" style="margin-top: 15px">
      <Button @click="handlePage('home')"> 首页 </Button>
      <Button @click="handlePage('prev')" :disabled="lastId < 1">上一页</Button>
      <Button @click="handlePage('next')" :disabled="length < 10"
        >下一页
      </Button>
    </div>
    <Modal
      :mask="false"
      title="告警类型的选择"
      v-model="flag"
      @on-cancel="flag = false"
      @on-ok="handleSaveTypes"
    >
      <!-- <checkboxgroup
        v-model="alarmTypeList"
        ref="typesCheckboxGroup"
      ></checkboxgroup> -->
      <div class="checkbox-group">
        <CheckboxGroup
          v-model="checkedLists"
          @on-change="handleCheckedTypesChange"
        >
          <Checkbox
            v-for="(item, index) in lists"
            :label="item.typeNumber"
            :key="index"
            :value="item.typeNumber"
            >{{ item.info }}</Checkbox
          >
        </CheckboxGroup>
        <Checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @on-change="handleCheckAllChange"
          >全选</Checkbox
        >
      </div>
      <hr />
      <div class="checkbox-group">
        <CheckboxGroup
          v-model="checkedLists2"
          @on-change="handleCheckedTypesChange2"
        >
          <Checkbox
            v-for="(item, index) in lists2"
            :label="item.typeNumber"
            :key="index"
            :value="item.typeNumber"
            >{{ item.info }}</Checkbox
          >
        </CheckboxGroup>
        <Checkbox
          :indeterminate="isIndeterminate2"
          v-model="checkAll2"
          @on-change="handleCheckAllChange2"
          >全选</Checkbox
        >
      </div>
    </Modal>
    <Modal
      title="项目选择"
      :mask="false"
      class="project-selection"
      :mask-closable="false"
      footer-hide
      style="width: 800px"
      v-model="projectsFlag"
      @on-visible-change="handleCloseProjects"
    >
      <ProjectSelect
        v-model="projectLists"
        @closeProjects="projectsFlag = false"
        type="firstChoice"
      ></ProjectSelect>
      <div slot="footer"></div>
    </Modal>
    <Modal
      v-model="modalnotice"
      title="提示"
      @on-ok="removeOk"
      @on-cancel="removeCancel"
    >
      <p>此操作将永久删除该配置, 是否继续?</p>
    </Modal>
  </div>
</template>

<script>
    import ProjectSelect from '../../Common/ProjectSelect.vue';
    // import checkboxgroup from '../../Common/CheckboxGroup';
    import store from '@/store';
    import {
        preferences,
        queryPoPup,
        updatePoPup,
        queryAlarmForConfig,
        prjAlarmConfigSave,
        prjAlarmConfigDel
    } from '@/api/public';
    export default {
        name: 'firstchoice',
        components: { ProjectSelect },
        data () {
            return {
                showTip: true,
                checkAll: false,
                checkAll2: false,
                isIndeterminate: true,
                isIndeterminate2: true,
                checkedLists: [],
                checkedLists2: [],
                origin: '',
                lists: [],
                lists2: [],
                checkedOptions: [],
                columnsDatas: [
                    { title: '项目', key: 'projectName' },
                    { title: '告警类型', slot: 'attitude', align: 'left' },
                    { title: '频限(秒)', slot: 'frequence', width: 150 },
                    { title: '接收状态', slot: 'acceptType', width: 100 },
                    { title: '操作', slot: 'operation', width: 130, align: 'center' }
                ],
                statusSwitch: false,
                modalnotice: false,
                index: 0,
                projectsFlag: false,
                projectLists: [],
                data: [],
                page: [],
                length: 0,
                lastId: 0,
                projectName: '',
                alarmTypeList: [],
                flag: false,
                rowMsges: '',
                rowIndexs: '',
                values: []
            };
        },
        created () {
            this.queryConfig();
        },
        mounted () {
            this.queryAlarmSystem();
            this.init();
        },

        methods: {
            queryConfig () {
                queryAlarmForConfig({})
                    .then((res) => {
                        this.lists = res.data.alarms;
                        this.lists2 = res.data.warns;
                        store.commit(
                            'alarmForConfig',
                            res.data.alarms.concat(res.data.warns)
                        );
                        this.renderer();
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
            renderer () {
                this.checkedLists = [];
                this.checkedLists2 = [];
                // this.lists.map((value) => {
                //     this.checkedOptions.map((item) => {
                //         if (item === value.typeNumber) this.checkedLists.unshift(item);
                //     });
                // });
                // this.lists2.map((value) => {
                //     this.checkedOptions.map((item) => {
                //         if (item === value.typeNumber) this.checkedLists2.unshift(item);
                //     });
                // });
                this.checkAll = this.checkedLists.length === this.lists.length;
                this.checkAll2 = this.checkedLists2.length === this.lists2.length;
                this.isIndeterminate =
                    this.checkedLists.length > 0 &&
                    this.checkedLists.length < this.lists.length;
                this.isIndeterminate2 =
                    this.checkedLists2.length > 0 &&
                    this.checkedLists2.length < this.lists2.length;
            },
            queryAlarmSystem () {
                queryPoPup({})
                    .then((res) => {
                        if (res.success) {
                            this.checkedLists = res.data !== '' ? res.data.split(',') : [];
                            this.checkedLists2 = res.data !== '' ? res.data.split(',') : [];
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
            handleSubmitSystems () {
                this.checkedLists = this.checkedLists.concat(this.checkedLists2);
                let params = {
                    typeNumbers: this.checkedLists.join()
                };

                updatePoPup(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '修改成功'
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
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
                //     .finally(() => {
                //         // this.alarmTypeList = this.alarmTypeList.split(',')
                //         this.queryAlarmSystem();
                // });
            },
            changeList (origin) {
                this.origin = origin;
            },
            handleCheckAllChange (val) {
                this.checkedLists = val
                    ? this.lists.map((item) => {
                        return item.typeNumber;
                    })
                    : [];
                // this.$emit('change', [
                //     ...new Set([...this.checkedLists, ...this.checkedLists2])
                // ]);
                this.isIndeterminate = false;
            },
            handleCheckAllChange2 (val) {
                this.checkedLists2 = val
                    ? this.lists2.map((item) => {
                        return item.typeNumber;
                    })
                    : [];
                // this.$emit('change', [
                //     ...new Set([...this.checkedLists, ...this.checkedLists2])
                // ]);
                this.isIndeterminate2 = false;
            },
            handleCheckedTypesChange (value) {
                this.values = value;

                let checkedCount = value.length;
                this.checkAll = checkedCount === this.lists.length;
                this.isIndeterminate =
                    checkedCount > 0 && checkedCount < this.lists.length;
            },
            handleCheckedTypesChange2 (value) {
                let checkedCount = value.length;
                this.checkAll2 = checkedCount === this.lists2.length;
                this.isIndeterminate2 =
                    checkedCount > 0 && checkedCount < this.lists2.length;
            },
            init () {
                this.queryPreference();
            },
            handleAddProject () {
                if (this.length === this.data.length - 1) return false;
                this.projectsFlag = true;
                this.projectLists = [];
            },
            onSubmit () {
                this.lastId = 0;
                this.queryPreference();
            },
            queryPreference () {
                this.data = [];
                this.length = 0;
                let parmas = {
                    keyword: this.projectName,
                    pageSize: 10,
                    lastId: this.lastId
                };
                preferences(parmas)
                    .then((res) => {
                        if (res.success) {
                            this.data = res.data;
                            this.length = res.data.length;
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
                    })
                    .finally(() => {});
            },
            handleAddAlarm (row, index, origin) {
                this.index = index;
                this.checkedLists = row.map((item) => {
                    return item.typeNumber;
                });
                this.flag = true;
                if (origin) {
                    this.$nextTick(() => {
                        this.$refs.typesCheckboxGroup.changeList(origin);
                    });
                }
            },
            handleTypesClose (row, tag) {
                let index = row.indexOf(tag);
                if (index > -1) row.splice(index, 1);
            },
            handleFrequence (val) {
                if (val < 0 || val > 2592000) {
                    this.$Message.error({
                        content: '范围在0 ~ 2592000'
                    });
                } else {
                    if (val === '') {
                        this.$Message.error({
                            content: '必填'
                        });
                    }
                }
            },
            handleSave (row) {
                if (row.alarmList.length === 0 || row.frequence === '') {
                    this.$Message.error({
                        content: '每项配置最少选择一项'
                    });
                    return false;
                }
                if (row.frequence < 0 || row.frequence > 2592000) {
                    this.$Message.error({
                        content: '范围在 0 ~ 2592000'
                    });
                    return false;
                }
                row.typeNumbers = row.alarmList.map((item) => {
                    return item.typeNumber;
                });
                row.typeNumbers = row.typeNumbers.join(',');
                delete row.projectName;
                delete row.alarmList;
                prjAlarmConfigSave(row)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.queryPreference();
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
            handleDel (row, index) {
                if (row.id === 0) {
                    this.data.splice(index, 1);
                } else {
                    this.modalnotice = true;
                    this.rowMsges = row;
                    this.rowIndexs = index;
                }
            },
            removeOk () {
                prjAlarmConfigDel({
                    id: this.rowMsges.id,
                    projectCode: this.rowMsges.projectCode
                })
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: res.message
                            });
                            this.queryPreference();
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
            removeCancel () {
                this.modalnotice = false;
                this.$Message.info({
                    content: '取消删除'
                });
            },
            handlePage (e) {
                if (e === 'home') {
                    this.lastId = 0;
                    this.page = [];
                } else if (e === 'prev') {
                    this.page.pop();
                    if (this.page.length <= 0) {
                        this.lastId = 0;
                    } else {
                        this.lastId = this.page[this.page.length - 1];
                    }
                } else if (e === 'next') {
                    this.lastId = this.data[this.data.length - 1].id;
                    this.page.push(this.data[this.data.length - 1].id);
                }
                this.queryPreference();
            },
            noRepeat (arr) {
                var newArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (newArr.indexOf(arr[i]) === -1) {
                        newArr.push(arr[i]);
                    }
                }
                return newArr;
            },
            handleSaveTypes () {
                let cfg = this.$store.state.alarmForConfig;
                this.data[this.index].alarmList = [];
                // let checked = this.checkedLists.concat(this.checkedLists2);
                // let checkList = this.noRepeat(checked);
                cfg.forEach((value) => {
                    this.values.forEach((item) => {
                        if (value.typeNumber === item) {
                            this.data[this.index].alarmList.push({
                                typeNumber: value.typeNumber,
                                alarmInfo: value.info
                            });
                        }
                    });
                });
                this.flag = false;
            },
            handleCloseProjects (val) {
                if (!val) {
                    this.projectsFlag = false;
                    this.projectLists.map((item, index) => {
                        this.data.unshift({
                            acceptType: 1,
                            projectCode: item.code,
                            frequence: 60,
                            alarmList: [],
                            id: 0,
                            projectName: item.name
                        });
                    });
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.alarm-sound-tip {
  font-size: 14px;
  padding: 5px;
  margin-left: 10px;
  border: 1px solid;
  background: #1a202e;
  color: #999999;
}
</style>
