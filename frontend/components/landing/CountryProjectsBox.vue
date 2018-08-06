<template>
  <div
    v-if="activeCountry"
    class="CountryProjectsBox">
    <el-row type="flex">
      <el-col>
        <country-item :id="activeCountry"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-tabs
          v-model="activeTab"
        >
          <el-tab-pane
            label="Sub-National"
            name="subNational">
            <project-card />
            <project-card />
            <project-card />
          </el-tab-pane>
          <el-tab-pane
            label="National"
            name="National">
            <project-card />
            <project-card />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-button
      class="CloseBox"
      circle
      icon="el-icon-close"
      @click="closeCountryProjextBox"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CountryItem from '../common/CountryItem';
import ProjectCard from '../common/ProjectCard';

export default {
  components: {
    CountryItem,
    ProjectCard
  },
  data () {
    return {
      activeTab: 'subNational'
    };
  },
  computed: {
    ...mapGetters({
      activeCountry: 'landing/getActiveCountry'
    })
  },
  methods: {
    ...mapActions({
      setActiveCountry: 'landing/setActiveCountry'
    }),
    closeCountryProjextBox () {
      this.setActiveCountry(null);
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CountryProjectsBox {
      z-index: 400;
      position: absolute;
      bottom: 40px;
      left: 40px;
      box-sizing: border-box;
      width: 360px;
      height: auto;
      max-height: 420px;
      padding: 20px 40px;
      color: @colorWhite;
      background: fade(@colorBrandPrimary, 90%);
      box-shadow: 5px 5px 20px 0 rgba(0,0,0,0.12);

      .CloseBox {
        position: absolute;
        top: 16px;
        right: 16px;
      }
    }

</style>
