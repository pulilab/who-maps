<template>
  <div>
    <slot
      :errors="errors"
      :valid="valid"
      :handleValidation="handleValidation"
    />
  </div>
</template>

<script>

export default {
  data () {
    return {
      errors: []
    };
  },
  computed: {
    valid () {
      return this.errors.length === 0;
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
