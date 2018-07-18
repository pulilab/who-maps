<template>
  <div>
    <p v-if="!options.length">No options added yet</p>
    <ul>
      <li
        v-for="(option, index) in options"
        :key="index">
        {{ option }}
        <span
          class="red"
          @click="removeOption({questionId, index})">X</span>
      </li>
    </ul>
    <input
      ref="input"
      v-model="inputField"
      placeholder="Add a new option here"
      type="text"
      @keyup.enter="addLocalOption">
    <button
      :disabled="!inputField"
      @click="addLocalOption">Add</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

  props: {
    questionId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      inputField: ''
    };
  },

  computed: {
    ...mapGetters({
      getOptions: 'admin/questions/getQuestionOptionsById'
    }),

    options () {
      return this.getOptions(this.questionId);
    }
  },

  methods: {

    ...mapActions({
      removeOption: 'admin/questions/removeOption',
      addOption: 'admin/questions/addOption'
    }),

    addLocalOption () {
      this.addOption({ 'questionId': this.questionId, 'optionStr': this.inputField });
      this.inputField = '';
      this.$refs.input.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
span.red {
  color: red;
  cursor: pointer;
}
</style>
