<template>
  <div class="AdminImportPage">
    <import-dialog
      ref="dialog"
      :country-fields-lib="countryFieldsLib"
      :imported="rawImport.rows"
      @update="updateValue"
    />
    <el-card class="box-card">
      <import-validation
        :headers="rawImport.header_mapping"
        :publish="!rawImport.draft"
      >
        <template
          v-slot:default="{globalErrors, rules}"
        >
          <div class="ExportDataTable">
            <div class="Container">
              <import-headers
                :id="rawImport.id"
                :headers.sync="rawImport.header_mapping"
                :country-fields-lib="countryFieldsLib"
              >
                <el-button @click="saveAll">
                  <fa icon="save" />
                </el-button>
              </import-headers>

              <import-row
                v-for="(row, index) in rawImport.rows"
                :key="index"
                ref="row"
                :index="index"
                :row="row"
                :class="['Row']"
              >
                <template v-slot:default="{errors, valid, handleValidation, data, original, rowSave}">
                  <div
                    class="Column Thin"
                  >
                    <el-button-group>
                      <el-button
                        :type="globalErrors.length > 0 || !valid ? 'warning' : 'success'"
                        size="mini"
                        class="SaveButton"
                        @click="rowSave()"
                      >
                        <fa icon="save" />
                      </el-button>
                      <el-button
                        size="mini"
                        class="DeleteButton"
                        @click="deleteRow(row, index)"
                      >
                        <fa icon="times" />
                      </el-button>
                      <a
                        v-if="row.project"
                        :href="localePath({name: 'organisation-projects-id-edit', params: {id: row.project, organisation: $route.params.organisation}})"
                        target="_blank"
                        class="NuxtLink IconLeft"
                      >
                        <fa icon="share-square" />
                      </a>
                    </el-button-group>
                  </div>
                  <template
                    v-for="header in rawImport.header_mapping"
                  >
                    <SmartCell
                      :key="index + header.title"
                      :disabled="!!row.project"
                      :value="data[header.title]"
                      :original="original[header.title]"
                      :type="header.selected"
                      :rules="rules[header.selected]"
                      class="Column"
                      :errors="errors"
                      :handle-validation="handleValidation"
                      :sub-levels="subLevels"
                      :custom-fields-lib="countryFieldsLib"
                      @change="updateValue({row: index, key:header.title, value:$event})"
                      @openDialog="$refs.dialog.openDialog(index, header.title, $event)"
                    />
                  </template>
                  <div class="Column" />
                </template>
              </import-row>
            </div>
          </div>
        </template>
      </import-validation>
    </el-card>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapGetters } from 'vuex';
import ImportHeaders from '@/components/admin/import/ImportHeaders';
import ImportValidation from '@/components/admin/import/ImportValidation';
import ImportRow from '@/components/admin/import/ImportRow';
import SmartCell from '@/components/admin/import/SmartCell';
import ImportDialog from '@/components/admin/import/ImportDialog';

export default {
  name: 'ImportDetail',
  components: {
    ImportValidation,
    ImportHeaders,
    ImportRow,
    SmartCell,
    ImportDialog
  },
  computed: {
    ...mapGetters({
      getCountryDetails: 'countries/getCountryDetails'
    }),
    selectedCountry () {
      if (this.rawImport) {
        return this.getCountryDetails(this.rawImport.country);
      }
      return {};
    },
    countryFieldsLib () {
      if (this.selectedCountry) {
        return this.selectedCountry.country_questions.reduce((a, c) => {
          a[`MOH Q.: ${c.question}`] = c;
          return a;
        }, {});
      }
      return [];
    },
    subLevels () {
      if (this.selectedCountry) {
        return [{ id: 'National Level', name: 'National Level' }, ...this.selectedCountry.districts];
      }
      return [];
    }
  },
  async asyncData ({ params, app: { $axios }, store }) {
    const { data } = await $axios.get(`/api/projects/import/${params.id}/`);
    await store.dispatch('countries/loadCountryDetails', data.country);
    return {
      rawImport: data
    };
  },
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadUserProfiles'),
      store.dispatch('system/loadDonors'),
      store.dispatch('projects/loadProjectStructure'),
      store.dispatch('system/loadStaticData'),
      store.dispatch('system/loadOrganisations'),
      store.dispatch('countries/loadMapData')
    ]);
  },
  methods: {
    updateValue ({ row, key, value }) {
      this.$set(this.rawImport.rows[row].data, key, value);
      this.saveUpdatedValue(this.rawImport.rows[row]);
    },
    saveUpdatedValue: debounce(function (row) {
      this.patchRow(row);
    }, 1000),
    async patchRow (row) {
      return this.$axios.patch(`/api/projects/import-row/${row.id}/`, { ...row, id: undefined });
    },
    async deleteRow (row, index) {
      await this.$axios.delete(`/api/projects/import-row/${row.id}/`);
      this.rawImport.rows.splice(index, 1);
    },
    async saveAll () {
      this.$nuxt.$loading.start('saveAll');
      const toSave = this.$refs.row.filter(r => r.valid && r.row && !r.row.project);
      try {
        for (const p of toSave) {
          const newRow = await toSave.save(this.country, this.donor, !this.rawImport.draft);
          await this.patchRow(newRow);
        }
      } catch (e) {
        console.error(e);
        if (e.response && e.response.data) {
          this.$alert(JSON.stringify(e.response.data), 'Error', {
            confirmButtonText: 'OK'
          });
        }
        this.$nuxt.$loading.finish('saveAll');
      }
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.AdminImportPage {
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
          flex: 0 0 75px;
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

      .SaveButton, .DeleteButton {
        margin-left: 6px;
      }
    }
  }
}

</style>
