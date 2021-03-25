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
        <span v-if="showCheck">
          <fa
            icon="check"
            size="xs"
          />
        </span>
        <span> {{ hfa.name }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'
import ListAction from './ListAction'
import { mapGetters } from 'vuex'
export default {
  components: {
    ListAction
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    actions: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: null
    },
    valueIsChild: {
      type: Boolean,
      default: false
    },
    showCheck: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      healthFocusAreas: 'projects/getHealthFocusAreas'
    }),
    selected () {
      let result = []
      if (!this.valueIsChild) {
        result = this.healthFocusAreas.filter(h => this.value.includes(h.id))
      } else {
        result = flatten(this.healthFocusAreas.map(item => item.health_focus_areas))
        result = uniqBy(result.filter(item => this.value.includes(item.id)), 'id')
      }
      return this.limit ? result.slice(0, this.limit) : result
    }
  }
}
</script>

<style lang="less">
.HealthFocusAreasList {
  width: 100%;
}
.HealthFocusAreasSelectorDropdown {

}
</style>
