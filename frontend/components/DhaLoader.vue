<template>
  <div
    v-if="loading"
    class="GlobalLoader">
    <div>
      <div class="Loader">
        <div />
        <span><translate>Loading</translate></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true;
    },
    finish () {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }
};
</script>

<style lang="less">
.GlobalLoader {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 5000;
  background-color: rgba(255,255,255,.5);

  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: rgba(255,255,255,.9);
    border-radius: 5px;
    box-shadow: 0 4px 12px 0 rgba(0,0,0,.12);
  }

  p {
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
  }
}
</style>
