<template>
    <span class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in" @click="handleSystemPage">

        <span v-show="innerMessage" class="icon-v5 icon-v5-tixing_remind" style=" color: #fff;"></span>
        <!-- <span @click="handleNewsPage" :class="innerMessage === 'true' ? 'notice iconfont icon-tongzhi blink' : 'notice iconfont icon-tongzhi'">
                <i class="spot iconfont icon-spot" v-if="innerMessage === 'true'"></i>
        </span> -->
        <!-- <Notification
                :wide="isMobile"
                :badge-props="badgeProps"
                class="i-layout-header-notice"
                :class="{ 'i-layout-header-notice-mobile': isMobile }">
            <i class="icon-v5 icon-v5-xiaoxi" slot="icon" style=" color: #fff;font-size: 20px;"></i>
            <Icon slot="icon" custom="i-icon i-icon-notification" />
            <NotificationTab title="通知">

            </NotificationTab>
            <NotificationTab title="消息">

            </NotificationTab>
            <NotificationTab title="待办">

            </NotificationTab>
        </Notification> -->
    </span>
</template>
<script>
    import { mapState } from 'vuex';
    import store from '@/store/index'
    export default {
        name: 'iHeaderNotice',
        data () {
            return {
                badgeProps: {
                    offset: [20, 0]
                },
                innerMessage: true
            }
        },
        methods: {
            handleSystemPage () {
                //
                // if (this.$route.name === 'System') {
                this.$router.push({ path: '/news' })
                store.commit('innerMessage', !this.$store.state.innerMessage)
                // } else {
                //     this.$router.push({ name: 'System' })
                // }
            }
        },
        created () {
            // setInterval(() => {
            //     this.innerMessage = !this.innerMessage
            // }, 1000);
        },
        computed: {
            ...mapState('admin/layout', [
                'isMobile'
            ])
        },
        destroyed () { // 页面毁坏后
            clearInterval(this.time);
        },
        watch: {
            '$store.state.innerMessage': {
                handler (newVal, oldVal) {
                    this.innerMessage = newVal
                    if (newVal) {
                        this.time = setInterval(() => {
                            this.innerMessage = !this.innerMessage
                        }, 500)
                    } else {
                        clearTimeout(this.time)
                        this.innerMessage = true
                    }
                }
            }
        }
    }
</script>
// <style lang="less" scoped>
// @keyframes blink{
//     0%{opacity: 1;};
//   100%{opacity: 0;}
// }

// @-webkit-keyframes blink{
//     0%{ opacity: 1;};
//   100%{ opacity: 0;}
// }

// .blink{
//     color :#fff;
//     animation: blink 1s linear infinite;
//     -webkit-animation: blink 1s linear infinite;
// }

// </style>
