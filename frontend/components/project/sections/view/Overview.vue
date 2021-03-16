<template>
  <div>
    <view-field
      :prepend="1"
      :header="$gettext('Project Name') | translate"
      :content="project.name"
    />
    <view-field
      :prepend="2"
      :header="$gettext('Organisation') | translate"
      :content="organisation.name"
    />
    <view-field
      :prepend="3"
      :header="$gettext('Project country') | translate"
      :content="country.name"
    />
    <view-field
      :prepend="4"
      :header="$gettext('Geographic scope') | translate"
      :content="project.geographic_scope"
    />
    <view-field
      :prepend="5"
      :header="
        $gettext('Overview of the digital health implementation') | translate
      "
      :content="project.implementation_overview"
    />

    <el-row>
      <el-col :span="11">
        <view-field
          :prepend="6"
          :header="$gettext('Contact name') | translate"
          :content="project.contact_name"
        />
      </el-col>
      <el-col :span="13">
        <view-field
          :prepend="7"
          :header="$gettext('Contact email') | translate"
          :content="project.contact_email"
        />
      </el-col>
    </el-row>

    <view-field
      :prepend="8"
      :header="$gettext('Team members') | translate"
      :content="members"
    />
    <view-field
      :prepend="9"
      :header="$gettext('Viewers') | translate"
      :content="viewers"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters({
      getOrganisationDetails: "system/getOrganisationDetails",
      getCountryDetails: "countries/getCountryDetails",
      getProfiles: "system/getUserProfilesNoFilter",
    }),
    organisation() {
      return this.handleDetails(
        this.project.organisation,
        "getOrganisationDetails"
      );
    },
    country() {
      return this.handleDetails(this.project.country, "getCountryDetails");
    },
    members() {
      return this.handleList(this.project.team);
    },
    viewers() {
      return this.handleList(this.project.viewers);
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
  },
};
</script>

