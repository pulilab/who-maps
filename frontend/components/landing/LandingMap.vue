<template>
  <div class="LandingMap">
    <no-ssr>
      <l-map
        ref="mainMap"
        :zoom="zoom"
        :world-copy-jump="true"
        :options="mapOptions"
        @zoomend="zoomChangeHandler"
      >
        <l-tilelayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'"
          @loading="mapReady"
        />

        <v-marker-cluster
          ref="markerCluster"
          :options="clusterOptions"
        >
          <country-center-marker
            v-for="pin in countriesPin"
            :key="pin.id"
            :pin="pin"
          />
        </v-marker-cluster>

        <country-details-overlay />

        <world-zoom-button />

        <l-control-zoom
          position="bottomright"
        />
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import NoSSR from 'vue-no-ssr';
import CountryCenterMarker from './CountryCenterMarker';
import CountryDetailsOverlay from './CountryDetailsOverlay';
import WorldZoomButton from './WorldZoomButton';

export default {
  components: {
    'no-ssr': NoSSR,
    CountryCenterMarker,
    CountryDetailsOverlay,
    WorldZoomButton
  },
  data () {
    return {
      zoom: 3,
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
      }
    };
  },
  computed: {
    ...mapGetters({
      countriesPin: 'landing/getLandingPagePins',
      selectedCountries: 'landing/getSelectedCountries'
    }),
    clusterOptions () {
      return {
        disableClusteringAtZoom: 8,
        spiderfyOnMaxZoom: false,
        polygonOptions: {
          stroke: false,
          fillColor: '#42B883'
        }
      };
    }
  },
  mounted () {
    this.$root.$on('map:center-on', this.centerOn);
    this.$root.$on('map:fit-on', this.fitOn);
    this.$root.$on('map:zoom-at', this.zoomAt);
  },
  beforeDestroy () {
    this.$root.$off(['map:center-on', 'map:fit-on', 'map:zoom-at']);
  },
  methods: {
    ...mapActions({
      setCurrentZoom: 'landing/setCurrentZoom'
    }),
    mapReady () {},
    centerOn (latlng, zoom = 13) {
      if (this.$refs.mainMap && this.$refs.mainMap.mapObject) {
        this.$refs.mainMap.mapObject.flyTo(latlng, zoom);
      }
    },
    fitOn (bounds) {
      if (this.$refs.mainMap && this.$refs.mainMap.mapObject) {
        this.$refs.mainMap.mapObject.fitBounds(bounds);
      }
    },
    zoomAt (zoom) {
      if (this.$refs.mainMap && this.$refs.mainMap.mapObject) {
        this.$refs.mainMap.mapObject.setZoom(zoom);
      }
    },
    zoomChangeHandler (event) {
      this.setCurrentZoom(event.target.getZoom());
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .LandingMap {
    display: block;
    height: 60vh;
    background-color: @colorGrayLight;
  }
</style>
