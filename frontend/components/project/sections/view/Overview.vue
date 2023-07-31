<template>
  <div v-loading="loading">
    <view-field
      v-for="field in fields"
      :key="field.id"
      v-bind="field"
    />
  </div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { mapGetters } from 'vuex'
import isEmpty from 'lodash/isEmpty'
import { getList } from '@/utilities/projects'

import ViewField from '@/components/project/wrappers/ViewField'

export default {
  components: {
    ViewField
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      donors: [],
      organisation: {},
      country: {},
      members: [],
      viewers: []
    }
  },
  computed: {
    ...mapGetters({
      getOrganisationDetails: 'system/getOrganisationDetails',
      getCountryDetails: 'countries/getCountryDetails',
      getProfiles: 'system/getUserProfilesNoFilter',
      getDonors: 'system/getDonors'
    }),
    fields () {
      if (!isEmpty(this.project)) {
        const { donors, organisation, country, team, viewers } = this.project
        this.organisation = this.handleDetails(
          organisation,
          'getOrganisationDetails'
        )
        this.donors = getList(donors, this.getDonors)
        this.country = this.handleDetails(country, 'getCountryDetails')
        this.members = getList(team, this.getProfiles)
        this.viewers = getList(viewers, this.getProfiles)
        this.loading = false
        return this.handleFields()
      } else {
        this.loading = true
        return []
      }
    }
  },

  methods: {
    handleDetails (id, method) {
      if (id) {
        return this[method](parseInt(id, 10))
      }
      return {}
    },
    handleCheckKey (obj, key) {
      return obj && obj[key] ? obj[key] : ''
    },
    handleFields () {
      return [
        {
          id: 1,
          prepend: 1,
          header: this.$gettext('Project Name'),
          content: this.handleCheckKey(this.project, 'name')
        },
        {
          id: 2,
          prepend: 2,
          header: this.$gettext('Investment partner(s)'),
          content: this.donors
        },
        {
          id: 3,
          prepend: 3,
          header: this.$gettext('Implementing partner(s)'),
          content: this.project.implementing_partners
        },
        {
          id: 4,
          prepend: 4,
          header: this.$gettext('Organisation'),
          content: this.handleCheckKey(this.organisation, 'name')
        },
        {
          id: 5,
          prepend: 5,
          header: this.$gettext('Project country'),
          content: this.handleCheckKey(this.country, 'name')
        },
        {
          id: 6,
          prepend: 6,
          header: this.$gettext('Geographic scope'),
          content: this.project.geographic_scope
        },
        {
          id: 7,
          prepend: 7,
          header: this.$gettext(
            'Overview of the digital health implementation'
          ),
          content: this.project.implementation_overview
        },
        {
          layout: true,
          rows: [
            {
              id: 100,
              cols: [
                {
                  id: 8,
                  prepend: 8,
                  header: this.$gettext('Contact name'),
                  content: this.project.contact_name,
                  needAuth: true,
                  span: 11
                },
                {
                  id: 9,
                  prepend: 9,
                  header: this.$gettext('Contact email'),
                  content: this.project.contact_email,
                  needAuth: true,
                  span: 13
                }
              ]
            }
          ]
        },
        {
          id: 10,
          prepend: 10,
          header: this.$gettext('Team members'),
          content: this.members,
          needAuth: true,
        },
        {
          id: 11,
          prepend: 11,
          header: this.$gettext('Viewers'),
          content: this.viewers,
          needAuth: true,
        }
      ]
    }
  }
}
</script>
