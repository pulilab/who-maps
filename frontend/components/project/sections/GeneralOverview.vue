<template>
  <div
    id="general"
    class="GeneralOverview">
    <collapsible-card :title="$gettext('General overview')">
      <el-form-item
        :error="errors.first('name')"
        :label="$gettext('Project name')"
      >
        <el-input
          v-validate="rules.name"
          v-model="name"
          data-as-name="Name"
          data-vv-name="name"/>
      </el-form-item>
      <el-form-item
        :error="errors.first('organisation')"
        :label="$gettext('Organisation')"
      >
        <organisation-select
          v-validate="rules.organisation"
          v-model="organisation"
          data-vv-name="organisation"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('country')"
        :label="$gettext('Project country')">
        <country-select
          v-validate="rules.country"
          v-model="country"
          data-vv-name="country"
          data-vv-as="Country"/>
      </el-form-item>
      <el-form-item
        :error="errors.first('geographic_scope')"
        :label="$gettext('Geographic Scope')">

        <el-input
          v-validate="rules.geographic_scope"
          v-model="geographic_scope"
          data-vv-name="geographic_scope"
          data-vv-as="Geographic scope"
          type="textarea"
        />
        <span class="Hint">
          <fa icon="info-circle" />
          <p><translate>Please describe where your implementation is currently taking place</translate></p>
        </span>
      </el-form-item>
      <el-form-item
        :error="errors.first('implementation_overview')"
        :label="$gettext('Overview of the digital health implementation')">

        <el-input
          v-validate="rules.implementation_overview"
          v-model="implementation_overview"
          data-vv-name="implementation_overview"
          data-vv-as="Implementation Overview"
          type="textarea"
        />
        <span class="Hint">
          <fa icon="info-circle" />
          <p><translate>Describe what the technology aims to achieve, detailing the users, the reasons for deploying the system, and current and future phases of deployment.</translate></p>
        </span>
      </el-form-item>
      <el-row
        :gutter="20"
        type="flex">
        <el-col :span="12">
          <el-form-item
            :error="errors.first('start_date')"
            :label="$gettext('Project start date')"
          >
            <el-date-picker
              v-validate="rules.start_date"
              ref="Start date"
              v-model="start_date"
              :placeholder="$gettext('Start date')"
              data-vv-name="start_date"
              data-vv-as="Start date"
              class="Date"
              align="left"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :error="errors.first('end_date') || endDateError"
            :label="$gettext('Project end date')"
          >
            <el-date-picker
              v-validate="rules.end_date"
              v-model="end_date"
              :placeholder="$gettext('End date')"
              data-vv-name="end_date"
              data-vv-as="End date"
              class="Date"
              align="left"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        type="flex">
        <el-col :span="12">
          <el-form-item
            :error="errors.first('contact_name')"
            :label="$gettext('Contact name')"
          >
            <el-input
              v-validate="rules.contact_name"
              v-model="contact_name"
              data-vv-name="contact_name"
              data-vv-as="Contact name"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :error="errors.first('contact_email')"
            :label="$gettext('Contact email')"
          >
            <el-input
              v-validate="rules.contact_email"
              v-model="contact_email"
              data-vv-name="contact_email"
              data-vv-as="Contact email"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="TeamArea">
        <el-form-item
          :error="errors.first('team')"
          :label="$gettext('Add Team members (Editor role)')"
        >
          <team-selector
            v-validate="rules.team"
            v-model="team"
            data-vv-name="team"
            data-vv-as="Team" />
        </el-form-item>
        <el-form-item
          :error="errors.first('viewers')"
          :label="$gettext('Add Viewers (only Viewer role)')"
        >
          <team-selector
            v-validate="rules.viewers"
            v-model="viewers"
            data-vv-name="viewers"
            data-vv-as="Viewers" />
        </el-form-item>
      </div>
    </collapsible-card>
  </div>
</template>

<script>
import { isAfter } from 'date-fns';
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';
import CollapsibleCard from '../CollapsibleCard';
import TeamSelector from '../TeamSelector';
import CountrySelect from '../../common/CountrySelect';
import OrganisationSelect from '../../common/OrganisationSelect';
import { mapGettersActions } from '../../../utilities/form';

export default {
  components: {
    CollapsibleCard,
    CountrySelect,
    TeamSelector,
    OrganisationSelect
  },
  mixins: [VeeValidationMixin],
  props: {
    usePublishRules: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGettersActions({
      name: ['project', 'getName', 'setName', 0],
      organisation: ['project', 'getOrganisation', 'setOrganisation', 0],
      country: ['project', 'getCountry', 'setCountry', 0],
      geographic_scope: ['project', 'getGeographicScope', 'setGeographicScope', 0],
      implementation_overview: ['project', 'getImplementationOverview', 'setImplementationOverview', 0],
      start_date: ['project', 'getStartDate', 'setStartDate', 0],
      end_date: ['project', 'getEndDate', 'setEndDate', 0],
      contact_name: ['project', 'getContactName', 'setContactName', 0],
      contact_email: ['project', 'getContactEmail', 'setContactEmail', 0],
      team: ['project', 'getTeam', 'setTeam', 0],
      viewers: ['project', 'getViewers', 'setViewers', 0]
    }),
    endDateError () {
      if (this.usePublishRules && this.start_date && this.end_date && isAfter(this.start_date, this.end_date)) {
        return this.$gettext('End date must be after Start date');
      }
    }
  },
  mounted () {
    this.$emit('mounted');
  },
  methods: {
    async validate () {
      const validations = await Promise.all([
        this.$validator.validate(),
        Promise.resolve(this.endDateError === undefined)
      ]);
      return validations.reduce((a, c) => a && c, true);
    },
    async validateDraft () {
      const validations = await Promise.all([
        this.$validator.validate('name'),
        this.$validator.validate('country'),
        this.$validator.validate('email'),
        this.$validator.validate('team')
      ]);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .GeneralOverview {
    .Date {
      width: 100%;
    }
  }
</style>
