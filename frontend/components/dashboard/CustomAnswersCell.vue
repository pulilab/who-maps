<template>
  <div class="CustomAnswersCell">
    <ul v-if="type > 3">
      <!-- TODO -->
      <!-- We might need the same v-for limiter here as on HFA list not to exceed the 4 lines max. limit -->
      <li
        v-for="(v, index) in values"
        :key="index"
      >
        <span>
          <fa
            icon="check"
            size="xs" />
        </span>
        <span>{{ v }}</span>
      </li>
    </ul>
    <p v-if="type < 4">
      {{ values[0] }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: null
    },
    donorId: {
      type: Number,
      default: null
    }
  },
  computed: {
    source () {
      return this.donorId ? 'donor_answers' : 'country_answers';
    },
    values () {
      if (this.id && this.row && this.row[this.source]) {
        const module = this.row[this.source];
        if (this.donorId) {
          return module[this.donorId] && module[this.donorId][this.id] ? module[this.donorId][this.id] : [];
        }
        return module[this.id] ? module[this.id] : [];
      }
      return [];
    }
  }
};
</script>

<style lang="less">
.CustomAnswersCell {
  width: 100%;
}
</style>
