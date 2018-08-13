<template>
  <div class="GeoJsonLayer">
    <l-feature-group
      ref="geoJsonGroup"
      @layeradd="layerAddHandler"
    >
      <l-geo-json
        v-if="geoJson"
        :geojson="geoJson"
      />
    </l-feature-group>
  </div>
</template>

<script>
import * as topojson from 'topojson';

export default {
  props: {
    country: {
      type: Number,
      default: null
    },
    collection: {
      type: Object,
      required: true
    }
  },
  computed: {
    geoJson () {
      const topo = this.collection[this.country];
      if (topo) {
        const subKey = Object.keys(topo.objects)[0];
        const geo = topojson.feature(topo, topo.objects[subKey]);
        geo.id = this.country;
        return geo;
      }
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
