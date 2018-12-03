<template>
  <div
    v-if="donors && donors.length >0"
    id="donorcustom"
    class="DonorCustom">
    <collapsible-card
      v-for="(donor) in donors"
      ref="collapsible"
      :key="donor.id"
      :title="$gettext('{name} custom fields', {name: donor.name}) | translate"
    >
      <custom-field
        v-for="(field, index) in donor.donor_questions"
        ref="customQuestion"
        :key="field.id"
        :index="index"
        :api-errors="apiErrors"
        :id="field.id"
        :type="field.type"
        :question="field.question"
        :is-required="field.required"
        :is-private="field.private"
        :options="field.options"
        :do-validation="usePublishRules"
        :donor-id="donor.id"
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
      getDonorDetails: 'system/getDonorDetails',
      projectDonors: 'project/getDonors'
    }),
    donors () {
      if (this.projectDonors) {
        return this.projectDonors.map(d => this.getDonorDetails(d)).filter(d => d.donor_questions && d.donor_questions.length > 0);
      }
    }
  },
  mounted () {
    this.$emit('mounted');
  },
  methods: {
    async validate () {
      if (this.$refs.collapsible) {
        this.$refs.collapsible.forEach(c => c.expandCard());
      }
      if (this.$refs.customQuestion) {
        const validations = await Promise.all(this.$refs.customQuestion.map(r => r.validate()));
        console.log('Custom donoros validators', validations);
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

  .DonorCustom {}

</style>
