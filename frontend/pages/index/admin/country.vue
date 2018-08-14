<template>
  <country-admin />
</template>

<script>
import CountryAdmin from '../../../components/admin/CountryAdmin';
export default {

  components: { CountryAdmin },

  async fetch ({store}) {
    await store.dispatch('admin/map/loadMapData');
    // store.dispatch('admin/questions/setQuestionaireId', 'country');
    // store.dispatch('admin/questions/fetchQuestions');
    await store.dispatch('admin/country/fetchData');
  }
};
</script>
