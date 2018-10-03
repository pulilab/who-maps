<template>
  <div
    v-if="countryQuestions && countryQuestions.length >0"
    id="countrycustom"
    class="CountryCustom">
    <collapsible-card :title="$gettext('{name} custom fields', {name: country.name})" >
      <custom-field
        v-for="(field, index) in countryQuestions"
        ref="customQuestion"
        :key="field.id"
        :index="index"
        :api-errors="apiErrors"
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
    country () {
      if (this.projectCountry) {
        return this.getCountryDetails(this.projectCountry);
      }
    },
    countryQuestions () {
      if (this.country) {
        return this.country.country_questions;
      }
      return [];
    }
  },
  mounted () {
    this.$emit('mounted');
  },
  methods: {
    async validate () {
      if (this.$refs.customQuestion) {
        const validations = await Promise.all(this.$refs.customQuestion.map(r => r.validate()));
        console.log('Custom country questions validators', validations);
        return validations.reduce((a, c) => a && c, true);
      }
      return true;
    }
  }
};
</script>

<style lang="less">
 @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .CountryCustom {}

</style>
