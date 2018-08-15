<template>
  <el-tabs
    :value="activeTab"
    @tab-click="tabChangeHandler"
  >
    <el-tab-pane
      label="Sub-national"
      name="subNational">
      <project-card />
      <project-card />
      <project-card />
    </el-tab-pane>
    <el-tab-pane
      label="National"
      name="national">
      <project-card />
      <project-card />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ProjectCard from '../ProjectCard';

export default {
  components: {
    ProjectCard
  },
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  watch: {
    activeTab: {
      immediate: true,
      handler (value) {
        if (value) {
          this.setStripeSize();
        }
      }
    }
  },
  methods: {
    tabChangeHandler (value) {
      this.$emit('change', value);
    },
    setStripeSize () {
      this.$nextTick(() => {
        const stripe = this.$el.querySelector('.el-tabs__active-bar');
        const tabNameBox = this.$el.querySelector('.el-tabs__item.is-active').getBoundingClientRect();
        const componentBox = this.$el.getBoundingClientRect();
        const stripeWidth = tabNameBox.width - 12;
        const stripeTranslate = tabNameBox.left === 60 ? 0 : Math.ceil(tabNameBox.left - componentBox.left) - 9;
        stripe.style.width = `${stripeWidth}px`;
        stripe.style.transform = `translate(${stripeTranslate}px)`;
      });
    }
  }
};
</script>

<style>

</style>
