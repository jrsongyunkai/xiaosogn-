<template>
  <div>
    <Col :span="24">
      <Tabs
        :animated="false"
        v-model="systemActive"
        id="system-tab"
        @on-click="handleClick"
      >
        <TabPane label="首选项" name="first">
          <FirstChoice v-if="systemActive === 'first'"></FirstChoice>
        </TabPane>
        <TabPane label="弹窗通知" name="second">
          <PopupNotification
            v-if="systemActive === 'second'"
          ></PopupNotification>
        </TabPane>
        <TabPane label="报警声音" name="third">
          <AlarmSound></AlarmSound>
        </TabPane>
        <TabPane label="短信通知" name="fourth">
          <Notication
            :category="3"
            v-if="systemActive === 'fourth'"
          ></Notication>
        </TabPane>
        <TabPane label="语音通知" name="fifth">
          <Notication
            :category="6"
            v-if="systemActive === 'fifth'"
          ></Notication>
        </TabPane>
        <TabPane label="App通知" name="sixth">
          <Notication
            :category="1"
            v-if="systemActive === 'sixth'"
          ></Notication>
        </TabPane>
        <TabPane label="接口通知" name="seventh">
          <Notication
            :category="2"
            v-if="systemActive === 'seventh'"
          ></Notication
        ></TabPane>
        <!-- 待更改 <el-col v-if="selected === $t('system.associatedAccount')" :span="20">
        <AssociatedAccount></AssociatedAccount>
      </el-col>
      <el-col v-if="selected === $t('system.underlay')" :span="20">
        <Underlay></Underlay>
      </el-col> -->
      </Tabs>
    </Col>
  </div>
</template>

<script>
    import FirstChoice from './FirstChoice.vue';
    import PopupNotification from './PopupNotification.vue';
    import AlarmSound from './AlarmSound.vue';
    import Notication from './Notication.vue';
    export default {
        name: 'safety',
        components: { FirstChoice, PopupNotification, AlarmSound, Notication },
        data () {
            return {
                systemActive: 'first'
            };
        },
        methods: {
            handleClick () {}
        }
    };
</script>

<style></style>
