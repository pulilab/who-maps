<template>
  <table class="PolicyList">
    <tbody v-if="isEmpty && loading">
      <tr>
        <td class="state">Loading documents...</td>
      </tr>
    </tbody>
    <tbody v-else-if="isEmpty && !loading">
      <tr>
        <td class="state">{{ emptyMessage }}</td>
      </tr>
    </tbody>
    <template v-else-if="!isEmpty">
      <thead >
        <tr>
          <translate tag="th">Country</translate>
          <translate tag="th">Title</translate>
          <translate tag="th">Period</translate>
          <translate tag="th">Type</translate>
          <translate tag="th">Language</translate>
          <translate tag="th">Keywords</translate>
          <translate tag="th">Featured</translate>
          <translate v-if="actions" tag="th">Actions</translate>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in documents" :key="doc.id" @click="showDocumentDetails(doc)">
          <td>
            <div class="country">
              <CountryFlag :code="doc.country.code" small />
              <span>{{ doc.country.name }}</span>
            </div>
          </td>
          <td class="title">
            {{ doc.title }}
          </td>
          <td>
            <PolicyPeriod :document="doc" />
          </td>
          <td>
            <div class="tags">
              <span v-for="type in doc.types" :key="type.id">
                {{ type.name }}
              </span>
            </div>
          </td>
          <td class="language">
            {{ doc.language.name }}
          </td>
          <td>
            <div class="tags">
              <span v-for="(tag,i) in doc.tags" :key="i">
                {{ tag }}
              </span>
            </div>
          </td>
          <td class="featured">
            <i :class="`${doc.featured ? 'el-icon-star-on' : 'el-icon-star-off'}`" />
          </td>
          <td v-if="actions">
            <div class="actions">
              <el-tooltip :content="$gettext('Edit document')" placement="top">
                <el-button icon="el-icon-edit" size="medium" type="text" @click.stop="editPolicyDocument(doc)" />
              </el-tooltip>
              <el-tooltip :content="$gettext('Delete document')" placement="top">
                <el-button icon="el-icon-delete" size="medium" type="text" class="delete" @click.stop="confirmDeletePolicyDocument(doc)" />
              </el-tooltip>
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </table>
</template>

<script>
import { mapGetters } from "vuex";
import CountryFlag from '@/components/common/CountryFlag'
import PolicyPeriod from '@/components/common/PolicyPeriod'

export default {
  components: {
    CountryFlag,
    PolicyPeriod
  },
  props: {
    documents: {
      type: Array,
      required: true
    },
    emptyMessage: {
      type: String,
      default: 'Empty'
    },
    actions: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      loading: 'registry/getLoading'
    }),
    isEmpty() {
      return this.documents.length === 0
    },
  },
  methods: {
    showDocumentDetails(doc) {
      this.$emit('details', doc)
    },
    editPolicyDocument(doc) {
      this.$emit('edit', doc)
    },
    confirmDeletePolicyDocument(doc) {
      this.$emit('delete', doc)
    },
  },
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.PolicyList {
  width: calc(100% - 2em);
  margin: auto;
  font-size: 12px;
  border-collapse: collapse;

  thead {
    top: 0;
    position: sticky;
    background-color: white;
    box-shadow: 0 1px 0 0 #eee;
  }

  tr {
    border-bottom: 1px solid #eee;
    &:hover td {
      cursor: pointer;
      background-color: mix(@colorWhite, @colorBrandPrimary, 90%);
      &.state {
        cursor: default;
        background-color: transparent;
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }

  th {
    padding: 16px 0;
  }

  td {
    display: table-cell;
    vertical-align: top;
    padding: 16px 8px;

    &.state {
      padding-top: 3em;
      text-align: center;
      font-size: 1.2em;
    }

    &.title {
      min-width: 320px;
      font-weight: bold;
    }

    &.language {
      text-align: center;
    }

    .country {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 82px;
    }

    &.featured {
      color: @colorOwner;
      text-align: center;
      font-size: 1.2rem;
      i {
        display: inline-block;
        &.el-icon-star-on {
          font-size: 1.5rem;
        }
      }
    }
  }

  .tags {
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    gap: 4px;
    span {
      flex-grow: 0;
      background-color: #eee;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 13px;
    }
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 3px;
    button {
      padding: 0;
    }
    .delete {
      &:hover {
        color: red;
      }
    }
  }
}
</style>