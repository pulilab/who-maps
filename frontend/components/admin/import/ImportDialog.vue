<template>
  <el-dialog
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    title="Select"
    width="80%"
  >
    <el-row type="flex">
      <el-col :span="12">
        <h3>Original Data</h3>
        {{ dialogData.original }}
      </el-col>
      <el-col :span="12">
        <h3>Edit</h3>
        <organisation-select
          v-if="dialogData.column === 'organisation'"
          v-model="dialogData.value[0]"
          :auto-save="true"
        />
        <his-bucket-selector
          v-if="dialogData.column === 'his_bucket'"
          v-model="dialogData.value"
        />
        <health-system-challenges-selector
          v-if="dialogData.column === 'hsc_challenges'"
          v-model="dialogData.value"
        />
        <health-focus-areas-selector
          v-if="dialogData.column === 'health_focus_areas'"
          v-model="dialogData.value"
        />
        <template v-if="dialogData.column === 'implementing_partners'">
          <div
            v-for="(p, index) in dialogData.value"
            :key="index"
          >
            <el-input v-model="dialogData.value[index]" />
          </div>
          <el-button @click="dialogData.value.push(null)">
            Add more
          </el-button>
        </template>
        <template v-if="dialogData.column === 'platforms'">
          <div
            v-for="(element, index) in dialogData.value"
            :key="index"
          >
            <platform-selector
              v-model="dialogData.value"
              :index="index"
            />
          </div>
          <el-button @click="dialogData.value.push(null)">
            Add more
          </el-button>
        </template>

        <template v-if="dialogData.column === 'sub_level'">
          <el-select v-model="dialogData.value[0]">
            <el-option
              v-for="item in subLevels"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template>

        <div
          v-if="dialogData.column === 'custom_field'"
          ref="custom_fields"
        >
          <el-input
            v-if="dialogData.customField.type < 3"
            v-model="dialogData.value[0]"
          />

          <el-radio-group
            v-if="dialogData.customField.type === 3"
            v-model="dialogData.value[0]"
          >
            <el-radio label="yes">
              <translate>Yes</translate>
            </el-radio>
            <el-radio label="no">
              <translate>No</translate>
            </el-radio>
          </el-radio-group>

          <template v-if="dialogData.customField.type === 4 && dialogData.customField.options">
            <el-select
              v-model="dialogData.value[0]"
              :placeholder="$gettext('Select from list') | translate"
              filterable
              popper-class="CustomFieldSelectorDropdown"
              class="CustomFieldSelector"
            >
              <el-option
                v-for="(opt, index) in dialogData.customField.options"
                :key="index"
                :value="opt"
              />
            </el-select>
          </template>
          <template v-if="dialogData.customField.type === 5 && dialogData.customField.options">
            <el-select
              v-model="dialogData.value"
              :placeholder="$gettext('Select from list') | translate"
              multiple
              filterable
              popper-class="CustomFieldSelectorDropdown"
              class="CustomFieldSelector"
            >
              <el-option
                v-for="(opt, index) in dialogData.customField.options"
                :key="index"
                :value="opt"
              />
            </el-select>
          </template>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button @click="dialogVisible=false">
          Save
        </el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import OrganisationSelect from '@/components/common/OrganisationSelect';
import PlatformSelector from '@/components/project/PlatformSelector';
import HisBucketSelector from '@/components/project/HisBucketSelector';
import HealthSystemChallengesSelector from '@/components/project/HealthSystemChallengesSelector';
import HealthFocusAreasSelector from '@/components/project/HealthFocusAreasSelector';

export default {
  components: {
    OrganisationSelect,
    PlatformSelector,
    HisBucketSelector,
    HealthSystemChallengesSelector,
    HealthFocusAreasSelector
  },
  props: {
    countryFieldsLib: {
      type: Object,
      required: true
    },
    imported: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dialogData: null
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return !!this.dialogData;
      },
      set () {
        this.$emit('update', { row: this.dialogData.row, key: this.dialogData.key, value: this.dialogData.value });
        this.dialogData = null;
      }
    }
  },
  methods: {
    openDialog (row, key, { column, value, type }) {
      const stringified = JSON.stringify(value);
      this.dialogData = {
        row,
        key,
        column,
        value: value ? JSON.parse(stringified) : null,
        original: this.imported[row].original_data[key],
        customField: this.countryFieldsLib[type]
      };
    }
  }
};
</script>

<style>

</style>
