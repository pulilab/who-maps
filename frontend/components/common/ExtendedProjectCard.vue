<template>
  <el-card :body-style="{ padding: '0px' }" :class="`ExtendedProjectCard rounded ${archiveStyle}`">
    <div>
      <el-row type="flex" align="center" :class="`FirstRow ${archiveStyle}`">
        <el-col :span="15" class="ProjectName">
          <el-row class="FirstSubRow">
            <el-col>
              {{ projectData.name }}
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" class="SecondSubRow">
            <el-col>
              <country-item :id="projectData.country" :show-flag="true" />
            </el-col>
            <el-col>
              <organisation-item :id="projectData.organisation" />
            </el-col>
          </el-row>
        </el-col>

        <el-col
          v-show="project.public_id"
          :span="4"
          class="ProjectMeta ProjectMeta--no-border-left"
        >
          <UidPopOver :uid="project.public_id" />
        </el-col>

        <el-col :span="4" class="ProjectMeta">
          <div class="Donors">
            <div>
              {{ donors }}
            </div>
            <span><translate>Investor(s)</translate></span>
          </div>
        </el-col>
        <el-col :span="4" class="ProjectMeta">
          <div class="LastChange">
            <div>
              {{ lastChange }}
            </div>
            <span><translate>Updated on</translate></span>
          </div>
          <project-legend :id="projectBase.id" />
        </el-col>
      </el-row>

      <el-row
        type="flex"
        justify="space-between"
        align="center"
        :class="`SecondRow ${archiveStyle}`"
      >
        <el-col>
          <ProjectStatusBadge :status="projectStatus" />
        </el-col>
        <el-col class="flex">
          <el-row v-if="project.archived" type="flex" justify="end" class="RestoreAction" @click.native="openFeedback">
            <i class="el-icon-upload2"></i>
            <translate>Restore</translate>
          </el-row>
          <ProjectCardActions v-else :project="project" :force-show="false" />
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'

import CountryItem from './CountryItem'
import OrganisationItem from './OrganisationItem'
import ProjectCardActions from './ProjectCardActions'
import ProjectStatusBadge from '@/components/project/ProjectStatusBadge'
import ProjectLegend from './ProjectLegend'
import UidPopOver from '@/components/common/UidPopOver'

export default {
  components: {
    CountryItem,
    OrganisationItem,
    ProjectCardActions,
    ProjectStatusBadge,
    ProjectLegend,
    UidPopOver
  },
  props: {
    projectBase: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getProjectDetails: 'projects/getProjectDetails'
    }),
    project() {
      return this.getProjectDetails(this.projectBase)
    },
    projectData() {
      return this.project.archived
        ? this.project.draft
        : this.project.isPublished
          ? this.project.published
          : this.project.draft
    },
    donors() {
      return this.projectData && this.projectData.donors
        ? this.projectData.donors.length
        : 0
    },
    lastChange() {
      return format(this.projectData.modified, 'DD/MM/YYYY')
    },
    archiveStyle() {
      return this.projectStatus === 'archived' ? 'archived' : ''
    },
    projectStatus() {
      if (this.project.archived) return 'archived'
      if (!this.project.isPublished) return 'draft'
      if (this.project.isPublished) return 'published'
      if (this.projectData.approved) return 'approved'
    }
  },
  methods: {
    openFeedback() {
      const textRequest = this.$gettext('Please restore the following project:')
      const textProjectName = this.$gettext('Project name: {name}', { name: this.projectData.name })
      const textProjectID = this.$gettext('Project ID: {id}', { id: this.project.id })
      this.$store.commit('user/SET_FEEDBACK', {
        feedbackOn: true,
        feedbackForm: {
          subject: this.$gettext('Project restore request ({id})', { id: this.project.id }),
          message: `${textRequest}\r\n${textProjectName}\r\n${textProjectID}`
        }
      })
    },
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.ExtendedProjectCard {
  max-width: @cardSizeMedium;
  margin: 0 auto 20px;

  &.archived {
    border-color: @colorTextMuted !important;
  }

.FirstRow {
    position: relative;
    padding: 20px 50px 20px 30px;

    &.archived {
      background-color: @colorGrayLightest;
    }

    .FirstSubRow {
      margin-bottom: 16px;
      font-size: @fontSizeLarger;
      font-weight: 700;
      color: @colorTextPrimary;
    }

    .SecondSubRow {
      .el-col {
        &:first-child {
          width: auto;
        }

        &:last-child {
          width: 100%;
        }
      }

      .CountryItem {
        .CountryFlag {
          img {
            height: 14px;
            width: auto;
            margin: 1px 0;
            &.isGlobal {
              margin-top: -2px;
            }
          }
        }

        .CountryName {
          width: auto;
          font-size: @fontSizeBase;
          font-weight: 400;
        }
      }

      .OrganisationItem {
        position: relative;
        padding-left: 21px;
        font-size: @fontSizeBase;
        font-weight: 400;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          display: inline-block;
          width: 1px;
          height: 14px;
          background-color: @colorTextSecondary;
        }
      }
    }

    .ProjectName {
      width: 100%;
      padding-right: 40px;
    }

    .ProjectMeta {
      min-width: 150px;
      max-width: 2000px;
      border-left: 1px solid @colorGrayLight;

      .Donors,
      .LastChange,
      .uid {
        text-align: center;

        > div {
          margin: 8px 0 12px;
          font-size: @fontSizeBase;
          font-weight: 700;
          color: @colorTextPrimary;
        }

        > span {
          display: block;
          font-size: @fontSizeSmall;
          color: @colorTextSecondary;
          white-space: nowrap;
        }
      }
    }

    .ProjectMeta--no-border-left {
      border-left: none;
    }

    .ProjectLegend {
      position: absolute;
      top: 26px;
      right: 26px;

      .svg-inline--fa {
        font-size: 14px;
      }
    }
  }

  .SecondRow {
    padding: 16px 30px;
    background-color: @colorBrandBlueLight;

    &.archived {
      background-color: @colorGrayLighter;
    }

    .RestoreAction {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
      color: #008DC9;
      text-decoration: none;
      white-space: nowrap;
      transition: all 200ms cubic-bezier(0.645, 0.045, 0.355, 1);
      i {
        font-size: 18px;
        font-weight: bold;
        margin-right: 6px;
      }
    }
  }
}
</style>
