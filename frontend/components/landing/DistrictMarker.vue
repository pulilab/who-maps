<template>
  <div>
    <l-marker
      :options="pin.options"
      :lat-lng="pin.latlng"
      :icon="icon"
      class="MapMarker"
      @click="emitMarkerClick"
    />
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
    }
  },
  data () {
    return {};
  },
  computed: {
    ...mapGetters({
      geoJson: 'countries/getGeoJsonLibrary'
    })
  },
  methods: {
    ...mapActions({}),
    emitMarkerClick () {
      this.$emit('marker-click');
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
