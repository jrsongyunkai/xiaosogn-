<template>
  <div>
    <Button @click="modal13 = true">Open Modal (sticky)</Button>

    <Modal v-model="modal13" :mask="false" :styles="styles">
      <div class="header" slot="header">
        <div class="left">
          <h2>设备详情</h2>
          <div>设备别名：唯传LORA</div>
          <div>设备号：FFFFFF1000019ACC</div>
          <div>在线状态： 在线</div>
          <div class="contacts">
            <div class="contact">联系人：</div>
            <div>
              <Input
                v-model="value1"
                clearable
                prefix="ios-call"
                placeholder="Enter number"
                style="width: 120px"
                :border="false"
              />
              <Input
                v-model="value2"
                clearable
                prefix="ios-call"
                placeholder="Enter number"
                style="width: 120px"
                :border="false"
              />
              <br />
              <Input
                v-model="value3"
                clearable
                prefix="ios-call"
                placeholder="Enter number"
                style="width: 120px"
                :border="false"
              />
              <Input
                v-model="value4"
                clearable
                prefix="ios-call"
                placeholder="Enter number"
                style="width: 120px"
                :border="false"
              />
            </div>
          </div>
          <br /><br /><br /><br />
          <div>位置：广东省深圳市宝安区,12,1,1</div>
        </div>
        <!-- 上传照片 -->
        <div class="upload" >
          <Upload
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
            size="100"
          >
            <div style="padding: 20px 0">

            </div>
          </Upload>
        </div>
        <div class="right"></div>
      </div>
      <!-- <div class="height">啊啊啊啊啊</div>
      <div class="height" slot="footer">什么玩意欧建麟牛逼</div> -->
    </Modal>
  </div>
</template>
<script>
    import LineChart from '@/pages/Common/Line';
    export default {
        data () {
            return {
                modal13: false,
                styles: {
                    width: '1000px',
                    height: '600px',
                    background: 'red'
                },
                value1: '',
                value2: '',
                value3: '',
                value4: ''
            };
        },
        components: {
            LineChart
        }
    };
</script>
<style lang="less" scoped>
.header {
  height: 200px;

  .left {
    float: left;
    > div {
      margin-top: 10px;
    }
    .contacts {
      div {
        float: left;
      }
      .contact {
        margin-top: 5px;
      }
    }
  }
  .upload{
    float: left;
    margin-left: 20px;
    width: 120px;
    height: 320px;
  }
}
.height{
  height: 200px;
}
</style>
