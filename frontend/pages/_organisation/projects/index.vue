<template>
  <page-layout class="p-0 pb-80">
    <UserProjectsTabs
      :active-tab="activeTab"
      :counters="counters"
      @change="changeActiveTab"
    >
      <UserProjectsList :project-list="displayedProjectList" :is-archive="activeTab === 1" />
    </UserProjectsTabs>
  </page-layout>
</template>

<script>
import { mapGetters } from 'vuex'

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
      activeTab: 0
    }
  },
  async asyncData({ store, route }) {
    await store.dispatch('projects/loadUserProjects')
    store.dispatch('project/resetProjectState')
    const activeTab = route.query?.list === 'archive' ? 1 : 0
    return {
      activeTab
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile',
      userProjecList: 'projects/getUserProjectList'
    }),
    displayedProjectList() {
      return this.activeTab === 0
        ? this.userProjecList
        : this.userProfile.archive.map(p => ({...p, archived: true }))
    },
    counters() {
      return {
        myprojects: this.userProjecList.length,
        archive: this.userProfile?.archive ? this.userProfile.archive.length : 0
      }
    }
  },
  methods: {
    changeActiveTab(tab) {
      this.activeTab = tab
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
</style>