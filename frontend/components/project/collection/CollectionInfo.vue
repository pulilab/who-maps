<template>
  <table class="queue-table">
    <thead>
      <th><translate>Collection name</translate></th>
      <th><translate>Shareable URL</translate></th>
    </thead>
    <tbody>
      <tr>
        <td><strong>{{ info.name }}</strong></td>
        <td>
          <div class="wrapper">
            <div>
              <a :href="collectionUrl" target="_blank">{{ collectionUrl }}</a>
            </div>
            <copy-to-clipboard-button
              tool-tip="Copy shareable link"
              :content="collectionUrl"
              class="copy-btn"
            />
          </div>
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
      return this.info.url && (typeof window !== 'undefined')
        ? `${window.location.origin}${this.localePath({
          name: 'organisation-collection-id',
          params: { id: this.info.url }
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
      padding: 12px;
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
          color: @colorBrandPrimary;
          text-decoration: none;
          :hover {
            text-decoration: underline;
          }
        }
      }
      .copy-btn {
        position: absolute;
        right: 0px;
        top: -7px;
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
