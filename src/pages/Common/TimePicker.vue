<template>
  <div>
    <!-- <el-time-picker
      popper-class="popper-time"
      is-range
      v-model="value"
      :ref="`time-picker-` + index"
      size="small"
      :clearable="false"
      @blur="handlePeriod"
      format="HH:mm"
      value-format="HH:mm"
    >
    </el-time-picker> -->
    <Row>
      <Col span="12">
        <TimePicker
          :ref="`time-picker-` + index"
          transfer-class-name="popper-time"
          transfer
          v-model="value"
          :clearable="false"
          format="HH:mm"
          size="small"
          type="timerange"
          placement="bottom-end"
          placeholder="Select time"
          @on-change="handlePeriod"
          style="width: 168px"
        ></TimePicker>
      </Col>
    </Row>
  </div>
</template>
<script>
    export default {
        model: {
            prop: 'options',
            event: 'blur'
        },
        props: {
            options: {
                type: Array,
                default () {
                    return [];
                }
            },
            index: {
                type: Number,
                default () {
                    return [];
                }
            }
        },
        data () {
            return {
                value: [new Date(), new Date()]
            };
        },
        methods: {
            period () {
                this.$refs['time-picker-' + this.index].focus();
                this.noticePeriod = this.options;
            },
            handlePeriod () {
                let index = this.noticePeriod.indexOf(this.value.join('~'));
                if (index === -1) {
                    this.noticePeriod.push(this.value.join('~'));
                    this.$emit('change', this.noticePeriod);
                    this.$emit('period-flag');
                } else {
                    this.$emit('period-flag');
                    this.$message({
                        message: this.$t('message.timeExists'),
                        type: 'error'
                    });
                }
            }
        }
    };
</script>
