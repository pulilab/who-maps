<template>
  <ul>
    <li
      v-for="stage in projectStages"
      :key="stage.id"
    >
      {{ stage }}
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    stages: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      allStages: 'project/getStagesList'
    }),
    projectStages () {
      if (Array.isArray(this.stages) && this.stages.length > 0) {
        const currStagesIds = this.stages.map(i => i.id);
        return this.allStages.filter(i => currStagesIds.includes(i.id)).map(i => i.name);
      }
      return ['N/A'];
    }
  }
};
</script>

<style lang="less" scoped>
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      margin-bottom: 4px;
    }
  }
</style>
