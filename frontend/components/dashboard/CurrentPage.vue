<template>
  <span class="PageCounter">
    <translate :parameters="{min, max, total}">
      {min}-{max} of {total}
    </translate>
  </span>
</template>

<script>
/*
This componenet can be used with the data from the store
or by providing the props. The props will override the store.
*/

import { mapGetters } from 'vuex'

export default {
  props: {
    totalProp: {
      type: Number,
      default: null
    },
    pageSizeProp: {
      type: Number,
      default: null
    },
    currentPageProp: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      totalFromStore: 'dashboard/getTotal',
      pageSizeFromStore: 'dashboard/getPageSize',
      currentPageFromStore: 'dashboard/getCurrentPage'
    }),
    total () {
      return this.totalProp ?? this.totalFromStore
    },
    pageSize () {
      return this.pageSizeProp ?? this.pageSizeFromStore
    },
    currentPage () {
      return this.currentPageProp ?? this.currentPageFromStore
    },
    min () {
      return 1 + this.pageSize * (this.currentPage - 1)
    },
    max () {
      const max = this.pageSize * this.currentPage
      return max < this.total ? max : this.total
    }
  }
}
</script>

<style>

</style>
