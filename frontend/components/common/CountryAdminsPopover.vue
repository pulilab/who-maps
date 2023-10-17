<template>
  <el-popover
    v-model="adminPopover"
    width="400"
    placement="bottom-end"
    popper-class="popover"
  >
    <template v-if="hasAdmins">
      <translate tag="p" class="admin-title" key="admins">
        The contact person can help you onboard as co-editor or update the project if you have further details.
        If the contact person is unresponsive, your can try to reach out to the designated DHA administrator(s) for the country the project is receding:
      </translate>
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
    </template>
    <template v-else>
      <translate tag="p" class="admin-title" key="support">
        The contact person can help you onboard as co-editor or update the project if you have further details.
        If the contact person is unresponsive, your can try to reach out to:
      </translate>
      <a href="mailto:DIGITAL-HEALTH-ATLAS@who.int" class="NuxtLink Small IconRight">
        <translate>DHA support</translate>
        <fa icon="envelope" />
    </a>
    </template>
    <!-- <translate tag="strong" class="admin-title">Team members by country admins</translate> -->
    <i class="el-icon-close close-btn" @click="adminPopover = false" />
    <i slot="reference" :title="$gettext('Show country admins')" class="el-icon-info"></i>
  </el-popover>
</template>

<script>

export default {
  props: {
    admins: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  data() {
    return {
      adminPopover: false,
    }
  },
  computed: {
    hasAdmins() {
      return this.admins && this.admins.length > 0
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
.admin-title {
  margin: 0;
  text-align: left;
  word-break: normal;
  hyphens: auto;
  margin-right: 0.8em;
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
