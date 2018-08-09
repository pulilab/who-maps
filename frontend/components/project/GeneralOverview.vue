<template>
  <div
    id="general"
    class="GeneralOverview">
    <collapsible-card title="General Overview">
      <el-form
        :model="general"
        :rules="rules"
        label-position="top"
        @submit.native.prevent>
        <el-form-item
          label="Project name"
          prop="name">
          <el-input v-model="general.name"/>
        </el-form-item>
        <el-form-item
          label="Organisation"
          prop="organisation">
          <organisation-select v-model="general.organisation"/>
        </el-form-item>
        <el-form-item
          label="Project country"
          prop="country">
          <country-select v-model="general.country"/>
        </el-form-item>
        <el-form-item
          label="Geographic Scope"
          prop="country">
          <el-input
            v-model="general.geographic_scope"
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
            v-model="general.implementation_overview"
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
            v-model="general.implementation_overview"
            type="textarea"
          />
          <span class="Hint">
            Describe what the technology aims to achieve, detailing the users, the reasons for deploying the system, and current and future phases of deployment.
          </span>
        </el-form-item>
        <el-form-item
          label="Project start and end date"
          prop="start_end_date"
        >
          <el-date-picker
            v-model="general.start_end_date"
            type="daterange"
            class="Date"
            align="center"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-form-item>
        <el-row
          :gutter="10"
          type="flex">
          <el-col :span="12">
            <el-form-item
              label="Contact name"
              prop="contact_name"
            >
              <el-input
                v-model="general.contact_name"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Contact email"
              prop="contact_email"
            >
              <el-input
                v-model="general.contact_email"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="TeamArea">
          <el-form-item
            label="Add Team members (Editor role)"
            prop="team"
          >
            <team-selector v-model="general.team" />
          </el-form-item>
          <el-form-item
            label="Add Viewers (only Viewer role)"
            prop="viewers"
          >
            <team-selector v-model="general.viewers" />
          </el-form-item>
        </div>
      </el-form>
    </collapsible-card>
  </div>
</template>

<script>
import CollapsibleCard from './CollapsibleCard';
import TeamSelector from './TeamSelector';
import CountrySelect from '../common/CountrySelect';
import OrganisationSelect from '../common/OrganisationSelect';
import { mapActions } from 'vuex';

export default {
  components: {
    CollapsibleCard,
    CountrySelect,
    TeamSelector,
    OrganisationSelect
  },
  data () {
    return {
      general: {
        name: null,
        organisation: null,
        geographic_scope: null,
        implementation_overview: null,
        start_end_date: null,
        contact_name: null,
        contact_email: null,
        team: [],
        viewers: []
      },
      rules: {
        name: [
          { required: true, trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    'general.country': {
      immediate: true,
      handler (value) {
        this.setCurrentProjectCountry(value);
      }
    }
  },
  methods: {
    ...mapActions({
      setCurrentProjectCountry: 'projects/setCurrentProjectCountry'
    })
  }
};
</script>

<style lang="less">
.GeneralOverview {
  .Date {
    width: 100%;
  }
}
</style>
