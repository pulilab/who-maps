<template>
  <div>
    <l-marker
      v-if="currentZoom > 5"
      :options="pin.options"
      :lat-lng="pin.latlng"
      :icon="icon"
      class="MapMarker"
    >
      <l-popup
        ref="tooltip"
        :options="popupOptions"
      >
        10
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
      geoJson: 'countries/getGeoJsonLibrary',
      currentZoom: 'landing/getCurrentZoom'
    }),
    paintTooltip () {
      return this.$slots.default && (this.hovered || this.forceHovered);
    }
  },
  methods: {
    ...mapActions({}),
    emitMarkerClick () {
      this.$emit('marker-click');
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

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

    .CountryViewBtn {}
    .MouseEventSpy {}
</style>
