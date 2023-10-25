<template>
  <div>
    <div class="tab-wrapper">
      <div class="tabs">
        <div @click="setActiveTab(0)" :class="getStyle(0)" key="my">
          <i class="el-icon-star-off"></i>
          <translate :parameters="{ count: counters.myprojects }">
            My projects ({count})
          </translate>
        </div>
        <div @click="setActiveTab(1)" :class="getStyle(1)" class="archived">
          <i class="el-icon-takeaway-box"></i>
          <translate :parameters="{ count: counters.archive }">
            My archived projects ({count})
          </translate>
        </div>
        <div v-if="isCountryAdmin" @click="setActiveTab(2)" :class="getStyle(2)" key="country">
          <fa icon="globe-americas" />
          <translate :parameters="{ count: total }">
            Country projects ({count})
          </translate>
        </div>
      </div>
    </div>
    <div class="info-wrapper">
      <div v-if="activeTab === 0" key="myprojects">
        <translate>Here are all of the projects you are a</translate>
        <fa icon="star" class="owner" />
        <b><translate>Member</translate></b>
        &nbsp;<translate>or</translate>
        <fa icon="eye" class="viewer" />
        <b><translate>Viewer</translate></b>
        &nbsp;<translate>of.</translate>
      </div>
      <translate tag="div" v-if="activeTab === 1 && counters.archive > 0" key="archived">
        Here are all your archived projects. You can restore individual projects by submitting a restore request.
      </translate>
      <div v-if="activeTab === 2" key="countryprojects" class="country-info">
        <el-input
          v-model="countrySearch"
          clearable
          :placeholder="$gettext('Type something...') | translate"
        >
          <fa slot="prepend" icon="search" />
        </el-input>
        <el-tooltip
          v-model="showTooltip"
          :content="$gettext(`Search your country's projects by project name, name of team member or e-mail address. You can change individual project's team members (co-editors).`) | translate"
          placement="right"
          popper-class="country-tooltip"
          effect="dark"
          manual
        >
          <el-icon class="el-icon-question help-icon" @click.native="showTooltip = !showTooltip" />
        </el-tooltip>
      </div>
    </div>
    <slot :search="countrySearch" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash/debounce'
const tabPrams = ['myprojects','archive','country-projects']

export default {
  props: {
    activeTab: {
      type: Number,
      default: 0
    },
    counters: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      showTooltip: false,
      countrySearch: ''
    }
  },
  computed: {
    ...mapGetters({
      total: 'projects/getTotal',
      userProfile: 'user/getProfile',
    }),
    isCountryAdmin () {
      if (!this.userProfile) return false
      return (['CA', 'SCA'].includes(this.userProfile.account_type) && this.userProfile.account_type_approved)
    },
  },
  watch: {
    activeTab(val) {
      if (process.client) {
        const list = tabPrams[val]
        this.$router.push({ ...this.$route, query: { list } })
      }
    },
    countrySearch() {
      this.emitSearch()
    }
  },
  methods: {
    ...mapActions({
      setSearch: 'projects/setSearch',
    }),
    getStyle(checkTab) {
      return checkTab === this.activeTab ? 'active' : ''
    },
    setActiveTab(tab) {
      this.$emit('change', tab)
    },
    emitSearch: debounce(function() {
      this.setSearch(this.countrySearch)
      this.$emit('search', this.countrySearch)
    }, 500)
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";
.owner {
  color: @colorOwner;
}
.viewer {
  color: @colorViewer;
}
.tab-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: white;
  .tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 36px;
    margin-top: 32px;
    div {
      cursor: pointer;
      display: flex;
      color: #777779;
      font-size: 14px;
      text-transform: uppercase;
      padding-bottom: 14px;
      padding-left: 8px;
      padding-right: 8px;
      border-bottom: 3px solid transparent;
      &.active {
        color: #404041;
        font-weight: bold;
        border-color: @colorBrandPrimary;
        svg, i {
          font-weight: bold;
        }
      }
      svg, i {
        margin: 0 10px 0 0;
        font-size: 16px;
      }
    }

  }
}
.info-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2em;
  .country-info {
    display: flex;
    align-items: center;
    gap: 0.8em;
    .help-icon {
      cursor: pointer;
      font-size: 1.4em;
      color: @colorGray;

      &:hover {
        color: lighten(@colorGray, 10%);
      }
    }
  }
}
</style>
