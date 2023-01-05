<template>
  <div>
    <el-row class="NopeTitle">
      <el-col class="AdvancedSearchLink">
        <nuxt-link
          :to="localePath({name : page, params: $route.params})"
          class="NuxtLink IconRight"
        >
          <span>{{ title }}</span><fa icon="angle-right" />
        </nuxt-link>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="SearchResultsNope">
        <p class="TipText">
          <fa
            icon="info-circle"
            size="lg"
          />
          <span>
            {{ text }}
          </span>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    page: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/style/variables.less";
.NopeTitle {
  .AdvancedSearchLink {
    padding: 0 20px 12px;
  }
}
.SearchResultsNope {
  padding: 0 20px 20px;

  .TipText {
    display: inline-flex;
    align-items: flex-start;
    margin: 0;
    font-size: @fontSizeSmall;
    line-height: 18px;
    color: @colorTextSecondary;

    .svg-inline--fa {
      margin-right: 6px;
      color: @colorTextMuted;
    }
  }
}
</style>
