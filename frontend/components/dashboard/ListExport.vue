<script>
import { mapGetters } from 'vuex';
import pickBy from 'lodash/pickBy';

export default {
  props: {
    projects: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      getCountryDetails: 'countries/getCountryDetails',
      getDonorDetails: 'system/getDonorDetails',
      getHealthFocusAreas: 'projects/getHealthFocusAreas',
      dashboardType: 'dashboard/getDashboardType',
      countryColumns: 'dashboard/getCountryColumns',
      donorColumns: 'dashboard/getDonorColumns',
      fieldOffices: 'projects/getFieldOffices',
      regions: 'system/getRegions',
      platforms: 'projects/getTechnologyPlatforms',
      hscChallenges: 'projects/getHscChallenges',
      organisations: 'system/getOrganisations'
    }),
    parsed () {
      if (!this.projects || !this.projects[0] || typeof this.projects !== 'object') {
        return null;
      }
      return this.projects.map(s => {
        const parsed = {
          ...s,
          country: this.parseCountry(s.country),
          organisation: this.parseSingleSelection(s.organisation, 'organisations'),
          investors: this.parseDonors(s.donors),
          health_focus_areas: this.parseHealthFocusAreas(s.health_focus_areas),
          hsc_challenges: this.parseHscChallenges(s.hsc_challenges),
          region: this.parseSingleSelection(s.region, 'regions'),
          software: this.parsePlatforms(s.platforms),
          government_investor: this.parseBoolean(s.government_investor),
          approved: this.parseBoolean(s.approved),
          ...this.parseCustomQuestions(s.donor_answers),
          donors: undefined,
          platforms: undefined,
          country_answers: undefined,
          donor_answers: undefined
        };
        return pickBy(parsed, v => v !== undefined && v !== null);
      });
    }
  },
  methods: {
    parseBoolean (value) {
      return value ? this.$gettext('yes') : this.$gettext('no');
    },
    parsePlatforms (platforms) {
      return this.parseFlatList(platforms.map(p => p.id), 'platforms');
    },
    parseFlatList (flatList, type) {
      try {
        const all = typeof this[type] === 'function' ? this[type]() : this[type];
        return all.filter(cb => flatList.includes(cb.id)).map(cb => cb.name).join(',');
      } catch (e) {
        console.warn(e);
        return '';
      }
    },
    parseSingleSelection (id, type) {
      try {
        const item = this[type].find(i => i.id === id);
        return item && item.name ? item.name : '';
      } catch (e) {
        console.warn(e);
        return '';
      }
    },
    parseCountry (countryId) {
      const country = this.getCountryDetails(countryId);
      return country && country.name ? country.name : '';
    },
    parseDonors (donors) {
      try {
        return donors.map(d => this.getDonorDetails(d)).filter(d => d).map(d => d.name).join(',');
      } catch (e) {
        console.log(e);
        return '';
      }
    },
    parseHscChallenges (values) {
      try {
        return this.hscChallenges.reduce((a, c) => {
          c.challenges.forEach(cc => {
            if (values.includes(cc.id)) {
              a.push(cc.challenge);
            }
          });
          return a;
        }, []).join(',');
      } catch (e) {
        console.warn(e);
        return '';
      }
    },
    parseHealthFocusAreas (health_focus_areas) {
      try {
        return this.getHealthFocusAreas.filter(hfa => hfa.health_focus_areas.some(h => health_focus_areas.includes(h.id))).map(hf => hf.name).join(',');
      } catch (e) {
        console.warn(e);
        return '';
      }
    },
    parseCustomQuestions (donor_answers, country_answers) {
      let custom = {};
      if (this.dashboardType === 'donor') {
        try {
          this.donorColumns.forEach(dc => {
            const value = donor_answers && donor_answers[dc.donorId] ? donor_answers[dc.donorId][dc.originalId] : '';
            custom[dc.label] = value.join(',');
          });
        } catch (e) {
          console.warn('failed to parse custom donor answers', e);
        }
      }
      if (this.dashboardType === 'country') {
        try {
          custom = this.countryColumns.forEach(cc => {
            const value = country_answers ? country_answers[cc.originalId] : '';
            custom[cc.label] = value.join(',');
          });
        } catch (e) {
          console.warn('failed to parse custom country answers', e);
        }
      }
      return custom;
    }
  },
  render () {
    return this.$scopedSlots.default({
      parsed: this.parsed
    });
  }
};
</script>

<style>

</style>
