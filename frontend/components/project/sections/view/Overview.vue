<template>
  <div>
    <loader v-if="loading" />
    <template v-else>
      <template v-for="field in fields">
        <!-- in case of multiple fields -->
        <el-row v-if="field.row" :key="field.prepend">
          <el-col v-for="col in field.fields" :span="col.span">
            <view-field
              :key="col.prepend"
              :prepend="col.prepend"
              :header="col.header"
              :content="col.content"
            />
          </el-col>
        </el-row>
        <!-- one row field -->
        <view-field
          v-else
          :key="field.prepend"
          :prepend="field.prepend"
          :header="field.header"
          :content="field.content"
        />
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import isEmpty from "lodash/isEmpty";
import ViewField from "@/components/project/wrappers/ViewField";
import Loader from "@/components/project/wrappers/Loader";

export default {
  components: {
    ViewField,
    Loader,
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
    project: {
      inmediate: true,
      handler(project) {
        if (!isEmpty(project)) {
          const { organisation, country, team, viewers } = this.project;
          this.organisation = this.handleDetails(
            organisation,
            "getOrganisationDetails"
          );
          this.country = this.handleDetails(country, "getCountryDetails");
          this.members = this.handleList(team);
          this.viewers = this.handleList(viewers);
          this.fields = this.handleFields();
          this.loading = false;
        } else {
          this.loading = true;
        }
      },
    },
  },
  methods: {
    handleDetails(id, method) {
      if (id) {
        return this[method](parseInt(id, 10));
      }
      return {};
    },
    handleList(arr) {
      if (arr) {
        return this.getProfiles
          .filter((p) => arr.includes(p.id) && p.name)
          .map((i) => i.name);
      }
      return [];
    },
    handleFields() {
      return [
        {
          prepend: 1,
          header: this.$gettext("Project Name"),
          content: this.project.name,
        },
        {
          prepend: 2,
          header: this.$gettext("Organisation"),
          content: this.organisation.name,
        },
        {
          prepend: 3,
          header: this.$gettext("Project country"),
          content: this.country.name,
        },
        {
          prepend: 4,
          header: this.$gettext("Geographic scope"),
          content: this.project.geographic_scope,
        },
        {
          prepend: 5,
          header: this.$gettext(
            "Overview of the digital health implementation"
          ),
          content: this.project.implementation_overview,
        },
        {
          prepend: 6,
          row: true,
          fields: [
            {
              prepend: 6,
              header: this.$gettext("Contact name"),
              content: this.project.contact_name,
              span: 11,
            },
            {
              prepend: 7,
              header: this.$gettext("Contact email"),
              content: this.project.contact_email,
              span: 13,
            },
          ],
        },
        {
          prepend: 8,
          header: this.$gettext("Team members"),
          content: this.members,
        },
        {
          prepend: 9,
          header: this.$gettext("Viewers"),
          content: this.viewers,
        },
      ];
    },
  },
};
</script>

