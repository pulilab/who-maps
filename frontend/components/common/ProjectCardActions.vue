<template>
  <div class="ProjectCardActions">
    <el-row type="flex" justify="end">
      <!-- <el-row v-if="project.archived" type="flex" justify="end" class="RestoreAction" @click.native="openFeedback">
        <i class="el-icon-upload2"></i>
        <translate>Restore</translate>
      </el-row> -->
      <el-col v-if="project.archived" class="NuxtLink IconLeft" @click.native="$emit('restore')">
        <fa icon="undo" />
        <translate>Restore</translate>
      </el-col>
      <template v-else>
        <el-col v-if="showViewDraft || adminAction">
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

        <el-col v-if="showEditDraft && !adminAction">
          <nuxt-link
            :to="localePath({name: 'organisation-projects-id-edit', params: {id: project.id, organisation: $route.params.organisation}})"
            class="NuxtLink IconLeft"
          >
            <fa icon="edit" />
            <translate>Edit Draft</translate>
          </nuxt-link>
        </el-col>

        <el-col v-if="adminAction" class="NuxtLink IconLeft" @click.native="$emit('edit-team')">
          <fa icon="users" />
          <translate>Change team</translate>
        </el-col>

        <el-col v-if="!adminAction">
          <nuxt-link
            :to="localePath({name: 'organisation-projects-id-assessment', params: {id: project.id, organisation: $route.params.organisation}})"
            class="NuxtLink IconLeft"
          >
            <fa icon="tachometer-alt" />
            <translate>Assessment</translate>
          </nuxt-link>
        </el-col>
        <el-col v-if="showViewPublished && !adminAction">
          <nuxt-link
            to=""
            class="NuxtLink IconLeft Danger"
            @click.native="handleClickUnPublish({ name: 'organisation-projects' }, project.id)"
          >
            <fa icon="times-circle" />
            <translate>Unpublish</translate>
          </nuxt-link>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import handleProjectUnpublish from '@/components/mixins/handleProjectUnpublish'

export default {
  mixins: [handleProjectUnpublish],
  props: {
    project: {
      type: Object,
      required: true
    },
    forceShow: {
      type: Boolean,
      default: false
    },
    adminAction: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    showViewDraft () {
      return this.forceShow || this.project.isViewer || this.project.isMember
    },
    showEditDraft () {
      return this.forceShow || this.project.isMember
    },
    showViewPublished () {
      return this.forceShow || this.project.isPublished
    }
  }
}
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
