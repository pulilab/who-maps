<template>
  <el-tabs
    :value="activeTab"
    @tab-click="tabChangeHandler"
  >
    <el-tab-pane
      :label="$gettext('Sub-national')"
      name="subNational">
      <project-card
        show-organisation
        show-arrow-on-over
      />
      <project-card
        show-organisation
        show-arrow-on-over
      />
      <project-card
        show-organisation
        show-arrow-on-over
      />
    </el-tab-pane>
    <el-tab-pane
      :label="$gettext('National')"
      name="national">
      <project-card
        show-organisation
        show-arrow-on-over
      />
      <project-card
        show-organisation
        show-arrow-on-over
      />
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
