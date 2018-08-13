<template>
  <div class="CountryDetailsOverlay">
    <national-level-coverage-box v-if="selectedCountry" />
    <district-marker
      v-for="pin in districtPins"
      :key="pin.id"
      :pin="pin"
    />

    <geo-json-layer
      :country="selectedCountry"
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
      geoJson: 'countries/getGeoJsonLibrary',
      selectedCountry: 'landing/getSelectedCountry',
      districtPins: 'landing/getDistrictPins'
    })
  }
};
</script>

<style lang="less">
.CountryDetailsOverlay {}
</style>
