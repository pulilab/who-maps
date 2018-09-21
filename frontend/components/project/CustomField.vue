<template>
  <el-form-item
    :error="errors.first('answer', 'country_custom_question_' + id)"
    :label="question"
    class="CustomField"
  >
    <el-input
      v-validate="localRules"
      v-if="type < 3"
      v-model="innerValue"
      :data-vv-as="question"
      :data-vv-scope="'country_custom_question_' + id"
      data-vv-name="answer"/>

    <el-radio-group
      v-validate="localRules"
      v-if="type === 3"
      v-model="innerValue"
      :data-vv-as="question"
      data-vv-name="answer"
    >
      <el-radio label="yes"><translate>Yes</translate></el-radio>
      <el-radio label="no"><translate>No</translate></el-radio>
    </el-radio-group>

    <template v-if="type > 3 && options">
      <el-select
        v-validate="localRules"
        v-model="innerValue"
        :placeholder="$gettext('Select from list')"
        :multiple="type === 5"
        :data-vv-as="question"
        filterable
        data-vv-name="answer"
        popper-class="CustomFieldSelectorDropdown"
        class="CustomFieldSelector"
      >
        <el-option
          v-for="opt in options"
          :key="opt"
          :value="opt"
        />
      </el-select>
    </template>
  </el-form-item>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VeeValidationMixin from '../mixins/VeeValidationMixin.js';

export default {
  mixins: [VeeValidationMixin],
  props: {
    type: {
      type: Number,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      default: () => []
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    doValidation: {
      type: Boolean,
      default: false
    },
    module: {
      type: String,
      default: 'country'
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getCountryAnswerDetails: 'project/getCountryAnswerDetails'
    }),
    answer () {
      const saved = this.module === 'country' ? this.getCountryAnswerDetails(this.id) : null;
      return saved || {
        question_id: this.id,
        answer: null
      };
    },
    value () {
      return this.answer.answer;
    },
    innerValue: {
      get () {
        if (this.value && Array.isArray(this.value) && this.value.length > 0) {
          return this.type === 5 ? this.value : this.value[0];
        }
        return this.type === 5 ? [] : null;
      },
      set (answer) {
        answer = Array.isArray(answer) ? answer : [answer];
        this.setCountryAnswer({...this.answer, answer});
      }
    },
    localRules () {
      return {
        required: this.isRequired && this.doValidation,
        numeric: this.type === 2 && this.doValidation
      };
    }
  },
  watch: {
    customCountryErrors: {
      immediate: true,
      handler (errors) {
        if (this.module === 'country') {
          this.findError(errors);
        }
      }
    }
  },
  methods: {
    ...mapActions({
      setCountryAnswer: 'project/setCountryAnswer'
    }),
    findError (errors) {
      if (errors && errors.length > this.index - 1) {
        const error = errors[this.index];
        if (error) {
          const firsElement = error[Object.keys(error)[0]];
          const msg = firsElement ? firsElement[0] : null;
          if (msg) {
            this.errors.add({
              field: 'answer',
              scope: 'country_custom_question_' + this.id,
              msg
            });
          }
        }
      }
    },
    validate () {
      return this.$validator.validate();
    }
  }
};
</script>

<style lang="less">
.CustomField {
  width: 100%;

  .CustomFieldSelector {
    width: 100%;
  }
}

</style>
