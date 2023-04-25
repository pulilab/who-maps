<template>
  <page-layout>
    <template #title>
      <translate>Manage API key</translate>
    </template>
    <el-row class="api-card relative is-always-shadow">
      <el-col class="center">
        <translate>Documentation can be found</translate>
        <nuxt-link
          target="_blank"
          to="/api/public-docs/"
        >
          <translate>here</translate>
        </nuxt-link>
      </el-col>
      <transition name="block">
        <el-col
          v-if="apiKey"
          class="center relative"
        >
          <input
            ref="copyInput"
            v-model="apiKey"
            readonly
            class="api-input"
            :class="{ center: !canCopy }"
          >
          <span
            v-if="canCopy"
            class="MenuIcon api-input-copy"
          >
            <transition name="block">
              <fa v-if="copied" icon="clipboard-check" />
              <fa v-else @click="copyToClipboard" :icon="['far', 'copy']" />
            </transition>
          </span>
        </el-col>
      </transition>
      <el-col class="center">
        <el-button
          v-if="apiKey"
          key="deleteBtn"
          type="danger el-button--medium"
          @click="deleteApiKey"
        >
          <translate>Inactivate API key</translate>
        </el-button>
        <el-button
          v-else
          key="createBtn"
          type="primary el-button--medium"
          @click="createAPIKey"
        >
          <translate>Create API key</translate>
        </el-button>
      </el-col>
    </el-row>
  </page-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'

export default {
  name: 'ApiAdmin',
  components: {
    PageLayout
  },
  data () {
    return {
      canCopy: false,
      copied: false
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile',
      apiKey: 'user/getApiKey'
    })
  },
  mounted () {
    this.canCopy = navigator.clipboard
    this.loadApiKey()
  },
  methods: {
    ...mapActions({
      createAPIKey: 'user/createApiKey',
      deleteApiKey: 'user/deleteApiKey',
      loadApiKey: 'user/loadApiKey'
    }),
    async copyToClipboard () {
      this.copied = true
      await navigator.clipboard.writeText(this.$refs.copyInput.value)
      setTimeout(() => {
        this.copied = false
      }, 2500)
    }
  }
}
</script>

<style scoped>
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

.api-input {
  -webkit-appearance: none;
  background-color: #ffffff;
  background-image: none;
  border-radius: 0;
  border: 1px solid #9b9b9b;
  box-sizing: border-box;
  color: #474747;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

.api-input:hover {
  border-color: #b9b9b9;
}

.api-input:focus {
  outline: none;
  border-color: #008dc9;
}

.api-input-copy {
  cursor: pointer;
  position: absolute;
  padding: 4px;
  right: 14px;
  top: 8px;
  color: #008dc9;
}

.api-input-copy:active {
  transform: scale(0.9);
}

.block-enter {
  opacity: 0;
}

.block-enter-active {
  animation: slide-in 0.3s ease-out forwards;
  transition: opacity 0.3s;
}
.block-leave {
  opacity: 1;
}
.block-move {
  transition: all 0.3s ease;
  position: absolute;
}

.block-leave-active {
  animation: slide-out 0.3s ease-out forwards;
  transition: opacity 0.3s;
  opacity: 0;
}
@keyframes slide-in {
  from {
    transform: translateY(-20px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}
</style>
