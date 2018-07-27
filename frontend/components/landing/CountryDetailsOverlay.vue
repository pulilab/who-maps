<template>
  <div class="CountryDetailsOverlay">
    <national-level-coverage-box v-if="selectedCountries > 0" />
    <district-marker
      v-for="pin in districtPins"
      :key="pin.id"
      :pin="pin"
    />

    <geo-json-layer
      :list="selectedCountries"
      :collection="geoJson"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DistrictMarker from './DistrictMarker';
import GeoJsonLayer from './GeoJsonLayer';
import NationalLevelCoverageBox from './NationalLevelCoverageBox';

export default {
  components: {
    DistrictMarker,
    GeoJsonLayer,
    NationalLevelCoverageBox
  },
  computed: {
    ...mapGetters({
      countriesPin: 'landing/getLandingPagePins',
      geoJson: 'landing/getGeoJsonLibrary',
      selectedCountries: 'landing/getSelectedCountries',
      districtPins: 'landing/getDistrictPins'
    })
  }
};
</script>

<style lang="less">
.CountryDetailsOverlay {}
</style>
