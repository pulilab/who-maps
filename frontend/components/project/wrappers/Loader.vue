<template>
  <div class="loader">
    <spinner />
  </div>
</template>

<script>
import Spinner from "@/components/common/Spinner";
export default {
  components: {
    Spinner,
  },
};
</script>

<style lang="less" scoped>
.loader {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
