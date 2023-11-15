<template>
  <div id="licensing" class="TechnologyOverview">
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Accessibility and Licensing') | translate"
      :prepend-title="prependTitle"
    >
      <custom-required-form-item
        :error="errors.first('zero_cost')"
        :draft-rule="draftRules.zero_cost"
        :publish-rule="publishRules.zero_cost"
        prepend-label="21a"
      >
        <template slot="label">
          <translate key="zero_cost">Does the solution come at zero cost to users?</translate>
          <tooltip
            :text="$gettext(`The 'With restrictions' option is provided for scenarios involving a freemium model combined with other non-free business models.`) | translate"
          />
        </template>
        <LicenseChoice
          v-model="zero_cost"
          v-validate="rules.zero_cost"
          data-vv-name="zero_cost"
          data-vv-as="License zero cost"
          class="OnePerRow"
         />
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('codebase_accessible')"
        :draft-rule="draftRules.codebase_accessible"
        :publish-rule="publishRules.codebase_accessible"
        prepend-label="21b"
      >
        <template slot="label">
          <translate key="codebase_accessible">
            Is the codebase of the solution accessible for review?
          </translate>
          <tooltip
            popper-class="hsc-tooltip"
            :text="$gettext(
              `This aids in comprehending the extent to which the code is accessible for public utilization. This information is particularly valuable for individuals interested in extending or examining the solution.
              You can indicate the status as follows:
                - Yes: if the entire source code is accessible.
                - No: if it's not available in its entirety.
                - Partially: if only specific components like plugins or other parts of the codebase are accessible.`) | translate"
          />
        </template>
        <LicenseChoice
          choice="alternative"
          v-model="codebase_accessible"
          v-validate="rules.codebase_accessible"
          data-vv-name="codebase_accessible"
          data-vv-as="Codebase accessible"
          class="OnePerRow"
         />
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('codebase_accessible')"
        :draft-rule="draftRules.is_customizable"
        :publish-rule="publishRules.is_customizable"
        prepend-label="21c"
      >
        <template slot="label">
          <translate key="is_customizable">
            Can a third party customize the solution's codebase to meet specific requirements and preferences?
          </translate>
          <tooltip
            :text="$gettext(`Knowing the customization limitations is important for those who plan to adapt the project for their own needs. `) | translate"
          />
        </template>
        <LicenseChoice
          v-model="is_customizable"
          v-validate="rules.is_customizable"
          data-vv-name="is_customizable"
          data-vv-as="Is customizable"
          class="OnePerRow"
         />
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('free_replication')"
        :draft-rule="draftRules.free_replication"
        :publish-rule="publishRules.free_replication"
        prepend-label="21d"
      >
        <template slot="label">
          <translate key="free_replication">
            Is it allowed to replicate and redistribute the solution with others at no cost?
          </translate>
          <tooltip
            :text="$gettext(`This gives an idea of how flexible the project is in terms of sharing and could be a determining factor for many interested parties.`) | translate"
          />
        </template>
        <LicenseChoice
          v-model="free_replication"
          v-validate="rules.free_replication"
          data-vv-name="free_replication"
          data-vv-as="Free replication"
          class="OnePerRow"
         />
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('osi_licenses')"
        :draft-rule="draftRules.osi_licenses"
        :publish-rule="publishRules.osi_licenses"
        prepend-label="21e"
      >
        <template slot="label">
          <translate key="osi_licenses">
            Please specify the OSI Approved License(s) used for your solution. (You can find a list of approved licenses here: )
          </translate>
          <tooltip
            :text="$gettext(`This is for reference only, to guide the domain expert in case they want to know more about OSI-approved licenses that the solution is using.`) | translate"
          />
        </template>
        <OsiLicenseSelector
          v-model="osi_licenses"
          v-validate="rules.osi_licenses"
          data-vv-name="osi_licenses"
          data-vv-validate-on="change"
          data-vv-as="OSI licenses"
        />
      </custom-required-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js'
import ProjectFieldsetMixin from '../../mixins/ProjectFieldsetMixin.js'

import { mapGettersActions } from '../../../utilities/form'
import CollapsibleCard from '../CollapsibleCard'
import LicenseChoice from '../LicenseChoice'
import OsiLicenseSelector from '../OsiLicenseSelector'
import Tooltip from '@/components/dashboard/Tooltip'

export default {
  components: {
    CollapsibleCard,
    LicenseChoice,
    OsiLicenseSelector,
    Tooltip,
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],
  computed: {
    ...mapGettersActions({
      // licenses: ['project', 'getLicenses', 'setLicenses', 0],
      zero_cost: ['project', 'getZeroCost', 'setZeroCost', 0],
      codebase_accessible: ['project', 'getCodebaseAccessible', 'setCodebaseAccessible', 0],
      is_customizable: ['project', 'getIsCustomizable', 'setIsCustomizable', 0],
      free_replication: ['project', 'getFreeReplication', 'setFreeReplication', 0],
      osi_licenses: ['project', 'getOsiLicenses', 'setOsiLicenses', []],
    })
  },
  methods: {
    async validate () {
      this.$refs.collapsible.expandCard()
      const validations = await Promise.all([this.$validator.validate()])
      return validations.reduce((a, c) => a && c, true)
    }
  }
}
</script>
