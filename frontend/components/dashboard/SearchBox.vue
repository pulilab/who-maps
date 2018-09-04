<template>
  <div class="SearchBox">
    <el-row
      type="flex"
      class="SearchInput">
      <el-col>
        <el-input
          v-model="searchString"
          placeholder="Type something...">
          <fa
            slot="prepend"
            icon="search"
          />
        </el-input>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      class="SearchOptions">
      <el-col class="SearchOptionsHeader">
        <el-button
          type="text"
          size="small"
          class="MutedButton IconRight"
          @click="toggleOptionsVisibility"
        >
          Where to search in
          <fa
            v-show="optionsVisible"
            icon="caret-up"
          />
          <fa
            v-show="!optionsVisible"
            icon="caret-down"
          />
        </el-button>
        <el-tooltip
          v-model="showSearchBoxTooltip"
          effect="dark"
          content="Lorem Ipsum dolor sit"
          placement="left"
          manual
        >
          <el-button
            type="text"
            class="MutedButton"
            @click="showSearchBoxTooltip = !showSearchBoxTooltip"
          >
            <fa icon="question-circle" />
          </el-button>
        </el-tooltip>
      </el-col>

      <transition name="slide-fade">
        <el-col
          v-show="optionsVisible"
          class="SearchOptionsBody"
        >
          <el-checkbox-group
            v-model="selectedOptions"
            class="OnePerRow CheckboxSmall">
            <el-checkbox
              label="name"
              class="CheckboxSmall">Project Name</el-checkbox>
            <el-checkbox
              label="org"
              class="CheckboxSmall">Organisation Name</el-checkbox>
            <el-checkbox
              label="country"
              class="CheckboxSmall">Project Country</el-checkbox>
            <el-checkbox
              label="overview"
              class="CheckboxSmall">Overview of the digital health</el-checkbox>
            <el-checkbox
              label="partner"
              class="CheckboxSmall">Implementing Partners</el-checkbox>
            <el-checkbox
              label="donor"
              class="CheckboxSmall">Donors</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </transition>
    </el-row>
  </div>
</template>

<script>
import { mapGettersActions } from '../../utilities/form.js';

export default {
  data () {
    return {
      optionsVisible: false,
      showSearchBoxTooltip: false
    };
  },
  computed: {
    ...mapGettersActions({
      searchString: ['dashboard', 'getSearchString', 'setSearchString', 300],
      selectedOptions: ['dashboard', 'getSearchIn', 'setSearchIn', 0]
    })
  },
  methods: {
    toggleOptionsVisibility () {
      this.optionsVisible = !this.optionsVisible;
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .SearchBox {
    .SearchInput {}

    .SearchOptions {
      flex-direction: column;

      .SearchOptionsHeader {
        margin: 10px 0 0;

        .el-button--text {
          padding: 0;
        }

        .el-tooltip {
          float: right;
        }
      }

      .SearchOptionsBody {
        margin-top: 5px;

        .el-checkbox {
          margin: 5px 0 0;
          padding: 0;
        }
      }
    }

    .slide-fade-enter-active {
      transition: @transitionAll;
    }

    .slide-fade-leave-active {
      transition: @transitionAll;
    }

    .slide-fade-enter,
    .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
      transform: translateY(-10px);
      opacity: 0;
    }
  }
</style>
