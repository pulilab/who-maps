<template>
  <div
    id="implementation"
    class="ImplementationOverview">
    <collapsible-card title="Implementation overview">

      <el-form-item
        :error="errors.first('platforms')"
        label="Add one or more Software and related Digital Health Interventions (DHI):"
      >
        <el-form-item
          v-for="(platform, index) in platforms"
          :key="platform"
          :error="errors.first('id', 'platform_' + index)"
          label="Software"
          class="ItemIndent"
        >
          <el-col :span="16">
            <platform-selector
              v-validate="rules.platforms"
              :key="platform"
              :data-vv-scope="'platform_' + index"
              v-model="platforms"
              :index="index"
              data-vv-name="id"
              data-vv-as="Software"
            />
            <el-form-item
              v-show="platform"
              :error="errors.first('strategies', 'platform_' + index)"
              label="Digital Health Interventions"
              class="DigitalHealthIntervention"
            >
              <digital-health-interventions-selector
                v-validate="rules.strategies"
                :platform-id="platform"
                :data-vv-scope="'platform_' + index"
                data-vv-name="strategies"
                data-vv-as="Digital health interventions"
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
        :error="errors.first('health_focus_areas')"
        label="Health focus area(s) - select all that apply:">
        <health-focus-areas-selector
          v-validate="rules.health_focus_areas"
          v-model="health_focus_areas"
          data-vv-name="health_focus_areas"
          data-vv-validate-on="change"
          data-vv-as="Health focus areas"
        />
      </el-form-item>

      <el-form-item
        :error="errors.first('hsc_challenges')"
        label="What are the Health System Challenges (HSC) your project addresses?">
        <health-system-challenges-selector
          v-validate="rules.hsc_challenges"
          v-model="hsc_challenges"
          data-vv-name="hsc_challenges"
          data-vv-validate-on="change"
          data-vv-as="Health system challenges"
        />
      </el-form-item>

      <el-form-item
        :error="errors.first('his_bucket')"
        label="What part(s) of the Health Information System (HIS) does this project support?"
      >
        <his-bucket-selector
          v-validate="rules.his_bucket"
          v-model="his_bucket"
          data-vv-name="his_bucket"
          data-vv-validate-on="change"
          data-vv-as="Health information system"
        />
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
          ref="subNationalLevelDeployment"
          :api-errors="apiErrors"
          :rules="rules"
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
            ref="nationalLevelDeployment"
            :is-nlc="true"
            :disabled="false"
            :rules="rules.national_level_deployment"
            :api-errors="apiErrors"
            :health-workers.sync="healthWorkers"
            :clients.sync="clients"
            :facilities.sync="facilities"
          />
        </div>
      </div>
      <el-form-item
        :error="errors.first('government_investor')"
        label="Has the government financially invested in the project?">
        <el-radio-group
          v-validate="rules.government_investor"
          v-model="government_investor"
          data-vv-name="government_investor"
          data-vv-as="Government investor"
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
            <el-form-item :error="errors.first('implementing_partners_' + index)">
              <el-input
                v-validate="rules.implementing_partners"
                :value="partner"
                :data-vv-name="'implementing_partners_' + index"
                data-vv-validate-on="change"
                data-vv-as="Implementing partners"
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
      <el-form-item
        :error="errors.first('donors')"
        label="Donor(s) supporting the project (Add one at least)"
      >
        <donor-selector
          v-validate="rules.donors"
          v-model="donors"
          data-vv-name="donors"
          data-vv-as="Donors"
        />
      </el-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';

import CollapsibleCard from '../CollapsibleCard';
import HealthSystemChallengesSelector from '../HealthSystemChallengesSelector';
import HealthFocusAreasSelector from '../HealthFocusAreasSelector';
import HisBucketSelector from '../HisBucketSelector';
import PlatformSelector from '../PlatformSelector';
import DigitalHealthInterventionsSelector from '../DigitalHealthInterventionsSelector';
import SubNationalLevelDeployment from '../SubNationalLevelDeployment';
import AddRmButtons from '../AddRmButtons';
import CoverageFieldset from '../CoverageFieldset';
import DonorSelector from '../DonorSelector';

import { mapGettersActions } from '../../../utilities/form';

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
    CoverageFieldset,
    DonorSelector
  },
  mixins: [VeeValidationMixin],
  props: {
    rules: {
      type: Object,
      default: () => ({})
    }
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
      implementing_partners: ['project', 'getImplementingPartners', 'setImplementingPartners', 0],
      donors: ['project', 'getDonors', 'setDonors', 0]
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
    },
    async validate () {
      const validations = await Promise.all([
        this.$validator.validate(),
        this.$refs.nationalLevelDeployment.validate(),
        this.$refs.subNationalLevelDeployment.validate()
      ]);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

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
