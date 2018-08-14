<template>
  <div
    id="technology"
    class="TechnologyOverview">
    <collapsible-card title="Thecnology Overview">
      <el-form-item
        label="Technology deployment date"
        prop="implementation_dates"
      >
        <el-date-picker
          v-model="implementation_dates"
          class="Date"
          align="center"
          placeholder="Pick a day"
        />
      </el-form-item>
      <el-form-item
        label="Under what license is the project governed?"
        prop="licenses">
        <license-selector v-model="licenses" />
      </el-form-item>
      <el-form-item
        label="Code documentation or download link"
        prop="repository">
        <link-field v-model="repository" />
      </el-form-item>
      <el-form-item
        label="Link to the application"
        prop="mobile_application">
        <link-field v-model="mobile_application" />
      </el-form-item>
      <el-form-item
        label="Link to the wiki page"
        prop="wiki">
        <link-field v-model="wiki" />
      </el-form-item>
    </collapsible-card>
  </div>
</template>

<script>
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
  computed: {
    ...mapGettersActions({
      implementation_dates: ['project', 'getImplementationDates', 'setImplementationDates', 0],
      licenses: ['project', 'getLicenses', 'setLicenses', 0],
      repository: ['project', 'getRepository', 'setRepository', 300],
      mobile_application: ['project', 'getMobileApplication', 'setMobileApplication', 300],
      wiki: ['project', 'getWiki', 'setWiki', 300]
    })
  }
};
</script>

<style>

</style>
