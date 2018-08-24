<template>
  <el-dialog
    :visible.sync="visible"
    title="Applying specific filter to map/list"
    modal
    top="10vh"
    width="90vw"
    custom-class="FilterDialog"
    @open="loadCurrentSelection"
  >
    <el-row
      type="flex"
      class="FilterDialogWrapper">
      <el-col class="FilterSelector">
        <filter-item
          :active="selectedFilter === 'dhi'"
          :selected="dhi"
          item="dhi"
          header="Digital Health Interventions"
          @clear="dhi=[]"
        />
        <filter-item
          :active="selectedFilter === 'hfa'"
          :selected="hfa"
          item="hfa"
          header="Health focus areas"
          @clear="hfa=[]"
        />
        <filter-item
          :active="selectedFilter === 'hsc'"
          :selected="hsc"
          item="hsc"
          header="Health system challenges"
          @clear="hsc=[]"
        />
        <filter-item
          :active="selectedFilter === 'his'"
          :selected="his"
          item="his"
          header="Health Information System"
          @clear="his=[]"
        />
        <filter-item
          :active="selectedFilter === 'platform'"
          :selected="platforms"
          item="platform"
          header="Software"
          @clear="platforms=[]"
        />
      </el-col>
      <el-col class="FilterArea">
        <digital-health-interventions-filter
          v-show="selectedFilter === 'dhi'"
          :selected.sync="dhi" />
        <health-focus-areas-filter
          v-show="selectedFilter === 'hfa'"
          :selected.sync="hfa"
        />
        <health-system-challenges-filter
          v-show="selectedFilter === 'hsc'"
          :selected.sync="hsc"
        />
        <health-information-system-filter
          v-show="selectedFilter === 'his'"
          :selected.sync="his"
        />
        <platform-filter
          v-show="selectedFilter === 'platform'"
          :selected.sync="platforms"
        />
      </el-col>
    </el-row>
    <span slot="footer">
      <el-row
        type="flex"
        align="center">
        <el-col class="SecondaryButtons">
          <el-button
            type="text"
            class="CancelButton"
            @click="cancel">
            Cancel
          </el-button>
          <el-button
            type="text"
            class="DeleteButton"
            @click="clearAll">
            Clear All
          </el-button>
        </el-col>
        <el-col class="PrimaryButtons">
          <el-button
            type="primary"
            @click="apply"
          >
            Apply filters
          </el-button>
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mapGettersActions } from '../../utilities/form.js';
import FilterItem from './FilterItem';
import HealthFocusAreasFilter from './filters/HealthFocusAreaFilter';
import DigitalHealthInterventionsFilter from './filters/DigitalHealthInterventionsFilter';
import HealthInformationSystemFilter from './filters/HealthInformationSystemFilter';
import HealthSystemChallengesFilter from './filters/HealthSystemChallengesFilter';
import PlatformFilter from './filters/PlatformFilter';

export default {
  components: {
    FilterItem,
    HealthFocusAreasFilter,
    DigitalHealthInterventionsFilter,
    HealthInformationSystemFilter,
    HealthSystemChallengesFilter,
    PlatformFilter
  },
  data () {
    return {
      dhi: [],
      hfa: [],
      hsc: [],
      his: [],
      platforms: []
    };
  },
  computed: {
    ...mapGetters({
      selectedFilter: 'layout/getDashboardFiltersDialogState'
    }),
    ...mapGettersActions({
      selectedDHI: ['dashboard', 'getSelectedDHI', 'setSelectedDHI', 0],
      selectedHFA: ['dashboard', 'getSelectedHFA', 'setSelectedHFA', 0],
      selectedHSC: ['dashboard', 'getSelectedHSC', 'setSelectedHSC', 0],
      selectedHIS: ['dashboard', 'getSelectedHIS', 'setSelectedHIS', 0],
      selectedPlatforms: ['dashboard', 'getSelectedPlatforms', 'setSelectedPlatforms', 0]
    }),
    visible: {
      get () {
        return this.selectedFilter !== null;
      },
      set () {
        this.setDashboardFiltersDialogState(null);
      }
    }
  },
  methods: {
    ...mapActions({
      setDashboardFiltersDialogState: 'layout/setDashboardFiltersDialogState'
    }),
    loadCurrentSelection () {
      this.dhi = [...this.selectedDHI];
      this.hfa = [...this.selectedHFA];
      this.hsc = [...this.selectedHSC];
      this.his = [...this.selectedHIS];
      this.platforms = [...this.selectedPlatforms];
    },
    clearAll () {
      this.dhi = [];
      this.hfa = [];
      this.hsc = [];
      this.his = [];
      this.platforms = [];
    },
    cancel () {
      this.setDashboardFiltersDialogState(null);
    },
    apply () {
      this.selectedDHI = this.dhi;
      this.selectedHFA = this.hfa;
      this.selectedHSC = this.hsc;
      this.selectedHIS = this.his;
      this.selectedPlatforms = this.platforms;
      this.$nextTick(() => {
        this.setDashboardFiltersDialogState(null);
      });
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .FilterDialog {
    max-width: @appWidthMaxLimit * 0.9;
    height: 80vh;
    margin-top: 0;
    margin-bottom: 0;

    .el-dialog__body {
      padding: 0;
      height: calc(80vh - (@dialogHeaderFooterHeight*2));
    }

    .FilterDialogWrapper {
      height: calc(80vh - (@dialogHeaderFooterHeight*2));

      .FilterSelector {
        position: relative;
        z-index: 2002;
        box-sizing: border-box;
        min-width: @filterSelectorWidth;
        max-width: @filterSelectorWidth;
        background-color: @colorWhite;
        border-right: 1px solid @colorGrayLight;
        box-shadow: 1px 0 3px rgba(0,0,0,.1);
      }

      .FilterArea {
        width: 100%;

        .Main {
          .SelectorDialogCategory {
            .Items {
              padding-left: 0;
            }
          }
        }
      }

      // Special case for DHI items
      // OMG, this is a real mess!! :(
      .DigitalHealthInterventionsFilter {
        .el-col-6 {
          overflow: hidden;
          height: calc(80vh - (@dialogHeaderFooterHeight * 2));
          border-right: 1px solid @colorGrayLight;

          .SelectorDialogColumn {
            .Header {
              width: calc((90vw - @filterSelectorWidth) / 4 - 1px);
              max-width: calc(((@appWidthMaxLimit * 0.9) - @filterSelectorWidth) / 4 - 1px);
            }

            .Main {
              height: calc(80vh - (@dialogHeaderFooterHeight * 4) + 6px);

              .Item {
                .el-checkbox__label {
                  font-size: @fontSizeSmall;
                  line-height: 16px;
                }
              }
            }
          }

          &:last-child {
            border: 0;

            .SelectorDialogColumn {
              .Header {
                width: calc((90vw - @filterSelectorWidth) / 4);
                max-width: calc(((@appWidthMaxLimit * 0.9) - @filterSelectorWidth) / 4);
              }
            }
          }
        }
      }

      .HealthFocusAreaFilter,
      .HealthSystemChallengesFilter,
      .HealthInformationSystem,
      .PlatformFilter {
        .SelectorDialogColumn {
          .Header {
            width: calc(90vw - @filterSelectorWidth);
            max-width: calc((@appWidthMaxLimit * 0.9) - @filterSelectorWidth);
          }
        }
      }
    }
  }
</style>
