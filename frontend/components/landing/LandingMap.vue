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
            v-for="pin in pins"
            :key="pin.id"
            :pin="pin"
          />
        </v-marker-cluster>

        <l-control-zoom
          position="bottomright"
        />
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
export default {
  components: {
    'no-ssr': NoSSR
  },
  data () {
    return {
      zoom: 3,
      mapOptions: { zoomControl: false, attributionControl: false }
    };
  },
  computed: {
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
