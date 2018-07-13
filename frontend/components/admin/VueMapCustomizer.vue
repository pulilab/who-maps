<template>
  <el-container class="main-container">

    <el-header :span="24">
      <el-card class="box-card title-bar">
        <div class="page-title">
          <img
            v-if="flagUrl"
            :src="flagUrl"
          >
          <span>Country Map:</span>
          <span>{{ countryName }}</span>
        </div>
        <el-alert
          v-show="showSuccessMessage"
          type="success"
          title="Your country map and sub levels are now saved"
        />
        <el-alert
          v-show="showFailureMessage"
          type="error"
          title="An error occurred please contact the admins"
        />
        <el-button
          v-show="showSaveButton"
          :loading="saving"
          type="primary"
          @click.prevent="save"
        >Save</el-button>
      </el-card>

    </el-header>

    <el-main>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="box-card">
            <div class="map-container">
              <svg/>
            </div>
          </el-card>
        </el-col>

        <el-col
          :span="8"
          class="side-selector">
          <template v-show="!loading">
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
                <p>Hover on a {{ firstSubLevelType }} name to see the name on the map</p>
                <ul>
                  <li
                    v-for="item in firstSubLevelList"
                    :key="item.id"
                    @mouseenter="firstSubLevelEnter(item.name)"
                    @mouseleave="firstSubLevelLeave">
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
                <p>Hover on the name to see the {{ secondSubLevelType }} drawn on the map</p>
                <ul>
                  <li
                    v-for="item in secondSubLevelList"
                    :key="item.id"
                    @mouseenter="secondSubLevelEnter(item)"
                    @mouseleave="secondSubLevelLeave">
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
                :initial-data="facilities"/>
              <div v-show="!showFirstSubLevelList"> Select at least one level to use the facility import </div>
            </el-card>

          </template>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import * as d3 from 'd3';
import polylabel from '@mapbox/polylabel';
import FacilityImport from './FacilityImport';

