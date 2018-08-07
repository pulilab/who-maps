<template>
  <div
    v-if="country"
    class="CountryItem">
    <country-flag
      v-show="showFlag"
      :code="country.code"
      small />
    {{ country.name }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CountryFlag from './CountryFlag';

export default {
  components: {
    CountryFlag
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    showFlag: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      getCountryDetails: 'countries/getCountryDetails'
    }),
    country () {
      return this.getCountryDetails(this.id);
    }
  }
};
</script>

<style>

</style>
