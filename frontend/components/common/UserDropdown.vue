<template>
  <div class="UserDropdown">
    <el-popover
      v-model="shown"
      placement="bottom-end"
      popper-class="UserDropdownPopper"
    >

      <el-button
        slot="reference"
        type="text"
        class="ButtonPopper"
      >
        <fa icon="user-circle" />
        {{ user.name }}
        <fa icon="angle-down" />
      </el-button>

      <div class="DropdownContent">
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
            <country-item
              v-if="user.country"
              :id="user.country" />
          </div>

          <div class="Item">
            <div class="ItemTitle">
              Site Language
            </div>
            <language-item
              v-if="user.language"
              :code="user.language" />
          </div>
        </div>

        <!-- User links block -->
        <div class="Divider" />
        <div class="DropdownLink" >
          <nuxt-link
            :to="localePath('index-edit-profile')"
            @click.native="closePopover"
          >
            <span class="MenuIcon">
              <fa icon="user-edit" />
            </span>
            Edit my profile
          </nuxt-link>
        </div>

        <div class="DropdownLink">
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

  .ButtonPopper {
    height: 24px;
    margin: 0 10px;
    padding: 0 10px;
    border: 0;
    font-size: @fontSizeBase;
    font-weight: 700;
    line-height: 24px;
    color: @colorBrandPrimary;
    text-decoration: none;

    .svg-inline--fa {
      margin-right: 2px;

      &.fa-angle-down {
        margin: 0 0 0 4px;
      }
    }
  }

  .UserDropdownPopper {
    padding: 0;
  }

  .DropdownContent {
    padding: 0 0 10px 0;

    .UserInfoSection {
      padding: 16px 20px 4px;
      font-size: @fontSizeBase;

      .Item {
        display: block;
        margin-bottom: 12px;
        padding-right: 5px;

        .ItemTitle {
          margin-bottom: 6px;
          font-size: @fontSizeSmall - 1;
          font-weight: 700;
          text-transform: uppercase;
          color: @colorTextMuted;
        }

        .CountryName,
        .LanguageName {
          margin-top: 1px;
          margin-left: 8px;
          font-size: @fontSizeBase;
          font-weight: 400;
        }

        .CountryFlag,
        .LanguageFlag {
          img {
            margin-top: 2px;
          }
        }
      }
    }

    .Divider {
      .SeparatorStyleHorizontal();
      margin: 0 0 10px;
    }

    .DropdownLink {
      display: block;
      min-height: 36px;
      padding: 0 25px 0 20px;
      line-height: 36px;
      cursor: pointer;
      transition: @transitionAll;

      &:hover {
        /* $--color-primary-light-9 */
        background-color: #ECF5FF;
      }

      a,
      .el-button {
        color: @colorBrandPrimary !important;
        font-weight: 700;
        text-decoration: none;
      }

      .MenuIcon {
        display: inline-block;
        width: 24px;
        height: 100%;
        text-align: left;
      }
    }
  }
</style>
