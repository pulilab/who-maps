<template>
  <div class="UserProjectsList">
    <EmptyProjects v-if="!hasProjects && !isArchive" />
    <EmptyArchive v-if="!hasProjects && isArchive" />
    <ExtendedProjectCard
      v-for="project in limited"
      :key="project.id"
      :project-base="project"
    />
  </div>
</template>

<script>
import EmptyProjects from './EmptyProjects'
import EmptyArchive from './EmptyArchive'
import ExtendedProjectCard from '../common/ExtendedProjectCard'

export default {
  components: {
    EmptyProjects,
    EmptyArchive,
    ExtendedProjectCard
  },
  props: {
    projectList: {
      type: Array,
      required: true,
      default: () => []
    },
    isArchive: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: null
    }
  },
  computed: {
    limited() {
      return this.limit && this.projectList.length > 3
        ? this.projectList.slice(0, this.limit)
        : this.projectList
    },
    hasProjects() {
      return this.projectList.length > 0
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.UserProjectsList {
  padding: 40px 40px 20px;
  background: url('~assets/img/squares.svg') no-repeat;
  background-position: center 0px;
  min-height: 266px;
}
</style>
