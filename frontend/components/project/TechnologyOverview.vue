<template>
  <div
    id="technology"
    class="TechnologyOverview">
    <collapsible-card title="Technology overview">
      <el-form-item
        :error="errors.first('implementation_dates')"
        label="Technology deployment date"
      >
        <el-date-picker
          v-validate="rules.implementation_dates"
          v-model="implementation_dates"
          data-vv-name="implementation_dates"
          data-vv-as="Implementation dates"
          class="Date"
          align="left"
          placeholder="Pick a day"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('licenses')"
        label="Under what license is the project governed?">
        <license-selector
          v-validate="rules.licenses"
          v-model="licenses"
          data-vv-name="licenses"
          data-vv-as="License"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('repository')"
        label="Code documentation or download link">
        <link-field
          v-validate="rules.repository"
          v-model="repository"
          data-vv-name="repository"
          data-vv-as="Repository"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('mobile_application')"
        label="Link to the application">
        <link-field
          v-validate="rules.mobile_application"
          v-model="mobile_application"
          data-vv-name="mobile_application"
          data-vv-as="Mobile application"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('wiki')"
        label="Link to the wiki page">
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
import VeeValidationMixin from '../mixins/VeeValidationMixin.js';

import { mapGettersActions } from '../../utilities/form';
import CollapsibleCard from './CollapsibleCard';
import LicenseSelector from './LicenseSelector';
import LinkField from './LinkField';

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
      repository: ['project', 'getRepository', 'setRepository', 300],
      mobile_application: ['project', 'getMobileApplication', 'setMobileApplication', 300],
      wiki: ['project', 'getWiki', 'setWiki', 300]
    })
  },
  mounted () {
    this.$emit('mounted');
  },
  methods: {
    async validate () {
      const validations = await Promise.all([
        this.$validator.validateAll()
      ]);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .TechnologyOverview {
    .el-date-editor {
      width: 50%;
    }
  }

</style>
