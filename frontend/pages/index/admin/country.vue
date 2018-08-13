<template>
  <div class="CountryAdmin">

    <div class="AdminHeading">Country admin</div>

    <collapsible-card title="Country information">
      <h1>Country information</h1>
    </collapsible-card>

    <collapsible-card title="User management">
      <h1>User management</h1>
    </collapsible-card>

    <collapsible-card title="Country specific questionaire">
      <h1>Country specific questionaire</h1>
      <dha-questionaire :label="'Country specific questionaire'"/>
    </collapsible-card>

    <collapsible-card title="Country map">
      <vue-map-customizer/>
    </collapsible-card>

  </div>
</template>

<script>
import CollapsibleCard from '../../../components/project/CollapsibleCard';
import VueMapCustomizer from '../../../components/admin/VueMapCustomizer';
import DhaQuestionaire from '../../../components/admin/DhaQuestionaire';

export default {

  name: 'CountryAdministrator',
  components: {
    CollapsibleCard,
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

<style lang="less" scoped>
  .CountryAdmin {
    .AdminHeading {
      color: #474747;
      font-family: Arial;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: -1px;
      line-height: 24px;
      text-align: center;
      margin: 40px 0;
    }
  }
</style>
