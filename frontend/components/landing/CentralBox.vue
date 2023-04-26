<template>
  <div class="CentralBox">
    <signup-box v-if="!isLoggedIn" />
    <my-projects-box v-if="isLoggedIn" />
  </div>
</template>

<script>
import SignupBox from './SignupBox'
import MyProjectsBox from './MyProjectsBox'

export default {
  components: {
    SignupBox,
    MyProjectsBox
  },
  computed: {
    isLoggedIn () {
      return this.$auth.loggedIn
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CentralBox {
    height: 100%;
  }

</style>
