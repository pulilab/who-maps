<template>
  <div
    id="implementation"
    class="ImplementationOverview"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Implementation overview') | translate"
      :prepend-title="prependTitle"
      show-legend
    >
      <custom-required-form-item
        :error="errors.first('health_focus_areas')"
        :draft-rule="draftRules.health_focus_areas"
        :publish-rule="publishRules.health_focus_areas"
        prepend-label="12"
      >
        <template slot="label">
          <translate key="health-focus-areas">
            What is the health focus area(s) addressed by the DHI?
          </translate>
        </template>
        <health-focus-areas-selector
          v-model="health_focus_areas"
          v-validate="rules.health_focus_areas"
          data-vv-name="health_focus_areas"
          data-vv-validate-on="change"
          data-vv-as="Health focus areas"
        />
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('hsc_challenges')"
        :draft-rule="draftRules.hsc_challenges"
        :publish-rule="requiredAsterisk('hsc')"
        prepend-label="13a"
      >
        <template slot="label">
          <translate key="hsc-challenges">
            What are the Health System Challenges addressed by the Digital
            Health Intervention?
          </translate>
        </template>
        <health-system-challenges-selector
          v-model="hsc_challenges"
          v-validate="rules.hsc_challenges"
          data-vv-name="hsc_challenges"
          data-vv-validate-on="change"
          data-vv-as="Health system challenges"
        />
      </custom-required-form-item>

      <custom-required-form-item
        class="HSCOther"
        :error="errors.first('hsc_challenges')"
        :draft-rule="draftRules.hsc_challenges_other"
        :publish-rule="requiredAsterisk('hsco')"
        prepend-label="13b"
      >
        <template slot="label">
          <translate key="hsc-challenges">
            Other challanges
          </translate>
        </template>
        <el-row v-for="(other_challange, index) in hsc_challenges_other" :key="index">
          <el-col :span="17">
            <custom-required-form-item
              :error="errors.first('hsc_challenges_other_' + index)"
            >
              <el-input
                ref="HSCOtherInput"
                v-validate="rules.hsc_challenges_other"
                :maxlength="rules.hsc_challenges_other.max"
                :value="other_challange"
                :data-vv-name="'hsc_challenges_other_' + index"
                data-vv-validate-on="change"
                data-vv-as="Other challanges"
                @input="updateHSCOther($event, index)"
                @keyup.enter.native="addHSCOther"
              />
            </custom-required-form-item>
          </el-col>
          <el-col :span="6">
            <add-rm-buttons
              :show-add="isLastAndExist(hsc_challenges_other, index)"
              :show-rm="hsc_challenges_other.length > 1"
              @add="addHSCOther"
              @rm="rmHSCOther(index)"
            />
          </el-col>
        </el-row>
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('software')"
        :publish-rule="publishRules.software"
        prepend-label="14a"
      >
        <template slot="label">
          <translate key="software">
            What are the names of the software included in the deployment?
          </translate>
        </template>
        <SoftwareSelector
          v-model="software"
          v-validate="rules.software"
          data-vv-name="software"
          data-vv-validate-on="change"
          data-vv-as="Software"
        />
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('strategies')"
        :draft-rule="draftRules.strategies"
        :publish-rule="publishRules.strategies"
        prepend-label="14b"
        class="DigitalHealthIntervention"
      >
        <template slot="label">
          <translate key="strategies">
            What Digital Health Intervention(s) are included in the deployment?
          </translate>
          <a
            class="TooltipLink"
            target="_blank"
            href="https://apps.who.int/iris/bitstream/handle/10665/260480/WHO-RHR-18.06-eng.pdf;jsessionid=50B83CAF6ACF46453B7D6BAB9672EB77?sequence=1)"
          >
            <fa icon="question-circle" />
          </a>
        </template>
        <DigitalHealthInterventionsSelector
          v-validate="rules.strategies"
          :dhis="dhis"
          data-vv-name="strategies"
          data-vv-as="Digital health interventions"
        />
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('applicatin_types')"
        :publish-rule="publishRules.services_and_application_types"
        prepend-label="15"
      >
        <template slot="label">
          <translate key="application-type">
            What are the Services and Application Types?
          </translate>
        </template>
        <ApplicationTypeSelector
          v-model="services_and_application_types"
          v-validate="rules.services_and_application_types"
          data-vv-name="hsc_challenges"
          data-vv-validate-on="change"
          data-vv-as="Health system challenges"
        />
      </custom-required-form-item>

      <div class="CoverageArea">
        <custom-required-form-item
          prop="coverageType"
          prepend-label="16"
        >
          <template slot="label">
            <translate key="coverage-type">
              What level of coverage does your project have (Sub-national,
              National)
            </translate>
            <tooltip
              :text="
                $gettext(
                  'Subnational may include district, regional, provincial, county levels.'
                ) | translate
              "
            />
          </template>

          <el-radio-group
            v-show="!isGlobalSelected"
            v-model="coverageType"
            :disabled="isGlobalSelected"
          >
            <el-radio :label="1">
              <translate>Sub-national</translate>
            </el-radio>
            <el-radio :label="2">
              <translate>National</translate>
            </el-radio>
          </el-radio-group>
          <label v-show="isGlobalSelected">
            <translate>International</translate>
          </label>
        </custom-required-form-item>

        <sub-national-level-deployment
          v-if="coverageType == 1"
          ref="subNationalLevelDeployment"
          :api-errors="apiErrors"
          :rules="rules"
          :draft-rules="draftRules"
          :publish-rules="publishRules"
        />

        <div
          v-if="coverageType == 2"
          class="NationalLevelDeployment ItemIndent"
        >
          <div
            v-show="!isGlobalSelected"
            class="CoverageSubtitle"
          >
            <fa icon="flag" />
            <translate>National level deployment</translate>
          </div>
          <div
            v-show="isGlobalSelected"
            class="CoverageSubtitle"
          >
            <fa icon="globe" />
            <translate>International level deployment</translate>
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
            :draft-rules="draftRules.national_level_deployment"
            :publish-rules="publishRules.national_level_deployment"
            scope="national_level_deployment"
          />
        </div>
      </div>

      <custom-required-form-item
        :error="errors.first('government_investor')"
        :draft-rule="draftRules.government_investor"
        :publish-rule="publishRules.government_investor"
        prepend-label="17"
      >
        <template slot="label">
          <translate key="gobernment-investor">
            Has the government contributed to the project, either financially or
            in-kind?
          </translate>
        </template>

        <el-radio-group
          v-model="government_investor"
          v-validate="rules.government_investor"
          data-vv-name="government_investor"
          data-vv-as="Government investor"
          class="OnePerRow"
        >
          <el-radio :label="0">
            <translate>No, they have not yet contributed</translate>
          </el-radio>
          <el-radio :label="1">
            <translate>
              Yes, they are contributing in-kind people or time
            </translate>
          </el-radio>
          <el-radio :label="2">
            <translate>
              Yes, there is a financial contribution through MOH
              budget
            </translate>
          </el-radio>
          <el-radio :label="3">
            <translate>Yes, MOH is fully funding the project</translate>
          </el-radio>
        </el-radio-group>
      </custom-required-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js'
