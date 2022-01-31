<template>
  <component
    :is="type"
    v-if="loaded"
    v-bind="{ ...$props, ...$attrs }"
    v-on="{ ...$listeners }"
  />
</template>

<script>
export default {
  name: 'Chart',
  props: {
    type: {
      type: String,
      default: 'line-chart',
      validator: function (value) {
        return (
          [
            'line-chart',
            'doughnut',
            'polar-area',
            'bar-chart',
            'horizontal-bar'
          ].indexOf(value) !== -1
        )
      }
    }
  },
  data: () => ({
    loaded: false
  }),
  async created () {
    await this.$nextTick(() => {
      this.loaded = true
    })
  },
  beforeDestroy () {
    this.loaded = false
  }
}
</script>

<style lang="scss">
#chartjs-tooltip {
  opacity: 1;
  position: absolute;
  background: #474747;
  color: white;
  border-radius: 6px;
  -webkit-transition: all 0.1s ease;
  transition: all 0.1s ease;
  pointer-events: none;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  font-size: 12px;
  line-height: 16px;
  section {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    p {
      margin: 0;
    }
  }
}

.chartjs-tooltip-key {
  width: 10px;
  height: 10px;
  margin-right: 10px;
  border-radius: 50%;
  border: 2px solid white;
  display: inline-block;
}
.tooltip-list {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: 5px;
  }
}
</style>
