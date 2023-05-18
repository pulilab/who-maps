<template>
  <div
    id="general"
    class="GeneralOverview"
  >
    <collapsible-card
      ref="collapsible"
      :title="$gettext('General overview') | translate"
      :prepend-title="prependTitle"
      show-legend
    >
      <custom-required-form-item
        :error="errors.first('name')"
        :draft-rule="draftRules.name"
        :publish-rule="publishRules.name"
        prepend-label="1"
      >
        <template slot="label">
          <translate key="project-name">
            What is the project name?
          </translate>
          <form-hint>
            <translate key="project-name-hint">
              If this is your first time uploading a project, a sample data form
              can be found here for reference.
            </translate>
          </form-hint>
        </template>
        <character-count-input-standalone
          v-validate="rules.name"
          :rules="rules.name"
          data-vv-name="name"
          data-vv-as="Name"
          get="getName"
          set="setName"
          namespace="project"
        />
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('donors')"
        :draft-rule="draftRules.donors"
        :publish-rule="publishRules.donors"
        prepend-label="2"
      >
        <template slot="label">
          <translate key="donors">
            Who are your investment partners?
          </translate>
          <tooltip
            :text="
              $gettext(
                'Investment partners can include those contributing funds, human resources or in-kind support.'
              ) | translate
            "
          />
        </template>

        <donor-selector
          v-model="donors"
          v-validate="rules.donors"
          data-vv-name="donors"
          data-vv-as="Investors"
        />
      </custom-required-form-item>

      <custom-required-form-item
        class="ImplementingPartners"
        :draft-rule="draftRules.implementing_partners"
        :publish-rule="publishRules.implementing_partners"
        prepend-label="3"
      >
        <template slot="label">
          <translate key="implementing-partners">
            Who are your implementing partners?
          </translate>
        </template>
        <el-row v-for="(partner, index) in implementing_partners" :key="index">
          <el-col :span="17">
            <custom-required-form-item
              :error="errors.first('implementing_partners_' + index)"
            >
              <el-input
                ref="implementingPartnersInput"
                v-validate="rules.implementing_partners"
                :maxlength="rules.implementing_partners.max"
                :value="partner"
                :data-vv-name="'implementing_partners_' + index"
                data-vv-validate-on="change"
                data-vv-as="Implementing partners"
                @input="updateImplmeentingPartners($event, index)"
                @keyup.enter.native="addImplementingPartners"
              />
            </custom-required-form-item>
          </el-col>
          <el-col :span="6">
            <add-rm-buttons
              :show-add="isLastAndExist(implementing_partners, index)"
              :show-rm="implementing_partners.length > 1"
              @add="addImplementingPartners"
              @rm="rmImplementingPartners(index)"
            />
          </el-col>
        </el-row>
      </custom-required-form-item>

      <custom-required-form-item
        :error="errors.first('organisation')"
        :draft-rule="draftRules.organisation"
        :publish-rule="publishRules.organisation"
        prepend-label="4"
      >
        <template slot="label">
          <translate key="organisation">
            What is the name of the lead organization?
          </translate>
        </template>
        <organisation-select
          v-model="organisation"
          v-validate="rules.organisation"
          data-vv-name="organisation"
        />
      </custom-required-form-item>
      <custom-required-form-item
        :error="errors.first('country')"
        :draft-rule="draftRules.country"
        :publish-rule="publishRules.country"
        prepend-label="5"
      >
        <template slot="label">
          <translate key="country">
            Which country is the project located in?
          </translate>
        </template>
        <country-select
          v-model="country"
          v-validate="rules.country"
          data-vv-name="country"
          data-vv-as="Country"
          :disabled="isGlobal"
        />
        <div class="FilterContainer">
          <div class="FilterLabel">
            OR
          </div>
          <filter-switch
            v-model="isGlobal"
            :label="$gettext('Set project as \'Global project\'') | translate"
            :tooltip="
              $gettext(
                'If your project is located in more than one country, or is part of a broader global initiative, your project is a Global Project. Indicated the countries covered and scope in the Narrative Summary Field.'
              ) | translate
            "
            placement="top"
          />
        </div>
        <span class="Hint">
          <fa icon="info-circle" />
          <p>
            <translate>
              Projects in the DHA can be linked to a specific country, or for
              projects which operate in multiple countries or across a region,
              projects can be listed as global.
            </translate>
          </p>
        </span>
      </custom-required-form-item>
      <custom-required-form-item
        :error="errors.first('geographic_scope')"
        :draft-rule="draftRules.geographic_scope"
        :publish-rule="publishRules.geographic_scope"
        prepend-label="6"
      >
        <template slot="label">
          <translate key="geographic-scope">
            What is the geographic scope of the project?
          </translate>
          <tooltip
            :text="
              $gettext(
                'Describe the user types, geographic coverage and other coverage details.'
              ) | translate
            "
          />
        </template>

        <character-count-input-standalone
          v-validate="rules.geographic_scope"
          :rules="rules.geographic_scope"
          data-vv-name="geographic_scope"
          data-vv-as="Geographic scope"
          get="getGeographicScope"
          set="setGeographicScope"
          namespace="project"
          type="textarea"
        />
        <span class="Hint">
          <fa icon="info-circle" />
          <p>
            <translate>
              Please describe where your implementation is currently taking
              place
            </translate>
          </p>
        </span>
      </custom-required-form-item>
      <custom-required-form-item
        :error="errors.first('implementation_overview')"
        :draft-rule="draftRules.implementation_overview"
        :publish-rule="publishRules.implementation_overview"
        prepend-label="7"
      >
        <template slot="label">
          <translate key="implementation-overview">
            Please provide a narrative summary of the digital health
            implementation.
          </translate>
          <tooltip
            :text="
              $gettext('Describe your overall digital health project design.')
                | translate
            "
          />
        </template>
        <character-count-input-standalone
          v-validate="rules.implementation_overview"
          :rules="rules.implementation_overview"
          data-vv-name="implementation_overview"
          data-vv-as="Implementation Overview"
          get="getImplementationOverview"
          set="setImplementationOverview"
          namespace="project"
          :autosize="{ minRows: 5, maxRows: 20 }"
          type="textarea"
        />
        <span class="Hint">
          <fa icon="info-circle" />
          <p>
            <translate>Describe what the technology aims to achieve, detailing the
              users, the reasons for deploying the system, and current and
              future phases of deployment.</translate>
          </p>
        </span>
      </custom-required-form-item>
      <el-row :gutter="20" type="flex">
        <el-col :span="12">
          <custom-required-form-item
            :error="errors.first('contact_name')"
            :draft-rule="draftRules.contact_name"
            :publish-rule="publishRules.contact_name"
            prepend-label="8"
          >
            <template slot="label">
              <translate key="contact-name">
                Contact name
              </translate>
              <tooltip
                :text="
                  $gettext(
                    'This is the individual who will be the lead point of contact for any queries through the DHA.'
                  ) | translate
                "
              />
            </template>

            <character-count-input-standalone
              v-validate="rules.contact_name"
              :rules="rules.contact_name"
              data-vv-name="contact_name"
              data-vv-as="Contact name"
              get="getContactName"
              set="setContactName"
              namespace="project"
            />
          </custom-required-form-item>
        </el-col>
        <el-col :span="12">
          <custom-required-form-item
            :error="errors.first('contact_email')"
            :draft-rule="draftRules.contact_email"
            :publish-rule="publishRules.contact_email"
            prepend-label="9"
          >
            <template slot="label">
              <translate key="contact-email">
                Contact email
              </translate>
            </template>

            <character-count-input-standalone
              v-validate="rules.contact_email"
              :rules="rules.contact_email"
              data-vv-name="contact_email"
              data-vv-as="Contact email"
              get="getContactEmail"
              set="setContactEmail"
              namespace="project"
            />
          </custom-required-form-item>
        </el-col>
      </el-row>
      <div class="TeamArea">
        <custom-required-form-team-item
          v-model="team"
          :error="errors.first('team')"
          :draft-rule="draftRules.team"
          :publish-rule="publishRules.team"
          prepend-label="10"
        >
          <template slot="label">
            <translate key="team">
              Add team members (editors)--can modify entry on Add New Project
              page
            </translate>
            <tooltip
              :text="
                $gettext(
                  'Project editors can change and update all project information.'
                ) | translate
              "
            />
          </template>
          <team-selector
            v-model="team"
            v-validate="rules.team"
            data-vv-name="team"
            data-vv-as="Team"
          />
        </custom-required-form-team-item>
        <custom-required-form-team-item
          v-model="viewers"
          :error="errors.first('viewers')"
          :draft-rule="draftRules.viewers"
          :publish-rule="publishRules.viewers"
          prepend-label="11"
        >
          <template slot="label">
            <translate key="viewers">
              Add team members (viewers)--can receive notification that project
              has been added
            </translate>
            <tooltip
              :text="
                $gettext(
                  'Project viewers will be able to view the full project details.'
                ) | translate
              "
            />
          </template>
          <team-selector
            v-model="viewers"
            v-validate="rules.viewers"
            data-vv-name="viewers"
            data-vv-as="Viewers"
          />
        </custom-required-form-team-item>
      </div>
    </collapsible-card>
  </div>
