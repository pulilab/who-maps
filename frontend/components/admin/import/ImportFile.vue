<template>
  <el-form
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
      <warning>
        <translate>
          Your data should be organized to have data from only one country included in a spreadsheet. In addition, you can also only select one Investor for all of the data from within your spreadsheet. If you have more than one investor, we recommend that you go back to your projects once uploaded and add the correct investors.
        </translate>
      </warning>
      <warning>
        <translate>
          For now the imported projects are loaded in draft and need to be manually published.
        </translate>
      </warning>
    </div>
    <el-divider class="wide" />
    <el-form-item>
      <alert type="success">Sikerult jol megcsinalni</alert>
      <alert type="error">There was an error while importing the file! <a href="">Please try again.</a></alert>
    </el-form-item>
    <el-form-item>
      <template #label>
        <translate>Select file</translate>
      </template>
      <el-upload
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
            :options="{defval: ''}"
            @parsed="parsed = $event"
          />
        </template>
      </xlsx-read>
    </el-form-item>
    <el-form-item>
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
        <country-select v-model="country" />
      </input-group>
    </el-form-item>
    <el-form-item>
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
        <donor-select v-model="donor" />
      </input-group>
    </el-form-item>
    <el-form-item>
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
      <el-checkbox v-model="importMultiple" class="Check">
        <translate>
          Group projects in a collection
        </translate>
      </el-checkbox>

      <input-group v-if="importMultiple">
        <el-radio-group v-model="toCollection" class="RadioGroup">
          <el-radio :label="1">Create a new collection</el-radio>
          <el-input v-if="toCollection === 1" v-model="newCollection" type="text" placeholder="type the name of the new collection" class="Input" />
          <el-radio :label="2">Add to existing collection retrospectively</el-radio>
          <donor-select v-if="toCollection === 2" v-model="donor" class="Select" />
        </el-radio-group>
        <el-checkbox v-model="projectEditor" class="Check">
          <translate>Add me as project editor to all imported projects</translate>
        </el-checkbox>
      </input-group>
    </el-form-item>
    <el-form-item v-if="false" class="DraftOrPublished">
      <template #label>
        <translate>
          Draft or Publish
        </translate>
      </template>
      <el-radio-group v-model="isDraftOrPublish">
        <el-radio label="draft">
          <translate>
            Draft
          </translate>
        </el-radio>
        <el-radio label="publish">
          <translate>
            Publish
          </translate>
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-divider class="wide" />
    <el-button @click="save" type="warning">
      <translate>Import now</translate>
    </el-button>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import InputGroup from '@/components/common/wrappers/InputGroup'
import DonorSelect from '@/components/common/DonorSelect'
import CountrySelect from '@/components/common/CountrySelect'
import FormHint from '@/components/common/FormHint'
import Warning from '@/components/common/Warning'
import Alert from '@/components/common/Alert'
import { XlsxRead, XlsxSheets, XlsxJson, XlsxWorkbook, XlsxSheet, XlsxDownload } from 'vue-xlsx'
import { importTemplate, nameMapping } from '@/utilities/import'
import { draftRules } from '@/utilities/projects'

export default {
  components: {
    InputGroup,
    DonorSelect,
    CountrySelect,
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
      donor: null,
      isDraftOrPublish: 'draft',
      inputFile: null,
      selectedSheet: null,
      parsed: null,
      countryRadio: 1,
      donorRadio: 1,
      importMultiple: false,
      projectEditor: false,
      toCollection: 1,
      newCollection: ''
    }
  },
  computed: {
    ...mapState('system', {
      systemDicts: state => state
    }),
    ...mapState('projects', {
      projectDicts: state => state.projectStructure
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
      const flatPlatforms = this.projectDicts.technology_platforms.map(p => p.name)
      const flathDHI = this.projectDicts.strategies.reduce((a, c) => {
        const innerValue = c.subGroups.reduce((innerA, innerC) => {
          return innerA.concat(innerC.strategies.map(s => s.name))
        }, [])
        return a.concat(innerValue)
      }, [])
      const flatOrganisations = this.systemDicts.organisations.map(o => o.name)
      return [
        [nameMapping.health_focus_areas, ...flatHFA],
        [nameMapping.hsc_challenges, ...flatHSC],
        [nameMapping.his_bucket, ...flatsHIS],
        [nameMapping.licenses, ...flatLicenses],
        [nameMapping.platforms, ...flatPlatforms],
        [nameMapping.digitalHealthInterventions, ...flathDHI],
        [nameMapping.organisation, ...flatOrganisations]
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
    }
  },
  methods: {
    ...mapActions({
      addDataToQueue: 'admin/import/addDataToQueue'
    }),
    onChange (event) {
      this.inputFile = event.target.files ? event.target.files[0] : null
      console.log('🚀 ~ onChange ~ this.inputFile', this.inputFile)
    },
    onSelectFile (file) {
      console.log('🚀 ~ onSelectFile', file)
      this.inputFile = file?.raw ? file?.raw : null
    },
    onResetFile () {
      this.inputFile = null
    },
    async save () {
      this.$nuxt.$loading.start('importXLSX')
      const importData = {
        filename: this.inputFile.name,
        country: this.country,
        donor: this.donor,
        sheet_name: this.selectedSheet,
        header_mapping: Object.keys(this.parsed[0]).map(title => ({ selected: null, title })),
        draft: this.isDraftOrPublish === 'draft',
        rows: [
          {
            data: this.parsed
          }
        ]
      }
      try {
        const importItem = await this.addDataToQueue(importData)
        this.$nuxt.$loading.finish('importXLSX')
        this.$router.push(this.localePath({ name: 'organisation-admin-import-id', params: { ...this.$route.params, id: importItem.id }, query: undefined }))
      } catch {
        this.$nuxt.$loading.finish('importXLSX')
        await this.$alert(
          this.$gettext('Note that all import files need to have a unique name. Please re-name the file and upload it again.'),
          this.$gettext('Error'),
          {
            confirmButtonText: 'OK',
            type: 'warning'
          })
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

::v-deep .el-form-item__label {
    padding: initial;
    line-height: normal;
    margin-bottom: 12px;
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
}
</style>
