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
      scopes: []
    };
  },
  watch: {
    apiErrors: {
      immediate: true,
      handler (errors) {
        this.errors.clear();
        this.scopes.forEach(s => this.errors.clear(s));
        this.scopes = [];
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
