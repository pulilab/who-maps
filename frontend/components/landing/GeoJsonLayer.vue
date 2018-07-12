<template>
  <div class="GeoJsonLayer">
    <l-geo-json
      v-for="geojson in geojsonList"
      :key="geojson.id"
      :geojson="geojson"
    />
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
      console.log(this.list);
      return this.list.map(id => {
        const topo = this.collection[id];
        console.log(topo);
        if (topo) {
          const subKey = Object.keys(topo.objects)[0];
          const geo = topojson.feature(topo, topo.objects[subKey]);
          geo.id = id;
          return geo;
        }
      });
    }
  }
};
</script>

<style>

</style>
