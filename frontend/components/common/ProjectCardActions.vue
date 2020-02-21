<template>
  <div class="ProjectCardActions">
    <el-row
      type="flex"
      justify="end"
    >
      <el-col v-if="showViewDraft">
        <nuxt-link
          :to="localePath({name: 'organisation-projects-id', params: {id: project.id, organisation: $route.params.organisation}})"
          class="NuxtLink IconLeft"
        >
          <fa icon="arrow-right" />
          <translate>View Draft</translate>
        </nuxt-link>
      </el-col>
      <el-col v-if="showViewPublished">
        <nuxt-link
          :to="localePath({name: 'organisation-projects-id-published', params: {id: project.id, organisation: $route.params.organisation}})"
          class="NuxtLink IconLeft"
        >
          <fa icon="arrow-right" />
          <translate>View Published</translate>
        </nuxt-link>
      </el-col>
      <el-col v-if="showEditDraft">
        <nuxt-link
          :to="localePath({name: 'organisation-projects-id-edit', params: {id: project.id, organisation: $route.params.organisation}})"
          class="NuxtLink IconLeft"
        >
          <fa icon="edit" />
          <translate>Edit Draft</translate>
        </nuxt-link>
      </el-col>
      <el-col>
        <nuxt-link
          :to="localePath({name: 'organisation-projects-id-assessment', params: {id: project.id, organisation: $route.params.organisation}})"
          class="NuxtLink IconLeft"
        >
          <fa icon="tachometer-alt" />
          <translate>Assessment</translate>
        </nuxt-link>
      </el-col>
      <el-col v-if="project.isPublished">
        <nuxt-link
          to=""
          @click.native="handleClickUnPublish"
          class="NuxtLink IconLeft Danger"
        >
          <fa icon="times-circle" />
          <translate>Unpublish</translate>
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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
  },
  methods: {
    ...mapActions({
      unpublishProject: 'project/unpublishProject',
      setLoading: 'project/setLoading'
    }),
    async handleClickUnPublish () {
      try {
        await this.$confirm(this.$gettext('The current project will be unpublish'), this.$gettext('Attention'), {
          confirmButtonText: this.$gettext('Ok'),
          cancelButtonText: this.$gettext('Cancel'),
          type: 'warning'
        });
        await this.unpublishProject(this.project.id);
        location.reload();
        this.$message({
          type: 'success',
          message: this.$gettext('The project has been unpublish')
        });
      } catch (e) {
        this.setLoading(false);
        this.$message({
          type: 'info',
          message: this.$gettext('Action cancelled')
        });
      }
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ProjectCardActions {
    .el-row {
      .el-col {
        width: auto;
      }
    }

    .NuxtLink {
      margin-left: 40px;
      line-height: 24px;
    }

    .Danger {
      color: @colorDanger;
      &:hover {
        color: @colorDanger;
      }
    }
  }

</style>
