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
/* eslint-disable vue/no-side-effects-in-computed-properties */
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
      software: [],
      dhis: [],
      hfaList: [],
      hfa: [],
      hscList: [],
      hsc: [],
      his: [],
      sapp: [],
      coverage: '',
      // sub level coverage
      coverageLevelName: {},
      coverageLevelFirst: [],
      coverageLevelSecond: [],
      // literals
      coverageList: [
        '',
        this.$gettext('Sub National'),
        this.$gettext('National')
      ],
      investedList: [
        this.$gettext('No, they have not yet contributed'),
        this.$gettext('Yes, they are contributing in-kind people or time'),
        this.$gettext('Yes, there is a financial contribution through MOH budget'),
        this.$gettext('Yes, MOH is fully funding the project')
      ]
    }
  },
  computed: {
    ...mapGetters({
      getCountry: 'countries/getCountryDetails',
      getSoftware: 'projects/getTechnologyPlatforms',
      getDhi: 'projects/getDigitalHealthInterventionDetails',
      getHfa: 'projects/getHealthFocusAreas',
      getHsc: 'projects/getHscChallenges',
      // getHscOther: 'project/getHscChallengesOther',
      getHis: 'projects/getHisBucket',
      applicationTypes: 'projects/getApplicationTypes',
      country: 'project/getCountry',
      getCountrySubLevelNames: 'countries/getCountrySubLevelNames',
      getCountryFirstSubLevel: 'countries/getCountryFirstSubLevel',
      getCountrySecondSubLevel: 'countries/getCountrySecondSubLevel'
    }),
    country () {
      if (this.project.country) {
        return this.getCountry(this.project.country)
      }
      return null
    },
    isGlobalSelected () {
      return this.country?.id === process.env.GlobalCountryID
    },
    isNationalLevelDeployment () {
      return (
        this.project.coverageType === 2 &&
        this.project.national_level_deployment &&
        (this.project.national_level_deployment.clients ||
          this.project.national_level_deployment.facilities ||
          this.project.national_level_deployment.health_workers)
      )
    },
    fields () {
      if (!isEmpty(this.project)) {
        const {
          software,
          dhis,
          health_focus_areas,
          hsc_challenges,
          his_bucket,
          services_and_application_types,
          coverageType,
          coverage,
          coverageData,
          coverageSecondLevel
        } = this.project

        this.hfaList = getNestedList(this.getHfa, 'health_focus_areas')
        this.hfa = getList(health_focus_areas, this.hfaList)
        this.software = getList(software, this.getSoftware)
        this.dhis = this.getDhiList(dhis),
        this.hscList = getNestedList(this.getHsc, 'challenges')
        this.hsc = getList(hsc_challenges, this.hscList, ['challenge'])
        this.his = getList(his_bucket, this.getHis)
        this.sapp = this.getSappList(services_and_application_types)
        this.coverage = this.isGlobalSelected
          ? this.$gettext('International')
          : this.coverageList[coverageType]

        // sub levels, if there's any
        this.coverageLevelName = this.getCountrySubLevelNames(this.country?.id)
        if (this.coverageLevelName.first) {
          this.coverageLevelFirst = this.handleRows(coverage, coverageData)
        }
        if (this.coverageLevelName.second) {
          this.coverageLevelSecond = this.handleRows(
            coverage,
            coverageSecondLevel
          )
        }

        this.loading = false
        return this.handleFields()
      } else {
        this.loading = true
        return []
      }
    }
  },
  methods: {
    getDhiList (dhis) {
      return dhis
        ? dhis
          .map(dhi => this.getDhi(dhi).name)
          .sort((a, b) => a.localeCompare(b))
        : []
    },
    getSappList (sapp) {
      let items = []
      this.applicationTypes.forEach(group => {
        const inGroup = group.services
          .filter(service => sapp.includes(service.id))
          // .map(s => s.name)
        if (inGroup.length > 0) items =[...items,...inGroup]
      })
      return items.sort((a, b) => a.name.localeCompare(b.name))
    },
    handleRows (coverage, data, country = this.country) {
      let rows = []
      if (!isEmpty(data) && data !== undefined) {
        for (const [key, value] of Object.entries(data)) {
          if (coverage.includes(key)) {
            rows = [
              ...rows,
              {
                id: key,
                name: country.districts.find(i => i.id === key)?.name,
                cols: [
                  {
                    id: 1,
                    header: this.$gettext('# Health Workers'),
                    content: value.health_workers,
                    span: 8
                  },
                  {
                    id: 2,
                    header: this.$gettext('# Facilities'),
                    content: value.facilities,
                    span: 8
                  },
                  {
                    id: 3,
                    header: this.$gettext('# Clients'),
                    content: value.clients,
                    span: 8
                  }
                ]
              }
            ]
          }
        }
      }
      return rows
    },
    handleFields () {
      return [
        {
          id: 1,
          prepend: 12,
          header: this.$gettext('Health focus area (s)'),
          content: this.hfa
        },
        {
          id: 2,
          prepend: '13a',
          header: this.$gettext('Health System Challenges (HSC)'),
          content: this.hsc
        },
        {
          id: 3,
          prepend: '13b',
          header: this.$gettext('Other Health System Challenges (HSC)'),
          content: this.project.hsc_challenges_other
        },
        {
          id: 4,
          prepend: '14a',
          header: this.$gettext('Software related to Digital Health Interventions (DHI)'),
          content: this.software,
          title: this.$gettext('Software'),
          subtitle: this.$gettext('Digital Health Intervention')
        },
        {
          id: 5,
          prepend: '14b',
          header: this.$gettext('Digital Health Interventions (DHI)'),
          content: this.dhis,
          title: this.$gettext('Software'),
          subtitle: this.$gettext('Digital Health Intervention')
        },
        {
          id: 6,
          prepend: 15,
          header: this.his.length > 0 ? this.$gettext('Health Information System (HIS)') : this.$gettext('Services and Application Types'),
          content: this.his.length > 0 ? this.his : this.sapp,
          sapp: this.his.length === 0
        },
        {
          id: 7,
          prepend: 16,
          show: !!(
            this.isNationalLevelDeployment ||
            (this.project.coverage && this.project.coverage.length)
          ),
          header: this.$gettext('Coverage type'),
          content: this.coverage
        },
        // national coverage
        {
          id: 8,
          show: !!this.isNationalLevelDeployment,
          header: this.isGlobalSelected
            ? this.$gettext('International Level Deployment')
            : this.$gettext('National Level Deployment'),
          icon: 'el-icon-s-flag',
          layout: true,
          rows: [
            {
              id: 101,
              cols: [
                {
                  id: 1,
                  header: this.$gettext('# Health Workers'),
                  content: this.project.national_level_deployment
                    ?.health_workers,
                  span: 8
                },
                {
                  id: 2,
                  header: this.$gettext('# Facilities'),
                  content: this.project.national_level_deployment?.facilities,
                  span: 8
                },
                {
                  id: 3,
                  header: this.$gettext('# Clients'),
                  content: this.project.national_level_deployment?.clients,
                  span: 8
                }
              ]
            }
          ]
        },
        {
          id: 9,
          show: !!(
            this.project.coverageType === 1 && this.coverageLevelName.first
          ),
          header: this.$gettext('{name} level deployment', {
            name: this.coverageLevelName.first
          }),
          icon: 'el-icon-location',
          layout: true,
          rows: this.coverageLevelFirst
        },
        {
          id: 10,
          show: !!(
            this.project.coverageType === 1 && this.coverageLevelName.second
          ),
          header: this.$gettext('{name} level deployment', {
            name: this.coverageLevelName.second
          }),
          icon: 'el-icon-location',
          layout: true,
          rows: this.coverageLevelSecond
        },
        // national coverage
        {
          id: 11,
          prepend: 17,
          header: this.$gettext(
            'Has the government financially invested in the project?'
          ),
          content: this.investedList[this.project.government_investor]
        }
      ]
    }
  }
}
</script>
