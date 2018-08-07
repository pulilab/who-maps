<template>
  <div
    v-scroll-class:FixedNavigation="300"
    class="ProjectNavigation">
    <el-card>
      <div class="stepper">
        <ul>
          <li>
            <el-button
              type="text"
              @click="scrollTo('general')"
            >
              General
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('implementation')"
            >
              Implementation
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('technology')"
            >
              Technology
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('interoperability')"
            >
              Interoperability
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('country')"
            >
              Country Fields
            </el-button>
          </li>
          <li>
            <el-button
              type="text"
              @click="scrollTo('donor')"
            >
              Donor Fields
            </el-button>
          </li>
        </ul>
      </div>

      <div>
        <el-button> save draft </el-button>
        <el-button type="text">
          cancel
          <span class="hint"> go back to dashboard </span>
        </el-button>

      </div>

    </el-card>
  </div>
</template>

<script>
import VueScrollClass from 'vue-scroll-class';
export default {
  directives: {
    'scroll-class': VueScrollClass
  },
  methods: {
    scrollTo (where) {
      window.location.hash = '';
      this.$nextTick(() => {
        this.$router.replace(`#${where}`);
      });
    }
  }
};
</script>

<style lang="less">
  .ProjectNavigation {
    width: 288px;

    &.FixedNavigation {
      position: fixed;
      right: 0;
      top: 0;
    }
  }
</style>
