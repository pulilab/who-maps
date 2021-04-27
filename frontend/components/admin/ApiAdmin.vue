<template>
  <div class="screen">
    <div class="PageTitle">
      <h2>
        Manage API key
      </h2>
    </div>
    <div class="api-card-wrapper">
      <el-row class="api-card relative is-always-shadow">
        <el-col class="center">
          Documentation can be found
          <label>
            <a href="#" target="_blank">
              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-external-link-alt fa-w-16"><path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z" class=""></path></svg>
              <span>here</span>
            </a>
          </label>
        </el-col>
        <transition name="block">
          <el-col v-if="apiKey !== ''" class="center relative">
            <input v-model="apiKey" ref="copyInput" readonly class="api-input" :class="{'center': !canCopy}" />
            <span v-if="canCopy" class="MenuIcon api-input-copy">
              <transition name="block">
                <fa icon="clipboard-check" v-if="copied" />                
                <fa @click="copyToClipboard" icon="copy" v-else />                
              </transition>
            </span>
          </el-col>        
        </transition>
        <el-col class="center">
          <el-button @click="createAPIKey" type="primary el-button--medium" v-if="apiKey === ''">
            Create API key
          </el-button>
          <el-button @click="removeAPIKey" type="danger el-button--medium" v-else>
            Inactivate API key
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import FacilityImport from './FacilityImport.vue'

export default {
  components: { FacilityImport },
  data() {
    return {
      apiKey: '',
      canCopy: false,
      copied: false,
    }
  },
  mounted() {
    this.canCopy = navigator.clipboard
  },
  methods: {
    createAPIKey() {
      this.apiKey = 'd2b48800-80c0-4a69-9346-60f02ef6d169'
    },
    removeAPIKey() {
      this.apiKey = ''
    },
    async copyToClipboard() {
      console.log(this.$refs.copyInput.value)
      this.copied = true
      await navigator.clipboard.writeText(this.$refs.copyInput.value)
      setTimeout(() => { this.copied = false }, 2500)
    }    
  }
}
</script>

<style scoped>
  .debug {
    outline: 1px solid #ff0000;
  }

  .relative {
    position: relative;
  }

  .center {
    text-align: center;
  }
    
  .screen {
    height: calc(100vh - 168px);
    overflow-y: auto;
  } 

  .api-card-wrapper {
    display: flex;
    flex-flow: column;
    align-items: center;    
    /*height: calc(100vh - 284px);*/
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

  .api-card label {
    font-weight: 600;
  }
  
  .api-card a {
    margin-left: 4px;
    text-decoration: none;
    color: #008DC9;
    cursor: pointer;
  }

  .api-input {
    /*width: 100%;
    box-sizing: border-box;
    padding: 12px;
    background-color: #f5f3ef;
    border: 1px solid #a8a8a9;*/
    -webkit-appearance: none;
    background-color: #FFFFFF;
    background-image: none;
    border-radius: 0;
    border: 1px solid #9B9B9B;
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
    border-color: #B9B9B9;
  }

  .api-input:focus {
    outline: none;
    border-color: #008DC9;
  }

  .api-input-copy {
    cursor: pointer;
    position: absolute;
    padding: 4px;
    right: 14px;
    top: 8px;
    color: #008DC9;
  }

  .api-input-copy:hover {
    color: #008DC9;
  }

  .api-input-copy:active {
    transform: scale(.9);
  }

  .block-enter {
    opacity: 0;
  }
  .block-enter-active {
    animation : slide-in .3s ease-out forwards;
    transition : opacity .3s;
  }
  .block-leave {
      opacity: 1;
  }
  .block-move {
    transition: all .3s ease;
    position: absolute;
  }

  .block-leave-active {
    animation : slide-out .3s ease-out forwards;
    transition : opacity .3s;
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
