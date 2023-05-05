<template>
  <div v-if="headers.length > 0" class="Headers">
    <div v-if="internalValue.length > 0" class="Row">
      <div class="Column Thin Header Selected FlexCol">
        <slot :columns="columnState" />
      </div>

      <div
        v-for="(header, index) in internalValue"
        :key="index"
        class="Column Header"
        :class="{'Selected': header.selected}"
      >
        <div class="Title">
          {{ header.title }}
        </div>
        <el-tooltip effect="dark" content="Remove this column" placement="top">
          <el-button
            title="Remove column"
            class="ColumnButton Delete"
            size="mini"
            type="text"
            @click="rmHeader(index)"
          >
            <!-- <fa icon="times" /> -->
            <fa :icon="['far', 'trash-alt']" />
          </el-button>
        </el-tooltip>
        <el-select
          v-model="header.selected"
          class="HeaderSelect"
          size="mini"
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
          <fa icon="info" />
          <translate>Select an header to create a new column</translate>
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
  </div>
</template>

<script>
import { projectFields } from '@/utilities/projects'

const blackList = ['coverage', 'national_level_deployment',
  'coverageData', 'coverageType', 'coverage_second_level', 'interoperability_links', 'team', 'viewers']
const addendumFields = ['clients', 'health_workers', 'facilities', 'sub_level']

