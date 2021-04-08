<template>
  <div>
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
  computed: {
    ...mapGetters({
      getInteroperabilityLinks: 'projects/getInteroperabilityLinks',
      getStandards: 'projects/getInteroperabilityStandards'
    }),
    interoperability () {
      return this.handleInteroperability(this.project.interoperability_links)
    },
    standards () {
      return getList(this.project.interoperability_standards, this.getStandards)
    },
    fields () {
      if (!isEmpty(this.project)) {
        return [
          {
            id: 1,
            prepend: 25,
            header: this.$gettext(
              'What other system do you interoperate with ?'
            ),
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
      return []
    }
  },
  methods: {
    handleInteroperability (links) {
      return Object.values(links)
        .filter(il => !!(il.selected && il.link))
        .map((il, i) => ({
          ...il,
          id: this.getInteroperabilityLinks[il.index || i]?.id,
          label: `${this.getInteroperabilityLinks[il.index || i]?.pre} ${
            this.getInteroperabilityLinks[il.index || i]?.name
          }`
        }))
    }
  }
}
</script>
