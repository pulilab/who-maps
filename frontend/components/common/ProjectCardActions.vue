<template>
  <div class="ProjectCardActions">
    <el-row
      type="flex">
      <el-col v-if="showViewDraft">
        <nuxt-link :to="localePath({name: 'index-projects-id', params: {id: project.id}})">
          <fa icon="arrow-right" />
          View Draft
        </nuxt-link>
      </el-col>
      <el-col v-if="showEditDraft">
        <nuxt-link :to="localePath({name: 'index-projects-id-edit', params: {id: project.id}})">
          <i class="el-icon-edit" />
          Edit Draft
        </nuxt-link>
      </el-col>
      <el-col v-if="showViewPublished">
        <nuxt-link :to="localePath({name: 'index-projects-id-published', params: {id: project.id}})">
          <i class="el-icon-arrow-right" />
          View Published
        </nuxt-link>
      </el-col>
      <el-col>
        <nuxt-link :to="localePath({name: 'index-projects-id-assessment', params: {id: project.id}})">
          <i class="el-icon-arrow-right" />
          Assessment
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    forceShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showViewDraft () {
      return this.forceShow || this.project.isViewer || this.project.isMember;
    },
    showEditDraft () {
      return this.forceShow || this.project.isMember;
    },
    showViewPublished () {
      return this.forceShow || this.project.isPublished;
    }
  }
};
</script>

<style>

</style>
