<template>
  <div v-show="show" :class="`${noMargin ? 'flex no-margin' : 'flex'}`">
    <div v-if="prepend" class="prepend">
      <h2>{{ prepend }}.</h2>
    </div>
    <div :class="`${layout && 'full-width'}`">
      <h2 v-if="header">
        <i v-if="icon" :class="icon" />
        {{ header }}
      </h2>
      <template v-if="content">
        <template v-if="typeof contents === 'string'">
          <a v-if="link" :href="content" target="_blank">
            {{ contents }}
          </a>
          <span v-else-if="showNeedAuth" :class="`${showNeedAuth ? 'need-auth' : 'no-data'}`">
            {{ showNeedAuth ? needAuthText : noDataText }}
          </span>
          <span v-else :class="{ 'no-data': contents === noDataText }">
            {{ contents }}
          </span>
        </template>
        <template v-if="typeof contents === 'number'">
          <span>{{ contents }}</span>
        </template>
        <template v-if="typeof contents === 'object'">
          <ul>
            <template v-if="dhi || interoperability">
              <template v-if="dhi">
                <li v-for="item in contents" :key="item.name">
                  <p>
                    <b>{{ title }}</b>
                  </p>
                  {{ item.name }}
                  <p>
                    <b>{{ subtitle }}</b>
                  </p>
                  <template v-if="checkCategories(item.categories)">
                    <ul>
                      <li
                        v-for="category in item.categories"
                        :key="category.id"
                      >
                        {{ category.name }}
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    <span class="no-data">{{ noDataText }}</span>
                  </template>
                </li>
              </template>
              <template v-if="interoperability">
                <li v-for="item in contents" :key="item.id">
                  <p>
                    <b>{{ item.label }}</b>
                  </p>
                  <a :href="item.link" target="_blank">
                    {{ item.link }}
                  </a>
                </li>
              </template>
            </template>
            <template v-else>
              <li v-for="item in contents" :key="item">
                {{ item }}
              </li>
            </template>
          </ul>
        </template>
      </template>
      <template v-else>
        <!-- row format-->
        <template v-if="layout">
          <el-row v-for="row in rows" :key="row.id">
            <p v-if="row.name">
              <b>{{ row.name }}</b>
            </p>
            <el-col v-for="col in row.cols" :key="col.id" :span="col.span">
              <ViewField v-bind="col" no-margin />
            </el-col>
          </el-row>
        </template>
        <!-- no content at all-->
        <template v-else>
          <span :class="`${showNeedAuth ? 'need-auth' : 'no-data'}`">{{ showNeedAuth ? needAuthText : noDataText }}</span>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import ViewField from '@/components/project/wrappers/ViewField'

export default {
  name: 'ViewField',
  components: {
    ViewField
  },
  props: {
    prepend: {
      type: [String, Number],
      default: 0
    },
    header: {
      type: String,
      default: ''
    },
    content: {
      type: [Array, String, Number],
      default: undefined
    },
    needAuth: {
      type: Boolean,
      default: false
    },
    dhi: {
      type: Boolean,
      default: false
    },
    interoperability: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: ''
    },
    layout: {
      type: Boolean,
      default: false
    },
    noMargin: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      noDataText: this.$gettext('No data'),
      needAuthText: this.$gettext('Please authenticate to view content')
    }
  },
  computed: {
    contents() {
      switch (typeof this.content) {
        case 'number':
          return this.content
        case 'string':
          return this.content ? this.content : this.noDataText
        case 'object':
          return this.content !== null && this.content.length > 0 ? this.content : this.noDataText
        default:
          return this.noDataText
      }
    },
    contentType() {
      return typeof this.content
    },
    contentsType() {
      return typeof this.contents
    },
    isAuth() {
      return this.$auth.loggedIn
    },
    showNeedAuth() {
      return this.needAuth && !this.isAuth
    }
  },
  methods: {
    checkCategories(items) {
      if (!items) return false
      const filterItems = items.filter((i) => i !== undefined)
      return filterItems.length > 0
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/variables.less';
.long-url() {
  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}

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
    .long-url();
    &:hover {
      color: @colorBrandPrimaryLight;
      text-decoration: underline;
    }
  }
  i {
    margin-right: 10px;
  }
  &.no-margin {
    margin: 0px;
    width: 100%;
  }
  .full-width {
    width: 100%;
  }
  .no-data {
    color: @colorTextMuted;
  }
  .need-auth {
    color: #f08188cc;
  }
  .prepend {
    margin-right: 25px;
  }
}
</style>
