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
      class="IconLeft ChooserButton"
    >
      <div class="CountryHolder">
        <img
          v-if="countryFlag"
          :src="countryFlag"
          alt="country flag"
          class="CountryFlag"
        >
        <fa
          v-else
          size="lg"
          class="AllIcon CountryFlag"
          icon="globe"
        />
        <div class="CountryName">
          <template v-if="landingData">
            {{ landingData.name }}
          </template>
          <translate v-else>
            All countries
          </translate>
          <fa icon="caret-down" />
        </div>
      </div>
    </el-button>

    <div class="Search-container">
      <el-input
        v-model="search"
        size="small"
        placeholder="Search country"
      >
        <i
          slot="prefix"
          class="el-input__icon "
        >
          <fa icon="search" />
        </i>
      </el-input>
    </div>

    <div
      v-if="chooserOpen"
      class="Scroll-list"
      :style="`height: ${displayListHeight}px`"
    >
      <el-scrollbar
        :key="filteredCountries.length"
        :native="false"
        :noresize="false"
      >
        <div class="List-container CustomPopoverList">
          <ul>
            <li
              :class="{Active: active()}"
              @click="selectCountry()"
            >
              <fa
                size="lg"
                class="AllIcon"
                icon="globe"
              />
              <translate>All countries</translate>
              <fa
                icon="check"
                class="check"
              />
            </li>
            <li
              v-for="country in filteredCountries"
              :key="country.code"
              :class="{Active: active(country.code)}"
              @click="selectCountry(country)"
            >
              <img
                :src="getCountryFlag(country.code)"
                alt="country flag"
                class="CountryInnerFlag"
              >
              {{ country.name }}
              <fa
                icon="check"
                class="check"
              />
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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
      return false;
    },
    filteredCountries () {
      return this.countries.filter(country => {
        return country.id !== process.env.GlobalCountryID && country.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      });
    },
    displayListHeight () {
      if (this.filteredCountries.length > 9) {
        return 306;
      }
      return (this.filteredCountries.length + 1) * 34;
    }
  },
  methods: {
    ...mapActions({
      setProjectBoxActiveGlobalTab: 'landing/setProjectBoxActiveGlobalTab'
    }),
    getCountryFlag (code) {
      return `/static/flags/${code.toLowerCase()}.png`;
    },
    selectCountry (country) {
      this.chooserOpen = false;
      this.setProjectBoxActiveGlobalTab(false);
      const organisation = country ? country.code.toLowerCase() : '-';
      const localised = this.localePath({ name: 'organisation', params: { organisation } });
      this.$router.push(localised);
    },
    active (code) {
      if (!this.landingData) {
        return !code;
      }
      return code === this.landingData.code;
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .AllIcon {
    margin-right: 8px;
    margin-left: 2px;
  }
  .ChooserButton {
    padding: 0 !important;
  }
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
      height: 16px;
      margin-right: 6px;
      padding: 3px 0;
      &[src~="/who-logo-small.svg"] {
        height: 20px;
        padding: 2px 0 0 0;
      }
    }
    .CountryName {
      font-size: @fontSizeBase;
      color: @colorBrandPrimary;
      font-weight: 700;
      line-height: 24px;
      text-overflow: ellipsis;
      max-width: 240px;
      overflow: hidden;
    }
  }

  .Scroll-list {
    overflow: hidden;
    .List-container {
      max-height: 299px;

      li:first-child .CountryInnerFlag {
        height: auto;
      }

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
        .check {
          display: none;
        }
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
