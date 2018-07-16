<template>
  <div>
    <l-marker
      :options="pin.options"
      :lat-lng="pin.latlng"
      :icon="icon"
      class="MapMarker"
    >
      <l-popup
        :options="popupOptions"
      >
        <el-button
          class="CountryViewBtn"
          icon="el-icon-search"
          @click="openCountryView">
          Country View
        </el-button>
      </l-popup>
    </l-marker>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import GeoJsonLayer from './GeoJsonLayer';

export default {
  components: {
    GeoJsonLayer
  },
  props: {
    pin: {
      type: Object,
      required: true
    },
    icon: {
      type: Object,
      required: false,
      default: () => null
    },
    forceHovered: {
      type: Boolean,
      default: false
    },
    additionalTooltipClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      popupOptions: {
        className: `DetailsPopup ${this.additionalTooltipClass}`
      }
    };
  },
  computed: {
    ...mapGetters({
      geoJson: 'landing/getGeoJsonLibrary'

    }),
    paintTooltip () {
      return this.$slots.default && (this.hovered || this.forceHovered);
    }
  },
  methods: {
    ...mapActions({
      toggleCountry: 'landing/toggleCountry'
    }),
    emitMarkerClick () {
      this.$emit('marker-click');
    },
    openCountryView () {
      this.toggleCountry(this.pin.id);
    }
  }
};
</script>

<style lang="scss">
    .CountryViewBtn {
    }

</style>
