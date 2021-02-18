<template>
  <div class="wrapper">
    <el-row type="flex" :gutter="30" class="resume-group">
      <el-col :span="5">
        <resume-widget>
          <translate>Published Projects</translate>
          <template #content>
            <growth :incoming="incoming" large absolute />
            <growth :incoming="incoming" :previous="previous" />
          </template>
        </resume-widget>
      </el-col>
      <el-col :span="5">
        <resume-widget>
          <translate>Publishable Projects</translate>
          <template #content>
            <growth :incoming="incoming" large absolute />
            <growth :incoming="incoming" :previous="previous" />
          </template>
        </resume-widget>
      </el-col>
      <el-col :span="5">
        <resume-widget>
          <translate>Unpublished Projects</translate>
          <template #content>
            <growth :incoming="incoming" large absolute />
          </template>
        </resume-widget>
      </el-col>
      <el-col :span="5">
        <resume-widget>
          <translate>Deletable Projects</translate>
          <template #content>
            <growth :incoming="incoming" large absolute />
            <growth :incoming="incoming" :previous="previous" />
          </template>
        </resume-widget>
      </el-col>
      <el-col :span="5">
        <resume-widget no-border>
          <translate>Monthly growth of Projects</translate>
          <template #content>
            <growth :incoming="incoming" :previous="previous" large />
            <micro-line-chart :data="data" :width="72" :height="26" />
          </template>
        </resume-widget>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Growth from "@/components/common/charts/utilities/Growth";
import MicroLineChart from "@/components/common/charts/utilities/MicroLineChart";
import ResumeWidget from "@/components/common/charts/ResumeWidget";

export default {
  components: {
    Growth,
    MicroLineChart,
    ResumeWidget,
  },
  data() {
    return {
      incoming: 0,
      previous: 0,
      data: [1, 2, 3],
      interval: () => {},
    };
  },
  created() {
    this.interval = setInterval(() => {
      this.handleChange(100);
      this.randomArray(15);
    }, 5000);
  },
  beforeDestroy() {
    console.log("time to clean intervals");
    clearInterval(this.interval);
  },
  methods: {
    handleChange(max) {
      this.incoming = Math.floor(Math.random() * Math.floor(max));
      this.previous = Math.floor(Math.random() * Math.floor(max));
    },
    randomArray(length) {
      this.data = Array.from({ length }, () =>
        Math.floor(Math.random() * length)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 80px 60px;
  background-color: #f2f2f2;

  .resume-group {
    background-color: white;
    padding: 16px 40px;
  }
}
</style>
