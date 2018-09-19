<template>
  <div class="DashboardMap">
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
            :options="countryCenterOptions[pin.id]"
            :key="pin.id"
            :pin="pin"
            :selected-country.sync="selectedCountry"
            :active-country.sync="activeCountry"
          />

        </v-marker-cluster>

        <country-details-overlay
          :selected-country="selectedCountry"
          :active-country.sync="activeCountry"
          :geo-json="geoJson"
          :sub-level-pins="subLevelPins"
          :map-ready="mapReady"
          :selected-country-pin="selectedCountryPin"
          :active-sub-level.sync="activeSubLevel"
          :national-level-coverage="activeTab ==='national'"
          :sub-national-projects="subNationalProjects"
          :national-projects="nationalProjects"
        />
        <switch-view-box
          v-if="activeCountry"
          :active-tab.sync="activeTab" />
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
import MapMixin from '../mixins/MapMixin';

import NoSSR from 'vue-no-ssr';
import CountryCenterMarker from '../common/map/CountryCenterMarker';
import CountryDetailsOverlay from '../common/map/CountryDetailsOverlay';
import WorldZoomButton from '../common/map/WorldZoomButton';
import SwitchViewBox from '../common/map/SwitchViewBox';

export default {
  components: {
    'no-ssr': NoSSR,
    CountryCenterMarker,
    CountryDetailsOverlay,
    WorldZoomButton,
    SwitchViewBox
  },
  mixins: [MapMixin],
  computed: {
    ...mapGetters({
      allCountriesPin: 'dashboard/getCountryPins',
      getActiveCountry: 'dashboard/getActiveCountry',
      geoJson: 'countries/getGeoJsonLibrary',
      getSelectedCountry: 'dashboard/getSelectedCountry',
      subLevelPins: 'dashboard/getSubLevelPins',
      getCountryProjects: 'dashboard/getCountryProjects',
      mapReady: 'dashboard/getMapReady',
      getActiveTab: 'dashboard/getProjectBoxActiveTab',
      getActiveSubLevel: 'dashboard/getActiveSubLevel',
      subNationalProjects: 'dashboard/getSelectedCountrySubNationalProjects',
      nationalProjects: 'dashboard/getSelectedCountryNationalProjects',
      mapProjects: 'dashboard/getProjectsMap'
    })
  },
  methods: {
    ...mapActions({
      setCurrentZoom: 'dashboard/setCurrentZoom',
      setMapReady: 'dashboard/setMapReady',
      setSelectedCountry: 'dashboard/setSelectedCountry',
      setActiveCountry: 'dashboard/setActiveCountry',
      setActiveTab: 'dashboard/setProjectBoxActiveTab',
      setActiveSubLevel: 'dashboard/setActiveSubLevel'
    })
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .DashboardMap {
    display: block;
    height: 80vh;
    background-color: @colorGrayLight;

    .CountryClusterIcon {
      background-image: url('~/assets/img/pins/pin-cluster.svg');

       span {
        display: inline-block;
        width: 40px;
        line-height: 40px;
        color: @colorWhite;
        font-size: @fontSizeSmall;
        font-weight: 700;
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
        margin-top: 4px;
        color: @colorWhite;
        font-size: @fontSizeSmall;
        font-weight: 700;
        text-align: center;
      }
    }
  }
</style>
