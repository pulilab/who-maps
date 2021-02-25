<template>
  <section>
    <div v-for="item in items" :key="item.color">
      <span class="color" :style="{ 'background-color': item.color }" />
      <span class="label">{{ item.label }}</span>
      <span class="dots" />
      <span class="value">{{ item.value }}</span>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "~assets/style/variables.less";
section {
  margin: 15px 65px 65px;
}
div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  span {
    color: #404041;
    font-size: 16px;
    letter-spacing: 0;
    line-height: 24px;
  }
  .color {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 12px;
  }
  .dots {
    border: 1px dashed #d8d1c9;
    flex-grow: 1;
    align-self: flex-end;
    margin: 0 12px 6px;
  }
  .value {
    font-weight: 700;
  }
}
</style>