</template>

<script>
import VeeValidationMixin from '../../mixins/VeeValidationMixin.js'
import ProjectFieldsetMixin from '../../mixins/ProjectFieldsetMixin.js'
import CollapsibleCard from '../CollapsibleCard'
import TeamSelector from '../TeamSelector'
import CountrySelect from '../../common/CountrySelect'
import OrganisationSelect from '../../common/OrganisationSelect'
import FormHint from '../FormHint'
import { mapGettersActions } from '../../../utilities/form'
import CustomRequiredFormTeamItem from '@/components/proxy/CustomRequiredFormTeamItem'
import FilterSwitch from '@/components/dashboard/FilterSwitch'
import Tooltip from '@/components/dashboard/Tooltip'
import DonorSelector from '../DonorSelector'
import AddRmButtons from '../AddRmButtons'

export default {
  components: {
    CollapsibleCard,
    CountrySelect,
    TeamSelector,
    OrganisationSelect,
    FormHint,
    CustomRequiredFormTeamItem,
    FilterSwitch,
    Tooltip,
    DonorSelector,
    AddRmButtons
  },
  mixins: [VeeValidationMixin, ProjectFieldsetMixin],
  computed: {
    ...mapGettersActions({
      organisation: ['project', 'getOrganisation', 'setOrganisation', 0],
      country: ['project', 'getCountry', 'setCountry', 0],
      team: ['project', 'getTeam', 'setTeam', 0],
      viewers: ['project', 'getViewers', 'setViewers', 0],
      implementing_partners: [
        'project',
        'getImplementingPartners',
        'setImplementingPartners',
        300,
        true
      ],
      donors: ['project', 'getDonors', 'setDonors', 0],
    }),
    isGlobal: {
      get () {
        return this.country === process.env.GlobalCountryID
      },
      set (val) {
        this.country = val ? process.env.GlobalCountryID : null
      }
    }
  },
  watch: {
    implementing_partners: {
      immediate: false,
      handler (ip, oldIp) {
        if (oldIp && ip && ip.length > oldIp.length) {
          this.$nextTick(() => {
            if (
              this.$refs.implementingPartnersInput &&
              this.$refs.implementingPartnersInput.length > 0
            ) {
              this.$refs.implementingPartnersInput[
                this.$refs.implementingPartnersInput.length - 1
              ].focus()
            }
          })
        }
      }
    }
  },
  methods: {
    isLastAndExist (collection, index) {
      return !!(collection.length - 1 === index && collection[index])
    },
    updateImplmeentingPartners (value, index) {
      const ip = [...this.implementing_partners]
      ip[index] = value
      this.implementing_partners = ip
    },
    addImplementingPartners () {
      const index = this.implementing_partners.length - 1
      if (this.isLastAndExist(this.implementing_partners, index)) {
        this.implementing_partners = [...this.implementing_partners, null]
      }
    },
    rmImplementingPartners (index) {
      this.implementing_partners = this.implementing_partners.filter(
        (ip, i) => i !== index
      )
    },
    async validate () {
      this.$refs.collapsible.expandCard()
      const validations = await Promise.all([this.$validator.validate()])
      return validations.reduce((a, c) => a && c, true)
    },
    async validateDraft () {
      this.$refs.collapsible.expandCard()
      const validations = await Promise.all([
        this.$validator.validate('name'),
        this.$validator.validate('country'),
        this.$validator.validate('contact_email'),
        this.$validator.validate('team')
      ])
      return validations.reduce((a, c) => a && c, true)
    }
  }
}
</script>

<style lang="less">
@import '~assets/style/variables.less';
@import '~assets/style/mixins.less';

.GeneralOverview {
  .CountrySelector {
    width: 50%;
  }
  .Date {
    width: 100% !important;
  }
  .FilterContainer {
    display: inline-flex;
    .FilterLabel {
      display: inline-block;
      width: 78px;
      color: #9d9d9d;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 20px;
      text-align: center;
    }
  }
  .ImplementingPartners {
    .el-row {
      margin-top: 20px;

      &:first-child {
        margin: 0;
      }
    }
  }
}
</style>
