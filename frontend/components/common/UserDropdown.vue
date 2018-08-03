<template>
  <div class="UserDropdown">
    <el-dropdown>
      <el-button
        type="text"
        icon="el-icon-info">
        {{ user.name }}
        <i class="el-icon-arrow-down" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <div class="ItemTitle">
            Email
          </div>
          {{ user.email }}
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="ItemTitle">
            Role
          </div>
          Role Name
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="ItemTitle">
            Country
          </div>
          <country-item :id="user.country" />
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="ItemTitle">
            Site Language
          </div>
          <language-item :code="user.language" />
        </el-dropdown-item>
        <el-dropdown-item divided>
          <nuxt-link :to="localePath('index-profile')">
            <i class="el-icon-settings" />
            Edit my profile
          </nuxt-link >
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button
            type="text"
            @click="logout"
          >
            <i class="el-icon-edit" />
            Logout
          </el-button >
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
.UserDropdown {
  .el-button {
    padding: 0;
  }
}

</style>
