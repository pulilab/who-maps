<template>
  <PageLayout>
    <template #title>
      <translate :parameters="{ name: country.name }">
        Policy Registry admin for {name}
      </translate>
    </template>
    <Panel v-if="showForm" key="registryForm">
      <template #header>
        <translate>New Health Policy Registry</translate>
      </template>
      <div class="RegistryForm">
        <el-form
          ref="registryForm"
          :rules="documentRules"
          label-width="220px"
          label-position="left"
          @submit.native.prevent
        >
          <el-form-item :label="$gettext('Document')">
            <div v-if="editing" class="selectedDocument">
              <translate>If you need to change the uploaded file of this policy, please delete this policy and create a new where you can upload the new file.</translate>
              <a :href="document.document" target="_blank">
                <translate>Download file</translate>
              </a>
            </div>
            <file-upload
              v-else
              :auto-upload="false"
              :files.sync="document.file"
              :limit="1"
              list-type="text"
              @update:files="selectDocumentFile"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Title')">
            <el-input v-model="document.title" :maxlength="128" type="text" />
          </el-form-item>
          <el-form-item :label="$gettext('Purpose')">
            <el-input
              v-model="document.purpose"
              type="textarea"
              rows="5"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Language')">
            <el-select
              v-model="document.language"
              :placeholder="$gettext('Select language')"
              class="LanguageSelectorDropdown"
            >
              <el-option
                v-for="language in policyRegistry.languages"
                :key="language.id"
                :label="language.name"
                :value="language.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$gettext('Types')">
            <el-select
              v-model="document.types"
              multiple
              :placeholder="$gettext('Select types')"
              class="w-full"
            >
              <el-option
                v-for="type in policyRegistry.types"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$gettext('Tags')">
            <el-select
              v-model="document.tags"
              multiple
              allow-create
              filterable
              :placeholder="$gettext('Select or create tags')"
              class="w-full"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Featured')">
            <el-switch
              v-model="document.featured"
              :active-text="$gettext('Featured')"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Valid from')">
            <el-date-picker
              v-model="document.validFrom"
              value-format="yyyy-MM-dd"
              :placeholder="$gettext('Pick a date')"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Valid until')">
            <el-date-picker
              v-model="document.validUntil"
              value-format="yyyy-MM-dd"
              :placeholder="$gettext('Pick a date')"
            />
          </el-form-item>
        </el-form>

        <div class="AdminActionBarBottom">
          <el-row type="flex" align="middle" justify="space-between">
            <el-button type="text" class="CancelButton IconLeft" @click="showForm = false">
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
    <Panel v-else key="registryList">
      <template #header>
        <translate>Policy registry</translate>
        <el-button class="add-btn" @click="showForm = true">
          <i class="el-icon-upload2" />
          <translate>Upload new policy document</translate>
        </el-button>
      </template>
      <div>
        <table class="PolicyList">
          <thead>
            <tr>
              <th>Country</th>
              <th>Title</th>
              <th>Period</th>
              <th>Type</th>
              <th>Language</th>
              <th>Keywords</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in documents" :key="doc.id" @click="showDocumentDetails(doc)">
              <td class="country">
                <CountryFlag :code="doc.country.code" small />
                <span>{{ doc.country.name }}</span>
              </td>
              <td>
                {{ doc.title }}
              </td>
              <td>
                {{ doc.valid_from }} - {{ doc.valid_until }}
              </td>
              <td class="tags">
                <span v-for="type in doc.types" :key="type.id">
                  {{ type.name }}
                </span>
              </td>
              <td>
                {{ doc.language.name }}
              </td>
              <td class="tags">
                <span v-for="(tag,i) in doc.tags" :key="i">
                  {{ tag }}
                </span>
              </td>
              <td class="featured">
                <i :class="`${doc.featured ? 'el-icon-star-on' : 'el-icon-star-off'}`" />
              </td>
              <td class="actions">
                <el-button icon="el-icon-edit" circle @click.stop="editPolicyDocument(doc)" />
                <el-button icon="el-icon-delete" circle class="delete" @click.stop="deletePolicyDocument(doc)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
    <PolicyDocumentDialog ref="documentDialog" />
  </PageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Panel from '@/components/common/Panel'
