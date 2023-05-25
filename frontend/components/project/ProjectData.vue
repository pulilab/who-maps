<template>
  <el-row type="flex" class="project-view">
    <div v-if="!published" class="draft-banner">
      <fa icon="pen" size="lg" />
    </div>
    <el-col :span="6" class="sidebar">
      <Navigation
        :items="sections"
        :selected="selected"
        sticky
        @click="handleNavigation"
      >
        <template v-if="user">
          <el-button
            v-if="showPublishLink"
            type="primary"
            :plain="true"
            class="link-button"
            @click="toEdit"
          >
            <translate>Review and publish</translate>
            <i class="el-icon-arrow-right el-icon-right"></i>
          </el-button>
          <ViewActions :actions="actions" @click="handleActions" />
        </template>
      </Navigation>
    </el-col>
    <el-col :span="18" class="main">
      <section v-for="section in sections" :key="section.id">
        <Observer
          :options="{ root: null, rootMargin: '0px', threshold: 0.5 }"
          :target="section.id"
          @intersect="intersected"
        >
          <h1 :ref="section.id">
            {{ `${section.prepend}.  ${section.title}` }}
          </h1>
        </Observer>
        <component :is="section.component" v-bind="{ ...section.properties, project }" />
      </section>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// project components
import Navigation from '@/components/project/Navigation'
import ViewActions from '@/components/project/ViewActions'

// sections
import Overview from '@/components/project/sections/view/Overview'
import Implementation from '@/components/project/sections/view/Implementation'
import Stages from '@/components/project/sections/view/Stages'
import Technology from '@/components/project/sections/view/Technology'
import Interoperability from '@/components/project/sections/view/Interoperability'
import Custom from '@/components/project/sections/view/Custom'
// utilities components
import Observer from '@/components/common/Observer'

