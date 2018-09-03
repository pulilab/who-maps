
<template>
  <div class="DonorList">
    <ul>
      <li
        v-for="p in selected"
        :key="p.id"
        class="DonorItem"
      >
        <span v-show="showIcon">
          <fa
            icon="user-tie"
            size="xs" />
        </span>
        <span>{{ p.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  components: {
  },
  props: {
    value: {
      type: Array,
      default: null
    },
    limit: {
      type: Number,
      default: null
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      donors: 'system/getDonors'
    }),
    selected () {
      const result = this.donors.filter(p => this.value.includes(p.id));
      return this.limit ? result.slice(0, this.limit) : result;
    }
  }
};
</script>

<style lang="less">
.DonorList {
  width: 100%;
}
</style>
