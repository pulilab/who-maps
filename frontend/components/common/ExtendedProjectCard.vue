<template>
  <el-card class="ExtendedProjectCard">
    <div>
      <el-row
        type="flex"
        class="FirstRow">
        <el-col :span="14">
          <el-row class="FirstSubRow">
            <el-col>
              {{ projectData.name }}
            </el-col>
          </el-row>
          <el-row
            type="flex"
            class="SecondSubRow">
            <el-col>
              <country-item
                :id="projectData.country"
                :show-flag="false" />
            </el-col>
            <el-col>
              <span class="Separator" />
            </el-col>
            <el-col>
              <organisation-item :id="projectData.organisation" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4">
          <div class="Donors">
            <div>
              {{ donors }}
            </div>
            <span> Donoros </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="LastChange">
            <div>
              {{ lastChange }}
            </div>
            <span> Updated on </span>
          </div>
          <project-legend :id="id" />
        </el-col>
      </el-row>
      <el-row
        class="SecondRow"
        type="flex">
        <el-col v-if="!project.isPublished">
          <div
            class="ProjectStatus Draft">
            Draft
          </div>
        </el-col>
        <el-col v-if="project.isPublished">
          <div
            class="ProjectStatus Published">
            Published
          </div>
        </el-col>
        <el-col v-if="project.approved">
          <div
            class="ProjectStatus ApprovedByCountry">
            Approved By Country
          </div>
        </el-col>
        <el-col>
          <project-card-actions
            :project="project"
            :force-show="true" />
        </el-col>

      </el-row>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { format } from 'date-fns';

import CountryItem from './CountryItem';
import OrganisationItem from './OrganisationItem';
import ProjectCardActions from './ProjectCardActions';
import ProjectLegend from './ProjectLegend';

export default {
  components: {
    CountryItem,
    OrganisationItem,
    ProjectCardActions,
    ProjectLegend
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getUserProjectDetails: 'projects/getUserProjectDetails'
    }),
    project () {
      return this.getUserProjectDetails(this.id);
    },
    projectData () {
      return this.project.isPublished ? this.project.published : this.project.draft;
    },
    donors () {
      return this.projectData && this.projectData.donors ? this.projectData.donors.length : 0;
    },
    lastChange () {
      return format(Date.now(), 'DD/MM/YYYY');
    }
  },
  methods: {}
};
</script>

<style lang="less">

.ExtendedProjectCard {
  .hovered {
    color: blue
  }
}

</style>
