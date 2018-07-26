<template>
  <div>
    <l-marker
      ref="countryMarker"
      :options="pin.options"
      :lat-lng="pin.latlng"
      :icon="icon"
      class="MapMarker"
    >
      <l-popup
        ref="tooltip"
        :options="popupOptions"
      >
        <div
          class="MouseEventSpy"
          @mouseenter="mouseEnterHandler"
          @mouseleave="mouseLeaveHandler"
        >
          <el-button
            class="CountryViewBtn"
            icon="el-icon-search"
            @click="openCountryView">
            <span v-show="popUpHover">
              Country View
            </span>
          </el-button>
        </div>
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
      popUpHover: false,
      popupOptions: {
        className: `DetailsPopup ${this.additionalTooltipClass}`,
        closeButton: false
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
      this.$refs.countryMarker.mapObject.closePopup();
    },
    mouseEnterHandler (event) {
      this.popUpHover = true;
      this.$nextTick(() => {
        this.$refs.tooltip.mapObject.update();
      });
    },
    mouseLeaveHandler (event) {
      this.popUpHover = false;
      this.$nextTick(() => {
        this.$refs.tooltip.mapObject.update();
      });
    }
  }
};
</script>

<style lang="scss">
    .CountryViewBtn {
    }

    .MouseEventSpy {}

</style>
