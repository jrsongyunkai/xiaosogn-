<template>
    <div class="i-layout-header-trigger i-layout-header-trigger-min" >
            <Dropdown :trigger="isMobile ? 'click' : 'hover'" class="i-layout-header-i18n" :class="{ 'i-layout-header-user-mobile': isMobile }" @on-click="handleClick">
                <Icon type="md-globe" />
                <DropdownMenu slot="list">
                    <DropdownItem v-for="(item, key) in languages" :key="key" :name="key" :selected="locale === key">
                        <span>{{ item.language }}</span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
    </div>
    <!-- <template v-if="$route.path ==='/login'">
         <a href="http://v3.snd02.com/" target="_blank"><span class="goingGo"> 回到旧系统</span></a>
    </template> -->

</template>
<script>
    import Languages from '@/i18n/locale';
    import { mapState, mapActions } from 'vuex';

    export default {
        name: 'iHeaderI18n',
        data () {
            return {
                languages: Languages
            }
        },
        computed: {
            ...mapState('admin/i18n', [
                'locale'
            ]),
            ...mapState('admin/layout', [
                'isMobile'
            ])
        },
        methods: {
            ...mapActions('admin/i18n', [
                'setLocale'
            ]),
            handleClick (locale) {
                if (locale === this.locale) return;
                this.setLocale({ locale, vm: this });
            }
        }

    }
</script>
<style lang="less" scoped>
a{
    color: #989aa1;
}
.goingGo{
    cursor: pointer;
    margin-right: 20px;
}
.ivu-dropdown{
    color: #333;
}
/deep/.ivu-select-dropdown{
    position: absolute;
    left: 0;
}
.i-layout-header-trigger:hover{
    background: transparent;
}
.i-layout-header-trigger-min i{
    color: #fff;
}
</style>
