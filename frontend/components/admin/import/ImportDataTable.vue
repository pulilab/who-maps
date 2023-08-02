<template>
  <div class="AdminImportPage">
    <ImportDialog
      ref="dialog"
      :custom-fields-lib="customFieldsLib"
      :imported="rows"
      :sub-levels="subLevels"
      @update="updateValue"
    />

    <div class="ProjectToolbar">
      <span class="label">
        <translate :parameters="{ rows: rawImport.rows.length }">
          List of projects ({rows})
        </translate>
      </span>
      <el-switch v-model="showFirstRows" :active-text="activeFirstRowsText" />
      <el-switch v-model="showImportedRows" :active-text="activeHiddenRowsText" />
      <!-- <div class="search">
        <el-input v-model="search" clearable debounce prefix-icon="el-icon-search" placeholder="search" />
      </div> -->
    </div>
    <ImportValidation :headers="rawImport.header_mapping" :publish="!rawImport.draft">
      <template #default="{globalErrors, rules, nameMapping}">
        <div class="ExportDataTable">
          <div class="Container">
            <ImportHeaders
              :id="rawImport.id"
              :headers.sync="rawImport.header_mapping"
              :custom-fields-lib="customFieldsLib"
              :name-mapping="nameMapping"
            >
              <template #default="{ columns }">
                <el-button v-if="!allImported" type="primary" size="mini" @click="saveAll">
                  <translate>
                    Save all projects
                  </translate>
                </el-button>
                <div v-if="columns.selected === columns.count" class="ColumnState all">
                  <translate>All columns are selected</translate>
                </div>
                <div v-else class="ColumnState">
                  {{ columns.selected }} of {{ columns.count }} columns selected
                </div>
              </template>
            </ImportHeaders>
            <div class="Rows" :class="{'fullscreen': fullscreen}">
              <ImportRow
                v-for="(row, index) in rows"
                :key="row.id"
                ref="row"
                :row="row"
                :custom-fields-lib="customFieldsLib"
                class="Row"
              >
                <template
                  #default="{errors, valid, handleValidation, data, original, rowSave, scrollToError}"
                >
                  <div class="Column Thin">
                    <div v-if="!row.project" class="ButtonList">
                      <button
                        :disabled="globalErrors.length > 0 || !valid"
                        type="text"
                        size="mini"
                        class="SaveButton"
                        @click="singleRowSave(rowSave, valid, scrollToError, row)"
                      >
                        Save
                      </button>
                      <button
                        type="text"
                        size="mini"
                        class="DeleteButton"
                        @click="deleteRow(row, index)"
                      >
                        Remove
                      </button>
                    </div>
                    <div v-else>
                      <a v-if="row.project" :href="projectLink(row)" target="_blank" class="goto-project">
                        <translate>Go to project</translate>
                      </a>
                    </div>
                  </div>
                  <template v-for="header in rawImport.header_mapping">
                    <SmartCell
                      :key="row.id + header.title"
                      :value="data[header.title]"
                      :original="original[header.title]"
                      :type="header.selected"
                      :rules="rules[header.selected]"
                      class="Column"
                      :errors="errors"
                      :handle-validation="handleValidation"
                      :sub-levels="subLevels"
                      :custom-fields-lib="customFieldsLib"
                      :name-mapping="nameMapping"
                      :disabled="!!row.project"
                      @change="updateValue({row: index, key: header.title, value: $event})"
                      @openDialog="$refs.dialog.openDialog(index, header.title, $event)"
                    />
                  </template>
                  <div class="Column" />
                </template>
              </ImportRow>
            </div>
          </div>
        </div>
      </template>
    </ImportValidation>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapState, mapGetters, mapActions } from 'vuex'
import ImportHeaders from '@/components/admin/import/ImportHeaders'
import ImportValidation from '@/components/admin/import/ImportValidation'
import ImportRow from '@/components/admin/import/ImportRow'
import ImportDialog from '@/components/admin/import/ImportDialog'

