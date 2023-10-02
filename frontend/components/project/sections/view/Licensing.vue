<template>
  <div v-loading="loading">
    <ViewField
      v-for="field in fields"
      :key="field.id"
      v-bind="field"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'
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
      osiLicenses: [],
      licenseChoices: [
        this.$gettext('Yes'),
        this.$gettext('Yes - With restrictions'),
        this.$gettext('No'),
      ],
      licenseChoicesAlternative: [
        this.$gettext('Yes'),
        this.$gettext('Partially'),
        this.$gettext('No'),
      ],
    }
  },
  computed: {
    ...mapGetters({
      getOsiLicenses: 'projects/getOsiLicenses',
    }),
    fields () {
      if (!isEmpty(this.project)) {
        const { osi_licenses } = this.project
        this.osiLicenses = getList(osi_licenses, this.getOsiLicenses)
        this.loading = false
        return this.handleFields()
      } else {
        this.loading = true
        return []
      }
    },
  },
  methods: {
    handleFields () {
      return [
        {
          id: 1,
          prepend: '21a',
          header: this.$gettext('Does the solution come at zero cost to users?'),
          content: this.licenseChoices[this.project.zero_cost-1]
        },
        {
          id: 2,
          prepend: '21b',
          header: this.$gettext('Is it allowed to replicate and redistribute the solution with others at no cost?'),
          content: this.licenseChoicesAlternative[this.project.codebase_accessible-1]
        },
        {
          id: 3,
          prepend: '21c',
          header: this.$gettext("Can a third party customize the solution's codebase to meet specific requirements and preferences?"),
          content: this.licenseChoices[this.project.is_customizable-1]
        },
        {
          id: 4,
          prepend: '21d',
          header: this.$gettext('Is it allowed to replicate and redistribute the solution with others at no cost?'),
          content: this.licenseChoices[this.project.free_replication-1]
        },
        {
          id: 5,
          prepend: '21e',
          header: this.$gettext('OSI Approved License(s)'),
          content: this.osiLicenses
        },
      ]
    }
  }
}
</script>
