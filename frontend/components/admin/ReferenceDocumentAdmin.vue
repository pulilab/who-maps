<template>
  <PageLayout>
    <template #title>
      <translate :parameters="{ name: country.name }">
        Reference Documents admin for {name}
      </translate>
    </template>
    <Panel v-if="showForm" key="registryForm">
      <template #header>
        <translate>New Reference Document</translate>
      </template>
      <div class="RegistryForm">
        <el-form
          ref="policyForm"
          :model="document"
          :rules="documentRules"
          label-width="220px"
          label-position="left"
          @submit.native.prevent
        >
          <el-form-item :label="$gettext('Document')" name="file" class="with-help" prop="file">
            <file-upload
              :auto-upload="false"
              :files.sync="document.file"
              :limit="1"
              list-type="text"
              @update:files="selectDocumentFile"
            />
            <p class="help">
              <fa icon="info-circle" />
              <translate :parameters="{list: extensionList, size: documentMaxSize}">
                Supported file formats include: {list} The file size is limited to {size}MB.
              </translate>
            </p>
          </el-form-item>
          <el-form-item :label="$gettext('Title')" prop="title">
            <el-input v-model="document.title" :maxlength="128" type="text" />
          </el-form-item>
          <el-form-item :label="$gettext('Purpose')" prop="purpose">
            <el-input
              v-model="document.purpose"
              type="textarea"
              rows="5"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Language')" prop="language">
            <el-select
              v-model="document.language"
              :placeholder="$gettext('Select language')"
              class="LanguageSelectorDropdown"
            >
              <el-option
                v-for="language in referenceDocuments.languages"
                :key="language.id"
                :label="language.name"
                :value="language.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$gettext('Document types')" prop="types">
            <el-select
              v-model="document.types"
              multiple
              :placeholder="$gettext('Select types')"
              class="w-full"
            >
              <el-option
                v-for="type in referenceDocumentTypes"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$gettext('Keywords')">
            <el-select
              v-model="document.tags"
              multiple
              allow-create
              filterable
              default-first-option
              :placeholder="$gettext('Select or create keywords')"
              class="w-full"
            >
              <el-option
                v-for="tag in tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$gettext('Featured')">
            <el-switch
              v-model="document.featured"
              :active-text="$gettext('Featured')"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Valid from')" prop="valid_from">
            <el-date-picker
              v-model="document.valid_from"
              value-format="yyyy-MM-dd"
              :placeholder="$gettext('Pick a date')"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Valid until')">
            <el-date-picker
              v-model="document.valid_until"
              value-format="yyyy-MM-dd"
              :placeholder="$gettext('Pick a date')"
            />
          </el-form-item>
        </el-form>

        <div v-if="submitError" class="error-wrapper">
          <translate tag="h1">
            Could not save the uploaded document. Please correct the following errors and try again:
          </translate>
          <ul class="fields">
            <li v-for="(error,i) in Object.keys(errors)" :key="i">
              <div>
                {{ error }}
              </div>
              <ul class="errors">
                <li v-for="(message,j) in errors[error]" :key="j">
                  {{ message }}
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="AdminActionBarBottom">
          <el-row type="flex" align="middle" justify="space-between">
            <el-button type="text" class="CancelButton IconLeft" @click="discardForm">
              <fa icon="reply" />
              <translate>Dismiss changes</translate>
            </el-button>
            <el-button type="primary" size="medium" @click="saveForm">
              <translate>Save changes</translate>
            </el-button>
          </el-row>
        </div>
      </div>
    </Panel>
    <template v-else>
      <Panel key="registryList">
        <template #header>
          <translate>Reference Documents</translate>
          <el-button class="add-btn" @click="showForm = true">
            <i class="el-icon-upload2" />
            <translate>Upload new Reference Document</translate>
          </el-button>
        </template>
        <ReferenceDocumentList
          :documents="documents"
          @details="showDocumentDetails"
          @edit="editPolicyDocument"
          @delete="confirmDeletePolicyDocument"
        />
      </Panel>
    </template>
  </PageLayout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Panel from '@/components/common/Panel'
import FileUpload from '@/components/common/FileUpload'
import CountryFlag from '@/components/common/CountryFlag'
import ReferenceDocumentList from '@/components/documents/ReferenceDocumentList'

