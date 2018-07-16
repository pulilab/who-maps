<template>
  <div class="CountryAdmin">

    <dha-questionaire :label="'Country specific questionaire'"/>

    <vue-map-customizer
      :country-id="58"
      :sub-level-types="[{'name': 'region', 'displayName': 'Region'}, {'name': 'province', 'displayName': 'Province'}]"
      flag-base-url="/static/flags/"
      api-url="/api/country-map-data/"
    />

  </div>
</template>

<script>
import VueMapCustomizer from '../../components/admin/VueMapCustomizer';
import DhaQuestionaire from '../../components/admin/DhaQuestionaire';

export default {

  name: 'CountryAdministrator',
  components: {
    VueMapCustomizer,
    DhaQuestionaire
  },

  async fetch ({store}) {
    store.dispatch('setQuestionaireId', 'country');
    store.dispatch('fetchQuestions');
  }

};
</script>
