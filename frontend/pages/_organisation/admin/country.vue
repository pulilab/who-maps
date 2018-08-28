<template>
  <country-admin />
</template>

<script>
import CountryAdmin from '../../../components/admin/CountryAdmin';
export default {

  components: { CountryAdmin },

  async fetch ({store}) {
    await Promise.all([
      store.dispatch('system/loadUserProfiles')
    ]);
    await store.dispatch('admin/country/fetchData');
    await store.dispatch('admin/map/loadGeoJSON');
    // store.dispatch('admin/questions/setQuestionaireId', 'country');
    // store.dispatch('admin/questions/fetchQuestions');
  }
};
</script>
