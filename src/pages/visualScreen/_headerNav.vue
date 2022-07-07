<template>
    <div>
        <Row class="header tc">
            <Col span="6" class="tl df" >
                <span class="layout_header_time_art"> {{leftTime}}</span>
            </Col>
            <Col span="12" class="middle">
               <i class="layout_header_font_art"><img src="../../assets/images/dunsys.png" style="margin-top: 5px;" alt=""> 顿雾系统</i>
            </Col>
            <Col span="6" class="uers">
                    <Col span="8" >
                        <Dropdown trigger="click" class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in">
                                <Input prefix="ios-search" v-model="message" placeholder="请选择项目"/>
                            <DropdownMenu class="menu" slot="list">
                                <div class="Menulist" :title="item.projectName" v-for="(item, index) in matchedOptions" :key="index"  @click="handleSelect(item)" >{{ item.projectName }}</div>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <Col span="1" style="min-width:25px">
                        <i @click="switchSound" class="icon-v5  layout_header_icon i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in" :class="!this.$store.state.muted ? 'icon-v5-shengyin' : 'icon-v5-shengyinjingyin'"></i>
                    </Col>
                    <Col span="1" style="min-width:25px">
                         <div style="width: 30px;height:60px">
                            <i-header-notice v-if="showNotice" />
                        </div>
                    </Col>
                    <Col span="6" style="min-width:125px">
                        <i-header-user />
                    </Col>

            </Col>
        </Row>
    </div>
</template>

<script>
    import store from '../../store/index'
    import iHeaderNotice from '../../layouts/basic-layout/header-notice/index.vue';
    import iHeaderUser from '../../layouts/basic-layout/header-user/index.vue';
    import { mapState } from 'vuex';
    import headerBg from '../../assets/images/head.gif'
    export default {
        components: { iHeaderNotice, iHeaderUser },
        data () {
            return {
                header_bg: headerBg,
                leftTime: '',
                interval: null,
                message: '',
                checkedProjectStr: [],
                lastIp: ''

            }
        },
        computed: {
            ...mapState('admin/layout', [
                'showNotice',
                'showSearch',
                'showBreadcrumb'
            ]),
            matchedOptions () {
                if (this.message !== '') {
                    return this.checkedProjectStr.filter(item => item.projectName.indexOf(this.message) > -1)
                } else {
                    return this.checkedProjectStr
                }
            }
        },
        created () {},
        mounted () {
            this.init()
            this.leftTime = this.$func.timeFommater()

            clearInterval(this.interval)
            this.interval = setInterval(() => {
                this.leftTime = this.$func.timeFommater()
            }, 1000)
        },
        methods: {
            init () {
                var storage = window.sessionStorage;
                this.checkedProjectStr = JSON.parse(storage.getItem('checkedProjectStr')); // 取值时转为对象
            },
            switchSound () {
                store.commit('muted', !this.$store.state.muted)
            },
            handleSelect (item) {
                var path = '/console/project'
                this.$func.switchToProject(item, path)
            }
        },
        beforeDestroy () {
            clearInterval(this.interval)
        },
        watch: {

        }
    }
</script>

<style lang="less" scoped>
.df{
    display: flex;
    align-items: center;
}
.middle{
    display: flex;
    justify-content: center;
    font-size: 26px;
    font-weight: 700;
    text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
    color: white;
}
.layout_header_font_art{
    display: flex;
    align-items: center;
    /deep/.ivu-icon{
        font-size: 70px;
    }
}
/deep/.ivu-input{
    border-radius:0px;
    border: 1px solid rgba(208, 241, 247, 0.2);
    &::placeholder {
        color: #fff;
    }
}
/deep/.ivu-icon{
    color: #fff;
}
.uers{
    display: flex;
    justify-content: flex-end;

}
/deep/.ivu-dropdown-rel{
    width: 100%;
}
.i-layout-header-trigger:hover{
    background: none;
}
.i-layout-header-trigger{
    display: flex;
    align-items: center;
}
.prject{
     ul{
        list-style: none;
        height: 280px;
        width: 252px;
        overflow-y: scroll;
        position: relative;
        border-radius: 10px;
        padding-left: 20px;
        &::-webkit-scrollbar {
            display: none;
        }
        .ivu-dropdown-item{
            height: 34px;
            line-height: 34px;
            padding: 0;
        }
     }
}

.header{
    background: url('../../assets/images/head.gif');
    width: 100%;
    background-size:100% 100%;
    height: 68px;
    display: flex;
    align-items: center;
    .layout_header_img{
        width: 100%;
        height: 68px;
    }
        .layout_header_time_art{
            img{
                width: 12px;
            }
            margin-left: 40px;
            // font-style:italic;
            // font-family: 'SimHei';
            font-weight: 600;
            // text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
            color: white;
        }
    }
.input{
    position: relative;
    width: 100%;
    background: rgba(208, 241, 247, 0.2);
    opacity: 0.5;
    input{
        background: none;
        border: none;
        position: absolute;
    }
}
.menu{
    width: 200px;
    height: 250px;
    overflow: auto;

    &::-webkit-scrollbar{
        display: none;
    }

}
.Menulist{
    margin: 0;
    line-height: normal;
    padding: 10px 20px 10px 20px;
    clear: both;
    color: #fff;
    font-size: 14px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    text-overflow:ellipsis;
    transition: background 0.2s ease-in-out;
    &:hover{
        background: #2c2c2e;
    }
}
 @media only screen and (min-width: 1024px) {
        .layout_header_time_art{
            font-size: 16px;
        }
        .layout_header_font_art{
            font-size: 18px;
        }
    }
    @media only screen and (min-width: 1366px) {
        .layout_header_time_art{
            font-size: 18px;
        }
        .layout_header_font_art{
            font-size: 20px;
        }
    }
    @media only screen and (min-width: 1920px) {
        .layout_header_time_art{
            font-size: 20px;
        }
        .layout_header_font_art{
            font-size: 24px;
        }
    }
</style>