import FileUpload from '@/components/common/FileUpload'
import CountryFlag from '@/components/common/CountryFlag'
import PolicyDocumentDialog from '@/components/dialogs/PolicyDocumentDialog'

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
  name: 'RegistryAdmin',
  components: {
    PageLayout,
    Panel,
    FileUpload,
    CountryFlag,
    PolicyDocumentDialog,
  },
  data() {
    return {
      loading: false,
      showForm: false,
      editing: false,
      documents: [],
      documentsError: '',
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
        documents: [
          {
            validator: (rule, value, callback) => {
              if (this.documentsError) {
                callback(new Error(this.documentsError))
              } else {
                callback()
              }
            }
          }
        ]
      },
    }
  },
  computed: {
    ...mapGetters({
      country: 'admin/country/getData',
      countries: 'countries/getCountries',
      policyRegistry: 'system/getPolicyRegistry',
    }),
  },
  mounted() {
    this.loadDocuments()
  },
  watch: {
    showForm(val) {
      if (val && !this.editing) this.document = {...newDocument}
      if (!val) this.loadDocuments()
    }
  },
  methods: {
    selectDocumentFile (document) {
  console.log("🚀 ~ file: PolicyRegistryAdmin.vue:100 ~ selectDocumentFile ~ document:", document)
    },
    changeDocumentTitle (title) {
      console.log("🚀 ~ file: PolicyRegistryAdmin.vue:104 ~ changeDocumentTitle ~ title:", title)
    },
    async uploadPolicyDocument() {
      try {
        if (this.document.file.length === 0) return
        const formData = new FormData()
        formData.append('country', this.country.id)
        formData.append('document', this.document.file[0].raw)
        formData.append('title', this.document.title)
        formData.append('purpose', this.document.purpose)
        formData.append('language', this.document.language)
        this.document.types.forEach((type,i) => formData.append(`types[${i}]`, type))
        formData.append('tags', this.document.tags.join(','))
        formData.append('valid_from', this.document.valid_from)
        formData.append('valid_until', this.document.valid_until)
        formData.append('featured', this.document.featured)
        await this.$axios.post('/api/document/', formData, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        this.showForm = false
      } catch (error) {
        console.log("🚀 ~ file: PolicyRegistryAdmin.vue:263 ~ postPolicyDocument ~ error:", error)
      }
    },
    async updatePolicyDocument () {
      try {
        if (this.document.file.length === 0) return
        const formData = new FormData()
        formData.append('country', this.country.id)
        formData.append('document', this.document.file[0].raw)
        formData.append('title', this.document.title)
        formData.append('purpose', this.document.purpose)
        formData.append('language', this.document.language)
        this.document.types.forEach((type,i) => formData.append(`types[${i}]`, type))
        formData.append('tags', this.document.tags.join(','))
        formData.append('valid_from', this.document.valid_from)
        formData.append('valid_until', this.document.valid_until)
        formData.append('featured', this.document.featured)
        await this.$axios.post('/api/document/', formData, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        this.showForm = false
      } catch (error) {
        console.log("🚀 ~ file: PolicyRegistryAdmin.vue:263 ~ postPolicyDocument ~ error:", error)
      }
    },
    editPolicyDocument(doc) {
      this.document = {
        file: [],
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
      this.showForm = true
      this.editing = true
    },
    async loadDocuments() {
      try {
        const { data } = await this.$axios.get('/api/document-search/')
        this.documents = data.map(doc => ({
          ...doc,
          country: this.countries.find(c => c.id == doc.country),
          language: this.policyRegistry.languages.find(l => l.id == doc.language),
          types: doc.types.map(typeId => this.policyRegistry.types.find(t => t.id == typeId)),
        }))
      } catch (error) {
        console.log("🚀 ~ file: PolicyRegistryAdmin.vue:241 ~ loadDocuments ~ error:", error)

      }

    },
    saveForm() {
      if (this.editing) {
        this.updatePolicyDocument()
      } else {
        this.uploadPolicyDocument()
      }
    },
    deletePolicyDocument(doc) {
      this.$confirm(
        this.$gettext('This will permanently delete the selected policy. Continue?'),
        this.$gettext('Warning'),
        {
          confirmButtonText: this.$gettext('OK'),
          cancelButtonText: this.$gettext('Cancel'),
          type: 'warning'
        }
      ).then(async () => {
        this.submitDeletePolicy(doc)
        this.$message({
          type: 'success',
          message: this.$gettext('Delete completed')
        })
      })
    },
    showDocumentDetails(doc) {
      this.$refs.documentDialog.open(doc)
    },
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.RegistryForm {
  .el-form .el-form-item {
    margin-bottom: 20px;
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


.PolicyList {
  margin: auto;
  font-size: 14px;

  tr {
    &:hover {
      cursor: pointer;
      background-color: #eee;
    }
  }

  th {
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }

  td {
    vertical-align: top;
    padding: 8px 16px;

    &.country {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &.featured {
      color: @colorOwner;
      text-align: center;
      font-size: 1.2rem;
      i {
        display: inline-block;
        padding-top: 4px;
        &.el-icon-star-on {
          font-size: 1.5rem;
        }
      }
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    span {
      background-color: #eee;
      padding: 2px 4px;
      border-radius: 3px;
    }
  }

  .actions {
    display: flex;
    gap: 8px;
    .delete {
      &:hover {
        background-color: red;
        color: white;
      }
    }
  }
}

</style>