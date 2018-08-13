<template>

  <div class="SwitchViewBox">
    <div class="wrapper">
      <el-switch
        :value="activeTab"
        active-text="National"
        active-value="national"
        inactive-value="subNational"
        inactive-text="Sub-national"
        @change="setActiveTab($event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  methods: {
    setActiveTab ($event) {
      this.$emit('update:activeTab', $event);
    }
  }
};
</script>

<style lang="less">
  .SwitchViewBox {
    z-index: 1010;
    position:relative;

    .wrapper {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
</style>
