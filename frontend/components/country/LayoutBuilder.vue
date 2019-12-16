<template>
<div>
    <!-- default -->
    <default v-show="(image === false) && (description === false) && (gdhi === false) && (documentation === false)">
      <template v-slot:left>
        <w-default />
      </template>
      <template v-slot:right>
        <w-image :url="default1" />
      </template>
    </default>

    <!-- description (only) -->
    <default
      v-show="(image === false) && (description === true) && (gdhi === false) && (documentation === false)"
      :gutter="20"
      classes="pb-0"
    >
      <template v-slot:left>
        <w-description :description="data.cover_text" />
      </template>
      <template v-slot:right>
        <w-image :url="default2" />
      </template>
    </default>

    <default
      v-show="(image === false) && (description === true) && (gdhi === false) && (documentation === false)"
      inverse
      classes="pt-20"
    >
      <template v-slot:left>
        <w-default />
      </template>
      <template v-slot:right>
        <w-image :url="default1" />
      </template>
    </default>

    <!-- image (only) -->
    <default
      v-show="(image === true) && (description === false) && (gdhi === false) && (documentation === false)"
      inverse
      :cols="[10, 14]"
      :gutter="20">
      <template v-slot:left>
        <w-default vertical />
      </template>
      <template v-slot:right>
        <w-image :url="data.cover_url" />
      </template>
    </default>

    <!-- image, description (only) -->
    <default
      v-show="(image === true) && (description === true) && (gdhi === false) && (documentation === false)"
      :gutter="20">
      <template v-slot:lefttop>
        <w-description :description="data.cover_text" />
      </template>
      <template v-slot:leftbottom>
        <w-image :url="data.cover_url" />
      </template>
      <template v-slot:right>
        <w-default vertical :url="default1" />
      </template>
    </default>

    <!-- image, description, stats (complete or partial) (only) -->
    <default
      v-show="(image === true) && (description === true) && (gdhi === true) && (documentation === false)"
      :gutter="20">
      <template v-slot:lefttop>
        <w-description :description="data.cover_text" />
      </template>
      <template v-slot:leftbottom>
        <w-image :url="data.cover_url" />
      </template>
      <template v-slot:right>
        <w-stats :stats="stats"/>
      </template>
    </default>

    <!-- image, description, documents (only) -->
    <default
      v-show="(image === true) && (description === true) && (gdhi === false) && (documentation === true)"
      :gutter="20">
      <template v-slot:lefttop>
        <w-description :description="data.cover_text" />
      </template>
      <template v-slot:leftbottom>
        <w-image :url="data.cover_url" />
      </template>
      <template v-slot:right>
        <w-documents :documents="documents"/>
      </template>
    </default>

    <!-- description, image, stats (complete or partial), documents -->
    <three-columns
      v-show="(image === true) && (description === true) && (gdhi === true) && (documentation === true)"
    >
      <template v-slot:lefttop>
        <w-description :description="data.cover_text" />
      </template>
      <template v-slot:leftbottom>
        <w-image :url="data.cover_url" />
      </template>
      <template v-slot:middle>
        <w-stats :stats="stats"/>
      </template>
      <template v-slot:right>
        <w-documents :documents="documents"/>
      </template>
    </three-columns>

    <!-- description, stats (complete or partial), documents -->
    <three-columns
      v-show="(image === false) && (description === true) && (gdhi === true) && (documentation === true)"
    >
      <template v-slot:lefttop>
        <w-description :description="data.cover_text" />
      </template>
      <template v-slot:leftbottom>
        <img :src="default2" />
      </template>
      <template v-slot:middle>
        <w-stats :stats="stats"/>
      </template>
      <template v-slot:right>
        <w-documents :documents="documents"/>
      </template>
    </three-columns>

    <!-- image, stats (complete or partial), documents -->
    <three-columns
      v-show="(image === true) && (description === false) && (gdhi === true) && (documentation === true)"
    >
      <template v-slot:lefttop>
        <img :src="data.cover_url" />
      </template>
      <template v-slot:leftbottom>
        <w-default vertical />
      </template>
      <template v-slot:middle>
        <w-stats :stats="stats"/>
      </template>
      <template v-slot:right>
        <w-documents :documents="documents"/>
      </template>
    </three-columns>

    <!-- stats (complete or partial), documents -->
    <three-columns
      v-show="(image === false) && (description === false) && (gdhi === true) && (documentation === true)"
    >
      <template v-slot:left>
        <w-default vertical :url="default1" />
      </template>
      <template v-slot:middle>
        <w-stats :stats="stats"/>
      </template>
      <template v-slot:right>
        <w-documents :documents="documents"/>
      </template>
    </three-columns>

    <!-- stats (complete or partial) only -->
    <default
      v-show="(image === false) && (description === false) && (gdhi === true) && (documentation === false)"
      :gutter="20"
    >
      <template v-slot:left>
        <w-default vertical :url="default1" />
      </template>
      <template v-slot:right>
        <w-stats :stats="stats"/>
      </template>
    </default>

    <!-- documents only -->
    <default
      v-show="(image === false) && (description === false) && (gdhi === false) && (documentation === true)"
      :gutter="20"
    >
      <template v-slot:left>
        <w-default vertical :url="default1" />
      </template>
      <template v-slot:right>
        <w-documents :documents="documents"/>
      </template>
    </default>
  </div>
