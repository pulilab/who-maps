<template>
  <div>
    <simple-field
      :header="
        $gettext('What other system do you interoperate with ?') | translate
      "
      :prepend-label="22"
    >
      <interoperability-links-list :value="project.interoperability_links" />
    </simple-field>

    <simple-field
      :header="
        $gettext('What data standards does your digital health project use?')
          | translate
      "
      :prepend-label="23"
    >
      <standards-list :value="project.interoperability_standards" />
    </simple-field>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// project components
import SimpleField from "@/components/project/SimpleField";
import StandardsList from "@/components/project/StandardsList";
import InteroperabilityLinksList from "@/components/project/InteroperabilityLinksList";

export default {
  components: {
    SimpleField,
    StandardsList,
    InteroperabilityLinksList,
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
  },
};
</script>

