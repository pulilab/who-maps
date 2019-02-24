<template>
  <div class="ImportPrototype">
    <template v-if="ready">
      <el-dialog
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        title="Select"
        width="80%"
      >
        <el-row type="flex">
          <el-col :span="12">
            <h3>Original Data</h3>
            {{ dialogData.original }}
          </el-col>
          <el-col :span="12">
            <donor-selector
              v-if="dialogData.column === 'donors'"
              v-model="dialogData.value"
            />
            <organisation-select
              v-if="dialogData.column === 'organisation'"
              v-model="dialogData.value[0]"
            />
            <his-bucket-selector
              v-if="dialogData.column === 'his_bucket'"
              v-model="dialogData.value"
            />
            <health-system-challenges-selector
              v-if="dialogData.column === 'hsc_challenges'"
              v-model="dialogData.value"
            />
            <health-focus-areas-selector
              v-if="dialogData.column === 'health_focus_areas'"
              v-model="dialogData.value"
            />
            <template v-if="dialogData.column === 'platforms'">
              <div
                v-for="(element, index) in dialogData.value"
                :key="index"
              >
                <platform-selector
                  v-model="dialogData.value"
                  :index="index"
                />
              </div>
              <el-button @click="dialogData.value.push(null)">
                Add more
              </el-button>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button @click="dialogVisible=false">
              Save
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <el-card class="box-card">
        <h3>New Import</h3>
        <el-row type="flex">
          <el-col :span="6">
            <div class="Label">
              Select Country
            </div>
            <country-select
              v-model="country"
              :disabled="introDone"
            />
          </el-col>
          <el-col
            :span="10"
            :offset="1"
          >
            <div class="Label">
              Select Investor
            </div>
            <donor-selector
              v-model="donors"
              :disabled="introDone"
            />
          </el-col>
          <el-col
            :span="6"
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
            <el-button
              v-if="country && isDraftOrPublish && !introDone"
              @click="introDone = true"
            >
              Confirm
            </el-button>
          </el-col>
        </el-row>

        <div
          v-if="introDone"
          class="XlsUpload"
        >
          <div>
            <file-upload
              :files="inputFile"
              :list-type="'text'"
              @update:files="processFile"
            />
          </div>
        </div>

        <el-row
          v-if="sheets.length > 0"
          type="flex"
        >
          <el-col
            v-for="s in sheets"
            :key="s"
          >
            <el-button @click="saveAndProcessSheet(s)">
              {{ s }}
            </el-button>
          </el-col>
        </el-row>

        <div>
          <h3>Previous imports</h3>
          <el-row
            v-for="(item, index) in queue"
            :key="index"
            type="flex"
          >
            <el-col :span="4">
              <div class="Label">
                Selected Country
              </div>
              <country-item :id="item.country" />
            </el-col>

            <el-col :span="4">
              <div class="Label">
                Selected Investor
              </div>
              <donor-item :id="item.donor" />
            </el-col>

            <el-col :span="4">
              <div class="Label">
                File Name
              </div>
              {{ item.filename }}
            </el-col>
            <el-col :span="4">
              <div class="Label">
                Sheet Name
              </div>
              {{ item.sheet_name }}
            </el-col>

            <el-col :span="4">
              <div class="Label">
                Draft or Published
              </div>
              <span v-if="item.draft">Draft</span>
              <span v-else>Publish</span>
            </el-col>

            <el-col :span="4">
              <div class="Label">
                Actions
              </div>
              <el-button @click="workOnThis(item)">
                Select
              </el-button>
            </el-col>
          </el-row>
        </div>

        <div
          v-if="imported && imported.length > 0"
          class="GlobalErrors"
        >
          <el-tag
            v-for="error in globalErrors"
            :key="error"
            type="danger"
          >
            <fa icon="exclamation" />
            {{ error }}
          </el-tag>
        </div>

        <!-- Data table -->
        <div class="ExportDataTable">
          <div class="Container">
            <div class="Row">
              <div
                v-if="headers.length > 0"
                class="Column Thin"
              >
                <el-button
                  circle
                  @click="saveAll"
                >
                  <fa icon="save" />
                </el-button>
              </div>
              <div
                v-for="(header, index) in headers"
                :key="index"
                class="Column Header"
              >
                <div class="Title">
                  {{ header.title }}
                </div>
                <div>
                  <el-select
                    v-model="header.selected"

                    size="small"
                    filterable
                    clearable
                    @change="columnChange(header)"
                  >
                    <el-option
                      v-for="item in availableFields"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>
              <div
                v-if="headers.length > 0"
                class="Column Header"
              >
                <div class="Title">
                  Empty Column
                </div>
                <div>
                  <el-select
                    v-model="additonalHeader"

                    size="small"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="item in availableFields"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>
            </div>

            <import-row
              v-for="(row, index) in rows"
              :key="index"
              ref="row"
              :index="index"
              :row="row"
              :class="['Row', `Row_${index}`]"
            >
              <template v-slot:default="{errors, valid, handleValidation, columns}">
                <div
                  class="Column Thin"
                >
                  <el-button
                    icon="el-icon-check"
                    :type="globalErrors.length > 0 || !valid ? 'warning' : 'success'"
                    circle
                    class="SaveButton"
                    @click="scrollToError(valid, index)"
                  />
                  <a
                    v-if="row.project"
                    :href="localePath({name: 'organisation-projects-id-edit', params: {id: row.project, organisation: $route.params.organisation}})"
                    target="_blank"
                    class="NuxtLink IconLeft"
                  >
                    <fa icon="share-square" />
                  </a>
                </div>
                <template
                  v-for="header in headers"
                >
                  <SmartCell
                    :key="index + header.title"
                    :disabled="!!row.project"
                    :value="columns[header.title]"
                    :column="header.selected"
                    :rules="validationRules[header.selected]"
                    class="Column"
                    :errors="errors"
                    :handle-validation="handleValidation"
                    @change="updateValue(index, header.title, $event)"
                    @openDialog="openDialogHandler(index, header.title, $event)"
                  />
                </template>
                <div class="Column" />
              </template>
            </import-row>
          </div>
        </div>
        <!-- / Data table -->
      </el-card>
    </template>
  </div>
