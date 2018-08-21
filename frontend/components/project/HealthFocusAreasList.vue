<template>
  <div class="HealthFocusAreasList">
    <ul>
      <li
        v-for="hfa in selected"
        :key="hfa.id"
      >
        {{ hfa.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      healthFocusAreas: 'projects/getHealthFocusAreas'
    }),
    selected () {
      const hfas = this.healthFocusAreas.reduce((a, c) => [...a, ...c.health_focus_areas], []);
      return hfas.filter(hfa => this.value.includes(hfa.id));
    }
  }
};
</script>

<style lang="less">
.HealthFocusAreasList {
  width: 100%;
}
.HealthFocusAreasSelectorDropdown {

}
</style>
