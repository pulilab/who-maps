<template>
  <el-row
    type="flex"
    class="ImportFile"
  >
    <el-col :span="6">
      <div class="Label">
        Select File
      </div>
      <input
        type="file"
        @change="onChange"
      >
    </el-col>
    <el-col :span="6">
      <div class="Label">
        Select Sheet
      </div>
      <xlsx-read
        :file="inputFile"
        :options="{ type: 'binary', cellDates: true }"
      >
        <xlsx-sheets>
          <template #default="{sheets}">
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
          </template>
        </xlsx-sheets>
        <xlsx-json
          :sheet="selectedSheet"
          @parsed="parsed = $event"
        />
      </xlsx-read>
    </el-col>
    <el-col :span="4">
      <div class="Label">
        Select Country
      </div>
      <country-select
        v-model="country"
      />
    </el-col>
    <el-col
      :span="4"
      :offset="1"
    >
      <div class="Label">
        Select Investor
      </div>
      <donor-select
        v-model="donor"
      />
    </el-col>
    <el-col
      :span="4"
      :offset="1"
      class="DraftOrPublished"
    >
      <div class="Label">
        Save as Draft or Publish projects
      </div>
      <el-radio
        v-model="isDraftOrPublish"
        label="draft"
      >
        Draft
      </el-radio>
      <el-radio
        v-model="isDraftOrPublish"
        label="publish"
      >
        Publish
      </el-radio>
    </el-col>
    <el-col
      :span="2"
      class="ConfirmSettings"
    >
      <div class="Label">
        Action
      </div>
      <el-button @click="save">
        Confirm
      </el-button>
    </el-col>
  </el-row>
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
      this.$router.push(this.localePath({ name: 'organisation-admin-import-id', params: { ...this.$route.params, id: importItem.id }, query: undefined }));
    }
  }
};
</script>

<style lang="less">
.ImportFile {
  .SheetSelector{
    width: 90%;
  }
}
</style>
