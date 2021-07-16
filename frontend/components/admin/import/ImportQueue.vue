<template>
  <table class="queue-table">
    <thead>
      <th><translate>Sheet Name</translate></th>
      <th><translate>File Name</translate></th>
      <th>
        <div class="flex">
          <translate>Collection Name & URL</translate>
          <div class="search">
            <el-input clearable debounce prefix-icon="el-icon-search" placeholder="search" v-model="search" />
          </div>
        </div>
      </th>
    </thead>
    <tbody>
      <tr v-for="importItem in filteredQueue" :key="importItem.id">
        <td><strong>{{ importItem.sheet_name }}</strong></td>
        <td>
          <div class="flex align-items-center">
            <fa :icon="['far', 'file-excel']" class="excel" />
            {{ importItem.filename }}
          </div>
        </td>
        <td>
          <div class="flex">
            <div v-if="importItem.collection" class="wrapper">
              <div>{{ importItem.collection.name }}</div>
              <nuxt-link :to="`http://whomaps.com/collections/${importItem.collection.url}`">
                {{`http://whomaps.com/collections/${importItem.collection.url}`}}
              </nuxt-link>
              <!-- <div><a href="http://whomaps.com/collections/FGHtzu67">http://whomaps.com/collections/FGHtzu67</a></div> -->
              <el-tooltip content="Copy shareable link" placement="top">
                <div class="copy-btn">
                  <fa :icon="['far', 'copy']" size="lg" />
                </div>
              </el-tooltip>
            </div>
            <div v-else class="wrapper na">
              n/a
            </div>
            <div class="edit">
              <el-button type="text" size="small" @click="select(importItem)">
                <translate>Edit</translate>
              </el-button>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
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
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.queue-table {
  width: 100%;
  border-collapse: collapse;
  font-size: @fontSizeSmall;

  .flex {
    display: flex;
    align-items: center;
    position: relative;
  }

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
      .excel {
        margin-right: 4px;
        color: green;
        width: 16px;
        height: 16px;
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
      }
      .copy-btn {
        position: absolute;
        cursor: default;
        right: 90px;
        top: -4px;
        padding: 4px;
        color: @colorBrandPrimary;
        cursor: pointer;
        width: 16px;
        height: 16px;
        :hover {
          color: @colorBrandPrimaryLight;
        }
        :active {
          transform: scale(.92);
        }
      }
      .edit {
        position: absolute;
        top: -10px;
        bottom: -10px;
        right: 0;
        width: 82px;
        padding-top: 1px;
        text-align: center;
        border-left: 1px solid #DDE0E7;
        color: @colorBrandPrimary;
      }
    }
  }
}

</style>
