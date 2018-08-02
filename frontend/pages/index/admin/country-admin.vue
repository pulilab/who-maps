<template>
  <div class="CountryAdmin">
    <country-chooser />
    <dha-questionaire :label="'Country specific questionaire'"/>

    <vue-map-customizer/>

  </div>
</template>

<script>
import VueMapCustomizer from '../../../components/admin/VueMapCustomizer';
import DhaQuestionaire from '../../../components/admin/DhaQuestionaire';
import CountryChooser from '../../../components/admin/CountryChooser';

export default {

  name: 'CountryAdministrator',
  components: {
    VueMapCustomizer,
    DhaQuestionaire,
    CountryChooser
  },

  async fetch ({store}) {
    await store.dispatch('admin/map/loadMapData');
    store.dispatch('admin/questions/setQuestionaireId', 'country');
    store.dispatch('admin/questions/fetchQuestions');
  }

};
</script>
