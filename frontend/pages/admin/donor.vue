<template>
  <div>
    <dha-questionaire :label="'Donor questionaire'"/>
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
    store.dispatch('setQuestionaireId', 'donor');
    store.dispatch('fetchQuestions');
  }
};
</script>
