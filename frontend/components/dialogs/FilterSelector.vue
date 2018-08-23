<template>
  <div class="FilterSelector">
    <filter-item
      :active="selectedFilterArea === 'dhi'"
      item="dhi"
      header="Digital Health Interventions"/>
    <filter-item
      :active="selectedFilterArea === 'hfa'"
      item="hfa"
      header="Health focus areas"/>
    <filter-item
      :active="selectedFilterArea === 'hsc'"
      item="hsc"
      header="Health system challenges"/>
    <filter-item
      :active="selectedFilterArea === 'his'"
      item="his"
      header="Health Information System"/>
    <filter-item
      :active="selectedFilterArea === 'platform'"
      item="platform"
      header="Software"/>
  </div>
</template>

<script>
import FilterItem from './FilterItem';
import { mapGetters } from 'vuex';

export default {
  components: {
    FilterItem
  },
  computed: {
    ...mapGetters({
      selectedFilterArea: 'layout/getDashboardFiltersDialogState'
    })
  }
};
</script>

<style>

</style>
