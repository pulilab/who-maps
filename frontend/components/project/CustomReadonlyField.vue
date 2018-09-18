<template>
  <simple-field
    :header="question"
  >
    <template v-if="type < 5">
      {{ value }}
    </template>
    <template v-if="type === 5">
      <ul>
        <li
          v-for="v in value"
          :key="v"
        >
          {{ v }}
        </li>
      </ul>
    </template>
  </simple-field>
</template>

<script>
import SimpleField from './SimpleField';

import { mapGetters } from 'vuex';

export default {
  components: {
    SimpleField
  },
  props: {
    type: {
      type: Number,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    module: {
      type: String,
      default: 'country'
    }
  },
  computed: {
    ...mapGetters({
      getCountryAnswerDetails: 'project/getCountryAnswerDetails'
    }),
    answer () {
      const saved = this.module === 'country' ? this.getCountryAnswerDetails(this.id) : null;
      return saved || {
        question_id: this.id,
        answer: []
      };
    },
    value () {
      return this.type === 5 ? this.answer.answer : this.answer.answer[0];
    }
  }
};
</script>

<style lang="less">
.CustomField {
  width: 100%;

  .CustomFieldSelector {
    width: 100%;
  }
}

</style>
