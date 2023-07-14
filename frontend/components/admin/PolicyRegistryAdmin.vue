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
          ref="documentUpload"
          label-width="220px"
          label-position="left"
          @submit.native.prevent
        >
          <el-form-item :label="$gettext('Document')">
            <file-upload
              :files="document.file"
              :limit="1"
              list-type="text"
              @update:files="selectDocumentFile($event)"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Title')">
            <el-input v-model="document.title" :maxlength="128" type="text" />
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
          <el-form-item :label="$gettext('Purpose')">
            <el-input
              v-model="document.purpose"
              type="textarea"
              rows="5"
            />
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
              :placeholder="$gettext('Select types')"
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
              type="month"
              :placeholder="$gettext('Pick a month')"
            />
          </el-form-item>
          <el-form-item :label="$gettext('Valid until')">
            <el-date-picker
              v-model="document.validUntil"
              type="month"
              :placeholder="$gettext('Pick a month')"
            />
          </el-form-item>
        </el-form>

        <div class="AdminActionBarBottom">
          <el-row
            type="flex"
            align="middle"
            justify="space-between"
          >
            <el-button
              type="text"
              class="CancelButton IconLeft"
              @click="showForm = false"
            >
              <fa icon="reply" />
              <translate>Dismiss changes</translate>
            </el-button>
            <el-button
              type="primary"
              size="medium"
              @click="save"
            >
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
          <i class="el-icon-add" />
          <translate>Add new</translate>
        </el-button>
      </template>
      <pre>
        {{ country }}
      </pre>
    </Panel>
  </PageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import Panel from '@/components/common/Panel'
import FileUpload from '@/components/common/FileUpload'
import LanguageSelect from '@/components/common/LanguageSelect'

export default {
  name: 'RegistryAdmin',
  components: {
    PageLayout,
    Panel,
    FileUpload,
    LanguageSelect,
  },
  data() {
    return {
      showForm: false,
      documents: [],
      document: {
        file: [],
        title: '',
        language: null,
        country: null,
        types: [],
        tags: [],
        featured: false,
      }
    }
  },
  computed: {
    ...mapGetters({
      country: 'admin/country/getData',
      policyRegistry: 'system/getPolicyRegistry',
    }),
  },
  methods: {
    selectDocumentFile (document) {
      console.log("🚀 ~ file: PolicyRegistryAdmin.vue:100 ~ selectDocumentFile ~ document:", document)
    },
    changeDocumentTitle (title) {
      console.log("🚀 ~ file: PolicyRegistryAdmin.vue:104 ~ changeDocumentTitle ~ title:", title)
    },
    save() {
      // get current user as author
      // get selected country
      console.log('submit form')
    },
    loadDocuments() {

    }
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
}

.add-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
}

.AdminActionBarBottom {
  padding-top: 20px;
  border-top: 1px solid @colorGrayLight;
}
.w-full {
  width: 100%;
}
</style>