<template>
  <div>
    <slot
      :errors="errors"
      :valid="valid"
      :columns="columns"
      :handleValidation="handleValidation"
    />
  </div>
</template>

<script>

export default {
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      errors: []
    };
  },
  computed: {
    valid () {
      return this.errors.length === 0;
    },
    columns () {
      if (this.row && this.row.data) {
        return this.row.data;
      }
      return {};
    }
  },
  methods: {
    handleValidation (valid, msg, field) {
      if (valid) {
        this.errors = this.errors.filter(e => e.field !== field);
      } else {
        this.errors.push({
          field,
          msg
        });
      }
    }
  }
};
</script>

<style>

</style>
