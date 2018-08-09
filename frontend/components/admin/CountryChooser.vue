<template>
  <el-row
    type="flex"
    justify="center"
    class="AdminCountryChooser">
    <el-col :span="8">
      <country-select v-model="selectedCountry" />
    </el-col>
    <el-col :span="8">
      <h2> Country Admin </h2>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CountrySelect from '../common/CountrySelect';
export default {
  components: {
    CountrySelect
  },
  computed: {
    ...mapGetters({
      countries: 'countries/getCountries',
      getSelectedCountry: 'admin/map/getSelectedCountry'
    }),
    selectedCountry: {
      get () {
        return this.getSelectedCountry;
      },
      set (value) {
        this.setSelectedCountry(value);
      }
    }
  },
  methods: {
    ...mapActions({
      setSelectedCountry: 'admin/map/setSelectedCountry'
    })
  }
};
</script>

<style>

</style>
