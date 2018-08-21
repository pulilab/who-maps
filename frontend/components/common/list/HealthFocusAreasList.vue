<template>
  <div class="HealthFocusAreasList">
    <ul>
      <li
        v-for="hfa in selected"
        :key="hfa.id"
      >
        <list-action
          v-if="actions"
          @click="$emit('delete', hfa.id)"
        />
        <span> {{ hfa.name }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
import ListAction from './ListAction';
import { mapGetters } from 'vuex';
export default {
  components: {
    ListAction
  },
  props: {
    value: {
      type: Array,
      default: null
    },
    actions: {
      type: Boolean,
      default: false
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
