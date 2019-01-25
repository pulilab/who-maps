<template>
  <div
    id="general"
    class="GeneralOverview"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('General overview') | translate"
    >
      <el-form-item
        :error="errors.first('name')"
        :required="rules.name && rules.name.required"
      >
        <template slot="label">
          <translate key="project-name">
            Project Name
          </translate>
          <form-hint>
            <translate key="project-name-hint">
              If this is your first time uploading a project, a sample data form can be found here for reference.
            </translate>
          </form-hint>
        </template>
        <el-input
          v-model="name"
          v-validate="rules.name"
          data-as-name="Name"
          data-vv-name="name"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('organisation')"
        :required="rules.organisation && rules.organisation.required"
      >
        <template slot="label">
          <translate key="organisation">
            What is the name of the lead organization?
          </translate>
        </template>
        <organisation-select
          v-model="organisation"
          v-validate="rules.organisation"
          data-vv-name="organisation"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('country')"
        :required="rules.country && rules.country.required"
      >
        <template slot="label">
          <translate key="country">
            Project Country
          </translate>
        </template>
        <country-select
          v-model="country"
          v-validate="rules.country"
          data-vv-name="country"
          data-vv-as="Country"
        />
      </el-form-item>
      <el-form-item
        :error="errors.first('geographic_scope')"
        :required="rules.geographic_scope && rules.geographic_scope.required"
      >
        <template slot="label">
          <translate key="geographic-scope">
            What is the geographic scope of the project?
          </translate>
          <form-hint>
            <translate key="geographic-scope-hint">
              Describe the user types, geographic coverage and other coverage details.
            </translate>
          </form-hint>
        </template>

        <el-input
          v-model="geographic_scope"
          v-validate="rules.geographic_scope"
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
        :required="rules.implementation_overview && rules.implementation_overview.required"
      >
        <template slot="label">
          <translate key="implementation-overview">
            Please provide a narrative summary of the digital health implementation.
          </translate>
          <form-hint>
            <translate key="implementation-overview-hint">
              Describe your overall digital health project design.
            </translate>
          </form-hint>
        </template>
        <el-input
          v-model="implementation_overview"
          v-validate="rules.implementation_overview"
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
        type="flex"
      >
        <el-col :span="12">
          <el-form-item
            :error="errors.first('start_date')"
            :required="rules.start_date && rules.start_date.required"
          >
            <template slot="label">
              <translate key="start-date">
                Project start date
              </translate>
              <form-hint>
                <translate key="start-date-hint">
                  When did the overall project, not just the digital health component, start.
                </translate>
              </form-hint>
            </template>

            <el-date-picker
              ref="Start date"
              v-model="start_date"
              v-validate="rules.start_date"
              :placeholder="$gettext('Start date') | translate"
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

            :required="rules.end_date && rules.end_date.required"
          >
            <template slot="label">
              <translate key="end-date">
                Project end date
              </translate>
              <form-hint>
                <translate key="end-date-hint">
                  When will the overall project be completed. If your project is ongoing, leave this field blank.
                </translate>
              </form-hint>
            </template>

            <el-date-picker
              v-model="end_date"
              v-validate="rules.end_date"
              :placeholder="$gettext('End date') | translate"
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
        type="flex"
      >
        <el-col :span="12">
          <el-form-item
            :error="errors.first('contact_name')"
            :required="rules.contact_name && rules.contact_name.required"
          >
            <template slot="label">
              <translate key="contact-name">
                Contact name
              </translate>
              <form-hint>
                <translate key="contact-name-hint">
                  This is the individual who will be the lead point of contact for any queries through the DHA.
                </translate>
              </form-hint>
            </template>

            <el-input
              v-model="contact_name"
              v-validate="rules.contact_name"
              data-vv-name="contact_name"
              data-vv-as="Contact name"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :error="errors.first('contact_email')"
            :required="rules.contact_email && rules.contact_email.required"
          >
            <template slot="label">
              <translate key="contact-email">
                Contact email
              </translate>
            </template>

            <el-input
              v-model="contact_email"
              v-validate="rules.contact_email"
              data-vv-name="contact_email"
              data-vv-as="Contact email"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="TeamArea">
        <el-form-item
          :error="errors.first('team')"

          :required="rules.team && rules.team.required"
        >
          <template slot="label">
            <translate key="team">
              Add Team members (Editor role)
            </translate>
            <form-hint>
              <translate key="team-hint">
                Project editors can change and update all project information.
              </translate>
            </form-hint>
          </template>

          <team-selector
            v-model="team"
            v-validate="rules.team"
            data-vv-name="team"
            data-vv-as="Team"
          />
        </el-form-item>
        <el-form-item
          :error="errors.first('viewers')"
          :required="rules.viewers && rules.viewers.required"
        >
          <template slot="label">
            <translate key="viewers">
              Add Viewers (only Viewer role)
            </translate>
            <form-hint>
              <translate key="viewers-hint">
                Project viewers will be able to view the full project details.
              </translate>
            </form-hint>
          </template>

          <team-selector
            v-model="viewers"
            v-validate="rules.viewers"
            data-vv-name="viewers"
            data-vv-as="Viewers"
          />
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
import FormHint from '../FormHint';
import { mapGettersActions } from '../../../utilities/form';

export default {
  components: {
    CollapsibleCard,
    CountrySelect,
    TeamSelector,
    OrganisationSelect,
    FormHint
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
      return null;
    }
  },
  methods: {
    async validate () {
      this.$refs.collapsible.expandCard();
      const validations = await Promise.all([
        this.$validator.validate(),
        Promise.resolve(this.endDateError === undefined)
      ]);
      return validations.reduce((a, c) => a && c, true);
    },
    async validateDraft () {
      this.$refs.collapsible.expandCard();
      const validations = await Promise.all([
        this.$validator.validate('name'),
        this.$validator.validate('country'),
        this.$validator.validate('contact_email'),
        this.$validator.validate('team')
      ]);
      console.log('General overview draft validation', validations);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .GeneralOverview {
    .CountrySelector {
      width: 50%;
    }

    .Date {
      width: 100% !important;
    }
  }
</style>
