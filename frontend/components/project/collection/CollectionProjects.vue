<template>
  <div>
    <AddEditorDialog ref="addEditorDialog" @addedAsEditor="refreshCollection" />
    <div class="ProjectToolbar">
      <span class="label">
        <translate :parameters="{ rows: collection.projects.length }">
          List of projects ({rows})
        </translate>
      </span>
      <div class="search">
        <el-input clearable debounce prefix-icon="el-icon-search" placeholder="Search name, narrative, team member" v-model="search" />
      </div>
      <div class="search"  v-if="selectableCountries">
        <lazy-el-select
          clearable
          filterable
          v-model="countryFilter"
          :placeholder="$gettext('Select country') | translate"
        >
          <el-option
            v-for="country in selectableCountries"
            :key="country.code"
            :label="country.name"
            :value="country.code"
          />
        </lazy-el-select>
      </div>
      <div class="search"  v-if="selectableInvestors">
        <lazy-el-select
            clearable
            filterable
            v-model="investorFilter"
            :placeholder="$gettext('Select investor') | translate"
          >
            <el-option
              v-for="investors in selectableInvestors"
              :key="investors.name"
              :label="investors.name"
              :value="investors.name"
            />
          </lazy-el-select>
      </div>
      <div class="search" v-if="selectableOrganizations">
        <lazy-el-select
            clearable
            filterable
            v-model="organizationFilter"
            :placeholder="$gettext('Select organization') | translate"
          >
            <el-option
              v-for="organization in selectableOrganizations"
              :key="organization.name"
              :label="organization.name"
              :value="organization.name"
            />
          </lazy-el-select>
      </div>
    </div>
    <table class="projects-table">
      <thead>
        <th class="status"><translate>Status</translate></th>
        <th class="editor"><translate>Add editor</translate></th>
        <th><translate>Team member(s)</translate></th>
        <th><translate>Project name</translate></th>
        <th><translate>Country</translate></th>
        <th><translate>Investor</translate></th>
        <th><translate>Organization</translate></th>
      </thead>
      <tbody>
        <tr v-for="project in paginate(filteredProjects, pageSize, currentPage)" :key="project.id">
          <td class="status">
            <div class="tag" :class="project.status">{{ project.status }}</div>
          </td>
          <td>
            <div v-if="canAddAsEditor(project)">
              <el-button
                v-if="user"
                type="primary"
                size="mini"
                class="editor"
                @click="addAsEditor(project)"
              >
                <translate>
                  Add me as editor
                </translate>
              </el-button>
              <AddEditorPopover v-else />
            </div>
          </td>
          <td>
            <ul class="team">
              <li
                v-for="member in project.team"
                :key="member.id"
                :class="{'same': sameUser(member.email)}"
              >
                {{ member.email }}
              </li>
            </ul>
          </td>
          <el-tooltip :disabled="!project.narrative" :content="project.narrative" placement="top">
            <td class="project-name-cell">
              <strong>
                {{ project.name }}
              </strong>
              <i v-if="project.narrative" class="el-icon-tickets" />
            </td>
          </el-tooltip>            
          <td>
            <div class="country">
              <country-flag :code="project.country.code" :small="true"/>
              <label>{{ project.country.name }}</label>
            </div>
          </td>
          <td>
            <template v-if="project.investor">
            {{ project.investor.name }}
            </template>
          </td>
          <td>
            <template v-if="project.organization">
              {{ project.organization.name }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="Pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="pageSizeOption"
        :total="totalFilteredProjects"
        :layout="paginationOrderStr"
      >
        <CurrentPage
          :totalProp="totalFilteredProjects"
          :pageSizeProp="pageSize"
          :currentPageProp="currentPage"
        />
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { uniqBy, difference } from 'lodash'
import CountryFlag from '@/components/common/CountryFlag.vue'
import AddEditorPopover from '@/components/project/collection/AddEditorPopover'
import AddEditorDialog from '@/components/project/collection/AddEditorDialog'
import CurrentPage from '@/components/dashboard/CurrentPage'

export default {
  components: {
    CountryFlag,
    AddEditorPopover,
    AddEditorDialog,
    CurrentPage
  },
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      search: '',
      countryFilter: '',
      investorFilter: '',
      organizationFilter: '',
      currentPage: 1,
      pageSize: 10,
      pageSizeOption: [10,20,50,100]
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getProfile'
    }),
    selectableCountries () {
      const allOptions = this.collection.projects.map( p => p.country )
      const options = uniqBy(difference(allOptions, ['', undefined, null]), 'code')
      if(!options.length) return false
      return options
    },
    selectableOrganizations () {
      const allOptions = this.collection.projects.map( p => p.organization )
      const options = uniqBy(difference(allOptions, ['', undefined, null]), 'name')
      if(!options.length) return false
      return options
    },
    selectableInvestors () {
      const allOptions = this.collection.projects.map( p => p.investor )
      const options = uniqBy(difference(allOptions, ['', undefined, null]), 'name')
      if(!options.length) return false
      return options
    },
    totalFilteredProjects () {
      return this.filteredProjects.length
    },
    paginationOrderStr () {
      const loc = this.$i18n.locale
      return loc === 'ar' ? 'sizes, next, slot, prev' : 'sizes, prev, slot, next'
    },
    filteredProjects () {
      return this.collection.projects.filter((item) => {const members = item.team.reduce((members, m) => {
          const mbs = members += `${m.email} `
          return mbs
        }, '')
        if ((this.countryFilter == '' ? item.country?.code : this.countryFilter) == item.country?.code &&
            (this.investorFilter == '' ? item.investor?.name : this.investorFilter) == item.investor?.name &&
            (this.organizationFilter == '' ? item.organization?.name : this.organizationFilter) == item.organization?.name &&
            (this.search == '' ? true : (
              members.toUpperCase().includes(this.search.toUpperCase()) ||
              item?.name.toUpperCase().includes(this.search.toUpperCase()) ||
              item?.narrative?.toUpperCase().includes(this.search.toUpperCase())
            ))) {
            return true
          }else{
            return false
          }
      })
    }
  },
  methods: {
    ...mapActions({
      loadCollection: 'admin/import/loadCollection'
    }),
    paginate(array, page_size, page_number) {
      return array.slice((page_number - 1) * page_size, page_number * page_size);
    },
    canAddAsEditor (project) {
      return project.status === 'draft' && !project.team.some(t => t.email === this?.user?.email)
    },
    sameUser (member) {
      return member === this?.user?.email
    },
    addAsEditor (project) {
      this.$refs.addEditorDialog.open({
        collection_url: this.collection.url,
        id: project.id
      })
    },
    refreshCollection () {
      this.loadCollection(this.collection.url)
    }
  }

}
</script>

