<template>
  <div class="RegistryList">
    <div class="DocumentList">
      <PolicyRegistryList
        :documents="documents"
        :actions="false"
        @details="showDocumentDetails"
        class=""
      />
    </div>
    <div class="Pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="pageSizeOption"
        :total="totalDocuments"
        :layout="paginationOrderStr"
      >
        <CurrentPage
          :totalProp="totalDocuments"
          :pageSizeProp="pageSize"
          :currentPageProp="currentPage"
        />
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PolicyRegistryList from '@/components/registry/PolicyRegistryList'
import CurrentPage from '@/components/dashboard/CurrentPage'

export default {
  components: {
    PolicyRegistryList,
    CurrentPage,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizeOption: [10,20,50,100],
      totalDocuments: 120

    }
  },
  computed: {
    ...mapGetters({
      documents: 'registry/getDocuments',
    }),
    paginationOrderStr () {
      const loc = this.$i18n.locale
      return loc === 'ar' ? 'sizes, next, slot, prev' : 'sizes, prev, slot, next'
    },
  },
  methods: {
    ...mapActions({
      openDocumentDialog: 'registry/openPolicyDocumentDialog',
    }),
    showDocumentDetails(doc) {
      this.openDocumentDialog(doc)
    },
  }
}
</script>

<style lang="less">
@import '~assets/style/variables.less';

.RegistryList {
  box-sizing: border-box;
  background-color: white;
  .DocumentList {
    height: calc(100vh - 218px);
    overflow: auto;
  }
}

.Pagination {
  z-index: 5;
  position: relative;
  top: -1px;
  width: 100%;
  height: 53px;
  box-sizing: border-box;
  border: solid @colorGrayLight;
  border-width: 1px 1px 2px;
  background-color: @colorBrandBlueLight;
  text-align: right;

  .el-pagination {
    padding: 11px 15px;
    font-weight: 400;

    .el-pagination__sizes {
      float: left;
      margin: 0;
    }

    .PageCounter {
      display: inline-block;
      margin: 0 10px;
      font-size: @fontSizeSmall;
      color: @colorTextSecondary;
    }

    button {
      padding: 0;
      background-color: transparent;
      transition: @transitionAll;

      &:hover {
        background-color: lighten(@colorBrandBlueLight, 3%);
      }

      i {
        font-size: @fontSizeLarge;
        font-weight: 700;
      }
    }
  }
}
</style>