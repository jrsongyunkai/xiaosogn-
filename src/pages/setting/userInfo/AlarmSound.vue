<template>
  <div>
    <Row class="alarm-sound-tip"
      ><span> <i class="icon-v5 icon-v5-xiaoxi"></i>：报警声音变更后，请重新登录生效</span>
    </Row>
    <Row>
      <Col :span="22"><h3 style="padding: 9px">报警声音</h3></Col>
      <Col style="padding: 9px;margin-left:20px">
        <Button type="primary" @click="addAlarmSound">
          添加
        </Button>
      </Col>
    </Row>
    <Table :data="SoundList" :columns="SoundTable">
      <template slot-scope="{ row, index }" slot="sound">
        <div class="voice-file">
            <span class="choice"  @click="selectAdd(index)">选择<input
              type="file"
              style="display: none"
              accept=".mp3"
              name="warnAudio"
              id="people-export"
              ref="inputer"
              @change="fileUpload"
            /></span>

          <span class="path" v-show="row.path !== ''">{{ row.path.split('_')[1] }}</span>
          <span
            v-if="row.path !== ''"
            class="danger-pra"
            style="margin: 0 10px"
            @click="viocePaly(row, index)"
            >试听
            <audio :src="row.path" ref="audio"></audio>
          </span>
          <span
            v-if="row.path !== ''"
            class="danger-text"
            @click="delVoiceFlie(row.path, index)"
            >删除</span
          >
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="alarmType">
        <span
          class="choice"
          style="margin-top:5px"
          @click="handleAdd(row.typeNumbers, index)"
          >添加</span
        >
        <Tag
          v-for="tag in row.typeNumbers"
          :key="tag.typeNumber"
          closable
          :name="tag.alarmInfo"
          :disable-transitions="false"
          @on-close="handleTypesClose(row.typeNumbers, tag)"
        >
          <span>{{ tag.alarmInfo }}</span>
        </Tag>
      </template>
      <template slot-scope="{ row, index }" slot="operation">
        <Button type="text" @click="handleSave(row)"
          ><span style="color: #007eff">保存</span></Button
        >
        <Button type="text" @click="handleDel(row, index)">
          <span style="color: #ff5b59">移除</span></Button
        >
      </template>
    </Table>
    <!-- <Modal
      v-model="modalnotice"
      title="提示"
      @on-ok="removeOk"
      @on-cancel="removeCancel"
    >
      <p>此操作将永久删除该关联账号, 是否继续?</p>
    </Modal> -->
    <Modal
      :mask="false"
      title="告警类型的选择"
      v-model="flag"
      @on-cancel="flag = false"
      @on-ok="handleSaveTypes"
    >
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
  </div>
</template>

