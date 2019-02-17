<template>
  <div class="ImportPrototype">
    <template v-if="ready">
      <el-dialog
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        title="Select"
        width="50%"
      >
        <donor-selector
          v-if="dialogData.column === 'donors'"
          v-model="dialogData.value"
        />
        <organisation-select
          v-if="dialogData.column === 'organisation'"
          v-model="dialogData.value[0]"
        />
      </el-dialog>

      <el-card class="box-card">
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
              />
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
                    @change="columnChange(header)"
                  >
                    <el-option
                      v-for="item in fields"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </div>
              </div>
            </div>

            <div
              v-for="(row, index) in imported"
              :key="index"
              class="Row"
            >
              <div class="Column Thin">
                <el-button
                  :disabled="globalErrors.length > 0 || !!row.id"
                  icon="el-icon-check"
                  type="primary"
                  circle
                  class="SaveButton"
                  @click="save(`row_${index}`, row, index)"
                />
                <a
                  v-if="row.id"
                  :href="localePath({name: 'organisation-projects-id-edit', params: {id: row.id, organisation: $route.params.organisation}})"
                  target="_blank"
                  class="NuxtLink IconLeft"
                >
                  <fa icon="share-square" />
                </a>
                </el-button>
              </div>
              <template
                v-for="(col, key) in row"
              >
                <SmartCell
                  v-if="col !== 'id'"
                  :ref="`row_${index}`"
                  :key="index + key"
                  :disabled="!!row.id"
                  :value="col"
                  :column="columnFinder(key)"
                  class="Column"
                  @change="updateValue(index, key, $event)"
                  @openDialog="openDialogHandler(index, key, $event)"
                />
              </template>
            </div>
          </div>
        </div>
        <!-- / Data table -->
      </el-card>
    </template>
  </div>
</template>

<script>
import FileUpload from '@/components/common/FileUpload';
import SmartCell from '@/components/admin/import/SmartCell';
import DonorSelector from '@/components/project/DonorSelector';
import OrganisationSelect from '@/components/common/OrganisationSelect';
import CountrySelect from '@/components/common/CountrySelect';
import { projectFields } from '@/utilities/projects';
import { apiWriteParser } from '@/utilities/api';
import { mapGetters } from 'vuex';

export default {

  components: {
    FileUpload,
    SmartCell,
    DonorSelector,
    OrganisationSelect,
    CountrySelect
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
      headers: [],
      sheets: [],
      fields: Object.keys(projectFields()),
      dialogData: null
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile'
    }),
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
      const draftRequireds = ['name', 'country', 'organisation'];
      draftRequireds.forEach(dr => {
        if (!this.headers.some(h => h.selected === dr)) {
          result.push(`Please select ${dr} column`);
        }
      });
      return result;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$nuxt.$loading.start('xlsx');
      this.loadXlsxLib();
    });
  },
  methods: {
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
      this.imported[row][key] = value;
    },
    openDialogHandler (row, key, { column, value }) {
      this.dialogData = {
        row,
        key,
        column,
        value: value ? JSON.parse(JSON.stringify(value)) : null
      };
    },
    columnChange (header) {
      if (header.selected === 'country') {
        this.imported.forEach(row => {
          row[header.title] = this.country;
        });
      }
      if (header.selected === 'donors') {
        this.imported.forEach(row => {
          row[header.title] = this.donors;
        });
      }
    },
    columnFinder (title) {
      const header = this.headers.find(h => h.title === title);
      return header ? header.selected : null;
    },
    prepareHeaders (row) {
      this.headers = Object.keys(row).map(title => ({ selected: null, title }));
    },
    async saveAndProcessSheet (sheetName) {
      this.$nuxt.$loading.start('save_sheet');
      const sheet = this._xlsx.utils.sheet_to_json(this._workbook.Sheets[sheetName], { defval: '' }).slice(0, 20);
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
      const { data } = await this.$axios.post(`api/projects/import/`, importData);
      this.imported = data.rows;
      this.$nuxt.$loading.finish('save_sheet');
    },
    async save (row, dataRow, index) {
      this.$nuxt.$loading.start('save');
      const filled = this.$refs[row].filter(sc => sc.column);
      const result = filled.reduce((a, c) => {
        a[c.column] = c.apiValue();
        return a;
      }, projectFields());
      result.team = [this.userProfile.id];
      const parsed = apiWriteParser(result);
      const { data } = await this.$axios.post(`api/projects/draft/${this.country}/`, parsed);
      dataRow.id = data.id;
      this.$set(this.imported, index, dataRow);
      this.$nuxt.$loading.finish('save');
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
