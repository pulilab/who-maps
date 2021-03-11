<template>
  <div>
    <collapsible-card
      v-if="countryQuestions && countryQuestions.length > 0"
      id="countrycustom"
      :title="customFieldsName(country.name)"
      :prepend-title="6"
    >
      <custom-readonly-field
        v-for="question in countryQuestions"
        :id="question.id"
        :key="question.id"
        :question="question.question"
        :is-draft="isDraft"
        :type="question.type"
      />
    </collapsible-card>

    <div v-if="donors && donors.length > 0" id="donorcustom">
      <collapsible-card
        v-for="(donor, idx) in donors"
        :key="donor.id"
        :title="customFieldsName(donor.name)"
        :prepend-title="7 + idx"
      >
        <custom-readonly-field
          v-for="question in donor.donor_questions"
          :id="question.id"
          :key="question.id"
          :question="question.question"
          :is-draft="isDraft"
          :type="question.type"
          :donor-id="donor.id"
        />
      </collapsible-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// project components
import CollapsibleCard from "@/components/project/CollapsibleCard";
import CustomReadonlyField from "@/components/project/CustomReadonlyField";

export default {
  components: {
    CollapsibleCard,
    CustomReadonlyField,
  },
  computed: {
    ...mapGetters({
      draft: "project/getProjectData",
      published: "project/getPublished",
      getCountryDetails: "countries/getCountryDetails",
      getDonorDetails: "system/getDonorDetails",
    }),
    isGlobalSelected() {
      return this.country.id === process.env.GlobalCountryID;
    },
    route() {
      return this.$route.name.split("__")[0];
    },
    isDraft() {
      return this.route === "organisation-projects-id";
    },
    project() {
      return this.isDraft ? this.draft : this.published;
    },
    country() {
      if (this.project.country) {
        return this.getCountryDetails(this.project.country);
      }
      return null;
    },
    countryQuestions() {
      if (this.country) {
        return this.country.country_questions;
      }
      return [];
    },
    donors() {
      return this.project.donors
        .map((d) => this.getDonorDetails(d))
        .filter((d) => d.donor_questions && d.donor_questions.length > 0);
    },
  },
  methods: {
    customFieldsName(name) {
      return this.$gettext("{name} custom fields", { name });
    },
  },
};
</script>

