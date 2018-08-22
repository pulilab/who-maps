<template>
  <div
    id="implementation"
    class="ImplementationOverview">
    <collapsible-card title="Implementation overview">

      <el-form-item
        label="Add one or more Software and related Digital Health Interventions (DHI):"
      >
        <el-form-item
          v-for="(platform, index) in platforms"
          :key="platform"
          :prop="'platforms.' + index"
          label="Software"
          class="ItemIndent"
        >
          <el-col :span="16">
            <platform-selector
              :platforms.sync="platforms"
              :index="index"
            />
            <el-form-item
              v-show="platform"
              label="Digital Health Interventions"
              class="DigitalHealthIntervention"
            >
              <digital-health-interventions-selector
                :platform-id="platform"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
        <el-form-item
          label="What kind of coverage does your project have?"
          prop="coverageType"
        >
          <el-radio-group v-model="coverageType">
            <el-radio :label="1">Sub-national</el-radio>
            <el-radio :label="2">National</el-radio>
          </el-radio-group>
        </el-form-item>

        <sub-national-level-deployment
          v-show="coverageType == 1"
        />

        <div
          v-show="coverageType == 2"
          class="NationalLevelDeployment ItemIndent"
        >
          <div class="CoverageSubtitle">
            <fa icon="flag" />
            National level deployment
          </div>
          <coverage-fieldset
            :is-nlc="true"
            :disabled="false"
            :health-workers.sync="healthWorkers"
            :clients.sync="clients"
            :facilities.sync="facilities"
          />
        </div>
      </div>
      <el-form-item
        label="Has the government financially invested in the project?"
        prop="government_investor">
        <el-radio-group
          v-model="government_investor"
          class="OnePerRow">
          <el-radio :label="0">No, they have not yet contributed</el-radio>
          <el-radio :label="1">Yes, they are contributing in-kind people or time</el-radio>
          <el-radio :label="2">Yes, there is a financial contribution through MOH budget</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="Implementing partners"
        class="ImplementingPartners">
        <el-row
          v-for="(partner, index) in implementing_partners"
          :key="index"
        >
          <el-col :span="16">
            <el-form-item :prop="'implementing_partners.' + index">
              <el-input
                :value="partner"
                @change="updateImplmeentingPartners($event, index)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
      platforms: ['project', 'getPlatforms', 'setPlatforms', 0],
      digitalHealthInterventions: ['project', 'getDigitalHealthInterventions', 'setDigitalHealthInterventions', 0],
      health_focus_areas: ['project', 'getHealthFocusAreas', 'setHealthFocusAreas', 0],
      hsc_challenges: ['project', 'getHscChallenges', 'setHscChallenges', 0],
      his_bucket: ['project', 'getHisBucket', 'setHisBucket', 0],
      coverageType: ['project', 'getCoverageType', 'setCoverageType', 0],
      national_level_deployment: ['project', 'getNationalLevelDeployment', 'setNationalLevelDeployment', 0],
      government_investor: ['project', 'getGovernmentInvestor', 'setGovernmentInvestor', 0],
      implementing_partners: ['project', 'getImplementingPartners', 'setImplementingPartners', 300]
    }),
    healthWorkers: {
      get () {
        return this.national_level_deployment ? this.national_level_deployment.health_workers : null;
      },
      set (value) {
        const coverage = {...this.national_level_deployment, health_workers: value};
        this.national_level_deployment = coverage;
      }
    },
    clients: {
      get () {
        return this.national_level_deployment ? this.national_level_deployment.clients : null;
      },
      set (value) {
        const coverage = {...this.national_level_deployment, clients: value};
        this.national_level_deployment = coverage;
      }
    },
    facilities: {
      get () {
        return this.national_level_deployment ? this.national_level_deployment.facilities : null;
      },
      set (value) {
        const coverage = {...this.national_level_deployment, facilities: value};
        this.national_level_deployment = coverage;
      }
    }
  },
  mounted () {
    this.$emit('mounted');
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

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ImplementationOverview {
    .DigitalHealthIntervention {
      margin-top: 30px;
    }

    .CoverageArea {
      .CoverageSubtitle {
        position: relative;
        display: block;
        margin: 0 0 20px;
        padding: 10px 0 0 20px;
        font-size: @fontSizeSmall;
        font-weight: 700;
        color: @colorGray;
        text-transform: uppercase;

        .svg-inline--fa {
          position: absolute;
          top: 10px;
          left: 0;
        }
      }
    }

    .ImplementingPartners {
      .el-row {
        margin-top: 20px;

        &:first-child {
          margin: 0;
        }
      }
    }
  }
</style>
