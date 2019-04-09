<template>
  <div>
    <div
      v-if="errors"
      class="GlobalErrors"
    >
      <el-tag
        v-for="error in errors"
        :key="error"
        type="danger"
      >
        <fa icon="exclamation" />
        {{ error }}
      </el-tag>
    </div>
    <slot
      :rules="validationRules"
      :globalErrors="errors"
      :nameMapping="nameMapping"
    />
  </div>
</template>

<script>
import { draftRules, publishRules } from '@/utilities/projects';
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    publish: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    internalDraftRules () {
      return { ...draftRules(), organisation: { required: true } };
    },
    internalPublishRules () {
      const standardRules = publishRules();
      return {
        ...standardRules,
        strategies: undefined,
        digitalHealthInterventions: standardRules.strategies,
        ...standardRules.national_level_deployment
      };
    },
    validationRules () {
      const rules = this.publish ? this.internalPublishRules : this.internalDraftRules;
      return {
        ...rules,
        team: undefined,
        viewers: undefined,
        country: undefined,
        donors: undefined
      };
    },
    nameMapping () {
      return {
        name: 'Project Name',
        organisation: 'Organisation',
        geographic_scope: 'Geographic Scope',
        implementation_overview: 'Narrative of the project',
        start_date: 'Start Date',
        end_date: 'End Date',
        contact_name: 'Contact name',
        contact_email: 'Contact email',
        platforms: 'Software',
        health_focus_areas: 'Health Focus Areas',
        hsc_challenges: 'Health System Challenges',
        his_bucket: 'Health Information Systems',
        government_investor: 'Governament Contribution',
        implementing_partners: 'Partners',
        implementation_dates: 'Technology Deployment Date',
        licenses: 'Licenses',
        repository: 'Link to Code documentation',
        wiki: 'Link to Wiki',
        mobile_application: 'Link to application',
        interoperability_links: 'Interoperability Links',
        interoperability_standards: 'Interoperability Standards',
        health_workers: 'Health Workers',
        clients: 'Clients',
        facilities: 'Facilities',
        sub_level: 'Coverage Type',
        digitalHealthInterventions: 'Digital Health Interventions (associated to the Software)'

      };
    },
    errors () {
      const result = [];
      const draftRequireds = [];
      for (const key in this.validationRules) {
        if (this.validationRules[key] && this.validationRules[key].required) {
          draftRequireds.push(key);
        }
      }
      draftRequireds.forEach(dr => {
        if (!this.headers.some(h => h.selected === dr)) {
          const name = this.nameMapping[dr] || dr;
          result.push(`Please select ${name} column`);
        }
      });
      return result;
    }
  }

};
</script>

<style>

</style>
