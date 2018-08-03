<template>
  <div class="CountryItem">
    <country-flag
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
