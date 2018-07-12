<template>
  <div
    v-show="visible"
    class="WelcomeBox"
  >
    <button @click="closeWelcomeBox">
      <i class="el-icon-close" />
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true
    };
  },
  methods: {
    closeWelcomeBox () {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss">

  .WelcomeBox {
    height: 300px;
    width: 300px;
    background-color: blue;
    display: flex;
    justify-content: flex-end;
    align-items: start;
  }

</style>
