<template>
  <p :class="`${large ? 'large' : color}`">
    <i
      v-if="!large"
      :class="icon"
    /> {{ handleRate(incoming, previous) }}
  </p>
</template>

<script>
export default {
  props: {
    incoming: {
      type: Number,
      required: true
    },
    previous: {
      type: Number,
      default: 0
    },
    large: {
      type: Boolean,
      default: false
    },
    absolute: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      icon: 'el-icon-minus',
      color: 'neutral'
    }
  },
  methods: {
    handleRate (incoming, previous) {
      const rate = incoming - previous
      switch (true) {
      case rate > 0:
        this.icon = 'el-icon-top-right'
        this.color = 'up'
        return this.absolute ? rate : `+${rate}`
      case rate < 0:
        this.icon = 'el-icon-bottom-right'
        this.color = 'down'
        return this.absolute ? Math.abs(rate) : rate
      default:
        this.icon = 'el-icon-minus'
        this.color = 'neutral'
        return rate
      }
    }
  }
}
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
