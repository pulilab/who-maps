<template>
  <div class="ReferenceList">
    <div class="DocumentList">
      <ReferenceDocumentList
        :documents="documents"
        :emptyMessage="emptyMessage"
        :actions="false"
        @details="showDocumentDetails"
        class=""
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ReferenceDocumentList from '@/components/documents/ReferenceDocumentList'

export default {
  components: {
    ReferenceDocumentList,
  },
  data() {
    return {
      emptyMessage: this.$gettext('No Reference Documents can be found with the current filters.'),
    }
  },
  computed: {
    ...mapGetters({
      documents: 'documents/getDocuments',
    }),
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

<style lang="less">
@import '~assets/style/variables.less';

.ReferenceList {
  box-sizing: border-box;
  background-color: white;
  .DocumentList {
    height: calc(100vh - 168px);
    overflow: auto;
  }
}
</style>