export default {
  name: 'VueMapCustomizer',
  components: {
    FacilityImport
  },
  props: {
    flagBaseUrl: {
      type: String,
      default: ''
    },
    countryId: {
      type: Number,
      required: true
    },
    apiUrl: {
      type: String,
      default: ''
    },
    subLevelTypes: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      mapUrl: null,
      mapData: {},
      country: {},
      polylabel: [],
      projection: null,
      path: null,
      svg: null,
      mapLayer: null,
      firstSubLevel: null,
      secondSubLevel: null,
      facilities: [],
      saving: false,
      showSuccessMessage: false,
      showFailureMessage: false,
      loadingSavedState: false,
      firstSubLevelType: null,
      secondSubLevelType: null
    };
  },
  computed: {
    loading () {
      return !this.mapData.features || this.loadingSavedState;
    },
    countryName () {
      return this.country.properties ? this.country.properties.name : '';
    },
    countryCode () {
      return this.country.properties
        ? this.country.properties.alltags['ISO3166-1']
        : null;
    },
    flagUrl () {
      if (this.flagBaseUrl && this.countryCode) {
        return `${this.flagBaseUrl}${this.countryCode.toLocaleLowerCase()}.png`;
      }
      return null;
    },
    firstSubLevelTypes () {
      return this.subLevelTypes.filter(n => n.name !== this.secondSubLevelType);
    },
    secondSubLevelTypes () {
      return this.subLevelTypes.filter(n => n.name !== this.firstSubLevelType);
    },
    subLevels () {
      const levels = [];
      const features = this.mapData.features || [];
      for (const f of features) {
        if (!levels.includes(f.properties.admin_level)) {
          levels.push(f.properties.admin_level);
        }
      }
      return levels;
    },
    availableSubLevels () {
      return this.subLevels.filter(sb => sb !== this.firstSubLevel);
    },
    firstSubLevelMap () {
      const features = this.mapData.features || [];
      return features.filter(
        f => f.properties.admin_level === this.firstSubLevel
      );
    },
    firstSubLevelList () {
      if (
        this.mapData.features &&
        this.firstSubLevel &&
        this.firstSubLevelType
      ) {
        return this.mapData.features
          .filter(f => f.properties.admin_level === this.firstSubLevel)
          .map(i => {
            const polyCenter = this.calculatePolyCenter(i.geometry);
            return { ...i.properties, polyCenter };
          });
      }
      return [];
    },
    showFirstSubLevelList () {
      return (
        this.mapData.features && this.firstSubLevel && this.firstSubLevelType
      );
    },
    secondSubLevelList () {
      if (
        this.mapData.features &&
        this.secondSubLevel &&
        this.secondSubLevelType
      ) {
        return this.mapData.features
          .filter(f => f.properties.admin_level === this.secondSubLevel)
          .map(i => i.properties);
      }
      return [];
    },
    showSecondSubLevelList () {
      return (
        this.mapData.features && this.secondSubLevel && this.secondSubLevelType
      );
    },
    places () {
      return this.secondSubLevel
        ? this.secondSubLevelList
        : this.firstSubLevel ? this.firstSubLevelList : [];
    },
    showSaveButton () {
      return this.showFirstSubLevelList;
    },
    countryApiUrl () {
      return `${this.apiUrl}${this.countryId}/`;
    }
  },
  watch: {
    mapUrl: {
      immediate: true,
      async handler (url) {
        if (url) {
          const { data } = await this.$axios.get(url);
          this.mapData = {
            type: data.type,
            features: data.features.filter(
              f => f.properties['admin_level'] !== '2'
            )
          };
          this.country = data.features.find(
            f => f.properties['admin_level'] === '2'
          );
        }
      }
    },
    country: {
      immediate: true,
      handler (countryData) {
        if (countryData && this.mapLayer) {
          this.projection.fitSize(
            [this.mapBox.width, this.mapBox.width],
            countryData
          );
          this.polylabel = this.calculatePolyCenter(countryData.geometry);
          this.mapLayer
            .append('path')
            .data([countryData])
            .attr('d', this.path)
            .classed('country', true);
        }
      }
    },
    firstSubLevelMap: {
      immediate: true,
      handler (subLevelData) {
        if (subLevelData && this.mapLayer) {
          this.firstSubLevelSvg.forEach(svg => svg.remove());
          this.labelList.forEach(lb => lb.remove());
          this.firstSubLevelSvg = [];
          this.labelList = [];
          subLevelData.forEach(sl => {
            const name = sl.properties.name;
            const svg = this.mapLayer.insert('path', '.first-sub-level + *');
            svg
              .data([sl])
              .attr('d', this.path)
              .classed('first-sub-level', true);

            svg.on('mouseenter', this.firstSubLevelEnter.bind(this, name));
            svg.on('mouseleave', this.firstSubLevelLeave);

            this.firstSubLevelSvg.push(svg);

            const labelContainer = this.mapLayer.append('g');
            labelContainer
              .attr('pointer-events', 'none')
              .attr('transform', () => {
                const centroid = this.path.centroid(sl);
                return `translate(${centroid[0]}, ${centroid[1]})`;
              })
              .attr('class', 'label')
              .classed('hidden', true);

            labelContainer.append('text').text(name);

            const labelBBox = labelContainer.node().getBBox();
            labelContainer
              .select('text')
              .attr('dx', -(labelBBox.width / 2))
              .attr('dy', labelBBox.height / 2)
              .attr('font-size', '16px')
              .attr('fill', 'black');

            labelContainer.name = name;
            this.labelList.push(labelContainer);
          });
        }
      }
    },
    countryApiUrl: {
      immediate: true,
      async handler (url) {
        if (url) {
          this.loadingSavedState = true;

          const { data } = await this.$axios.get(url);
          this.mapUrl = data.map_file;
          try {
            this.firstSubLevel = data.map_data.first_sub_level.admin_level;
            this.secondSubLevel = data.map_data.second_sub_level.admin_level;
            this.firstSubLevelType = data.map_data.first_sub_level.name;
            this.secondSubLevelType = data.map_data.second_sub_level.name;
            this.facilities = data.map_data.facilities;
            this.loadingSavedState = false;
          } catch (e) {
            console.error(
              'Error parsing the saved data, no saved data or corrupted one'
            );
          }
          this.loadingSavedState = false;
        }
      }
    }
  },
  mounted () {
    this.mapDOMContainer = this.$el.querySelector('.map-container');
    this.mapBox = this.mapDOMContainer.getBoundingClientRect();
    this.firstSubLevelSvg = [];
    this.labelList = [];
    this.hoveredSecondSubLevel = null;
    this.projection = d3.geoMercator();
    this.path = d3.geoPath(this.projection);
    this.zoom = d3
      .zoom()
      .on('zoom', this.zoomed)
      .scaleExtent([0, 20]);
    this.svg = d3
      .select('svg')
      .attr('width', this.mapBox.width)
      .attr('height', this.mapBox.width)
      .call(this.zoom);
    this.mapLayer = this.svg.append('g').classed('map-layer', true);
  },
  methods: {
    zoomed () {
      const t = d3.event.transform;
      this.mapLayer.attr('transform', `translate(${[t.x, t.y]})scale(${t.k})`);
    },
    firstSubLevelEnter (name) {
      this.labelList.forEach(l => l.classed('hidden', true));
      const svgLabel = this.labelList.find(ll => ll.name === name);
      svgLabel.classed('hidden', false);
    },
    firstSubLevelLeave () {
      this.labelList.forEach(l => l.classed('hidden', true));
    },
    secondSubLevelEnter (item) {
      const levelMapData = this.mapData.features.find(
        f => f.properties.id === item.id
      );
      this.hoveredSecondSubLevel = this.mapLayer
        .append('path')
        .data([levelMapData])
        .attr('d', this.path)
        .classed('second-sub-level', true);
    },
    secondSubLevelLeave () {
      if (this.hoveredSecondSubLevel) {
        this.hoveredSecondSubLevel.remove();
        this.hoveredSecondSubLevel = null;
      }
    },
    parseNames (collection) {
      const result = {};
      const nameKeys = Object.keys(collection).filter(k => k.includes('name:'));

      nameKeys.forEach(nk => (result[nk] = collection[nk]));
      return result;
    },
    async save () {
      this.saving = true;
      const first = this.firstSubLevelList.map(f => {
        return {
          name: f.name,
          polyCenter: f.polyCenter,
          ...this.parseNames(f.alltags)
        };
      });
      const second = this.secondSubLevelList.map(s => {
        return {
          name: s.name,
          ...this.parseNames(s.alltags)
        };
      });
      const mapData = {
        polylabel: this.polylabel,
        first_sub_level: {
          admin_level: this.firstSubLevel,
          name: this.firstSubLevelType,
          elements: first
        },
        second_sub_level: {
          admin_level: this.secondSublevel,
          name: this.secondSubLevelType,
          elements: second
        },
        facilities: this.$refs.facilityImporter.simpleFacilities
      };
      try {
        await this.$axios.put(this.countryApiUrl, { map_data: mapData });
        this.showSuccessMessage = true;
      } catch (e) {
        console.error(e);
        this.showFailureMessage = true;
      }
      this.saving = false;
    },
    calculatePolyCenter (geometry) {
      let coordinates = [...geometry.coordinates];
      if (geometry.type !== 'Polygon') {
        coordinates = coordinates.sort((a, b) => b[0].length - a[0].length)[0];
      }
      const r = polylabel(coordinates);
      return {lat: r[1], lon: r[0]};
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
