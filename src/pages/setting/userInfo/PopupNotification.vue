<template>
  <div>
      <Tag class="tab" color="primary"
              ><Icon color="#999" type="md-chatboxes" />
              <span style="color: #999"
                >&nbsp;&nbsp;&nbsp;提示：未勾选的通知类型，将不被统计计入隐患查询中。</span
              >
            </Tag>
    <div class="checkbox-group" style="display:flex">
     <div style="width:180px;height:188px;border:1px dashed #ccc;text-align:center;line-height:188px;margin-top:10px">
        <Checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @on-change="handleCheckAllChange"
        style="width:170px"
        >报警</Checkbox>

     </div>
        <CheckboxGroup
        v-model="checkedLists"
        @on-change="handleCheckedTypesChange"
        style="padding-left:50px"
      >
        <Checkbox
          v-for="(item, index) in lists"
          :label="item.typeNumber"
          :key="index"
          :value="item.typeNumber"
          style="line-height:40px;width:150px"
          >{{ item.info }}</Checkbox
        >
      </CheckboxGroup>

    </div>
    <!-- </div> -->

    <div class="checkbox-group" style="display:flex">
     <div style="width:180px;height:100px;border:1px dashed #ccc;text-align:center;line-height:100px;margin-top:20px">
       <Checkbox
        :indeterminate="isIndeterminate2"
        v-model="checkAll2"
        @on-change="handleCheckAllChange2"
         style="width:170px"
        >预警</Checkbox
      >
     </div>
     <div style="width:80%">
       <CheckboxGroup
        v-model="checkedLists2"
        @on-change="handleCheckedTypesChange2"
        style="padding-top:20px;padding-left:50px"
      >
        <Checkbox
          v-for="(item, index) in lists2"
          :label="item.typeNumber"
          :key="index"
          :value="item.typeNumber"
         style="line-height:40px;width:150px"
          >{{ item.info }}</Checkbox
        >
      </CheckboxGroup>
     </div>
    </div>
    <div class="tc mt-20">
      <Button plain size="small" style="margin-top:50px" @click="handleSubmitSystems">保存</Button>
    </div>
  </div>
</template>

<script>
    import store from '@/store';
    import { queryPoPup, updatePoPup, queryAlarmForConfig } from '@/api/public';
    export default {
        //  components: { checkboxgroup },
        data () {
            return {
                checkAll: true,
                checkAll2: true,
                isIndeterminate: true,
                isIndeterminate2: true,
                checkedLists: [],
                checkedLists2: [],
                origin: '',
                lists: [],
                lists2: [],
                checkedOptions: [],
                listNewVal: [],
                listNewVal2: [],
                res: {}
            };
        },
        created () {
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
            renderer () {
                this.lists.map((value) => {
                    this.checkedLists.map((item) => {
                        if (item === value.typeNumber) this.checkedLists.unshift(item);
                    });
                });
                this.lists2.map((value) => {
                    this.checkedLists2.map((item) => {
                        if (item === value.typeNumber) this.checkedLists2.unshift(item);
                    });
                });
                // setTimeout(() => {
                //     this.checkAll = this.checkedLists.length === this.lists.length;
                //     this.checkAll2 = this.checkedLists2.length === this.lists2.length;
                // }, 800);
                // this.isIndeterminate =
                //     this.checkedLists.length > 0 &&
                //     this.checkedLists.length < this.lists.length;
                // this.isIndeterminate2 =
                //     this.checkedLists2.length > 0 &&
                //     this.checkedLists2.length < this.lists2.length;
            },
            queryAlarmSystem () {
                queryPoPup({})
                    .then((res) => {
                        if (res.success) {
                            this.res = res
                            this.initData(res)
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
            initData (res) {
                if (res.data === undefined) return false
                if (this.lists.length === 0) return false
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
                this.listNewVal = res.data.split(',');
                this.listNewVal2 = res.data.split(',');
            },
            handleSubmitSystems () {
                let arr = []
                let arr2 = []
                this.lists.forEach(item => {
                    arr.push(item.typeNumber)
                })
                this.lists2.forEach(item => {
                    arr2.push(item.typeNumber)
                })

                let arrs = []
                let arrs2 = []

                this.checkedLists.forEach(item => {
                    arr.forEach(items => {
                        if (item === items) {
                            arrs.push(items)
                        }
                    })
                })
                this.checkedLists2.forEach(item => {
                    arr2.forEach(items1 => {
                        if (item === items1) {
                            arrs2.push(items1)
                        }
                    })
                })
                //
                this.checkedLists = arrs
                this.checkedLists2 = arrs2
                let newArrList = this.checkedLists.concat(this.checkedLists2);
                let newPrams2 = this.unique(newArrList).join(',');
                let params = {
                    typeNumbers: newPrams2
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
                    })
                    .finally(() => {
                    // this.alarmTypeList = this.alarmTypeList.split(',')
                });
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
                // // this.$emit('change', [
                // //     ...new Set([...this.checkedLists, ...this.checkedLists2])
                // // ]);
                this.isIndeterminate = false;
            },
            handleCheckAllChange2 (val) {
                this.checkedLists2 = val
                    ? this.lists2.map((item) => {
                        return item.typeNumber;
                    })
                    : [];
                // // this.$emit('change', [
                // //     ...new Set([...this.checkedLists, ...this.checkedLists2])
                // // ]);
                this.isIndeterminate2 = false;
            },
            unique (array) {
                return Array.from(new Set(array)); // Array.from() 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例
            },
            handleCheckedTypesChange (data) {
                //
                // let checkedCount = value.length;
                // this.checkAll = checkedCount === this.lists.length;
                // this.isIndeterminate =
                //     checkedCount > 0 && checkedCount < this.lists.length;
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
                //

                // let checkedCount = value.length;
                // this.checkAll2 = checkedCount === this.lists2.length;
                // this.isIndeterminate2 =
                //     checkedCount > 0 && checkedCount < this.lists2.length;
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
            }

            // updateTypeList () {
            //
            //     // this.$emit('change', [
            //     //     ...new Set([...this.checkedLists, ...this.checkedLists2])
            //     // ]);
            // }
        },
        watch: {
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
            },
            lists: {
                handler (newVal, oldVal) {
                    this.initData(this.res)
                }
            }
        }
    };
</script>

<style lang="less" scoped>
#dialog-notice {
  .el-checkbox {
    padding: 5px 0;
    width: 20%;
    color: #fff;
    margin-left: 0;
    .el-checkbox__input.is-checked .el-checkbox__label {
      color: #fff;
    }
  }
  .checked-types-wrap {
    .el-checkbox {
      width: 23.33333%;
    }
  }
}
.tab {
  width: 100%;
  height: 42px;
  line-height: 42px;
  border: 1px solid #999;
  margin-top: 20px;
  font-size: 15px;

}
</style>
