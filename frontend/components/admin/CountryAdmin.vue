<template>
  <page-layout class="CountryAdmin">
    <template #title>
      <translate :parameters="{ name: country.name }">
        Country admin for {name}
      </translate>
    </template>

    <collapsible-card
      :title="$gettext('Country information') | translate"
      class="CountryInformation"
    >
      <el-form
        ref="countryInfo"
        :rules="rules"
        :model="{ logo, cover }"
        label-width="220px"
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item
          v-if="userProfile && userProfile.is_superuser"
          :label="$gettext('Choose country') | translate"
        >
          <country-select
            :value="countryId"
            @change="setCountryId"
          />
        </el-form-item>

        <el-form-item
          :label="$gettext('Logo') | translate"
          prop="logo"
        >
          <file-upload
            :disabled="notSCA"
            :auto-upload="false"
            :files.sync="logo"
            :limit="1"
          />
        </el-form-item>

        <el-form-item
          :label="$gettext('Cover image') | translate"
          prop="cover"
        >
          <file-upload
            :disabled="notSCA"
            :files.sync="cover"
            :limit="1"
          />
        </el-form-item>

        <el-form-item :label="$gettext('Cover text') | translate">
          <el-input
            v-model="coverText"
            :disabled="notSCA"
            type="textarea"
            rows="5"
          />
        </el-form-item>

        <el-form-item :label="$gettext('Footer title') | translate">
          <el-input
            v-model="footerTitle"
            :disabled="notSCA"
            :maxlength="128"
            type="text"
          />
        </el-form-item>

        <el-form-item :label="$gettext('Footer text') | translate">
          <el-input
            v-model="footerText"
            :disabled="notSCA"
            :maxlength="128"
            type="text"
          />
        </el-form-item>

        <el-form-item :label="$gettext('Project approval process') | translate">
          <el-checkbox
            v-model="projectApproval"
            :disabled="notSCA"
          >
            <translate
              v-if="projectApproval"
              key="used-country"
            >
              Used for projects in country
            </translate>
            <translate
              v-if="!projectApproval"
              key="not-used-country"
            >
              Not used for projects in country
            </translate>
          </el-checkbox>
        </el-form-item>

        <el-form-item
          :label="$gettext('Partner logos') | translate"
          prop="partnerLogos"
        >
          <file-upload
            :disabled="notSCA"
            :files.sync="partnerLogos"
            :limit="10"
          />
        </el-form-item>

        <div class="Divider" />

        <el-form-item :label="$gettext('Widgets') | translate">
          <label class="el-form-item__label">
            <translate>Please enable widgets you want to show on the landing
              page:</translate>
          </label>
        </el-form-item>
        <el-form-item>
          <div class="Switch-container">
            <filter-switch
              v-model="GDHIEnabled"
              :label="$gettext('Global Digital Health Index') | translate"
              :tooltip="$gettext('Lorem ipsum') | translate"
            />
            <label>
              <a
                :href="
                  `https://index.digitalhealthindex.org/country_profile/${country.alpha_3_code ||
                    ''}`
                "
                target="_blank"
                class="Right-label"
              >
                <fa icon="external-link-alt" />
                <translate>Visit digitalhealthindex.org</translate>
              </a>
            </label>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="Switch-container">
            <filter-switch
              v-model="roadmapEnabled"
              :label="
                $gettext('National Digital Health Reference Documents')
                  | translate
              "
              :tooltip="
                $gettext(
                  'These documents may include a National Digital Health Vision, Action Plan,Implementation Plan, Digital Health Strategy, or Reference Architecture.'
                ) | translate
              "
            />
            <label
              v-if="roadmapEnabled"
              class="Right-label"
              @click="focuseRoadmapDocuments"
            >
              <fa icon="pen" />
              <translate>Upload documents</translate>
            </label>
          </div>
        </el-form-item>
      </el-form>
    </collapsible-card>

    <collapsible-card
      v-if="projectApproval"
      :title="$gettext('Project Approval') | translate"
      class="ProjectApproval"
    >
      <project-approval />
    </collapsible-card>

    <collapsible-card
      v-if="roadmapEnabled"
      ref="roadmapdocs"
      :title="
        $gettext('National Digital Health Reference Documents') | translate
      "
      class="RoadmapDocuments"
    >
      <el-form
        ref="documentsUpload"
        :rules="documentRules"
        :model="{ documents }"
        label-width="220px"
        label-position="left"
        @submit.native.prevent
      >
        <div
          v-for="(document, index) in documents"
          :key="index"
          class="FileUploadContainer"
        >
          <el-form-item
            :label="$gettext('Document') | translate"
            :prop="`documents.${index}.document`"
          >
            <div
              class="Remove-icon"
              @click="removeDocument(index)"
            />
            <file-upload
              :files="document.document"
              :limit="1"
              :auto-upload="false"
              :disabled="notSCA"
              list-type="text"
              @update:files="selectDocumentFile($event, index)"
            />
          </el-form-item>
          <el-form-item
            :label="$gettext('Title') | translate"
            :prop="`documents.${index}.title`"
            :rules="titleRules"
          >
            <el-input
              :value="document.title"
              :maxlength="128"
              :disabled="notSCA"
              type="text"
              @input="changeDocumentTitle($event, index)"
            />
          </el-form-item>
        </div>
        <el-form-item prop="documents" />
       <!--  <div>
          <el-button
            :disabled="documents.length === roadmap.max_documents || notSCA"
            type="text"
            class="IconLeft"
            @click="addDocument"
          >
            <fa icon="plus" />
            <translate>Add new document</translate>
          </el-button>
        </div> -->
      </el-form>
      <div class="Footer">
        <p>
          <fa icon="info-circle" />
          <translate>
            About these documents: Upload your national or regional reference
            policies, architecture blueprints or strategy documents which could
            be helpful to investors and implementation partners working in your
            country.
          </translate>
        </p>
        <!-- <p>
          <fa icon="info-circle" />
          <translate
            :parameters="{
              list: extensionList,
              size: roadmap.max_size_in_MB,
              max: roadmap.max_documents
            }"
          >
            Supported file formats include: {list} The file size is limited to
            {size}MB. You are able to upload a maximum of {max} reference files.
            If you need to increase this number, email
            digital-health-atlas@who.int to add more documents.
          </translate>
        </p> -->
      </div>
    </collapsible-card>

    <collapsible-card
      :title="$gettext('User management') | translate"
      class="UserManagement"
    >
      <el-row type="flex">
        <el-col class="AdminPersonaChooser">
          <div
            :class="['Persona', { active: selectedPersona === 'G' }]"
            @click="selectPersona('G')"
          >
            <div class="PersonaName">
              <translate>Government Viewers</translate>
            </div>
            <div class="RequestCount">
              <translate :parameters="{ num: userSelection.length - users.length }">
                {num} new request(s)
              </translate>
            </div>
            <fa icon="chevron-right" />
          </div>
          <div
            :class="['Persona', { active: selectedPersona === 'CA' }]"
            @click="selectPersona('CA')"
          >
            <div class="PersonaName">
              <translate>Government Admins</translate>
            </div>
            <div class="RequestCount">
              <translate :parameters="{ num: adminSelection.length - admins.length }">
                {num} new request(s)
              </translate>
            </div>
            <fa icon="chevron-right" />
          </div>
          <div
            :class="['Persona', { active: selectedPersona === 'SCA' }]"
            @click="selectPersona('SCA')"
          >
            <div class="PersonaName">
              <translate>Government System Admins</translate>
            </div>
            <div class="RequestCount">
              <translate :parameters="{ num: superadminSelection.length - superAdmins.length }">
                {num} new request(s)
              </translate>
            </div>
            <fa icon="chevron-right" />
          </div>
        </el-col>

        <el-col class="UserTransfers">
          <div
            v-if="selectedPersona === 'G'"
            class="PersonaPrivileges"
          >
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <fa icon="info-circle" />
                  <translate>Privileges for Government Viewers</translate>
                </template>
                <div>
                  <ul>
                    <li>
                      <translate key="g-list-item-1">
                        Can read/export responses to private Government
                        questions
                      </translate>
                    </li>
                    <li>
                      <translate key="g-list-item-2">
                        Can view when a project is approved/declined
                      </translate>
                    </li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-transfer
            v-if="selectedPersona === 'G'"
            v-model="users"
            :titles="transferTitles"
            :data="userSelection"
            :filter-placeholder="$gettext('Type to filter users...') | translate"
            filterable
          />

          <div v-if="selectedPersona === 'CA'" class="PersonaPrivileges">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <fa icon="info-circle" />
                  <translate>Privileges for Government Admins</translate>
                </template>
                <div>
                  <ul>
                    <li>
                      <translate key="ca-list-item-1">
                        Can update Government map data
                      </translate>
                    </li>
                    <li>
                      <translate key="ca-list-item-2">
                        Can create and delete Government-specific questions
                      </translate>
                    </li>
                    <li>
                      <translate key="ca-list-item-3">
                        Can select which questions are private and public
                      </translate>
                    </li>
                    <li>
                      <translate key="ca-list-item-4">
                        Can read/export responses to private Government
                        questions
                      </translate>
                    </li>
                    <li>
                      <translate key="ca-list-item-5">
                        Can approve users to join the Government page
                      </translate>
                    </li>
                    <li>
                      <translate key="ca-list-item-6">
                        Can approve projects if the project approval feature is
                        active
                      </translate>
                    </li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-transfer
            v-if="selectedPersona === 'CA'"
            v-model="admins"
            :titles="transferTitles"
            :data="adminSelection"
            :filter-placeholder="$gettext('Type to filter users...') | translate"
            filterable
          />

          <div v-if="selectedPersona === 'SCA'" class="PersonaPrivileges">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <fa icon="info-circle" />
                  <translate>Privileges for Government System Admins</translate>
                </template>
                <div>
                  <ul>
                    <li>
                      <translate key="sca-list-item-1">
                        Can update Government map data
                      </translate>
                    </li>
                    <li>
                      <translate key="sca-list-item-2">
                        Can create and delete Government-specific questions
                      </translate>
                    </li>
                    <li>
                      <translate key="sca-list-item-3">
                        Can select which questions are private and public
                      </translate>
                    </li>
                    <li>
                      <translate key="sca-list-item-4">
                        Can read/export responses to private Government
                        questions
                      </translate>
                    </li>
                    <li>
                      <translate key="sca-list-item-5">
                        Can approve users to join the Government page
                      </translate>
                    </li>
                    <li>
                      <translate key="sca-list-item-6">
                        Can approve projects if the project approval feature is
                        active
                      </translate>
                    </li>
                    <li>
                      <translate key="sca-list-item-7">
                        Can customize and update Government home page
                      </translate>
                    </li>
                    <li>
                      <translate key="sca-list-item-8">
                        Can upload and manage Health Policy Registry documents
                      </translate>
                    </li>
                  </ul>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-transfer
            v-if="selectedPersona === 'SCA'"
            v-model="superAdmins"
            :titles="transferTitles"
            :data="superadminSelection"
            :filter-placeholder="$gettext('Type to filter users...') | translate"
            filterable
          />
        </el-col>
      </el-row>
    </collapsible-card>

    <collapsible-card
      :title="$gettext('Country specific questionnaire') | translate"
      class="Questionnaire"
    >
      <dha-questionaire ref="customQuestions" />
    </collapsible-card>

    <collapsible-card
      :title="$gettext('Country map') | translate"
      class="CountryMap"
    >
      <vue-map-customizer />
    </collapsible-card>

    <div class="AdminActionBarBottom">
      <el-row
        type="flex"
        align="middle"
        justify="space-between"
      >
        <el-button
          type="text"
          class="CancelButton IconLeft"
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
  </page-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PageLayout from '@/components/common/wrappers/PageLayout'
