<template>
  <div v-loading="loading">
    <view-field v-for="field in fields" :key="field.id" v-bind="field" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import isEmpty from "lodash/isEmpty";
import { getList } from "@/utilities/projects";

import ViewField from "@/components/project/wrappers/ViewField";

export default {
  components: {
    ViewField,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      organisation: {},
      country: {},
      members: [],
      viewers: [],
      fields: [],
    };
  },
  computed: {
    ...mapGetters({
      getOrganisationDetails: "system/getOrganisationDetails",
      getCountryDetails: "countries/getCountryDetails",
      getProfiles: "system/getUserProfilesNoFilter",
    }),
  },
  watch: {
    project(project) {
      if (!isEmpty(project)) {
        const { organisation, country, team, viewers } = project;
        this.organisation = this.handleDetails(
          organisation,
          "getOrganisationDetails"
        );
        this.country = this.handleDetails(country, "getCountryDetails");
        this.members = getList(team, this.getProfiles);
        this.viewers = getList(viewers, this.getProfiles);
        this.fields = this.handleFields();
        this.loading = false;
      } else {
        this.loading = true;
      }
    },
  },
  methods: {
    handleDetails(id, method) {
      if (id) {
        return this[method](parseInt(id, 10));
      }
      return {};
    },
    handleFields() {
      return [
        {
          id: 1,
          prepend: 1,
          header: this.$gettext("Project Name"),
          content: this.project.name,
        },
        {
          id: 2,
          prepend: 2,
          header: this.$gettext("Organisation"),
          content: this.organisation.name,
        },
        {
          id: 3,
          prepend: 3,
          header: this.$gettext("Project country"),
          content: this.country.name,
        },
        {
          id: 4,
          prepend: 4,
          header: this.$gettext("Geographic scope"),
          content: this.project.geographic_scope,
        },
        {
          id: 5,
          prepend: 5,
          header: this.$gettext(
            "Overview of the digital health implementation"
          ),
          content: this.project.implementation_overview,
        },
        {
          row: true,
          fields: [
            {
              id: 6,
              prepend: 6,
              header: this.$gettext("Contact name"),
              content: this.project.contact_name,
              span: 11,
            },
            {
              id: 7,
              prepend: 7,
              header: this.$gettext("Contact email"),
              content: this.project.contact_email,
              span: 13,
            },
          ],
        },
        {
          id: 8,
          prepend: 8,
          header: this.$gettext("Team members"),
          content: this.members,
        },
        {
          id: 9,
          prepend: 9,
          header: this.$gettext("Viewers"),
          content: this.viewers,
        },
      ];
    },
  },
};
</script>

