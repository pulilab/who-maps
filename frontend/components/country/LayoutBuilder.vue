<template>
  <div>
    <!-- default -->
    <default
      v-show="
        image === false &&
          description === false &&
          gdhi === false &&
          documents === false
      "
    >
      <template #left>
        <w-default />
      </template>
      <template #right>
        <w-image :url="default1" />
      </template>
    </default>

    <!-- description (only) -->
    <default
      v-show="
        image === false &&
          description === true &&
          gdhi === false &&
          documents === false
      "
      :gutter="30"
      classes="pb-0"
    >
      <template #left>
        <w-description :description="data.cover_text" />
      </template>
      <template #right>
        <w-image :url="default2" />
      </template>
    </default>

    <default
      v-show="
        image === false &&
          description === true &&
          gdhi === false &&
          documents === false
      "
      inverse
    >
      <template #left>
        <w-default />
      </template>
      <template #right>
        <w-image :url="default1" />
      </template>
    </default>

    <!-- image (only) -->
    <default
      v-show="
        image === true &&
          description === false &&
          gdhi === false &&
          documents === false
      "
      inverse
      :cols="[10, 14]"
      :gutter="30"
    >
      <template #left>
        <w-default vertical />
      </template>
      <template #right>
        <w-image :url="data.cover_url" />
      </template>
    </default>

    <!-- image, description (only) -->
    <default
      v-show="
        image === true &&
          description === true &&
          gdhi === false &&
          documents === false
      "
      :gutter="30"
    >
      <template #lefttop>
        <w-description :description="data.cover_text" />
      </template>
      <template #leftbottom>
        <w-image :url="data.cover_url" />
      </template>
      <template #right>
        <w-default
          vertical
          :url="default1"
        />
      </template>
    </default>

    <!-- image, description, stats (complete or partial) (only) -->
    <default
      v-show="
        image === true &&
          description === true &&
          gdhi === true &&
          documents === false
      "
      :gutter="30"
    >
      <template #lefttop>
        <w-description :description="data.cover_text" />
      </template>
      <template #leftbottom>
        <w-image :url="data.cover_url" />
      </template>
      <template #right>
        <w-stats
          :code="data.alpha_3_code"
          :stats="stats"
          :simple="simpleStats"
        />
      </template>
    </default>

    <!-- image, description, documents (only) -->
    <default
      v-show="
        image === true &&
          description === true &&
          gdhi === false &&
          documents === true
      "
      :gutter="30"
    >
      <template #lefttop>
        <w-description :description="data.cover_text" />
      </template>
      <template #leftbottom>
        <w-image :url="data.cover_url" />
      </template>
      <template #right>
        <w-documents :documents="data.documents" />
      </template>
    </default>

    <!-- description, image, stats (complete or partial), documents -->
    <three-columns
      v-show="
        image === true &&
          description === true &&
          gdhi === true &&
          documents === true
      "
    >
      <template #lefttop>
        <w-description
          single
          :description="data.cover_text"
        />
      </template>
      <template #leftbottom>
        <w-image :url="data.cover_url" />
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

    <!-- description, stats (complete or partial), documents -->
    <three-columns
      v-show="
        image === false &&
          description === true &&
          gdhi === true &&
          documents === true
      "
    >
      <template #lefttop>
        <w-description
          single
          :description="data.cover_text"
        />
      </template>
      <template #leftbottom>
        <img :src="default2">
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

    <!-- image, stats (complete or partial), documents -->
    <three-columns
      v-show="
        image === true &&
          description === false &&
          gdhi === true &&
          documents === true
      "
    >
      <template #lefttop>
        <img :src="data.cover_url">
      </template>
      <template #leftbottom>
        <w-default vertical />
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

    <!-- stats (complete or partial), documents -->
    <three-columns
      v-show="
        image === false &&
          description === false &&
          gdhi === true &&
          documents === true
      "
    >
      <template #left>
        <w-default
          vertical
          :url="default1"
        />
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

    <!-- stats (complete or partial) only -->
    <default
      v-show="
        image === false &&
          description === false &&
          gdhi === true &&
          documents === false
      "
      :gutter="30"
    >
      <template #left>
        <w-default
          vertical
          :url="default1"
        />
      </template>
      <template #right>
        <w-stats
          :code="data.alpha_3_code"
          :stats="stats"
          :simple="simpleStats"
        />
      </template>
    </default>

    <!-- documents only -->
    <default
      v-show="
        image === false &&
          description === false &&
          gdhi === false &&
          documents === true
      "
      :gutter="30"
    >
      <template #left>
        <w-default
          vertical
          :url="default1"
        />
      </template>
      <template #right>
        <w-documents :documents="data.documents" />
      </template>
    </default>

    <!-- image and stats only -->
    <default
      v-show="
        image === true &&
          description === false &&
          gdhi === true &&
          documents === false
      "
      :gutter="30"
    >
      <template #left>
        <img :src="data.cover_url">
      </template>
      <template #right>
        <w-stats
          :code="data.alpha_3_code"
          :stats="stats"
          :simple="simpleStats"
        />
      </template>
    </default>

    <!-- description and stats only -->
    <default
      v-show="
        image === false &&
          description === true &&
          gdhi === true &&
          documents === false
      "
      :gutter="30"
      :cols="[10, 14]"
    >
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
import default2 from '~/assets/img/default/coverimage-default.jpg'

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
      default2
    }
  },
  computed: {
    image () {
      return this.data.cover !== null
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
      color: @colorTextPrimary;
      margin: 0 0 20px;
    }
  }
}
</style>
