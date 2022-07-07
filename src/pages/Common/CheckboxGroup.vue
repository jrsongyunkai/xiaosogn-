<template>
  <div>
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
          @on-change="updateTypeList"
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
          @on-change="updateTypeList"
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
  </div>
</template>
<script>
    import store from '@/store';
    import { queryAlarmForConfig } from '@/api/public';
    export default {
        name: 'checkbox-group',
        model: {
            prop: 'checkedOptions',
            event: 'change'
        },
        props: {
            checkedOptions: {
                type: Array,
                default () {
                    return [];
                }
            }
        },
        data () {
            return {
                checkAll: false,
                checkAll2: false,
                isIndeterminate: true,
                isIndeterminate2: true,
                checkedLists: [],
                checkedLists2: [],
                origin: '',
                lists: [],
                lists2: []
            };
        },
        created () {
            this.queryConfig();
        },
        mounted () {},
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
                this.lists.map((value) => {
                    this.checkedOptions.map((item) => {
                        if (item === value.typeNumber) this.checkedLists.unshift(item);
                    });
                });
                this.lists2.map((value) => {
                    this.checkedOptions.map((item) => {
                        if (item === value.typeNumber) this.checkedLists2.unshift(item);
                    });
                });
                this.checkAll = this.checkedLists.length === this.lists.length;
                this.checkAll2 = this.checkedLists2.length === this.lists2.length;
                this.isIndeterminate =
                    this.checkedLists.length > 0 &&
                    this.checkedLists.length < this.lists.length;
                this.isIndeterminate2 =
                    this.checkedLists2.length > 0 &&
                    this.checkedLists2.length < this.lists2.length;
            },
            handleCheckAllChange (val) {
                this.checkedLists = val
                    ? this.lists.map((item) => {
                        return item.typeNumber;
                    })
                    : [];
                this.$emit('change', [
                    ...new Set([...this.checkedLists, ...this.checkedLists2])
                ]);
                this.isIndeterminate = false;
            },
            handleCheckAllChange2 (val) {
                this.checkedLists2 = val
                    ? this.lists2.map((item) => {
                        return item.typeNumber;
                    })
                    : [];
                this.$emit('change', [
                    ...new Set([...this.checkedLists, ...this.checkedLists2])
                ]);
                this.isIndeterminate2 = false;
            },
            handleCheckedTypesChange (value) {
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
            updateTypeList () {
                this.$emit('change', [
                    ...new Set([...this.checkedLists, ...this.checkedLists2])
                ]);
            },
            changeList (origin) {
                this.origin = origin;
            }
        },
        watch: {
            checkedOptions: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.checkedOptions = newVal;
                        this.renderer();
                    }
                },
                deep: true,
                immediate: true
            },
            origin: {
                handler (newVal, oldVal) {
                    if (newVal) {
                        this.origin = newVal;
                    }
                }
            }
        }
    };
</script>
<style lang="less" scoped>
.checkbox-group .el-checkbox-group label {
  width: 20%;
  margin-left: 0;
}

.en-checkbox-group .el-checkbox-group label {
  width: 35%;
}
.en-checkbox-group .el-checkbox-group label:nth-child(2n) {
  width: 48%;
}
</style>
