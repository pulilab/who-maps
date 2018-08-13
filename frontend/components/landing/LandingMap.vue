<template>
  <div class="LandingMap">
    <no-ssr>
      <l-map
        ref="mainMap"
        :zoom="zoom"
        :world-copy-jump="true"
        :options="mapOptions"
        @zoomend="zoomChangeHandler"
        @load="setMapReady(true)"
      >
        <l-tilelayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'"
        />

        <v-marker-cluster
          ref="markerCluster"
          :options="clusterOptions"
        >
          <country-center-marker
            v-for="pin in countriesPin"
            :icon="countryCenterIcons[pin.id]"
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
      countryCenterIcons: {},
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
      activeCountry: 'landing/getActiveCountry',
      getCountryProjects: 'landing/getCountryProjects',
      mapReady: 'landing/getMapReady'
    }),
    activeCountryAndMapReady () {
      if (this.activeCountry && this.mapReady) {
        return this.activeCountry;
      }
    },
    clusterOptions () {
      return {
        disableClusteringAtZoom: 8,
        spiderfyOnMaxZoom: false,
        polygonOptions: {
          stroke: false,
          fillColor: '#42B883'
        },
        iconCreateFunction: (cluster) => {
          const html = `<span>${cluster.getChildCount()}</span>`;
          return L.divIcon({
            className: `CountryClusterIcon`,
            html,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          });
        }
      };
    }
  },
  watch: {
    activeCountryAndMapReady: {
      immediate: true,
      handler (id, old) {
        if (old) {
          this.countryCenterIcons[old] = this.iconGenerator(old, false);
        }
        if (id) {
          this.countryCenterIcons[id] = this.iconGenerator(id, true);
        }
      }
    }
  },
  mounted () {
    this.$root.$on('map:center-on', this.centerOn);
    this.$root.$on('map:fit-on', this.fitOn);
    this.$root.$on('map:zoom-at', this.zoomAt);
    this.iconsGenerator();
  },
  beforeDestroy () {
    this.$root.$off(['map:center-on', 'map:fit-on', 'map:zoom-at']);
  },
  methods: {
    ...mapActions({
      setCurrentZoom: 'landing/setCurrentZoom',
      setMapReady: 'landing/setMapReady'
    }),
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
    },
    iconGenerator (id, isActive) {
      const additionaClass = isActive ? 'ActiveCountry' : '';
      const html = `<span>${this.getCountryProjects(id).length}</span>`;
      return L.divIcon({
        className: `CountryCenterIcon ${additionaClass}`,
        html,
        iconSize: [27, 44],
        iconAnchor: [13.5, 44]
      });
    },
    iconsGenerator () {
      const icons = {};
      this.countriesPin.forEach(cp => {
        icons[cp.id] = this.iconGenerator(cp.id);
      });
      this.countryCenterIcons = icons;
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

    .CountryClusterIcon {
      background-image: url('~/assets/img/pins/pin-cluster.svg');

       span {
        display: inline-block;
        width: 40px;
        margin-top: 10px;
        line-height: 20px;
        color: white;
        font-weight: 800;
        text-align: center;
      }
    }
    .CountryCenterIcon {
      background-image: url('~/assets/img/pins/pin-with-counter.svg');

      &.ActiveCountry {
        background-image: url('~/assets/img/pins/pin-with-counter-active.svg');
      }

       span {
        display: inline-block;
        width: 27px;
        margin-top: 5px;
        color: white;
        font-weight: 800;
        text-align: center;
      }
    }
  }
</style>