export default {
  components: {
    ImportValidation,
    ImportHeaders,
    ImportRow,
    SmartCell: () => import('@/components/admin/import/SmartCell'),
    ImportDialog
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      search: '',
      showImportedRows: false,
      showFirstRows: true,
    }
  },
  computed: {
    ...mapState('system', {
      systemDicts: state => state
    }),
    ...mapGetters({
      getCountryDetails: 'countries/getCountryDetails',
      getDonorDetails: 'system/getDonorDetails',
      rawImport: 'admin/import/getRawImport'
    }),
    allImported () {
      return this.rawImport?.rows.every((row) => {
        return row.project
      })
    },
    selectedCountry () {
      if (this.rawImport) {
        return this.getCountryDetails(this.rawImport.country)
      }
      return {}
    },
    selectedDonor () {
      if (this.rawImport) {
        return this.getDonorDetails(this.rawImport.donor)
      }
      return {}
    },
    countryFieldsLib () {
      if (this.selectedCountry && this.selectedCountry.id !== undefined) {
        return this.selectedCountry.country_questions.reduce((a, c) => {
          a[`MOH Q.: ${c.question}`] = c
          return a
        }, {})
      }
      return {}
    },
    donorFieldsLib () {
      if (this.selectedDonor && this.selectedDonor.id !== undefined) {
        return this.selectedDonor.donor_questions.reduce((a, c) => {
          a[`INV Q.: ${c.question}`] = c
          return a
        }, {})
      }
      return {}
    },
    customFieldsLib () {
      return { ...this.donorFieldsLib, ...this.countryFieldsLib }
    },
    subLevels () {
      const nationalLevel = { id: 'National Level', name: 'National Level' }
      if (this.selectedCountry) {
        return [nationalLevel, ...this.selectedCountry.districts]
      }
      return [nationalLevel]
    },
    rows () {
      return this.showFirstRows
        ? this.showImportedRows
          ? this.rawImport?.rows.slice(0,50)
          : this.rawImport?.rows.filter(r => r.project === null).slice(0,50)
        : this.showImportedRows
          ? this.rawImport?.rows
          : this.rawImport?.rows.filter(r => r.project === null)
    },
    importedRows () {
      return this.rawImport?.rows.filter(r => r.project !== null).length
    },
    activeHiddenRowsText () {
      return this.showImportedRows
        ? this.$gettext('Hide imported rows')
        : this.$gettext('Show imported rows (+{importedRows})', { importedRows: this.importedRows })
    },
    activeFirstRowsText () {
      return this.showFirstRows
        ? this.$gettext('Showing few rows')
        : this.$gettext('Showing all rows')
    }
  },
  methods: {
    ...mapActions({
      refreshProfile: 'user/loadProfile',
      resetImport: 'admin/import/resetImport'
    }),
    projectLink (row) {
      return this.localePath({
        name: 'organisation-projects-id-edit',
        params: {
          id: row.project,
          organisation: this.$route.params.organisation
        }
      })
    },
    updateValue ({ row, key, value }) {
      const originalRow = this.rows[row]
      this.$set(originalRow.data, key, value)
      this.saveUpdatedValue(originalRow)
    },
    saveUpdatedValue: debounce(function (row) {
      this.patchRow(row)
    }, 1000),
    async patchRow (row) {
      return this.$axios.patch(`/api/projects/import-row/${row.id}/`, {
        ...row,
        id: undefined
      })
    },
    async deleteRow (row, index) {
      try {
        await this.$confirm(
          this.$gettext(
            'Note that once this column is deleted, you cannot recover the data.'
          ),
          this.$gettext('Row Delete'),
          {
            confirmButtonText: this.$gettext('OK'),
            cancelButtonText: this.$gettext('Cancel'),
            type: 'warning'
          }
        )
        await this.$axios.delete(`/api/projects/import-row/${row.id}/`)
        this.rawImport.rows.splice(index, 1)
      } catch (e) {
        this.$message({
          type: 'info',
          message: this.$gettext('Delete canceled')
        })
      }
    },
    async singleRowSave (doSave, valid, scrollToError, row) {
      let newRow = null
      if (valid) {
        try {
          await this.$confirm(
            this.$gettext(
              'Note that once you have saved this project, it will be uploaded to the DHA. You can access all of your saved Projects from your My Projects page.'
            ),
            this.$gettext('Save Project'),
            {
              confirmButtonText: this.$gettext('OK'),
              cancelButtonText: this.$gettext('Cancel'),
              type: 'warning'
            }
          )
          this.$nuxt.$loading.start('save')
          newRow = await this.doSingleRowSave(doSave, true, row)
          await this.refreshProfile(false)
          this.$nuxt.$loading.finish('save')
        } catch (e) {
          this.$nuxt.$loading.finish('save')
          this.$message({
            type: 'info',
            message: this.$gettext('Saving Cancelled')
          })
          return
        }
        try {
          await this.$confirm(
            this.$gettext(
              'Your project has been successfully saved as a draft, you can go to your project page or keep working on the import interface'
            ),
            this.$gettext('Success!'),
            {
              confirmButtonText: this.$gettext('Project page'),
              cancelButtonText: this.$gettext('Keep working'),
              type: 'info'
            }
          )
          const id = newRow.project
          this.$router.push(
            this.localePath({
              name: 'organisation-projects-id-edit',
              params: { id, organisation: this.$route.params.organisation }
            })
          )
        } catch (e) {
          console.log('stay')
        }
      } else {
        scrollToError()
      }
    },
    async doSingleRowSave (doSave, nested, row) {
      const countryFieldName = this.rawImport.header_mapping.find((h) => {
        return h.selected === 'country'
      }).title
      const investorField = this.rawImport.header_mapping.find((h) => {
        return h.selected === 'donors'
      })
      const countryData = row.data[countryFieldName]
      const donor = investorField ? row.data[investorField.title] : ''
      try {
        let country = null
        if (Array.isArray(countryData)) {
          country = this.systemDicts.countries.find(c => c.id === countryData[0])
        } else if (typeof countryData === 'string') {
          country = this.systemDicts.countries.find(c => c.name === countryData)
        } else {
          throw new Error('Invalid country value!')
        }
        const newRow = await doSave(
          country.id,
          donor,
          !this.rawImport.draft,
          row.id,
          this.rawImport?.collection?.add_me_as_editor
        )
        await this.patchRow(newRow)
        return newRow
      } catch (e) {
        console.error(e)
        if (e.response && e.response.data) {
          this.$alert(JSON.stringify(e.response.data), 'Error', {
            confirmButtonText: 'OK'
          })
        }
        if (nested) {
          throw e
        }
      }
    },
    async saveAll () {
      try {
        await this.$confirm(
          this.$gettext(
            'Note that once you have saved these projects, they will be uploaded to the DHA. You can access all saved projects from your My Projects page.'
          ),
          this.$gettext('Save all projects'),
          {
            confirmButtonText: this.$gettext('OK'),
            cancelButtonText: this.$gettext('Cancel'),
            type: 'warning'
          }
        )
        this.doSaveAll()
      } catch (e) {
        this.$message({
          type: 'info',
          message: this.$gettext('Saving all projects has been cancelled')
        })
      }
    },
    async doSaveAll () {
      this.$nuxt.$loading.start('saveAll')
      const toSave = this.$refs.row.filter(
        r => r.valid && r.row && !r.row.project
      )
      try {
        for (const p of toSave) {
          await this.doSingleRowSave(p.save, true, p.row)
        }
        await this.refreshProfile()
      } catch (e) {
        console.log(e)
      }
      this.$nuxt.$loading.finish('saveAll')
      try {
        await this.$confirm(
          this.$gettext(
            'Your projects have been successfully saved as a draft, you can go to your project inbox or keep working on the import interface'
          ),
          this.$gettext('Success!'),
          {
            confirmButtonText: this.$gettext('Project inbox'),
            cancelButtonText: this.$gettext('Keep working'),
            type: 'info'
          }
        )
        this.$router.push(
          this.localePath({
            name: 'organisation-projects',
            params: this.$route.params
          })
        )
      } catch (e) {
        console.log('stay')
      }
    },
  },
}
</script>

