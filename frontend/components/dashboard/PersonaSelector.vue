<template>
  <div class="PersonaSelector">
    <el-popover
      placement="bottom-center"
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
          <fa :icon="personaIcon" />
          {{ persona }}
        </div>
        <fa icon="caret-down" />
      </el-button>
      <div class="CustomPopoverList">
        <ul>
          <li class="Header">
            <fa icon="user" />
            Normal View
          </li>
          <li class="Active">
            {{ user.name }} (me)
          </li>
        </ul>
        <ul>
          <li class="Header">
            <fa icon="handshake" />
            Donor View
          </li>
          <li
            v-for="donor in donors"
            :key="donor"
            class="Active"
          >
            {{ donor }}
          </li>
        </ul>
        <ul>
          <li class="Header">
            <fa icon="globe" />
            Country View
          </li>
          <li
            v-for="moh in ministeryOfHealth"
            :key="moh"
            class="Active"
          >
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
      return 'user';
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

    .PersonaBox {
      display: inline;
    }

    .el-button--text {
      padding: 0;
      color: white;
    }

    .PersonaSelectorPopover {
      width: @advancedSearchWidth - 40px;
    }
  }
</style>
