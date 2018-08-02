<template>
  <el-row
    type="flex"
    justify="center"
    class="AdminCountryChooser">
    <el-col :span="8">
      <el-select
        v-model="selectedCountry"
        placeholder="Select">
        <el-option
          v-for="country in countries"
          :key="country.id"
          :label="country.name"
          :value="country.id"/>
      </el-select>
    </el-col>
    <el-col :span="8">
      <h2> Country Admin </h2>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  data () {
    return {};
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
