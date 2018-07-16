<template>
  <div>
    <dha-questionaire :label="'Donor questionaire'"/>
  </div>
</template>

<script>
import DhaQuestionaire from '../../../components/admin/DhaQuestionaire.vue';

export default {
  name: 'Donor',

  components: {
    DhaQuestionaire
  },
  async fetch ({store}) {
    store.dispatch('admin/questions/setQuestionaireId', 'donor');
    store.dispatch('admin/questions/fetchQuestions');
  }
};
</script>
