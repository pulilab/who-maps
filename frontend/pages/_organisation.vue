<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
// NOTE: This is only a router view wrapper, for common fetches
import { mapGetters } from 'vuex'

export default {
  name: 'Organisation',
  beforeRouteUpdate (to, from, next) {
    if (to.params.organisation.length > 2) {
      this.$store.dispatch('landing/setSelectedCountry')
    }
    next()
  },
  middleware: ['profile'],
  async fetch ({ store, params }) {
    await Promise.all([
      store.dispatch('system/loadUserProfiles'),
      store.dispatch('system/loadDonors'),
      store.dispatch('system/loadOrganisations'),
      store.dispatch('system/loadCountries'),
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
    if (this.userProfile) {
      await store.dispatch('projects/loadUserProjects')
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
