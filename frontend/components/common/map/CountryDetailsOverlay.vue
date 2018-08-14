<template>
  <div class="CountryDetailsOverlay">
    <district-marker
      v-for="pin in districtPins"
      :key="pin.id"
      :icon="markerIcons[pin.id]"
      :pin="pin"
      @marker-click="markerClickHandler"
    />

    <geo-json-layer
      :country="selectedCountry"
      :collection="geoJson"
    />
  </div>
</template>

<script>
import DistrictMarker from './DistrictMarker';
import GeoJsonLayer from './GeoJsonLayer';

export default {
  components: {
    DistrictMarker,
    GeoJsonLayer
  },
  props: {
    selectedCountry: {
      type: Number,
      default: null
    },
    geoJson: {
      type: Object,
      default: () => ({})
    },
    districtPins: {
      type: Array,
      default: () => []
    },
    mapReady: {
      type: Boolean,
      default: false
    },
    activeSubLevel: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      markerIcons: {}
    };
  },
  computed: {
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
    },
    markerClickHandler (id) {
      this.$emit('update:activeSubLevel', id);
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
