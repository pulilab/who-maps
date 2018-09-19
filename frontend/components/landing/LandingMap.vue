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
            :options="countryCenterOptions[pin.id]"
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
  mixins: [MapMixin]
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

      &.EmptyMarker {
        opacity: 0.6;
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
