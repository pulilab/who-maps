<template>
  <el-card :class="['QuestionContainer rounded', thisQuestion.meta, {'inactive': !thisQuestion.active, 'invalid': !valid}]">
    <!-- Type -->
    <el-select
      v-model="type"
      placeholder="Type">
      <el-option
        :label="$gettext('Text field')"
        :value="$gettext('Text field')" />
      <el-option
        :label="$gettext('Numeric field')"
        :value="$gettext('Numeric field')" />
      <el-option
        :label="$gettext('Yes - no field')"
        :value="$gettext('Yes - no field')" />
      <el-option
        :label="$gettext('Single choice')"
        :value="$gettext('Single choice')" />
      <el-option
        :label="$gettext('Multiple choice')"
        :value="$gettext('Multiple choice')" />
    </el-select>

    <!-- Question -->
    <el-input
      v-model="question"
      :placeholder="$gettext('Question text')" />

    <div class="QSwitches">
      <!-- Required -->
      <el-switch
        v-model="required"
        :active-text="$gettext('Required')" />

      <!-- Active -->
      <!-- <el-switch
        v-model="active"
        size="small"
        active-text="Active" /> -->

      <!-- TODO -->
      <el-switch
        v-model="active"
        :active-text="$gettext('Private')" />
    </div>

    <!-- Valid -->
    <!-- <span>{{ valid ? '' : 'INVALID' }}</span> -->

    <!-- Options -->
    <dha-question-options
      v-if="thisQuestion.type.includes('choice')"
      :question-id="questionId" />

    <span class="DDHandler">
      <fa icon="bars" />
    </span>
  </el-card>
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
      questionById: 'admin/questions/getQuestionById'
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

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .QuestionContainer {
    position: relative;
    margin-bottom: 20px;
    padding-left: 24px;

    &.added {
      // background-color: lighten(@colorPublished, 50%);
    }

    &.edited {
      background-color: @colorBrandBlueLight;
    }

    &.inactive {
      // background-color: @colorGrayLightest;
    }

    &.invalid {
      border-color: @colorDanger;
      background-color: #FEECEB;
    }

    .el-card__body {
      > div {
        margin-top: 20px;

        &:first-child {
          margin: 0;
        }
      }
    }

    .QSwitches {
      .el-switch {
        margin-right: 30px;
      }
    }

    .DDHandler {
      position: absolute;
      top: 0;
      left: 0;
      width: 24px;
      height: 100%;
      background-color: @colorGrayLighter;
      border-radius: 3px 0 0 3px;
      cursor: move;
      transition: @transitionAll;

      &:hover,
      &:active {
        background-color: @colorBrandBlueLight;

        .svg-inline--fa {
          color: @colorBrandPrimary;
        }
      }

      .svg-inline--fa {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: @colorGray;
        transition: @transitionAll;
      }
    }
  }

</style>
