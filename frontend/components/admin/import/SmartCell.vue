<template>
  <div
    :class="['SmartCell', {'Disabled': isDisabled, 'ValidationError': errorMessage}]"
    @click="clickHandler"
  >
    <el-tooltip
      :disabled="!errorMessage"
      class="item"
      effect="dark"
      :content="errorMessage"
      placement="top"
    >
      <div class="Content">
        <date-field
          v-if="isDate && active"
          v-model="internalValue"
          :disabled="disabled"
        />
        <el-input
          v-if="isTextArea && active"
          v-model="internalValue"
          :disabled="disabled"
          type="textarea"
          :rows="6"
        />
        <el-radio-group
          v-if="isGovInvestor && active"
          v-model="internalValue"
        >
          <el-radio :label="0">
            No, they have not yet contributed
          </el-radio>
          <el-radio :label="1">
            Yes, they are contributing in-kind people or time
          </el-radio>
          <el-radio :label="2">
            Yes, there is a financial contribution through MOH budget
          </el-radio>
        </el-radio-group>
        <template v-if="column && !isDate && !isTextArea">
          <ul v-if="parsedValue && parsedValue.names">
            <li
              v-for="(name, index) in parsedValue.names"
              :key="index"
            >
              {{ name }}
            </li>
          </ul>
        </template>
        <span v-else-if="!active">
          {{ value }}
        </span>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import DateField from '@/components/admin/import/DateField';
