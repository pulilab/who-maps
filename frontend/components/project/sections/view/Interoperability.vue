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
import { isEmpty, orderBy } from 'lodash'
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
      interoperability: [],
      standards: []
    }
  },
  computed: {
    ...mapGetters({
      getInteroperabilityLinks: 'projects/getInteroperabilityLinks',
      getStandards: 'projects/getInteroperabilityStandards'
    }),
    fields () {
      if (!isEmpty(this.project)) {
        const {
          interoperability_links,
          interoperability_standards
        } = this.project
        console.log(interoperability_links)
        this.interoperability = this.handleInteroperability(
          interoperability_links
        )
        this.standards = getList(interoperability_standards, this.getStandards)
        this.loading = false
        return this.handleFields()
      } else {
        this.loading = true
        return []
      }
    }
  },
  methods: {
    handleInteroperability (links) {
      let result = []
      for (const [key, value] of Object.entries(links)) {
        console.log(key)
        if (value.selected && value.link) {
          result = [
            ...result,
            {
              ...value,
              id: this.getInteroperabilityLinks[value.index]?.id,
              label: `${this.getInteroperabilityLinks[value.index]?.pre} ${
                this.getInteroperabilityLinks[value.index]?.name
              }`
            }
          ]
        }
      }
      return orderBy(result, ['index'], ['asc'])
    },
    handleFields () {
      return [
        {
          id: 1,
          prepend: 25,
          header: this.$gettext('What other system do you interoperate with ?'),
          interoperability: true,
          content: this.interoperability
        },
        {
          id: 2,
          prepend: 26,
          header: this.$gettext(
            'What data standards does your digital health project use?'
          ),
          content: this.standards
        }
      ]
    }
  }
}
</script>
