<template>
  <div class="CollapsibleCard">
    <el-card>
      <div
        slot="header"
        class="CollapsibleHeader">
        <span>{{ title }}</span>
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

.CollapsibleCard {

  margin: 0 0 20px 0;

  .el-card__body {
    padding: 0;
  }

  .CollapsibleHeader {

    span {
      float:left;
    }

    .CollapseToggle {
      position: relative;
      float:right;
      color: white;
    }
  }

  .ContentContainer {
    padding: 20px;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
}

</style>
