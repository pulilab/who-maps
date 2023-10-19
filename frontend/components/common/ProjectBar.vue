<template>
  <div class="ProjectBar">
    <div class="ProjectBarWrapper">
      <el-row
        type="flex"
        justify="space-between"
        :class="user ? '' : 'project-bar-wrapper--margin-bottom'"
      >
        <el-col
          :span="12"
          class="ProjectName"
        >
          <div>
            {{ project.name }}
            <project-legend :id="project.id" />
          </div>
        </el-col>

        <el-col
          :span="12"
          class="ProjectInfo"
        >
          <el-row
            type="flex"
            justify="end"
          >
            <el-col
              :span="8"
              class="InfoSection"
            >
              <div class="Label">
                <translate>Last Updated</translate>
              </div>
              <div class="Info">
                {{ modified }}
              </div>
            </el-col>
            <el-col
              v-show="user"
              :span="8"
              class="InfoSection"
            >
              <div class="Label">
                <translate>Organisation</translate>
              </div>
              <div class="Info">
                <organisation-item :id="project.organisation" />
              </div>
            </el-col>
            <el-col
              v-show="project.contact_email"
              :span="8"
              class="InfoSection"
            >
              <div class="Label">
                <translate>Contact person</translate>
                <CountryAdminsPopover :admins="publicProfile.admins" />
              </div>
              <div class="Info">
                <a
                  :href="`mailto:${project.contact_email}`"
                  class="NuxtLink Small IconRight"
                >
                  {{ project.contact_name }}
                  <fa icon="envelope" />
                </a>
              </div>
            </el-col>
            <el-col
              v-show="publicProfile.public_id"
              :span="8"
              class="InfoSection"
            >
              <UidPopOver
                :uid="publicProfile.public_id"
                type="infoSection"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <div
        v-show="user"
        class="ProjectMenu"
      >
        <template v-for="link in links">
          <nuxt-link
            v-if="link.conditional"
            :key="link.route"
            :class="handleActive(link.route)"
            :to="handleLinkTo(link.route)"
          >
            {{ link.title }}
          </nuxt-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import OrganisationItem from './OrganisationItem'
import ProjectLegend from './ProjectLegend'
import UidPopOver from '@/components/common/UidPopOver'
import CountryAdminsPopover from '@/components/common/CountryAdminsPopover'

export default {
  components: {
    OrganisationItem,
    ProjectLegend,
    UidPopOver,
    CountryAdminsPopover,
  },
  data () {
    return {
      publicProfile: {}
    }
  },
  computed: {
    ...mapGetters({
      draft: 'project/getProjectData',
      published: 'project/getPublished',
      user: 'user/getProfile'
    }),
    project () {
      return this.published && this.published.name
        ? this.published
        : this.draft
    },
    id () {
      return parseInt(this.$route.params.id, 10)
        ? +this.$route.params.id
        : this.$route.params.id
    },
    route () {
      return this.$route.name.split('__')[0]
    },
    isTeam () {
      if (this.user) {
        return this.user.member.includes(+this.$route.params.id)
      }
      return false
    },
    isViewer () {
      if (this.user) {
        return (
          this.user.is_superuser ||
          this.user.viewer.includes(+this.$route.params.id)
        )
      }
      return true
    },
    anon () {
      return !this.isViewer && !this.isTeam
    },
    modified () {
      if (this.project) {
        return format(this.project.modified, 'DD-MM-YYYY')
      }
      return null
    },
    links () {
      return [
        {
          conditional: this.published.name,
          route: 'published',
          title: this.$gettext('View Published')
        },
        {
          conditional: this.isTeam,
          route: '',
          title: this.$gettext('View Draft')
        },
        {
          conditional: this.isTeam,
          route: 'edit',
          title: this.$gettext('Edit Draft')
        },
        {
          conditional: this.isTeam,
          route: 'stages',
          title: this.$gettext('Stages')
        },
        {
          conditional: true,
          route: 'assessment',
          title: this.$gettext('Assessment')
        },
        {
          conditional: this.isTeam,
          route: 'toolkit',
          title: this.$gettext('Update score')
        },
        {
          conditional: this.isTeam,
          route: 'toolkit-scorecard',
          title: this.$gettext('Summary score')
        }
      ]
    }
  },
  async mounted () {
    this.publicProfile = await this.handlePublicProfile()
  },

  methods: {
    async handlePublicProfile () {
      const { data } = await this.$axios.get(`/api/projects/${this.id}/`)
      return data
    },
    handleLinkTo (name = '') {
      return this.localePath({
        name: `organisation-projects-id${name ? `-${name}` : ''}`,
        params: { id: this.id, organisation: this.$route.params.organisation }
      })
    },
    handleActive (name = '') {
      return {
        Active:
          `organisation-projects-id${name ? `-${name}` : ''}` === this.route
      }
    }
  }
}
</script>

<style lang="less">
@import ".~assets/style/variables.less";
@import ".~assets/style/mixins.less";

.ProjectBar {
  background-color: @colorWhite;
  border-bottom: 1px solid @colorGrayLight;

  .ProjectBarWrapper {
    overflow: hidden;
    .limitPageWidth();
  }

  .project-bar-wrapper--margin-bottom {
    margin-bottom: 10px;
  }

  .ProjectName {
    margin: 14px 0 0;
    color: @colorTextPrimary;
    font-size: @fontSizeLarge;
    line-height: 22px;
    font-weight: 700;

    > div {
      position: relative;
      display: inline-block;
      max-width: 100%;
      padding-right: 50px;
      .textTruncate();
    }

    .ProjectLegend {
      position: absolute;
      top: -2px;
      right: 25px;
    }
  }

  .ProjectInfo {
    width: auto;

    .InfoSection {
      width: auto;
      white-space: nowrap;
      margin: 10px 0 0;
      padding: 2px 20px;
      border-left: 1px solid @colorGrayLighter;

      &:last-of-type {
        padding-right: 10px;
      }

      .Label {
        margin: 0 0 4px;
        font-size: @fontSizeSmall - 1;
        color: @colorGray;
        i {
          cursor: pointer;
          &:hover {
            color: @colorBrandPrimary;
          }
        }
      }

      .Info {
        font-size: @fontSizeSmall;
        font-weight: 700;
        color: @colorTextPrimary;
      }
    }
  }

  .ProjectMenu {
    margin: 5px 0 0 -10px;
    a {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      line-height: 40px;
      padding: 0 10px;
      font-size: @fontSizeBase;
      font-weight: 700;
      color: @colorTextSecondary;
      text-decoration: none;
      transform: translateY(-4px);
      transition: @transitionAll;
      &.Active,
      &.nuxt-link-exact-active {
        color: @colorBrandPrimary !important;

        &::before {
          background-color: @colorBrandPrimary;
          transform: translateY(3px);
        }
      }

      &::before {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        display: inline-block;
        width: 100%;
        height: 4px;
        background-color: @colorGray;
        transform: translateY(7px);
        transition: @transitionAll;
      }

      &:hover {
        color: @colorTextPrimary;
      }
    }
  }
}
</style>