import CollapsibleCard from '../project/CollapsibleCard'
import VueMapCustomizer from '../admin/VueMapCustomizer'
import DhaQuestionaire from '../admin/DhaQuestionaire'
import FileUpload from '../common/FileUpload'
import CountrySelect from '../common/CountrySelect'
import ProjectApproval from './ProjectApproval'
import FilterSwitch from '~/components/dashboard/FilterSwitch'

import { mapGettersActions } from '../../utilities/form'

export default {
  name: 'CountryAdmin',

  components: {
    PageLayout,
    CollapsibleCard,
    VueMapCustomizer,
    DhaQuestionaire,
    FileUpload,
    CountrySelect,
    ProjectApproval,
    FilterSwitch
  },

  data () {
    return {
      selectedPersona: 'G',
      logoError: '',
      coverError: '',
      flagForKeepingdocumentsError: false,
      flagForKeepingPartnerLogosError: false,
      partnerLogosError: '',
      documentsError: '',
      titleRules: [
        {
          trigger: ['blur', 'change'],
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error(this.$gettext('A title is required')))
            } else {
              callback()
            }
          }
        }
      ],
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
      rules: {
        logo: [
          {
            validator: (rule, value, callback) => {
              if (this.logoError) {
                callback(new Error(this.logoError))
              } else {
                callback()
              }
            }
          }
        ],
        cover: [
          {
            validator: (rule, value, callback) => {
              if (this.coverError) {
                callback(new Error(this.coverError))
              } else {
                callback()
              }
            }
          }
        ],
        partnerLogos: [
          {
            validator: (rule, value, callback) => {
              if (this.partnerLogosError) {
                callback(new Error(this.partnerLogosError))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },

  computed: {
    ...mapGettersActions({
      coverText: ['admin/country', 'getCoverText', 'setCoverText'],
      footerTitle: ['admin/country', 'getFooterTitle', 'setFooterTitle'],
      footerText: ['admin/country', 'getFooterText', 'setFooterText'],
      projectApproval: [
        'admin/country',
        'getProjectApproval',
        'setProjectApproval'
      ],
      GDHIEnabled: ['admin/country', 'getGDHIEnabled', 'setGDHIEnabled'],
      roadmapEnabled: [
        'admin/country',
        'getRoadmapEnabled',
        'setRoadmapEnabled'
      ]
    }),

    ...mapGetters({
      country: 'admin/country/getData',
      userSelection: 'admin/country/getUserSelection',
      adminSelection: 'admin/country/getAdminSelection',
      superadminSelection: 'admin/country/getSuperadminSelection',
      userProfile: 'user/getProfile',
      roadmap: 'system/getRoadmap'
    }),/*
    extensionList () {
      return this.roadmap.valid_types.join(', ')
    }, */
    documentList () {
      return this.documents.map(document => document.document)
    },

    notSCA () {
      return (
        this.userProfile &&
        this.userProfile.account_type === 'CA' &&
        !this.userProfile.is_superuser
      )
    },

    logo: {
      get () {
        if (typeof this.country.logo === 'string') {
          return [
            {
              url: this.country.logo,
              name: ('' + this.country.logo).split('/').pop()
            }
          ]
        } else if (!this.country.logo) {
          return []
        } else {
          return [this.country.logo]
        }
      },
      set ([value]) {
        this.setDataField({ field: 'logo', data: value })
      }
    },

    cover: {
      get () {
        if (typeof this.country.cover === 'string') {
          return [
            {
              url: this.country.cover,
              name: ('' + this.country.cover).split('/').pop()
            }
          ]
        } else if (!this.country.cover) {
          return []
        } else {
          return [this.country.cover]
        }
      },
      set ([value]) {
        this.setDataField({ field: 'cover', data: value })
      }
    },

    partnerLogos: {
      get () {
        // eslint-disable-next-line array-callback-return
        return this.country.partner_logos.map(rawLogo => {
          if (rawLogo.raw || rawLogo.uid) {
            return rawLogo
          } else if (rawLogo.image) {
            return {
              url: rawLogo.image,
              name: ('' + rawLogo.image).split('/').pop(),
              id: rawLogo.id
            }
          }
        })
      },
      set (value) {
        this.setDataField({ field: 'partner_logos', data: value })
      }
    },

    documents: {
      get () {
        return this.country.documents.map(data => {
          if (typeof data.document === 'string') {
            return {
              title: data.title,
              id: data.id,
              document: [
                {
                  url: data.document,
                  name: ('' + data.document).split('/').pop()
                }
              ]
            }
          }
          if (Array.isArray(data.document)) {
            return data
          }
          const document = data.document ? [data.document] : []
          const res = {
            title: data.title,
            document
          }
          if (data.id) {
            res.id = data.id
          }
          return res
        })
      },
      set (documents) {
        const data = documents.map(data => {
          if (Array.isArray(data.document)) {
            const result = {
              title: data.title,
              document: data.document[0]
            }
            if (data.id) {
              result.id = data.id
            }
            return result
          }
          return data
        })
        this.setDataField({ field: 'documents', data })
      }
    },

    users: {
      get () {
        return this.country.users || []
      },
      set (value) {
        this.setDataField({ field: 'users', data: value })
      }
    },

    admins: {
      get () {
        return this.country.admins || []
      },
      set (value) {
        this.setDataField({ field: 'admins', data: value })
      }
    },

    superAdmins: {
      get () {
        return this.country.super_admins || []
      },
      set (value) {
        this.setDataField({ field: 'super_admins', data: value })
      }
    },

    countryId: {
      get () {
        return this.country.id
      },
      async set (value) {
        this.setId(value)
        await this.fetchData()
        await this.loadGeoJSON()
      }
    },
    transferTitles () {
      return [this.$gettext('New requests'), this.$gettext('Approved')]
    }
  },

  watch: {
    /* documentList (newDocs, oldDocs) {
      const formats = this.roadmap.valid_types.map(extension =>
        extension.substr(extension.length - 4)
      )
      const incorrectDoc = this.documents.find(documentData => {
        const document = documentData.document[0] || {}
        return (
          document.raw &&
          !formats.includes(
            document.raw.name.substr(document.raw.name.length - 4)
          )
        )
      })
      if (incorrectDoc) {
        const newDocuments = [...this.documents]
        const replacementDoc = { ...this.documents.indexOf(incorrectDoc) }
        replacementDoc.document = []
        newDocuments[this.documents.indexOf(incorrectDoc)] = replacementDoc
        this.documents = newDocuments
        this.documentsError = this.$gettext(
          'Wrong file format, you can only upload {list} files',
          { list: this.extensionList }
        )
        this.flagForKeepingdocumentsError = true
      } else if (this.flagForKeepingdocumentsError) {
        this.flagForKeepingdocumentsError = false
        return
      } else {
        this.documentsError = ''
      }
      this.$refs.documentsUpload.validate(() => {})
    }, */
    logo (newArr, oldArr) {
      // Handles error message placing for wrong image formats
      if (!newArr.length) {
        return
      }

      const filteredArray = [
        ...this.logo.filter(image => {
          return (
            !image.raw ||
            (image.raw && image.raw.name.endsWith('.jpg')) ||
            (image.raw && image.raw.name.endsWith('.jpeg')) ||
            (image.raw && image.raw.name.endsWith('.png'))
          )
        })
      ]

      if (newArr.length !== filteredArray.length) {
        this.logo = filteredArray
        this.logoError = this.$gettext(
          'Wrong image format, you can only upload .jpg and .png files'
        )
      } else {
        this.logoError = ''
      }
      this.$refs.countryInfo.validate(() => {})
    },

    cover (newArr, oldArr) {
      // Handles error message placing for wrong image formats
      if (!newArr.length) {
        return
      }

      const filteredArray = [
        ...this.cover.filter(image => {
          return (
            !image.raw ||
            (image.raw && image.raw.name.endsWith('.jpg')) ||
            (image.raw && image.raw.name.endsWith('.jpeg')) ||
            (image.raw && image.raw.name.endsWith('.png'))
          )
        })
      ]

      if (newArr.length !== filteredArray.length) {
        this.cover = filteredArray
        this.coverError = this.$gettext(
          'Wrong image format, you can only upload .jpg and .png files'
        )
      } else {
        this.coverError = ''
      }
      this.$refs.countryInfo.validate(() => {})
    },

    partnerLogos (newArr, oldArr) {
      // Handles error message placing for wrong image formats
      const filteredArray = [
        ...this.partnerLogos.filter(image => {
          return (
            !image.raw ||
            (image.raw && image.raw.name.endsWith('.jpg')) ||
            (image.raw && image.raw.name.endsWith('.jpeg')) ||
            (image.raw && image.raw.name.endsWith('.png'))
          )
        })
      ]

      if (newArr.length !== filteredArray.length) {
        this.partnerLogos = filteredArray
        this.partnerLogosError = this.$gettext(
          'Wrong image format, you can only upload .jpg and .png files'
        )
        this.flagForKeepingPartnerLogosError = true
      } else if (this.flagForKeepingPartnerLogosError) {
        this.flagForKeepingPartnerLogosError = false
        return
      } else {
        this.partnerLogosError = ''
      }
      this.$refs.countryInfo.validate(() => {})
    }
  },

  methods: {
    ...mapActions({
      setDataField: 'admin/country/setDataField',
      saveChanges: 'admin/country/saveChanges',
      setId: 'admin/country/setId',
      fetchData: 'admin/country/fetchData',
      loadGeoJSON: 'admin/map/loadGeoJSON'
    }),

    focuseRoadmapDocuments () {
      this.$refs.roadmapdocs.$el.scrollIntoView()
    },

    addDocument () {
      this.documents = [
        ...this.documents,
        {
          title: '',
          document: []
        }
      ]
    },

    selectDocumentFile (document, index) {
      const newDocuments = [...this.documents]
      if (document && !document.length) {
        newDocuments.splice(index, 1)
      } else {
        newDocuments[index] = { ...newDocuments[index], document }
      }
      this.documents = newDocuments
    },

    changeDocumentTitle (title, index) {
      const newDocuments = [...this.documents]
      const doc = { ...newDocuments[index] }
      doc.title = title
      newDocuments[index] = doc
      this.documents = newDocuments
    },

    removeDocument (index) {
      const newDocuments = [...this.documents]
      newDocuments.splice(index, 1)
      this.documents = newDocuments
    },

    selectPersona (selected) {
      this.selectedPersona = selected
    },

    setCountryId (selected) {
      this.countryId = selected
    },
    save () {
      if (this.documentList.find(doc => doc.length === 0)) {
        this.documentsError = this.$gettext(
          'A document is missing or too many were added'
        )
        this.$refs.documentsUpload.validate(() => {})
        this.$alert('A roadmap document is missing', 'Warning', {
          confirmButtonText: 'Ok',
          callback: () => {
            this.$refs.documentsUpload.$el.scrollIntoView()
          }
        })
        return
      }
      if (this.$refs.customQuestions.allSaved) {
        this.saveChanges()
      } else {
        this.$alert('Your questionnaire is not completely saved', 'Warning', {
          confirmButtonText: 'Ok',
          callback: () => {
            this.$refs.customQuestions.$el.scrollIntoView()
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.CountryAdmin {
  .RoadmapDocuments {
    .el-form .el-form-item {
      margin-bottom: 20px;
    }
    .el-upload-list__item {
      border-color: white;
      transition: none;
    }
    .FileUploadContainer:not(:first-child) {
      margin-top: 30px;
      border-top: 1px solid #b9b9b9;
      padding-top: 20px;
    }
    .FileUploadContainer:hover {
      & .Remove-icon {
        visibility: visible;
      }
      & .el-upload-list__item-status-label {
        display: none;
      }
    }
    .Footer {
      color: #6d6d6d;
      line-height: @fontSizeLarge;
      font-size: @fontSizeSmall;
    }
    svg {
      color: #b9b9b9;
      padding-right: 7.5px;
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
    .el-icon-close {
      display: none !important;
    }
    .el-upload-list__item {
      &:hover {
        background-color: transparent;
      }
    }
    .el-upload-list__item-name {
      margin-left: -15px;
      padding-right: 15px;
    }
  }

  .Divider {
    box-sizing: border-box;
    width: 100%;
    height: 1px;
    width: @cardSizeMedium;
    margin: 40px 0 40px -40px;
    background-color: @colorGrayLight;
  }
  .CollapsibleCard {
    width: @cardSizeMedium;
    margin: 0 auto 20px;
  }

  .CountryInformation {
    .ContentContainer {
      padding: 40px;
    }

    .el-checkbox {
      line-height: 40px;
    }

    .CountrySelector {
      width: 50%;
    }
  }

  .ProjectApproval {
    .ContentContainer {
      padding: 20px 40px 60px;
    }
  }

  .UserManagement {
    .ContentContainer {
      padding: 0;
    }

    .AdminPersonaChooser {
      width: 200px;
      border-right: 2px solid @colorGrayLighter;

      .Persona {
        position: relative;
        display: block;
        padding: 16px 20px;
        border-bottom: 1px solid @colorGrayLighter;
        cursor: pointer;
        transition: @transitionAll;

        .PersonaName {
          color: @colorTextSecondary;
          font-size: @fontSizeBase;
          line-height: 16px;
          margin-bottom: 8px;
        }

        .RequestCount {
          color: @colorTextMuted;
          font-size: @fontSizeSmall;
        }

        .svg-inline--fa {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          height: 14px;
          opacity: 0;
          transition: @transitionAll;
        }

        &:hover {
          background-color: @colorGrayLightest;

          .PersonaName {
            color: @colorTextPrimary;
          }

          .RequestCount {
            color: @colorGray;
          }

          .svg-inline--fa {
            opacity: 0.5;
          }
        }

        &.active {
          background-color: mix(@colorWhite, @colorBrandPrimary, 90%);
          border-color: mix(@colorWhite, @colorBrandPrimary, 70%);

          .PersonaName {
            font-weight: 700;
            color: @colorBrandPrimary;
          }

          .RequestCount {
            color: @colorTextSecondary;
          }

          .svg-inline--fa {
            color: @colorBrandPrimary;
            opacity: 1;
          }
        }
      }
    }

    .UserTransfers {
      padding: 20px 0px 20px  40px;

      .PersonaPrivileges {
        margin: 0 0 20px;

        ul {
          margin: 0;
          padding: 0 0 0 40px;

          li {
            font-size: @fontSizeSmall;
            line-height: 18px;
            color: @colorTextSecondary;
          }
        }
      }

      .el-transfer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 0 0 20px;

        ::v-deep .el-transfer-panel {
          width: 100%;

          .el-transfer-panel__body {
            min-height: 250px;
            max-height: 40vh;
            overflow-y: auto;

            .el-transfer-panel__list.is-filterable {
              height: 188px;
            }

            .el-transfer-panel__item {
              margin-bottom: 8px;

              .el-checkbox__label {
                white-space: pre;
                line-height: 15px;
                font-size: 13px;
              }
            }
          }

          // &:first-child {
          //   .el-transfer-panel__header {
          //     background-color: lighten(@colorDraft, 33%);
          //   }
          // }
          //
          // &:last-child {
          //   .el-transfer-panel__header {
          //     background-color: lighten(@colorPublished, 52%);
          //   }
          // }
        }

        ::v-deep .el-transfer__buttons {
          display: flex;
          flex-direction: column;
          text-align: center;

          .el-button + .el-button {
            margin-left: 0;
          }
        }
      }
    }
  }

  .Questionnaire {
    .ContentContainer {
      padding: 20px;
    }
  }

  .CountryMap {
    .ContentContainer {
      padding: 0;
    }
  }

  .AdminActionBarBottom {
    box-sizing: border-box;
    min-width: @cardSizeMedium;
    max-width: @cardSizeMedium;
    margin: 40px auto;
    padding: 40px 0;
    border-top: 1px solid @colorGrayLight;
  }
}

[dir="rtl"] {
  .CountryAdmin {
    .UserManagement {
      .AdminPersonaChooser {
        border-left: 2px solid @colorGrayLighter;
        border-right: none;

        .Persona {
          .svg-inline--fa {
            left: 12px;
            right: auto;
            transform: translateY(-50%) rotate(180deg);
          }
        }
      }

      .UserTransfers {
        .PersonaPrivileges {
          .el-collapse .el-collapse-item__header .svg-inline--fa {
            margin-left: 6px;
            margin-right: 0;
          }
          ul {
            padding-left: 0;
            padding-right: 40px;
          }
        }
      }
    }
  }
}
</style>
