<template>
  <div
    id="implementation"
    class="ImplementationOverview">
    <collapsible-card title="Implementation Overview">
      <el-form
        :model="implementation"
        :rules="rules"
        label-position="top"
        @submit.native.prevent>
        <el-form-item
          label="Add one or more Software and related Digital Health Interventions (DHI):"
        >
          <el-form-item
            v-for="(platform, index) in implementation.platforms"
            :key="platform.id"
            label="Software"
          >
            <el-col :span="12">
              <software-selector
                v-model="platform.id"
                :selected="implementation.platforms" />
              <el-form-item
                v-if="platform.id"
                label="Digital Health Interventions">
                <digital-health-interventions-selector
                  :platform-id="platform.id"
                />
              </el-form-item>
            </el-col>
            <el-col
              v-show="platform.id"
              :span="12">
              <el-button
                type="text"
                @click="addDhi">
                <fa icon="plus" />
                Add more
              </el-button>
              <el-button
                v-show="implementation.platforms.length > 1"
                type="text"
                @click="rmDhi(index, platform.id)">
                <fa icon="minus" />
                remove
              </el-button>
            </el-col>
          </el-form-item>
        </el-form-item>
        <el-form-item
          label="Health focus area(s) - select all that apply:"
          prop="health_focus_areas">
          <health-focus-areas-selector v-model="implementation.health_focus_areas" />
        </el-form-item>
        <el-form-item
          label="What are the Health System Challenges (HSC) your project addresses?"
          prop="hsc_challenges">
          <health-system-challenges-selector v-model="implementation.hsc_challenges" />
        </el-form-item>
        <el-form-item
          label="What part(s) of the Health Information System (HIS) does this project support?"
          prop="his_bucket">
          <his-bucket-selector v-model="implementation.his_bucket" />
        </el-form-item>
      </el-form>
    </collapsible-card>
  </div>
</template>

<script>
import CollapsibleCard from './CollapsibleCard';
import HealthSystemChallengesSelector from './HealthSystemChallengesSelector';
import HealthFocusAreasSelector from './HealthFocusAreasSelector';
import HisBucketSelector from './HisBucketSelector';
import SoftwareSelector from './SoftwareSelector';
import DigitalHealthInterventionsSelector from './DigitalHealthInterventionsSelector';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    CollapsibleCard,
    HealthSystemChallengesSelector,
    HisBucketSelector,
    HealthFocusAreasSelector,
    SoftwareSelector,
    DigitalHealthInterventionsSelector
  },
  data () {
    return {
      implementation: {
        platforms: [{}],
        health_focus_areas: [],
        hsc_challenges: [],
        his_bucket: []
      },
      rules: {}
    };
  },
  computed: {
    ...mapGetters({
      selectedDHi: 'projects/getCurrentProjectDHI'
    })
  },
  methods: {
    ...mapActions({
      setCurrentProjectDHI: 'projects/setCurrentProjectDHI'
    }),
    addDhi () {
      this.implementation.platforms.push({});
    },
    rmDhi (index, platformId) {
      if (platformId) {
        const filtered = this.selectedDHi.filter(dhi => dhi.platform !== platformId);
        this.setCurrentProjectDHI(filtered);
      }
      this.implementation.platforms.splice(index, 1);
    }
  }
};
</script>

<style>
</style>
