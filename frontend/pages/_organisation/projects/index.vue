<template>
  <page-layout class="p-0 pb-80">
    <UserProjectsTabs
      :active-tab="activeTab"
      :counters="counters"
      @change="changeActiveTab"
      @search="loadProjects($event)"
    >
      <template #default="{ search }">
        <UserProjectsList
          :project-list="displayedProjectList"
          :list-type="activeTab"
          :hasSearch="search !== ''"
        />
      </template>
    </UserProjectsTabs>
  </page-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import UserProjectsList from '@/components/common/UserProjectsList'
import UserProjectsTabs from '@/components/common/UserProjectsTabs'

export default {
  name: 'Projects',
  components: {
    PageLayout,
    UserProjectsList,
    UserProjectsTabs
  },
  middleware: ['authGuard'],
  data() {
    return {
      activeTab: 0,
    }
  },
  async fetch() {
    this.activeTab = 0
    if (this.$route.query?.list === 'archive') this.activeTab = 1
    if (this.$route.query?.list === 'country-projects') this.activeTab = 2

    await this.getCounters()
    this.$store.dispatch('project/resetProjectState')
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile',
      userProjecList: 'projects/getUserProjectList',
      countryProjectList: 'projects/getCountryProjectList',
    }),
    isCountryAdmin () {
      if (!this.userProfile) return false
      return (['CA', 'SCA'].includes(this.userProfile.account_type) && this.userProfile.account_type_approved)
    },
    displayedProjectList() {
      return this.activeTab === 1
        ? this.userProfile.archive
        : this.activeTab === 0
          ? this.userProjecList
          : this.countryProjectList?.results || []
    },
    counters() {
      return {
        myprojects: this.userProjecList.length,
        countryProjects: this.countryProjectList?.count || 0,
        archive: this.userProfile?.archive ? this.userProfile.archive.length : 0
      }
    }
  },
  watch: {
    $route(to, from) {
      this.activeTab = 0
      if (to.query?.list === 'archive') this.activeTab = 1
      if (to.query?.list === 'country-projects') this.activeTab = 2
      this.loadProjects()
    }
  },
  methods: {
    ...mapActions({
      setLoadingProjects: 'projects/setLoadingProjects',
    }),
    changeActiveTab(tab) {
      this.activeTab = tab
    },
    async getCounters() {

      try {
        this.setLoadingProjects(true)
        const countersToCheck = [this.$store.dispatch('projects/loadUserProjects')]
        if (this.isCountryAdmin)
          countersToCheck.push(this.$store.dispatch('projects/loadCountryProjects'))

        await Promise.all(countersToCheck)
        this.setLoadingProjects(false)
      } catch (error) {
        this.setLoadingProjects(false)
        console.log("🚀 ~ file: index.vue:97 ~ getCounters ~ error:", error)
      }
    },
    async loadProjects(search = '') {
      if (this.activeTab === 0) await this.$store.dispatch('projects/loadUserProjects')
      if (this.activeTab === 2) await this.$store.dispatch('projects/loadCountryProjects')
    }
  }
}
</script>

<style>
.p-0 {
  padding: 0 !important;
}

.pb-80 {
  padding-bottom: 80px !important;
}
.country-tooltip {
  max-width: 380px;
}
</style>