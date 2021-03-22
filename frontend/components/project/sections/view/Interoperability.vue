<template>
  <div v-loading="loading">
    <view-field v-for="field in fields" :key="field.id" v-bind="field" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isEmpty } from "lodash";
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
      interoperability: [],
      standards: [],
      fields: [],
    };
  },
  computed: {
    ...mapGetters({
      getInteroperabilityLinks: "projects/getInteroperabilityLinks",
      getStandards: "projects/getInteroperabilityStandards",
    }),
  },
  watch: {
    project(project) {
      if (!isEmpty(project)) {
        const { interoperability_links, interoperability_standards } = project;
        this.interoperability = this.handleInteroperability(
          interoperability_links
        );
        this.standards = getList(interoperability_standards, this.getStandards);
        this.fields = this.handleFields();
        this.loading = false;
      } else {
        this.loading = true;
      }
    },
  },
  methods: {
    handleInteroperability(links) {
      return Object.values(links)
        .filter((il) => !!(il.selected && il.link))
        .map((il) => ({
          ...il,
          id: this.getInteroperabilityLinks[il.index].id,
          label: `${this.getInteroperabilityLinks[il.index].pre} ${
            this.getInteroperabilityLinks[il.index].name
          }`,
        }));
    },
    handleFields() {
      return [
        {
          id: 1,
          prepend: 22,
          header: this.$gettext("What other system do you interoperate with ?"),
          interoperability: true,
          content: this.interoperability,
        },
        {
          id: 2,
          prepend: 23,
          header: this.$gettext(
            "What data standards does your digital health project use?"
          ),
          content: this.standards,
        },
      ];
    },
  },
};
</script>