import { Validator } from 'vee-validate';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    DateField
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
      type: [String, Object],
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
    }
  },
  data () {
    return {
      active: false
    };
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries'
    }),
    ...mapState('system', {
      systemDicts: state => state
    }),
    ...mapState('projects', {
      projectDicts: state => state.projectStructure
    }),
    validator () {
      return new Validator();
    },
    internalValue: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('change', value);
      }
    },
    column () {
      if (this.type === null || !this.type.startsWith('MOH')) {
        return this.type;
      } else {
        return 'custom_field';
      }
    },
    isDate () {
      return ['start_date', 'end_date', 'implementation_dates'].includes(this.column);
    },
    isTextArea () {
      return ['geographic_scope', 'implementation_overview', 'name',
        'contact_name', 'contact_email', 'mobile_application',
        'wiki', 'repository', 'health_workers', 'clients', 'facilities'].includes(this.column);
    },
    isGovInvestor () {
      return this.column === 'government_investor';
    },
    isForced () {
      return ['country', 'donors'].includes(this.column);
    },
    isDisabled () {
      return this.isForced || this.disabled;
    },
    parsedValue () {
      const result = { names: Array.isArray(this.value) ? this.value : [this.value], ids: Array.isArray(this.value) ? this.value : [this.value] };
      if (!this.column) {
        return result;
      } else {
        const resolver = {
          organisation: () => this.findSystemValue('organisations'),
          platforms: () => this.findProjectCollectionValue('technology_platforms', true),
          digitalHealthInterventions: () => this.findProjectCollectionValue('strategies', true),
          health_focus_areas: () => this.findProjectCollectionValue('health_focus_areas', true, 'health_focus_areas'),
          hsc_challenges: () => this.findProjectCollectionValue('hsc_challenges', true, 'challenges'),
          his_bucket: () => this.findProjectCollectionValue('his_bucket', true),
          implementing_partners: this.stringArray,
          government_investor: () => {
            const labelLib = {
              'No, they have not yet contributed': 0,
              'Yes, they are contributing in-kind people or time': 1,
              'Yes, there is a financial contribution through MOH budget': 2
            };
            const value = Number.isInteger(this.value) ? this.value : labelLib[this.value];
            const label = !Number.isInteger(this.value) ? this.value : Object.keys(labelLib).find(k => labelLib[k] === this.value);
            return {
              ids: [value],
              names: [label]
            };
          },
          licenses: () => this.findProjectCollectionValue('licenses'),
          interoperability_links: () => this.findProjectCollectionValue('interoperability_links'),
          interoperability_standards: () => this.findProjectCollectionValue('interoperability_standards'),
          sub_level: () => {
            const value = Array.isArray(this.value) ? this.value[0] : this.value;
            const level = this.subLevels.find(cf => cf.id === value || cf.name === value);
            if (level) {
              return { names: [level.name], ids: [level.id] };
            }
            return { names: [], ids: [] };
          },
          custom_field: () => {
            const q = this.customFieldsLib[this.type];
            if (!q) {
              return { ids: [], names: [] };
            }
            if (q.type < 4) {
              return result;
            } else if (q.type >= 4) {
              const options = this.stringToArray(this.value);
              const filtered = options.filter(o => q.options.includes(o));
              return { ids: [...filtered], names: [...filtered] };
            }
          }
        };
        const res = resolver[this.column];
        return res ? res() : result;
      }
    },
    errorMessage () {
      const e = this.errors.find(e => e.field === this.column);
      return e ? e.msg : null;
    }
  },
  watch: {
    column: {
      immediate: true,
      handler (column) {
        this.validate();
      }
    },
    value: {
      immediate: true,
      handler (value) {
        this.validate();
      }
    }
  },
  methods: {
    async validate () {
      const { valid, errors } = await this.validator.verify(this.apiValue(), this.rules, { name: this.column });
      this.handleValidation(valid, errors[0], this.column);
    },
    clickHandler () {
      if (this.isDate || this.isDisabled || this.isTextArea || this.isCoverage || this.isGovInvestor) {
        this.active = true;
        return;
      }
      if (this.column) {
        this.$emit('openDialog', { value: this.parsedValue.ids, column: this.column, type: this.type });
      }
    },
    findCountryValue () {
      const country = this.countries.find(c => c.id === this.value);
      if (country) {
        return {
          ids: [country.id],
          names: [country.name]
        };
      }
    },
    stringToArray (value) {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === 'string') {
        if (value.includes(',')) {
          return value.split(',').map(v => v.trim());
        }
        return value.split(' ').map(v => v.trim());
      }
      return [value];
    },
    toInternalRepresentation (filtered) {
      return filtered.reduce((a, c) => {
        a.ids.push(c.id);
        a.names.push(c.name || c.challenge);
        return a;
      }, { names: [], ids: [] });
    },
    stringArray () {
      const filtered = this.stringToArray(this.value)
        .map(st => ({ id: st, name: st }));
      return this.toInternalRepresentation(filtered);
    },
    valueParser (isMultiple) {
      if (!Array.isArray(this.value)) {
        return isMultiple ? this.stringToArray(this.value) : [this.value];
      } else {
        return this.value;
      }
    },
    findSystemValue (collection, isMultiple) {
      const value = this.valueParser(isMultiple);
      const filtered = this.systemDicts[collection].filter(c => value.some(d => d === c.id || d === c.name));
      return this.toInternalRepresentation(filtered);
    },
    findProjectCollectionValue (collection, isMultiple, ...subValues) {
      const value = this.valueParser(isMultiple);
      let projectData = this.projectDicts[collection];
      if (subValues && Array.isArray(subValues)) {
        subValues.forEach(subKey => {
          projectData = projectData.reduce((a, c) => {
            a.push(...c[subKey]);
            return a;
          }, []);
        });
      }
      const filtered = projectData.filter(c => value.some(d => d === c.id || d === c.name || d === c.challenge));
      return this.toInternalRepresentation(filtered);
    },
    apiValue () {
      const isMultiple = ['platforms', 'implementing_partners', 'health_focus_areas', 'hsc_challenges', 'his_bucket', 'licenses', 'interoperability_standards', 'custom_field'];
      const isIds = [...isMultiple, 'donors', 'country', 'organisation', 'government_investor', 'sub_level'];
      const idsOrNames = isIds.includes(this.column) ? this.parsedValue.ids : this.parsedValue.names;
      return isMultiple.includes(this.column) ? idsOrNames : idsOrNames[0];
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

  .SmartCell {

    .Content {
      width: 100%;
      height: 100%;
    }

    &.Disabled {
      cursor: not-allowed;
    }

    &.ValidationError {
      background: pink;
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
