<template>
  <div>
    <simple-field
      :content="project.name"
      :header="$gettext('Project Name') | translate"
      :prepend-label="1"
    />

    <simple-field
      :header="$gettext('Organisation') | translate"
      :prepend-label="2"
    >
      <organisation-item :id="project.organisation" />
    </simple-field>

    <simple-field
      :header="$gettext('Project country') | translate"
      :prepend-label="3"
    >
      <country-item :id="project.country" :show-flag="false" />
    </simple-field>

    <simple-field
      :content="project.geographic_scope"
      :header="$gettext('Geographic scope') | translate"
      :prepend-label="4"
    />

    <simple-field
      :content="project.implementation_overview"
      :header="
        $gettext('Overview of the digital health implementation') | translate
      "
      :prepend-label="5"
    />
    <el-row>
      <el-col :span="12">
        <simple-field
          :content="project.contact_name"
          :header="$gettext('Contact name') | translate"
          :prepend-label="6"
        />
      </el-col>
      <el-col :span="12">
        <simple-field
          :content="project.contact_email"
          :header="$gettext('Contact email') | translate"
          :prepend-label="7"
        />
      </el-col>
    </el-row>
    <div class="GrayArea">
      <simple-field
        :header="$gettext('Team members') | translate"
        :prepend-label="8"
      >
        <team-list :value="project.team" />
      </simple-field>
      <simple-field
        :header="$gettext('Viewers') | translate"
        :prepend-label="9"
      >
        <team-list :value="project.viewers" />
      </simple-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// project components
import SimpleField from "@/components/project/SimpleField";
import TeamList from "@/components/project/TeamList";
// common
import OrganisationItem from "@/components/common/OrganisationItem";
import CountryItem from "@/components/common/CountryItem";

export default {
  components: {
    SimpleField,
    OrganisationItem,
    CountryItem,
    TeamList,
  },
  computed: {
    ...mapGetters({
      draft: "project/getProjectData",
      published: "project/getPublished",
    }),
    route() {
      return this.$route.name.split("__")[0];
    },
    isDraft() {
      return this.route === "organisation-projects-id";
    },
    project() {
      return this.isDraft ? this.draft : this.published;
    },
  },
};
</script>

