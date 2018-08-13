<template>
  <div class="UserDropdown">
    <el-dropdown trigger="click">
      <el-button
        type="text"
      >
        <fa icon="user-circle" />
        {{ user.name }}
        <fa icon="angle-down" />
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <!-- User info block -->
        <div class="UserInfoSection">
          <div class="Item">
            <div class="ItemTitle">
              Email
            </div>
            {{ user.email }}
          </div>

          <div class="Item">
            <div class="ItemTitle">
              Role
            </div>
            Role Name
          </div>

          <div class="Item">
            <div class="ItemTitle">
              Country
            </div>
            <country-item :id="user.country" />
          </div>

          <div class="Item">
            <div class="ItemTitle">
              Site Language
            </div>
            <language-item :code="user.language" />
          </div>
        </div>
        <!-- User links block -->
        <el-dropdown-item divided>
          <nuxt-link :to="localePath('index-edit-profile')">
            <span class="MenuIcon">
              <fa icon="user-edit" />
            </span>
            Edit my profile
          </nuxt-link >
        </el-dropdown-item>

        <el-dropdown-item>
          <el-button
            type="text"
            style="padding: 0"
            @click="logout"
          >
            <span class="MenuIcon">
              <fa icon="power-off" />
            </span>
            Logout
          </el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LanguageItem from './LanguageItem';
import CountryItem from './CountryItem';

export default {
  components: {
    LanguageItem,
    CountryItem
  },
  computed: {
    ...mapGetters({
      user: 'user/getProfile'
    })
  },
  methods: {
    ...mapActions({
      doLogout: 'user/doLogout'
    }),
    logout () {
      this.doLogout();
      this.$router.push(this.localePath('index'));
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";
  .UserDropdown {
    .el-button {
      padding: 0;

      .svg-inline--fa {
        margin-right: 2px;

        &.fa-angle-down {
          margin: 0 0 0 4px;
        }
      }
    }
  }

  .UserInfoSection {
    padding: 8px 20px 4px;
    font-size: @fontSizeBase;

    .Item {
      display: block;
      margin-bottom: 12px;

      .ItemTitle {
        margin-bottom: 8px;
        font-size: @fontSizeSmall - 1;
        font-weight: 700;
        text-transform: uppercase;
        color: @colorTextMuted;
      }

      .CountryName,
      .LanguageName {
        margin-left: 8px;
        font-size: @fontSizeBase;
        font-weight: 400;
      }
    }
  }
</style>
