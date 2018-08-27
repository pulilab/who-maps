<template>
  <div class="ActionBar">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="InnerActionBar">

      <div class="Title">
        <h3>Digital Health Atlas</h3>
      </div>

      <el-row
        v-if="$route.path.includes('/admin/') || $route.path.endsWith('/edit-profile')"
        type="flex">
        <nuxt-link
          :to="localePath({name: 'index-edit-profile'})"
          class="FakeTab"
          tag="div">My profile</nuxt-link>
        <nuxt-link
          v-if="['CA', 'SCA'].includes(userProfile.account_type) || userProfile.is_superuser"
          :to="localePath({name: 'index-admin-country'})"
          class="FakeTab"
          tag="div">Country admin</nuxt-link>
        <nuxt-link
          v-if="['DA', 'SDA'].includes(userProfile.account_type) || userProfile.is_superuser"
          :to="localePath({name: 'index-admin-donor'})"
          class="FakeTab"
          tag="div">Donor admin</nuxt-link>
      </el-row>

      <el-col />

      <search-component />
    </el-row>
  </div>
</template>

<script>
import SearchComponent from '../common/SearchComponent.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    SearchComponent
  },

  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile'
    })
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .ActionBar {
    background-color: @colorBrandPrimary;

    .InnerActionBar {
      .limitPageWidth();
      height: @actionBarHeight;
    }

    .Title {
      h3 {
        width: 224px;
        display: block;
        margin: 0;
        font-size: @fontSizeLarge;
        color: @colorWhite;
      }
    }

    .SearchComponent {
      width: auto;
    }

    .FakeTab {
      height: 43px;
      line-height: 48px;
      white-space: nowrap;
      color: white;
      margin: 0 12px;
      padding: 0 10px;
      cursor: pointer;
      font-family: Arial;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 5px solid @colorBrandPrimary;
      opacity: 0.6;
      transition: border-bottom-color .5s, opacity .5s;

      &.nuxt-link-exact-active {
        border-bottom-color: white;
        opacity: 1;
      }
    }
  }
</style>
