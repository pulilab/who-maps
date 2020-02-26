<template>
  <el-popover
    placement="bottom-end"
    width="335"
    v-model="uidPopOver"
    popper-class="popover"
  >
    <p class="popover__title"><b><translate>Share public link</translate></b></p>
    <el-input class="popover__input" placeholder="Please input" v-model="uid" id="copyInput"></el-input>
    <el-button
      :type="copied ? 'success' : 'primary'"
      :icon="copied ? 'el-icon-check' : ''"
      @click="copyToClipboard"
    >
      {{ copied ? 'Copied' : 'Copy URL'}}
    </el-button>
    <el-button class="popover__button--text" @click="uidPopOver = false">Cancel</el-button>
    <div class="uid popover__reference--pointer" slot="reference">
      <template v-if="type === 'general'">
        <div class="popover__diplay--blue">
          {{ uid }} <fa :icon="uidPopOver ? 'angle-up' : 'angle-down'" />
        </div>
        <span><translate>Project UID</translate></span>
      </template>
      <template v-if="type === 'infoSection'">
        <div class="Label">
          <translate>Project UID</translate>
        </div>
        <div class="popover__diplay--blue Info">
          {{ uid }} <fa :icon="uidPopOver ? 'angle-up' : 'angle-down'" />
        </div>
      </template>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    uid: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'general'
    }
  },
  data() {
    return {
      uidPopOver: false,
      copied: false
    }
  },
  methods: {
    copyToClipboard () {
      // http://dh.atlas.org/projects/dha-0012xyz

      let testingCodeToCopy = document.querySelector('#copyInput');
      testingCodeToCopy.setAttribute('type', 'text');
      testingCodeToCopy.select();

      try {
        let successful = document.execCommand('copy');
        this.copied = successful ? true : false;
      } catch (err) {
        this.copied = false
      }

      window.getSelection().removeAllRanges();
      setTimeout(() => { this.copied = false }, 3200)
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

.popover {
  padding: 18px;
}
.popover__title {
  margin: 0 0 16px 0;
}
.popover__input {
  margin: 0 0 16px 0;
}
.popover__button--text {
  background-color: transparent;
  color: @colorTextSecondary;
  &:hover {
    background-color: transparent!important;
    color: @colorTextSecondary!important;
  }
}
.popover__diplay--blue {
  color: @colorBrandPrimary!important;
}
.popover__reference--pointer {
  cursor: pointer;
}
</style>
