<template>
  <div class="PersonaSelector">
    <el-popover
      placement="bottom-end"
      popper-class="CustomPopover PersonaSelectorPopover"
      trigger="click"
    >
      <el-button
        slot="reference"
        type="text"
        class="IconRight"
      >
        View as:
        <div :class="['PersonaBox', personaClass]">
          <fa
            :icon="personaIcon"
            class="PersonaIcon" />
          {{ persona }}
        </div>
        <fa icon="caret-down" />
      </el-button>
      <div class="CustomPopoverList">
        <ul>
          <div class="el-popover__title">
            <fa icon="user" />
            <translate>Normal View</translate>
          </div>
          <li class="Active">
            <fa icon="check" />
            <translate>{{ user.name }} (me)</translate>
          </li>

          <div class="el-popover__title">
            <fa icon="handshake" />
            <translate>Donor View</translate>
          </div>
          <li
            v-for="donor in donors"
            :key="donor"
          >
            <fa icon="check" />
            {{ donor }}
          </li>

          <div class="el-popover__title">
            <fa icon="globe" />
            <translate>Country View</translate>
          </div>
          <li
            v-for="moh in ministeryOfHealth"
            :key="moh"
          >
            <fa icon="check" />
            <translate>{{ moh }} MoH</translate>
          </li>
        </ul>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      user: 'user/getProfile'
    }),
    persona () {
      return this.$gettext('Me');
    },
    personaClass () {
      return 'Me';
    },
    personaIcon () {
      return 'user-circle';
    },
    donors () {
      return ['Path', 'WHO'];
    },
    ministeryOfHealth () {
      return ['Sierra leone ', 'Kenya'];
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .PersonaSelector {
    text-align: right;

    .PersonaBox {
      display: inline;
      line-height: @actionBarHeight;

      .PersonaIcon {
        margin: 0 2px 0 8px;
      }
    }

    .el-button--text {
      padding: 0;
      color: @colorWhite;
    }
  }

  .PersonaSelectorPopover {
    transform: translate(10px, -35px);
  }
</style>
