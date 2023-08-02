<template>
  <div class="HisBucketList">
    <ul>
      <li v-for="service in sappList" :key="service.id">
        <ListAction v-if="actions" @click="$emit('delete', service.id)" />
        <span> {{ service.name }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ListAction from '@/components/common/list/ListAction.vue'

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
    }
  },
  computed: {
    ...mapGetters({
      applicationTypes: 'projects/getApplicationTypes',
    }),
    sappList () {
      const items = this.applicationTypes.reduce((a, c) => {
          c.services.forEach(service => {
            if (this.value.includes(service.id)) a.push(service)
          })
          return a
        }, [])
      return this.limit
        ? items.sort((a, b) => a.name.localeCompare(b.name)).slice(0, this.limit)
        : items.sort((a, b) => a.name.localeCompare(b.name))
    },
  }
}
</script>
