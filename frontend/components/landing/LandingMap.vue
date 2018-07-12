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
            @marker-click="toggleCountry(pin.id)"
          />
        </v-marker-cluster>

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
  methods: {
    ...mapActions({
      toggleCountry: 'landing/toggleCountry'
    }),
    mapReady () {
      console.log('map ready');
    }
  }
};
</script>

<style lang="scss">

  .LandingMap {
    height: 500px;
    background-color: lightgray;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

</style>
