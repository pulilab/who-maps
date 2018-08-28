<template>
  <div class="ProjectBar">
    <div class="ProjectBarWrapper">
      <el-row type="flex">
        <el-col
          :span="15"
          class="ProjectName">
          <div>
            <!-- TODO -->
            <!-- Please add the "member/view" icon right after the name if it's necessary -->
            {{ project.name }}
          </div>
        </el-col>
        <el-col
          :span="3"
          class="ProjectInfo">
          <div class="Label">
            Last Updated
          </div>
          <div class="Info">
            1/12/2018
          </div>
        </el-col>
        <el-col
          :span="3"
          class="ProjectInfo">
          <div class="Label">
            Organisation
          </div>
          <div class="Info">
            <organisation-item :id="project.organisation" />
          </div>
        </el-col>
        <el-col
          :span="3"
          class="ProjectInfo">
          <div class="Label">
            Contact person
          </div>
          <div class="Info">
            <a
              :href="`mailto:${project.contact_email}`"
              class="NuxtLink Small IconRight">
              {{ project.contact_name }}
              <fa icon="envelope" />
            </a>
          </div>
        </el-col>
      </el-row>

      <div class="ProjectMenu">
        <!-- TODO -->
        <!-- Please add '.Active' class -->
        <nuxt-link :to="localePath({name: 'organisation-projects-id-edit', params: {id, organisation: $route.params.organisation}})">
          Project
        </nuxt-link>
        <nuxt-link :to="localePath({name: 'organisation-projects-id-assessment', params: {id, organisation: $route.params.organisation}})">
          Assessment
        </nuxt-link>
        <nuxt-link :to="localePath({name: 'organisation-projects-id-toolkit', params: {id, organisation: $route.params.organisation}})">
          Update score
        </nuxt-link>
        <nuxt-link :to="localePath({name: 'organisation-projects-id-toolkit-scorecard', params: {id, organisation: $route.params.organisation}})">
          Summary score
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrganisationItem from './OrganisationItem';

export default {
  components: {
    OrganisationItem
  },
  computed: {
    ...mapGetters({
      currentProject: 'projects/getCurrentProject'
    }),
    project () {
      return this.currentProject.isPublished ? this.currentProject.published : this.currentProject.draft;
    },
    id () {
      return this.$route.params.id;
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectBar {
    background-color: @colorWhite;
    border-bottom: 1px solid @colorGrayLight;

    .ProjectBarWrapper {
      overflow: hidden;
      .limitPageWidth();
    }

    .ProjectName {
      width: 100%;
      margin: 16px 0 0;
      padding-right: 50px;
      font-size: @fontSizeLarge;
      line-height: @fontSizeLarge;
      font-weight: 700;
    }

    .ProjectInfo {
      width: auto;
      white-space: nowrap;
      margin: 12px 0 0;
      padding: 2px 20px;
      border-left: 1px solid @colorGrayLighter;

      &:last-of-type {
        padding-right: 10px;
      }

      .Label {
        margin: 0 0 4px;
        font-size: @fontSizeSmall - 1;
        color: @colorGray;
      }

      .Info {
        font-size: @fontSizeSmall;
        font-weight: 700;
        color: @colorTextPrimary;
      }
    }

    .ProjectMenu {
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

        &.Active {
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

          &::before {
            transform: translateY(3px);
          }
        }
      }
    }
  }
</style>
