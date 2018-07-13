<template>
  <div class="GeoJsonLayer">
    <l-feature-group
      v-for="geojson in geojsonList"
      :key="geojson.id"
      @layeradd="layerAddHandler"
    >
      <l-geo-json
        :geojson="geojson"
      />
    </l-feature-group>
  </div>
</template>

<script>
import * as topojson from 'topojson';

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
    }
  },
  methods: {
    layerAddHandler (event) {
      if (event && event.layer) {
        this.$root.$emit('map:fit-on', event.layer.getBounds());
      }
    }
  }
};
</script>

<style>

</style>
