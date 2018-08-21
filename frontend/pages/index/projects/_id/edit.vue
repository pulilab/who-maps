<template>
  <div class="ProjectEdit">
    <nuxt-child />
  </div>
</template>

<script>
export default {
  async fetch ({store, params}) {
    await store.dispatch('project/loadProject', params.id);
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .ProjectEdit {
    .CollapsibleCard {
      .el-card__header {
        background-color: @colorDraft !important;
        color: @colorTextPrimary !important;
      }

      .CollapsibleHeader {
        .CollapseToggle {
          color: @colorTextPrimary !important;
        }
      }
    }

    .Stepper {
      li {
        &.active,
        &:hover,
        &:active {
          .el-button {
            .Step {
              background-color: @colorDraft !important;
              color: @colorTextPrimary;
            }
          }
        }
      }
    }
  }
</style>
