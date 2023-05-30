<template>
  <div class="Project">
    <project-bar :key="barKey" />
    <nuxt-child />
  </div>
</template>

<script>
import ProjectBar from '@/components/common/ProjectBar'
import { mapGetters } from 'vuex'

const routes = {
  'organisation-projects-id': 'view',
  'organisation-projects-id-edit': 'edit',
  'organisation-projects-id-published': 'published',
  'organisation-projects-id-stages': 'stages',
  'organisation-projects-id-assessment': 'assessment',
  'organisation-projects-id-toolkit': 'toolkit',
  'organisation-projects-id-toolkit-scorecard': 'scorecard'
}

export default {
  components: {
    ProjectBar
  },
  data () {
    return {
      barKey: 0
    }
  },
  computed: {
    ...mapGetters({
      getProjectDetails: 'projects/getUserProjectDetails',
      profile: 'user/getProfile'
    }),
    currentProject () {
      this.forceBarRerender()
      return this.getProjectDetails(+this.$route.params.id)
    },
    route () {
      return routes[this.$route.name.split('__')[0]]
    }
  },
  watch: {
    currentProject: {
      immediate: true,
      handler(project) {
        if ((!project.draft || !project.draft.name) && this.profile && !this.profile.is_superuser && this.route !== 'published') {
          this.$alert(this.$gettext('You are not authorized to access this view'), this.$gettext('Warning'), {
            confirmButtonText: 'OK',
            callback: () => {
              const path = this.localePath({ name: 'organisation-projects-id-published', params: this.$route.params })
              this.$router.replace(path)
            }
          })
        }
      }
    }
  },
  methods: {
    forceBarRerender () {
      this.barKey += 1
    }
  }
}
</script>

<style>

</style>
