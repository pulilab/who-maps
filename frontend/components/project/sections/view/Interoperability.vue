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
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'
import { getList, getNestedList } from '@/utilities/projects'

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
        const { interoperability_links, interoperability_standards } = this.project
        this.interoperability = this.handleInteroperability(interoperability_links)
        const standards = getNestedList(this.getStandards, 'standards')
        this.standards = getList(interoperability_standards, standards)
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
      return Object.keys(links)
        .filter(l => links[l].selected)
        .map(l => ({
          id: l,
          label: `${this.getInteroperabilityLinks[l]?.pre} ${this.getInteroperabilityLinks[l]?.name}`,
          link: links[l].link,
        }))
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
