<template>
  <div class="ProjectBar">
    <el-row type="flex">
      <el-col :span="12">
        <div class="ProjectName">
          ProjectName
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
          WHO
        </div>
      </el-col>
      <el-col :span="4">
        <div class="Label">
          Contact person
        </div>
        <div>
          <a href="mailto:jhon@doe.com">Jhon Doe</a>
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
export default {
  computed: {
    id () {
      return this.$route.params.id;
    }
  }
};
</script>

<style>

</style>
