const formAPIErrorsMixin = {

  data () {
    return {
      formAPIErrors: {}
    };
  },

  methods: {
    deleteFormAPIErrors () {
      this.formAPIErrors = {};
    },

    setFormAPIErrors (error) {
      if (error.response && error.response.data) {
        this.formAPIErrors = error.response.data;
      } else {
        console.error('Failed to associate API error: ', error);
      }
    },

    validatorGenerator (prop) {
      return (rule, value, callback) => {
        if (this.formAPIErrors[prop] && this.formAPIErrors[prop].length) {
          const error = {
            message: this.formAPIErrors[prop][0],
            field: rule.fullField
          };
          callback(error);
        } else {
          callback();
        }
      };
    }
  },

  computed: {
    nonFieldErrors () {
      if (this.formAPIErrors.non_field_errors && this.formAPIErrors.non_field_errors.length) {
        return this.formAPIErrors.non_field_errors[0];
      } else {
        return '';
      }
    }
  }
};

export default formAPIErrorsMixin;
