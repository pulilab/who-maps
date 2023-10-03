<template>
  <div
    :class="['SmartCell', {
      'Disabled': isDisabled,
      'ValidationError': errorMessage,
      'ParsingError': parsingFailed && !isRequired
    }]"
    @click="clickHandler"
  >
    <div v-if="shown" class="Content" :class="{'Country': isCountry}">
      <template v-if="column">
        <div v-if="active">
          <el-input-number
            v-if="isNumber"
            v-model="internalValue"
            :disabled="disabled"
          />
          <date-field
            v-if="isDate"
            v-model="internalValue"
            :disabled="disabled"
          />
          <el-input
            v-if="isTextArea"
            v-model="internalValue"
            :disabled="disabled"
            type="textarea"
            :rows="8"
          />
          <el-radio-group
            v-if="isGovInvestor"
            v-model="internalValue"
          >
            <el-radio :label="0">
              <translate>
                No, they have not yet contributed
              </translate>
            </el-radio>
            <el-radio :label="1">
              <translate>
                Yes, they are contributing in-kind people or time
              </translate>
            </el-radio>
            <el-radio :label="2">
              <translate>
                Yes, there is a financial contribution through MOH budget
              </translate>
            </el-radio>
            <el-radio :label="3">
              <translate>
                Yes, MOH is fully funding the project
              </translate>
            </el-radio>
          </el-radio-group>
        </div>

        <template v-else-if="isDate">
          {{ showDate }}
        </template>

        <template v-else-if="isCountry">
          <country-flag :code="countryDetails.code" :small="true"/>
          <span v-if="countryDetails.name">{{ countryDetails.name }}</span>
        </template>

        <template v-else-if="isTextArea">
          {{ internalValue }}
        </template>

        <template v-else-if="isGovInvestor">
          {{ parsedValue.ids[0] !== undefined ? investedList[parsedValue.ids[0]] : internalValue }}
        </template>

        <template v-else-if="isLicenseChoice">
          {{ parsedValue.ids[0] !== undefined ? licenseChoices[parsedValue.ids[0]-1] : licenseChoices[internalValue-1] }}
        </template>

        <template v-else-if="isLicenseChoiceAlt">
          {{ parsedValue.ids[0] !== undefined ? licenseChoicesAlt[parsedValue.ids[0]-1] : licenseChoicesAlt[internalValue-1] }}
        </template>

        <template v-else-if="isOrganisation">
          {{ organisationValue }}
        </template>

        <template v-else-if="parsedValue && parsedValue.names && !isCountry">
          <ul class="ParsedList">
            <li v-for="(name, index) in parsedValue.names" :key="index">
              {{ name }}
            </li>
          </ul>
        </template>
      </template>
      <template v-if="!column">
        {{ value }}
      </template>
      <template v-if="parsingFailed && !isOrganisation">
        <span class="OriginalValue">{{ original }}</span>
      </template>
    </div>
    <div v-else>
      {{ value }}
    </div>
    <div v-if="(errorMessage || parsingFailed) && !active" class="ErrorOverlay">
      <span v-if="errorMessage && !parsingFailed">
        {{ errorMessage }}
      </span>
      <span v-if="parsingFailed">
        <translate>
          Failed to parse your data, click to manually fix
        </translate>
      </span>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utilities/projects'
import DateField from '@/components/admin/import/DateField'
import CountryFlag from '@/components/common/CountryFlag'
import { Validator } from 'vee-validate'
import { mapState } from 'vuex'

const governmentContributions = {
  'no they have not yet contributed': 0,
  'yes they are contributing inkind people or time': 1,
  'yes there is a financial contribution through moh budget': 2,
  'yes moh is fully funding the project': 3
}

const licenseChoices = {
  'yes': 1,
  'yes  with restrictions': 2,
  'no': 3
}

const licenseChoicesAlt = {
  'yes': 1,
  'partially': 2,
  'no': 3
}

