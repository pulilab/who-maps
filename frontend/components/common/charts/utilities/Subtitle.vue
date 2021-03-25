<template>
  <p class="subtitle">
    <template v-if="!item.label">
      <translate>
        Click on the bars to see health focus areas in specific category.
      </translate>
    </template>
    <template v-else>
      <span class="info">{{ item.label }}: {{ item.value }}</span>
    </template>
  </p>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  color: #a8a8a9;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 15px;
  text-align: center;
  margin: 16px 0 0 0;
  span.info {
    color: #404041;
    // font-size: 16px;
    // font-size: 12px;
    // letter-spacing: -0.44px;
    // line-height: 20px;
  }
}
</style>
