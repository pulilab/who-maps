<template>
  <el-container class="main-container">

    <el-header :span="24">
      <el-card class="box-card title-bar">
        <el-switch
          v-model="showCenterPin"
          active-text="Show country center pin"
          inactive-text="Hide country center pin"/>
        <el-switch
          v-model="showSubLevelsPins"
          active-text="Show districts center pin"
          inactive-text="Hide districts center pin"/>
        <el-button
          @click.prevent="polycenterCalculation"
        >
          Set / Reset Markers
        </el-button>
        <el-button
          v-show="showSaveButton"
          type="primary"
          @click.prevent="save"
        >
          Save
        </el-button>
      </el-card>

    </el-header>

    <el-main>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="box-card">
            <no-ssr>
              <l-map
                ref="mainMap"
                :zoom="zoom"
                :world-copy-jump="true"
                :options="mapOptions"
                class="MapContainer"
              >
                <l-tilelayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                />
                <l-feature-group @layeradd="geoJsonLoadHandler">
                  <l-geo-json
                    v-if="firstSubLevelMap && firstSubLevelMap.length > 0"
                    ref="geoJsonLayer"
                    :geojson="firstSubLevelMap"
                  />
                </l-feature-group>
                <l-marker
                  v-if="showCenterPin"
                  :lat-lng="countryCenter"
                  :draggable="true"
                  @moveend="countryCenterMoveHandler"
                >
                  <l-tooltip> Country Central Pin </l-tooltip>
                </l-marker>

                <l-feature-group v-if="showSubLevelsPins">
                  <l-marker
                    v-for="pin in subLevelsPolyCenters"
                    :key="pin.name"
                    :lat-lng="pin.latlng"
                    :draggable="true"
                    @moveend="subLevelsPinsMoveHandler($event, pin.name)"
                  >
                    <l-tooltip> {{ pin.name }} </l-tooltip>
                  </l-marker>
                </l-feature-group>
              </l-map>
            </no-ssr>
          </el-card>
        </el-col>

        <el-col
          :span="8"
          class="side-selector">
          <el-card class="box-card">
            <div
              slot="header"
              class="">
              <span>Sub Level I (Displayed on the map) </span>
            </div>
            <div class="input-container">
              <el-select
                v-model="firstSubLevel"
                placeholder="Admin level">
                <el-option
                  v-for="level in subLevels"
                  :key="level"
                  :label="`admin-level-${level}`"
                  :value="level"/>
              </el-select>
              <el-select
                v-model="firstSubLevelType"
                placeholder="Sub level name">
                <el-option
                  v-for="name in firstSubLevelTypes"
                  :key="name.name"
                  :label="name.displayName"
                  :value="name.name"/>
              </el-select>
            </div>
            <div
              v-show="showFirstSubLevelList"
              class="sub-level-list"
            >
              <h5> List of {{ firstSubLevelType }}</h5>
              <ul>
                <li
                  v-for="item in firstSubLevelList"
                  :key="item.id"
                >
                  {{ item.name }}
                </li>
              </ul>
            </div>
          </el-card>
          <el-card
            v-show="showFirstSubLevelList"
            class="box-card"
          >
            <div
              slot="header"
              class="clearfix">
              <span>Sub Level II (Only for selection) </span>
            </div>
            <div class="input-container">
              <el-select
                v-model="secondSubLevel"
                placeholder="Admin Level"
                clearable>
                <el-option
                  v-for="level in availableSubLevels"
                  :key="level"
                  :label="`admin-level-${level}`"
                  :value="level"/>
              </el-select>
              <el-select
                v-model="secondSubLevelType"
                placeholder="Sub level name"
                clearable>
                <el-option
                  v-for="name in secondSubLevelTypes"
                  :key="name.name"
                  :label="name.displayName"
                  :value="name.name"/>
              </el-select>
            </div>
            <div
              v-show="showSecondSubLevelList"
              class="sub-level-list"
            >
              <h5> List of {{ secondSubLevelType }}</h5>
              <ul>
                <li
                  v-for="item in secondSubLevelList"
                  :key="item.id"
                >
                  {{ item.name }}
                </li>
              </ul>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header">
              <span>Facility Import</span>
            </div>
            <facility-import
              v-show="showFirstSubLevelList"
              ref="facilityImporter"
              :places="places"
            />
            <div v-show="!showFirstSubLevelList"> Select at least one level to use the facility import </div>
          </el-card>

        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { calculatePolyCenter } from '../../utilities/coords';
import FacilityImport from './FacilityImport';
import NoSSR from 'vue-no-ssr';

