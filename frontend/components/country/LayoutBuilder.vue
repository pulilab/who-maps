<template>
<div>
    <!-- default -->
    <default>
      <template v-slot:description>
        <default-text />
      </template>
      <template v-slot:image>
        <bg-image :url="default1" />
      </template>
    </default>

    <!-- description (only) -->
    <default :gutter="20">
      <template v-slot:description>
        <custom-description />
      </template>
      <template v-slot:image>
        <bg-image :url="default2" />
      </template>
    </default>

    <default inverse>
      <template v-slot:description>
        <default-text />
      </template>
      <template v-slot:image>
        <bg-image :url="default1" />
      </template>
    </default>

    <!-- image (only) -->
    <default inverse :cols="[10, 14]" :gutter="20">
      <template v-slot:description>
        <default-text-vertical />
      </template>
      <template v-slot:image>
        <bg-image :url="doctor" />
      </template>
    </default>

    <!-- image, description (only) -->
    <!-- image, description, stats (complete or partial) (only) -->
    <!-- image, description, documents (only) -->
    <two-columns>
      <template v-slot:top>
        <custom-description />
      </template>
      <template v-slot:bottom>
        <bg-image :url="doctor" />
      </template>
      <template v-slot:aside>
        <default-vertical :url="default1" />
      </template>
    </two-columns>

    <!-- description, image, stats (complete or partial), documents -->
    <!-- description, stats (complete or partial), documents -->
    <!-- image, stats (complete or partial), documents -->
    <!-- stats (complete or partial), documents -->
    <three-columns>
      <template v-slot:lefttop>
        <div class="grid-content">
          <custom-description />
        </div>
      </template>
      <template v-slot:leftbottom>
        <bg-image :url="doctor" />
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
        <div class="grid-content">
          <default-text-vertical />
        </div>
      </template>
      <template v-slot:middle>
        <div class="grid-content"></div>
      </template>
      <template v-slot:right>
        <div class="grid-content"></div>
      </template>
    </three-columns>



    <!-- stats (complete or partial) -->
    <!-- documents -->
    <el-row :gutter="20" type="flex" class="matrix-layout">
    <el-col :span="16">
      <el-row>
        <el-col :span="24" class="mb"><div class="grid-content"></div></el-col>
        <el-col :span="24"><div class="grid-content"></div></el-col>
      </el-row>
    </el-col>
    <el-col :span="8">
      <div class="grid-content">
      </div>
    </el-col>
    </el-row>
</div>
</template>

<script>
import Default from '@/components/country/layouts/Default';
import TwoColumns from '@/components/country/layouts/TwoColumns';
import ThreeColumns from '@/components/country/layouts/ThreeColumns';

import DefaultText from '@/components/country/commons/DefaultText';
import BgImage from '@/components/country/commons/BgImage';
import CustomDescription from '@/components/country/commons/CustomDescription';
import DefaultTextVertical from '@/components/country/commons/DefaultTextVertical';
import DefaultVertical from '@/components/country/commons/DefaultVertical';
// import { mapGetters } from 'vuex';

// images
import default1 from '~/assets/img/default/whyusedha-new.jpg';
import default2 from '~/assets/img/default/coverimage-default.jpg';
import doctor from '~/assets/img/default/coverimage-sample.jpg';

export default {
  components: {
    Default,
    TwoColumns,
    ThreeColumns,
    DefaultVertical,
    DefaultText,
    BgImage,
    CustomDescription,
    DefaultTextVertical
  },
  data() {
    return {
      default1,
      default2,
      doctor
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
