<template>
  <lazy-el-select
    :value="value"
    :placeholder="$gettext('Select from list') | translate"
    multiple
    filterable
    popper-class="hsc-popper"
    class="HealthSystemChallengesSelector"
    @change="changeHandler"
  >
    <el-option-group
      v-for="group in healthSystemChallenges"
      :key="group.id"
      :label="group.name"
    >
      <el-option
        v-for="hsc in group.challenges"
        :key="hsc.id"
        :value="hsc.id"
        :label="hsc.challenge"
        class="hsc-item"
      >
        <span>{{ hsc.challenge }}</span>
        <!-- <el-tooltip v-show="getChallengeTooltip(hsc.id)" class="item" effect="dark" popper-class="hsc-tooltip" :content="getChallengeTooltip(hsc.id)">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </el-tooltip> -->
      </el-option>
    </el-option-group>
  </lazy-el-select>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      challengeTooltips: [
        {
          id: 1,
          tooltip: this.$gettext('The data corresponding to the total number of people in a population for a defined use case at the start of the observation or study period is not available')
        },
        {
          id: 2,
          tooltip: this.$gettext('There is a delayed availability or reporting of data, including reporting to district, regional or national health authorities')
        },
        {
          id: 3,
          tooltip: this.$gettext('Data is available but is not of good quality and is not reliable')
        },
        {
          id: 4,
          tooltip: this.$gettext('The communication between health service users, health service providers and health system managers is difficult due to manual or traditional ways of interactions, mistrust, language or cultural barriers')
        },
        {
          id: 5,
          tooltip: this.$gettext('The data is available but not accessible either due to insufficient data collection or unavailability of modes to access the data or availability of difficult modes to access the data')
        },
        {
          id: 6,
          tooltip: this.$gettext('The data is available but is not utilized to full extent either because of limited skills and implemented procedures for usage or availability of data in the traditional mode/s')
        },
        {
          id: 7,
          tooltip: this.$gettext('Lack of a reference/identifier that marks an individual, entity or record as unique')
        },
        {
          id: 8,
          tooltip: this.$gettext('Insufficient commodities available for the purchase of health system and health service users')
        },
        {
          id: 9,
          tooltip: this.$gettext('Inadequate provision of medical services')
        },
        {
          id: 10,
          tooltip: this.$gettext('Inadequate provision of medical equipment’s against the demand of health system and health service users')
        },
        {
          id: 11,
          tooltip: this.$gettext('Health Workforce Shortage')
        },
        {
          id: 12,
          tooltip: this.$gettext('Unfavourable experience of a health service user when using the healthcare system; whether due to policies, processes, interactions with healthcare professionals or other aspects of the health system')
        },
        {
          id: 13,
          tooltip: this.$gettext('Health worker lacking the necessary skills, experience, behaviours, knowledge and judgement to safely carry out required functions in a health system')
        },
        {
          id: 14,
          tooltip: this.$gettext('Poor quality of medical goods and commodities')
        },
        {
          id: 30,
          tooltip: this.$gettext('1. Minimal/No support for healthcare providers from the supervisors and managers. 2. Lack of motivations due to poor working conditions, financial and morale reasons"')
        },
        {
          id: 15,
          tooltip: this.$gettext(`Lack of mechanisms to support continuity of care such as: - uncoordinated referrals, - lack of interoperable digital systems causing health service users' data being in disparate systems`)
        },
        {
          id: 16,
          tooltip: this.$gettext(`Minimal support for: - healthcare providers from supervisors/providers - health service users from healthcare providers`)
        },
        {
          id: 17,
          tooltip: this.$gettext('Little to no adherence to guidelines outlined for patient care including clinical guidelines, standards and protocols in health system')
        },
        {
          id: 18,
          tooltip: this.$gettext(`Health systems' discrepancy with the regional and cultural context of the population`)
        },
        {
          id: 19,
          tooltip: this.$gettext(`Health systems' initiatives are not in line with the health understanding of the population`)
        },
        {
          id: 20,
          tooltip: this.$gettext(`Little to no demand for services due to: a) unawareness of the availability of services to resolve the health issues b) financial barriers c) no health tracking`)
        },
        {
          id: 21,
          tooltip: this.$gettext(`Geographic barriers to avail the: a) Laboratory and Diagnostics Services b) Medication Products & Services c) Healthcare Provider Services`)
        },
        {
          id: 22,
          tooltip: this.$gettext(`Little/ No adherence to the defined treatment procedure including clinician revisits, medication, etc.`)
        },
        {
          id: 23,
          tooltip: this.$gettext(`Inability to locate health service user details in order to determine their health status and take actions`)
        },
        {
          id: 24,
          tooltip: this.$gettext(`Lack of mechanisms to appropriately manage defined workflows`)
        },
        {
          id: 25,
          tooltip: this.$gettext(`Absence of proper referrals mechanism from: a) healthcare provider to healthcare provider b) healthcare to other sectors`)
        },
        {
          id: 26,
          tooltip: this.$gettext(`Insufficient organisation of the different elements required to deliver adequate health services including: a) Human Resources b) Healthcare Services c) Goods & Commodities`)
        },
        {
          id: 27,
          tooltip: this.$gettext(`Retarded access to care due to: a) Loss of health tracking b) Limited availability of services c) Geographic Barriers`)
        },
        {
          id: 28,
          tooltip: this.$gettext(`Limited/No access to the healthcare facilities and services due to logistics barriers`)
        },
        {
          id: 31,
          tooltip: this.$gettext(`N/A`)
        },
        {
          id: 32,
          tooltip: this.$gettext(`N/a`)
        },
        {
          id: 33,
          tooltip: this.$gettext(`N/A`)
        },
        {
          id: 34,
          tooltip: this.$gettext(`N/A`)
        },
        {
          id: 35,
          tooltip: this.$gettext(`Inadequate information exchange of: a) Health Events b) Health System Feedback c) Healthcare literacy (precautions, home remedy)`)
        },
        {
          id: 36,
          tooltip: this.$gettext(`Health Service Users and Healthcare Providers are uninformed about the health service entitlements for the health service users`)
        },
        {
          id: 37,
          tooltip: this.$gettext(`Lack of methods, procedures and systems for population to provide feedback to the health system`)
        },
        {
          id: 38,
          tooltip: this.$gettext(`No visibility to the funds flow in the process of acquiring and delivering medical goods`)
        },
        {
          id: 39,
          tooltip: this.$gettext(`Absence of or undetermined framework for outlining the responsibilities of health system at different levels`)
        },
        {
          id: 40,
          tooltip: this.$gettext(`Insufficient exposure/understanding/availability of education to the population`)
        }

      ],
    }
  },
  computed: {
    ...mapGetters({
      healthSystemChallenges: 'projects/getHscChallenges'
    })
  },
  methods: {
    getChallengeTooltip(id) {
      return this.challengeTooltips.find(ct => ct.id === id)?.tooltip
    },
    changeHandler (value) {
      this.$emit('change', value)
    },
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";

.HealthSystemChallengesSelector {
  width: 100%;
  ::v-deep .el-select-group {
    position: relative;
  }
}

.hsc-tooltip {
  max-width: 448px;
}

.hsc-popper {
  .el-select-group {
    position: relative;
    svg.group {
      position: absolute;
      top: 5px;
      right: 20px;
      height: 20px;
      width: 20px;
      color: @colorGray;
      width: 20px;
      height: 20px;
      &:hover {
        color: @colorBrandPrimary;
      }
    }
  }
}

.hsc-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    cursor: default;
    color: @colorGray;
    width: 20px;
    height: 20px;
    &:hover {
      color: @colorBrandPrimary;
    }
  }
  &.el-select-dropdown__item.selected {
    &::after {
      right: 48px;
    }
  }
}
</style>
