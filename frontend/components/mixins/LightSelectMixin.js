import uniqBy from 'lodash/uniqBy';

export default {
  data () {
    return {
      options: []
    };
  },
  computed: {
    optionsAndValues () {
      const result = [...this.options].sort((a, b) => a.name.localeCompare(b.name));
      if (this.value) {
        if (Array.isArray(this.value) && this.value.length > 0) {
          result.push(...this.items.filter(p => this.value.some(v => v === p.id)));
        } else {
          result.push(...this.items.filter(p => p.id === +this.value));
        }
      }
      return uniqBy(result, 'id');
    }
  },
  methods: {
    filterList (query) {
      if (query) {
        this.options = this.items.filter(p => this.filter(p.name, query) || this.filter(p.email, query) );
      } else {
        this.options = [];
      }
    },

    filter (val, query) {
      return val.toLowerCase().startsWith(query.toLowerCase());
    }
  }
};
