<template>
  <div class="ProjectBar">
    <el-row type="flex">
      <el-col :span="12">
        <div class="ProjectName">
          {{ project.name }}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="Label">
          Last Updated
        </div>
        <div>
          1/12/2018
        </div>
      </el-col>
      <el-col :span="4">
        <div class="Label">
          Organisation
        </div>
        <div>
          <organisation-item :id="project.organisation" />
        </div>
      </el-col>
      <el-col :span="4">
        <div class="Label">
          Contact person
        </div>
        <div>
          <a :href="`mailto:${project.contact_email}`">{{ project.contact_name }}</a>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex">
      <nuxt-link :to="localePath({name: 'index-projects-id-edit', params: {id}})">
        Project
      </nuxt-link>
      <nuxt-link :to="localePath({name: 'index-projects-id-assessment', params: {id}})">
        Assessment
      </nuxt-link>
      <nuxt-link :to="localePath({name: 'index-projects-id-toolkit', params: {id}})">
        Update score
      </nuxt-link>
      <nuxt-link :to="localePath({name: 'index-projects-id-toolkit-scorecard', params: {id}})">
        Summary score
      </nuxt-link>
    </el-row>
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

<style>

</style>
