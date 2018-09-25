<template>
  <div
    id="technology"
    class="TechnologyOverview">
    <collapsible-card title="Technology overview">
      <el-form-item
        :error="errors.first('implementation_dates')"
        :label="$gettext('Technology deployment date')"
        :required="rules.implementation_dates && rules.implementation_dates.required"
      >
        <el-date-picker
          v-validate="rules.implementation_dates"
          v-model="implementation_dates"
          :placeholder="$gettext('Pick a day')"
          data-vv-name="implementation_dates"
          data-vv-as="Implementation dates"
          class="Date"
          align="left"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('licenses')"
        :label="$gettext('Under what license is the project governed?')"
        :required="rules.licenses && rules.licenses.required"
      >
        <license-selector
          v-validate="rules.licenses"
          v-model="licenses"
          data-vv-name="licenses"
          data-vv-as="License"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('repository')"
        :label="$gettext('Code documentation or download link')"
        :required="rules.repository && rules.repository.required"
      >
        <link-field
          v-validate="rules.repository"
          v-model="repository"
          data-vv-name="repository"
          data-vv-as="Repository"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('mobile_application')"
        :label="$gettext('Link to the application')"
        :required="rules.mobile_application && rules.mobile_application.required"
      >
        <link-field
          v-validate="rules.mobile_application"
          v-model="mobile_application"
          data-vv-name="mobile_application"
          data-vv-as="Mobile application"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('wiki')"
        :label="$gettext('Link to the wiki page')"
        :required="rules.wiki && rules.wiki.required"
      >
        <link-field
          v-validate="rules.wiki"
          v-model="wiki"
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
import LinkField from '../LinkField';

export default {
  components: {
    CollapsibleCard,
    LicenseSelector,
    LinkField
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

  .TechnologyOverview {
    .el-date-editor {
      width: 50%;
    }
  }

</style>
