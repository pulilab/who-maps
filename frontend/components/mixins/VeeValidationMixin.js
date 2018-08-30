export default {
  props: {
    rules: {
      type: Object,
      default: () => ({})
    },
    apiErrors: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    apiErrors: {
      immediate: true,
      handler (errors) {
        this.errors.clear();
        for (let field in errors) {
          this.errors.add({
            field,
            msg: errors[field][0]
          });
        }
      }
    }
  },
  methods: {
    async validate () {
      console.error('Validation is going to fail because this method was not overridden');
      return false;
    }
  }
};
