
export const state = () => ({
  questionaireId: null,
  questions: [],
  rawQuestions: [],
  reordered: false
});

export const getters = {
  getQuestions: state => state.questions,
  getQuestionById: state => id => state.questions.find(q => q.id === id),
  getQuestionOptionsById: state => id => state.questions.find(q => q.id === id).options,
  getReordered: state => state.reordered
};

export const actions = {
  async fetchQuestions ({ state, commit }) {
    commit('storeQuestions', []);
    commit('storeRawQuestions', []);
    const { data } = await this.$axios.get(`/questions/${state.questionaireId}`);
    commit('storeQuestions', data);
    commit('storeRawQuestions', data);
  },

  restoreQuestions ({ state, commit }) {
    commit('storeQuestions', JSON.parse(JSON.stringify(state.rawQuestions)));
  },

  alterLocalQuestion ({ commit }, diffObj) {
    commit('storeLocalQuestionChanges', diffObj);
  },

  addQuestion ({ commit }) {
    commit('storeNewQuestion');
  },

  async patchQuestions ({ state, dispatch }) {
    const patchData = state.questions
      .map(el => {
        const ret = {
          type: el.type,
          question: el.question,
          options: el.type.includes('choice') ? el.options : [],
          required: el.required,
          active: el.active
        };
        if (el.meta !== 'added') {
          ret.id = el.id;
        }
        return ret;
      });
    await this.$axios.patch(`/questions/${state.questionaireId}`, patchData);
    dispatch('fetchQuestions');
  },

  removeOption ({ commit }, { questionId, index }) {
    commit('storeRemoveOption', { questionId, index });
  },

  addOption ({ commit }, { questionId, optionStr }) {
    commit('storeAddOption', { questionId, optionStr });
  },

  draggedQuestions ({ state, commit }, newQuestionsArray) {
    commit('storeQuestionsWithMeta', newQuestionsArray);
    const originalOrder = state.rawQuestions
      .every(({ id }, i) => id === newQuestionsArray[i].id);

    commit('storeReordered', !originalOrder);
  },

  setQuestionaireId ({ commit }, id) {
    commit('storeQuestionaireId', id);
  }

};

export const mutations = {
  storeQuestions (state, questions) {
    state.questions = questions.map(el => ({...el, meta: 'synched', valid: null}));
  },

  storeQuestionsWithMeta (state, questions) {
    state.questions = questions;
  },

  storeRawQuestions (state, questions) {
    state.rawQuestions = JSON.parse(JSON.stringify(questions));
  },

  storeLocalQuestionChanges (state, diffObj) {
    const q = state.questions.find(q => q.id === diffObj.id);
    Object.assign(q, diffObj);
    if (q.meta !== 'added') {
      q.meta = 'edited';
    }
  },

  storeNewQuestion (state) {
    state.questions.push({
      type: '',
      question: '',
      options: [],
      required: false,
      active: true,
      meta: 'added',
      id: `untracked-${Date.now()}`
    });
  },

  storeRemoveOption (state, { questionId, index }) {
    const q = state.questions.find(q => q.id === questionId);
    q.options.splice(index, 1);
    if (q.meta !== 'added') {
      q.meta = 'edited';
    }
  },

  storeAddOption (state, { questionId, optionStr }) {
    const q = state.questions.find(q => q.id === questionId);
    q.options.push(optionStr);
    if (q.meta !== 'added') {
      q.meta = 'edited';
    }
  },

  storeReordered (state, bool) {
    state.reordered = bool;
  },

  storeQuestionaireId (state, id) {
    state.questionaireId = id;
  }
};
