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
        prop="geographic_scope">
        <el-input
          v-model="geographic_scope"
          type="textarea"
        />
        <span class="Hint">
          <fa icon="info-circle" />
          <p>Please describe where your implementation is currently taking place</p>
        </span>
      </el-form-item>
      <el-form-item
        label="Overview of the digital health implementation"
        prop="implementation_overview">
        <el-input
          v-model="implementation_overview"
          type="textarea"
        />
        <span class="Hint">
          <fa icon="info-circle" />
          <p>Describe what the technology aims to achieve, detailing the users, the reasons for deploying the system, and current and future phases of deployment.</p>
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
          <fa icon="info-circle" />
          <p>Describe what the technology aims to achieve, detailing the users, the reasons for deploying the system, and current and future phases of deployment.</p>
        </span>
      </el-form-item>
      <el-row
        :gutter="20"
        type="flex">
        <el-col :span="12">
          <el-form-item
            label="Project start date"
            prop="start_date"
          >
            <el-date-picker
              v-model="start_date"
              class="Date"
              align="left"
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
              v-model="end_date"
              class="Date"
              align="left"
              placeholder="End date"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
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
      name: ['project', 'getName', 'setName', 300],
      organisation: ['project', 'getOrganisation', 'setOrganisation', 0],
      country: ['project', 'getCountry', 'setCountry', 0],
      geographic_scope: ['project', 'getGeographicScope', 'setGeographicScope', 300],
      implementation_overview: ['project', 'getImplementationOverview', 'setImplementationOverview', 300],
      start_date: ['project', 'getStartDate', 'setStartDate', 0],
      end_date: ['project', 'getEndDate', 'setEndDate', 0],
      contact_name: ['project', 'getContactName', 'setContactName', 300],
      contact_email: ['project', 'getContactEmail', 'setContactEmail', 300],
      team: ['project', 'getTeam', 'setTeam', 0],
      viewers: ['project', 'getViewers', 'setViewers', 0]
    })
  },
  mounted () {
    this.$emit('mounted');
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .GeneralOverview {
    .Date {
      width: 100%;
    }
  }
</style>
