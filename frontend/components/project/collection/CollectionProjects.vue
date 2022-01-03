<template>
  <div>
    <add-editor-dialog ref="addEditorDialog" @addedAsEditor="refreshCollection" />
    <div class="ProjectToolbar">
      <span class="label">
        <translate :parameters="{ rows: collection.projects.length }">
          List of projects ({rows})
        </translate>
      </span>
      <div class="search">
        <el-input clearable debounce prefix-icon="el-icon-search" placeholder="search" v-model="search" />
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
        <tr v-for="project in filteredProjects" :key="project.id">
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
              <add-editor-popover v-else />
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
          <td>
            <strong>{{ project.name }}</strong>
          </td>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CountryFlag from '@/components/common/CountryFlag.vue'
import AddEditorPopover from '@/components/project/collection/AddEditorPopover'
import AddEditorDialog from '@/components/project/collection/AddEditorDialog'

export default {
  components: {
    CountryFlag,
    AddEditorPopover,
    AddEditorDialog
  },
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getProfile'
    }),
    filteredProjects () {
      return this.collection.projects.filter((item) => {
        const members = item.team.reduce((members, m) => {
          const mbs = members += `${m.email} `
          return mbs
        }, '')
        return members.toUpperCase().includes(this.search.toUpperCase()) ||
               item?.name.toUpperCase().includes(this.search.toUpperCase()) ||
               item.country?.name?.toUpperCase().includes(this.search.toUpperCase()) ||
               item.investor?.name?.toUpperCase().includes(this.search.toUpperCase()) ||
               item.organization?.name?.toUpperCase().includes(this.search.toUpperCase())
      })
    }
  },
  methods: {
    ...mapActions({
      loadCollection: 'admin/import/loadCollection'
    }),
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

<style lang="less" scoped>
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';

.ProjectToolbar {
  display: flex;
  align-items: space;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  margin: 20px 0;
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
</style>
