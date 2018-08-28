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
        <span>
          <fa
            icon="check"
            size="xs" />
        </span>
        <span>{{ hfa.name }}</span>
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
    },
    limit: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      healthFocusAreas: 'projects/getHealthFocusAreas'
    }),
    selected () {
      const hfas = this.healthFocusAreas.reduce((a, c) => [...a, ...c.health_focus_areas], []);
      const result = hfas.filter(hfa => this.value.includes(hfa.id));
      return this.limit ? result.slice(0, this.limit) : result;
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .HealthFocusAreasList {
    width: 100%;
  }
</style>
