<template>
  <div>
    <div class="QuestionnaireWrapper">
      <draggable v-model="questions">
        <dha-question
          v-for="(question, index) in questions"
          :key="index"
          :question-id="question.id" />
      </draggable>
    </div>

    <el-row
      type="flex"
      align="middle"
      class="QActionContainer">
      <el-col class="QActionsButtons">
        <el-button
          type="text"
          class="IconLeft"
          @click="addQuestion"
        >
          <fa icon="plus" />
          Add new question
        </el-button>

        <!-- <el-button
          type="warning"
          plain
          size="small"
          icon="el-icon-delete"
          @click="eraseChanges"
        >
          Erase change
        </el-button> -->

        <!-- <el-button
          :disabled="!allValid"
          type="success"
          plain
          size="small"
          icon="el-icon-check"
          @click="saveChanges"
        >
          Save changes
        </el-button> -->
      </el-col>

      <el-col class="QAlerts">
        <el-alert
          v-if="reordered"
          title="warning alert"
          type="Questions are reordered!"
          show-icon />
        <el-alert
          v-if="!allValid"
          title="Contains invalid element!"
          type="error"
          show-icon />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DhaQuestion from './DhaQuestion';
import { mapGetters, mapActions } from 'vuex';
import draggable from 'vuedraggable';

export default {

  components: {
    DhaQuestion,
    draggable
  },

  props: {
    label: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      opened: 'opened'
    };
  },

  computed: {

    ...mapGetters({
      getQuestions: 'admin/questions/getQuestions',
      reordered: 'admin/questions/getReordered'
    }),

    allValid () {
      return this.questions.every(q => Boolean(q.type && q.question.length && (!q.type.includes('choice') || q.options.length)));
    },

    questions: {
      get () {
        return this.getQuestions;
      },
      set (val) {
        this.draggedQuestions(val);
      }
    }
  },

  methods: {

    ...mapActions({
      restoreQuestions: 'admin/questions/restoreQuestions',
      addQuestion: 'admin/questions/addQuestion',
      patchQuestions: 'admin/questions/patchQuestions',
      draggedQuestions: 'admin/questions/draggedQuestions'
    }),

    eraseChanges () {
      if (confirm('Do you really want to delete all the changes you\'ve made?')) {
        this.restoreQuestions();
      }
    },

    saveChanges () {
      console.log('TODO: button only clickable if everything is valid');
      this.patchQuestions();
      console.log('TODO: state handling (froze this part of UI) while action takes place');
    }
  }
};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

  .QuestionnaireWrapper {}

  .QActionContainer {
    .QActionsButtons {
      width: 100%;

      .el-button {
        margin: 0 20px;
      }
    }

    .QAlerts {
      width: auto;
      text-align: right;

      .el-alert {
        .el-alert__title {
          padding-right: 20px;
          font-size: @fontSizeSmall;
          white-space: nowrap;
        }
      }
    }
  }
</style>
