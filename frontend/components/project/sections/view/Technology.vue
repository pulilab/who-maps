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
import { isEmpty } from 'lodash'
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
    }
  },
  computed: {
    fields () {
      if (!isEmpty(this.project)) {
        this.loading = false
        return this.handleFields()
      } else {
        this.loading = true
        return []
      }
    }
  },
  methods: {
    handleFields () {
      return [
        {
          id: 1,
          prepend: 22,
          header: this.$gettext('Code documentation or download link'),
          content: this.project.repository,
          link: true
        },
        {
          id: 2,
          prepend: 23,
          header: this.$gettext('Link to the application'),
          content: this.project.mobile_application,
          link: true
        },
        {
          id: 3,
          prepend: 24,
          header: this.$gettext('Link to wiki or project website'),
          content: this.project.wiki,
          link: true
        }
      ]
    }
  }
}
</script>
