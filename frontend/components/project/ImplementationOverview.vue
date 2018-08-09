<template>
  <div
    id="implementation"
    class="ImplementationOverview">
    <collapsible-card title="Implementation Overview">
      <el-form
        :model="implementation"
        :rules="rules"
        label-position="top"
        @submit.native.prevent>
        <el-form-item
          label="Add one or more Software and related Digital Health Interventions (DHI):"
        >
          <el-form-item
            v-for="(platform, index) in implementation.platforms"
            :key="platform.id"
            label="Software"
          >
            <el-col :span="12">
              <software-selector
                v-model="platform.id"
                :selected="implementation.platforms" />
              <el-form-item
                v-if="platform.id"
                label="Digital Health Interventions">
                <digital-health-interventions-selector
                  :platform-id="platform.id"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-show="platform.id"
              :span="12">
              <add-rm-buttons
                :show-add="!!platform.id"
                :show-rm="implementation.platforms.length > 1"
                @add="addDhi"
                @rm="rmDhi(index, platform.id)"
              />
            </el-col>
          </el-form-item>
        </el-form-item>
        <el-form-item
          label="Health focus area(s) - select all that apply:"
          prop="health_focus_areas">
          <health-focus-areas-selector v-model="implementation.health_focus_areas" />
        </el-form-item>
        <el-form-item
          label="What are the Health System Challenges (HSC) your project addresses?"
          prop="hsc_challenges">
          <health-system-challenges-selector v-model="implementation.hsc_challenges" />
        </el-form-item>
        <el-form-item
          label="What part(s) of the Health Information System (HIS) does this project support?"
          prop="his_bucket">
          <his-bucket-selector v-model="implementation.his_bucket" />
        </el-form-item>
        <div class="CoverageArea">
          <el-form-item label="What kind of coverage does your project have?">
            <el-radio-group v-model="implementation.coverageType">
              <el-radio :label="1">Sub-national</el-radio>
              <el-radio :label="2">National</el-radio>
            </el-radio-group>
          </el-form-item>
          <sub-national-level-deployment
            v-show="implementation.coverageType == 1"
            :coverage.sync="implementation.coverage"
            :coverage-data.sync="implementation.coverageData"
            :coverage-second-level.sync="implementation.coverage_second_level"/>
          <div
            v-show="implementation.coverageType == 2"
            class="NationalLevelDeployment">
            <fa icon="flag" />
            National level deployment
            <coverage-fieldset
              :health-workers.sync="implementation.national_level_deployment.health_workers"
              :clients.sync="implementation.national_level_deployment.clients"
              :facilities.sync="implementation.national_level_deployment.facilities"
            />
          </div>
        </div>

      </el-form>
    </collapsible-card>
  </div>
</template>

<script>
import CollapsibleCard from './CollapsibleCard';
import HealthSystemChallengesSelector from './HealthSystemChallengesSelector';
import HealthFocusAreasSelector from './HealthFocusAreasSelector';
import HisBucketSelector from './HisBucketSelector';
import SoftwareSelector from './SoftwareSelector';
import DigitalHealthInterventionsSelector from './DigitalHealthInterventionsSelector';
import SubNationalLevelDeployment from './SubNationalLevelDeployment';
import AddRmButtons from './AddRmButtons';
import CoverageFieldset from './CoverageFieldset';

import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    CollapsibleCard,
    HealthSystemChallengesSelector,
    HisBucketSelector,
    HealthFocusAreasSelector,
    SoftwareSelector,
    DigitalHealthInterventionsSelector,
    SubNationalLevelDeployment,
    AddRmButtons,
    CoverageFieldset
  },
  data () {
    return {
      implementation: {
        platforms: [{}],
        health_focus_areas: [],
        hsc_challenges: [],
        his_bucket: [],
        coverageType: 1,
        coverage: [{}],
        coverageData: {},
        coverage_second_level: [{}],
        national_level_deployment: {
          health_workers: 0,
          clients: 0,
          facilities: 0
        }
      },
      rules: {}
    };
  },
  computed: {
    ...mapGetters({
      selectedDHi: 'projects/getCurrentProjectDHI'
    })
  },
  methods: {
    ...mapActions({
      setCurrentProjectDHI: 'projects/setCurrentProjectDHI'
    }),
    addDhi () {
      this.implementation.platforms.push({});
    },
    rmDhi (index, platformId) {
      if (platformId) {
        const filtered = this.selectedDHi.filter(dhi => dhi.platform !== platformId);
        this.setCurrentProjectDHI(filtered);
      }
      this.implementation.platforms.splice(index, 1);
    }
  }
};
</script>

<style>
</style>
