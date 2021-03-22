<template>
  <div :class="`${noMargin ? 'flex no-margin' : 'flex'}`" v-show="show">
    <div v-if="prepend" class="prepend">
      <h2>{{ prepend }}.</h2>
    </div>
    <div :class="`${row && 'full-width'}`">
      <h2 v-if="header"><i v-if="icon" :class="icon" />{{ header }}</h2>
      <template v-if="content">
        <template v-if="typeof this.contents === 'string'">
          <nuxt-link v-if="link" :to="content" target="_blank">
            {{ contents }}
          </nuxt-link>
          <span v-else :class="{ na: this.contents === this.na }">
            {{ contents }}
          </span>
        </template>
        <template v-if="typeof this.contents === 'number'">
          <span>{{ contents }}</span>
        </template>
        <template v-if="typeof this.contents === 'object'">
          <ul>
            <template v-if="dhi || interoperability">
              <template v-if="dhi">
                <li v-for="content in contents" :key="content.name">
                  <p>
                    <b>{{ title }}</b>
                  </p>
                  {{ content.name }}
                  <p>
                    <b>{{ subtitle }}</b>
                  </p>
                  <ul>
                    <li
                      v-for="category in content.categories"
                      :key="category.id"
                    >
                      {{ category.name }}
                    </li>
                  </ul>
                </li>
              </template>
              <template v-if="interoperability">
                <li v-for="content in contents" :key="content.id">
                  <p>
                    <b>{{ content.label }}</b>
                  </p>
                  <nuxt-link :to="content.link" target="_blank">
                    {{ content.link }}
                  </nuxt-link>
                </li>
              </template>
            </template>
            <template v-else>
              <li v-for="content in contents" :key="content">{{ content }}</li>
            </template>
          </ul>
        </template>
      </template>
      <template v-else>
        <!-- row format-->
        <el-row v-if="row">
          <el-col v-for="field in fields" :key="field.id" :span="field.span">
            <view-field v-bind="field" no-margin />
          </el-col>
        </el-row>
        <!-- no content at all-->
        <template v-else>
          <span class="na">{{ na }}</span>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import ViewField from "@/components/project/wrappers/ViewField";

export default {
  name: "view-field",
  components: {
    ViewField,
  },
  props: {
    prepend: {
      type: Number,
      default: 0,
    },
    header: {
      type: String,
      required: false,
    },
    content: {
      type: [Array, String, Number],
      default: undefined,
    },
    dhi: {
      type: Boolean,
      default: false,
    },
    interoperability: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
    show: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: "",
    },
    row: {
      type: Boolean,
      default: false,
    },
    noMargin: {
      type: Boolean,
      default: false,
    },
    link: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      default: () => [],
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
        case "number":
          return this.content;
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
  a {
    color: @colorBrandPrimary;
    text-decoration: none;
    transition: all 1s ease-out;
    &:hover {
      color: @colorBrandPrimaryLight;
      text-decoration: underline;
    }
  }
  &.no-margin {
    margin: 0px;
    width: 100%;
  }
  .full-width {
    width: 100%;
  }
  .na {
    color: @colorTextMuted;
  }
  .prepend {
    margin-right: 25px;
  }
}
</style>
