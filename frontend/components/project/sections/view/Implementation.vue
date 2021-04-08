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
      coverageList: [
        '',
        this.$gettext('Sub National'),
        this.$gettext('National')
      ],
      investedList: [
        this.$gettext('No, they have not yet contributed'),
        this.$gettext('Yes, they are contributing in-kind people or time'),
        this.$gettext(
          'Yes, there is a financial contribution through MOH budget'
        ),
        this.$gettext('Yes, MOH is fully funding the project')
      ]
    }
  },
  computed: {
    ...mapGetters({
      getCountry: 'countries/getCountryDetails',
      getPlatforms: 'projects/getTechnologyPlatforms',
      getDhi: 'projects/getDigitalHealthInterventionDetails',
      getHfa: 'projects/getHealthFocusAreas',
      getHsc: 'projects/getHscChallenges',
      getHis: 'projects/getHisBucket',
      getDonors: 'system/getDonors',
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
      return this.country.id === process.env.GlobalCountryID
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
    dhi () {
      const { platforms, digitalHealthInterventions } = this.project
      return this.handleDhiList(platforms, digitalHealthInterventions)
    },
    hfa () {
      const { health_focus_areas } = this.project
      return getList(
        health_focus_areas,
        getNestedList(this.getHfa, 'health_focus_areas')
      )
    },
    hsc () {
      const { hsc_challenges } = this.project
      return getList(
        hsc_challenges,
        getNestedList(this.getHsc, 'challenges'),
        'challenge'
      )
    },
    his () {
      const { his_bucket } = this.project
      return getList(his_bucket, this.getHis)
    },
    donors () {
      const { donors } = this.project
      return getList(donors, this.getDonors)
    },
    coverage () {
      const { coverageType } = this.project

      return this.isGlobalSelected
        ? this.$gettext('International')
        : this.coverageList[coverageType]
    },
    coverageLevelName () {
      return this.getCountrySubLevelNames(this.country.id)
    },
    coverageLevelFirst () {
      const { coverage, coverageData } = this.project
      if (this.coverageLevelName.first) {
        return this.handleRows(coverage, coverageData)
      }
      return []
    },
    coverageLevelSecond () {
      const { coverage, coverageSecondLevel } = this.project
      if (this.coverageLevelName.second) {
        return this.handleRows(coverage, coverageSecondLevel)
      }
      return []
    },
    fields () {
      if (!isEmpty(this.project)) {
        return [
          {
            id: 1,
            prepend: 10,
            header: this.$gettext(
              'Software and related Digital Health Interventions (DHI)'
            ),
            content: this.dhi,
            dhi: true,
            title: this.$gettext('Software'),
            subtitle: this.$gettext('Digital Health Intervention')
          },
          {
            id: 2,
            prepend: 11,
            header: this.$gettext('Health focus area (s)'),
            content: this.hfa
          },
          {
            id: 3,
            prepend: 12,
            header: this.$gettext('Health System Challenges (HSC)'),
            content: this.hsc
          },
          {
            id: 4,
            prepend: 13,
            header: this.$gettext('Health Information System (HIS)'),
            content: this.his
          },
          {
            id: 5,
            prepend: 14,
            show: !!(
              this.isNationalLevelDeployment ||
              (this.project.coverage && this.project.coverage.length)
            ),
            header: this.$gettext('Coverage type'),
            content: this.coverage
          },
          {
            id: 6,
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
            id: 7,
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
            id: 8,
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
          {
            id: 9,
            prepend: 15,
            header: this.$gettext(
              'Has the government financially invested in the project?'
            ),
            content: this.investedList[this.project.government_investor]
          },
          {
            id: 10,
            prepend: 16,
            header: this.$gettext('Implementing partner (s)'),
            content: this.project.implementing_partners
          },
          {
            id: 11,
            prepend: 17,
            header: this.$gettext('Investor (s)'),
            content: this.donors
          }
        ]
      }
      return []
    }
  },
  methods: {
    handleDhiList (platforms, interventions) {
      return platforms.map(platform => ({
        name: this.getPlatforms.find(p => p.id === platform).name,
        categories: interventions
          .filter(i => i.platform === platform)
          .map(i => this.getDhi(i.id))
      }))
    },
    handleRows (coverage, data, country = this.country) {
      let rows = []
      for (const [key, value] of Object.entries(data)) {
        if (coverage.includes(key)) {
          rows = [
            ...rows,
            {
              id: key,
              name: country.districts.find(i => i.id === key).name,
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
      return rows
    }
  }
}
</script>
