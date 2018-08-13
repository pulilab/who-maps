<template>
  <div class="UserDropdown">
    <el-popover
      v-model="shown"
      placement="bottom"
      popper-class="UserDropdownPopper"
    >
      <el-button
        slot="reference"
        type="text"
      >
        <fa icon="user-circle" />
        {{ user.name }}
        <fa icon="angle-down" />
      </el-button>

      <div class="DropdownContent">
        <!-- User info block -->
        <div class="UserInfoSection">
          <div>
            <div class="ItemTitle">
              Email
            </div>
            {{ user.email }}
          </div>

          <div>
            <div class="ItemTitle">
              Role
            </div>
            Role Name
          </div>

          <div>
            <div class="ItemTitle">
              Country
            </div>
            <country-item :id="user.country" />
          </div>

          <div>
            <div class="ItemTitle">
              Site Language
            </div>
            <language-item :code="user.language" />
          </div>
        </div>

        <!-- User links block -->
        <div class="Divider" />
        <div class="DropdownLink" >
          <nuxt-link
            :to="localePath('index-edit-profile')"
            @click.native="closePopover"
          >
            <i class="el-icon-settings" />
            Edit my profile
          </nuxt-link >
        </div>

        <div class="DropdownLink">
          <el-button
            type="text"
            @click="logout"
          >
            <i class="el-icon-edit" />
            Logout
          </el-button >
        </div>
      </div>
    </el-popover>
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
  data () {
    return {
      shown: false
    };
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
    closePopover () {
      this.shown = false;
    },
    logout () {
      this.closePopover();
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
    .UserInfoSection {
      background-color: @colorGrayLightest;
    }

    .el-dropdown-menu {
      padding: 0;
      margin: 0;
    }

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
</style>
