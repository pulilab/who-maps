<script>
import { mapGetters } from 'vuex'
import pickBy from 'lodash/pickBy'
import flattenDeep from 'lodash/flattenDeep'
import { format } from 'date-fns'

export default {
  props: {
    projects: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries',
      donors: 'system/getDonors',
      getHealthFocusAreas: 'projects/getHealthFocusAreas',
      dashboardType: 'dashboard/getDashboardType',
      countryColumns: 'dashboard/getCountryColumns',
      donorColumns: 'dashboard/getDonorColumns',
      regions: 'system/getRegions',
      stages: 'project/getStagesList',
      softwares: 'projects/getTechnologyPlatforms',
      hscChallenges: 'projects/getHscChallenges',
      hisBucket: 'projects/getHisBucket',
      licenses: 'projects/getLicenses',
      interoperabilityStandards: 'projects/getInteroperabilityStandards',
      organisations: 'system/getOrganisations',
      allStages: 'project/getStagesList'
    }),
    parsed () {
      if (!this.projects || !this.projects[0] || typeof this.projects !== 'object') {
        return null
      }
      return this.projects.map(s => {
        const parsed = {
          ...s,
          start_date: this.parseDate(s.start_date),
          end_date: this.parseDate(s.end_date),
          implementation_dates: this.parseDate(s.implementation_dates),
          country: this.parseSingleSelection(s.country, 'countries'),
          organisation: this.parseSingleSelection(s.organisation, 'organisations'),
          investors: this.parseFlatList(s.donors, 'donors'),
          implementing_partners: this.arrayToString(s.implementing_partners),
          implementing_team: this.arrayToString(s.implementing_team),
          implementing_viewers: this.arrayToString(s.implementing_viewers),
          health_focus_areas: this.parseHealthFocusAreas(s.health_focus_areas),
          hsc_challenges: this.parseHscChallenges(s.hsc_challenges),
          his_bucket: this.parseFlatList(s.hsc_challenges, 'hisBucket'),
          region: this.parseSingleSelection(s.region, 'regions'),
          stages: this.parseStages(s.stages),
          software: this.parsePlatforms(s.platforms),
          national_level_deployment: this.parseCoverageItem(s.national_level_deployment),
          coverage: this.parseCoverage(s.coverage),
          coverage_second_level: this.parseCoverage(s.coverage_second_level),
          government_investor: this.parseBoolean(s.government_investor),
          licenses: this.parseFlatList(s.licenses, 'licenses'),
          interoperability_standards: this.parseFlatList(s.interoperability_standards, 'interoperabilityStandards'),
          approved: this.parseBoolean(s.approved),
          point_of_contact: `${s.contact_name}, ${s.contact_email}`,
          donors: undefined,
          platforms: undefined
        }
        return pickBy(parsed, v => v !== undefined && v !== null)
      })
    },
    withLabels () {
      if (!this.parsed || !this.parsed[0] || typeof this.parsed !== 'object') {
        return null
      }
      return this.parsed.map(s => ({
        Name: s.name,
        Country: s.country,
        'Implementation Date': s.implementation_dates,
        'Start Date': s.start_date,
        'End Date': s.end_date,
        'Organisation Name': s.organisation,
        Donors: s.investors,
        'Implementing Partners': s.implementing_partners,
        'Implementing Team': s.implementing_team,
        'Implementing Viewers': s.implementing_viewers,
        'Point of Contact': s.point_of_contact,
        'Overview of digital health implementation': s.implementation_overview,
        'Geographical scope': s.geographic_scope,
        'Health Focus Areas': s.health_focus_areas,
        Software: s.software,
        Stages: s.stages,
        'Health System Challenges': s.hsc_challenges,
        'Health Information System Support': s.his_bucket,
        'Government Investor': s.government_investor,
        Licenses: s.licenses,
        Repository: s.repository,
        'Mobile Application': s.mobile_application,
        Wiki: s.wiki,
        'Interoperability Standards': s.interoperability_standards,
        'National Level Deployment': s.national_level_deployment,
        'First Level Coverage': s.coverage,
        'Second Level Coverage': s.coverage_second_level,
        Approved: s.approved,
        ...this.parseCustomQuestions(s.donor_answers, s.country_answers)
      }))
    }
  },
  methods: {
    safeReturn (action, defaultReturn = '') {
      try {
        return action()
      } catch (e) {
        console.warn(e)
        return defaultReturn
      }
    },
    parseDate (value) {
      return this.safeReturn(() => {
        return value ? format(new Date(value), 'DD/MM/YYYY') : ''
      })
    },
    arrayToString (value) {
      return this.safeReturn(() => value.join(','))
    },
    parseCoverageItem (coverage) {
      return this.safeReturn(() =>
        `Clients: ${coverage.clients}, Health Workers: ${coverage.health_workers}, Facilities: ${coverage.facilities}`
      )
    },
    parseCoverage (coverage) {
      return this.safeReturn(() => {
        return coverage.map(c => {
          return `District: ${c.district} [${this.parseCoverageItem(c)}]`
        }).join(', ')
      })
    },
    parseBoolean (value) {
      return this.safeReturn(() =>
        value ? this.$gettext('yes') : this.$gettext('no')
      )
    },
    parsePlatforms (platforms) {
      return this.safeReturn(() =>
        this.parseFlatList(platforms.map(p => p.id), 'platforms')
      )
    },
    parseFlatList (flatList, type) {
      return this.safeReturn(() => {
        const all = typeof this[type] === 'function' ? this[type]() : this[type]
        return all.filter(cb => flatList.includes(cb.id)).map(cb => cb.name).join(',')
      })
    },
    parseSingleSelection (id, type) {
      return this.safeReturn(() => {
        const item = this[type].find(i => i.id === id)
        return item && item.name ? item.name : ''
      })
    },
    parseHscChallenges (values) {
      return this.safeReturn(() => {
        return this.hscChallenges.reduce((a, c) => {
          c.challenges.forEach(cc => {
            if (values.includes(cc.id)) {
              a.push(cc.challenge)
            }
          })
          return a
        }, []).join(',')
      })
    },
    parseHealthFocusAreas (health_focus_areas) {
      return this.safeReturn(() => {
        return flattenDeep(this.getHealthFocusAreas.map(val => val.health_focus_areas))
          .filter(h => health_focus_areas.includes(h.id))
          .map(hf => hf.name)
          .join(',')
      })
    },
    parseCustomQuestions (donor_answers, country_answers) {
      return this.safeReturn(() => {
        const custom = {}
        if (donor_answers && this.dashboardType === 'donor') {
          this.donorColumns.forEach(dc => {
            const value = donor_answers && donor_answers[dc.donorId] ? donor_answers[dc.donorId][dc.originalId] : ''
            const label = dc.label + (dc.private ? ' (' + this.$gettext('private') + ')' : '')
            custom[label] = ((value && Array.isArray(value)) ? value.join(', ') : value) || 'N/A'
          })
        }
        if (country_answers && this.dashboardType === 'country') {
          this.countryColumns.forEach(cc => {
            const value = country_answers ? country_answers[cc.originalId] : ''
            const label = cc.label + (cc.private ? ' (' + this.$gettext('private') + ')' : '')
            custom[label] = ((value && Array.isArray(value)) ? value.join(', ') : value) || 'N/A'
          })
        }
        return custom
      }, {})
    },
    parseStages (stages) {
      return this.safeReturn(() => {
        const stagesIds = stages.map(s => s.id)
        const stagesNames = this.allStages.filter(i => stagesIds.includes(i.id)).map(i => i.name).join(', ')
        return stagesNames
        // this.parseFlatList(stages.map(p => p.id), 'stages')
      })
    }
  },
  render () {
    return this.$scopedSlots.default({
      parsed: this.parsed,
      labeled: this.withLabels
    })
  }
}
</script>

<style>

</style>
