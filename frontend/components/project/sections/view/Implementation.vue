<template>
  <div v-loading="loading">
    <view-field v-for="field in fields" :key="field.id" v-bind="field" />
  </div>
  <!-- <sub-level-coverage-field
      v-if="project.coverageType === 1"
      :coverage="project.coverage"
      :coverage-data="project.coverageData"
      :coverage-second-level="project.coverageSecondLevel"
    /> -->
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { isEmpty, flatten } from "lodash";

// project components
import ViewField from "@/components/project/wrappers/ViewField";
import SubLevelCoverageField from "@/components/project/SubLevelCoverageField";

export default {
  components: {
    ViewField,
    SubLevelCoverageField,
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
      dhi: [],
      hfaList: [],
      hfa: [],
      hscList: [],
      hsc: [],
      his: [],
      donors: [],
      coverage: "",
      fields: [],
      // literals
      coverageList: [
        "",
        this.$gettext("Sub National"),
        this.$gettext("National"),
      ],
      investedList: [
        this.$gettext("No, they have not yet contributed"),
        this.$gettext("Yes, they are contributing in-kind people or time"),
        this.$gettext(
          "Yes, there is a financial contribution through MOH budget"
        ),
        this.$gettext("Yes, MOH is fully funding the project"),
      ],
    };
  },
  computed: {
    ...mapGetters({
      getCountry: "countries/getCountryDetails",
      getPlatforms: "projects/getTechnologyPlatforms",
      getDhi: "projects/getDigitalHealthInterventionDetails",
      getHfa: "projects/getHealthFocusAreas",
      getHsc: "projects/getHscChallenges",
      getHis: "projects/getHisBucket",
      getDonors: "system/getDonors",
    }),
    country() {
      if (this.project.country) {
        return this.getCountry(this.project.country);
      }
      return null;
    },
    isGlobalSelected() {
      return this.country.id === process.env.GlobalCountryID;
    },
    isNationalLevelDeployment() {
      return (
        this.project.coverageType === 2 &&
        this.project.national_level_deployment &&
        (this.project.national_level_deployment.clients ||
          this.project.national_level_deployment.facilities ||
          this.project.national_level_deployment.health_workers)
      );
    },
  },
  watch: {
    project(project) {
      if (!isEmpty(project)) {
        const {
          platforms,
          digitalHealthInterventions,
          health_focus_areas,
          hsc_challenges,
          his_bucket,
          donors,
          coverageType,
        } = project;

        this.dhi = this.handleDhiList(platforms, digitalHealthInterventions);
        this.hfaList = this.handleNestedList("getHfa", "health_focus_areas");
        this.hfa = this.handleList(health_focus_areas, "hfaList");
        this.hscList = this.handleNestedList("getHsc", "challenges");
        this.hsc = this.handleList(hsc_challenges, "hscList", "challenge");
        this.his = this.handleList(his_bucket, "getHis");
        this.donors = this.handleList(donors, "getDonors");

        this.coverage = this.isGlobalSelected
          ? this.$gettext("International")
          : this.coverageList[coverageType];

        this.fields = this.handleFields();
        this.loading = false;
      } else {
        this.loading = true;
      }
    },
  },
  methods: {
    handleList(arr, getter, key = "name") {
      if (arr) {
        return this[getter]
          .filter((p) => arr.includes(p.id) && p[key])
          .map((i) => i[key]);
      }
      return [];
    },
    handleNestedList(list, key) {
      return flatten(this[list].map((item) => item[key]));
    },
    handleDhiList(platforms, interventions) {
      return platforms.map((platform) => ({
        name: this.getPlatforms.find((p) => p.id === platform).name,
        categories: interventions
          .filter((i) => i.platform === platform)
          .map((i) => this.getDhi(i.id)),
      }));
    },
    handleFields() {
      return [
        {
          id: 1,
          prepend: 10,
          header: this.$gettext(
            "Software and related Digital Health Interventions (DHI)"
          ),
          content: this.dhi,
          complex: true,
          title: this.$gettext("Software"),
          subtitle: this.$gettext("Digital Health Intervention"),
        },
        {
          id: 2,
          prepend: 11,
          header: this.$gettext("Health focus area (s)"),
          content: this.hfa,
        },
        {
          id: 3,
          prepend: 12,
          header: this.$gettext("Health System Challenges (HSC)"),
          content: this.hsc,
        },
        {
          id: 4,
          prepend: 13,
          header: this.$gettext("Health Information System (HIS)"),
          content: this.his,
        },
        {
          id: 5,
          show: !!(
            this.isNationalLevelDeployment ||
            (this.project.coverage && this.project.coverage.length)
          ),
          header: this.$gettext("Coverage type"),
          content: this.coverage,
        },
        {
          id: 6,
          show: !!this.isNationalLevelDeployment,
          header: this.isGlobalSelected
            ? this.$gettext("International Level Deployment")
            : this.$gettext("National Level Deployment"),
          icon: "el-icon-s-flag",
          row: true,
          fields: [
            {
              id: 1,
              header: this.$gettext("# Health Workers"),
              content: this.project.national_level_deployment?.clients,
              span: 8,
            },
            {
              id: 2,
              header: this.$gettext("# Facilities"),
              content: this.project.national_level_deployment?.facilities,
              span: 8,
            },
            {
              id: 3,
              header: this.$gettext("# Clients"),
              content: this.project.national_level_deployment?.health_workers,
              span: 8,
            },
          ],
        },
        {
          id: 7,
          prepend: 14,
          header: this.$gettext(
            "Has the government financially invested in the project?"
          ),
          content: this.investedList[this.project.government_investor],
        },
        {
          id: 8,
          prepend: 15,
          header: this.$gettext("Implementing partner (s)"),
          content: this.project.implementing_partners,
        },
        {
          id: 9,
          prepend: 16,
          header: this.$gettext("Investor (s)"),
          content: this.donors,
        },
      ];
    },
  },
};
</script>
