<template>
  <div :class="['DhaMap', 'LandingMap', {'Searched': isSearched}, {'HideIcons': getIsCountry === false}]">
    <div
      v-show="!getLoaded"
      class="Overlay"
    >
      <div class="OverlayContent">
        <Spinner size="32" />
        <div>Updating map</div>
      </div>
    </div>
    <no-ssr>
      <l-map
        ref="mainMap"
        :zoom="zoom"
        :world-copy-jump="true"
        :options="mapOptions"
        @zoomend="zoomChangeHandler"
        @ready="setMapReady(true)"
      >
        <l-tilelayer
          :url="tileServer"
        />

        <custom-marker-cluster
          v-if="!getActiveGlobalTab"
          ref="markerCluster"
          :options="clusterOptions"
          :total="countriesPin.length"
        >
          <country-center-marker
            v-for="pin in countriesPin"
            :key="pin.id"
            :icon="countryCenterIcons[pin.id]"
            :pin="pin"
            :options="countryCenterOptions[pin.id]"
            :selected-country.sync="selectedCountry"
            :active-country.sync="activeCountry"
          />
        </custom-marker-cluster>

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
          v-if="activeCountry && !getActiveGlobalTab"
          :active-tab.sync="activeTab"
        />
        <switch-global-box
          v-else
          :active-tab.sync="activeGlobalTab"
        />
        <world-zoom-button />

        <l-control-zoom
          position="bottomright"
        />
      </l-map>
    </no-ssr>
  </div>
</template>

<script>

import MapMixin from '../mixins/MapMixin'

import NoSSR from 'vue-no-ssr'
import CountryCenterMarker from '../common/map/CountryCenterMarker'
import CountryDetailsOverlay from '../common/map/CountryDetailsOverlay'
import WorldZoomButton from '../common/map/WorldZoomButton'
import SwitchViewBox from '../common/map/SwitchViewBox'
import SwitchGlobalBox from '@/components/common/map/SwitchGlobalBox'
import Spinner from '@/components/common/Spinner'

export default {
  components: {
    'no-ssr': NoSSR,
    CountryCenterMarker,
    CountryDetailsOverlay,
    WorldZoomButton,
    SwitchViewBox,
    SwitchGlobalBox,
    Spinner
  },
  mixins: [MapMixin]
}
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .LandingMap {
    position: relative;
    height: @landingMapHeight;
    min-height: @landingMapMinHeight;
  }
  .Overlay {
    z-index: 500;
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: rgba(255,255,255,0.65);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .OverlayContent {
      text-align: center;
      color: #6D6D6D;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 16px;
    }
  }

  .HideIcons {
    .CountryClusterIcon.EmptyCluster, .CountryCenterIcon.EmptyMarker {
      display: none;
      pointer-events: none;
    }
  }
</style>
