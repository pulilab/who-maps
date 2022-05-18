<template>
  <div class="UserDropdown MenuLink nuxt-link-active">
    <el-popover
      v-model="shown"
      placement="bottom-end"
      visible-arrow="false"
      popper-class="CustomPopover UserDropdownPopper"
    >
      <el-button slot="reference" type="text" class="HeaderBtn nuxt-link-active">
        {{ activeMenuItem }}
        <fa icon="caret-down" />
      </el-button>

      <div class="DropdownContent">
        <div v-for="locale in localesButArabic" :key="locale.code" @click="closePopover" class="DropdownLink">
          <nuxt-link :to="switchLocalePath(locale.code)" class="HeaderBtn">
            {{ locale.name }}
          </nuxt-link>
        </div>
      </div>
    </el-popover>

  </div>
</template>

<script>
export default {
  data () {
    return {
      shown: false,
    }
  },
  computed: {
    localesButArabic () {
      if (this.$route.query.ar) {
        return this.$i18n.locales
      }
      return this.$i18n.locales.filter(la => la.code !== 'ar')
    },
    activeMenuItem() {
      const routeLangCode = this.$route.path.split('/')[1]
      return this.localesButArabic.find(l => l.code === routeLangCode).name
    },
  },
  methods: {
    closePopover () {
      this.shown = false
    },
    switchLanguage(code) {
      this.switchLocalePath(code)
      this.closePopover()
    }
  }
}
</script>

<style lang="less">
@import "../../assets/style/variables.less";

  .mt-10 {
    margin-top: 10px !important;
  }
  .MenuLink {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: -17px;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 4px;
      background-color: @colorWhite;
      transform: translateY(-4px);
      transition: @transitionAll;
    }

  }
</style>
