<template>
  <div>
    <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" @on-change="handleCheckAllRepeatChange">全选</Checkbox>
    <div style="margin: 15px 0;"></div>
    <CheckboxGroup v-model="optionData" @on-change="handleCheckedWeekChange">
      <Checkbox v-for="item in week" :label="item.value" :key="item.value">{{ item.label }}</Checkbox>
    </CheckboxGroup>
    <div class="mt-20 tr">
      <Button type="primary" @click="handleSave">确 定</Button>
      <Button  @click="receive">取消</Button>
    </div>
  </div>
</template>
<script>
    export default {
        props: {
            options: {
                type: [Object, Array],
                default () {
                    return ''
                }
            }
        },
        data () {
            return {
                isIndeterminate: true,
                checkAll: false,
                optionData: this.options,
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
                ]
            }
        },
        mounted () {},
        methods: {
            handleCheckAllRepeatChange (val) {
                this.optionData = val ? ['日', '一', '二', '三', '四', '五', '六'] : []
                this.isIndeterminate = false
            },
            handleCheckedWeekChange (value) {
                let checkedCount = value.length
                this.checkAll = checkedCount === this.week.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.week.length
            },
            handleSave () {
                this.$emit('sendWeekSelection', this.optionData)
            },
            receiveWeekSelectionCancel () {
                this.$emit('sendWeekSelection', false)
            },
            receive () {
                this.$emit('receive', false)
            }
        }
    }
</script>
<style lang="less" scoped>
.tr{
    Button{
        margin: 5px;
    }
}
</style>
