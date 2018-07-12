<template>
  <div :class="['q-container', thisQuestion.meta, {'inactive': !thisQuestion.active, 'invalid': !valid}]">
    <!-- Type -->
    <el-select
      v-model="type"
      placeholder="Type"
      size="small">
      <el-option
        label="Text field"
        value="Text field" />
      <el-option
        label="Numeric field"
        value="Numeric field" />
      <el-option
        label="Yes - no field"
        value="Yes - no field" />
      <el-option
        label="Single choice"
        value="Single choice" />
      <el-option
        label="Multiple choice"
        value="Multiple choice" />
    </el-select>

    <!-- Question -->
    <el-input
      v-model="question"
      placeholder="Question text"
      type="textarea"
      autosize
      size="small"/>

    <!-- Required -->
    <el-switch
      v-model="required"
      size="small"
      active-text="Required" />

    <!-- Active -->
    <el-switch
      v-model="active"
      size="small"
      active-text="Active" />

    <el-switch
      v-model="active"
      size="small"
      active-text="TODO: private" />

    <!-- Valid -->
    <span>{{ valid ? '' : 'INVALID' }}</span>

    <!-- Options -->
    <dha-question-options
      v-if="thisQuestion.type.includes('choice')"
      :question-id="questionId" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DhaQuestionOptions from './DhaQuestionOptions';

export default {

  components: {DhaQuestionOptions},

  props: {
    questionId: {
      type: String,
      required: true
    }
  },

  computed: {

    ...mapGetters({
      questionById: 'questions/getQuestionById'
    }),

    thisQuestion () {
      return this.questionById(this.questionId);
    },

    ...['type', 'question', 'required', 'active'].reduce((ret, key) => {
      ret[key] = {
        get () {
          return this.thisQuestion[key];
        },
        set (val) {
          const diffObj = {id: this.questionId};
          diffObj[key] = val;
          this.alterLocalQuestion(diffObj);
        }
      };
      return ret;
    }, {}),

    valid () {
      const q = this.thisQuestion;
      return Boolean(q.type && q.question.length && (!q.type.includes('choice') || q.options.length));
    }

  },

  methods: {
    ...mapActions({
      alterLocalQuestion: 'admin/questions/alterLocalQuestion'
    })
  }

};
</script>

<style lang="scss" scoped>
.q-container {
  border: 1px solid lightgray;
  background-color: rgba(0,0,0,.1);
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 3px 10px;
}

.added {
  background-color: rgba(0,255,0,.4);
}

.edited {
  background-color: rgba(0,0,255,.3);
}

.inactive {
  background-color: rgba(255,125,0,.4);
}

.invalid {
  border: 1px solid red;
}
</style>
