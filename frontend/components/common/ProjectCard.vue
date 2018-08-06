<template>
  <el-card class="ProjectCard">
    <div
      :class="{hovered}"
      @click="goToProject"
      @mouseenter="mouseEnterHandler"
      @mouseleave="mouseLeaveHandler">
      <el-row type="flex">
        <el-col :span="20">
          <el-row class="Name">
            <el-col>
              Hello Mama
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col>
              Sierra Leone
            </el-col>
            <el-col>
              eHealth Africa
            </el-col>
          </el-row>
          <el-row
            v-if="searchChild"
            type="flex">
            <el-col>
              <i class="el-icon-search" />
              <span>Found in "ProjectName"</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col
          v-show="hovered"
          :span="4">
          <el-button
            icon="el-icon-arrow-right"
          />
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    searchChild: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hovered: false
    };
  },
  methods: {
    goToProject () {
      const path = this.localePath({name: 'index-projects-id', params: {id: 1}});
      this.$router.push(path);
    },
    mouseEnterHandler () {
      this.hovered = true;
    },
    mouseLeaveHandler () {
      this.hovered = false;
    }
  }
};
</script>

<style lang="less">

.ProjectCard {
  .hovered {
    color: blue
  }
}

</style>
