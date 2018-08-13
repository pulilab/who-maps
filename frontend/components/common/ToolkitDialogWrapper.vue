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

  // TODO: Remove Angular Material
  body.md-dialog-is-showing {
    overflow: hidden;
  }

  md-backdrop.md-opaque {
    opacity: .5 !important;
  }

  md-backdrop.md-dialog-backdrop {
    z-index: 5000 !important;
  }

  .md-dialog-container {
    height: 100vh !important;

    .thematic-overview {
      margin: 0 !important;
      box-shadow: 0 6px 12px 4px rgba(0,0,0,0.24);

      .left {}

      .right {
        box-shadow: none !important;
      }
    }
  }

</style>
