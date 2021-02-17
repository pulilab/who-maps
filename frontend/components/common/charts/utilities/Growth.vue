<template>
  <p :class="`${large ? 'large' : color}`">
    <i v-if="!large" :class="icon"></i> {{ rate }}
  </p>
</template>

<script>
export default {
  props: {
    incoming: {
      type: Number,
      required: true,
    },
    previous: {
      type: Number,
      default: 0,
    },
    large: {
      type: Boolean,
      default: false,
    },
    absolute: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icon: "el-icon-minus",
      color: "neutral",
      rate: 0,
    };
  },
  watch: {
    incoming() {
      const rate = this.incoming - this.previous;
      rate > 0 ? (this.rate = `+${rate}`) : (this.rate = rate);
      switch (true) {
        case rate > 0:
          this.icon = "el-icon-top-right";
          this.rate = this.absolute ? rate : `+${rate}`;
          this.color = "up";
          break;
        case rate < 0:
          this.icon = "el-icon-bottom-right";
          this.rate = this.absolute ? Math.abs(rate) : rate;
          this.color = "down";
          break;
        default:
          this.icon = "el-icon-minus";
          this.rate = rate;
          this.color = "neutral";
          break;
      }
    },
  },
  methods: {
    name() {},
  },
};
</script>

<style lang="scss" scoped>
p {
  letter-spacing: 0;
  line-height: 16px;
  margin: 0 20px 0 0;
}
.large {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 32px;
  color: #404041;
}
.up {
  color: #0eb455;
}
.down {
  color: #e2231a;
}
.neutral {
  color: #777779;
}
</style>
