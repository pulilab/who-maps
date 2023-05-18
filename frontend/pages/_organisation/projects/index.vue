<template>
  <div class="pb-80">
    <UserProjectsTabs
      :active-tab="activeTab"
      :counters="counters"
      @change="changeActiveTab"
    >
      <UserProjectsList :project-list="displayedProjectList" :is-archive="activeTab === 1" />
    </UserProjectsTabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import UserProjectsList from '@/components/common/UserProjectsList'
import UserProjectsTabs from '@/components/common/UserProjectsTabs'

export default {
  name: 'Projects',
  components: {
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
        archive: this.userProfile.archive.length
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
.pb-80 {
  padding-bottom: 80px;
}
</style>