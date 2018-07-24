<template>
  <div class="LandingMap">
    <no-ssr>
      <l-map
        ref="mainMap"
        :zoom="zoom"
        :world-copy-jump="true"
        :options="mapOptions"
      >
        <l-tilelayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'"
          @loading="mapReady"
        />

        <v-marker-cluster
          ref="markerCluster"
          :options="clusterOptions"
        >
          <map-marker
            v-for="pin in countriesPin"
            :key="pin.id"
            :pin="pin"
          />
        </v-marker-cluster>

        <map-marker
          v-for="pin in districtPins"
          :key="pin.id"
          :pin="pin"
        />

        <geo-json-layer
          :list="selectedCountries"
          :collection="geoJson"/>

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
import MapMarker from './MapMarker';
import GeoJsonLayer from './GeoJsonLayer';

export default {
  components: {
    'no-ssr': NoSSR,
    MapMarker,
    GeoJsonLayer
  },
  data () {
    return {
      zoom: 3,
      mapOptions: { zoomControl: false, attributionControl: false }
    };
  },
  computed: {
    ...mapGetters({
      countriesPin: 'landing/getLandingPagePins',
      geoJson: 'landing/getGeoJsonLibrary',
      selectedCountries: 'landing/getSelectedCountries',
      districtPins: 'landing/getDistrictPins'
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
  },
  beforeDestroy () {
    this.$root.$off(['map:center-on', 'map:fit-on']);
  },
  methods: {
    ...mapActions({}),
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
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .LandingMap {
    display: block;
    height: 500px;
    background-color: @colorGrayLight;
  }
</style>
