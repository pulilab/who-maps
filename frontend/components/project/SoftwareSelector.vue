<template>
  <lazy-el-select
    :value="value"
    :placeholder="$gettext('Select from list')"
    :no-data-text="$gettext('Type to filter softwares')"
    multiple
    filterable
    value-key="id"
    popper-class="PlatformSelectorDropdown"
    class="SoftwareBucketSelector"
    :filter-method="filter"
    @change="changeHandler"
    @blur="$emit('blur')"
  >
    <el-option
      v-if="newPlatform"
      :key="newPlatform.id"
      :label="newPlatform.name"
      :value="newPlatform.id"
      class="new"
    >
      <div class="left">
        <b>{{ newPlatform.name }}</b>
        <translate tag="div" v-if="setNewSoftwareError" key="invalidNew" class="invalid">Software is already in the system. Please select from the list or type in a unique software name.</translate>
        <translate v-else tag="div" key="addNew">DHA Admin will update the Software list to include your new software name</translate>
      </div>
      <span class="right">
        <fa v-if="setNewSoftwareError" key="invalidNew" icon="exclamation-circle" class="invalid" />
        <b v-else key="addNew">
          <fa icon="plus-circle" />
          <translate>Add as new</translate>
        </b>
      </span>
    </el-option>
    <el-option
      v-for="software in availableSoftware"
      :key="software.id"
      :label="software.name"
      :value="software.id"
      :class="`${software.state === 2 ? 'requested' : ''}`"
    >
      <template v-if="software.state === 1">
        {{ software.name }}
      </template>
      <template v-if="software.state === 2">
        <span class="left">
          <b>{{ software.name }}</b>
        </span>
        <span class="right">
          <small>
            <fa icon="exclamation-triangle" />
            <translate>Requested, please wait for approval</translate>
          </small>
        </span>
      </template>
    </el-option>
  </lazy-el-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      newPlatform: null,
      availableSoftware: [],
      setNewSoftwareError: false
    }
  },
  computed: {
    ...mapGetters({
      softwares: 'projects/getTechnologyPlatforms'
    })
  },
  mounted () {
    this.syncAvailableSoftware(this.value)
  },
  methods: {
    ...mapActions({
      setNewSoftware: 'projects/setNewSoftware'
    }),
    async syncAvailableSoftware(ids) {
      this.availableSoftware = this.softwares
        .filter(s => ids.some(id => id === s.id))
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    async changeHandler(value) {
      const lastItem = value[value.length - 1]
      if (typeof lastItem === 'string') {
        try {
          const newSoftware = await this.setNewSoftware(lastItem)
          value[value.length - 1] = newSoftware
          await this.$nextTick()
          await this.syncAvailableSoftware(value)
        } catch (error) {
          this.setNewSoftwareError = true
          return
        }
      }
      this.$emit('change', value)
    },
    filter(value) {
      this.setNewSoftwareError = false
      this.availableSoftware = this.softwares.filter(platform =>
        platform.name.toLowerCase().includes(value.toLowerCase())
      )
      if (value) {
        this.newPlatform = { id: value, name: value }
      } else {
        this.newPlatform = null
      }
    }
  }
}
</script>

<style lang="less">
@import "../../assets/style/variables.less";
@import "../../assets/style/mixins.less";

.SoftwareBucketSelector {
  width: 100%;
}

.PlatformSelectorDropdown {
  max-width: 1068px;
}

.el-select-dropdown__item {
  position: relative;
  &.requested {
    background-color: #fffbdd;
    .left {
      float: left;
      width: 60%;
      overflow: hidden;
    }
    .right {
      float: right;
      overflow: hidden;
      color: @colorTextMuted;
      font-size: 10px;
      margin-top: 0px;
      margin-right: 24px;
      font-weight: bold;
      svg {
        color: #f8a72a;
        margin-right: 6px;
      }
    }
  }
  &.new {
    background-color: #fff8c4;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      overflow: hidden;
      line-height: 20px;
      flex-basis: 89%;
      b {
        display: inline-block;
        overflow: hidden;
      }
      .invalid {
        font-weight: bold;
        color: @colorBrandPrimary;
      }
    }
    .right {
      flex-shrink: 0;
      color: @colorBrandPrimary;
      font-size: 13px;
      margin-top: -7px;
      svg {
        margin-right: 10px;
        &.invalid {
          color: red;
          height: 28px;
          width: 28px;
        }
      }
    }
  }
}
</style>
