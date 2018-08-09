<template>
  <div class="SubNationalLevelDeployment">
    <div
      v-if="countrySubLevelNames.first"
      class="FirstSubLevel"
    >
      <div class="Header">
        <fa icon="map-marker" />
        {{ countrySubLevelNames.first }} level deployment
      </div>
      <el-row
        v-for="(cov, index) in coverage"
        :key="cov.id"
        type="flex"
      >
        <el-col :span="12">
          <sub-national-level-deployment-item
            v-model="cov.id"
            :level-name="countrySubLevelNames.first"
            :sub-levels="countryFirstSubLevel"
            :selected="coverage"
          />
        </el-col>
        <el-col
          :span="12"
        >
          <add-rm-buttons
            :show-add="!!cov.id"
            :show-rm="coverage.length > 1"
            @add="addCoverage"
            @rm="rmCoverage(index, cov.id)"
          />
        </el-col>
      </el-row>
    </div>
    <div
      v-if="countrySubLevelNames.second"
      class="SecondSubLevel"
    >
      <div class="Header">
        <fa icon="map-marker" />
        {{ countrySubLevelNames.second }} level deployment
      </div>
      <el-row
        v-for="(cov, index) in coverageSecondLevel"
        :key="cov.id"
        type="flex"
      >
        <el-col :span="12">
          <sub-national-level-deployment-item
            v-model="cov.id"
            :level-name="countrySubLevelNames.second"
            :sub-levels="countrySecondSubLevel"
            :selected="coverageSecondLevel"
          />
        </el-col>
        <el-col
          :span="12"
        >
          <add-rm-buttons
            :show-add="!!cov.id"
            :show-rm="coverage.length > 1"
            @add="addCoverageSecondLevel"
            @rm="rmCoverageSecondLevel(index, cov.id)"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SubNationalLevelDeploymentItem from './SubNationalLevelDeploymentItem';
import AddRmButtons from './AddRmButtons';

export default {
  components: {
    SubNationalLevelDeploymentItem,
    AddRmButtons
  },
  props: {
    coverage: {
      type: Array,
      default: () => []
    },
    coverageSecondLevel: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters({
      currentCountry: 'projects/getCurrentProjectCountry',
      getCountrySubLevelNames: 'countries/getCountrySubLevelNames',
      getCountryFirstSubLevel: 'countries/getCountryFirstSubLevel',
      getCountrySecondSubLevel: 'countries/getCountrySecondSubLevel'
    }),
    countrySubLevelNames () {
      return this.getCountrySubLevelNames(this.currentCountry);
    },
    countryFirstSubLevel () {
      const result = this.getCountryFirstSubLevel(this.currentCountry);
      return result || [];
    },
    countrySecondSubLevel () {
      const result = this.getCountrySecondSubLevel(this.currentCountry);
      return result || [];
    }
  },
  methods: {
    ...mapActions({
      setCurrentProjectCoverage: 'projects/setCurrentProjectCoverage'
    }),
    addCoverage () {
      this.$emit('update:coverage', [...this.coverage, {}]);
    },
    rmCoverage (index, id) {
      this.$emit('update:coverage', this.coverage.filter((c, i) => i !== index));
      if (id) {
        this.setCurrentProjectCoverage({district: id, coverage: undefined});
      }
    },
    addCoverageSecondLevel () {
      this.$emit('update:coverageSecondLevel', [...this.coverageSecondLevel, {}]);
    },
    rmCoverageSecondLevel (index, id) {
      this.$emit('update:coverageSecondLevel', this.coverageSecondLevel.filter((c, i) => i !== index));
      if (id) {
        this.setCurrentProjectCoverage({district: id, coverage: undefined});
      }
    }
  }
};
</script>

<style lang="less">
.SubNationalLevelDeployment {
  width: 100%;
}

</style>
