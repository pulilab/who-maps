<template>
  <div
    id="technology"
    class="TechnologyOverview"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Technology overview') | translate"
    >
      <el-form-item
        :error="errors.first('implementation_dates')"
        :required="rules.implementation_dates && rules.implementation_dates.required"
      >
        <template slot="label">
          <translate key="implementation_dates">
            When will the technology be first deployed?
          </translate>
        </template>

        <el-date-picker
          v-model="implementation_dates"
          v-validate="rules.implementation_dates"
          :placeholder="$gettext('Pick a day') | translate"
          data-vv-name="implementation_dates"
          data-vv-as="Implementation dates"
          class="Date"
          align="left"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('licenses')"
        :required="rules.licenses && rules.licenses.required"
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
      </el-form-item>
      <el-form-item
        :error="errors.first('repository')"
        :required="rules.repository && rules.repository.required"
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
      </el-form-item>
      <el-form-item
        :error="errors.first('mobile_application')"
        :required="rules.mobile_application && rules.mobile_application.required"
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
      </el-form-item>
      <el-form-item
        :error="errors.first('wiki')"
        :label="$gettext('Link to the wiki page') | translate"
        :required="rules.wiki && rules.wiki.required"
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
      </el-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';

import { mapGettersActions } from '../../../utilities/form';
import CollapsibleCard from '../CollapsibleCard';
import LicenseSelector from '../LicenseSelector';

export default {
  components: {
    CollapsibleCard,
    LicenseSelector
  },
  mixins: [VeeValidationMixin],
  computed: {
    ...mapGettersActions({
      implementation_dates: ['project', 'getImplementationDates', 'setImplementationDates', 0],
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
