<template>
  <el-row type="flex" class="project-view">
    <el-col :span="6" class="sidebar">
      <navigation
        :items="sections"
        :selected="selected"
        sticky
        @click="handleNavigation"
      >
        <view-actions :actions="actions" @click="handleActions" />
      </navigation>
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
          <component :is="section.component" />
        </observer>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// project components
import Navigation from "@/components/project/Navigation";
import ViewActions from "@/components/project/ViewActions";

// sections
import Overview from "@/components/project/sections/view/Overview";
import Implementation from "@/components/project/sections/view/Implementation";
import Stages from "@/components/project/sections/view/Stages";
import Technology from "@/components/project/sections/view/Technology";
import Interoperability from "@/components/project/sections/view/Interoperability";
import Custom from "@/components/project/sections/view/Custom";
// utilities components
import Observer from "@/components/common/Observer";

export default {
  components: {
    Navigation,
    ViewActions,
    Overview,
    Implementation,
    Stages,
    Technology,
    Interoperability,
    Custom,
    Observer,
  },
  props: {
    published: {
      type: Boolean,
      default: false,
    },
  },
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
      actions: [],
    };
  },
  // computed: {
  //   ...mapGetters({
  //     projectDraft: "project/getProjectData",
  //     projectPublished: "project/getPublished",
  //   }),
  // },
  mounted() {
    window.scrollTo(0, 0);
  },
  watch: {
    published: {
      immediate: true,
      handler(val) {
        const print = {
          id: "print",
          type: "primary",
          icon: "el-icon-printer",
          plain: true,
          label: this.$gettext("Print draft"),
          handle: "handlePrint",
          success: {
            title: this.$gettext("Congratulations"),
            message: this.$gettext(
              "You can see the print version on a new window"
            ),
          },
          error: {
            title: this.$gettext("Error"),
            message: this.$gettext("Is not possible to print. Try again."),
            type: "error",
          },
        };
        const info = {
          title: this.$gettext("Info"),
          message: this.$gettext("Action cancelled"),
          type: "info",
        };
        if (val) {
          this.actions = [
            {
              id: "unpublish",
              type: "danger",
              icon: "el-icon-delete",
              plain: true,
              label: this.$gettext("Unpublish"),
              handle: "unpublishProject",
              confirm: {
                title: this.$gettext("Attention"),
                description: this.$gettext(
                  "The current project will be unpublish"
                ),
              },
              route: {
                name: "organisation-projects-id-edit",
                params: { ...this.$route.params },
              },
              success: {
                title: this.$gettext("Congratulations"),
                message: this.$gettext("Project has been unpublish"),
              },
              error: info,
            },
            { ...print, label: this.$gettext("Print project") },
          ];
        } else {
          this.actions = [
            {
              id: "draft",
              type: "warning",
              icon: "el-icon-upload2",
              label: this.$gettext("Publish draft"),
              handle: "publishProject",
              route: {
                name: "organisation-projects-id-published",
                params: { ...this.$route.params },
              },
              success: {
                title: this.$gettext("Congratulations"),
                message: this.$gettext("Your draft has been published"),
              },
              error: {
                title: this.$gettext("Error"),
                message: this.$gettext("We could not publish. Try again"),
                type: "error",
              },
            },
            {
              id: "discard",
              type: "danger",
              icon: "el-icon-delete",
              plain: true,
              label: this.$gettext("Discard draft"),
              handle: "discardDraft",
              confirm: {
                title: this.$gettext("Attention"),
                description: this.$gettext(
                  "The current draft will be overwritten by the published version"
                ),
              },
              success: {
                title: this.$gettext("Congratulations"),
                message: this.$gettext("Draft has been discard"),
              },
              error: info,
            },
            print,
          ];
        }
      },
    },
  },
  methods: {
    ...mapActions({
      publishProject: "project/publishProject",
      discardDraft: "project/discardDraft",
      unpublishProject: "project/unpublishProject",
    }),
    // manage navigation
    handleNavigation(target) {
      this.$refs[target][0].scrollIntoView({
        behavior: "smooth",
      });
    },
    intersected(target) {
      this.selected = target;
    },
    // manage button actions
    handleActions(handle) {
      this.handleRequest(
        this.actions.find((action) => action.handle === handle)
      );
    },
    async handleRequest({ handle, route, success, error, confirm }) {
      try {
        this.handleLoaders(handle);
        if (confirm) {
          await this.handleConfirm(confirm);
        }
        await this[handle](this.$route.params.id);
        if (route) {
          this.handleRoute(route);
        }
        this.handleNotification(success);
        this.handleLoaders();
      } catch (e) {
        this.handleLoaders();
        this.handleNotification(error);
      }
    },
    handleLoaders(handle = "") {
      this.actions = this.actions.map((action) => {
        const loaders = handle
          ? {
              loading: action.handle === handle ? true : false,
              disabled: action.handle === handle ? false : true,
            }
          : { loading: false, disabled: false };
        return {
          ...action,
          ...loaders,
        };
      });
    },
    handleRoute(obj) {
      this.$router.push(this.localePath(obj));
    },
    handleNotification(obj) {
      this.$notify({
        type: "success",
        position: "top-left",
        ...obj,
      });
    },
    async handleConfirm({ description, title, options }) {
      await this.$confirm(
        description,
        title,
        options || {
          confirmButtonText: this.$gettext("Ok"),
          cancelButtonText: this.$gettext("Cancel"),
          type: "warning",
        }
      );
    },
    async handlePrint() {
      // pending to ask
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("Listo para imprimir");
        }, 2000);
      });
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
}
</style>