<script>
    import store from '@/store';
    import {
        delAlarmSound,
        saveAlarmSound,
        updateAlarmSound,
        queryAlarmSound,
        updatePoPup,
        queryPoPup,
        queryAlarmForConfig,
        soundDel
    } from '@/api/public';
    export default {
        data () {
            return {
                checkAll: false,
                checkAll2: false,
                isIndeterminate: true,
                isIndeterminate2: true,
                checkedLists: [],
                checkedLists2: [],
                SoundTable: [
                    { title: '声音文件', slot: 'sound', width: 400 },
                    { title: '告警类型', slot: 'alarmType' },
                    { title: '操作', slot: 'operation', width: 200 }
                ],
                origin: '',
                lists: [],
                lists2: [],
                rowMsges: '',
                rowIndexs: '',
                modalnotice: false,
                SoundList: undefined,
                length: 0,
                index: '',
                flag: false,
                ctxPaths: 'ctxPaths',
                alarmTypeList: []
            };
        },
        created () {
            this.init();
            this.queryConfig();
        },
        mounted () {
            this.queryAlarmSystem();
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
            queryAlarmSystem () {
                queryPoPup({})
                    .then((res) => {
                        if (res.success) {
                            let arr = res.data.split(',');
                            let arrs = []
                            let arrs2 = []

                            this.lists.forEach(item => {
                                arr.forEach(items => {
                                    if (items === item.typeNumber) {
                                        arrs.push(items)
                                    }
                                })
                            })
                            this.lists2.forEach(item => {
                                arr.forEach(items => {
                                    if (items === item.typeNumber) {
                                        arrs2.push(items)
                                    }
                                })
                            })

                            this.checkedLists = arrs
                            this.checkedLists2 = arrs2
                            if (arrs.length === this.lists.length) {
                                this.checkAll = true
                                this.isIndeterminate = false
                            } else if (arrs.length === 0) {
                                this.checkAll = false
                                this.isIndeterminate = false
                            } else {
                                this.checkAll = false
                                this.isIndeterminate = true
                            }
                            if (arrs2.length === this.lists2.length) {
                                this.checkAll2 = true
                                this.isIndeterminate2 = false
                            } else if (arrs2.length === 0) {
                                this.checkAll2 = false
                                this.isIndeterminate2 = false
                            } else {
                                this.checkAll2 = false
                                this.isIndeterminate2 = true
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
            handleSubmitSystems () {
                this.checkedLists = this.checkedLists.concat(this.checkedLists2);
                let params = {
                    typeNumbers: this.checkedLists.join()
                };
                updatePoPup(params)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '保存成功'
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
                    })
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
            handleCheckedTypesChange (data) {
                if (data.length === this.lists.length) {
                    this.isIndeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.isIndeterminate = true;
                    this.checkAll = false;
                } else {
                    this.isIndeterminate = false;
                    this.checkAll = false;
                }
            },
            handleCheckedTypesChange2 (data) {
                if (data.length === this.lists2.length) {
                    this.isIndeterminate2 = false;
                    this.checkAll2 = true;
                } else if (data.length > 0) {
                    this.isIndeterminate2 = true;
                    this.checkAll2 = false;
                } else {
                    this.isIndeterminate2 = false;
                    this.checkAll2 = false;
                }
            },
            renderer () {
                // this.checkedLists = [];
                // this.checkedLists2 = [];
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
                // this.checkAll = this.checkedLists.length === this.lists.length;
                // this.checkAll2 = this.checkedLists2.length === this.lists2.length;
                // this.isIndeterminate =
                //     this.checkedLists.length > 0 &&
                //     this.checkedLists.length < this.lists.length;
                // this.isIndeterminate2 =
                //     this.checkedLists2.length > 0 &&
                //     this.checkedLists2.length < this.lists2.length;
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
                this.SoundList[this.index].typeNumbers = [];

                let checked = this.checkedLists.concat(this.checkedLists2);
                //

                cfg.forEach((value) => {
                    checked.forEach((item) => {
                        if (value.typeNumber === item) {
                            this.SoundList[this.index].typeNumbers.push({
                                typeNumber: value.typeNumber,
                                alarmInfo: value.info
                            });
                        }
                    });
                });
                // this.handleSubmitSystems()

                this.flag = false;
            },
            init () {
                this.QueryAlarm();
            },
            QueryAlarm () {
                queryAlarmSound({})
                    .then((res) => {
                        if (res.success) {
                            this.SoundList = res.data;
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
            addAlarmSound () {
                if (this.length === this.SoundList.length - 1) return false;
                if (this.SoundList === undefined) {
                    this.SoundList = [];
                }
                let obj = {
                    id: 0,
                    path: '',
                    typeNumbers: []
                };
                this.SoundList.unshift(obj);
            },
            selectAdd (index) {
                this.$refs.inputer.click();
                this.index = index;
            },
            fileUpload (e) {
                let file = e.target.files;

                let size = file[0].size;
                if (size / 1024 > 150) {
                    this.$Message.error({
                        content: '上传声音文件不能超过 150KB!'
                    });
                    return;
                }
                let formData = new FormData();
                formData.append('name', 'warnAudio');
                formData.append('warnAudio', file[0]);
                for (let value of formData.values()) {

                }
                updateAlarmSound(formData)
                    .then((res) => {
                        if (res.success) {
                            this.SoundList[this.index].path = res.data;
                            e.target.value = '';
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
            },
            viocePaly (row, index) {
                this.$refs.audio.src = row.path;
                this.$refs.audio.addEventListener(
                    'loadedmetadata',
                    () => {
                        this.$refs.audio.currentTime = 0;
                    },
                    false
                );
                this.$refs.audio.play();
                setTimeout(() => {
                    this.$refs.audio.pause();
                }, 3000);
            },
            delVoiceFlie (path, index) {
                delAlarmSound({ path: path })
                    .then((res) => {
                        if (res.success) {
                            this.SoundList[index].path = '';
                            this.$Message.success({
                                content: '删除成功'
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
                                content: '未知错误,请刷新重试'
                            });
                        }
                });
            },
            changeList (origin) {
                this.origin = origin;
            },
            handleAdd (row, index) {
                this.index = index;

                let arr = []
                let arr2 = []
                this.lists.forEach(item => {
                    arr.push(item.typeNumber)
                })
                this.lists2.forEach(item => {
                    arr2.push(item.typeNumber)
                })
                this.checkedLists = []
                this.checkedLists2 = []
                row.forEach(item => {
                    arr.forEach(items => {
                        if (item.typeNumber === items) {
                            this.checkedLists.push(items)
                        }
                    })
                })
                row.forEach(item => {
                    arr2.forEach(items1 => {
                        if (item.typeNumber === items1) {
                            this.checkedLists2.push(items1)
                        }
                    })
                })

                this.flag = true;
            },
            handleTypesClose (row, tag) {
                let index = row.indexOf(tag);
                if (index > -1) row.splice(index, 1);
            },
            handleSave (row) {
                if (row.path === '' || row.typeNumbers.length === 0) {
                    this.$Message.error({
                        content: '配置至少选择一项'
                    });
                    return false;
                }
                row.typeNumbers = row.typeNumbers.map((item) => {
                    return item.typeNumber;
                });
                let paramsRow = row
                // paramsRow._index = undefined
                // paramsRow._rowKey = undefined
                let parmars = JSON.stringify(paramsRow)
                //
                saveAlarmSound(parmars)
                    .then((res) => {
                        if (res.success) {
                            this.$Message.success({
                                content: '保存成功'
                            });
                            this.QueryAlarm();
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
            },
            handleDel (row, index) {
                if (row.id === 0) {
                    this.SoundList.splice(index, 1);
                } else {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '此操作将永久删除该配置, 是否继续?',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            soundDel({ id: row.id })
                                .then((res) => {
                                    if (res.success) {
                                        if (res.code === '0') {
                                            this.orientationVisible = false;
                                            this.$Message.success({
                                                content: res.message
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
                }
            }
        },
        watch: {
            origin: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.origin = newVal;
                    }
                }
            },
            checkedLists: {
                handler (newVal, oldVal) {
                    this.checkedLists = newVal
                },
                deep: true
            },
            checkedLists2: {
                handler (newVal, oldVal) {
                    this.checkedLists2 = newVal
                },
                deep: true
            }
        }
    };
</script>

<style lang="less" scoped>
.alarm-sound-tip {
  font-size: 14px;
  padding: 5px;
  border: 1px solid;
  background: #1a202e;
  color: #999999;
}
.choice{
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007EFF;
    border-radius: 5px;
    color: #007EFF;
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    padding: 0 10px;
    margin-right: 16px;
    display: inline-block;
}
.ivu-tag {
    height: 34px;
    line-height: 34px;
}
</style>
