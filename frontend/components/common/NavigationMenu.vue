<template>
  <div :class="`UserDropdown MenuLink ${activeMenuStyle}`">
    <el-popover
      v-model="shown"
      placement="bottom-end"
      visible-arrow="false"
      popper-class="CustomPopover UserDropdownPopper"
    >
      <el-button slot="reference" type="text" :class="`HeaderBtn ${activeMenuStyle}`">
        {{ activeMenuItem }}
        <fa icon="caret-down" />
      </el-button>

      <div class="DropdownContent">
        <div class="DropdownLink">
          <nuxt-link
            key="homeBtn"
            :to=" localePath({ name: 'organisation', params: { organisation: '-' } })"
            @click.native="closePopover"
          >
            <translate>Home</translate>
          </nuxt-link>
        </div>
        <div class="DropdownLink">
          <nuxt-link
            key="dashboardBtn"
            :to="localePath({name: 'organisation-dashboard',params: $route.params})"
            @click.native="closePopover"
          >
            <translate>Dashboard</translate>
          </nuxt-link>
        </div>
        <div class="DropdownLink">
          <nuxt-link
            key="referenceDocumentsBtn"
            :to="localePath({name: 'organisation-reference-documents',params: $route.params})"
            @click.native="closePopover"
          >
            <translate>Countries' Reference Documents</translate>
          </nuxt-link>
        </div>
        <div class="DropdownLink">
          <nuxt-link
            key="myProjectsBtn"
            :to="localePath({name: 'organisation-projects',params: $route.params})"
            exact
            @click.native="closePopover"
          >
            <translate>My Projects</translate>
          </nuxt-link>
        </div>
        <div class="DropdownLink">
          <nuxt-link
            key="planningAndGuidanceBtn"
            :to="localePath({name: 'organisation-cms',params: $route.params})"
            exact
            @click.native="closePopover"
          >
            <translate>Planning and Guidance</translate>
          </nuxt-link>
        </div>
        <div class="Divider mt-10" />
        <div class="DropdownLink">
          <ToolkitDialogWrapper />
        </div>
        <div class="DropdownLink" @click="openHowTo">
          <translate tag="a" class="HeaderBtn">How-to</translate>
        </div>
        <div class="DropdownLink">
          <a
            :href="storiesLink"
            target="_blank"
            class="HeaderBtn"
            @click="closePopover"
          >
            <translate>Stories</translate>
          </a>
        </div>
        <div class="DropdownLink">
          <a
            :href="dataQualityLink"
            target="_blank"
            class="HeaderBtn"
            @click="closePopover"
          >
            <translate>Data Quality Guideline</translate>
          </a>
        </div>
      </div>
    </el-popover>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ToolkitDialogWrapper from './ToolkitDialogWrapper'

export default {
components: {
  ToolkitDialogWrapper
},
  data () {
    return {
      shown: false,
      storiesLink: this.$gettext('https://stories.digitalhealthatlas.org'),
      dataQualityLink: this.$gettext('/download/Data_Quality_Guidebook_v2.0.pdf'),
      menuRoutes: [
        {
          path: '-/',
          name: this.$gettext('Home')
        },
        {
          path: '/dashboard/',
          name: this.$gettext('Dashboard')
        },
        {
          path: '/projects',
          name: this.$gettext('My Projects')
        },
        {
          path: '/cms',
          name: this.$gettext('Planning and Guidance')
        },
      ]
    }
  },
  computed: {
    currentRoute() {
      return this.$route
    },
    insideRoute() {
      return this.menuRoutes.find(route => this.$route.path.endsWith(route.path))
    },
    activeMenuStyle() {
      return this.insideRoute ? 'nuxt-link-active' : ''
    },
    activeMenuItem() {
      return this.insideRoute ? this.insideRoute.name : this.menuRoutes[0].name
    },
    activeLink() {
      return true
    }
  },
  methods: {
    ...mapActions({
      openHowToDialog: 'layout/openHowToDialog'
    }),
    closePopover () {
      this.shown = false
    },
    openHowTo() {
      this.closePopover()
      this.openHowToDialog(0)
    }
  }
}
</script>

<style lang="less">
@import "../../assets/style/variables.less";

  .mt-10 {
    margin-top: 10px !important;
  }
  .MenuLink {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: -17px;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 4px;
      background-color: @colorWhite;
      transform: translateY(-4px);
      transition: @transitionAll;
    }

  }
</style>
