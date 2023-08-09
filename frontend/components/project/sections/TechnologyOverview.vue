<template>
  <div
    id="technology"
    class="TechnologyOverview"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Technology overview') | translate"
      :prepend-title="prependTitle"
      show-legend
    >
      <custom-required-form-item
        :error="errors.first('licenses')"
        :draft-rule="draftRules.licenses"
        :publish-rule="publishRules.licenses"
        prepend-label="21"
      >
        <template slot="label">
          <translate key="licenses">
            Under what license is the project governed?
          </translate>
        </template>
        <license-selector
          v-model="licenses"
          v-validate="rules.licenses"
          data-vv-name="licenses"
          data-vv-as="License"
        />
      </custom-required-form-item>
      <custom-required-form-item
        :error="errors.first('repository')"
        :draft-rule="draftRules.repository"
        :publish-rule="publishRules.repository"
        prepend-label="22"
      >
        <template slot="label">
          <translate key="repository">
            Can you provide a link to code documentation?
          </translate>
          <tooltip
            :text="
              $gettext('It is recommended to publish technical documentation of your project if your software is open source and public access link should be added here')
                | translate
            "
          />
        </template>

        <character-count-input-standalone
          v-validate="rules.repository"
          class="LinkField"
          :rules="rules.repository"
          get="getRepository"
          set="setRepository"
          namespace="project"
          type="text"
          placeholder="http://"
          data-vv-name="repository"
          data-vv-as="Repository"
        />
      </custom-required-form-item>
      <custom-required-form-item
        :error="errors.first('mobile_application')"
        :draft-rule="draftRules.mobile_application"
        :publish-rule="publishRules.mobile_application"
        prepend-label="23"
      >
        <template slot="label">
          <translate key="mobile_application">
            Can you provide a link to a demo of the application?
          </translate>
          <tooltip
            :text="
              $gettext('It is recommended to have a demo instance of your software publicly available and public access link should be added here')
                | translate
            "
          />
        </template>

        <character-count-input-standalone
          v-validate="rules.mobile_application"
          class="LinkField"
          :rules="rules.mobile_application"
          get="getMobileApplication"
          set="setMobileApplication"
          namespace="project"
          type="text"
          placeholder="http://"
          data-vv-name="mobile_application"
          data-vv-as="Mobile application"
        />
      </custom-required-form-item>
      <custom-required-form-item
        :error="errors.first('wiki')"
        :label="$gettext('Link to the wiki page') | translate"
        :draft-rule="draftRules.wiki"
        :publish-rule="publishRules.wiki"
        prepend-label="24"
      >
        <template slot="label">
          <translate key="wiki">
            Can you provide a link to the software wikipage?
          </translate>
          <tooltip
            :text="
              $gettext('It is recommended to make user manual of your project freely available and public access link should be added here')
                | translate
            "
          />
        </template>

        <character-count-input-standalone
          v-validate="rules.wiki"
          class="LinkField"
          :rules="rules.wiki"
          get="getWiki"
          set="setWiki"
          namespace="project"
          type="text"
          placeholder="http://"
          data-vv-name="wiki"
          data-vv-as="Wiki"
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
import LicenseSelector from '../LicenseSelector'
import Tooltip from '@/components/dashboard/Tooltip'

export default {
  components: {
    CollapsibleCard,
    LicenseSelector,
    Tooltip,
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],
  computed: {
    ...mapGettersActions({
      licenses: ['project', 'getLicenses', 'setLicenses', 0]
    })
  },
  methods: {
    async validate () {
      this.$refs.collapsible.expandCard()
      const validations = await Promise.all([this.$validator.validate()])
      console.log('Technology overview validators', validations)
      return validations.reduce((a, c) => a && c, true)
    }
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.TechnologyOverview {
  .Date {
    width: 50% !important;
  }
}
</style>
