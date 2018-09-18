<template>
  <div
    id="countrycustom"
    class="CountryCustom">
    <collapsible-card title="Custom Country">
      <custom-field
        v-for="(field) in countryQuestions"
        ref="customQuestion"
        :key="field.id"
        :id="field.id"
        :type="field.type"
        :question="field.question"
        :is-required="field.required"
        :options="field.options"
        :do-validation="usePublishRules"
      />
    </collapsible-card>
  </div>
</template>

<script>
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';
import { mapGetters } from 'vuex';
import CollapsibleCard from '../CollapsibleCard';
import CustomField from '../CustomField';

export default {
  components: {
    CollapsibleCard,
    CustomField
  },
  mixins: [VeeValidationMixin],
  props: {
    usePublishRules: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getCountryDetails: 'countries/getCountryDetails',
      projectCountry: 'project/getCountry'
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
      const validations = await Promise.all(this.$refs.customQuestion.map(r => r.validate()));
      console.log('Custom country questions validators', validations);
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
