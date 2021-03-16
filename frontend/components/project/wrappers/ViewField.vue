<template>
  <div class="flex">
    <div v-if="prepend" class="prepend">
      <h2>{{ prepend }}.</h2>
    </div>
    <div>
      <h2>{{ header }}</h2>
      <template v-if="typeof this.contents === 'string'">
        <span :class="{ na: this.contents === this.na }">{{ contents }}</span>
      </template>
      <template v-if="typeof this.contents === 'object'">
        <ul>
          <li v-for="content in contents" :key="content">{{ content }}</li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prepend: {
      type: Number,
      default: 0,
    },
    header: {
      type: String,
      required: true,
    },
    content: {
      type: [Array, String],
      default: undefined,
    },
  },
  data() {
    return {
      na: this.$gettext("N/A"),
    };
  },
  computed: {
    contents() {
      switch (typeof this.content) {
        case "string":
          return this.content ? this.content : this.na;
        case "object":
          return this.content.length > 0 ? this.content : this.na;
        default:
          return this.na;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.flex {
  display: flex;
  font-size: 18px;
  font-style: italic;
  letter-spacing: 0;
  line-height: 27px;
  margin: 0 40px 48px;
  h2 {
    line-height: 21px;
    margin: 0 0 20px 0;
  }
  ul {
    margin: 0;
    padding: 0 0 0 20px;
  }
  .na {
    color: @colorTextMuted;
  }
  .prepend {
    margin-right: 25px;
  }
}
</style>
