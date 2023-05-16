<template>
  <page-layout small>
    <template #subtitle>
      <b class="uppercase"><translate>project stages</translate></b>
    </template>
    <c-stages class="stage-graph" />
  </page-layout>
</template>

<script>
import { fetchProjectData } from '@/utilities/projects'
import cStages from '@/components/charts/common/cStages'
import PageLayout from '@/components/common/wrappers/PageLayout'
export default {
  components: {
    cStages,
    PageLayout
  },
  middleware: ['authGuard'],
  fetch ({ store, params, error }) {
    return fetchProjectData(store, params, error)
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
.stage-graph {
  padding-top: 10px;
  background-color: @colorWhite;
  border: 1px solid @colorGrayLight;
  box-shadow: 0 1px 0 0 @colorGrayLight;
}
.uppercase {
  text-transform: uppercase;
}
</style>
