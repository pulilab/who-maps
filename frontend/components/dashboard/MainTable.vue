<template>
  <div class="MainTable">
    <vue-good-table
      :columns="columns"
      :rows="projects"
      :sort-options="sortOptions"
      :pagination-options="paginationOptions"
      :select-options="selectOptions"
    >
      <template
        slot="table-row"
        slot-scope="props"
      >
        <div v-if="props.column.field === 'id'">
          <project-card
            :id="props.row.id"
            hide-borders
            show-verified
          />
        </div>
        <div v-if="props.column.field === 'country'">
          <country-item
            :id="props.row.country"
            :show-flag="false"
          />
        </div>
        <div v-if="props.column.field === 'organisation'">
          <organisation-item
            :id="props.row.organisation"
          />
        </div>
        <div v-if="props.column.field === 'donors'">
          <span
            v-for="(donor, index) in props.row.donors"
            :key="index"
          >
            {{ donor }}
          </span>
        </div>
        <div v-if="props.column.field === 'contact_name'">
          <span> {{ props.row.contact_name }}</span>
          <a :href="`mailto:${props.row.contact_email}`"> {{ props.row.contact_email }}</a>
        </div>
        <div v-if="props.column.field === 'implementation_overview'">
          <p> {{ props.row.implementation_overview }}</p>
        </div>
        <div v-if="props.column.field === 'geographic_scope'">
          <p> {{ props.row.geographic_scope }}</p>
        </div>
        <div v-if="props.column.field === 'health_focus_areas'">
          <health-focus-areas-list :value="props.row.health_focus_areas" />
        </div>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
import { mapGetters } from 'vuex';

import ProjectCard from '../common/ProjectCard';
import CountryItem from '../common/CountryItem';
import OrganisationItem from '../common/OrganisationItem';
import HealthFocusAreasList from '../common/list/HealthFocusAreasList';

export default {
  components: {
    VueGoodTable,
    ProjectCard,
    CountryItem,
    OrganisationItem,
    HealthFocusAreasList
  },
  data () {
    return {
      sortOptions: {
        enabled: true
      },
      paginationOptions: {
        enabled: true
      },
      selectOptions: {
        enabled: true
      }
    };
  },
  computed: {
    ...mapGetters({
      columns: 'dashboard/getSelectedColumns',
      projects: 'dashboard/getProjects'
    })
  }
};
</script>

<style lang="less">
@import 'vue-good-table/dist/vue-good-table.css';
.MainTable {
  .NameColumn {
    min-width: 250px;
  }
}
</style>
