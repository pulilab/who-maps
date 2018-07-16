<template>
  <el-card class="questionaire-container">
    <el-collapse
      v-model="opened"
      accordion
      class="asdf">
      <el-collapse-item
        :title="label"
        name="opened">

        <div class="question-conatiner">
          <draggable v-model="questions">
            <dha-question
              v-for="(question, index) in questions"
              :key="index"
              :question-id="question.id" />
          </draggable>
        </div>

        <div class="action-container">
          <el-button
            type="primary"
            plain
            size="small"
            icon="el-icon-plus"
            @click="addQuestion"
          >
            Add new
          </el-button>

          <el-button
            type="warning"
            plain
            size="small"
            icon="el-icon-delete"
            @click="eraseChanges"
          >
            Erase change
          </el-button>

          <el-button
            :disabled="!allValid"
            type="success"
            plain
            size="small"
            icon="el-icon-check"
            @click="saveChanges"
          >
            Save changes
          </el-button>

          <span class="badge-container">
            <span
              v-if="reordered"
              class="badge"
            >
              <i class="el-icon-sort badge"/>
              reordered
            </span>
            <span
              v-if="!allValid"
              class="badge"
            >
              <i class="el-icon-error badge"/>
              contains invalid element
            </span>
          </span>
        </div>

      </el-collapse-item>
    </el-collapse>
  </el-card>
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

<style lang="scss" scoped>
.questionaire-container {
  margin: 20px;
  padding-bottom: 0px;
}
.asdf {
  border-bottom-width: 0px;
  border-top-width: 0px;
}
.action-container {
  margin-top: 20px;
}
.badge-container {
  float: right;
  line-height: 18px;
  i.badge {
    margin-left: 6px;
    font-size: 18px;
    transform: translate(0, 2px);
  }
}
</style>
