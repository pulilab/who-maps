<template>
  <div>
    <dha-questionaire :label="'Partner questionaire'"/>
  </div>
</template>

<script>
import DhaQuestionaire from '../../components/admin/DhaQuestionaire.vue';

export default {
  name: 'Donor',

  components: {
    DhaQuestionaire
  },

  async fetch ({store}) {
    store.dispatch('setQuestionaireId', 'partner');
    store.dispatch('fetchQuestions');
  }
};
</script>
