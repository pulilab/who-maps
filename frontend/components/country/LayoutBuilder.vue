<template>
<div>
    <!-- default -->
    <default>
      <template v-slot:left>
        <w-default />
      </template>
      <template v-slot:right>
        <w-image :url="default1" />
      </template>
    </default>

    <!-- description (only) -->
    <default :gutter="20" classes="pb-0">
      <template v-slot:left>
        <w-description />
      </template>
      <template v-slot:right>
        <w-image :url="default2" />
      </template>
    </default>

    <default inverse classes="pt-20">
      <template v-slot:left>
        <w-default />
      </template>
      <template v-slot:right>
        <w-image :url="default1" />
      </template>
    </default>

    <!-- image (only) -->
    <default inverse :cols="[10, 14]" :gutter="20">
      <template v-slot:left>
        <w-default vertical />
      </template>
      <template v-slot:right>
        <w-image :url="doctor" />
      </template>
    </default>

    <!-- image, description (only) -->
    <!-- image, description, stats (complete or partial) (only) -->
    <!-- image, description, documents (only) -->
    <default :gutter="20">
      <template v-slot:lefttop>
        <w-description />
      </template>
      <template v-slot:leftbottom>
        <w-image :url="doctor" />
      </template>
      <template v-slot:right>
        <w-default vertical :url="default1" />
      </template>
    </default>

    <!-- description, image, stats (complete or partial), documents -->
    <!-- description, stats (complete or partial), documents -->
    <!-- image, stats (complete or partial), documents -->
    <!-- stats (complete or partial), documents -->
    <three-columns>
      <template v-slot:lefttop>
        <w-description />
      </template>
      <template v-slot:leftbottom>
        <w-image :url="doctor" />
      </template>
      <template v-slot:middle>
        <div class="grid-content"></div>
      </template>
      <template v-slot:right>
        <div class="grid-content"></div>
      </template>
    </three-columns>

    <three-columns>
      <template v-slot:lefttop>
        <img :src="doctor" />
      </template>
      <template v-slot:leftbottom>
        <w-default vertical />
      </template>
      <template v-slot:middle>
        <div class="grid-content"></div>
      </template>
      <template v-slot:right>
        <div class="grid-content"></div>
      </template>
    </three-columns>

    <three-columns>
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

    <!-- stats (complete or partial) -->
    <!-- documents -->
    <default :gutter="20">
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
import doctor from '~/assets/img/default/coverimage-sample.jpg';

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
  data() {
    return {
      default1,
      default2,
      doctor,
      documents: [
        { id: 1, title: 'document 1'},
        { id: 2, title: 'document 2'}
      ],
      stats: {
        groups: [
          {
            title: 'Context',
            metrics : [
              {
                measure: 'GNI PER CAPITA, ATLAS METHOD (CURRENT US$)',
                value: '0.49K'
              },
              {
                measure: 'TOTAL POPULATION',
                value: '7.4M'
              }
            ]
          },
                    {
            title: 'Health',
            metrics : [
              {
                measure: 'LIFE EXPECTANCY AT BIRTH (YEARS)',
                value: '51.41'
              },
              {
                measure: 'HEALTH EXPENDITURE (% OF GDP)',
                value: '11.1%'
              }
            ]
          }
        ]
      }
    }
  }
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
