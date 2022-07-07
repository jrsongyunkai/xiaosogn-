<template>
  <span
    v-if="isDesktop"
    class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in i-layout-header-trigger-nohover"
  >
    <Dropdown @on-click="handleSelect" trigger="click">
      <input
        class="i-layout-header-search"
        v-model="message"
        type="text"
        :placeholder="$t('basicLayout.search.placeholder')"
      />
      <DropdownMenu slot="list">
        <DropdownItem
          v-for="(item, index) in matchedOptions"
          :key="index"
          :name="item.projectCode"
          :title="item.projectName"
          >{{ item.projectName }}</DropdownItem
        >
      </DropdownMenu>
    </Dropdown>
  </span>
  <span v-else class="i-layout-header-trigger i-layout-header-trigger-min">
    <Dropdown
      trigger="click"
      class="i-layout-header-search-drop"
      ref="dropdown"
    >
      <Icon type="ios-search" />
      <DropdownMenu slot="list">
        <div class="i-layout-header-search-drop-main">
          <Input
            size="large"
            prefix="ios-search"
            type="text"
            :placeholder="$t('basicLayout.search.placeholder')"
          />
          <span
            class="i-layout-header-search-drop-main-cancel"
            @click="handleCloseSearch"
            >{{ $t('basicLayout.search.cancel') }}</span
          >
        </div>
      </DropdownMenu>
    </Dropdown>
  </span>
</template>
<script>
    import store from '@/store/index';
    import { mapState } from 'vuex';
    import { switchHover } from '@/api/index';
    export default {
        name: 'iHeaderSearch',
        data () {
            return {
                optionShow: false,
                message: '',
                checkedProjectStr: []
            };
        },
        computed: {
            ...mapState('admin/layout', ['isDesktop', 'headerMenu']),
            matchedOptions () {
                if (this.message !== '') {
                    return this.checkedProjectStr.filter(item => item.projectName.indexOf(this.message) > -1);
                } else {
                    return this.checkedProjectStr;
                }
            }
        },
        created () {},
        mounted () {
            this.init();
        },
        methods: {
            init () {
                var storage = window.sessionStorage;
                this.checkedProjectStr = JSON.parse(storage.getItem('checkedProjectStr')); // 取值时转为对象
            },
            handleCloseSearch () {
                this.$refs.dropdown.handleClick();
            },
            handleSelect (item) {
                let params = {
                    projectCode: item
                };
                switchHover(params)
                    .then((res) => {
                        if (res.success) {
                            store.commit('projectCode', item);
                            store.commit('fullName', item.projectName);
                            store.commit('equipmentType', 1);
                            store.commit('overviewMac', '');
                            store.commit('distributionDateType', 1);
                            store.commit('prjName', res.data.prjName)
                            store.commit('prjTitle', res.data.prjTitle)
                            this.handleReload()
                            this.$router.push({ path: '/console/project' });
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
                                conten: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            handleReload () {
                this.$emit('on-reload');
            }
        }
    };
</script>
<style lang="less" scoped>
.i-layout-header-trigger {
  ul {
    list-style: none;
    height: 280px;
    width: 252px;
    overflow-y: scroll;
    position: relative;
    border-radius: 10px;
    &::-webkit-scrollbar {
      display: none;
    }
    .ivu-dropdown-item {
      padding: 10px;
       text-align: left;
    overflow: hidden;
    text-overflow:ellipsis;
    transition: background 0.2s ease-in-out;
    &:hover{
        background: #2c2c2e;
    }
    }
  }
}
</style>
