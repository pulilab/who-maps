<template>
  <el-popover
    v-model="chooserOpen"
    :title="$gettext('GO TO COUNTRY PAGE') | translate"
    placement="top-end"
    width="220"
    trigger="click"
    popper-class="CustomPopover OffsetTop"
  >
    <el-button
      slot="reference"
      type="text"
      size="small"
      class="IconLeft"
    >
      <div class="CountryHolder">
        <img
          :src="countryFlag"
          alt="country flag"
          class="CountryFlag"
        >
        <div class="CountryName">
          {{ landingData.name }}
          <fa icon="caret-down"/>
        </div>
      </div>
    </el-button>

    <div class="Search-container">
      <el-input
        size="small"
        placeholder="Search country"
        v-model="search"
      >
        <i slot="prefix" class="el-input__icon ">
          <fa icon="search" />
        </i>
      </el-input>
    </div>

    <div class="Scroll-list" :style="`height: ${displayListHeight}px`" v-if="chooserOpen">
      <el-scrollbar :native="false" :noresize="false" :key="filteredCountries.length">
        <div class="List-container CustomPopoverList">
          <ul>
            <li v-for="country in filteredCountries"
                :key="country.code"
                @click="selectCountry(country)"
            >
              <img
                :src="getCountryFlag(country.code)"
                alt="country flag"
                class="CountryInnerFlag"
              >
              {{ country.name }}
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      search: '',
      chooserOpen: false
    };
  },
  computed: {
    ...mapGetters({
      landingData: 'landing/getLandingPageData',
      countries: 'countries/getCountries'
    }),
    countryFlag () {
      if (this.landingData) {
        return `/static/flags/${this.landingData.code.toLowerCase()}.png`;
      }
      return null;
    },
    filteredCountries () {
      return this.countries.filter(country => {
        return country.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      });
    },
    displayListHeight () {
      if (this.filteredCountries.length > 9) {
        return 306;
      }
      return this.filteredCountries.length * 34;
    }
  },
  methods: {
    getCountryFlag (code) {
      return `/static/flags/${code.toLowerCase()}.png`;
    },
    selectCountry (country) {
      this.chooserOpen = false;
      const localised = this.localePath({ name: 'organisation', params: { organisation: country.code.toLowerCase() } });
      this.$router.push(localised);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CustomPopover {
    top: 15px !important;
    .el-popover__title {
      padding: 8px 16px !important;
    }
  }
  .CountryHolder {
    display: flex;
    height: 24px;

    .CountryFlag {
      height: 14px;
      margin-right: 6px;
      padding: 5px 0;
    }
    .CountryName {
      font-size: @fontSizeBase;
      color: @colorBrandPrimary;
      font-weight: 700;
      line-height: 24px;
    }
  }

  .Scroll-list {
    overflow: hidden;
    .List-container {
      max-height: 299px;

      .CountryInnerFlag {
        width: 23px;
        height: 16px;
        margin-right: 6px;
        vertical-align: middle;
      }
    }
    .CustomPopoverList ul li {
      height: 34px !important;
      line-height: 34px !important;
      padding: 0 15px 0 15px !important;
      &:hover {
        background-color: @colorGrayLightest !important;
      }
    }
  }
  .Search-container {
    padding: 15px;
    svg {
      margin-left: 5px;
      color: @colorTextPrimary;
    }
  }
</style>
