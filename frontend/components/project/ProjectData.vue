<template>
  <el-row type="flex" class="project-view">
    <el-col :span="6" class="sidebar">
      <!-- <project-navigation @handleClickUnPublish="handleUnpublish" /> -->
      <section class="navigation sticky">
        <p><translate>Table of Content</translate></p>
        <ul>
          <li
            v-for="(section, i) in sections"
            :key="section.id"
            :class="`${section.id === selected && 'selected'}`"
            @click="handleNavigation(section.id)"
          >
            {{ `${section.prepend}. ${section.nav}` }}
          </li>
        </ul>
      </section>
    </el-col>
    <el-col :span="18" class="main">
      <section v-for="(section, i) in sections" :key="section.id">
        <observer
          :options="{ root: null, rootMargin: '0px', threshold: 0.5 }"
          :target="section.id"
          @intersect="intersected"
        >
          <h1 :ref="section.id">
            {{ `${section.prepend}.  ${section.title}` }}
          </h1>
          <div class="content">
            <component :is="section.component" />
          </div>
        </observer>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
// project components
// import ProjectNavigation from "@/components/project/ProjectNavigation";
// sections
import Overview from "@/components/project/sections/view/Overview";
import Implementation from "@/components/project/sections/view/Implementation";
import Stages from "@/components/project/sections/view/Stages";
import Technology from "@/components/project/sections/view/Technology";
import Interoperability from "@/components/project/sections/view/Interoperability";
import Custom from "@/components/project/sections/view/Custom";
// utilities components
import Observer from "@/components/common/Observer";
// mixins
// import handleProjectUnpublish from "@/components/mixins/handleProjectUnpublish";

export default {
  components: {
    Observer,
    Overview,
    Implementation,
    Stages,
    Technology,
    Interoperability,
    Custom,
  },
  // mixins: [handleProjectUnpublish],
  data() {
    return {
      sections: [
        {
          id: "general",
          nav: this.$gettext("General"),
          title: this.$gettext("General Overview"),
          prepend: 1,
          component: "Overview",
        },
        {
          id: "implementation",
          nav: this.$gettext("Implementation"),
          title: this.$gettext("Implementation Overview"),
          prepend: 2,
          component: "Implementation",
        },

        {
          id: "stages",
          nav: this.$gettext("Stages"),
          title: this.$gettext("Completion of Project stages"),
          prepend: 3,
          component: "Stages",
        },
        {
          id: "technology",
          nav: this.$gettext("Technology"),
          title: this.$gettext("Technology overview"),
          prepend: 4,
          component: "Technology",
        },
        {
          id: "interoperability",
          nav: this.$gettext("Interoperability"),
          title: this.$gettext("Interoperability &amp; standards"),
          prepend: 5,
          component: "Interoperability",
        },
        {
          id: "custom",
          nav: this.$gettext("Custom"),
          title: this.$gettext("Custom"),
          prepend: 6,
          component: "Custom",
        },
      ],
      selected: "general",
    };
  },
  methods: {
    // handleUnpublish() {
    //   this.handleClickUnPublish(
    //     {
    //       name: "organisation-projects-id-edit",
    //       params: { ...$route.params },
    //     },
    //     $route.params.id
    //   );
    // },
    handleNavigation(target) {
      this.$refs[target][0].scrollIntoView({
        behavior: "smooth",
      });
    },
    intersected(target) {
      this.selected = target;
    },
  },
};
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.project-view {
  .sidebar,
  .main {
    padding: 50px;
    background-color: @colorWhite;
  }
  .sidebar {
    background-color: #f8f8f8;
  }
  .main {
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.12);
    // .content {
    //   min-height: 1000px;
    // }
    h1 {
      font-size: 24px;
      font-style: italic;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 48px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 15px;
      margin: 0px;
    }
  }
  .navigation {
    .selected {
      font-weight: 700;
      cursor: none;
    }
  }
  .sticky {
    position: sticky;
    top: 20px;
    z-index: 1;
  }
}
</style>
