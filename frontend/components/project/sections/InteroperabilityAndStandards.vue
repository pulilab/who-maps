<template>
  <div id="interoperability" class="InteroperabilityAndStandards">
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Interoperability &amp; Standards')"
      :prepend-title="prependTitle"
    >
      <custom-required-form-item
        prop="interoperability_links"
        :draft-rule="draftRules.interoperability_links"
        :publish-rule="publishRules.interoperability_links"
        prepend-label="25"
      >
        <template slot="label">
          <translate key="interoperability_links">
            Does your project share information with one or more of these
            digital Health Information System components?
          </translate>
          <tooltip
            :text="
              $gettext('Specify other digital health systems that your project interfaces with. The link given must point to specific system and not generic website of the vendor.')
                | translate
            "
          />
        </template>

        <interoperability-link-component
          v-for="(ir, index) in interopearilbityLinksStructure"
          ref="interoperabilityLink"
          :key="ir.id"
          :item="ir"
          :index="index"
          :rules="rules"
          :api-errors="apiErrors"
          :interoperability-links.sync="interoperability_links"
        />
      </custom-required-form-item>
      <custom-required-form-item
        prop="interoperability_standards"
        :draft-rule="draftRules.interoperability_standards"
        :publish-rule="publishRules.interoperability_standards"
        prepend-label="26"
      >
        <template slot="label">
          <translate key="interoperability-standards">
            What data standards does your digital health project use?
          </translate>
          <tooltip
            :text="
              $gettext(
                'If your data standards are not available here, please email digital-health-atlas@who.int'
              ) | translate
            "
          />
        </template>

        <standards-selector v-model="interoperability_standards" />
      </custom-required-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapGettersActions } from '../../../utilities/form'
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js'
import ProjectFieldsetMixin from '../../mixins/ProjectFieldsetMixin.js'

import CollapsibleCard from '../CollapsibleCard'
import InteroperabilityLinkComponent from '../InteroperabilityLinkComponent'
import StandardsSelector from '../StandardsSelector'
import Tooltip from '@/components/dashboard/Tooltip'

export default {
  components: {
    CollapsibleCard,
    InteroperabilityLinkComponent,
    StandardsSelector,
    Tooltip
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],
  computed: {
    ...mapGetters({
      interopearilbityLinksStructure: 'projects/getInteroperabilityLinks'
    }),
    ...mapGettersActions({
      interoperability_links: [
        'project',
        'getInteroperabilityLinks',
        'setInteroperabilityLinks',
        0
      ],
      interoperability_standards: [
        'project',
        'getInteroperabilityStandards',
        'setInteroperabilityStandards',
        0
      ]
    })
  },
  methods: {
    async validate () {
      this.$refs.collapsible.expandCard()
      const validations = await Promise.all([
        this.$validator.validate(),
        ...this.$refs.interoperabilityLink.map(ir => ir.validate())
      ])
      return validations.reduce((a, c) => a && c, true)
    }
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.InteroperabilityAndStandards {
}
</style>
