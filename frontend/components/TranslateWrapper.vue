<script>
export default {
  props: {
    parameters: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    message () {
      if (this.$slots.default && this.$slots.default[0]) {
        if (this.$slots.default.length > 1) {
          console.warn('Multiple node inside translate tag', this.$slots.default);
        }
        return this.$slots.default[0].text.trim();
      }
    },
    translated () {
      return this.$gettext(this.message);
    }
  },
  render (createElement) {
    return createElement('span', this.translated);
  }
};
</script>
