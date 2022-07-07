<template>
  <div id="app">
    <router-view v-if="isShow"/>
  </div>
</template>
<script>
    import { on, off } from 'view-design/src/utils/dom';
    import { setMatchMedia } from 'view-design/src/utils/assist';

    import { mapMutations } from 'vuex';

    setMatchMedia();

    export default {

        name: 'app',
        provide () {
            return {
                reload: this.reload
            }
        },
        data () {
            return {
                isShow: true
            }
        },
        methods: {
            ...mapMutations('admin/layout', ['setDevice']),
            handleWindowResize () {
                this.handleMatchMedia();
            },
            reload () {
                this.isShow = false;
                this.$nextTick(() => {
                    this.isShow = true
                })
            },
            handleMatchMedia () {
                const matchMedia = window.matchMedia;

                if (matchMedia('(max-width: 600px)').matches) {
                    this.setDevice('Mobile');
                } else if (matchMedia('(max-width: 992px)').matches) {
                    this.setDevice('Tablet');
                } else {
                    this.setDevice('Desktop');
                }
            }

        },
        mounted () {
            on(window, 'resize', this.handleWindowResize);
            this.handleMatchMedia();
        },
        beforeDestroy () {
            off(window, 'resize', this.handleWindowResize);
        }
    };
</script>
<style lang="less">
.c-success {
  color: #21f27f !important;
}

.c-danger {
  color: #f56c6c !important;
}

.c-warning {
  color: #e6a23c;
}

.c-primary {
  color: #409eff !important;
}

.c-info {
  color: #909399;
}
.c-yelo {
  color: #e8ea2a;
}
.b-success {
  color: #21f27f !important;
  background: rgba(0, 186, 138, 0.15);
  border-radius: 5px;
  padding: 5px;
}
.b-primary {
  background: #007eff !important;
}
.b-danger {
  color: #f56c6c !important;
  background: rgba(255, 79, 79, 0.15) !important;
  border-radius: 5px;
  padding: 5px;
}
.x-success {
  color: #21f27f !important;
  background: rgba(0, 186, 138, 0.15);
  width: 40px;
  height: 22px;
  padding: 2px 5px;
}
.b-warning {
  margin-left: 5px;
  background: #443630;
  color: #e6a23c;
  width: 40px;
  height: 22px;
  padding: 2px 5px;
}
.b-yelo {
  color: #e8ea2a !important;
  background: rgba(232, 234, 42, 0.15) !important;
  border-radius: 5px;
  padding: 5px;
}

.b-info {
  color: #909399;
  background: rgba(144, 147, 153, 0.15);
  border-radius: 5px;
  padding: 5px;
}
.pointer,
i {
  cursor: pointer;
}
.b-olg {
  background: rgba(255, 168, 84, 0.1) !important;
  border: 1px solid #ffa854 !important;
  color: #ffa854 !important;
}
.b-dger {
  color: #f56c6c !important;
  background: rgba(255, 79, 79, 0.15) !important;
  border: 1px solid #f24e4c !important;
}
.b-blue{
  color: #007eff !important;
  border: 1px solid #007eff !important;
  background: rgba(0, 126, 255, 0.1) !important;
}
.c-default {
  color: #fff;
  &:hover {
    color: #409eff !important;
  }
}

.fw {
  font-weight: 600;
}
.danger-text {
  color: #ff5722;
}
.danger-pra {
  color: #007eff;
}
.dangers-text {
  background: rgba(255, 79, 79, 0.15) !important;
  padding: 5px;
  color: #ff5722;
}

.normal-text {
  color: #5fb878;
}
.normals-text {
  background: rgba(0, 186, 138, 0.15);
  padding: 5px;
  color: #5fb878;
}

// 日月按钮
.dateBnt {
  position: relative;
  right: 30px;
  button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    line-height: 30px;
    border: none;
    color: #fff;
    padding: 0 8px;
  }
  .dayCirc {
    background: #19be6b;
    border-color: #19be6b;
  }
  .monthCirc {
    background: #ccc !important;
    border-color: #ccc !important;
  }
}
.content {
  background: #1a202e;
}
i {
  font-style: normal;
}
.export {
  color: #007eff !important;
  border: 1px solid #007eff !important;
  padding: 0 6px !important;
  background: rgba(0, 126, 255, 0.1) !important;
  i {
    font-size: 22px;
  }
}
</style>
