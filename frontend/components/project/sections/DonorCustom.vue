<template>
  <div
    v-if="donors && donors.length > 0"
    id="donorcustom"
    class="DonorCustom"
  >
    <collapsible-card
      v-for="(donor, idx) in donors"
      ref="collapsible"
      :key="donor.id"
      :title="customFieldsName(donor.name)"
      :prepend-title="prependTitle + idx"
    >
      <custom-field
        v-for="(field, index) in donor.donor_questions"
        :id="field.id"
        ref="customQuestion"
        :key="field.id"
        :index="index"
        :api-errors="apiErrors"
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
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js'
import ProjectFieldsetMixin from '../../mixins/ProjectFieldsetMixin.js'
import { mapGetters } from 'vuex'
import CollapsibleCard from '../CollapsibleCard'
import CustomField from '../CustomField'

export default {
  components: {
    CollapsibleCard,
    CustomField
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],
  computed: {
    ...mapGetters({
      getDonorDetails: 'system/getDonorDetails',
      projectDonors: 'project/getDonors',
      projectShadowDonors: 'project/getShadowDonors'
    }),
    donors () {
      const allDonors = [
        ...new Set([...this.projectDonors, ...this.projectShadowDonors])
      ]
      if (allDonors) {
        allDonors.forEach(d =>
          this.$store.dispatch('system/loadDonorDetails', d, { root: true })
        )
        return allDonors
          .map(d => this.getDonorDetails(d))
          .filter(d => d.donor_questions && d.donor_questions.length > 0)
      }
      return null
    }
  },
  methods: {
    customFieldsName (name) {
      return this.$gettext('{name} custom fields', { name })
    },
    async validate () {
      if (this.$refs.collapsible) {
        this.$refs.collapsible.forEach(c => c.expandCard())
      }
      if (this.$refs.customQuestion) {
        const validations = await Promise.all(
          this.$refs.customQuestion.map(r => r.validate())
        )
        console.log('Custom donoros validators', validations)
        return validations.reduce((a, c) => a && c, true)
      }
      return true
    }
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.DonorCustom {
}
</style>
