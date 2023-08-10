<template>
  <el-dialog
    :visible.sync="dialog"
    :title="$gettext('Country Reference Document')"
    modal
    show-close
    top="10vh"
    width="80vw"
    @closed="closeDialog"
  >
    <div v-if="document" class="DocumentDialogBody">
      <h1>
        {{ document.title }}
      </h1>
      <div class="content-wrapper">
        <div class="content-header">
          <div class="tag-wrapper">
            <div>
              <translate tag="div" class="label">
                Document type
              </translate>
              <div class="tags">
                <span v-for="type in document.types" :key="type.id">
                  {{ type.name }}
                </span>
              </div>
            </div>
            <div v-if="hasKeywords">
              <translate tag="div" class="label">
                Keywords
              </translate>
              <div class="tags">
                <span v-for="(tag,i) in document.tags" :key="i">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <p>{{ document.purpose }}</p>
        </div>
        <div class="meta-wrapper">
          <div>
            <translate tag="div" class="label">
              Document
            </translate>
            <a :href="`/media/${document.document}`" download class="download">
              <fa icon="download" />
              <translate>Download</translate>
            </a>
          </div>
          <div>
            <translate tag="div" class="label">
              Period
            </translate>
            <PolicyPeriod :document="document" />
          </div>
          <div>
            <translate tag="div" class="label">
              Country
            </translate>
            <div class="country">
              <CountryFlag :code="countryCode" small />
              <span>{{ countryName }}</span>
            </div>
          </div>
          <div>
            <translate tag="div" class="label">
              Language
            </translate>
            <strong>{{ language }}</strong>
          </div>
          <div v-if="author" class="author">
            <translate tag="div" class="label">
              Author
            </translate>
            <div>
              <strong>{{ author.name }}</strong>
              <div>
                <a :href="`mailto:${author.email}`">{{ author.email }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { mapGettersActions } from '@/utilities/form'
import PolicyPeriod from '@/components/common/PolicyPeriod'
import CountryFlag from '@/components/common/CountryFlag'

export default {
  components: {
    PolicyPeriod,
    CountryFlag,
  },
  computed: {
    ...mapGetters({
      document: 'registry/getDocument',
    }),
    ...mapGettersActions({
      dialog: ['registry','getDialog','setDialog', false],
    }),
    countryCode() {
      return this.document?.country?.code
    },
    countryName() {
      return this.document?.country?.name
    },
    language() {
      return this.document?.language?.name
    },
    author() {
      return this.document?.author || false
    },
    hasKeywords() {
      return this.document?.tags ? this.document?.tags.length > 0 : false
    }
  },
  methods: {
    ...mapActions({
      closeDialog: 'registry/closePolicyDocumentDialog'
    }),
    close() {
      this.closeDialog()
    },
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

::v-deep .el-dialog {
  max-height: 80vh;
  max-width: 800px;
}

::v-deep .el-dialog__body {
  background-color: white;
  max-height: calc(100vh - 30vh);
  padding: 0;
  padding: 2em;
  overflow: auto;
  word-break: initial;
}

.DocumentDialogBody {
  p {
    margin: 0;
    white-space: pre-line;
  }

  h1 {
    font-size: 18px;
    line-height: 24px;
    margin: 0;
    margin-bottom: 1em;
  }

  .content-wrapper {
    display: flex;
    gap: 2em;

    .label {
      font-size: 12px;
      color: @colorTextSecondary;
      margin-bottom: 8px;
    }

    .content-header {
      .tag-wrapper {
        display: flex;
        gap: 2em;
        margin-bottom: 1em;

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 0.5em;
          span {
            background-color: #eee;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 13px;
          }
        }
      }
    }

    .meta-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5em;
      margin-left: 1em;
      max-width: 256px;

      .download {
        cursor: pointer;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5em;
        font-weight: bold;
        &:hover {
          color: @colorBrandPrimary;
        }
      }

      .country {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .author {
        a {
          color: @colorBrandPrimary;
        }
      }
    }
  }
}
</style>