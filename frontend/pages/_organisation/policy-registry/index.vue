<template>
  <div class="RegistryList">
    <div class="DocumentList">
      <PolicyRegistryList
        :documents="documents"
        :actions="false"
        @details="showDocumentDetails"
        class=""
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PolicyRegistryList from '@/components/registry/PolicyRegistryList'

export default {
  components: {
    PolicyRegistryList,
  },
  computed: {
    ...mapGetters({
      documents: 'registry/getDocuments',
    }),
  },
  methods: {
    ...mapActions({
      openDocumentDialog: 'registry/openPolicyDocumentDialog',
    }),
    showDocumentDetails(doc) {
      this.openDocumentDialog(doc)
    },
  }
}
</script>

<style lang="less">
@import '~assets/style/variables.less';

.RegistryList {
  box-sizing: border-box;
  background-color: white;
  .DocumentList {
    height: calc(100vh - 168px);
    overflow: auto;
  }
}
</style>