const isSubset = (fieldTitle, words) => {
  if (words.length < fieldTitle.length) return false
  return fieldTitle.every(element => words.includes(element))
}

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
    customFieldsLib: {
      type: Object,
      default: () => ({})
    },
    nameMapping: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      internalValue: null,
      additonalHeader: null,
      smartHeaderMap: {
        name: {
          title: 'Project Name',
          check: (words) => isSubset(['project','name'], words)
        },
        country: {
          title: 'Country',
          check: (words) => words.includes('country')
        },
        donors: {
          title: 'Investors',
          check: (words) => words.includes('investor')
        },
        organisation: {
          title: 'Organisation',
          check: (words) => words.includes('organisation')
        },
        geographic_scope: {
          title: 'Geographic Scope',
          check: (words) => isSubset(['geographic','scope'], words)
        },
        implementation_overview: {
          title: 'Narrative of the project',
          check: (words) => isSubset(['narrative','project'], words)
        },
        start_date: {
          title: 'Start Date',
          check: (words) => isSubset(['start','date'], words)
        },
        end_date: {
          title: 'End Date',
          check: (words) => isSubset(['end','date'], words)
        },
        end_date_note: {
          title: 'End Date Note',
          check: (words) => isSubset(['end','date','note'], words)
        },
        contact_name: {
          title: 'Contact name',
          check: (words) => isSubset(['contact','name'], words)
        },
        contact_email: {
          title: 'Contact email',
          check: (words) => isSubset(['contact','email'], words)
        },
        software: {
          title: 'Software',
          check: (words) => words.includes('software')
        },
        health_focus_areas: {
          title: 'Health Focus Areas',
          check: (words) => isSubset(['health','focus'], words)
        },
        hsc_challenges: {
          title: 'Health System Challenges',
          check: (words) => isSubset(['health','challenges'], words)
        },
        his_bucket: {
          title: 'Health Information Systems',
          check: (words) => isSubset(['health','information'], words)
        },
        government_investor: {
          title: 'Government Contribution',
          check: (words) => words.includes('contribution')
        },
        implementing_partners: {
          title: 'Partners',
          check: (words) => words.includes('partners')
        },
        implementing_team: {
          title: 'Team',
          check: (words) => words.includes('team')
        },
        implementing_viewers: {
          title: 'Viewers',
          check: (words) => words.includes('viewers')
        },
        implementation_dates: {
          title: 'Technology Deployment Date',
          check: (words) => isSubset(['deployment','date'], words)
        },
        licenses: {
          title: 'Licenses',
          check: (words) => words.includes('licenses')
        },
        repository: {
          title: 'Link to Code documentation',
          check: (words) => isSubset(['code','documentation'], words)
        },
        wiki: {
          title: 'Link to Wiki',
          check: (words) => words.includes('wiki')
        },
        mobile_application: {
          title: 'Link to application',
          check: (words) => words.includes('application')
        },
        interoperability_links: {
          title: 'Interoperability Links',
          check: (words) => isSubset(['interoperability','links'], words)
        },
        interoperability_standards: {
          title: 'Interoperability Standards',
          check: (words) => isSubset(['interoperability','standards'], words)
        },
        health_workers: {
          title: 'Health Workers',
          check: (words) => isSubset(['health','workers'], words)
        },
        clients: {
          title: 'Clients',
          check: (words) => words.includes('clients')
        },
        facilities: {
          title: 'Facilities',
          check: (words) => words.includes('facilities')
        },
        sub_level: {
          title: 'Coverage Type',
          check: (words) => words.includes('coverage')
        },
        digitalHealthInterventions: {
          title: 'Digital Health Interventions',
          check: (words) => isSubset(['health','interventions'], words)
        },
        hsc_challenges_other: {
          title: 'Health System Challenges other',
          check: (words) => false
        },
        research: {
          title: 'Research',
          check: (words) => false
        },
      }
    }
  },
  mounted() {
    this.matchHeaders()
  },
  computed: {
    fields () {
      return [
        ...Object.keys(projectFields()).filter(k => !blackList.includes(k)),
        ...addendumFields,
        ...Object.keys(this.customFieldsLib)
      ]
    },
    notUsedFields () {
      const selected = this.headers.map(h => h.selected).filter(s => s)
      return this.fields.filter(f => !selected.includes(f)).map(f => {
        return {
          label: this.nameMapping[f] || f,
          value: f
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    },
    columnState () {
      return {
        selected: this.headers.filter(c => c.selected).length,
        count: this.headers.length
      }
    }
  },
  watch: {
    headers: {
      immediate: true,
      handler (headers) {
        this.internalValue = headers.map(h => ({ ...h }))
      }
    },
    additonalHeader: {
      immediate: false,
      handler (column) {
        if (column) {
          const mappeName = this.nameMapping[column]
          this.internalValue.push({ selected: column, title: mappeName || column })
          this.additonalHeader = null
          this.columnChange()
        }
      }
    }
  },
  methods: {
    async rmHeader (index) {
      try {
        await this.$confirm(
          this.$gettext('Are you sure? this operation is not reversible'),
          this.$gettext('Column Delete'),
          {
            confirmButtonText: this.$gettext('OK'),
            cancelButtonText: this.$gettext('Cancel'),
            type: 'warning'
          })
        this.$delete(this.internalValue, index)
        this.columnChange()
      } catch (e) {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      }
    },
    availableFields (value) {
      if (value && !this.notUsedFields.some(f => f.value === value)) {
        return [{ label: this.nameMapping[value] || value, value }, ...this.notUsedFields]
      }
      return this.notUsedFields
    },
    async columnChange () {
      const { data } = await this.$axios.patch(`/api/projects/import/${this.id}/`, { header_mapping: this.internalValue })
      this.$emit('update:headers', data.header_mapping)
    },
    smartFieldMatch(column) {
      // 2. try match the exact title (based on template)
      let fieldFound = this.notUsedFields.find(f => f.label === column)
      if (!fieldFound) {
        // 3. run through notUsedFields and run the check() function of corresponding smartHeaderMap
        const words = column.toLowerCase().split(/[\s_]+/)
        fieldFound = this.notUsedFields.find(field => this.smartHeaderMap[field.value].check(words))
      }
      return fieldFound
    },
    matchHeaders() {
      let hasMapped = false
      // 1. filter the unselected fields, then try to match them
      this.internalValue.filter(f => !f.selected && !f.title.includes('__EMPTY')).forEach(column => {
        const fieldMatch = this.smartFieldMatch(column.title)
        if (fieldMatch) {
          column.selected = fieldMatch.value
          hasMapped = true
        }
      })
      if (hasMapped) this.columnChange()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";

.Headers {
  position: sticky;
  top:0;
  z-index: 10;

  .Row {
    .Column {
      &.Header {
        border-width: 1px 1px 2px 0;
        border-bottom: 2px solid #DDE0E7;
        position: relative;
        background-color: @colorBrandBlueLight;
        filter: grayscale(1);
        z-index: 10;
        overflow: hidden;
        /* &::before {
          content: '';
          z-index: -1;
          position: absolute;
          inset: 0;
          background-color: white;
          opacity: 1;
        } */

        &.Selected {
          filter: none;
        }
        &.FlexCol {
          flex-direction: column;
          justify-content: center;
        }

        &:first-child {
          border-width: 1px;
        }
        &:hover {
          filter: none;
          .ColumnButton {
            display: initial;
          }
        }
      }
    }
  }

  /* .Title {
    margin-right: 8px;
  } */

  .ColumnButton {
    display: none;
    position: absolute;
    top: 8px;
    padding: 2px 6px;
    &.Reset {
      right: 38px;
      color: @colorTextPrimary;
      &:hover {
        background-color: @colorTextPrimary;
        color: white;
      }
    }
    &.Delete {
      right: 12px;
      color: @colorDanger;
      &:hover {
        background-color: @colorDanger;
        color: white;
      }
    }
  }

  .HeaderSelect{
    width: 100%;
  }
  /* .HeaderSelect{
    position: absolute;
    bottom: 4px;
    left: 3.5px;
    width: 192px;
  } */
}
</style>
