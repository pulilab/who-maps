<template>
  <div
    :class="['SmartCell', {'Disabled': isForced}]"
    @click="openDialog"
  >
    <span v-if="!column">
      {{ value }}
    </span>
    <date-field
      v-if="isDate"
      v-model="internalValue"
    />
    <el-input
      v-if="isTextArea"
      v-model="internalValue"
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
  </div>
</template>

<script>
import DateField from '@/components/admin/import/DateField';
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
    }
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries'
    }),
    ...mapState('system', {
      systemDicts: state => state
    }),
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
      return ['geographic_scope', 'implementation_overview'].includes(this.column);
    },
    isForced () {
      return ['country', 'donors'].includes(this.column);
    },
    parsedValue () {
      const result = { names: [this.value], ids: [this.value] };
      if (!this.column) {
        return result;
      } else {
        const resolver = {
          organisation: () => this.findSystemValue('organisations'),
          country: this.findCountryValue,
          team: () => this.findSystemValue('profiles', true),
          viewers: () => this.findSystemValue('profiles', true),
          platforms: () => this.findProjectCollectionValue(''),
          digitalHealthInterventions: () => this.findProjectCollectionValue(''),
          health_focus_areas: () => this.findProjectCollectionValue(''),
          hsc_challenges: () => this.findProjectCollectionValue(''),
          his_bucket: () => this.findProjectCollectionValue(''),
          implementing_partners: this.stringArray,
          // coverage: [],
          // coverageData: {},
          // coverage_second_level: [],
          // national_level_deployment: {
          //   health_workers: 0,
          //   clients: 0,
          //   facilities: 0
          // },
          donors: () => this.findSystemValue('donors', true),
          licenses: () => this.findProjectCollectionValue(''),
          interoperability_links: () => this.findProjectCollectionValue(''),
          interoperability_standards: () => this.findProjectCollectionValu('')
        };
        const res = resolver[this.column];
        return res ? res() : result;
      }
    }
  },
  methods: {
    openDialog () {
      if (this.isDate || this.isForced || this.isTextArea) {
        return;
      }
      if (this.column) {
        this.$emit('openDialog', { value: this.parsedValue.ids, column: this.column });
      }
    },
    findCountryValue () {
      const country = this.countries.find(c => c.id === this.value);
      return {
        ids: [country.id],
        names: [country.name]
      };
    },
    stringToArray (value) {
      return value.split(',').map(v => v.trim());
    },
    toInternalRepresentation (filtered) {
      return filtered.reduce((a, c) => {
        a.ids.push(c.id);
        a.names.push(c.name);
        return a;
      }, { names: [], ids: [] });
    },
    stringArray () {
      const filtered = this.stringToArray(this.value)
        .map(st => ({ id: st, name: st }));
      return this.toInternalRepresentation(filtered);
    },
    findSystemValue (collection, isMultiple) {
      let value = null;
      if (!Array.isArray(this.value)) {
        value = isMultiple ? this.stringToArray(this.value) : [this.value];
      } else {
        value = this.value;
      }
      const filtered = this.systemDicts[collection].filter(c => value.some(d => d === c.id || d === c.name));
      return this.toInternalRepresentation(filtered);
    },
    findProjectCollectionValue () {
      return this.countries.find(c => c.name === this.value);
    }
  }
};
</script>

<style lang="less">
  .SmartCell {
    &.Disabled {
      cursor: not-allowed;
    }
  }
</style>
