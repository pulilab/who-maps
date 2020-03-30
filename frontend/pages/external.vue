<template>
  <div class="LandingPage">
    <div class="MapBoxContainer">
      <landing-map />
      <country-projects-box />
    </div>
  </div>
</template>

<script>

import LandingMap from '@/components/landing/LandingMap.vue';
import CountryProjectsBox from '@/components/landing/CountryProjectsBox';

import { mapGetters } from 'vuex';

export default {
  layout: 'empty',
  components: {
    LandingMap,
    CountryProjectsBox
  },
  computed: {
    ...mapGetters({
      landingData: 'landing/getLandingPageData'
    })
  },
  async fetch ({ store, params }) {
    await Promise.all([
      store.dispatch('system/loadStaticData'),
      store.dispatch('system/loadDonors'),
      store.dispatch('countries/loadMapData'),
      store.dispatch('landing/search')
    ]);
    store.dispatch('landing/clearCustomLandingPage');
    // store.dispatch('landing/resetSearch');
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .LandingPage {
    .MapBoxContainer {
      position: relative;
    }

    h2 {
      font-size: @fontSizeHeading;
    }

    h3 {
      font-size: @fontSizeTitle;
    }

    h4 {
      font-size: @fontSizeLarge;
    }

    h6 {
      font-size: @fontSizeMedium;
      line-height: 24px;
      font-weight: 400;
    }
  }
</style>
