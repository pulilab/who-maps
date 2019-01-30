export default {
  head () {
    return {
      htmlAttrs: {
        dir: this.lngDirection
      }
    };
  },
  computed: {
    lngDirection () {
      if (this.$i18n.locale === 'ar') {
        return 'rtl';
      }
      return 'ltr';
    }
  }
};
