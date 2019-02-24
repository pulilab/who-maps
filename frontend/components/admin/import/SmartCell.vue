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
      <span v-if="!active">
        {{ value }}
      </span>

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
      <template v-if="column && !isDate && !isTextArea">
        <ul v-if="parsedValue && parsedValue.names">
          <li
            v-for="name in parsedValue.names"
            :key="name"
          >
            {{ name }}
          </li>
        </ul>
      </template>
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
    column: {
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
    isDate () {
      return ['start_date', 'end_date', 'implementation_dates'].includes(this.column);
    },
    isTextArea () {
      return ['geographic_scope', 'implementation_overview', 'name',
        'contact_name', 'contact_email', 'mobile_application',
        'wiki', 'repository', 'health_workers', 'clients', 'facilities'].includes(this.column);
    },
    isCoverage () {
      return this.column === 'national_level_deployment';
    },
    isForced () {
      return ['country', 'donors'].includes(this.column);
    },
    isDisabled () {
      return this.isForced || this.disabled;
    },
    parsedValue () {
      const result = { names: [this.value], ids: [this.value] };
      if (!this.column) {
        return result;
      } else {
        const resolver = {
          organisation: () => this.findSystemValue('organisations'),
          // country: this.findCountryValue,
          // team: () => this.findSystemValue('profiles', true),
          // viewers: () => this.findSystemValue('profiles', true),
          platforms: () => this.findProjectCollectionValue('technology_platforms', true),
          digitalHealthInterventions: () => this.findProjectCollectionValue('strategies', true),
          health_focus_areas: () => this.findProjectCollectionValue('health_focus_areas', true, 'health_focus_areas'),
          hsc_challenges: () => this.findProjectCollectionValue('hsc_challenges', true, 'challenges'),
          his_bucket: () => this.findProjectCollectionValue('his_bucket', true),
          implementing_partners: this.stringArray,
          // coverage: [],
          // coverageData: {},
          // coverage_second_level: [],
          // national_level_deployment: {
          //   health_workers: 0,
          //   clients: 0,
          //   facilities: 0
          // },
          // donors: () => this.findSystemValue('donors', true),
          licenses: () => this.findProjectCollectionValue('licenses'),
          interoperability_links: () => this.findProjectCollectionValue('interoperability_links'),
          interoperability_standards: () => this.findProjectCollectionValue('interoperability_standards')
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
      const { valid, errors } = await this.validator.verify(this.value, this.rules, { name: this.column });
      this.handleValidation(valid, errors[0], this.column);
    },
    clickHandler () {
      if (this.isDate || this.isDisabled || this.isTextArea || this.isCoverage) {
        this.active = true;
        return;
      }
      if (this.column) {
        this.$emit('openDialog', { value: this.parsedValue.ids, column: this.column });
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
      return value.split(',').map(v => v.trim());
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
      const isMultiple = ['donors', 'implementing_partners'];
      const isIds = ['donors', 'country', 'organisation'];
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
