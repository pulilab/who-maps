<template>
  <div v-loading="loading">
    <view-field v-for="field in fields" :key="field.id" v-bind="field" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isEmpty } from "lodash";
import { getList, getDate } from "@/utilities/projects";

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
      licenses: [],
    };
  },
  computed: {
    ...mapGetters({
      getLicenses: "projects/getLicenses",
    }),
    fields() {
      if (!isEmpty(this.project)) {
        const { licenses } = this.project;
        this.licenses = getList(licenses, this.getLicenses);
        this.loading = false;
        return this.handleFields();
      } else {
        this.loading = true;
        return [];
      }
    },
  },
  methods: {
    handleFields() {
      return [
        {
          id: 1,
          // prepend: 21,
          header: this.$gettext("Technology deployment date"),
          content: getDate(this.project.implementation_dates),
        },
        {
          id: 2,
          prepend: 21,
          header: this.$gettext("Under what license is the project governed"),
          content: this.licenses,
        },
        {
          id: 3,
          prepend: 22,
          header: this.$gettext("Code documentation or download link"),
          content: this.project.repository,
          link: true,
        },
        {
          id: 4,
          prepend: 23,
          header: this.$gettext("Link to the application"),
          content: this.project.mobile_application,
          link: true,
        },
        {
          id: 5,
          prepend: 24,
          header: this.$gettext("Link to wiki or project website"),
          content: this.project.wiki,
          link: true,
        },
      ];
    },
  },
};
</script>