</template>

<script>
import Default from '@/components/country/layouts/Default';
import ThreeColumns from '@/components/country/layouts/ThreeColumns';

import WDescription from '@/components/country/widgets/WDescription';
import WDefault from '@/components/country/widgets/WDefault';
import WImage from '@/components/country/widgets/WImage';
import WDocuments from '@/components/country/widgets/WDocuments';
import WStats from '@/components/country/widgets/WStats';
// import { mapGetters } from 'vuex';

// images
import default1 from '~/assets/img/default/whyusedha-new.jpg';
import default2 from '~/assets/img/default/coverimage-default.jpg';

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
  data() {
    return {
      default1,
      default2,
      documents: [
        { id: 1, title: 'document 1'},
        { id: 2, title: 'document 2'}
      ]
    }
  },
    computed: {
    image () {
      return this.data.cover !== null;
    },
    description () {
      return this.data.cover_text !==  '';
    },
    gdhi () {
      return this.data.gdhi_enabled;
    },
    documentation () {
      return false;
    },
    stats () {
      return {
        name: this.data.name,
        phases: [
          { title: 'leadership and governance', phase: this.data.leadership_and_governance },
          { title: 'strategy and investment', phase: this.data.strategy_and_investment },
          { title: 'legislation policy compliance', phase: this.data.legislation_policy_compliance },
          { title: 'workforce', phase: this.data.workforce },
          { title: 'standards and interoperability', phase: this.data.standards_and_interoperability },
          { title: 'infrastructure', phase: this.data.infrastructure },
          { title: 'services and applications', phase: this.data.services_and_applications }
        ],
        groups: [
          {
            title: 'Context',
            metrics : [
              {
                measure: 'GNI PER CAPITA, ATLAS METHOD (CURRENT US$)',
                value: `${this.data.gni_per_capita}K`
              },
              {
                measure: 'TOTAL POPULATION',
                value: `${this.data.total_population}M`
              }
            ]
          },
                    {
            title: 'Health',
            metrics : [
              {
                measure: 'LIFE EXPECTANCY AT BIRTH (YEARS)',
                value: this.data.life_expectancy
              },
              {
                measure: 'HEALTH EXPENDITURE (% OF GDP)',
                value: `${this.data.health_expenditure}%`
              }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    console.log(this.data)
    // gdhi_enabled: true
    // numbers
    // total_population: null
    // gni_per_capita: null
    // life_expectancy: null
    // health_expenditure: null
    // phases
    // leadership_and_governance: null
    // strategy_and_investment: null
    // legislation_policy_compliance: null
    // workforce: null
    // standards_and_interoperability: null
    // infrastructure: null
    // services_and_applications: null
  },
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";

  .matrix-layout {
    &.pb-0 {
      padding-bottom: 0px!important;
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
        padding-bottom: 0px!important;
      }
      &.pt-20 {
        padding-top: 20px!important;
      }
    }
    .fill{
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
      }
      h1, h3, h2 {
        color: @colorTextPrimary;
        margin: 0 0 20px;
      }
    }
  }
</style>
