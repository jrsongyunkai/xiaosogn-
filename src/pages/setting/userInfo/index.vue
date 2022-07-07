<template>
  <div>
    <Row :gutter="24">
      <Col :xl="4" :lg="6" :md="0" :sm="0" :xs="0">
        <Card shadow height="100%" :padding="0" class="ivu-card">
          <CellGroup @on-click="handleChangeCell" class="ivu-pt-8 ivu-pb-8">
            <Cell
              title="基本设置"
              name="baseinfo"
              :selected="currentType === 'baseinfo'"
            />
            <Cell
              title="告警配置"
              name="safety"
              :selected="currentType === 'safety'"
            />
            <Cell
              title="关联账号"
              name="account"
              :selected="currentType === 'account'"
            />
            <Cell
              title="安全监管菜单显示"
              name="monitor"
              :selected="currentType === 'monitor'"
            />
            <!-- 暂时不用 -->
            <!-- <Cell
              title="图区配置"
              name="notification"
              :selected="currentType === 'notification'"
            /> -->
             <!-- <Cell
              title="项目位置设置"
              name="setAdress"
              :selected="currentType === 'setAdress'"
            /> -->
            <!-- <Cell
              title="配置服务指向"
              name="configurings"
              :selected="currentType === 'configurings'"
            />
            <Cell
              title="告警名称修改"
              name="ProjectAlarmModification"
              :selected="currentType === 'ProjectAlarmModification'"
            /> -->
          </CellGroup>
        </Card>
      </Col>
      <Col :xl="20" :lg="18" :md="24" :sm="24" :xs="24">
        <Card :bordered="false" dis-hover>
          <baseinfo v-if="currentType === 'baseinfo'" />
          <safety v-if="currentType === 'safety'" />
          <account v-if="currentType === 'account'" />
          <monitor v-if="currentType=== 'monitor'" />
          <!-- <setAdress  v-if="currentType === 'setAdress'"  /> -->
          <!-- <notification v-if="currentType === 'notification'" /> -->
          <!-- <configurings v-if="currentType === 'configurings'" />
          <ProjectAlarmModification
            v-if="currentType === 'ProjectAlarmModification'"
          /> -->
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
    import baseinfo from './baseinfo';
    import account from './account.vue';
    import safety from './safety.vue';
    import monitor from './monitor.vue';
    // import setAdress from './setAdress.vue'
    //  import notification from './notification.vue';
    // import configurings from './configurings.vue';
    // import ProjectAlarmModification from './ProjectAlarmModification.vue';
    export default {
        name: 'setting-user',
        components: {
            baseinfo,
            account,
            safety,
            monitor
            // setAdress,
            // configurings,
            // ProjectAlarmModification
        },
        data () {
            return {
                currentType: 'baseinfo'
            };
        },
        methods: {
            handleChangeCell (name) {
                this.currentType = name;
            }
        }
    };
</script>
<style lang="less" scoped>
.ivu-card {
  margin-right: -20px;
  height: 100%;
}
</style>
