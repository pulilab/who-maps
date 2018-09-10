<template>
  <div class="CountryDetailsOverlay">
    <template v-if="!nationalLevelCoverage" >
      <sub-level-marker
        v-for="pin in subLevelPins"
        :key="pin.id"
        :icon="markerIcons[pin.id]"
        :pin="pin"
        @marker-click="markerClickHandler"
      />
    </template>

    <country-center-marker
      v-if="nationalLevelCoverage && selectedCountryPin"
      :icon="countryCenterIcon"
      :pin="selectedCountryPin"
      disable-tooltip
      @update:activeCountry="activeCountryUpdateHanlder"
    />
    <geo-json-layer
      :country="selectedCountry"
      :collection="geoJson"
      :active-sub-level="activeSubLevel"
      :map-ready="mapReady"
      :national-level-coverage="nationalLevelCoverage"
    />
  </div>
</template>

<script>
import SubLevelMarker from './SubLevelMarker';
import CountryCenterMarker from './CountryCenterMarker';
import GeoJsonLayer from './GeoJsonLayer';

export default {
  components: {
    CountryCenterMarker,
    SubLevelMarker,
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
    subLevelPins: {
      type: Array,
      default: () => []
    },
    mapReady: {
      type: Boolean,
      default: false
    },
    activeSubLevel: {
      type: String,
      default: null
    },
    nationalLevelCoverage: {
      type: Boolean,
      default: false
    },
    nationalProjects: {
      type: Array,
      default: () => []
    },
    selectedCountryPin: {
      type: Object,
      default: null
    },
    getSubLevelProjects: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      markerIcons: {},
      countryCenterIcon: {}
    };
  },
  computed: {
    subLevelPinsAndMapReady () {
      if (this.subLevelPins && this.mapReady) {
        return this.subLevelPins;
      }
    },
    activeSubLevelPinsAndMapReady () {
      if (this.activeSubLevel && this.mapReady) {
        return this.activeSubLevel;
      }
    }
  },
  watch: {
    subLevelPinsAndMapReady: {
      immdieate: true,
      handler (pins) {
        this.iconsGenerator();
        this.countryCenterIcon = this.countryCenterIconGenerator();
      }
    },
    activeSubLevelPinsAndMapReady: {
      immdieate: true,
      handler (subLevel, old) {
        if (old) {
          this.markerIcons[old] = this.iconGenerator(old, false);
        }
        if (subLevel) {
          this.markerIcons[subLevel] = this.iconGenerator(subLevel, true);
        }
      }
    }
  },
  mounted () {
    if (this.mapReady) {
      this.iconsGenerator();
      this.countryCenterIcon = this.countryCenterIconGenerator();
    }
  },
  methods: {
    activeCountryUpdateHanlder (country) {
      this.$emit('update:activeCountry', country);
    },
    iconGenerator (id, isActive) {
      const additionaClass = isActive ? 'ActiveDistrict' : '';
      const amount = this.getSubLevelProjects && this.getSubLevelProjects(id) ? this.getSubLevelProjects(id).length : 0;
      const html = `<span>${amount}</span>`;
      return L.divIcon({
        className: `DistrictCenterIcon ${additionaClass}`,
        html,
        iconSize: [27, 44],
        iconAnchor: [13.5, 44]
      });
    },
    iconsGenerator () {
      const icons = {};
      this.subLevelPins.forEach(cp => {
        icons[cp.id] = this.iconGenerator(cp.id);
      });
      this.markerIcons = icons;
    },
    countryCenterIconGenerator () {
      const html = `<span>${this.nationalProjects.length}</span>`;
      return L.divIcon({
        className: 'CountryCenterIcon ActiveCountry',
        html,
        iconSize: [27, 44],
        iconAnchor: [13.5, 44]
      });
    },
    markerClickHandler (id) {
      this.$emit('update:activeCountry', this.selectedCountry);
      this.$emit('update:activeSubLevel', id);
    }
  }
};
</script>

<style lang="less">
  @import "../../../assets/style/variables.less";
  @import "../../../assets/style/mixins.less";

  .CountryDetailsOverlay {}

  .DistrictCenterIcon {
    background-image: url('~/assets/img/pins/pin-with-counter.svg');

    &.ActiveDistrict {
      background-image: url('~/assets/img/pins/pin-with-counter-active.svg');
    }

     span {
      display: inline-block;
      width: 27px;
      margin-top: 4px;
      color: @colorWhite;
      font-size: @fontSizeSmall;
      font-weight: 700;
      text-align: center;
    }
  }
</style>
