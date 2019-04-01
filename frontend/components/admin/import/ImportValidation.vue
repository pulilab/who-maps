<template>
  <div>
    <div
      v-if="errors"
      class="GlobalErrors"
    >
      <el-tag
        v-for="error in errors"
        :key="error"
        type="danger"
      >
        <fa icon="exclamation" />
        {{ error }}
      </el-tag>
    </div>
    <slot
      :rules="validationRules"
      :globalErrors="errors"
    />
  </div>
</template>

<script>
import { draftRules, publishRules } from '@/utilities/projects';
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    publish: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    internalDraftRules () {
      return { ...draftRules(), organisation: { required: true } };
    },
    internalPublishRules () {
      const standardRules = publishRules();
      return {
        ...standardRules,
        strategies: undefined,
        ...standardRules.national_level_deployment
      };
    },
    validationRules () {
      const rules = this.publish ? this.internalPublishRules : this.internalDraftRules;
      return {
        ...rules,
        team: undefined,
        viewers: undefined,
        country: undefined,
        donors: undefined
      };
    },
    errors () {
      const result = [];
      const draftRequireds = [];
      for (const key in this.validationRules) {
        if (this.validationRules[key] && this.validationRules[key].required) {
          draftRequireds.push(key);
        }
      }
      draftRequireds.forEach(dr => {
        if (!this.headers.some(h => h.selected === dr)) {
          result.push(`Please select ${dr} column`);
        }
      });
      return result;
    }
  }

};
</script>

<style>

</style>
