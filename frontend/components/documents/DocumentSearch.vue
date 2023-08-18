<template>
  <div class="DocumentSearch">
    <el-input
      v-model="filter.search"
      :placeholder="$gettext('Type something...') | translate"
    >
      <fa slot="prepend" icon="search" />
    </el-input>
    <div>
      <lazy-el-select
        v-model="filter.country"
        filterable
        clearable
        :placeholder="$gettext('Select country') | translate"
        class="mb"
      >
        <el-option
          v-for="country in countries"
          :key="country.id"
          :label="country.name"
          :value="country.id"
        />
      </lazy-el-select>

      <el-select
        v-model="filter.language"
        clearable
        :placeholder="$gettext('Select language')"
        class="mb"
      >
        <el-option
          v-for="language in referenceDocuments.languages"
          :key="language.id"
          :label="language.name"
          :value="language.id"
        />
      </el-select>

      <el-select
        v-model="filter.document_types"
        clearable
        :placeholder="$gettext('Select a document type')"
        class="mb"
      >
        <el-option
          v-for="type in referenceDocumentTypes"
          :key="type.id"
          :label="type.name"
          :value="type.id"
        />
      </el-select>

      <el-select
        v-model="filter.featured"
        :placeholder="$gettext('Select featured filter')"
        class="mb"
      >
        <el-option
          v-for="feat in featuredOptions"
          :key="feat.id"
          :label="feat.name"
          :value="feat.value"
        />
      </el-select>

      <el-select
        v-model="filter.valid"
        :placeholder="$gettext('Select validity filter')"
        class="mb"
      >
        <el-option
          v-for="valid in validityOptions"
          :key="valid.id"
          :label="valid.name"
          :value="valid.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
import FilterSwitch from '@/components/dashboard/FilterSwitch'
import FilterItem from '@/components/dashboard/FilterItem'

export default {
  name: 'DocumentSearch',
  components: {
    FilterSwitch,
    FilterItem
  },
  data() {
		return {
      featuredTooltip: this.$gettext('Show only documents that are marked as featued (start indicator)'),
      validTooltip: this.$gettext(`Show only documents that "Valid until" date is not set or is in the future`),
			filter: {
				search: '',
        country: [],
        document_types: null,
        language: null,
        featured: null,
        valid: null
			},
      featuredOptions: [
        { id: 1, name: this.$gettext('Featured and non featured'), value: null},
        { id: 2, name: this.$gettext('Featured only'), value: true},
        { id: 3, name: this.$gettext('Non featured only'), value: false},
      ],
      validityOptions: [
        { id: 1, name: this.$gettext('All periods'), value: null},
        { id: 2, name: this.$gettext('Valid documents only'), value: true},
        { id: 3, name: this.$gettext('Expired documents only'), value: false},
      ],
		}
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries',
      referenceDocuments: 'system/getReferenceDocuments',
      referenceDocumentTypes: 'projects/getReferenceDocumentsTypes',
    }),
    user() {
      return this.$auth.user
    },
  },
  mounted() {
    this.filter.country = this.user.country
  },
  watch: {
    filter: {
      deep: true,
      handler() {
        this.updateSearch()
      }
    }
  },
  methods: {
    ...mapActions({
      loadDocuments: 'documents/loadDocuments',
    }),
    updateSearch: debounce(function() {
      this.loadDocuments(this.filter)
    }, 500),
  }
}
</script>

<style lang="less">
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';

.DocumentSearch {
  box-sizing: border-box;
  width: @advancedSearchWidth;
  min-height: 100%;
  border-left: 1px solid @colorGrayLight;
  background-color: @colorWhite;

  .el-input-group {
    width: 87%;

  }

  .mb {
    margin-bottom: 12px;
  }

  > div {
    padding: 20px;
    border-bottom: 1px solid @colorGrayLight;

    .el-select {
      width: 100%;
    }

    &:last-child {
      border: 0;
    }
  }
}
</style>
