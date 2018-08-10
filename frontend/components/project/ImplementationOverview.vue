<template>
  <div
    id="implementation"
    class="ImplementationOverview">
    <collapsible-card title="Implementation Overview">

      <el-form-item
        label="Add one or more Software and related Digital Health Interventions (DHI):"
      >
        <el-form-item
          v-for="(platform, index) in platforms"
          :key="platform"
          label="Software"
        >
          <el-col :span="12">
            <platform-selector
              :platforms.sync="platforms"
              :index="index"
            />
            <el-form-item
              v-show="platform"
              label="Digital Health Interventions">
              <digital-health-interventions-selector
                :platform-id="platform"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12">
            <add-rm-buttons
              :show-add="!!platform"
              :show-rm="platforms.length > 1"
              @add="addDhi"
              @rm="rmDhi(index, platform)"
            />
          </el-col>
        </el-form-item>
      </el-form-item>
      <el-form-item
        label="Health focus area(s) - select all that apply:"
        prop="health_focus_areas">
        <health-focus-areas-selector v-model="health_focus_areas" />
      </el-form-item>
      <el-form-item
        label="What are the Health System Challenges (HSC) your project addresses?"
        prop="hsc_challenges">
        <health-system-challenges-selector v-model="hsc_challenges" />
      </el-form-item>
      <el-form-item
        label="What part(s) of the Health Information System (HIS) does this project support?"
        prop="his_bucket">
        <his-bucket-selector v-model="his_bucket" />
      </el-form-item>
      <div class="CoverageArea">
        <el-form-item label="What kind of coverage does your project have?">
          <el-radio-group v-model="coverageType">
            <el-radio :label="1">Sub-national</el-radio>
            <el-radio :label="2">National</el-radio>
          </el-radio-group>
        </el-form-item>
        <sub-national-level-deployment
          v-show="coverageType == 1"
          :coverage.sync="coverage"
          :coverage-data.sync="coverageData"
          :coverage-second-level.sync="coverage_second_level"/>
        <div
          v-show="coverageType == 2"
          class="NationalLevelDeployment">
          <fa icon="flag" />
          National level deployment
          <coverage-fieldset
            :health-workers.sync="national_level_deployment.health_workers"
            :clients.sync="national_level_deployment.clients"
            :facilities.sync="national_level_deployment.facilities"
          />
        </div>
      </div>
      <el-form-item
        label="Has the government financially invested in the project?"
        prop="government_investor">
        <el-radio-group v-model="government_investor">
          <el-radio :label="1">No, they have not yet contributed</el-radio>
          <el-radio :label="2">Yes, they are contributing in-kind people or time</el-radio>
          <el-radio :label="3">Yes, there is a financial contribution through MOH budget</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Implementing partners">
        <el-row
          v-for="(partner, index) in implementing_partners"
          :key="index"
        >
          <el-col :span="18">
            <el-input
              :value="partner"
              @change="updateImplmeentingPartners($event, index)"
            />
          </el-col>
          <el-col :span="6">
            <add-rm-buttons
              :show-add="!!partner"
              :show-rm="implementing_partners.length > 1"
              @add="addImplementingPartners"
              @rm="rmImplementingPartners(index)"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import CollapsibleCard from './CollapsibleCard';
import HealthSystemChallengesSelector from './HealthSystemChallengesSelector';
import HealthFocusAreasSelector from './HealthFocusAreasSelector';
import HisBucketSelector from './HisBucketSelector';
import PlatformSelector from './PlatformSelector';
import DigitalHealthInterventionsSelector from './DigitalHealthInterventionsSelector';
import SubNationalLevelDeployment from './SubNationalLevelDeployment';
import AddRmButtons from './AddRmButtons';
import CoverageFieldset from './CoverageFieldset';

import { mapGettersActions } from '../../utilities/form';

export default {
  components: {
    CollapsibleCard,
    HealthSystemChallengesSelector,
    HisBucketSelector,
    HealthFocusAreasSelector,
    PlatformSelector,
    DigitalHealthInterventionsSelector,
    SubNationalLevelDeployment,
    AddRmButtons,
    CoverageFieldset
  },
  computed: {
    ...mapGettersActions({
      platforms: ['project', 'getPlatforms', 'setPlatforms'],
      digitalHealthInterventions: ['project', 'getDigitalHealthInterventions', 'setDigitalHealthInterventions'],
      health_focus_areas: ['project', 'getHealthFocusAreas', 'setHealthFocusAreas'],
      hsc_challenges: ['project', 'getHscChallenges', 'setHscChallenges'],
      his_bucket: ['project', 'getHisBucket', 'setHisBucket'],
      coverageType: ['project', 'getCoverageType', 'setCoverageType'],
      coverage: ['project', 'getCoverage', 'setCoverage'],
      coverageData: ['project', 'getCoverageData', 'setCoverageData'],
      coverage_second_level: ['project', 'getCoverageSecondLevel', 'setCoverageSecondLevel'],
      national_level_deployment: ['project', 'getNationalLevelDeployment', 'setNationalLevelDeployment'],
      government_investor: ['project', 'getGovernmentInvestor', 'setGovernmentInvestor'],
      implementing_partners: ['project', 'getImplementingPartners', 'setImplementingPartners']
    })
  },
  methods: {
    addDhi () {
      this.platforms = [...this.platforms, null];
    },
    rmDhi (index, platformId) {
      if (platformId) {
        const filtered = this.digitalHealthInterventions.filter(dhi => dhi.platform !== platformId);
        this.digitalHealthInterventions = filtered;
      }
      this.platforms = this.platforms.filter((p, i) => i !== index);
    },
    updateImplmeentingPartners (value, index) {
      const ip = [...this.implementing_partners];
      ip[index] = value;
      this.implementing_partners = ip;
    },
    addImplementingPartners () {
      this.implementing_partners = [...this.implementing_partners, null];
    },
    rmImplementingPartners (index) {
      this.implementing_partners = this.implementing_partners.filter((ip, i) => i !== index);
    }
  }
};
</script>

<style>
</style>
