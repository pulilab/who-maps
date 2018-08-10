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
      <el-form-item label="Under what license is the project governed?">
        <license-selector v-model="licenses" />
      </el-form-item>
    </collapsible-card>
  </div>
</template>

<script>
import { mapGettersActions } from '../../utilities/form';
import CollapsibleCard from './CollapsibleCard';
import LicenseSelector from './LicenseSelector';

export default {
  components: {
    CollapsibleCard,
    LicenseSelector
  },
  computed: {
    ...mapGettersActions({
      implementation_dates: ['project', 'getImplementationDates', 'setImplementationDates'],
      licenses: ['project', 'getLicenses', 'setLicenses']
    })
  }
};
</script>

<style>

</style>
