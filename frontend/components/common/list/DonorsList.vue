
<template>
  <div class="DonorList">
    <ul>
      <li
        v-for="p in selected"
        :key="p.id"
      >
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
