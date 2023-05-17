<template>
  <div :key="status" :class="`ProjectStatus ${status}`">
    {{ statusText[status] }}
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['draft', 'published', 'approved', 'archived'].includes(value)
    }
  },
  data() {
    return {
      statusText: {
        draft: this.$gettext('Draft'),
        published: this.$gettext('Published'),
        approved: this.$gettext('Approved by MOH'),
        archived: this.$gettext('Archived'),
      }
    }
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/style/variables.less';
@import "../../assets/style/mixins.less";

.ProjectStatus {
  display: inline-block;
  padding: 6px 16px;
  font-size: @fontSizeExtraSmall;
  font-weight: 700;
  line-height: 12px;
  text-transform: uppercase;
  color: @colorTextPrimary;
  border-radius: 12px;

  &.draft {
    background-color: @colorDraft;
  }

  &.published {
    background-color: @colorPublished;
    color: @colorWhite;
  }

  &.approved {
    background-color: @colorApproved;
  }

  &.archived {
    background-color: @colorApproved;
  }
}
</style>