<style lang="less">
@import '~assets/style/variables.less';

.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}

.ProjectToolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 36px;
  line-height: 36px;
  margin: 20px 0;
  .label {
    flex: 1;
  }
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  font-size: @fontSizeSmall;

  th {
    &.status {
      width: 107px;
      text-align: center;
    }
    &.editor {
      width: 126px;
      text-align: center;
    }
  }

  .project-name-cell {
    position: relative;
    i {
      position: absolute;
      top: 4px;
      right: 4px;
    }
  }

  .tag {
    width: 84px;
    text-align: center;
    height: 26px;
    line-height: 26px;
    font-size: @fontSizeExtraSmall;
    font-weight: bold;
    &.draft {
      background-color: @colorDraft;
      color: @colorTextPrimary;
    }
    &.published {
      background-color: @colorPublished;
      color: white;
    }
  }

  .team {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      padding: 4px;
      &.same {
        font-weight: bold;
      }
    }
  }

  thead {
    text-align: left;
    th {
      height: 42px;
      box-sizing: border-box;
      background-color: @colorBrandBlueLight;
      padding: 0 10px;
      border-left: 1px solid #DDE0E7;
      border-bottom: 2px solid #BDBDBD;
      span {
        flex-grow: 1;
      }
    }
    th:last-child {
      border-right: 1px solid #DDE0E7;
    }
  }
  tbody {
    td {
      border: 1px solid #DDE0E7;
      padding: 10px;
      vertical-align: top;
      .editor {
        padding: 5px 10px;
        font-size: 11px;
        font-weight: normal;
      }
      .country {
        display: flex;
        align-items: start;
        gap: 8px;
        label {
          display: inline-block;
          margin-top: 2px;
        }
      }
    }
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
