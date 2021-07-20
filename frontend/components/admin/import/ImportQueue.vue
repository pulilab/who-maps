<template>
  <table class="queue-table">
    <thead>
      <th>
        <div>
          <translate>File Name</translate>
        </div>
        <div>
          <translate>Sheet Name</translate>
        </div>
      </th>
      <th colspan="2">
        <div class="wrapper">
          <translate>Collection Name & URL</translate>
          <div class="search">
            <el-input clearable debounce prefix-icon="el-icon-search" placeholder="search" v-model="search" />
          </div>
        </div>
      </th>
    </thead>
    <tbody>
      <tr v-for="importItem in filteredQueue" :key="importItem.id">
        <td>
          <div class="file">
            <fa :icon="['far', 'file-excel']" class="excel" />
            <div class="import-info">
              <strong>{{ importItem.filename }}</strong>
              {{ importItem.sheet_name }}
            </div>
          </div>
        </td>
        <td>
          <div v-if="importItem.collection" class="wrapper">
            <div>{{ importItem.collection.name }}</div>
            <a :href="collectionUrl(importItem.collection.url)" target="_blank">{{ collectionUrl(importItem.collection.url) }}</a>
            <copy-to-clipboard-button
              tool-tip="Copy shareable link"
              :content="collectionUrl(importItem.collection.url)"
              class="copy-btn"
            />
          </div>
          <div v-else class="wrapper na">
            n/a
          </div>
        </td>
        <td class="edit">
          <div class="wrapper">
            <el-button type="text" size="small" @click="select(importItem)">
              <translate v-if="isDone(importItem)" key="editing">
                Edit
              </translate>
              <translate v-else key="showing">
                Show
              </translate>
            </el-button>
            <div class="numbers">
              <translate
                v-if="isDone (importItem)"
                key="progress"
                :parameters="{ imported: importItem.imported }"
              >
                Imported {imported} of {{ importItem.rows.length }}
              </translate>
              <div v-else class="done">
                <fa icon="check-circle" />
                <translate key="done">Import done</translate>
              </div>
            </div>
            <el-progress
              v-if="isDone(importItem)"
              :percentage="progressPercent(importItem)"
              :stroke-width="3"
              :show-text="false"
              class="progress"
            />
          </div>
          <!-- <div v-else class="wrapper done">
            <fa icon="check-circle" />
            <translate>Import done</translate>
          </div> -->
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import CopyToClipboardButton from '@/components/common/CopyToClipboardButton'

export default {
  components: {
    CopyToClipboardButton
  },
  props: {
    queue: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    filteredQueue () {
      return this.queue.filter((item) => {
        return item.filename.toUpperCase().includes(this.search.toUpperCase()) ||
               item.collection?.name.toUpperCase().includes(this.search.toUpperCase()) ||
               item.sheet_name.toUpperCase().includes(this.search.toUpperCase())
      })
    }
  },
  methods: {
    async select ({ id }) {
      this.$nuxt.$loading.start()
      await this.$nextTick()
      this.$router.push(
        this.localePath({
          name: 'organisation-admin-import-id',
          params: { ...this.$route.params, id: id },
          query: undefined
        })
      )
    },
    collectionUrl (url) {
      return url && (typeof window !== 'undefined')
        ? `${window.location.origin}${this.localePath({
          name: 'organisation-collection-id',
          params: { id: url }
        })}`
        : ''
    },
    isDone (importItem) {
      return importItem.rows.length !== importItem.imported
    },
    progressPercent (importItem) {
      return Math.floor((importItem.imported / importItem.rows.length) * 100)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.queue-table {
  width: 100%;
  border-collapse: collapse;
  font-size: @fontSizeSmall;

  thead {
    text-align: left;
    th {
      height: 42px;
      box-sizing: border-box;
      background-color: @colorBrandBlueLight;
      padding: 0 10px;
      border-left: 1px solid #DDE0E7;
      border-bottom: 2px solid #BDBDBD;
      span {
        flex-grow: 1;
      }
      .wrapper {
        display: flex;
        align-items: center;
      }
      .search {
        flex: 0 0 128px;
        ::v-deep input {
          background-color: transparent;
          border: none;
        }
      }
    }
    th:last-child {
      border-right: 1px solid #DDE0E7;
    }
  }
  tbody {
    td {
      border: 1px solid #DDE0E7;
      padding: 10px;
      vertical-align: top;
      .file {
        display: flex;
        align-items: center;
        position: relative;
        gap: 4px;
        .excel {
          margin-right: 4px;
          color: green;
          width: 24px;
          height: 24px;
        }
        .import-info {
          display: flex;
          flex-grow: 1;
          gap: 4px;
          flex-direction: column;
        }
      }
      .sheet {
        padding-left: 18px;
      }
      .wrapper {
        position: relative;
        flex-grow: 1;
        &.na {
          color: #9D9D9D;
        }
        a {
          display: inline-block;
          margin-top: 10px;
          color: @colorBrandPrimary;
          text-decoration: none;
          :hover {
            text-decoration: underline;
          }
        }
        .copy-btn {
          position: absolute;
          top: -4px;
          right: -2px;
          text-align: center;
          color: @colorBrandPrimary;
          :hover {
            color: @colorBrandPrimaryLight;
          }
          :active {
            transform: scale(.92);
          }
        }
      }
      &.edit {
        width: 82px;
        text-align: center;
        border-left: 1px solid #DDE0E7;
        button {
          color: @colorBrandPrimary;
          padding: 0;
        }
        .numbers {
          margin-top: 10px;
          font-size: @fontSizeExtraSmall;
          .done {
            display: flex;
            gap: 4px;
            justify-content: center;
            align-items: center;
            color: green;
          }
        }
        .progress {
          margin-top: 4px;
        }
      }
    }
  }
}

</style>
