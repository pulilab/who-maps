<template>
  <div class="CollapsibleCard">
    <el-card :body-style="{ padding: '0px' }">
      <div
        slot="header"
        class="CollapsibleHeader">
        <span class="CardTitle">{{ title }}</span>
        <el-button
          type="text"
          class="CollapseToggle"
          @click="toggleCard"
        >
          <fa
            v-show="open"
            icon="angle-down"
            size="lg"
          />
          <fa
            v-show="!open"
            icon="angle-up"
            size="lg"
          />
        </el-button>
      </div>

      <transition name="slide-fade">
        <div
          v-show="open"
          class="ContentContainer"
        >
          <slot />
        </div>
      </transition>

    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      open: true
    };
  },
  methods: {
    toggleCard () {
      this.open = !this.open;
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

.CollapsibleCard {
  margin: 0 0 20px;

  .el-card__body {}

  .el-card__header {
    padding: 0 20px 0 40px;
    height: 58px;
    line-height: 58px;
    background-color: @colorBrandPrimaryDark;
    font-size: @fontSizeLarger;
  }

  .CollapsibleHeader {
    .clearfix();

    .CardTitle {
      float: left;
    }

    .CollapseToggle {
      width: 58px;
      height: 58px;
      float: right;
      color: @colorWhite;
      transition: @transitionFadeLinear;

      &:hover {
        opacity: .8;
      }
    }
  }

  .ContentContainer {
    padding: 40px 80px 60px 40px;
  }

  .slide-fade-enter-active {
    transition: @transitionAll;
  }

  .slide-fade-leave-active {
    transition: @transitionAll;
  }

  .slide-fade-enter,
  .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(-20px);
    opacity: 0;
  }
}

</style>
