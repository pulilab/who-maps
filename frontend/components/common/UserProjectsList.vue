<template>
  <div class="UserProjectsList">
    <EmptyProjects v-if="!hasProjects && !loadingProjects && listType === 0" />
    <EmptyArchive v-if="!hasProjects && listType === 1" />
    <EmptyCountryProjects v-if="!hasProjects && !loadingProjects && !hasSearch && listType === 2" />
    <translate tag="div" v-if="!hasProjects && !loadingProjects && hasSearch && listType === 2" class="empty-state">
      Can't find project based on your search query.
    </translate>
    <div v-loading="loadingProjects" class="loading-mask">
      <ExtendedProjectCard
        v-for="project in limited"
        :key="project.id"
        :project-base="project"
        :admin-action="listType === 2"
      />
      <div v-show="listType === 2 && total > 10" class="ProjectsPagination">
        <el-pagination
          v-if="listType === 2"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :page-sizes="pageSizeOption"
          :total="total"
          layout="sizes, prev, slot, next"
        >
          <CurrentPage :total="total" :page-size="pageSize" :page="page" />
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { mapGettersActions } from '@/utilities/form.js'
import EmptyProjects from './EmptyProjects'
import EmptyCountryProjects from './EmptyCountryProjects'
import EmptyArchive from './EmptyArchive'
import ExtendedProjectCard from '../common/ExtendedProjectCard'
import CurrentPage from '../common/CurrentPage'

export default {
  components: {
    EmptyProjects,
    EmptyCountryProjects,
    EmptyArchive,
    ExtendedProjectCard,
    CurrentPage,
  },
  props: {
    projectList: {
      type: Array,
      required: true,
      default: () => []
    },
    listType: {
      type: Number,
      default: 0
    },
    hasSearch: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: null
    }
  },
   data() {
    return {
      pageSizeOption: [10, 20, 50, 100],
    }
  },
  computed: {
    ...mapState({
     loadingProjects: (state) => state.projects.loadingProjects,
   }),
    ...mapGetters({
      page: 'projects/getCurrentPage',
      total: 'projects/getTotal',
    }),
    ...mapGettersActions({
      pageSize: ['projects', 'getPageSize', 'setPageSize', 0],
      currentPage: ['projects', 'getCurrentPage', 'setCurrentPage', 0],
    }),
    limited() {
      return this.limit && this.projectList.length > 3
        ? this.projectList.slice(0, this.limit)
        : this.projectList
    },
    hasProjects() {
      return this.projectList.length > 0
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.empty-state {
  text-align: center;
}
.loading-mask {
  width: 100%;
  min-height: 500px;
}
.UserProjectsList {
  padding: 40px 40px 20px;
  background: url('~assets/img/squares.svg') no-repeat;
  background-position: center 0px;
  min-height: 266px;
}
.ProjectsPagination {
  margin-top: 50px;
  width: 100%;
  background-color: @colorWhite;
  text-align: right;

  .el-pagination {
    padding: 13px 30px;
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
      letter-spacing: 0;
      line-height: 15px;
    }

    button {
      padding: 0;
      background-color: transparent;
      transition: @transitionAll;
      i {
        font-size: @fontSizeLarge !important;
        font-weight: 700 !important;
      }
    }
  }
}
</style>
