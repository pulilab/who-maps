<template>
  <el-form
    ref="importForm"
    :model="importForm"
    label-width="120px"
    label-position="top"
    class="ImportFile"
  >
    <div class="Info">
      <p class="strong">
        <translate>
          The Import Interface allows you to import your Projects from an Excel file into the Digital Health Atlas.
        </translate>
      </p>
      <p>
        <translate>
          When importing your projects you can use this file as a reference for the format of the data:
        </translate>
        <xlsx-workbook class="inline">
          <xlsx-sheet
            v-for="sheet in templateSheets"
            :key="sheet.name"
            :collection="sheet.data"
            :sheet-name="sheet.name"
          />
          <xlsx-download filename="DHA_Import_template.xlsx">
            <span class="XLSXTemplate">
              <translate>Download Reference File</translate>
            </span>
          </xlsx-download>
        </xlsx-workbook>
      </p>
      <warning class="red">
        <translate>
          Your data should be organized to have data from only one country included in a spreadsheet. In addition, you can also only select one Investor for all of the data from within your spreadsheet. If you have more than one investor, we recommend that you go back to your projects once uploaded and add the correct investors.
        </translate>
      </warning>
      <warning class="red">
        <translate>
          For now the imported projects are loaded in draft and need to be manually published.
        </translate>
      </warning>
    </div>
    <el-divider class="wide" />
    <el-form-item>
      <template #label>
        <translate>Select file</translate>
      </template>
      <el-upload
        ref="importFile"
        :auto-upload="false"
        :limit="1"
        :on-change="onSelectFile"
        :before-remove="onResetFile"
        action="doing it manually, so this prop isnt used, still needed"
      >
        <el-button v-if="!inputFile" type="text">
          <fa icon="plus" /> <translate>Upload file</translate>
        </el-button>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <template #label>
        <translate>
          Select Sheet
        </translate>
      </template>
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
                  placeholder="Select sheet"
                  :disabled="!inputFile || !sheets || sheets.length === 0"
                  @change="onSelectSheet"
                >
                  <el-option
                    v-for="sheet in sheets"
                    :key="sheet"
                    :value="sheet"
                  >
                    {{ sheet }}
                  </el-option>
                </el-select>
                <alert v-if="!uniqueImport" type="warning">
                  <translate key="warning">
                    Note that all import files need to have a unique name. Please re-name the file and upload it again.
                  </translate>
                </alert>
              </div>
            </template>
          </xlsx-sheets>
          <xlsx-json
            :sheet="selectedSheet"
            :options="{defval: ''}"
            @parsed="parsed = $event"
          />
        </template>
      </xlsx-read>
    </el-form-item>
    <!-- <el-form-item prop="country">
      <template #label>
        <form-hint>
          <translate>
            Select Country
          </translate>
          <template #hint>
            <translate>Data can only be added one country at a time. If your data is from more than one country, you can make a separate sheet for each country.</translate>
          </template>
        </form-hint>
      </template>
      <el-radio-group v-model="countryRadio" class="RadioGroup">
        <el-radio :label="1">Import projects from multiple countries (default)</el-radio>
        <el-radio :label="2">Import to single country</el-radio>
      </el-radio-group>
      <input-group v-if="countryRadio === 2">
        <country-select v-model="importForm.country" />
      </input-group>
    </el-form-item>
    <el-form-item prop="donor">
      <template #label>
        <form-hint>
          <translate>
            Select Investor
          </translate>
          <template #hint>
            <translate>
              Data can only be uploaded for one investor at a time. You can update each project once they are saved in your My Projects page before publication.
            </translate>
          </template>
        </form-hint>
      </template>
      <el-radio-group v-model="donorRadio" class="RadioGroup">
        <el-radio :label="1">Import projects from multiple investors (default)</el-radio>
        <el-radio :label="2">Import to single investor</el-radio>
      </el-radio-group>
      <input-group v-if="donorRadio === 2">
        <donor-select v-model="importForm.donor" />
      </input-group>
    </el-form-item> -->
    <el-form-item prop="newCollection" class="flex-col">
      <template #label>
        <form-hint>
          <translate>Collections</translate>
          <template #hint>
            <translate>
              Explanation of what collection is and why is that good. Or good practices to use this feature. Or restrictions. Or.. something something..
            </translate>
          </template>
        </form-hint>
      </template>
      <el-checkbox v-model="importToCollection" class="Check">
        <translate>
          Group projects in a collection
        </translate>
      </el-checkbox>
      <input-group v-if="importToCollection">
        <el-radio-group v-model="toCollection" class="RadioGroup">
          <el-radio :label="1">Create a new collection</el-radio>
          <el-input
            v-if="toCollection === 1"
            v-model="importForm.newCollection"
            type="text"
            :placeholder="$gettext('type the name of the new collection')"
            class="Input"
          />
          <el-radio :label="2">
            <translate>Add to existing collection retrospectively</translate>
          </el-radio>
          <collection-select v-if="toCollection === 2" v-model="importForm.collectionUrl" class="Select" />
        </el-radio-group>
      </input-group>
      <el-checkbox :disabled="!importToCollection" v-model="importForm.projectEditor" class="Check">
        <translate>Add me as project editor to all imported projects</translate>
      </el-checkbox>
    </el-form-item>
    <el-divider class="wide" />
    <el-form-item v-if="alert > 0">
      <alert v-show="alert === 1" type="success">
        <translate key="success">File has been successfully imported.</translate>
      </alert>
      <alert v-show="alert === 2" type="error">
        <translate key="error">There was an error while importing the file! Maybe try again.</translate>
      </alert>
    </el-form-item>
    <el-button type="warning" @click="save" :loading="importing" :disabled="!canImport">
      <translate>Import now</translate>
    </el-button>
  </el-form>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import InputGroup from '@/components/common/wrappers/InputGroup'
