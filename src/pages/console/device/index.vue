<template>
  <div id="tabsOverView">
    <!-- <h3>设备概况</h3> -->
    <Col :span="24" >
      <div style="position:relative">
          <div style="height:48px;width:100%;background:#1a202e;position:absolute"></div>
      </div>
      <Tabs
        :animated="false"
        v-model="activeName"
        @on-click="handleClick"
      >
        <TabPane label="智能空开" name="first">
          <overviewList
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'first'"
          ></overviewList>
        </TabPane>
        <TabPane label="电气火灾" name="second">
          <overviewList
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'second'"
          ></overviewList>
        </TabPane>
        <TabPane label="水位水压" name="third">
          <overviewList
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'third'"
          ></overviewList>
        </TabPane>
        <TabPane label="烟雾、可燃气体" name="fourth">
          <overviewList
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'fourth'"
          ></overviewList>
        </TabPane>
        <TabPane label="LORA专网" name="fifth">
          <overviewList
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'fifth'"
          ></overviewList
        ></TabPane>
        <TabPane label="温度、湿度、光照" name="six">
          <overviewList
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'six'"
          ></overviewList
        ></TabPane>
        <TabPane label="智能电表" name="seventh">
          <overviewList
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'seventh'"
          ></overviewList
        ></TabPane>
        <TabPane label="智能水表" name="eighth">
          <overviewList
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'eighth'"
          ></overviewList
        ></TabPane>
      </Tabs>
    </Col>
  </div>
</template>
<script>
    import overviewList from './list.vue';
    // import Store from 'vuex';
    export default {
        name: 'console-device',
        components: { overviewList },
        data () {
            return {
                activeName: 'first',
                options: {
                    type: '1',
                    mac: ''
                },
                rightView: this.$store.state.rightView,
                tabsWidth: ''
            };
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                this.monitorTab();
                if (!this.rightView) {
                    if (document.body.clientWidth <= 1800) {
                        this.tabsWidth = document.body.clientWidth * 0.7916667 - 240 + 'px';
                    }
                }
            },
            monitorTab () {
                let type = this.$store.state.overview.equipmentType;
                if (type === 1) {
                    this.options.type = '1';
                    this.activeName = 'first';
                }
                if (type === 2 || type === 3) {
                    this.options.type = '2,3';
                    this.activeName = 'second';
                }
                if (type === 4 || type === 5) {
                    this.options.type = '4,5';
                    this.activeName = 'third';
                }
                if (type === 6 || type === 7 || type === 10 || type === 13) {
                    this.options.type = '6,7,10,13';
                    this.activeName = 'fourth';
                }
                if (type === 8) {
                    this.options.type = '8';
                    this.activeName = 'fifth';
                }
                if (type === 11 || type === 14) {
                    this.options.type = '11,14';
                    this.activeName = 'six';
                }
                if (type === 12) {
                    this.options.type = '12';
                    this.activeName = 'seventh';
                }
                if (type === 15 || type === 16) {
                    this.options.type = '15,16';
                    this.activeName = 'eighth';
                }
                this.options.mac = this.$store.state.overview.mac;
            },
            handleClick (tab, event) {
                let name = tab;

                this.activeName = tab;
                if (name === 'first') this.options.type = '1';
                if (name === 'second') this.options.type = '2,3';
                if (name === 'third') this.options.type = '4,5';
                if (name === 'fourth') this.options.type = '6,7,10,13';
                if (name === 'fifth') this.options.type = '8';
                if (name === 'six') this.options.type = '11,14';
                if (name === 'seventh') this.options.type = '12';
                if (name === 'eighth') this.options.type = '15,16';
            },
            receiveMac (val) {
                this.options.mac = val;

                // Store.commit('overviewMac', val);
            }
        }
    };
</script>
<style lang="less" scoped>
/deep/.ivu-tabs-nav-container{
  padding: 5px;
}
</style>
