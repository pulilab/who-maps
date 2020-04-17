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
        prepend-label="1"
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
        prepend-label="2"
      >
        <template slot="label">
          <translate key="repository">
            Can you provide a link to code documentation?
          </translate>
        </template>

        <character-count-input
          v-model="repository"
          v-validate="rules.repository"
          class="LinkField"
          :rules="rules.repository"
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
        prepend-label="3"
      >
        <template slot="label">
          <translate key="mobile_application">
            Can you provide a link to a demo of the application?
          </translate>
        </template>

        <character-count-input
          v-model="mobile_application"
          v-validate="rules.mobile_application"
          class="LinkField"
          :rules="rules.mobile_application"
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
        prepend-label="4"
      >
        <template slot="label">
          <translate key="wiki">
            Can you provide a link to the software wikipage?
          </translate>
        </template>

        <character-count-input
          v-model="wiki"
          v-validate="rules.wiki"
          class="LinkField"
          :rules="rules.wiki"
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
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';
import ProjectFieldsetMixin from '../../mixins/ProjectFieldsetMixin.js';

import { mapGettersActions } from '../../../utilities/form';
import CollapsibleCard from '../CollapsibleCard';
import LicenseSelector from '../LicenseSelector';

export default {
  components: {
    CollapsibleCard,
    LicenseSelector
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],
  computed: {
    ...mapGettersActions({
      licenses: ['project', 'getLicenses', 'setLicenses', 0],
      repository: ['project', 'getRepository', 'setRepository', 0],
      mobile_application: ['project', 'getMobileApplication', 'setMobileApplication', 0],
      wiki: ['project', 'getWiki', 'setWiki', 0]
    })
  },
  methods: {
    async validate () {
      this.$refs.collapsible.expandCard();
      const validations = await Promise.all([
        this.$validator.validate()
      ]);
      console.log('Technology overview validators', validations);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
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
