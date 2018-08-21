<template>
  <div class="SearchBox">
    <el-row type="flex">
      <el-col>
        <el-input
          v-model="searchString"
          placeholder="Type something">
          <fa
            slot="prepend"
            icon="search"
          />
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <div class="SearchOptions">
        <div class="SearchOptionsHeader">
          <el-button
            type="text"
            @click="toggleOptionsVisibility"
          >
            Where to search in
            <fa
              v-show="optionsVisible"
              icon="arrow-up"
            />
            <fa
              v-show="!optionsVisible"
              icon="arrow-down"
            />
          </el-button>
          <el-tooltip
            v-model="showSearchBoxTooltip"
            effect="dark"
            content="LoremIpsu"
            placement="top"
            manual
          >
            <el-button
              type="text"
              @click="showSearchBoxTooltip = !showSearchBoxTooltip"
            >
              <fa icon="question-circle" />
            </el-button>
          </el-tooltip>
        </div>
        <transition name="slide-fade">
          <div
            v-show="optionsVisible"
            class="SearchOptionsBody"
          >
            <el-checkbox-group v-model="selectedOptions">
              <el-checkbox label="name"> Project Name </el-checkbox>
              <el-checkbox label="organisation"> Organisation Name </el-checkbox>
              <el-checkbox label="country"> Project Country </el-checkbox>
              <el-checkbox label="overview"> Overview of the digital health </el-checkbox>
              <el-checkbox label="partners"> Implementing Partners </el-checkbox>
              <el-checkbox label="donors"> Donors </el-checkbox>
            </el-checkbox-group>
          </div>
        </transition>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchString: '',
      optionsVisible: false,
      selectedOptions: [],
      showSearchBoxTooltip: false
    };
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
  .slide-fade-enter-active {
    transition: @transitionAll;
  }

  .slide-fade-leave-active {
    transition: @transitionAll;
  }

  .slide-fade-enter,
  .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(-20px);
    opacity: 0;
  }
}
</style>