export default {
  name: 'VueMapCustomizer',
  components: {
    'no-ssr': NoSSR,
    FacilityImport
  },
  data () {
    return {
      zoom: 3,
      mapOptions: { zoomControl: false, attributionControl: false },
      showCenterPin: true,
      showSubLevelsPins: true
    };
  },
  computed: {
    ...mapGetters({
      subLevelTypes: 'system/getSubLevelTypes',
      firstSubLevelList: 'admin/map/getFirstSubLevelList',
      secondSubLevelList: 'admin/map/getSecondSubLevelList',
      subLevels: 'admin/map/getSubLevels',
      firstSubLevelMap: 'admin/map/getFirstSubLevelMap',
      getFirstSubLevel: 'admin/map/getFirstSubLevel',
      getFirstSubLevelType: 'admin/map/getFirstSubLevelType',
      getSecondSubLevel: 'admin/map/getSecondSubLevel',
      getSecondSubLevelType: 'admin/map/getSecondSubLevelType',
      countryCenter: 'admin/map/getCountryCenter',
      countryBorder: 'admin/map/getCountryBorder',
      subLevelsPolyCenters: 'admin/map/getSubLevelsPolyCenters'
    }),
    firstSubLevelTypes () {
      return this.subLevelTypes.filter(n => n.name !== this.secondSubLevelType);
    },
    secondSubLevelTypes  () {
      return this.subLevelTypes.filter(n => n.name !== this.firstSubLevelType);
    },
    firstSubLevel: {
      get () {
        return this.getFirstSubLevel;
      },
      set (value) {
        this.setFirstSubLevel(value);
      }
    },
    firstSubLevelType: {
      get () {
        return this.getFirstSubLevelType;
      },
      set (value) {
        this.setFirstSubLevelType(value);
      }
    },
    secondSubLevel: {
      get () {
        return this.getSecondSubLevel;
      },
      set (value) {
        this.setSecondSubLevel(value);
      }
    },
    secondSubLevelType: {
      get () {
        return this.getSecondSubLevelType;
      },
      set (value) {
        this.setSecondSubLevelType(value);
      }
    },
    availableSubLevels () {
      return this.subLevels.filter(sb => sb !== this.firstSubLevel);
    },
    showFirstSubLevelList () {
      return (this.firstSubLevel && this.firstSubLevelType);
    },
    showSecondSubLevelList () {
      return (this.secondSubLevel && this.secondSubLevelType);
    },
    places () {
      return this.secondSubLevel
        ? this.secondSubLevelList
        : this.firstSubLevel ? this.firstSubLevelList : [];
    },
    showSaveButton () {
      return this.showFirstSubLevelList;
    }
  },
  methods: {
    ...mapActions({
      setFirstSubLevel: 'admin/map/setFirstSubLevel',
      setFirstSubLevelType: 'admin/map/setFirstSubLevelType',
      setSecondSubLevel: 'admin/map/setSecondSubLevel',
      setSecondSubLevelType: 'admin/map/setSecondSubLevelType',
      setCountryCenter: 'admin/map/setCountryCenter',
      setSubLevelsPolyCenters: 'admin/map/setSubLevelsPolyCenters',
      updateSubLevelPolyCenter: 'admin/map/updateSubLevelPolyCenter',
      save: 'admin/map/saveMapData'

    }),
    geoJsonLoadHandler () {
      this.$refs.mainMap.mapObject.fitBounds(this.$refs.geoJsonLayer.mapObject.getBounds());
    },
    countryCenterMoveHandler (event) {
      const newLatLng = event.target.getLatLng();
      this.setCountryCenter(newLatLng);
    },
    polycenterCalculation () {
      const countryCenter = calculatePolyCenter(this.countryBorder.geometry);
      this.setCountryCenter(countryCenter);
      const subLevelsPolycenter = this.firstSubLevelMap.map(sb => {
        return {
          name: sb.properties.name,
          latlng: calculatePolyCenter(sb.geometry)
        };
      });
      this.setSubLevelsPolyCenters(subLevelsPolycenter);
    },
    subLevelsPinsMoveHandler (event, name) {
      const latlng = event.target.getLatLng();
      this.updateSubLevelPolyCenter({name, latlng});
    }
  }
};
</script>

<style lang="scss">
.main-container {
  position: relative;
  max-height: 750px;

  .el-header {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
  }
  .title-bar {
    .el-card__body {
      display: flex;
      justify-content: space-between;
    }
    .page-title {
      display: inline-flex;
      line-height: 2em;
      span {
        margin-right: 1em;
      }
      img {
        height: 2em;
        margin-right: 1em;
      }
    }
  }

  .selected-country {
    h5,
    h6 {
      padding: 0;
      margin: 0;
    }

    img {
      width: 24px;
      height: 12px;
    }
  }

  .el-main {
    margin-top: 70px;
  }

  .MapContainer {
    height: 500px;
  }
  .map-container {
    height: 500px;

    .country {
      fill: #e3e5ee;
    }

    .first-sub-level {
      fill: #e3e5ee;
      stroke: #9b9da8;
      stroke-width: 2px;
    }

    .second-sub-level {
      fill: #e3e5ee;
      stroke: #283593;
      stroke-width: 1px;
    }

    .label {
      &.hidden {
        display: none;
      }
    }
  }

  .side-selector {
    height: 600px;
    overflow-y: scroll;

    .sub-level-list {
      ul {
        margin-left: 10px;
        padding-left: 0px;
        li {
          cursor: zoom-in;
        }
      }
    }
  }
}
</style>