const newDocument = {
  file: [],
  title: '',
  purpose: '',
  language: null,
  types: [],
  tags: [],
  featured: false,
  valid_from: null,
  valid_until: null,
}

export default {
  components: {
    PageLayout,
    Panel,
    FileUpload,
    CountryFlag,
    ReferenceDocumentList,
  },
  data() {
    return {
      loading: false,
      showForm: false,
      editing: false,
      submitError: false,
      errors: [],
      emptyMessage: this.$gettext("There's no Reference Documents uploaded to this country. You can upload new Refernce Document."),
      document: {
        file: [],
        title: '',
        purpose: '',
        language: null,
        types: [],
        tags: [],
        featured: false,
        valid_from: null,
        valid_until: null,
      },
      documentRules: {
        file: [
          { required: true, message: this.$gettext('Please select a file')},
        ],
        title: [
          { required: true, message: this.$gettext('Please input document title')},
        ],
        purpose: [
          { required: true, message: this.$gettext('Please provide document purpose')},
        ],
        language: [
          { required: true, message: this.$gettext('Please select language')},
        ],
        types: [
          { required: true, message: this.$gettext('Please select at least one type')},
        ],
        valid_from: [
          { required: true, message: this.$gettext('Please select the start date of the policy')},
        ],
      }
    }
  },
  computed: {
    ...mapGetters({
      country: 'admin/country/getData',
      countries: 'countries/getCountries',
      tags: 'projects/getReferenceDocumentsTags',
      referenceDocuments: 'system/getReferenceDocuments',
      referenceDocumentTypes: 'projects/getReferenceDocumentsTypes',
      documents: 'documents/getDocuments'
    }),
    user() {
      return this.$auth.user
    },
    isSuperUser () {
      return this.user && this.user.is_superuser
    },
    extensionList () {
      return this.referenceDocuments.valid_formats.join(', ')
    },
    documentMaxSize() {
      return this.referenceDocuments.max_size_in_MB
    },
  },
  mounted() {
    this.loadDocuments({ country: this.country.id })
  },
  watch: {
    showForm(val) {
      if (val && !this.editing) {
        this.documentRules.file = { required: true, message: this.$gettext('Please select a file')}
        this.document = {...newDocument}
      } else if (val && this.editing) {
        this.documentRules.file = null
      }
    }
  },
  methods: {
    ...mapActions({
      refreshTags: 'projects/loadProjectStructure',
      loadDocuments: 'documents/loadDocuments',
      openDocumentDialog: 'documents/openReferenceDocumentDialog',
    }),
    selectDocumentFile (document) {
      // can check file type, etc.
    },
    async uploadPolicyDocument() {
      await this.$nextTick()
      try {
        if (this.document.file.length === 0) {
            this.errors = {
              file: [this.$gettext('Please select a file that has the approriate extension and size.')]
            }
            this.submitError = true
            return false
        }
        const formData = new FormData()
        if (!this.editing || this.document.file[0]?.size) {
          if (this.document.file[0].size > this.documentMaxSize * 1000000) {
            this.errors = {
              file: [this.$gettext('The file size exceeds the upload limit of {size}MB.',{size: this.documentMaxSize})]
            }
            this.submitError = true
            return false
          }
          formData.append('document', this.document.file[0].raw)
        }
        formData.append('country', this.country.id)
        formData.append('title', this.document.title)
        formData.append('purpose', this.document.purpose)
        formData.append('language', this.document.language)
        if (this.document.types.length > 0) {
          this.document.types.forEach(type => formData.append(`document_types`, type))
        } else {
          formData.append('document_types', null)
        }
        if (this.document.tags.length > 0) {
          this.document.tags.forEach((tag) => formData.append(`tags`, tag))
        } else if (this.editing) {
          this.$axios.patch(`/api/document/${this.document.id}/`, { tags: [] })
        }
        formData.append('valid_from', this.document.valid_from)
        if (this.document.valid_until) formData.append('valid_until', this.document.valid_until)
        formData.append('featured', this.document.featured)

        const options = {
          method: this.editing ? 'PATCH' : 'POST',
          url: this.editing ? `/api/document/${this.document.id}/` : '/api/document/',
          headers: {
            'content-type': 'multipart/form-data'
          },
          data: formData
        }
        await this.$axios(options)
        this.showForm = false
        return true
      } catch (error) {
        this.submitError = true
        if (error.response && error.response.status === 400) {
          this.errors = error.response.data
        } else {
          this.errors = {
            general: [this.$gettext('Network error. Please try again or report the error.')]
          }
          console.log("🚀 ~ file: ReferenceDocumentAdmin.vue:326 ~ uploadPolicyDocument ~ error:", error)
        }
        return false
      }
    },
    editPolicyDocument(doc) {
      this.document = {
        id: doc.id,
        file: [{
          name: doc.document,
          editing: true
        }],
        document: doc.document,
        title: doc.title,
        purpose: doc.purpose,
        language: doc.language.id,
        types: doc.types.map(t => t.id),
        tags: [...doc.tags],
        featured: doc.featured,
        valid_from: doc.valid_from,
        valid_until: doc.valid_until,
      }
      this.submitError = false
      this.showForm = true
      this.editing = true
    },
    async submitForm() {
      let res = false
      res = await this.uploadPolicyDocument()
      if (res) {
        this.loadDocuments(),
        this.refreshTags(true)
      }
      this.editing = false
    },
    saveForm() {
      this.$refs.policyForm.validate(valid => {
        if (valid) {
          this.submitForm()
        } else {
          return false
        }
      })
    },
    discardForm() {
      this.showForm = false
      this.editing = false
    },
    async deletePolicyDocument(id) {
      try {
        await this.$axios.delete(`/api/document/${id}/`)
      } catch (error) {
        console.log("🚀 ~ file: ReferenceDocumentAdmin.vue:405 ~ deletePolicyDocument ~ error:", error)
      }
    },
    confirmDeletePolicyDocument(doc) {
      this.$confirm(
        this.$gettext('This will permanently delete the selected policy. Continue?'),
        this.$gettext('Warning'),
        {
          confirmButtonText: this.$gettext('OK'),
          cancelButtonText: this.$gettext('Cancel'),
          type: 'warning'
        }
      ).then(async () => {
        await this.deletePolicyDocument(doc.id)
        this.$message({
          type: 'success',
          message: this.$gettext('Delete completed')
        })
        this.loadDocuments()
      })
    },
    showDocumentDetails(doc) {
      this.openDocumentDialog(doc)
    },
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.RegistryForm {
  .ml {
    margin-left: 4px;
  }

  .el-form .el-form-item {
    margin-bottom: 36px;
    &.with-help {
      .el-form-item__content {
        display: flex;
        flex-direction: column;
        .help {
          margin: 4px 0 0 0;
          color: @colorTextSecondary;
          font-size: 12px;
          span {
            margin-left: 4px;
          }
        }
      }
    }
  }
  .el-upload-list__item {
    background-color: white;
    transition: none;
  }

  .Remove-icon {
    font-family: "element-icons" !important;
    font-size: @fontSizeLarge;
    cursor: pointer;
    display: inline-block;
    visibility: hidden;
    z-index: 10;
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    color: #f44336;
    font-weight: 700;
    opacity: 1;
    &::before {
      content: "\e60f";
    }
  }

  .el-upload-list__item {
    &:hover {
      background-color: @colorGrayLight;
    }
  }
  .el-upload-list__item-name {
    position: absolute;
  }

  .selectedDocument {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: 0 1em;
    background-color: #fef0cd;

  }

  .error-wrapper {
    background-color: mix(@colorWhite, @colorDanger, 92%);
    color: @colorDanger;
    padding: 1em;
    border: 1px @colorDanger solid;
    h1 {
      font-size: 18px;
    }
    .fields {
      color: @colorDanger;
      text-transform: capitalize;
      list-style-type: none;
      li {
        font-weight: bold;
        margin-bottom: 1em;
        .errors {
          margin-top: 6px;
          list-style-type: disc;
          li {
            font-size: 14px;
            font-weight: normal;
            text-transform: none;
          }
        }
      }
    }
  }
}

.add-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
  i {
    position: relative;
    top: 2px;
    font-size: 1.2rem;
  }
}

.AdminActionBarBottom {
  padding-top: 20px;
  border-top: 1px solid @colorGrayLight;
}
.w-full {
  width: 100%;
}

</style>