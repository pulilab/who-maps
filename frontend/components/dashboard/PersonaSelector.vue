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
            Normal View
          </div>
          <li class="Active">
            <fa icon="check" />
            {{ user.name }} (me)
          </li>

          <div class="el-popover__title">
            <fa icon="handshake" />
            Donor View
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
            Country View
          </div>
          <li
            v-for="moh in ministeryOfHealth"
            :key="moh"
          >
            <fa icon="check" />
            {{ moh }} MoH
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
      return 'Me';
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
      line-height: @actionBarHeight - 12px;

      .PersonaIcon {
        margin: 0 2px 0 8px;
      }
    }

    .el-button--text {
      padding: 0;
      color: @colorWhite;
    }

    .PersonaSelectorPopover {
      width: @advancedSearchWidth - 40px;
    }
  }
</style>
