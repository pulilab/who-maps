<template>
  <div class="HealthSystemChallengesList">
    <ul>
      <li
        v-for="hsc in selected"
        :key="hsc.id"
      >
        {{ hsc.challenge }}
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
      healthSystemChallenges: 'projects/getHscChallenges'
    }),
    selected () {
      const hscs = this.healthSystemChallenges.reduce((a, c) => [...a, ...c.challenges], []);
      return hscs.filter(hfa => this.value.includes(hfa.id));
    }
  }
};
</script>

<style lang="less">
.HealthSystemChallengesList {
  width: 100%;
}
</style>
