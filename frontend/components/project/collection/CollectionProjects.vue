<template>
  <div>
    <AddEditorDialog ref="addEditorDialog" @addedAsEditor="refreshCollection" />
    <div class="ProjectToolbar">
      <span class="label">
        <translate :parameters="{ rows: projectCount }">
          List of projects ({rows})
        </translate>
      </span>
      <div class="search">
        <el-input clearable debounce prefix-icon="el-icon-search" placeholder="Search name, narrative, team member" v-model="search" />
      </div>
      <div class="search">
        <el-select
          clearable
          v-model="statusFilter"
          :placeholder="$gettext('Select status')"
        >
          <el-option key="1" label="Draft" value="draft" />
          <el-option key="2" label="Published" value="published" />
        </el-select>
      </div>
      <div class="search"  v-if="selectableCountries">
        <lazy-el-select
          clearable
          filterable
          v-model="countryFilter"
          :placeholder="$gettext('Select country')"
        >
          <el-option
            v-for="country in selectableCountries"
            :key="country.code"
            :label="country.name"
            :value="country.code"
          />
        </lazy-el-select>
      </div>
      <div class="search" v-if="selectableInvestors">
        <lazy-el-select
            clearable
            filterable
            v-model="investorFilter"
            :placeholder="$gettext('Select investor')"
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
            :placeholder="$gettext('Select organization')"
          >
            <el-option
              v-for="organization in selectableOrganizations"
              :key="organization.name"
              :label="organization.name"
              :value="organization.name"
            />
          </lazy-el-select>
      </div>
      <el-switch v-if="user" v-model="ownedFilter" :active-text="$gettext('My projects')" />
    </div>
    <table class="projects-table">
      <thead>
        <th class="status"><translate>Status</translate></th>
        <th class="editor"><translate>Add editor</translate></th>
        <th><translate>Team member(s)</translate></th>
        <th><translate>Project name</translate></th>
        <th><translate>Country</translate></th>
        <th><translate>Investor(s)</translate></th>
        <th><translate>Organisation</translate></th>
      </thead>
      <tbody>
        <tr v-for="project in paginate(filteredProjects, pageSize, currentPage)" :key="project.id">
          <td class="status">
            <div class="tag" :class="project.status">{{ project.status }}</div>
          </td>
          <td>
            <template v-if="canAddAsEditor(project)">
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
            </template>
            <template v-else>
              <a :href="gotoProject(project.id)" target="_blank" class="goto">
                <translate>Go to project</translate>
              </a>
            </template>
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
          <td 
            :aria-label="project.narrative"
            data-microtip-position="top"
            role="tooltip"
            data-microtip-size="large"
            :class="['project-name-cell',{'active':project.narrative}]"
          >
            <strong>
              {{ project.name }}
            </strong>
            <i v-if="project.narrative" class="el-icon-tickets" />
          </td>
          <td>
            <div class="country">
              <country-flag :code="project.country.code" :small="true"/>
              <label>{{ project.country.name }}</label>
            </div>
          </td>
          <td>
            <ul v-if="project.investors.length > 0" class="team">
              <li v-for="investor in project.investors" :key="investor.id">
                {{ investor.name }}
              </li>
            </ul>
          </td>
          <td>
            <template v-if="project.organization">
              {{ project.organization.name }}
            </template>
          </td>
        </tr>
        <tr v-if="filteredProjects.length === 0">
          <td colspan="7">
            <translate tag="div" class="empty-list">
              There is no project to be shown. Refine your filter or import projects into the collection.
            </translate>
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
import { uniqBy, difference, flatten } from 'lodash'
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
      ownedFilter: false,
      statusFilter: '',
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
      const allOptions = this.collection.projects.map(p => p.country)
      const options = uniqBy(difference(allOptions, ['', undefined, null]), 'code').sort((a,b) => a.name.localeCompare(b.name))
      if(!options.length) return false
      return options
    },
    selectableOrganizations () {
      const allOptions = this.collection.projects.map(p => p.organization)
      const options = uniqBy(difference(allOptions, ['', undefined, null]), 'name').sort((a,b) => a.name.localeCompare(b.name))
      if(!options.length) return false
      return options
    },
    selectableInvestors () {
      const allOptions = flatten(this.collection.projects.filter(p => p.investors.length > 0).map(p => p.investors))
      const options = uniqBy(difference(allOptions, ['', undefined, null]), 'name').sort((a,b) => a.name.localeCompare(b.name))
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
      return this.collection.projects.filter((project) => {
        const members = project.team.reduce((members, m) => {
          const mbs = members += `${m.email} `
          return mbs
        }, '')
        if ((this.countryFilter == '' ? project.country?.code : this.countryFilter) == project.country?.code &&
            (this.statusFilter == '' ? project.status : this.statusFilter) == project.status &&
            (this.ownedFilter ? members.toUpperCase().includes(this.user.email.toUpperCase()) : true) &&
            (this.investorFilter == '' ? true : project.investors.find(i => i.name === this.investorFilter)) &&
            (this.organizationFilter == '' ? project.organization?.name : this.organizationFilter) == project.organization?.name &&
            (this.search == '' ? true : (
              members.toUpperCase().includes(this.search.toUpperCase()) ||
              project?.name.toUpperCase().includes(this.search.toUpperCase()) ||
              project?.narrative?.toUpperCase().includes(this.search.toUpperCase())
            ))) {
            return true
          } else {
            return false
          }
      })
    },
    projectCount() {
      return this.collection?.projects?.length
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
      // this.loadCollection(this.collection.url)
    },
    gotoProject(projectId) {
      return this.localePath({
        name: 'organisation-projects-id',
        params: {
          id: projectId,
          organisation: this.$route.params.organisation
        }
      })
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
    transition: box-shadow .2s ease-in;
    i {
      position: absolute;
      top: 4px;
      right: 4px;
    }
    &.active:hover {
      // background-color: #dde0e738;
      box-shadow: inset 0px 0px 14px 0px #e9e9e9;
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
        min-width: 105px;
        outline: 1px solid @colorBrandPrimary;
        font-weight: bold;
      }
      .goto {
        display: flex;
        align-content: center;
        justify-content: center;
        padding: 6px 10px;
        min-width: 85px;
        text-decoration: none;
        color: @colorBrandPrimary;
        outline: 1px solid @colorBrandPrimary;
        font-size: @fontSizeExtraSmall;
        font-weight: bold;
        &:hover {
          color: @colorWhite;
          background-color: @colorBrandPrimaryLight;
        }
      }
      .country {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        label {
          display: inline-block;
          margin-top: 2px;
        }
      }
      .empty-list {
        padding: 2em;
        display: flex;
        justify-content: center;
        font-size: @fontSizeMedium;
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


// extract from https://github.com/ghosh/microtip

[aria-label][role~="tooltip"] {
  position: relative;
}

[aria-label][role~="tooltip"]::before,
[aria-label][role~="tooltip"]::after {
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
  opacity: 0;
  pointer-events: none;
  transition: all var(--microtip-transition-duration, .18s) var(--microtip-transition-easing, ease-in-out) var(--microtip-transition-delay, 0s);
  position: absolute;
  box-sizing: border-box;
  z-index: 10;
  transform-origin: top;
}

[aria-label][role~="tooltip"]::before {
  background-size: 100% auto !important;
  content: "";
}

[aria-label][role~="tooltip"]::after {
  background: rgba(17, 17, 17, .9);
  border-radius: 4px;
  color: #ffffff;
  content: attr(aria-label);
  box-sizing: content-box;
  font-size: var(--microtip-font-size, 13px);
  font-weight: var(--microtip-font-weight, normal);
  line-height: 17px;
  text-transform: var(--microtip-text-transform, none);
  padding: .8em 1em;
  white-space: nowrap;
}

[aria-label][role~="tooltip"]:hover::before,
[aria-label][role~="tooltip"]:hover::after,
[aria-label][role~="tooltip"]:focus::before,
[aria-label][role~="tooltip"]:focus::after {
  opacity: 1;
  pointer-events: auto;
}

[role~="tooltip"][data-microtip-position|="top"]::before {
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%280%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E") no-repeat;
  height: 6px;
  width: 18px;
  margin-bottom: 5px;
}

[role~="tooltip"][data-microtip-position|="top"]::after {
  margin-bottom: 11px;
}

[role~="tooltip"][data-microtip-position|="top"]::before {
  transform: translate3d(-50%, 0, 0);
  bottom: 100%;
  left: 50%;
}

[role~="tooltip"][data-microtip-position|="top"]:hover::before {
  transform: translate3d(-50%, -5px, 0);
}

[role~="tooltip"][data-microtip-position|="top"]::after {
  transform: translate3d(-50%, 0, 0);
  bottom: 100%;
  left: 50%;
}

[role~="tooltip"][data-microtip-position="top"]:hover::after {
  transform: translate3d(-50%, -5px, 0);
}

[role~="tooltip"][data-microtip-size="small"]::after {
  white-space: initial;
  max-width: 80px;
}

[role~="tooltip"][data-microtip-size="medium"]::after {
  white-space: initial;
  max-width: 150px;
}

[role~="tooltip"][data-microtip-size="large"]::after {
  white-space: initial;
  max-width: 480px;
}

</style>
