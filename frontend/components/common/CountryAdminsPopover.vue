<template>
  <el-popover
    v-model="adminPopover"
    placement="bottom-end"
    popper-class="popover"
  >
    <translate tag="strong" class="admin-title">Team members by country admins</translate>
    <div class="admin-list">
      <a
        v-for="(user,i) in admins"
        :key="i"  :href="`mailto:${user.user__email}`"
        class="NuxtLink Small IconRight"
      >
        {{ user.name }}
        <fa icon="envelope" />
      </a>
    </div>
    <i class="el-icon-close close-btn" @click="adminPopover = false" />
    <i slot="reference" :title="$gettext('Show country admins')" class="el-icon-info"></i>
  </el-popover>
</template>

<script>

export default {
  props: {
    admins: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      adminPopover: false,
    }
  },
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
.admin-title {
  margin-right: 1.5em;
}
.admin-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0.8em 1em 0 1em;
}
.close-btn {
  cursor: pointer;
  position: absolute;
  top: 0.8em;
  right: 0.8em;
  &:hover {
    color: @colorBrandPrimary;
  }
}
</style>
