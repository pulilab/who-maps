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

      <div
        class="Container"
      >
        <div
          class="Row"
        >
          <div class="Column Fluid">
            Select Country
            <country-select
              v-model="country"
              :disabled="introDone"
            />
          </div>
          <div class="Column Fluid">
            Select Investor
            <donor-selector
              v-model="donors"
              :disabled="introDone"
            />
          </div>
          <div class="Column Fluid">
            Select Draft or Publish
            <el-radio
              v-model="isDraftOrPublish"
              :disabled="introDone"
              label="draft"
            >
              Draft
            </el-radio>
            <el-radio
              v-model="isDraftOrPublish"
              :disabled="introDone"
              label="publish"
            >
              Publish
            </el-radio>
          </div>
          <div
            v-if="country && isDraftOrPublish && !introDone"
            class="Column Fluid"
          >
            <el-button @click="introDone = true">
              Confirm
            </el-button>
          </div>
        </div>

        <div
          v-if="introDone"
          class="Row"
        >
          <div class="Column Wide">
            <file-upload
              :files="inputFile"
              @update:files="processFile"
            />
          </div>
        </div>

        <div
          v-if="sheets.length > 0"
          class="Row"
        >
          <div class="Column">
            Select a sheet to import
          </div>
          <div
            v-for="s in sheets"
            :key="s"
            class="Column Fluid"
          >
            <el-button @click="convertSheet(s)">
              {{ s }}
            </el-button>
          </div>
        </div>

        <div
          v-if="imported && imported.length > 0"
          class="Row"
        >
          <div
            v-for="error in globalErrors"
            :key="error"
            class="Column Fuild Error"
          >
            {{ error }}
          </div>
        </div>

        <div
          class="Row"
        >
          <div
            v-for="(header, index) in headers"
            :key="index"
            class="Column"
          >
            <div>{{ header.title }} </div>
            <div>
              <el-select
                v-model="header.selected"
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
          <SmartCell
            v-for="(col, key) in row"
            :key="index + key"
            :value="col"
            :column="columnFinder(key)"
            class="Column"
            @change="updateValue(index, key, $event)"
            @openDialog="openDialogHandler(index, key, $event)"
          />
        </div>
      </div>
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
      ready: false,
      imported: [],
      headers: [],
      sheets: [],
      fields: Object.keys(projectFields()),
      dialogData: null
    };
  },
  computed: {
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
      const draftRequireds = ['name', 'country'];
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
    convertSheet (sheetName) {
      this.$nuxt.$loading.start('xlsx_convert');
      this.imported = this._xlsx.utils.sheet_to_json(this._workbook.Sheets[sheetName], { defval: '' }).slice(0, 2);
      this.prepareHeaders(this.imported[0]);
      this.$nuxt.$loading.finish('xlsx_convert');
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";
.ImportPrototype {
  min-width: @appWidthMinLimit;
  max-width: @appWidthMaxLimit - 10px;
  height: 80vh;
  overflow: auto;

  .Container {
    display: flex;
    flex-flow: column wrap;

    .Row {
      flex: 1 100%;
      display: flex;
      flex-direction: row
    }
    .Column {
      flex: 0 0 200px;
      max-height: 200px;
      padding: 4px;
      border: 1px solid black;
      overflow-y: auto;

      &.Wide {
        flex: 1 0 100%;
      }
      &.Fluid {
        flex: 1;
      }

      &.Error {
        background-color: red;
        color: white;
        font-weight: bold;
      }
    }
  }
}
</style>
