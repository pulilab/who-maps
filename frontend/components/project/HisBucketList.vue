<template>
  <div class="HisBucketList">
    <ul>
      <li
        v-for="his in selected"
        :key="his.id"
      >
        {{ his.name }}
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
      hisBucket: 'projects/getHisBucket'
    }),
    selected () {
      return this.hisBucket.filter(his => this.value.includes(his.id));
    }
  }
};
</script>

<style lang="less">
.HisBucketList {
  width: 100%;
}
</style>
