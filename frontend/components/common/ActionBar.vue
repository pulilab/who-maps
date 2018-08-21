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
        v-if="$route.path.includes('/admin/')"
        type="flex">
        <nuxt-link
          :to="localePath({name: 'index-edit-profile'})"
          class="FakeTab"
          tag="div">My profile</nuxt-link>
        <nuxt-link
          :to="localePath({name: 'index-admin-country'})"
          class="FakeTab"
          tag="div">Country admin</nuxt-link>
        <nuxt-link
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

export default {
  components: {
    SearchComponent
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
      height: 48px;
      line-height: 48px;
      white-space: nowrap;
      color: white;
      margin: 0 12px;
      padding: 0 10px;
      cursor: pointer;
      color: gray;
      transition: border .5s, color .5s;

      &.nuxt-link-exact-active {
        border-bottom: 5px solid white;
        color: white;
      }
    }
  }
</style>
