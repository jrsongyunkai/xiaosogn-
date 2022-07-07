<template>
  <div class="monitor">
    <h2>安全监管菜单</h2>
    <Row>
       <Col class="allSee" :span="3">
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll" >
            全显示
          </Checkbox>
        </Col>
        <Col :span="21" style="margin-top:20px">
          <CheckboxGroup v-model="showData" @on-change="checkAllGroupChange">
            <Checkbox :label="item" v-for="item in dataList" :key="item" class="list"></Checkbox>
          </CheckboxGroup>
        </Col>
    </Row>
    <Button type="primary" style="margin-top:20px" @click="handleShowMenus">
      保存
    </Button>
  </div>
</template>
<script>
    import store from '@/store';
    import {
        querySafePageShowMenus,
        saveSafePageShowMenus
    } from '@/api/public';
    export default {
        data () {
            return {
                dataList: ['全部报警', '漏电流', '温度', '温度报警', '漏电报警', '短路报警', '漏保自检', '过流过载', '过欠压', '三相报警', '电弧报警', '异常状态', '分合闸警示'],
                indeterminate: true,
                checkAll: false,
                checkAllGroup: [],
                menusData: '',
                showData: this.$store.state.showMenus,
                datas: ''
            }
        },
        mounted () {
            // this.handleQueryShowMenus()
        },
        inject: [
            'reload'
        ],
        methods: {
            handleCheckAll () {
                console.log(this.checkAll);
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;
                if (this.checkAll) {
                    this.showData = this.dataList;
                } else {
                    this.showData = [];
                }
            },
            checkAllGroupChange (data) {
                this.menusData = data
                if (data.length === 3) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            },
            handleShowMenus () {
                if (this.menusData !== '') {
                    let params = {
                        showMenus: this.checkAll ? this.showData.join(',') : this.menusData.join(',')
                    }
                    saveSafePageShowMenus(params).then(res => {
                        if (res.code === '0') {
                            this.handleQueryShowMenus()
                            this.$Message.success({
                                content: '保存成功'
                            })
                        }
                    })
                }
            },
            handleQueryShowMenus () {
                let params = {
                }
                querySafePageShowMenus(params).then(res => {
                    this.datas = res.data.showMenus.split(',')
                    store.commit('showMenus', this.datas);
                })
            }
        },
        watch: {
            '$store.state.showMenus': {
                handler (newVal, oldVal) {
                    console.log(oldVal);
                    if (newVal) {
                        this.reload()
                    }
                }
            }
        }
    }
</script>
<style lang="less" scoped>
.allSee{
    border:1px dashed #8d8d8f;
    justify-content: center;
    display: flex;
    margin-top: 20px;
    align-items: center;
}
.list{
  width:130px;
  margin-top:10px;
  margin-left:20px
}
</style>
