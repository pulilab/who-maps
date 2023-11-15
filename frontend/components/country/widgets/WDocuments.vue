<template>
  <div class="grid-content">
    <h3><translate>National Digital Health Reference Documents</translate></h3>
    <p>
      <translate>The WHO recognizes the importance of government-led planning as a key component to sucessful, scaled digital health implementations. Leadership from within the national MOH team have uploaded the reference documents below, and these represent a point-in time understanding of the specific national planning goals and strategic context.</translate>
    </p>

    <div v-for="doc in detailedDocuments" :key="doc.id" class="doc" @click="showDocumentDetails(doc)">
      <div class="title">
        {{ doc.title }}
      </div>
      <div class="details">
        <div class="meta">
          {{ doc.document | extension }} — {{ doc.size | size }}
        </div>
        <a :href="`/media/${doc.document}`" download @click.stop>
          <fa icon="download" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { format, differenceInCalendarDays } from 'date-fns'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'WDocuments',
  filters: {
    extension (filename) {
      return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename
    },
    size (bytes) {
      if (bytes === 0) return '0 Bytes'

      const k = 1024
      // const dm = decimals < 0 ? 0 : decimals;
      const dm = 0
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  },
  props: {
    documents: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries',
      referenceDocuments: 'system/getReferenceDocuments',
      referenceDocumentTypes: 'projects/getReferenceDocumentsTypes',
    }),
    detailedDocuments() {
      const now = new Date()
      return this.documents.map(doc => {
        const until = doc.valid_until ? new Date(doc.valid_until) : new Date()
        return {
          ...doc,
          country: this.countries.find(c => c.id == doc.country),
          language: this.referenceDocuments.languages.find(l => l.id == doc.language),
          types: doc.document_types.map(typeId => this.referenceDocumentTypes.find(t => t.id == typeId)),
          validFromDisplay: format(doc.valid_from, 'DD/MM/YYYY'),
          validUntilDisplay: doc.valid_until ? format(doc.valid_until, 'DD/MM/YYYY') : '',
          expired: differenceInCalendarDays(until, now) < 0,
        }
      })
    }
  },
  methods: {
    ...mapActions({
      openDocumentDialog: 'documents/openReferenceDocumentDialog',
    }),
    showDocumentDetails(doc) {
      this.openDocumentDialog(doc)
    },
  }

}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

  .doc {
    cursor: pointer;
    border-bottom: 1px solid #E0E0E0;
    padding: 20px 0;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: mix(@colorWhite, @colorBrandPrimary, 90%);
    }

    .title {
      margin-bottom: 6px;
      font-size: 14px;
      line-height: 21px;
      color: @colorBrandPrimary;
      font-weight: 700;
    }
    .details {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1em;
      // outline: 1px dotted blue;
      .meta {
        font-size: 12px;
        text-transform: uppercase;
        color: #9E9E9E;
      }
      svg {
        margin-right: 1em;
      }

    }
  }
  a {
    color: @colorBrandPrimary;
    text-decoration: none;
    font-weight: 700;
  }

</style>
