<template>
  <div>
    <default v-show="showDefault">
      <template #left>
        <w-default />
      </template>
      <template #right>
        <w-image :url="default1" />
      </template>
    </default>

    <default
      v-show="showDescriptionOnly"
      :gutter="30"
      :cols="[24]"
      classes="pb-0"
    >
      <template #left>
        <w-description :description="data.cover_text" />
      </template>
    </default>

    <default v-show="showDescriptionOnly" inverse>
      <template #left>
        <w-default />
      </template>
      <template #right>
        <w-image :url="default1" />
      </template>
    </default>

    <default v-show="showDescriptionAndStats" :cols="[12,12]" :gutter="30">
      <template #left>
        <w-description :description="data.cover_text" />
      </template>
      <template #right>
        <w-stats
          :code="data.alpha_3_code"
          :stats="stats"
          :simple="simpleStats"
        />
      </template>
    </default>

    <default v-show="showDescriptionAndDocs" :gutter="30">
      <template #left>
        <w-description :description="data.cover_text" />
      </template>
      <template #right>
        <w-documents :documents="data.documents" />
      </template>
    </default>

    <three-columns v-show="showAll">
      <template #left>
        <w-description single :description="data.cover_text" />
      </template>
      <template #middle>
        <w-stats
          :code="data.alpha_3_code"
          :stats="stats"
          :simple="simpleStats"
        />
      </template>
      <template #right>
        <w-documents :documents="data.documents" />
      </template>
    </three-columns>

    <three-columns v-show="showStatsAndDocs">
      <template #left>
        <w-default vertical :url="default1" />
      </template>
      <template #middle>
        <w-stats
          :code="data.alpha_3_code"
          :stats="stats"
          :simple="simpleStats"
        />
      </template>
      <template #right>
        <w-documents :documents="data.documents" />
      </template>
    </three-columns>

    <default v-show="showStatsOnly" :gutter="30">
      <template #left>
        <w-default vertical :url="default1" />
      </template>
      <template #right>
        <w-stats
          :code="data.alpha_3_code"
          :stats="stats"
          :simple="simpleStats"
        />
      </template>
    </default>

    <default v-show="showDocsOnly" :gutter="30">
      <template #left>
        <w-default vertical :url="default1" />
      </template>
      <template #right>
        <w-documents :documents="data.documents" />
      </template>
    </default>
  </div>
</template>

<script>
import Default from '@/components/country/layouts/Default'
import ThreeColumns from '@/components/country/layouts/ThreeColumns'

import WDescription from '@/components/country/widgets/WDescription'
import WDefault from '@/components/country/widgets/WDefault'
import WImage from '@/components/country/widgets/WImage'
import WDocuments from '@/components/country/widgets/WDocuments'
import WStats from '@/components/country/widgets/WStats'

// images
import default1 from '~/assets/img/default/whyusedha-new.jpg'

export default {
  components: {
    Default,
    ThreeColumns,
    WDescription,
    WDefault,
    WImage,
    WDocuments,
    WStats
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      default1,
    }
  },
  computed: {
    showDefault() {
      return !this.description && !this.gdhi && !this.documents
    },
    showDescriptionOnly() {
      return this.description && !this.gdhi && !this.documents
    },
    showDescriptionAndStats() {
      return this.description && this.gdhi && !this.documents
    },
    showDescriptionAndDocs() {
      return this.description && !this.gdhi && this.documents
    },
    showStatsAndDocs() {
      return !this.description && this.gdhi && this.documents
    },
    showStatsOnly() {
      return !this.description && this.gdhi && !this.documents
    },
    showDocsOnly() {
      return !this.description && !this.gdhi && this.documents
    },
    showAll() {
      return this.description && this.gdhi && this.documents
    },
    description () {
      return this.data.cover_text !== '' && this.data.cover_text !== null
    },
    gdhi () {
      return this.data.gdhi_enabled
    },
    documents () {
      return this.data.documents.length > 0
    },
    simpleStats () {
      const {
        leadership_and_governance,
        strategy_and_investment,
        legislation_policy_compliance,
        workforce,
        standards_and_interoperability,
        infrastructure,
        services_and_applications
      } = this.data

      if (
        leadership_and_governance !== null ||
        strategy_and_investment !== null ||
        legislation_policy_compliance !== null ||
        workforce !== null ||
        standards_and_interoperability !== null ||
        infrastructure !== null ||
        services_and_applications !== null
      ) {
        return false
      }
      return true
    },
    stats () {
      const {
        name,
        leadership_and_governance,
        strategy_and_investment,
        legislation_policy_compliance,
        workforce,
        standards_and_interoperability,
        infrastructure,
        services_and_applications,
        gni_per_capita,
        total_population,
        life_expectancy,
        health_expenditure
      } = this.data

      return {
        name,
        phases: [
          {
            title: 'leadership and governance',
            phase: leadership_and_governance
          },
          { title: 'strategy and investment', phase: strategy_and_investment },
          {
            title: 'legislation policy compliance',
            phase: legislation_policy_compliance
          },
          { title: 'workforce', phase: workforce },
          {
            title: 'standards and interoperability',
            phase: standards_and_interoperability
          },
          { title: 'infrastructure', phase: infrastructure },
          {
            title: 'services and applications',
            phase: services_and_applications
          }
        ],
        groups: [
          {
            title: 'Context',
            metrics: [
              {
                measure: 'GNI PER CAPITA, ATLAS METHOD (CURRENT US$)',
                value: gni_per_capita === null ? 'N/A' : `${gni_per_capita}K`
              },
              {
                measure: 'TOTAL POPULATION',
                value:
                  total_population === null ? 'N/A' : `${total_population}M`
              }
            ]
          },
          {
            title: 'Health',
            metrics: [
              {
                measure: 'LIFE EXPECTANCY AT BIRTH (YEARS)',
                value: life_expectancy === null ? 'N/A' : life_expectancy
              },
              {
                measure: 'HEALTH EXPENDITURE (% OF GDP)',
                value:
                  health_expenditure === null ? 'N/A' : `${health_expenditure}%`
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="less">
@import "../../assets/style/variables.less";

.matrix-layout {
  &.pb-0 {
    padding-bottom: 0 !important;
  }

  &.el-row {
    padding: 40px;
    align-items: stretch;
    flex-wrap: wrap;

    .el-col {
      &.mb {
        margin-bottom: 20px;
      }

      overflow: hidden;
    }

    &.pb-0 {
      padding-bottom: 0 !important;
    }

    // &.pt-20 {
    //   padding-top: 20px !important;
    // }
  }

  .fill {
    height: 100%;
  }

  img {
    width: 100%;
    background-color: white;
  }

  .grid-content {
    background: #fff;
    min-height: 50px;
    height: 100%;
    padding: 40px;

    p {
      font-size: @fontSizeBase;
      line-height: 21px;
      color: @colorTextPrimary;
      margin: 0 0 20px;
      &.special {
        line-height: 25px;
        font-size: @fontSizeMedium;
      }
    }

    h1,
    h3,
    h2 {
      text-align: center;
      color: @colorTextPrimary;
      margin: 0 0 20px;
    }
  }
}
</style>
