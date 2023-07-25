<template>
  <div :class="`UserDropdown ${activeMenuStyle}`">
    <el-popover
      v-model="shown"
      placement="bottom-end"
      visible-arrow="false"
      popper-class="CustomPopover UserDropdownPopper"
    >
      <el-button
        slot="reference"
        type="text"
        :class="`ButtonPopper ${activeMenuStyle}`"
      >
        <fa icon="user-circle" />{{ user.name }}<fa icon="caret-down" />
      </el-button>

      <div class="DropdownContent">
        <!-- User info block -->
        <div class="UserInfoSection">
          <div class="Item">
            <div class="ItemTitle">
              <translate>Email</translate>
            </div>
            {{ user.email }}
          </div>

          <div class="Item">
            <div class="ItemTitle">
              <translate>Country</translate>
            </div>
            <country-item
              v-if="user.country"
              :id="user.country"
            />
          </div>

          <div class="Item">
            <div class="ItemTitle">
              <translate> Site Language</translate>
            </div>

            <language-select
              v-model="currentLanguage"
              size="small"
            />
          </div>
        </div>

        <!-- User links block -->
        <div class="Divider" />
        <div class="DropdownLink">
          <nuxt-link
            :to="localePath({name: 'organisation-edit-profile', params: $route.params})"
            @click.native="closePopover"
          >
            <span class="MenuIcon">
              <fa icon="user-edit" />
            </span>
            <translate>My profile</translate>
          </nuxt-link>
        </div>

        <div v-if="isUserSCA" class="DropdownLink">
          <nuxt-link
            :to="localePath({name: 'organisation-admin-registry', params: $route.params})"
            @click.native="closePopover"
          >
            <span class="MenuIcon">
              <svg viewBox="0 0 24 24" class="registry">
                <path fill="currentColor" d="M14,8H10V6H14V8M20,4V20C20,21.11 19.11,22 18,22H6C4.89,22 4,21.11 4,20V4A2,2 0 0,1 6,2H18C19.11,2 20,2.9 20,4M18,13H6V20H18V13M18,4H6V11H18V4M14,15H10V17H14V15Z" />
              </svg>
            </span>
            <translate>Policy Registry admin</translate>
          </nuxt-link>
        </div>

        <div v-if="isUserCA" class="DropdownLink">
          <nuxt-link
            :to="localePath({name: 'organisation-admin-country', params: $route.params})"
            @click.native="closePopover"
          >
            <span class="MenuIcon">
              <fa icon="globe-africa" />
            </span>
            <translate>Country admin</translate>
          </nuxt-link>
        </div>

        <div v-if="isUserDA" class="DropdownLink">
          <nuxt-link
            :to="localePath({name: 'organisation-admin-donor', params: $route.params})"
            @click.native="closePopover"
          >
            <span class="MenuIcon">
              <fa icon="hand-holding-usd" />
            </span>
            <translate>Investor admin</translate>
          </nuxt-link>
        </div>

        <div v-if="isSuperUser" class="DropdownLink">
          <nuxt-link
            :to="localePath({name: 'organisation-graphs', params: $route.params})"
            @click.native="closePopover"
          >
            <span class="MenuIcon">
              <fa icon="chart-bar" />
            </span>
            <translate>KPI Graphs</translate>
          </nuxt-link>
        </div>

        <div class="DropdownLink">
          <nuxt-link
            :to="localePath({name: 'organisation-admin-import', params: $route.params})"
            @click.native="closePopover"
          >
            <span class="MenuIcon">
              <fa icon="file-import" />
            </span>
            <translate>Import interface</translate>
          </nuxt-link>
        </div>

        <div class="DropdownLink">
          <nuxt-link
            :to="localePath({name: 'organisation-admin-api', params: $route.params})"
            @click.native="closePopover"
          >
            <span class="MenuIcon">
              <fa icon="code" />
            </span>
            <translate>API key</translate>
          </nuxt-link>
        </div>

        <div class="DropdownLink" @click="logout">
          <el-button type="text">
            <span class="MenuIcon">
              <fa icon="power-off" />
            </span>
            <translate>Logout</translate>
          </el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LanguageSelect from './LanguageSelect'
import CountryItem from './CountryItem'

export default {
  components: {
    LanguageSelect,
    CountryItem
  },
  data () {
    return {
      shown: false,
      menuRoutes: [
        '/edit-profile',
        '/admin/country',
        '/admin/donor',
        '/admin/import/',
        '/admin/api',
        '/graphs',
      ]
    }
  },
  computed: {
    ...mapGetters({
      userSt: 'user/getProfile'
    }),
    user() {
      return this.$auth.user
    },
    isSuperUser () {
      return this.user && this.user.is_superuser
    },
    isUserCA () {
      return (this.user.account_type_approved && ['CA', 'SCA'].includes(this.user.account_type)) || this.isSuperUser
    },
    isUserSCA () {
      return (this.user.account_type_approved && this.user.account_type === 'SCA') || this.isSuperUser
    },
    isUserDA () {
      return (this.user.account_type_approved && ['DA', 'SDA'].includes(this.user.account_type)) || this.isSuperUser
    },
    currentLanguage: {
      get () {
        return this.$i18n.locale
      },
      set (value) {
        // for now on language switch we need a full page change
        const path = this.switchLocalePath(value)
        window.location.href = path
        this.shown = false
      }
    },
    insideRoute() {
      return this.menuRoutes.find(route => this.$route.path.endsWith(route))
    },
    activeMenuStyle() {
      return this.insideRoute ? 'nuxt-link-active' : ''
    },
  },
  methods: {
    ...mapActions({
      doLogout: 'user/logout'
    }),
    closePopover () {
      this.shown = false
    },
    logout () {
      this.closePopover()
      this.$router.push(this.localePath({ name: 'organisation-login', params: undefined, query: undefined }))
      this.doLogout()
    },
  }
}
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .UserDropdownPopper {
    transform: translate(10px, -30px);
  }

  .UserDropdown {
    position: relative;
    &.nuxt-link-active {
      color: @colorBrandAccent;
      &::before {
        background-color: @colorBrandAccent;
        transform: translateY(0);
      }
    }
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

  .ButtonPopper {
    height: 24px;
    margin: 0 5px 0 5px;
    padding: 0 0 0 10px;
    border: 0;
    font-size: @fontSizeBase;
    font-weight: 700;
    line-height: 24px;
    color: @colorBrandPrimary;
    text-decoration: none;

    &.nuxt-link-active {
      color: @colorBrandAccent;
    }

    .svg-inline--fa {
      margin-right: 6px;

      &.fa-caret-down {
        margin: 0 0 0 10px;
      }
    }
  }

  .UserDropdownPopper {
    padding: 0;
  }

  .DropdownContent {
    // padding: 0 0 10px 0;

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
          color: @colorGray;
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
        background-color: mix(@colorWhite, @colorBrandPrimary, 90%);
      }

      a,
      .el-button {
        color: @colorBrandPrimary !important;
        font-weight: 700;
        text-decoration: none;
        white-space: nowrap;
      }

      a,
      .el-button > span {
        display: flex;
      }

      .el-button {
        width: 100%;
      }

  .MenuIcon {
    display: inline-block;
    width: 32px;
    height: 100%;
    text-align: left;

    .registry {
      position: relative;
      top: 3px;
      height: 16px;
    }
  }

  .nuxt-link-exact-active {
    color: @colorBrandAccent !important;
  }

}
}

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
