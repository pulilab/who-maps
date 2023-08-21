<template>
  <page-layout>
    <template #title>
      <translate>Impersonate user</translate>
    </template>
    <el-row class="api-card relative is-always-shadow">
      <transition name="block">
        <el-col class="center relative formitem">
          <translate tag="label">User's ID (number)</translate>
          <input
            v-model="userid"
            :placeholder="$gettext('Type in a user ID') | translate"
            :disabled="loading"
            class="api-input"
          />
        </el-col>
      </transition>
      <el-col class="center">
        <el-button type="primary el-button--medium" :loading="loading" @click="impersonate">
          <translate>Login as</translate>
        </el-button>
      </el-col>
      <el-col v-if="error" class="center">
        <div class="error-wrapper">
          {{ errorMessage }}
        </div>
      </el-col>
    </el-row>
  </page-layout>
</template>

<script>
import PageLayout from '@/components/common/wrappers/PageLayout'

export default {
  components: {
    PageLayout
  },
  loading: false,
  middleware: ['loginAsGuard'],
  data() {
    return {
      userid: null,
      loading: false,
      error: false,
      errorMessage: ''
    }
  },
  async fetch() {
    this.userid = this.$route.query?.userid
  },
  methods: {
    async impersonate() {
      try {
        this.error = false
        this.loading = true
        const { data } = await this.$axios.post('/api/jwt/impersonate/',{ user: this.userid})
        this.$auth.strategy.token.set(data.access)
        this.$auth.strategy.refreshToken.set(data.refresh)
        await this.$auth.fetchUser()
        await this.$router.push('/')
        this.loading = false
      } catch (error) {
        this.error = true
        if (error.response) {
          this.errorMessage = error.response.data.user
            ? error.response.data.user[0]
            : error.response.data.detail
        } else {
          this.errorMessage = this.$gettext('Cannot login with the provided user ID. Try again and if error persist, report to support.')
        }
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';

.relative {
  position: relative;
}

.center {
  text-align: center;
}

.api-card {
  display: flex;
  flex-flow: column;
  gap: 2em;
  padding: 3em;
  margin: auto;
  width: 560px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.api-card a {
  font-weight: 600;
  margin-left: 4px;
  text-decoration: none;
  color: #008dc9;
  cursor: pointer;
}

.formitem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;

  .api-input {
    box-sizing: border-box;
    display: inline-block;
    height: 40px;
    width: 50%;
    background-color: #ffffff;
    background-image: none;
    color: #474747;
    font-size: inherit;
    line-height: 40px;
    text-align: center;
    border-radius: 0;
    border: 1px solid #9b9b9b;
  }

  .api-input:hover {
    border-color: #b9b9b9;
  }

  .api-input:focus {
    outline: none;
    border-color: #008dc9;
  }

  .error-wrapper {
    padding: 1rem;
    color: @colorDanger;
    background-color: #fddbd8;
    font-weight: bold;
  }
}


</style>
