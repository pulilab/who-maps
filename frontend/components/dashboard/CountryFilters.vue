<template>
  <div class="CountryFilters">
    <country-select v-model="selectedCountry" />
    <region-select v-model="selectedRegion" />
  </div>
</template>

<script>
import CountrySelect from '../common/CountrySelect';
import RegionSelect from '../common/RegionSelect';
export default {
  components: {
    CountrySelect,
    RegionSelect
  },
  data () {
    return {
      selectedCountry: null,
      selectedRegion: null
    };
  }
};
</script>

<style>

</style>
