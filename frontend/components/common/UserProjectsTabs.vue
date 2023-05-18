<template>
  <div>
    <div class="tab-wrapper">
      <div class="tabs">
        <div @click="setActiveTab(0)" :class="getStyle(0)">
          <i class="el-icon-star-off"></i>
          <translate :parameters="{ count: counters.myprojects }">
            My projects ({count})
          </translate>
        </div>
        <div @click="setActiveTab(1)" :class="getStyle(1)">
          <i class="el-icon-takeaway-box"></i>
          <translate :parameters="{ count: counters.archive }">
            Archived projects ({count})
          </translate>
        </div>
      </div>
    </div>
    <div class="info-wrapper">
      <div v-if="activeTab === 0" key="myprojects">
        <translate>Here are all of the projects you are a</translate>
        <fa icon="star" class="owner" />
        <b><translate>Member</translate></b>
        &nbsp;<translate>or</translate>
        <fa icon="eye" class="viewer" />
        <b><translate>Viewer</translate></b>
        &nbsp;<translate>of.</translate>
      </div>
      <div v-if="activeTab === 1 && counters.archive > 0" key="archived">
        <translate>Here are all your archived projects. You can restore individual projects by submitting a restore request.</translate>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    activeTab: {
      type: Number,
      default: 0
    },
    counters: {
      type: Object,
      required: true
    },
  },
  watch: {
    activeTab(val) {
      if (process.client) {
        const list = val === 1 ? 'archive' : 'myprojects'
        this.$router.replace({ ...this.$route, query: { list } })
      }
    }
  },
  methods: {
    getStyle(checkTab) {
      return checkTab === this.activeTab ? 'active' : ''
    },
    setActiveTab(tab) {
      this.$emit('change', tab)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";
.owner {
  color: @colorOwner;
}
.viewer {
  color: @colorViewer;
}
.tab-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: white;
  .tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 36px;
    margin-top: 32px;
    div {
      cursor: pointer;
      display: flex;
      color: #777779;
      font-size: 14px;
      text-transform: uppercase;
      padding-bottom: 14px;
      padding-left: 8px;
      padding-right: 8px;
      border-bottom: 3px solid transparent;
      &.active {
        color: #404041;
        font-weight: bold;
        border-color: @colorBrandPrimary;
        i {
          font-weight: bold;
        }
      }
      i {
        margin: 0 10px 0 0;
        font-size: 16px;
      }
    }

  }
}
.info-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2em;
}
</style>
