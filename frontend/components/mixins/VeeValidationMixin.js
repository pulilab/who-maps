const errorLibrary = {
  platforms: 'platform_',
  coverage: 'coverage_',
  coverage_second_level: 'coverage_second_level_'
};

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
  data () {
    return {
      scopes: [],
      customCountryErrors: [],
      customDonorsErrors: []
    };
  },
  watch: {
    apiErrors: {
      immediate: true,
      handler (errors) {
        this.errors.clear();
        this.scopes.forEach(s => this.errors.clear(s));
        this.scopes = [];
        this.customCountryErrors = [];
        if (errors && errors.project) {
          this.coreProjectErrorHandling(errors.project);
        }
        if (errors && errors.country_custom_answers) {
          this.countryCustomAnswersErrorHandling(errors.country_custom_answers);
        }
        if (errors && errors.donor_custom_answers) {
          this.donorCustomAnswersErrorHandling(errors.donor_custom_answers);
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
    },
    countryCustomAnswersErrorHandling (errors) {
      if (errors && Array.isArray(errors)) {
        this.customCountryErrors = errors;
      } else {
        for (let key in errors) {
          this.errors.add({
            field: 'answer',
            scope: 'custom_question_' + key,
            msg: errors[key][0]
          });
        }
      }
    },
    donorCustomAnswersErrorHandling (errors) {
      const result = [];
      for (let key in errors) {
        result.push(...errors[key].map((e, index) => ({
          error: e,
          index,
          donor_id: +key
        })));
      }
      this.customDonorsErrors = result;
    },
    coreProjectErrorHandling (errors) {
      for (let field in errors) {
        const item = errors[field];
        if (Array.isArray(item)) {
          const first = item[0];
          if (first.constructor === Object) {
            item.forEach((innerError, key) => {
              const scope = errorLibrary[field] + key;
              this.scopes.push(scope);
              for (let innerField in innerError) {
                this.errors.add({
                  field: innerField,
                  msg: innerError[innerField][0],
                  scope
                });
              }
            });
          } else {
            this.errors.add({
              field,
              msg: first
            });
          }
        } else {
          for (let inner in item) {
            if (inner === 'non_field_errors') {
              this.errors.add({
                field,
                msg: item.non_field_errors[0]
              });
            }
          }
        }
      }
    }
  }
};
