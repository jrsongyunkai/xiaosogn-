<template>
  <div>
    <Row :gutter="24">
      <Col :xl="4" :lg="6" :md="0" :sm="0" :xs="0">
        <Card shadow height="100%" :padding="0" class="ivu-card">
          <CellGroup @on-click="handleChangeCell" class="ivu-pt-8 ivu-pb-8">
            <Cell
              title="配置服务指向"
              name="configurings"
              :selected="currentType === 'configurings'"
            />
            <Cell
              title="告警名称修改"
              name="ProjectAlarmModification"
              :selected="currentType === 'ProjectAlarmModification'"
            />
            <Cell
              title="地图"
              name="setAdress"
              :selected="currentType === 'setAdress'"
            />
          </CellGroup>
        </Card>
      </Col>
      <Col :xl="20" :lg="18" :md="24" :sm="24" :xs="24">
        <Card :bordered="false" dis-hover>
          <configurings v-if="currentType === 'configurings'" />
          <ProjectAlarmModification
            v-if="currentType === 'ProjectAlarmModification'"
          />
           <setAdress  v-if="currentType === 'setAdress'"  />
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
    import configurings from '../userInfo/configurings.vue';
    import setAdress from '../userInfo/setAdress.vue'
    import ProjectAlarmModification from '../userInfo/ProjectAlarmModification.vue';
    export default {
        name: 'setting-user',
        components: {
            setAdress,
            configurings,
            ProjectAlarmModification
        },
        data () {
            return {
                currentType: 'configurings'
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