import ProjectFieldsetMixin from '../../mixins/ProjectFieldsetMixin.js'

import AddRmButtons from '@/components/project/AddRmButtons.vue'
import CollapsibleCard from '../CollapsibleCard'
import HealthSystemChallengesSelector from '../HealthSystemChallengesSelector'
import ApplicationTypeSelector from '../ApplicationTypeSelector'
import HealthFocusAreasSelector from '../HealthFocusAreasSelector'
import SoftwareSelector from '../SoftwareSelector'
import DigitalHealthInterventionsSelector from '../DigitalHealthInterventionsSelector'
import SubNationalLevelDeployment from '../SubNationalLevelDeployment'
import CoverageFieldset from '../CoverageFieldset'
import DonorSelector from '../DonorSelector'
import Tooltip from '@/components/dashboard/Tooltip'

import { mapGettersActions } from '../../../utilities/form'

export default {
  components: {
    AddRmButtons,
    CollapsibleCard,
    HealthSystemChallengesSelector,
    ApplicationTypeSelector,
    HealthFocusAreasSelector,
    SoftwareSelector,
    DigitalHealthInterventionsSelector,
    SubNationalLevelDeployment,
    CoverageFieldset,
    DonorSelector,
    Tooltip
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],

  computed: {
    ...mapGettersActions({
      country: ['project', 'getCountry', 'setCountry', 0],
      software: ['project', 'getSoftware', 'setSoftware', 0],
      dhis: ['project', 'getDHIs', 'setDHIs', 0],
      health_focus_areas: [
        'project',
        'getHealthFocusAreas',
        'setHealthFocusAreas',
        0
      ],
      hsc_challenges: ['project', 'getHscChallenges', 'setHscChallenges', 0],
      hsc_challenges_other: [
        'project',
        'getHscChallengesOther',
        'setHscChallengesOther',
        300,
        true
      ],
      services_and_application_types: ['project', 'getApplicationTypes', 'setApplicationTypes', 0],
      coverageType: ['project', 'getCoverageType', 'setCoverageType', 0],
      national_level_deployment: [
        'project',
        'getNationalLevelDeployment',
        'setNationalLevelDeployment',
        0
      ],
      government_investor: [
        'project',
        'getGovernmentInvestor',
        'setGovernmentInvestor',
        0
      ],
      shadow_donors: ['project', 'getShadowDonors', 'setShadowDonors', 0]
    }),
    healthWorkers: {
      get () {
        return this.national_level_deployment
          ? this.national_level_deployment.health_workers
          : null
      },
      set (value) {
        const coverage = {
          ...this.national_level_deployment,
          health_workers: value
        }
        this.national_level_deployment = coverage
      }
    },
    clients: {
      get () {
        return this.national_level_deployment
          ? this.national_level_deployment.clients
          : null
      },
      set (value) {
        const coverage = { ...this.national_level_deployment, clients: value }
        this.national_level_deployment = coverage
      }
    },
    facilities: {
      get () {
        return this.national_level_deployment
          ? this.national_level_deployment.facilities
          : null
      },
      set (value) {
        const coverage = {
          ...this.national_level_deployment,
          facilities: value
        }
        this.national_level_deployment = coverage
      }
    },
    isGlobalSelected () {
      return this.country === process.env.GlobalCountryID
    }
  },
  watch: {
    isGlobalSelected () {
      this.coverageType = 2
    },
    hsc_challenges_other: {
      immediate: false,
      handler (oc, oldOc) {
        if (oldOc && oc && oc.length > oldOc.length) {
          this.$nextTick(() => {
            if (
              this.$refs.HSCOtherInput &&
              this.$refs.HSCOtherInput.length > 0
            ) {
              this.$refs.HSCOtherInput[
                this.$refs.HSCOtherInput.length - 1
              ].focus()
            }
          })
        }
      }
    }
  },
  methods: {
    updateHSCOther (value, index) {
      const oc = [...this.hsc_challenges_other]
      oc[index] = value
      this.hsc_challenges_other = oc
    },
    addHSCOther () {
      const index = this.hsc_challenges_other.length - 1
      if (this.isLastAndExist(this.hsc_challenges_other, index)) {
        this.hsc_challenges_other = [...this.hsc_challenges_other, null]
      }
    },
    rmHSCOther (index) {
      this.hsc_challenges_other = this.hsc_challenges_other.filter(
        (ip, i) => i !== index
      )
    },
    isLastAndExist (collection, index) {
      return !!(collection.length - 1 === index && collection[index])
    },
    // the asterisk of requiredness will show up on both 13a and 13b if both empty
    // if one is filled only that one marked as required
    requiredAsterisk (field) {
      const isListEmpty = (list) => { if (
        list.length == 0 ||
        ( list.length == 1 && (list[0] == '' || list[0] == null) ) ) {
          return true
        } else {
          return false
        } }
      let returnRequired = false
      if (isListEmpty(this.hsc_challenges) && isListEmpty(this.hsc_challenges_other)){
        returnRequired = true
      }
      if (field == 'hsc'){
        if (!isListEmpty(this.hsc_challenges) && isListEmpty(this.hsc_challenges_other)){
          returnRequired = true
        }
      } else if (field == 'hsco') {
        if (isListEmpty(this.hsc_challenges) && !isListEmpty(this.hsc_challenges_other)){
          returnRequired = true
        }
      }
      return {
        required: returnRequired
      }
    },
    async validate () {
      this.$refs.collapsible.expandCard()
      const validations = await Promise.all([
        this.$validator.validate(),
        this.coverageType === 2
          ? this.$refs.nationalLevelDeployment.validate()
          : this.$refs.subNationalLevelDeployment.validate()
      ])
      console.log('Implementation overview validations', validations)
      return validations.reduce((a, c) => a && c, true)
    }
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.ImplementationOverview {
  .HiddenPlatform + .el-form-item__error {
    box-sizing: border-box;
    margin: 0 0 30px 2px;
    padding: 10px 0 10px 30px;
    border-left: 5px solid #D6D6D6;
  }
  .TooltipLink {
    color: #9b9b9b;
    &:hover {
      color: #b4b4b4;
    }
  }
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

  .HSCOther {
    .el-row {
      margin-top: 20px;

      &:first-child {
        margin: 0;
      }
    }
  }
}
</style>
