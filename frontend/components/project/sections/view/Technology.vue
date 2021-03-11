<template>
  <div>
    <simple-field
      :content="project.implementation_dates"
      :header="$gettext('Technology deployment date') | translate"
      :prepend-label="17"
      date
    />

    <simple-field
      :header="
        $gettext('Under what license is the project governed') | translate
      "
      :prepend-label="18"
    >
      <licenses-list :value="project.licenses" />
    </simple-field>

    <simple-field
      :content="project.repository"
      :header="$gettext('Code documentation or download link') | translate"
      :prepend-label="19"
      link
    />

    <simple-field
      :content="project.mobile_application"
      :header="$gettext('Link to the application') | translate"
      :prepend-label="20"
      link
    />

    <simple-field
      :content="project.wiki"
      :header="$gettext('Link to wiki or project website') | translate"
      :prepend-label="21"
      link
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// project components
import SimpleField from "@/components/project/SimpleField";
import LicensesList from "@/components/project/LicensesList";

export default {
  components: {
    SimpleField,
    LicensesList,
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