export default {
  components: {
    Navigation,
    ViewActions,
    Overview,
    Implementation,
    Stages,
    Technology,
    Interoperability,
    Custom,
    Observer
  },
  props: {
    published: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true,
      sections: [
        {
          id: 'general',
          nav: this.$gettext('General'),
          title: this.$gettext('General Overview'),
          prepend: 1,
          component: 'Overview'
        },
        {
          id: 'implementation',
          nav: this.$gettext('Implementation'),
          title: this.$gettext('Implementation Overview'),
          prepend: 2,
          component: 'Implementation'
        },
        {
          id: 'stages',
          nav: this.$gettext('Stages'),
          title: this.$gettext('Completion of Project stages'),
          prepend: 3,
          component: 'Stages'
        },
        {
          id: 'technology',
          nav: this.$gettext('Technology'),
          title: this.$gettext('Technology overview'),
          prepend: 4,
          component: 'Technology'
        },
        {
          id: 'interoperability',
          nav: this.$gettext('Interoperability'),
          title: this.$gettext('Interoperability & standards'),
          prepend: 5,
          component: 'Interoperability'
        }
      ],
      selected: 'general',
      actions: [],
      project: {}
    }
  },
  computed: {
    ...mapGetters({
      projectDraft: 'project/getProjectData',
      projectPublished: 'project/getPublished',
      getCountryDetails: 'countries/getCountryDetails',
      getDonorDetails: 'system/getDonorDetails',
      user: 'user/getProfile'
    }),
    isTeam () {
      if (this.user) {
        return this.user.member.includes(+this.$route.params.id)
      }
      return false
    },
    showPublishLink() {
      return this.isTeam && !this.published
    },
    editLink() {
      return this.localePath({
        name: 'organisation-projects-id-edit',
        params: { id: this.$route.params.id, organisation: this.$route.params.organisation }
      })
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.handleInit()
  },
  methods: {
    ...mapActions({
      publishProject: 'project/publishProject',
      discardDraft: 'project/discardDraft',
      unpublishProject: 'project/unpublishProject',
      archiveProject: 'project/archiveProject'
    }),
    handleInit () {
      this.handleProject()
      this.handleConfigActions()
      this.handleCustomFields()
    },
    // project state selection
    handleProject () {
      this.published
        ? (this.project = this.projectPublished)
        : (this.project = this.projectDraft)
    },
    // configure loaders, usability and permissions for actions
    handleConfigActions () {
      // const print = {
      //   id: "print",
      //   type: "primary",
      //   icon: "el-icon-printer",
      //   plain: true,
      //   label: this.$gettext("Print draft"),
      //   handle: "handlePrint",
      //   success: {
      //     title: this.$gettext("Congratulations"),
      //     message: this.$gettext(
      //       "You can see the print version on a new window"
      //     ),
      //   },
      //   error: {
      //     title: this.$gettext("Error"),
      //     message: this.$gettext("Is not possible to print. Try again."),
      //     type: "error",
      //   },
      // };
      const info = {
        title: this.$gettext('Info'),
        message: this.$gettext('Action cancelled'),
        type: 'info'
      }
      if (this.isTeam) {
        if (this.published) {
          this.actions = [
            {
              id: 'unpublish',
              type: 'danger',
              icon: 'el-icon-delete',
              plain: true,
              label: this.$gettext('Unpublish'),
              handle: 'unpublishProject',
              confirm: {
                title: this.$gettext('Attention'),
                description: this.$gettext(
                  'The current project will be unpublished'
                )
              },
              route: {
                name: 'organisation-projects-id-edit',
                params: { ...this.$route.params }
              },
              success: {
                title: this.$gettext('Congratulations'),
                message: this.$gettext('Project has been unpublished')
              },
              error: info
            }
            // { ...print, label: this.$gettext("Print project") },
          ]
        } else {
          this.actions = [
            /* {
              id: 'draft',
              type: 'success',
              icon: 'el-icon-upload2',
              label: this.$gettext('Publish draft'),
              handle: 'publishProject',
              route: {
                name: 'organisation-projects-id-published',
                params: { ...this.$route.params }
              },
              success: {
                title: this.$gettext('Congratulations'),
                message: this.$gettext('Your draft has been published')
              },
              error: {
                title: this.$gettext('Error'),
                message: this.$gettext('We could not publish. Try again'),
                type: 'error'
              }
            }, */
            {
              id: 'discard',
              type: 'danger',
              icon: 'el-icon-delete',
              plain: true,
              label: this.$gettext('Discard draft'),
              handle: 'discardDraft',
              confirm: {
                title: this.$gettext('Warning'),
                description: this.$gettext(
                  'The current draft will be overwritten by the published version'
                )
              },
              success: {
                title: this.$gettext('Congratulations'),
                message: this.$gettext('Draft has been discarded')
              },
              error: info
            }
            // print,
          ]
        }
        this.actions.push({
          id: 'archive',
          type: 'danger',
          icon: 'el-icon-takeaway-box',
          plain: true,
          label: this.$gettext('Archive project'),
          handle: 'handleArchiveProject',
          confirm: {
            title: this.$gettext('Attention'),
            description: this.$gettext(
              'The current project will be archived. You will find it on "My projects" page where you can initiate to restore it if needed.'
            )
          },
          success: {
            title: this.$gettext('Congratulations'),
            message: this.$gettext('Project has been archived.')
          },
          error: info
        })
      }
    },
    toEdit() {
      const path = this.localePath({
        name: 'organisation-projects-id-edit',
        params: { id: this.$route.params.id, organisation: this.$route.params.organisation }
      })
      this.$router.push(path)
    },
    // handle custom fields
    handleCustomFields () {
      const { country: countryId, donors: donorsId } = this.project
      this.sections = [
        ...this.sections,
        ...this.getCustomFields(
          [
            ...this.getCustomDetails(
              [countryId],
              'getCountryDetails',
              'country_questions'
            ),
            ...this.getCustomDetails(
              donorsId,
              'getDonorDetails',
              'donor_questions'
            )
          ],
          this.sections
        )
      ]
    },
    getCustomDetails (items, getDetails, key) {
      // we get  detail information for custom fields
      return items
        .map(d => this[getDetails](d))
        .filter(d => d[key] && d[key].length > 0)
        .map(d => ({ ...d, questions: d[key] }))
    },
    getCustomFields (items, sections) {
      // we set an object for component use and menu
      let prepend = sections.length
      return items.map(item => {
        prepend += 1
        return {
          id: item.name,
          nav: this.$gettext('{name} fields', { name: item.name }),
          title: this.$gettext('{name} custom fields', {
            name: item.name
          }),
          prepend,
          component: 'Custom',
          properties: {
            items: item.questions
          }
        }
      })
    },
    // manage navigation
    handleNavigation (target) {
      this.$refs[target][0].scrollIntoView({
        behavior: 'smooth'
      })
    },
    intersected (target) {
      this.selected = target
    },
    // manage button actions
    handleActions (handle) {
      this.handleRequest(this.actions.find(action => action.handle === handle))
    },
    async handleRequest ({ handle, route, success, error, confirm }) {
      try {
        this.handleLoaders(handle)
        if (confirm) {
          await this.handleConfirm(confirm)
        }
        await this[handle](this.$route.params.id)
        if (route) {
          this.handleRoute(route)
        }
        this.handleNotification(success)
        this.handleLoaders()
      } catch (e) {
        this.handleLoaders()
        this.handleNotification(error)
      }
    },
    handleLoaders (handle = '') {
      this.actions = this.actions.map(action => {
        const loaders = handle
          ? {
            loading: action.handle === handle,
            disabled: action.handle !== handle
          }
          : { loading: false, disabled: false }
        return {
          ...action,
          ...loaders
        }
      })
    },
    handleRoute (obj) {
      this.$router.push(this.localePath(obj))
    },
    handleNotification (obj) {
      this.$notify({
        type: 'success',
        position: 'top-left',
        ...obj
      })
    },
    async handleConfirm ({ description, title, options }) {
      await this.$confirm(
        description,
        title,
        options || {
          confirmButtonText: this.$gettext('Ok'),
          cancelButtonText: this.$gettext('Cancel'),
          type: 'warning'
        }
      )
    },
    async handlePrint () {
      // pending to ask
      await new Promise(resolve => {
        setTimeout(() => {
          resolve('Listo para imprimir')
        }, 2000)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';

.project-view {
  .sidebar,
  .main {
    padding: 50px;
    background-color: @colorWhite;
  }
  .sidebar {
    background-color: #f8f8f8;
  }
  .main {
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.12);
    h1 {
      font-size: 24px;
      font-style: italic;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 48px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 15px;
      margin: 0 0 60px 0;
    }
  }
  .draft-banner {
    position: absolute;
    right: 0;
    width: 0;
    height: 0;
    border-top: 70px solid @colorDraft;
    border-left: 70px solid transparent;
    svg {
      position: absolute;
      right: 3px;
      top: -58px;
    }
  }
  .button-plain(@color; @percentage: 5%) {
    background-color: white;

    color: @color;
    border: 1px solid @color!important;
    &:hover {
      color: lighten(@color, @percentage);
      border: 1px solid lighten(@color, @percentage) !important;
    }
  }

  .link-button {
    width: 100%;
    font-size: 18px;
    margin-bottom: 20px;
    .button-plain(@colorBrandPrimary);
  }
}
</style>
