<template>
  <div>
    <slot
      :errors="errors"
      :valid="valid"
      :data="data"
      :original="original"
      :handleValidation="handleValidation"
      :rowSave="rowSave"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { projectFields } from '@/utilities/projects';
import { apiWriteParser } from '@/utilities/api';

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
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile',
      dhi: 'projects/getDigitalHealthInterventions'
    }),
    firstDHI () {
      if (this.dhi && this.dhi[0].subGroups[0] && this.dhi[0].subGroups[0].strategies) {
        return this.dhi[0].subGroups[0].strategies[0].id;
      }
      return null;
    },
    valid () {
      return this.errors.length === 0;
    },
    data () {
      if (this.row && this.row.data) {
        return this.row.data;
      }
      return {};
    },
    original () {
      if (this.row && this.row.original_data) {
        return this.row.original_data;
      }
      return {};
    }
  },
  methods: {
    handleValidation (valid, msg, field) {
      if (valid) {
        this.errors = this.errors.filter(e => e.field !== field);
      } else {
        this.errors.push({
          field,
          msg
        });
      }
    },
    scrollToError () {
      if (!this.valid) {
        const elm = this.$el.querySelector('.ValidationError');
        elm.scrollIntoView();
      }
    },
    async rowSave (country, donor, publish) {
      if (this.valid) {
        return this.save(country, donor, publish);
      } else {
        this.scrollToError();
      }
    },
    async save (country, donor, publish) {
      this.$nuxt.$loading.start('save');
      const filled = this.$children.filter(sc => sc.column && !['custom_fields', 'sub_level'].includes(sc.column));

      const countryCustom = this.$children.filter(sc => sc.type && sc.type.startsWith('MOH')).map(c => ({
        question_id: this.customFieldsLib[c.type].id,
        answer: c.apiValue()
      })).filter(a => a.answer);

      const donorCustom = this.$children.filter(sc => sc.type && sc.type.startsWith('INV')).map(c => ({
        donor_id: donor,
        question_id: this.customFieldsLib[c.type].id,
        answer: c.apiValue()
      })).filter(a => a.answer);

      const result = filled.reduce((a, c) => {
        a[c.column] = c.apiValue();
        return a;
      }, projectFields());
      const subLevel = this.$children.find(sc => sc.column === 'sub_level');
      const sublLevelValue = subLevel ? subLevel.apiValue() : null;
      if (sublLevelValue === 'National Level') {
        result.national_level_deployment = {
          clients: +result.clients || result.national_level_deployment.clients,
          facilities: +result.facilities || result.national_level_deployment.facilities,
          health_workers: +result.health_workers || result.national_level_deployment.health_workers
        };
      } else if (sublLevelValue) {
        result.coverage.push(sublLevelValue);
        result.coverageData = {
          [sublLevelValue]: {
            clients: +result.clients || result.national_level_deployment.clients,
            facilities: +result.facilities || result.national_level_deployment.facilities,
            health_workers: +result.health_workers || result.national_level_deployment.health_workers
          }
        };
      }
      if (result.platforms && result.platforms[0] && result.digitalHealthInterventions) {
        const platform = result.platforms[0];
        result.digitalHealthInterventions = result.digitalHealthInterventions.map(id => ({ platform, id }));
      }
      result.team = [this.userProfile.id];
      result.country = country;
      result.donors = [donor];
      const parsed = apiWriteParser(result, countryCustom, donorCustom);
      const { data } = await this.$axios.post(`api/projects/draft/${country}/`, parsed);
      if (publish) {
        await this.$axios.put(`api/projects/publish/${data.id}/${country}/`, parsed);
      }
      const dataRow = this.row;
      dataRow.project = data.id;
      this.$emit('update:row', dataRow);
      this.$nuxt.$loading.finish('save');
      return dataRow;
    }
  }
};
</script>

<style>

</style>
