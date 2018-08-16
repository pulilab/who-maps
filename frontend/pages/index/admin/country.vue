<template>
  <country-admin />
</template>

<script>
import CountryAdmin from '../../../components/admin/CountryAdmin';
export default {

  components: { CountryAdmin },

  async fetch ({store}) {
    await store.dispatch('admin/map/loadMapData');
    await store.dispatch('admin/country/fetchData');
    // store.dispatch('admin/questions/setQuestionaireId', 'country');
    // store.dispatch('admin/questions/fetchQuestions');
  }
};
</script>
