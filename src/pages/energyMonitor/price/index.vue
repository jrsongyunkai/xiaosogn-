<template>
  <div>
    <div style="margin-top: 10px; background: #1a202e; padding: 20px">
      <h3>用电电价配置</h3>
      <Row style="height: 60px; margin-top: 20px">
        <Col :span="6">
        <Row :gutter="16">
          <Col :span="3" style="margin-top: 10px">
              <span
                style="
                width:60px;
                height:60px;
                  padding: 12px 5px;
                  background: rgba(224, 60, 58, 0.2);
                  border-radius: 6px;
                "
              >
                <Icon
                  custom="icon-v5  icon-v5-fengshi"
                  size="30"
                  color="#E03C3A" /></span
            ></Col>
            <Col :span="15" >
              <span>
                尖时电价 (元/kw.h)<Input
                  v-model="NewtopValue"
                  type="number"
                  placeholder="请输入"
                  @on-change="getPriceValue(NewtopValue,'NewtopValue')" /></span></Col
          >
          </Row>   </Col>
        <Col :span="6">
          <Row
            ><Col :span="3" style="margin-top: 10px">
              <span
                style="
                 width:60px;
                height:60px;
                  padding: 12px 5px;
                  background: rgba(255, 168, 84, 0.2);
                  border-radius: 6px;
                "
              >
                <Icon
                  custom="icon-v5  icon-v5-fengshi"
                  size="30"
                  color="#FFA854" /></span
            ></Col>
            <Col :span="15" style="margin-left: 5px">
              <span>
                峰时电价 (元/kw.h)<Input
                  v-model="topValue"
                  type="number"
                  placeholder="请输入"
                   @on-change="getPriceValue(topValue,'topValue')" /></span></Col
          ></Row>
        </Col>
        <Col :span="6">
          <Row>
            <Col :span="3" style="margin-top: 10px">
              <span
                style="
                 width:60px;
                height:60px;
                  padding: 12px 5px;
                  background: rgba(0, 126, 255, 0.2);
                  border-radius: 6px;
                "
              >
                <Icon
                  custom="icon-v5  icon-v5-pingshi"
                  size="30"
                  color="#007EFF" /></span
            ></Col>
            <Col :span="15" style="margin-left: 5px"
              ><span>
                平时电价 (元/kw.h)<Input
                  v-model="centerValue"
                  type="number"
                  placeholder="请输入"
                   @on-change="getPriceValue(centerValue,'centerValue')" /></span
            ></Col>
          </Row>
        </Col>
        <Col :span="6">
          <Row>
            <Col :span="3" style="margin-top: 10px"
              ><span
                style="
                  width:60px;
                height:60px;
                  padding: 12px 5px;
                  background: rgba(13, 214, 103, 0.2);
                  border-radius: 6px;
                "
              >
                <Icon
                  custom="icon-v5  icon-v5-gushi"
                  size="30"
                  color="#0DD667" /></span
            ></Col>
            <Col :span="15" style="margin-left: 5px">
              <span
                >谷时电价 (元/kw.h)<Input
                  v-model="bottomValue"
                  type="number"
                  placeholder="请输入"
                   @on-change="getPriceValue(bottomValue,'bottomValue')" /></span
            ></Col>
          </Row>
        </Col>
      </Row>
    </div>
    <div style="margin-top: 10px; background: #1a202e; padding: 20px">
      <Row>
        <Col :span="6" class="timer_Chats">
          <TimeBars :options="timeData"></TimeBars>
        </Col>
        <Col :span="4">
          <div>尖时时段</div>
          <div
            v-for="(item, index) in topTimeList"
            :key="item"
            style="margin-top: 8px"
          >
            <TimePicker
              transfer
              :editable="false"
              confirm
              v-model="topTimeValue[index]"
              format="HH:mm"
              type="timerange"
              placement="bottom-end"
              placeholder="选择时间"
              style="width: 168px"
                @on-ok="timeCheckFunction(topTimeValue[index])"
            ></TimePicker>
            <span
              style="
                margin-left: 5px;
                background: rgba(224, 60, 58, 0.1);
                padding: 4px;
                border: 1px solid #e03c3a;
                border-radius: 3px;
              "
              ><Icon
                type="ios-trash-outline"
                size="22"
                color="#E03C3A"
                @click="topMinusList(index)"
            /></span>
          </div>
          <Button
            ghost
            long
            style="
              margin-top: 5px;
              width: 168px;
              background: rgba(0, 126, 255, 0.2);
            "
            type="primary"
            @click="topMinusList('add')"
            >+ 添加时段</Button
          >
        </Col>
        <Col :span="4">
          <div>峰时时段</div>
          <div
            v-for="(item, index) in timeList"
            :key="item"
            style="margin-top: 8px"
          >
            <TimePicker
              transfer
              :editable="false"
              confirm
              v-model="timeValue[index]"
              format="HH:mm"
              type="timerange"
              placement="bottom-end"
              placeholder="选择时间"
              style="width: 168px"
               @on-ok="timeCheckFunction(timeValue[index])"
            ></TimePicker>
            <span
              style="
                margin-left: 5px;
                background: rgba(224, 60, 58, 0.1);
                padding: 4px;
                border: 1px solid #e03c3a;
                border-radius: 3px;
              "
              ><Icon
                type="ios-trash-outline"
                size="22"
                color="#E03C3A"
                @click="minusList(index)"
            /></span>
          </div>
          <Button
            ghost
            long
            style="
              margin-top: 5px;
              width: 168px;
              background: rgba(0, 126, 255, 0.2);
            "
            type="primary"
            @click="minusList('add')"
            >+ 添加时段</Button
          >
        </Col>
        <Col :span="4">
          <div>平时时段</div>
          <div
            v-for="(item, index) in centerTimeList"
            :key="item"
            style="margin-top: 8px"
          >
          <!-- <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
            <FormItem  prop="date">  <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker></FormItem>
            </Form> -->
            <TimePicker
              transfer
              :editable="false"
              confirm
              v-model="centerTimeValue[index]"
              format="HH:mm"
              type="timerange"
              placement="bottom-end"
              placeholder="选择时间"
              style="width: 168px"
               @on-ok="timeCheckFunction(centerTimeValue[index])"
            ></TimePicker>
            <span
              style="
                margin-left: 5px;
                background: rgba(224, 60, 58, 0.1);
                padding: 4px;
                border: 1px solid #e03c3a;
                border-radius: 3px;
              "
              ><Icon
                type="ios-trash-outline"
                size="22"
                color="#E03C3A"
                @click="centerminusList(index)"
            /></span>
          </div>
          <Button
            ghost
            long
            style="
              margin-top: 5px;
              width: 168px;
              background: rgba(0, 126, 255, 0.2);
            "
            type="primary"
            @click="centerminusList('add')"
            >+ 添加时段</Button
          >
        </Col>
        <Col :span="4">
          <div>谷时时段</div>
          <div
            v-for="(item, index) in bottomTimeList"
            :key="item"
            style="margin-top: 8px"
          >
            <TimePicker
              transfer
              :editable="false"
              confirm
              v-model="bottomTimeValue[index]"
              format="HH:mm"
              type="timerange"
              placement="bottom-end"
              placeholder="选择时间"
              style="width: 168px"
              @on-ok="timeCheckFunction(bottomTimeValue[index])"
            ></TimePicker>
            <span
              style="
                margin-left: 5px;
                background: rgba(224, 60, 58, 0.1);
                padding: 4px;
                border: 1px solid #e03c3a;
                border-radius: 3px;
              "
              ><Icon
                type="ios-trash-outline"
                size="22"
                color="#E03C3A"
                @click="bottomminusList(index)"
            /></span>
          </div>
          <Button
            ghost
            long
            style="
              margin-top: 5px;
             width: 168px;
              background: rgba(0, 126, 255, 0.2);
            "
            type="primary"
            @click="bottomminusList('add')"
            >+ 添加时段</Button
          >
        </Col>
      </Row>
      <div style="display: flex; justify-content: flex-end; margin-top: 20px">
        <Button type="primary" @click="upduateConfig('update')"
          >更新配置</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
    import { findPowerConfigure, powerConfigure } from '@api/public';
    import TimeBars from '../../Common/Timers.vue';
    // import store from '@/store/index';
    export default {
        components: {
            TimeBars
        },
        data () {
            return {
                // formValidate: { date: '' },
                // ruleValidate: { date: [
                //     { required: true, type: 'string', message: '时间有重叠', trigger: 'blur' }
                // ] },
                NewtopValue: '',
                topValue: '',
                centerValue: '',
                bottomValue: '',
                topTimeList: 1,
                topTimeValue: [],
                timeList: 1,
                timeValue: [],
                centerTimeList: 1,
                centerTimeValue: [],
                bottomTimeList: 1,
                bottomTimeValue: [],
                timeData: [],
                finallyTime: ''
            };
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                let params = { projectCode: this.$store.state.projectCode };
                findPowerConfigure(params)
                    .then((res) => {
                        if (res.success) {
                            this.NewtopValue = res.data.topPeakPrice
                            this.topValue = res.data.peakPrice;
                            this.centerValue = res.data.flatPrice;
                            this.bottomValue = res.data.valleyPrice;
                            this.topTimeList = res.data.topPeakList.length
                            this.timeList = res.data.peakList.length;
                            this.centerTimeList = res.data.flatList.length;
                            this.bottomTimeList = res.data.valleyList.length;
                            this.topTimeValue = res.data.topPeakList
                            this.timeValue = res.data.peakList;
                            this.centerTimeValue = res.data.flatList;
                            this.bottomTimeValue = res.data.valleyList;
                            let timedatas = [
                                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0
                            ];
                            let neWTopPeakList = this.topTimeValue && this.arrFuction(this.topTimeValue)
                            let newTopList = this.timeValue && this.arrFuction(this.timeValue);
                            let newCenterList =
                                this.centerTimeValue && this.arrFuction(this.centerTimeValue);
                            let newBottomList =
                                this.bottomTimeValue && this.arrFuction(this.bottomTimeValue);
                            timedatas.forEach((item, index) => {
                                newTopList.map((itm) => {
                                    if (index === itm) {
                                        timedatas[itm] = 4;
                                    }
                                });
                                newCenterList.map((itm) => {
                                    if (index === itm) {
                                        timedatas[itm] = 2;
                                    }
                                });
                                newBottomList.map((itm) => {
                                    if (index === itm) {
                                        timedatas[itm] = 1;
                                    }
                                });
                                neWTopPeakList.map((itm) => {
                                    if (index === itm) {
                                        timedatas[itm] = 3;
                                    }
                                })
                            });
                            this.timeData = timedatas;
                        } else if (res.code === '-1') {
                        } else {
                            this.$Message.error(res.message);
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.$Message.error({
                                content: '未知错误，请刷新重试'
                            });
                        }
                });
            },
            getPriceValue (val, type) {
                console.log(val);
                if (+val < 0) {
                    this.$Message.error({
                        content: '电价不能为负数'
                    })
                }
                if (type === 'NewtopValue') {
                    this.NewtopValue = Math.abs(val)
                } else if (type === 'topValue') {
                    this.topValue = Math.abs(val)
                } else if (type === 'centerValue') {
                    this.centerValue = Math.abs(val)
                } else if (type === 'bottomValue') {
                    this.bottomValue = Math.abs(val)
                }
            },
            minusList (val) {
                if (val === 'add') {
                    this.timeList += 1;
                } else {
                    this.timeList -= 1;
                    this.timeValue.splice(val, 1)
                    if (this.timeList <= 0) {
                        this.timeList = 0;
                        this.timeValue = [];
                    }
                }
                if (this.timeList > 12) {
                    this.timeList = 12
                    this.$Message.error('不能再添加了');
                    return false;
                }
            },
            topMinusList (val) {
                if (val === 'add') {
                    this.topTimeList += 1;
                } else {
                    this.topTimeList -= 1;
                    this.topTimeValue.splice(val, 1)
                    if (this.topTimeList <= 0) {
                        this.topTimeList = 0;
                        this.topTimeValue = [];
                    }
                }
                if (this.topTimeList > 12) {
                    this.topTimeList = 12
                    this.$Message.error('不能再添加了');
                    return false;
                }
            },
            centerminusList (val) {
                if (val === 'add') {
                    this.centerTimeList += 1;
                } else {
                    this.centerTimeList -= 1;
                    this.centerTimeValue.splice(val, 1)
                    if (this.centerTimeList <= 0) {
                        this.centerTimeList = 0;
                        this.centerTimeValue = [];
                    }
                }
                if (this.centerTimeList > 12) {
                    this.centerTimeList = 12
                    this.$Message.error('不能再添加了');
                    return false;
                }
            },
            bottomminusList (val) {
                if (val === 'add') {
                    this.bottomTimeList += 1;
                } else {
                    this.bottomTimeList -= 1;
                    this.bottomTimeValue.splice(val, 1)
                    if (this.bottomTimeList <= 0) {
                        this.bottomTimeList = 0;
                        this.bottomTimeValue = [];
                    }
                }
                if (this.bottomTimeList > 12) {
                    this.bottomTimeList = 12
                    this.$Message.error('不能再添加了');
                    return false;
                }
            },
            arrFuction (Arr) {
                let arr = Arr.map(([one, two]) => ({
                    one,
                    two
                }));
                let secondList = arr.map((item) => item.one + '-' + item.two);
                let thirdList = secondList.map((item) => [
                    Number(String(item).substr(0, 2)),
                    Number(String(item).substr(6, 2))
                ]);
                let newArr = [];
                thirdList.forEach(([a, b]) => {
                    newArr.push(a);
                    for (let i = 0; i < 24; i++) {
                        if (a === b) {
                            newArr.push(b);
                        } else {
                            a += 1;
                            newArr.push(a);
                        }
                    }
                });
                return Array.from(new Set(newArr));
            },
            upduateConfig (val) {
                // console.log(
                //     this.topTimeValue,
                //     this.timeValue,
                //     this.centerTimeValue,
                //     this.bottomTimeValue,
                //     '=====this.timeValue'
                // );
                console.log(this.changetimeValue(this.topTimeValue));
                if (this.topTimeList > 0 && this.changetimeValue(this.topTimeValue).indexOf('~') === 0) {
                    this.$Message.error({
                        content: '请输入尖时时段'
                    })
                    return false
                }
                if (this.timeList > 0 && this.changetimeValue(this.timeValue).indexOf('~') === 0) {
                    this.$Message.error({
                        content: '请输入峰时时段'
                    })
                    return false
                }
                if (this.centerTimeList > 0 && this.changetimeValue(this.centerTimeValue).indexOf('~') === 0) {
                    this.$Message.error({
                        content: '请输入平时时段'
                    })
                    return false
                }
                if (this.bottomTimeList > 0 && this.changetimeValue(this.bottomTimeValue).indexOf('~') === 0) {
                    this.$Message.error({
                        content: '请输入谷时时段'
                    })
                    return false
                }
                let topPeak = this.topTimeValue.length > 0 ? this.changetimeValue(this.topTimeValue).join() : ''
                let peak = this.timeValue.length > 0 ? this.changetimeValue(this.timeValue).join() : ''
                let flat = this.centerTimeValue.length > 0 ? this.changetimeValue(this.centerTimeValue).join() : ''
                let valley = this.bottomTimeValue.length > 0 ? this.changetimeValue(this.bottomTimeValue).join() : ''
                let params = {
                    projectCode: this.$store.state.projectCode, // 项目编号
                    priceFo: {
                        // 分时电价，）
                        topPeakPrice: this.NewtopValue ? this.NewtopValue : '', // 尖时价格
                        peakPrice: this.topValue ? this.topValue : '', // 峰时价格
                        flatPrice: this.centerValue ? this.centerValue : '', // 平时价格
                        valleyPrice: this.bottomValue ? this.bottomValue : '' // 谷时价格
                    },
                    dataFo: {
                        topPeak,
                        peak,
                        flat,
                        valley
                    }
                };
                // console.log(params, '======params');
                if (this.NewtopValue || this.topValue || this.centerValue || this.bottomValue) {
                    powerConfigure(params)
                        .then((res) => {
                            if (res.success) {
                                if (val === 'update') {
                                    this.$Message.success(res.message);
                                    this.init();
                                }
                            } else if (res.code === '-1') {
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                this.$Message.error({
                                    content: '未知错误，请刷新重试'
                                });
                            }
                    });
                } else {
                    this.$Modal.confirm({
                        content: '<p>分时电价全部为空</p><p>确认更新？</p>',
                        onOk: () => {
                            powerConfigure(params)
                                .then((res) => {
                                    if (res.success) {
                                        if (val === 'update') {
                                            this.$Message.success({
                                                content: '更新成功'
                                            });
                                            this.init();
                                        }
                                    } else if (res.code === '-1') {
                                    } else {
                                        this.$Message.error(res.message);
                                    }
                                })
                                .catch((err) => {
                                    if (err) {
                                        this.$Message.error({
                                            content: '未知错误，请刷新重试'
                                        });
                                    }
                            });
                            // this.$Message.info('保存成功');
                        },
                        onCancel: () => {
                            this.$Message.info('取消成功');
                        }
                    });
                }
            },
            changetimeValue (Arr) {
                if (Arr === []) {
                    return false
                } else {
                    let arr = Arr && Arr.map(([one, two]) => ({
                        one,
                        two
                    }));
                    let secondList = arr.map(
                        (item) => item.one + '~' + item.two
                    );
                    return secondList;
                }
            },
            timeCheckFunction (val) {
                let allTimelist = this.topTimeValue.concat(this.timeValue, this.centerTimeValue, this.bottomTimeValue)
                let twoList = allTimelist.map(([a, b]) => ([+a.substr(0, 2), +b.substr(0, 2)]))
                let threeList = []
                twoList.forEach(([a, b]) => {
                    // 此处代码勿动 时间校验
                    let c = b - a
                    if (c === 0) {
                        c = 1
                    }
                    for (let i = 0; i < c; i++) {
                        if (c === 1 && b - a === 1) {
                            threeList.push(a)
                            threeList.push(a + 1)
                        } else if (c === 1 && b - a === 0) { threeList.push(a) } else {
                            if (i === 0) {
                                threeList.push(a)
                            }
                            a += 1
                            threeList.push(a)
                        }
                    }
                    return threeList
                })
                this.finallyTime = threeList
                if (threeList.length > 24) {
                    this.$Message.error({
                        content: '时间有重叠，请重新选择'
                    })
                }
            }
        }
    };
</script>

<style></style>
