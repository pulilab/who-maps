<template>
  <div class="ProjectPublishedView">
    <div class="PageTitle">
      <h2>View Project Info</h2>
      <p>
        You are viewing the
        <span class="PublishedLabel">
          Published
        </span>
        version of the project.
      </p>
    </div>
    <project-data />
  </div>
</template>

<script>
import ProjectData from '../../../../components/project/ProjectData';
export default {
  components: {
    ProjectData
  },
  async fetch ({store, params}) {
    await store.dispatch('project/loadProject', params.id);
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .ProjectPublishedView {
    .CollapsibleCard {
      .el-card__header {
        background-color: @colorPublished !important;
      }
    }

    .Stepper {
      li {
        &.active,
        &:hover,
        &:active {
          .el-button {
            .Step {
              background-color: @colorPublished !important;
            }
          }
        }
      }
    }

    .PublishedLabel {
      display: inline-block;
      height: 24px;
      margin: 0 2px;
      padding: 0 10px;
      font-size: @fontSizeSmall;
      font-weight: 700;
      line-height: 24px;
      text-transform: uppercase;
      border-radius: 12px;
      background-color: @colorPublished;
      color: @colorWhite;
    }
  }
</style>
