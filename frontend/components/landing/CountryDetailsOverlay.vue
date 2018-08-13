<template>
  <div class="CountryDetailsOverlay">
    <landing-switch-view-box v-if="selectedCountry" />
    <district-marker
      v-for="pin in districtPins"
      :key="pin.id"
      :icon="markerIcons[pin.id]"
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
import LandingSwitchViewBox from './LandingSwitchViewBox';

export default {
  components: {
    DistrictMarker,
    GeoJsonLayer,
    LandingSwitchViewBox
  },
  data () {
    return {
      markerIcons: {}
    };
  },
  computed: {
    ...mapGetters({
      geoJson: 'countries/getGeoJsonLibrary',
      selectedCountry: 'landing/getSelectedCountry',
      districtPins: 'landing/getDistrictPins',
      mapReady: 'landing/getMapReady'
    }),
    districtPinsAndMapReady () {
      if (this.districtPins && this.mapReady) {
        return this.districtPins;
      }
    }
  },
  watch: {
    districtPinsAndMapReady: {
      immdieate: true,
      handler (pins) {
        this.iconsGenerator();
      }
    }
  },
  methods: {
    iconGenerator (id, isActive) {
      const additionaClass = isActive ? 'ActiveDistrict' : '';
      const html = `<span>${Math.round(Math.random(10) * 10)}</span>`;
      return L.divIcon({
        className: `DistrictCenterIcon ${additionaClass}`,
        html,
        iconSize: [27, 44],
        iconAnchor: [13.5, 44]
      });
    },
    iconsGenerator () {
      const icons = {};
      this.districtPins.forEach(cp => {
        icons[cp.id] = this.iconGenerator(cp.id);
      });
      this.markerIcons = icons;
    }
  }
};
</script>

<style lang="less">
.CountryDetailsOverlay {
}
.DistrictCenterIcon {
      background-image: url('~/assets/img/pins/pin-with-counter.svg');

      &.ActiveDistrict {
        background-image: url('~/assets/img/pins/pin-with-counter-active.svg');
      }

       span {
        display: inline-block;
        width: 27px;
        margin-top: 5px;
        color: white;
        font-weight: 800;
        text-align: center;
      }
    }
</style>
