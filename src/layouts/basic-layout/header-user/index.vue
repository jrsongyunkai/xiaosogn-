<template>
  <span class="i-layout-header-trigger i-layout-header-trigger-min">
    <Dropdown
      :trigger="isMobile ? 'click' : 'hover'"
      class="i-layout-header-user"
      :class="{ 'i-layout-header-user-mobile': isMobile }"
      @on-click="handleClick"
    >
      <!-- <Avatar size="small" :src="info.avatar" v-if="info.avatar" /> -->
      <Avatar size="small" :src="user"  />
      <span class="i-layout-header-user-name" v-if="!isMobile">{{
        $store.state.realName
      }}</span>
      <DropdownMenu slot="list">
         <template v-if="$route.path !== '/visualScreen'">
          <i-link to="/setting/userInfo">
          <DropdownItem>
            <Icon custom="icon-v5 icon-v5-shezhi" />
            <span>{{ $t('basicLayout.user.setting') }}</span>
          </DropdownItem>
        </i-link>
        </template>

        <i-link to="/Logs">
          <DropdownItem>
           <Icon type="md-radio-button-on" />
            <span>操作日志</span>
          </DropdownItem>
        </i-link>

         <DropdownItem divided name="logout">
            <Icon type="ios-log-out" />
            <span>{{ $t('basicLayout.user.logOut') }}</span>
          </DropdownItem>

      </DropdownMenu>
    </Dropdown>
  </span>
</template>
<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        name: 'iHeaderUser',
        computed: {
            ...mapState('admin/user', ['info']),
            ...mapState('admin/layout', ['isMobile', 'logoutConfirm'])
        },
        data () {
            return {
                user: require('../../../assets/images/user.png')
            }
        },
        methods: {
            ...mapActions('admin/account', ['logout']),
            handleClick (name) {
                if (name === 'logout') {
                    this.logout({
                        confirm: this.logoutConfirm,
                        vm: this
                    });
                }
            }
        },
        mounted () {
        },
        created () {

        }
    };
</script>
