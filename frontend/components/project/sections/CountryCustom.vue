<template>
  <div
    id="countrycustom"
    class="CountryCustom">
    <collapsible-card title="Custom Country">
      <custom-field
        v-for="field in countryQuestions"
        :key="field.id"
        :id="field.id"
        :type="field.type"
        :question="field.question"
        :is-required="field.require"
        :options="field.options"
      />
    </collapsible-card>
  </div>
</template>

<script>
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';
import { mapGetters } from 'vuex';
import { mapGettersActions } from '../../../utilities/form';
import CollapsibleCard from '../CollapsibleCard';
import CustomField from '../CustomField';

export default {
  components: {
    CollapsibleCard,
    CustomField
  },
  mixins: [VeeValidationMixin],
  computed: {
    ...mapGetters({
      getCountryDetails: 'countries/getCountryDetails',
      projectCountry: 'project/getCountry'
    }),
    ...mapGettersActions({
    }),
    countryQuestions () {
      if (this.projectCountry) {
        const country = this.getCountryDetails(this.projectCountry);
        if (country) {
          return country.country_questions;
        }
      }
      return [];
    }
  },
  mounted () {
    this.$emit('mounted');
  },
  methods: {
    async validate () {
      const validations = await Promise.all([
        this.$validator.validate()
      ]);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
</script>

<style lang="less">
 @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .CountryCustom {}

</style>
