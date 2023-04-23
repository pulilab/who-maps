<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
// NOTE: This is only a router view wrapper, for common fetches
import { mapGetters } from 'vuex'

export default {
  components: {},
  beforeRouteUpdate (to, from, next) {
    if (to.params.organisation.length > 2) {
      this.$store.dispatch('landing/setSelectedCountry')
    }
    next()
  },
  middleware: ['profile'],
  async fetch ({ store, params }) {
    await store.dispatch('system/loadDonors')
    await Promise.all([
      store.dispatch('system/loadStaticData'),
      store.dispatch('countries/loadMapData'),
      store.dispatch(
        'landing/search',
        params.organisation === '-' ? undefined : params.organisation
      )
    ])
    if (params.organisation !== '-') {
      await store.dispatch('landing/loadCustomLandingPage', params.organisation)
    } else {
      store.dispatch('landing/clearCustomLandingPage')
    }
    if (store.getters['user/getProfile']) {
      await Promise.all([
        store.dispatch('projects/loadUserProjects'),
        store.dispatch('system/loadOrganisations'),
        store.dispatch('system/loadUserProfiles')
      ])
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile'
    }),
    authUser() {
      return this.$auth.$state.user
    }
  },
  watch: {
    authUser: {
      immediate: true,
      handler(profile) {
        this.$store.commit('user/SET_PROFILE', profile)
      }
    },
    userProfile: {
      immediate: true,
      handler (profile) {
        if (this.$sentry) {
          this.$sentry.configureScope(scope => {
            scope.setUser(profile)
          })
        }
      }
    }
  }
}
</script>

<style lang="sass"></style>
