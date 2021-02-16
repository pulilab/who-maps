<template>
  <growth-info :incoming="incoming" :previous="previous" />
</template>

<script>
import GrowthInfo from "@/components/charts/GrowthInfo";
export default {
  components: {
    GrowthInfo,
  },
  data() {
    return {
      incoming: 0,
      previous: 0,
    };
  },
  created() {
    this.handleChange(100);
  },
  methods: {
    handleChange(max) {
      setInterval(() => {
        this.incoming = Math.floor(Math.random() * Math.floor(max));
        this.previous = Math.floor(Math.random() * Math.floor(max));
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