<style lang="less">
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';

.AdminImportPage {
  box-sizing: border-box;
  overflow: auto;

  .ProjectToolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    height: 36px;
    line-height: 36px;
    margin: 20px 0;
    .label {
      flex: 1;
    }
  }

  .ExportDataTable {
    width: 100%;
    margin: 0;
    background-color: white; // #f5f5f5;
    font-size: @fontSizeSmall;
    // line-height: 16px;
    // box-shadow: inset 0 0 5px 1px rgba(0, 0, 0, 0.12);

    .Container {
      overflow: auto;
      position: relative;
      display: flex;
      flex-flow: column wrap;

      .Rows {
        max-height: 76vh;
        flex-shrink: 0;

        &.fullscreen {
          max-height: calc(100vh - 380px);
        }

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
          .goto-project {
            display: inline-block;
            background-color: transparent;
            color: @colorBrandPrimary;
            border: 1px solid @colorBrandPrimary;
            height: 26px;
            line-height: 26px;
            text-decoration: none;
            padding: 0 24px;
            &:hover {
              color: white;
              background-color: @colorBrandPrimary;
            }
          }
        }
      }

      .Row {
        flex: 1 100%;
        display: flex;
        flex-direction: row;
      }

      .Column {
        box-sizing: border-box;
        flex: 0 0 228px;
        max-height: 200px;
        padding: 10px 12px;
        border: solid @colorGrayLight;
        border-width: 0 1px 1px 0;
        overflow-y: auto;

        &:first-child {
          border-width: 0 1px 1px 1px;
          display: flex;
          align-items: center;
          ::v-deep .el-button {
            padding: 9px 0;
            font-size: @fontSizeExtraSmall;
          }
        }

        &.Thin {
          flex: 0 0 150px;
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

        .ColumnState {
          font-size: @fontSizeVerySmall;
          margin-top: 4px;
          &.all {
            color: @colorDonor;
          }
        }
      }
      .ButtonList {
        display: flex;
        justify-content: space-between;
        width: 100%;

        button {
          font-size: @fontSizeSmall;
          border: none;
          padding: 4px 8px;
          &:disabled {
            color: @colorTextMuted;
            background-color: transparent;
            border: 1px solid @colorTextMuted;
            pointer-events: none;
          }
        }

        .SaveButton {
          background-color: @colorBrandPrimary;
          color: white;
          &:hover {
            background-color: @colorBrandPrimaryLight;
          }
        }
        .DeleteButton {
          background-color: white;
          color: @colorDanger;
          border: 1px solid @colorDanger !important;
          &:hover {
            color: white;
            background-color: @colorDanger;
          }
        }
      }
    }
  }
}
</style>