</template>

<script>
import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { mapGetters, mapActions } from 'vuex';

import ImportRow from '@/components/admin/import/ImportRow';
import FileUpload from '@/components/common/FileUpload';
import SmartCell from '@/components/admin/import/SmartCell';
import DonorSelector from '@/components/project/DonorSelector';
import OrganisationSelect from '@/components/common/OrganisationSelect';
import CountrySelect from '@/components/common/CountrySelect';
import CountryItem from '@/components/common/CountryItem';
import DonorItem from '@/components/common/DonorItem';
import PlatformSelector from '@/components/project/PlatformSelector';
import HisBucketSelector from '@/components/project/HisBucketSelector';
import HealthSystemChallengesSelector from '@/components/project/HealthSystemChallengesSelector';
import HealthFocusAreasSelector from '@/components/project/HealthFocusAreasSelector';

import { projectFields, draftRules, publishRules } from '@/utilities/projects';
import { apiWriteParser } from '@/utilities/api';

const blackList = ['country', 'donors', 'coverage', 'national_level_deployment',
  'coverageData', 'team', 'viewers', 'coverageType', 'digitalHealthInterventions'];
const addendumFields = ['clients', 'health_workers', 'facilities'];
export default {

  components: {
    FileUpload,
    SmartCell,
    DonorSelector,
    OrganisationSelect,
    CountrySelect,
    CountryItem,
    DonorItem,
    ImportRow,
    PlatformSelector,
    HisBucketSelector,
    HealthSystemChallengesSelector,
    HealthFocusAreasSelector
  },
  data () {
    return {
      country: null,
      donors: [],
      isDraftOrPublish: null,
      introDone: false,
      inputFile: [],
      fileName: '',
      ready: false,
      imported: [],
      original: [],
      headers: [],
      sheets: [],
      fields: [
        ...Object.keys(projectFields()).filter(k => !blackList.includes(k)),
        ...addendumFields
      ],
      dialogData: null,
      currentQueueItem: null,
      additonalHeader: null
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile',
      queue: 'admin/import/getQueue'
    }),
    rows () {
      return this.imported.filter(i => !i.project);
    },
    availableFields () {
      const selected = this.headers.map(h => h.selected).filter(s => s);
      return this.fields.filter(f => !selected.includes(f));
    },
    internalDraftRules () {
      return { ...draftRules(), organisation: { required: true } };
    },
    internalPublishRules () {
      return publishRules();
    },
    validationRules () {
      const rules = this.isDraftOrPublish === 'draft' ? this.internalDraftRules : this.internalPublishRules;
      return {
        ...rules,
        team: undefined,
        country: undefined,
        donors: undefined
      };
    },
    dialogVisible: {
      get () {
        return !!this.dialogData;
      },
      set () {
        this.updateValue(this.dialogData.row, this.dialogData.key, this.dialogData.value);
        this.dialogData = null;
      }
    },
    globalErrors () {
      const result = [];
      const draftRequireds = [];
      for (const key in this.validationRules) {
        if (this.validationRules[key] && this.validationRules[key].required) {
          draftRequireds.push(key);
        }
      }
      draftRequireds.forEach(dr => {
        if (!this.headers.some(h => h.selected === dr)) {
          result.push(`Please select ${dr} column`);
        }
      });
      return result;
    }
  },
  watch: {
    additonalHeader: {
      immediate: false,
      handler (column) {
        if (column) {
          this.headers.push({ selected: column, title: column });
          this.additonalHeader = null;
          this.columnChange();
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$nuxt.$loading.start('xlsx');
      this.loadXlsxLib();
    });
  },
  methods: {
    ...mapActions({
      updateQueueItem: 'admin/import/updateQueueItem',
      addDataToQueue: 'admin/import/addDataToQueue'
    }),
    scrollToError (valid, index) {
      if (!valid) {
        const elm = this.$el.querySelector(`.Row_${index} .ValidationError`);
        elm.scrollIntoView();
      }
    },
    async loadXlsxLib () {
      this._xlsx = await import('xlsx');
      this.ready = true;
      this.$nuxt.$loading.finish('xlsx');
    },
    processFile (fileList) {
      if (fileList && fileList.length > 0) {
        this.$nuxt.$loading.start('xlsx_load');
        const reader = new FileReader();
        reader.onload = e => {
          let binary = '';
          const bytes = new Uint8Array(e.target.result);
          const length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          this._workbook = this._xlsx.read(binary, { type: 'binary' });
          this.sheets = this._workbook.SheetNames;
          this.$nuxt.$loading.finish('xlsx_load');
        };
        reader.onerror = e => {
          console.log(e);
        };
        reader.readAsArrayBuffer(fileList[0].raw);
        this.fileName = fileList[0].name;
      }
    },
    updateValue (row, key, value) {
      Vue.set(this.imported[row].data, key, value);
      this.saveUpdatedValue(this.imported[row]);
    },
    saveUpdatedValue: debounce(function (row) {
      this.patchRow(row);
    }, 1000),
    async patchRow (row) {
      return this.$axios.patch(`/api/projects/import-row/${row.id}/`, { ...row, id: undefined });
    },
    openDialogHandler (row, key, { column, value }) {
      const stringified = JSON.stringify(value);
      this.dialogData = {
        row,
        key,
        column,
        value: value ? JSON.parse(stringified) : null,
        original: this.original[row].data[key]
      };
    },
    columnChange () {
      this.updateQueueItem({ id: this.currentQueueItem.id, header_mapping: this.headers });
    },
    prepareHeaders (row) {
      this.headers = Object.keys(row).map(title => ({ selected: null, title }));
    },
    async saveAndProcessSheet (sheetName) {
      this.$nuxt.$loading.start('save_sheet');
      const sheet = this._xlsx.utils.sheet_to_json(this._workbook.Sheets[sheetName], { defval: '' });
      this.prepareHeaders(sheet[0]);
      const importData =
        {
          'filename': this.fileName,
          'country': this.country,
          'donor': this.donors[0],
          'sheet_name': sheetName,
          'header_mapping': this.headers,
          'draft': this.isDraftOrPublish === 'draft',
          'rows': [
            {
              'data': sheet
            }
          ]
        };
      await this.addDataToQueue(importData);
      this.workOnThis(this.queue[this.queue.length - 1]);
      this.$nuxt.$loading.finish('save_sheet');
    },
    async saveAll () {
      const valid = this.$refs.row.filter(r => r.valid).slice(0, 1);
      for (const p of valid) {
        const newRow = await this.save(p);
        await this.patchRow(newRow);
      }
    },
    async save (row) {
      this.$nuxt.$loading.start('save');
      const filled = row.$children.filter(sc => sc.column);
      const result = filled.reduce((a, c) => {
        a[c.column] = c.apiValue();
        return a;
      }, projectFields());
      result.team = [this.userProfile.id];
      result.country = this.country;
      result.donors = this.donors;
      const parsed = apiWriteParser(result);
      const { data } = await this.$axios.post(`api/projects/draft/${this.country}/`, parsed);
      const dataRow = row.row;
      dataRow.project = data.id;
      this.$set(this.imported, row.index, dataRow);
      this.$nuxt.$loading.finish('save');
      return dataRow;
    },
    workOnThis (item) {
      this.$nuxt.$loading.start('select');
      window.setTimeout(() => {
        this.currentQueueItem = { ...item };
        const rowString = JSON.stringify(item.rows.slice(0, 10));
        this.imported = JSON.parse(rowString);
        this.original = JSON.parse(rowString);
        this.country = item.country;
        this.donors = [item.donor];
        this.isDraftOrPublish = item.draft ? 'draft' : 'publish';
        this.headers = cloneDeep(item.header_mapping);
        this.introDone = true;
        this.$nuxt.$loading.finish('select');
      }, 300);
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.ImportPrototype {
  min-width: @appWidthMinLimit;
  min-height: calc(100vh - @topBarHeightSubpage - @actionBarHeight - @appFooterHeight);
  padding: 40px 40px;
  box-sizing: border-box;
  overflow: auto;

  .Label {
    display: block;
    margin: 0 0 15px;
    color: @colorTextPrimary;
    font-size: @fontSizeBase;
    font-weight: 700;
  }

  .CountrySelector {
    width: 100%;
  }

  .DraftOrPublished {
    .el-radio {
      line-height: 40px;
    }
  }

  .ConfirmSettings {
    align-self: flex-end;
    text-align: right;
    min-width: 120px;
  }

  .XlsUpload {
    width: 50%;
    margin-top: 20px;

    .el-upload {
      float: none;
    }

    .el-upload-list {
      margin-bottom: 20px;
    }
  }

  // Fake data table

  .GlobalErrors {
    padding: 40px 0 20px;

    .el-tag {
      margin-right: 10px;

      .svg-inline--fa {
        margin-right: 3px;
      }
    }
  }

  .ExportDataTable {
    width: 100%;
    margin: 0;
    overflow-x: auto;
    background-color: #F5F5F5;
    font-size: @fontSizeSmall;
    line-height: 16px;
    box-shadow: inset 0 0 5px 1px rgba(0,0,0,.12);

    .Container {
      display: flex;
      flex-flow: column wrap;

      .Row {
        flex: 1 100%;
        display: flex;
        flex-direction: row;

        &:last-child {
            border-right: 0;

          .Column {
            border-bottom: 0;
          }
        }
      }

      .Column {
        flex: 0 0 200px;
        max-height: 200px;
        padding: 10px;
        border: solid @colorGrayLight;
        border-width: 0 1px 1px 0;
        overflow-y: auto;

        &.Header {
          padding-bottom: 0;
        }

        &.Wide {
          flex: 1 0 100%;
        }

        &.Thin {
          flex: 0 0 50px;
        }

        &.Fluid {
          flex: 1;
        }

        &.Error {
          background-color: @colorDanger;
          color: @colorWhite;
          font-weight: 700;
        }

        .Title {
          margin-bottom: 10px;
          font-weight: 700;
        }
      }

      .SaveButton {
        margin-left: 6px;
      }
    }
  }
}
</style>