// import DonorSelect from '@/components/common/DonorSelect'
import CollectionSelect from '@/components/common/CollectionSelect'
// import CountrySelect from '@/components/common/CountrySelect'
import FormHint from '@/components/common/FormHint'
import Warning from '@/components/common/Warning'
import Alert from '@/components/common/Alert'
import { XlsxRead, XlsxSheets, XlsxJson, XlsxWorkbook, XlsxSheet, XlsxDownload } from 'vue-xlsx'
import { importTemplate, nameMapping } from '@/utilities/import'
import { draftRules } from '@/utilities/projects'

export default {
  components: {
    InputGroup,
    // DonorSelect,
    CollectionSelect,
    // CountrySelect,
    XlsxRead,
    XlsxSheets,
    XlsxJson,
    FormHint,
    Warning,
    Alert,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload
  },
  data () {
    return {
      country: this.$store.state.user.profile.country,
      isDraftOrPublish: 'draft',
      inputFile: null,
      selectedSheet: null,
      parsed: null,
      importForm: {
        country: null,
        donor: null,
        projectEditor: true,
        collectionUrl: null,
        newCollection: ''
      },
      uniqueImport: true,
      countryRadio: 1,
      donorRadio: 1,
      importToCollection: false,
      toCollection: 1,
      alert: 0,
      importing: false // 0: n/a; 1: success; 2: error
    }
  },
  computed: {
    ...mapState('system', {
      systemDicts: state => state
    }),
    ...mapState('projects', {
      projectDicts: state => state.projectStructure
    }),
    ...mapGetters({
      userCollections: 'system/getUserCollections'
    }),
    fieldsData () {
      const flatHFA = this.projectDicts.health_focus_areas.reduce((a, c) => {
        const innerNames = c.health_focus_areas.map(i => i.name)
        return a.concat(innerNames)
      }, [])
      const flatHSC = this.projectDicts.hsc_challenges.reduce((a, c) => {
        const innerNames = c.challenges.map(i => i.challenge)
        return a.concat(innerNames)
      }, [])
      const flatsHIS = this.projectDicts.his_bucket.reduce((a, c) => {
        a.push(c.name)
        return a
      }, [])
      const flatLicenses = this.projectDicts.licenses.map(l => l.name)
      const flatSoftware = this.projectDicts.technology_platforms.map(p => p.name)
      const flathDHI = this.projectDicts.strategies.reduce((a, c) => {
        const innerValue = c.subGroups.reduce((innerA, innerC) => {
          return innerA.concat(innerC.strategies.map(s => s.name))
        }, [])
        return a.concat(innerValue)
      }, [])
      const flatOrganisations = this.systemDicts.organisations.map(o => o.name)
      const flatCountries = this.systemDicts.countries.map(c => c.name)
      const flatInvestors = this.systemDicts.donors.map(d => d.name)
      return [
        [nameMapping.health_focus_areas, ...flatHFA],
        [nameMapping.hsc_challenges, ...flatHSC],
        [nameMapping.his_bucket, ...flatsHIS],
        [nameMapping.licenses, ...flatLicenses],
        [nameMapping.software, ...flatSoftware],
        [nameMapping.digitalHealthInterventions, ...flathDHI],
        [nameMapping.organisation, ...flatOrganisations],
        [nameMapping.country, ...flatCountries],
        [nameMapping.donors, ...flatInvestors]
      ]
    },
    draftRequiredFields () {
      const rules = draftRules()
      const requireds = []
      for (const rule in rules) {
        if (rules[rule].required) {
          requireds.push([nameMapping[rule]])
        }
      }
      return requireds
    },
    templateSheets () {
      return [
        { name: 'Import Example', data: importTemplate },
        { name: 'Fields', data: this.fieldsData },
        { name: 'Draft required fields', data: this.draftRequiredFields }
      ]
    },
    canImport () {
      return this.inputFile && this.selectedSheet && this.uniqueImport
    }
  },
  watch: {
    importToCollection: function (val) {
      this.importForm.projectEditor = !val
    }
  },
  methods: {
    ...mapActions({
      loadUserCollections: 'system/loadUserCollections',
      addDataToQueue: 'admin/import/addDataToQueue',
      addDataToCollection: 'admin/import/addCollection',
      updateDataToCollection: 'admin/import/updateCollection',
      loadQueue: 'admin/import/loadQueue',
      checkAvailability: 'admin/import/checkAvailability'
    }),
    resetForm () {
      this.$refs.importFile.clearFiles()
      this.inputFile = null
      this.selectedSheet = null
      this.countryRadio = 1
      this.donorRadio = 1
      this.importToCollection = false
      this.toCollection = 1
      this.$refs.importForm.resetFields()
    },
    // onChange (event) {
    //   this.inputFile = event.target.files ? event.target.files[0] : null
    // },
    onSelectFile (file) {
      this.inputFile = file?.raw
    },
    onResetFile () {
      this.inputFile = null
      this.selectedSheet = null
      this.uniqueImport = true
    },
    async onSelectSheet () {
      try {
        const toCheck = {
          filename: this.inputFile.name,
          sheet_name: this.selectedSheet
        }
        const checkAvailability = await this.checkAvailability(toCheck)
        this.uniqueImport = checkAvailability.available
      } catch (error) {
        this.uniqueImport = false
        console.error('availabilityResult', error)
      }
    },
    /* may be needed if single country is back on the table
    parseCountry () {
      const country = 'Argentina'
      const rows = this.parsed.map((row) => {
        return {
          ...row,
          Country: country
        }
      })
    }, */
    async save () {
      let endpoint = 0 // legacy 'import > create'
      const importData = {
        project_import: {
          filename: this.inputFile.name,
          sheet_name: this.selectedSheet,
          header_mapping: Object.keys(this.parsed[0]).map(title => ({ selected: null, title })),
          draft: this.isDraftOrPublish === 'draft',
          rows: [
            {
              data: this.parsed
            }
          ]
        }
      }
      /*
        May be removed after the Stub projects released and aproved

        if (this.countryRadio === 2 && this.importForm.country) {
        importData.project_import.country = this.importForm.country
      }
      if (this.donorRadio === 2 && this.importForm.donor) {
        importData.project_import.donor = this.importForm.donor
      }
      */

      if (this.importToCollection) {
        importData.add_me_as_editor = this.importForm.projectEditor
        if (this.toCollection === 1) {
          importData.name = this.importForm.newCollection
          endpoint = 1 // new collection 'collections > create'
        } else {
          endpoint = 2 // update collection 'collections > partial_update'
        }
      }

      try {
        this.alert = 0
        this.importing = true
        switch (endpoint) {
        case 0:
          await this.addDataToQueue(importData.project_import)
          break
        case 1:
          await this.addDataToCollection(importData)
          this.loadUserCollections()
          break
        case 2:
          await this.updateDataToCollection({
            importData: importData,
            url: this.importForm.collectionUrl
          })
          break
        }
        this.$nuxt.$loading.finish('importXLSX')
        this.alert = 1
        this.importing = false
        this.resetForm()
        this.loadQueue()
      } catch (err) {
        this.alert = 2
        this.importing = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";

.ImportFile {
  .SheetSelector, .DonorSelector, .CountrySelector{
    width: 100%;
    margin: 5px 0;
  }
  .el-form-item {
    height: auto;
    margin-bottom: 25px;
  }
  ::v-deep .flex-col .el-form-item__content {
    display: flex;
    flex-direction: column;
  }

  ::v-deep .el-form-item__label {
    padding: initial;
    line-height: normal;
    margin-bottom: 12px;
  }

  .red {
    span {
      color: red;
    }
  }

  .wide {
    position: relative;
    left: -40px;
    right: -40px;
    width: calc(100% + 80px);
    background-color: #E0E0E0;
    margin: 40px 0;
  }

  p {
    font-size: @fontSizeBase;
    line-height: 21px;
  }

  .XLSXTemplate{
    color: @colorBrandPrimary;
    text-decoration: underline;
    cursor: pointer;
  }

  .strong {
    font-weight: bold;
    color: @colorTextSecondary;
  }

  .inline {
    display: inline;
  }

  .Check {
    height: 42px;
    line-height: 42px;
    ::v-deep .el-checkbox__inner {
      width: 20px;
      height: 20px;
    }
    ::v-deep .el-checkbox__inner::after {
      width: 4px;
      height: 11px;
      margin-left: 2px;
    }
  }

  .Input,
  .Select {
    margin: 10px 0;
  }

  .RadioGroup {
    display: flex;
    flex-direction: column;

    .el-radio {
      padding: 10px 0;
    }

    ::v-deep .el-radio__inner {
      width: 20px;
      height: 20px;
    }
    ::v-deep .el-radio__inner::after {
      width: 8px;
      height: 8px;
    }
  }

  .el-button--warning {
    background-color: @colorBrandRedNew;
  }
  .el-button--warning:hover {
    background-color: #d86422b3;
  }

 .el-button--warning.is-disabled,
 .el-button--warning.is-disabled:focus,
 .el-button--warning.is-disabled:hover {
    color: #B9B9B9;
    background-color: #E9E9E9;
    cursor: not-allowed;
    background-image: none;
    border-color: #EBEEF5
  }
}
</style>
