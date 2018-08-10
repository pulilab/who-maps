<template>
  <div
    id="general"
    class="GeneralOverview">
    <collapsible-card title="General Overview">
      <el-form-item
        label="Project name"
        prop="name">
        <el-input v-model="name"/>
      </el-form-item>
      <el-form-item
        label="Organisation"
        prop="organisation">
        <organisation-select v-model="organisation"/>
      </el-form-item>
      <el-form-item
        label="Project country"
        prop="country">
        <country-select v-model="country"/>
      </el-form-item>
      <el-form-item
        label="Geographic Scope"
        prop="country">
        <el-input
          v-model="geographic_scope"
          type="textarea"
        />
        <span class="Hint">
          Please describe where your implementation is currently taking place
        </span>
      </el-form-item>
      <el-form-item
        label="Overview of the digital health implementation"
        prop="country">
        <el-input
          v-model="implementation_overview"
          type="textarea"
        />
        <span class="Hint">
          Describe what the technology aims to achieve, detailing the users, the reasons for deploying the system, and current and future phases of deployment.
        </span>
      </el-form-item>
      <el-form-item
        label="Overview of the digital health implementation"
        prop="country">
        <el-input
          v-model="implementation_overview"
          type="textarea"
        />
        <span class="Hint">
          Describe what the technology aims to achieve, detailing the users, the reasons for deploying the system, and current and future phases of deployment.
        </span>
      </el-form-item>
      <el-row
        :gutter="10"
        type="flex">
        <el-col :span="12">
          <el-form-item
            label="Project start date"
            prop="start_date"
          >
            <el-date-picker
              v-model="start_date"
              class="Date"
              align="center"
              placeholder="Start date"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="Project end date"
            prop="end_date"
          >
            <el-date-picker
              v-model="start_date"
              class="Date"
              align="center"
              placeholder="End date"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        :gutter="10"
        type="flex">
        <el-col :span="12">
          <el-form-item
            label="Contact name"
            prop="contact_name"
          >
            <el-input
              v-model="contact_name"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="Contact email"
            prop="contact_email"
          >
            <el-input
              v-model="contact_email"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="TeamArea">
        <el-form-item
          label="Add Team members (Editor role)"
          prop="team"
        >
          <team-selector v-model="team" />
        </el-form-item>
        <el-form-item
          label="Add Viewers (only Viewer role)"
          prop="viewers"
        >
          <team-selector v-model="viewers" />
        </el-form-item>
      </div>
    </collapsible-card>
  </div>
</template>

<script>
import CollapsibleCard from './CollapsibleCard';
import TeamSelector from './TeamSelector';
import CountrySelect from '../common/CountrySelect';
import OrganisationSelect from '../common/OrganisationSelect';
import { mapGettersActions } from '../../utilities/form';

export default {
  components: {
    CollapsibleCard,
    CountrySelect,
    TeamSelector,
    OrganisationSelect
  },
  computed: {
    ...mapGettersActions({
      name: ['project', 'getName', 'setName'],
      organisation: ['project', 'getOrganisation', 'setOrganisation'],
      country: ['project', 'getCountry', 'setCountry'],
      geographic_scope: ['project', 'getGeographicScope', 'setGeographicScope'],
      implementation_overview: ['project', 'getImplementationOverview', 'setImplementationOverview'],
      start_date: ['project', 'getStartDate', 'setStartDate'],
      end_date: ['project', 'getEndDate', 'setEndDate'],
      contact_name: ['project', 'getContactName', 'setContactName'],
      contact_email: ['project', 'getContactEmail', 'setContactEmail'],
      team: ['project', 'getTeam', 'setTeam'],
      viewers: ['project', 'getViewers', 'setViewers']
    })
  },

  methods: {}
};
</script>

<style lang="less">
.GeneralOverview {
  .Date {
    width: 100%;
  }
}
</style>
