<template>
  <div>
    <slot
      :errors="errors"
      :valid="valid"
      :data="data"
      :original="original"
      :handleValidation="handleValidation"
      :rowSave="save"
      :scrollToError="scrollToError"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { projectFields } from '@/utilities/projects'
import { apiWriteParser } from '@/utilities/api'

export default {
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    customFieldsLib: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      errors: []
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile',
      dhi: 'projects/getDigitalHealthInterventions',
      team: 'project/getTeam',
      viewers: 'project/getViewers',
      rawImport: 'admin/import/getRawImport'
    }),
    firstDHI () {
      if (this.dhi && this.dhi[0].subGroups[0] && this.dhi[0].subGroups[0].strategies) {
        return this.dhi[0].subGroups[0].strategies[0].id
      }
      return null
    },
    valid () {
      return this.errors.length === 0
    },
    data () {
      if (this.row && this.row.data) {
        return this.row.data
      }
      return {}
    },
    original () {
      if (this.row && this.row.original_data) {
        return this.row.original_data
      }
      return {}
    }
  },
  methods: {
    ...mapActions({
      setTeam: 'project/setTeam',
      setViewers: 'project/setViewers',
      saveTeamViewers: 'project/saveTeamViewers'
    }),
    handleValidation (valid, msg, field) {
      if (valid) {
        this.errors = this.errors.filter(e => e.field !== field)
      } else {
        this.errors.push({
          field,
          msg
        })
      }
    },
    scrollToError () {
      if (!this.valid) {
        const container = window.document.querySelector('.ExportDataTable .Container')
        const header = container.querySelector('.Headers')
        const elm = this.$el.querySelector('.ValidationError, .ParsingError')
        elm.scrollIntoView(true)
        if (container.scrollTop) {
          container.scroll(container.scrollLeft, container.scrollTop - header.clientHeight)
        }
      }
    },
    async save (country, donor, publish, rowid) {
      const filled = this.$children.filter(sc => sc.column && !['custom_fields', 'sub_level'].includes(sc.column))

      const countryCustom = this.$children.filter(sc => sc.type && sc.type.startsWith('MOH')).map(c => ({
        question_id: this.customFieldsLib[c.type].id,
        answer: c.apiValue()
      })).filter(a => a.answer)

      const donorCustom = this.$children.filter(sc => sc.type && sc.type.startsWith('INV')).map(c => ({
        donor_id: donor,
        question_id: this.customFieldsLib[c.type].id,
        answer: c.apiValue()
      })).filter(a => a.answer)

      const result = filled.reduce((a, c) => {
        a[c.column] = c.apiValue()
        return a
      }, projectFields())
      const subLevel = this.$children.find(sc => sc.column === 'sub_level')
      const sublLevelValue = subLevel ? subLevel.apiValue() : null
      if (sublLevelValue && sublLevelValue.toLowerCase() === 'national level') {
        result.national_level_deployment = {
          clients: +result.clients || result.national_level_deployment.clients,
          facilities: +result.facilities || result.national_level_deployment.facilities,
          health_workers: +result.health_workers || result.national_level_deployment.health_workers
        }
      } else if (sublLevelValue) {
        result.coverage.push(sublLevelValue)
        result.coverageData = {
          [sublLevelValue]: {
            clients: +result.clients || result.national_level_deployment.clients,
            facilities: +result.facilities || result.national_level_deployment.facilities,
            health_workers: +result.health_workers || result.national_level_deployment.health_workers
          }
        }
      }
      result.dhis = result.digitalHealthInterventions
      result.country = country
      if (filled.some(c => c.column === 'organisation') && !result.organisation) {
        const orgCell = filled.find(c => c.column === 'organisation')
        result.organisation = orgCell.value
      }
      const parsed = apiWriteParser(result, countryCustom, donorCustom)
      parsed.project.import_row = rowid
      const { data } = await this.$axios.post(`api/projects/draft/${country}/`, parsed)

      if (publish) {
        await this.$axios.put(`api/projects/publish/${data.id}/${country}/`, parsed)
      }
      const dataRow = this.row
      dataRow.project = data.id

      // setting teams and viewers and saving it
      // do not add current user, as that is done in the backend and it would overwrite with nothing
      if (result.implementing_team.length === 1 && result.implementing_team[0] === '') {
        result.implementing_team.length = 0
      }
      if (result.implementing_viewers.length === 1 && result.implementing_viewers[0] === '') {
        result.implementing_viewers.length = 0
      }
      if (result.implementing_team.length > 0 || result.implementing_viewers.length > 0) {
        if (this.rawImport.collection && this.rawImport.collection?.add_me_as_editor) {
          result.implementing_team.push(this.userProfile.id)
        }
      } else if (!this.rawImport.collection) {
        result.implementing_team.push(this.userProfile.id)
      }

      if (result.implementing_team.length > 0 || result.implementing_viewers.length > 0) {
        this.setTeam([...result.implementing_team])
        this.setViewers([...result.implementing_viewers])
        await this.saveTeamViewers(data.id)
      }
      this.$emit('update:row', dataRow)
      return dataRow
    }
  }
}
</script>

<style>

</style>
