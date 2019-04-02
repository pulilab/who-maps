<template>
  <el-form
    label-width="120px"
    label-position="top"
    class="ImportFile"
  >
    <el-form-item>
      <div slot="label">
        Select File
      </div>
      <input
        type="file"
        @change="onChange"
      >
    </el-form-item>
    <el-form-item>
      <div slot="label">
        Select Sheet
      </div>
      <xlsx-read
        :file="inputFile"
        :options="{ type: 'binary', cellDates: true }"
      >
        <template #default="{loading}">
          <xlsx-sheets>
            <template #default="{sheets}">
              <div v-loading="loading">
                <el-select
                  v-model="selectedSheet"
                  class="SheetSelector"
                  :disabled="!sheets || sheets.length === 0"
                >
                  <el-option
                    v-for="sheet in sheets"
                    :key="sheet"
                    :value="sheet"
                  >
                    {{ sheet }}
                  </el-option>
                </el-select>
              </div>
            </template>
          </xlsx-sheets>
          <xlsx-json
            :sheet="selectedSheet"
            @parsed="parsed = $event"
          />
        </template>
      </xlsx-read>
    </el-form-item>
    <el-form-item>
      <div slot="label">
        Select Country
      </div>
      <country-select
        v-model="country"
      />
    </el-form-item>
    <el-form-item>
      <div slot="label">
        Select Investor
      </div>
      <donor-select
        v-model="donor"
      />
    </el-form-item>
    <el-form-item

      class="DraftOrPublished"
    >
      <div slot="label">
        Draft or Publish
      </div>
      <el-radio-group v-model="isDraftOrPublish">
        <el-radio label="draft">
          Draft
        </el-radio>
        <el-radio label="publish">
          Publish
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      class="ConfirmSettings"
    >
      <el-button @click="save">
        Import
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex';
import DonorSelect from '@/components/common/DonorSelect';
import CountrySelect from '@/components/common/CountrySelect';
import { XlsxRead, XlsxSheets, XlsxJson } from 'vue-xlsx';

export default {
  components: {
    DonorSelect,
    CountrySelect,
    XlsxRead,
    XlsxSheets,
    XlsxJson
  },
  data () {
    return {
      country: null,
      donor: null,
      isDraftOrPublish: null,
      inputFile: null,
      selectedSheet: null,
      parsed: null
    };
  },
  methods: {
    ...mapActions({
      addDataToQueue: 'admin/import/addDataToQueue'
    }),
    onChange (event) {
      this.inputFile = event.target.files ? event.target.files[0] : null;
    },
    async save () {
      this.$nuxt.$loading.start('importXLSX');
      const importData = {
        filename: this.inputFile.name,
        country: this.country,
        donor: this.donor,
        sheet_name: this.selectedSheet,
        header_mapping: Object.keys(this.parsed[0]).map(title => ({ selected: null, title })),
        'draft': this.isDraftOrPublish === 'draft',
        'rows': [
          {
            'data': this.parsed
          }
        ]
      };
      const importItem = await this.addDataToQueue(importData);
      this.$nuxt.$loading.finish('importXLSX');
      this.$router.push(this.localePath({ name: 'organisation-admin-import-id', params: { ...this.$route.params, id: importItem.id }, query: undefined }));
    }
  }
};
</script>

<style lang="less">
.ImportFile {
  .SheetSelector{
    width: 100%;
  }
}
</style>
