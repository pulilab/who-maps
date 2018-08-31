export default {
  props: {
    rules: {
      type: Object,
      default: () => ({})
    },
    apiErrors: {
      type: Object,
      required: true
    }
  },
  watch: {
    apiErrors: {
      immediate: true,
      handler (errors) {
        this.errors.clear();
        for (let field in errors) {
          if (Array.isArray(errors[field])) {
            this.errors.add({
              field,
              msg: errors[field][0]
            });
          } else {
            for (let inner in errors[field]) {
              if (inner === 'non_field_errors') {
                this.errors.add({
                  field,
                  msg: errors[field].non_field_errors[0]
                });
              }
            }
          }
        }
      }
    }
  },
  methods: {
    async validate () {
      console.error('Validation is going to fail because this method was not overridden');
      return false;
    },
    clear () {
      this.errors.clear();
    }
  }
};
