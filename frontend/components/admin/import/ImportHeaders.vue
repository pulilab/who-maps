<template>
  <div
    v-if="internalValue.length > 0"
    class="Row Headers"
  >
    <div class="Column Thin">
      <slot />
    </div>

    <div
      v-for="(header, index) in internalValue"
      :key="index"
      class="Column Header"
    >
      <div class="Title">
        {{ header.title }}
      </div>
      <el-button
        class="DeleteColumnButton"
        size="mini"
        @click="rmHeader(index)"
      >
        <fa icon="times" />
      </el-button>
      <el-select
        v-model="header.selected"
        class="HeaderSelect"
        size="small"
        filterable
        clearable
        @change="columnChange(header)"
      >
        <el-option
          v-for="item in availableFields(header.selected)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div class="Column Header">
      <div class="Title">
        Empty Column
      </div>
      <div>
        <el-select
          v-model="additonalHeader"
          class="HeaderSelect"
          size="small"
          filterable
          clearable
        >
          <el-option
            v-for="item in notUsedFields"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFields } from '@/utilities/projects';

const blackList = ['country', 'donors', 'coverage', 'national_level_deployment',
  'coverageData', 'team', 'viewers', 'coverageType', 'digitalHealthInterventions', 'coverage_second_level', 'interoperability_links'];
const addendumFields = ['clients', 'health_workers', 'facilities', 'sub_level'];
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    id: {
      type: [Number, String],
      default: null
    },
    countryFieldsLib: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      internalValue: null,
      additonalHeader: null
    };
  },
  computed: {
    fields () {
      return [
        ...Object.keys(projectFields()).filter(k => !blackList.includes(k)),
        ...addendumFields,
        ...Object.keys(this.countryFieldsLib)
      ];
    },
    nameMapping () {
      return {
        name: 'Project Name',
        organisation: 'Organisation',
        geographic_scope: 'Geographic Scope',
        implementation_overview: 'Narrative of the project',
        start_date: 'Start Date',
        end_date: 'End Date',
        contact_name: 'Contact name',
        contact_email: 'Contact email',
        platforms: 'Software',
        health_focus_areas: 'Health Focus Areas',
        hsc_challenges: 'Health System Challenges',
        his_bucket: 'Health Information Systems',
        government_investor: 'Governament Contribution',
        implementing_partners: 'Partners',
        implementation_dates: 'Technology Deployment Date',
        licenses: 'Licenses',
        repository: 'Link to Code documentation',
        wiki: 'Link to Wiki',
        mobile_application: 'Link to application',
        interoperability_links: 'Interoperability Links',
        interoperability_standards: 'Interoperability Standards',
        health_workers: 'Health Workers',
        clients: 'Clients',
        facilities: 'Facilities',
        sub_level: 'Coverage Type'

      };
    },
    notUsedFields () {
      const selected = this.headers.map(h => h.selected).filter(s => s);
      return this.fields.filter(f => !selected.includes(f)).map(f => {
        return {
          label: this.nameMapping[f] || f,
          value: f
        };
      }).sort((a, b) => a.label.localeCompare(b.label));
    }
  },
  watch: {
    headers: {
      immediate: true,
      handler (headers) {
        this.internalValue = headers.map(h => ({ ...h }));
      }
    },
    additonalHeader: {
      immediate: false,
      handler (column) {
        if (column) {
          const mappeName = this.nameMapping[column];
          this.internalValue.push({ selected: column, title: mappeName || column });
          this.additonalHeader = null;
          this.columnChange();
        }
      }
    }
  },
  methods: {
    rmHeader (index) {
      this.$delete(this.internalValue, index);
      this.columnChange();
    },
    availableFields (value) {
      if (value) {
        return Array.from(new Set([ { label: this.nameMapping[value] || value, value }, ...this.notUsedFields ]));
      }
      return this.notUsedFields;
    },
    async columnChange () {
      const { data } = await this.$axios.patch(`/api/projects/import/${this.id}/`, { header_mapping: this.internalValue });
      this.$emit('update:headers', data.header_mapping);
    }
  }
};
</script>

<style lang="less">
.Headers {
  .Column.Header {
    position: relative;
  }
  .Title {
    margin-right: 8px;
  }
  .DeleteColumnButton {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px 4px;
  }
  .HeaderSelect{
    position: absolute;
    bottom: 4px;
  }
}
</style>
