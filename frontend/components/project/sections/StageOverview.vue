<template>
  <div
    id="stages"
    class="StageOverview"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('Project stages') | translate"
      show-legend
    >
      <el-row
        :gutter="20"
        type="flex"
      >
        <el-col :span="12">
          <custom-required-form-item
            :error="errors.first('start_date')"
            :draft-rule="draftRules.start_date"
            :publish-rule="publishRules.start_date"
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
            <safe-date-picker
              ref="Start date"
              v-model="start_date"
              v-validate="rules.start_date"
              :placeholder="$gettext('Start date') | translate"
              data-vv-name="start_date"
              data-vv-as="Start date"
              class="Date"
              align="left"
            />
          </custom-required-form-item>
        </el-col>

        <el-col :span="12">
          <custom-required-form-item
            :error="errors.first('end_date') || endDateError"
            :draft-rule="draftRules.end_date"
            :publish-rule="publishRules.end_date"
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

            <safe-date-picker
              v-model="end_date"
              v-validate="rules.end_date"
              :placeholder="$gettext('End date') | translate"
              data-vv-name="end_date"
              data-vv-as="End date"
              class="Date"
              align="left"
            />
          </custom-required-form-item>
        </el-col>
      </el-row>
    </collapsible-card>
  </div>
</template>

<script>
import { isAfter } from 'date-fns';
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js';
import ProjectFieldsetMixin from '../../mixins/ProjectFieldsetMixin.js';
import CollapsibleCard from '../CollapsibleCard';
import FormHint from '../FormHint';
import { mapGettersActions } from '../../../utilities/form';
import CustomRequiredFormTeamItem from '@/components/proxy/CustomRequiredFormTeamItem';

export default {
  components: {
    CollapsibleCard,
    FormHint,
    CustomRequiredFormTeamItem
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],
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
      return '';
    }
  },
  methods: {
    async validate () {
      this.$refs.collapsible.expandCard();
      const validations = await Promise.all([
        this.$validator.validate(),
        Promise.resolve(this.endDateError === '')
      ]);
      console.log('Project stages published validation', validations);
      return validations.reduce((a, c) => a && c, true);
    },
    async validateDraft () {
      this.$refs.collapsible.expandCard();
      const validations = await Promise.all([
        this.$validator.validate('name'),
        this.$validator.validate('country'),
        this.$validator.validate('contact_email'),
        this.$validator.validate('team'),
        this.$validator.validate('start_date'),
        this.$validator.validate('end_date')

      ]);
      console.log('Project stages draft validation', validations);
      return validations.reduce((a, c) => a && c, true);
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";
</style>
