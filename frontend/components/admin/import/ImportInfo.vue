<template>
  <table class="queue-table">
    <thead>
      <th><translate>File Name</translate></th>
      <th><translate>Sheet Name</translate></th>
      <th><translate>Collection Name</translate></th>
      <th><translate>Collection URL</translate></th>
      <th>
        <translate>Editor status</translate>
      </th>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="flex align-items-center">
            <fa :icon="['far', 'file-excel']" class="excel" />
            {{ info.fileName }}
          </div>
        </td>
        <td><strong>{{ info.sheetName }}</strong></td>
        <td>
          <span v-if="info.collectionName">{{ info.collectionName }}</span>
          <span v-else class="na">n/a</span>
        </td>
        <td>
          <div v-if="info.collectionName" class="wrapper">
            <div>
              <a :href="collectionUrl" target="_blank">{{ collectionUrl }}</a>
            </div>
            <copy-to-clipboard-button
              tool-tip="Copy shareable link"
              :content="collectionUrl"
              class="copy-btn"
            />
          </div>
          <div v-else class="wrapper na">
            n/a
          </div>
        </td>
        <td>
          <translate v-if="info.addMeAsEditor" key="added">
            You are each project's editor
          </translate>
          <translate v-else key="orphan">
            Projects may be orphans
          </translate>
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
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    collectionUrl () {
      return this.info.collectionUrl && (typeof window !== 'undefined')
        ? `${window.location.origin}${this.localePath({
          name: 'organisation-collection-id',
          params: { id: this.info.collectionUrl }
        })}`
        : ''
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
      .na {
        color: #9D9D9D;
      }
      .wrapper {
        position: relative;
        flex-grow: 1;
        a {
          display: inline-block;
          color: @colorBrandPrimary;
          text-decoration: none;
          :hover {
            text-decoration: underline;
          }
        }
      }
      .copy-btn {
        position: absolute;
        right: 6px;
        top: -4px;
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
