<template>
  <component
    v-if="loaded"
    :is="type"
    v-bind="{ ...$props, ...$attrs }"
  ></component>
</template>

<script>
export default {
  name: "chart",
  props: {
    type: {
      type: String,
      default: "line-chart",
      validator: function (value) {
        return (
          ["line-chart", "doughnut", "polar-area", "bar-chart"].indexOf(
            value
          ) !== -1
        );
      },
    },
  },
  data: () => ({
    loaded: false,
  }),
  async created() {
    await setTimeout(() => {
      this.loaded = true;
    }, 250);
  },
  beforeDestroy() {
    this.loaded = false;
  },
};
</script>

