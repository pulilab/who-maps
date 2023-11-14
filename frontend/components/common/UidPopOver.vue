<template>
  <el-popover
    v-model="uidPopOver"
    placement="bottom-end"
    width="400"
    popper-class="popover"
  >
    <p class="popover__title">
      <b><translate>Share public link</translate></b>
    </p>
    <el-input
      ref="copyInput"
      v-model="uidUrl"
      class="popover__input"
      placeholder="Please input"
    />
    <el-button
      :type="copied ? 'success' : 'primary'"
      :icon="copied ? 'el-icon-check' : ''"
      @click="copyToClipboard"
    >
      {{ copied ? 'Copied' : 'Copy URL' }}
    </el-button>
    <el-button
      class="popover__button--text"
      @click="uidPopOver = false"
    >
      Cancel
    </el-button>
    <div
      slot="reference"
      class="uid popover__reference--pointer"
    >
      <template v-if="type === 'general'">
        <div class="popover__diplay--blue">
          {{ uid }} <fa :icon="uidPopOver ? 'angle-up' : 'angle-down'" />
        </div>
        <span><translate>Unique Project ID (UID)</translate></span>
      </template>
      <template v-if="type === 'infoSection'">
        <div class="Label">
          <translate>Unique Project ID (UID)</translate>
        </div>
        <div class="popover__diplay--blue Info">
          {{ uid }} <fa :icon="uidPopOver ? 'angle-up' : 'angle-down'" />
        </div>
      </template>
    </div>
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    uid: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: 'general'
    }
  },
  data () {
    return {
      uidPopOver: false,
      copied: false,
      base: ''
    }
  },
  computed: {
    ...mapGetters({
      landingData: 'landing/getLandingPageData'
    }),
    uidUrl () {
      return `${this.base}/p/${this.uid}`
    }
  },
  mounted () {
    this.base = window.location.origin
  },
  methods: {
    async copyToClipboard () {
      this.copied = true
      await navigator.clipboard.writeText(this.$refs.copyInput.value)
      setTimeout(() => { this.copied = false }, 2500)
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

.popover {
  position: relative;
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
