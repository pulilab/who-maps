<template>
  <div class="MainTable">
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :fixed-header="true"
      :sort-options="sortOptions"
      :pagination-options="paginationOptions"
      :select-options="selectOptions"
    />
  </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table';
import { mapGetters } from 'vuex';

export default {
  components: {
    VueGoodTable
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
      rows: 'dashboard/getRows'
    })
  }
};
</script>

<style lang="less">
@import 'vue-good-table/dist/vue-good-table.css';

</style>
