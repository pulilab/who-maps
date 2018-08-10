<template>
  <div class="angularjs">
    <div id="thematicjs"/>
    <!-- Following A is just a placeholder to avoid a flash of content -->
    <a
      v-if="!initialised"
      class="HeaderBtn ToolkitBtn"
      href="#">
      Toolkit
    </a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      initialised: false
    };
  },
  mounted () {
    const factory = require('../../angular/Thematic/thematicFactory');
    factory.factory(0, 0, 'MAPS Toolkit', 'HeaderBtn', 'Toolkit');
    this.initialised = true;
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ToolkitBtn {}

</style>