export default {
  components: {
    DateField,
    CountryFlag
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: null,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object,
      default: null
    },
    errors: {
      type: Array,
      default: () => []
    },
    handleValidation: {
      type: Function,
      default: () => {}
    },
    subLevels: {
      type: Array,
      default: () => []
    },
    customFieldsLib: {
      type: Object,
      default: () => ({})
    },
    original: {
      type: null,
      default: null
    },
    nameMapping: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      shown: true,
      active: false,
      investedList: [
        this.$gettext('No, they have not yet contributed'),
        this.$gettext('Yes, they are contributing in-kind people or time'),
        this.$gettext('Yes, there is a financial contribution through MOH budget'),
        this.$gettext('Yes, MOH is fully funding the project')
      ],
      licenseChoices: [
        this.$gettext('Yes'),
        this.$gettext('Yes - With restrictions'),
        this.$gettext('No')
      ],
      licenseChoicesAlt: [
        this.$gettext('Yes'),
        this.$gettext('Partially'),
        this.$gettext('No')
      ],
    }
  },
  computed: {
    ...mapState('system', {
      systemDicts: state => state
    }),
    ...mapState('projects', {
      projectDicts: state => state.projectStructure
    }),
    validator () {
      return new Validator()
    },
    internalValue: {
      get () {
        if (this.isDate) return new Date(this.value)
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    column () {
      if (this.type === null || (!this.type.startsWith('MOH') && !this.type.startsWith('INV'))) {
        return this.type
      } else {
        return 'custom_field'
      }
    },
    isRequired () {
      return !!this.rules?.required
    },
    isNumber () {
      return ['health_workers', 'clients', 'facilities'].includes(this.column)
    },
    isDate () {
      return ['start_date', 'end_date', 'implementation_dates'].includes(this.column)
    },
    showDate () {
      return this.isDate ? formatDate(this.internalValue) : ''
    },
    isCountry () {
      return this.column === 'country'
    },
    isOrganisation () {
      return this.column === 'organisation'
    },
    isTeam () {
      return this.column === 'implementing_team'
    },
    countryDetails () {
      let country = null
      if (this.isCountry && this.value) {
        country = this.systemDicts.countries.find(c => c.id === this.parsedValue.ids[0])
        if (!country) {
          country = {
            id: 0,
            code: 'UC',
            name: ''
          }
        }
      } else {
        country = {
          id: 0,
          code: 'UC',
          name: ''
        }
      }
      return country
    },
    isTextArea () {
      return ['geographic_scope', 'implementation_overview', 'name',
        'contact_name', 'contact_email', 'mobile_application',
        'wiki', 'repository'].includes(this.column)
    },
    isGovInvestor () {
      return this.column === 'government_investor'
    },
    isLicenseChoice () {
      return this.column === 'zero_cost' || this.column === 'is_customizable' || this.column === 'free_replication'
    },
    isLicenseChoiceAlt () {
      return this.column === 'codebase_accessible'
    },
    isDisabled () {
      return !this.column || this.disabled
    },
    parsedValue () {
      const result = { names: Array.isArray(this.value) ? this.value : [this.value], ids: Array.isArray(this.value) ? this.value : [this.value] }
      if (!this.column) {
        return result
      } else {
        const resolver = {
          country: () => this.findSystemValue('countries'),
          donors: () => this.findSystemValue('donors', true),
          organisation: () => this.findSystemValue('organisations'),
          software: () => this.findProjectCollectionValue('technology_platforms', true),
          digitalHealthInterventions: () => this.findProjectCollectionValue('strategies', true, 'subGroups', 'strategies'),
          health_focus_areas: () => this.findProjectCollectionValue('health_focus_areas', true, 'health_focus_areas'),
          hsc_challenges: () => this.findProjectCollectionValue('hsc_challenges', true, 'challenges'),
          his_bucket: () => this.findProjectCollectionValue('his_bucket', true),
          implementing_partners: this.stringArray,
          implementing_team: () => this.parseTeamEmails(),
          implementing_viewers: this.stringArray,
          implementation_dates: () => this.parseDate(),
          start_date: () => this.parseDate(),
          end_date: () => this.parseDate(),
          government_investor: () => this.enumParser(governmentContributions),
          zero_cost: () => this.enumParser(licenseChoices),
          codebase_accessible : () => this.enumParser(licenseChoicesAlt),
          is_customizable: () => this.enumParser(licenseChoices),
          free_replication : () => this.enumParser(licenseChoices),
          osi_licenses: () => this.findProjectCollectionValue('osi_licenses', true),
          interoperability_links: () => this.findProjectCollectionValue('interoperability_links'),
          interoperability_standards: () => this.findProjectCollectionValue('interoperability_standards', true, 'standards'),
          sub_level: () => {
            const value = Array.isArray(this.value) ? this.value[0] : this.value
            const level = this.subLevels.find(cf => cf.id === value || cf.name === value)
            if (level) {
              return { names: [level.name], ids: [level.id] }
            }
            return { names: [], ids: [] }
          },
          custom_field: () => {
            const q = this.customFieldsLib[this.type]
            if (!q) {
              return { ids: [], names: [] }
            }
            if (q.type < 4) {
              return result
            } else if (q.type >= 4) {
              const options = this.stringToArray(this.value)
              const filtered = options.filter(o => q.options.includes(o))
              return { ids: [...filtered], names: [...filtered] }
            }
          }
        }
        const res = resolver[this.column]
        return res ? res() : result
      }
    },
    parsingFailed () {
      return this.value && this.column && this.parsedValue?.ids?.length === 0 && isNaN(this.value) && !this.isOrganisation && !this.isTeam
    },
    errorMessage () {
      const e = this.errors.find(e => e.field === this.column)
      return e ? e.msg : null
    },
    organisationValue() {
      return Array.isArray(this.internalValue) ? this.parsedValue.names[0] : this.internalValue
    }
  },
  watch: {
    column: {
      immediate: true,
      handler (column) {
        this.validate()
      }
    },
    value: {
      immediate: true,
      handler (value) {
        this.validate()
      }
    }
  },
  methods: {
    async validate () {
      const name = this.nameMapping[this.column] || this.column
      const { valid, errors } = await this.validator.verify(this.apiValue(), this.rules, { name })
      this.handleValidation(valid, errors[0], this.column)
    },
    clickHandler () {
      if (!this.shown) {
        this.shown = true
        return
      }
      this.shown = true
      if (this.isNumber || this.isDate || this.isDisabled || this.isTextArea || this.isCoverage || this.isGovInvestor) {
        this.active = true
        return
      }
      if (this.column) {
        this.$emit('openDialog', { value: this.parsedValue.ids, column: this.column, type: this.type })
      }
    },
    isEnumSelected(val) {


    },
    parseDate () {
      const result = this.value ? new Date(this.value) : null
      return {
        ids: [result],
        names: [result]
      }
    },
    parseTeamEmails () {
      const value = this.value !== '' ?  this.valueParser(true) : ''
      return value ? this.stringArray(value) : {ids: [], names: []}
    },
    stringToArray (value) {
      if (Array.isArray(value)) {
        return value
      }
      if (typeof value === 'string') {
        return value.split('|').map(v => v.trim())
      }
      return [value]
    },
    toInternalRepresentation (filtered) {
      return filtered.reduce((a, c) => {
        a.ids.push(c.id)
        a.names.push(c.challenge || c.name)
        return a
      }, { names: [], ids: [] })
    },
    stringArray () {
      const filtered = this.stringToArray(this.value)
        .map(st => ({ id: st, name: st }))
      return this.toInternalRepresentation(filtered)
    },
    enumParser(obj) {
      const parsed = {
        ids: [],
        names: []
      }
      if (typeof this.value === 'string') {
        const cleaned = ('' + this.value).trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').toLowerCase()
        parsed.ids[0] = obj[cleaned]
        parsed.names[0] = Object.keys(obj).find(k => obj[k] === this.value)
      } else {
        parsed.ids[0] = Array.isArray(this.value) ? this.value[0] : this.value
        parsed.names[0] = Object.keys(obj).find(k => obj[k] === this.value)
      }
      return parsed
    },
    valueParser (isMultiple) {
      if (!Array.isArray(this.value)) {
        return isMultiple ? this.stringToArray(this.value) : [this.value]
      } else {
        return this.value
      }
    },
    findSystemValue (collection, isMultiple) {
      const value = this.valueParser(isMultiple)
      const filtered = this.systemDicts[collection].filter(c => value.some(d => d === c.id || d === c.name))
      return this.toInternalRepresentation(filtered)
    },
    findProjectCollectionValue (collection, isMultiple, ...subValues) {
      const value = this.valueParser(isMultiple)
      let projectData = this.projectDicts[collection]
      if (subValues && Array.isArray(subValues)) {
        subValues.forEach(subKey => {
          projectData = projectData.reduce((a, c) => {
            a.push(...c[subKey])
            return a
          }, [])
        })
      }
      const filtered = projectData.filter(c => value.some(d => d === c.id || d === c.name || d === c.challenge))
      return this.toInternalRepresentation(filtered)
    },
    apiValue () {
      const isMultiple = ['donors', 'software', 'implementing_partners', 'health_focus_areas', 'hsc_challenges', 'his_bucket', 'osi_licenses', 'interoperability_standards', 'custom_field', 'digitalHealthInterventions', 'implementing_team', 'implementing_viewers']
      const isIds = [...isMultiple, 'country', 'organisation', 'government_investor', 'zero_cost', 'codebase_accessible', 'is_customizable', 'free_replication', 'sub_level']
      const idsOrNames = isIds.includes(this.column) ? this.parsedValue.ids : this.parsedValue.names
      return isMultiple.includes(this.column) ? idsOrNames : idsOrNames[0]
    }
  }
}
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

  .SmartCell {
    position: relative;
    cursor: pointer;

    .Content {
      width: 100%;
      height: 100%;

      &.Country {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ParsedList{
        list-style: none;
        padding-left: 0;
      }
    }

    .ErrorOverlay {
      padding: 2px;
      opacity: 0;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      transition: all 0.3s ease-in;
      background-color: #F5F5F5;
    }

    &:hover {
      box-shadow: inset 0 0 1px 1px silver;
      .ErrorOverlay {
        opacity: 1;
      }
    }

    &.Disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &.ValidationError {
      border: 2px solid @colorDanger !important;

      .ErrorOverlay {
        background-color: @colorDanger;
        color: @colorWhite;
        font-weight: 500;
      }
    }

    &.ParsingError {
      border: 2px solid @colorDraft !important;

      .ErrorOverlay {
        background-color: @colorDraft;
      }
    }

    .OriginalValue {
      font-style: italic;
    }

    .el-textarea {
      textarea {
        font-size: @fontSizeSmall;
      }
    }

    ul {
      margin: 0;
      padding-left: 20px;
    }
  }
</style>
