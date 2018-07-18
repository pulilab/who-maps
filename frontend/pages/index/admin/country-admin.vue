<template>
  <div class="CountryAdmin">

    <dha-questionaire :label="'Country specific questionaire'"/>

    <vue-map-customizer/>

  </div>
</template>

<script>
import VueMapCustomizer from '../../../components/admin/VueMapCustomizer';
import DhaQuestionaire from '../../../components/admin/DhaQuestionaire';

export default {

  name: 'CountryAdministrator',
  components: {
    VueMapCustomizer,
    DhaQuestionaire
  },

  async fetch ({store}) {
    await store.dispatch('admin/map/loadMapData');
    store.dispatch('admin/questions/setQuestionaireId', 'country');
    store.dispatch('admin/questions/fetchQuestions');
  }

};
</script>
