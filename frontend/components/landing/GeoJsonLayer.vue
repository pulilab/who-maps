<template>
  <div class="GeoJsonLayer">
    <l-feature-group
      ref="geoJsonGroup"
      @layeradd="layerAddHandler"
    >
      <l-geo-json
        v-for="geojson in geojsonList"
        :key="geojson.id"
        :geojson="geojson"
      />
    </l-feature-group>
  </div>
</template>

<script>
import * as topojson from 'topojson';
import { mapGetters } from 'vuex';

export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    collection: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currentZoom: 'landing/getCurrentZoom'
    }),
    geojsonList () {
      return this.list.map(id => {
        const topo = this.collection[id];
        if (topo) {
          const subKey = Object.keys(topo.objects)[0];
          const geo = topojson.feature(topo, topo.objects[subKey]);
          geo.id = id;
          return geo;
        }
      });
    },
    showGeoJsonLayer () {
      return this.currentZoom > 5;
    }
  },
  watch: {
    showGeoJsonLayer: {
      immediate: false,
      handler (show) {
        this.computeGeoJsonLayerStyle(show);
      }
    }
  },
  methods: {
    layerAddHandler (event) {
      if (event && event.layer) {
        this.$root.$emit('map:fit-on', event.layer.getBounds());
      }
    },
    computeGeoJsonLayerStyle (show) {
      const fill = show;
      const stroke = show;
      this.$refs.geoJsonGroup.mapObject.setStyle(() => ({fill, stroke}));
    }
  }
};
</script>

<style>

</style>
