<template>
  <div class="container">
    <input
      v-show="false"
      ref="fileInput"
      type="file"
      @change="setCsv">
    <el-button
      :loading="csvProcessing"
      type="primary"
      @click="triggerFile">Select Facility List</el-button>

    <template v-if="dataReady">

      <div class="facility-list">
        <h4>Imported Facilities ({{ simpleFacilities.length }}):</h4>
        <ul
          v-for="facility in simpleFacilities"
          :key="facility"
        >
          <li class="name">{{ facility }}</li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import Papa from 'papaparse';

export default {
  name: 'FacilityImport',
  props: {
    places: {
      type: Array,
      default: () => []
    },
    initialData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showMatched: false,
      showNotMatched: true,
      facilities: [],
      csvProcessing: false
    };
  },
  computed: {
    dataReady () {
      return this.facilities && this.facilities.length > 0;
    },
    simpleFacilities () {
      return this.facilities.map(f => f.name);
    }
  },
  watch: {
    initialData: {
      immediate: true,
      handler (data) {
        if (data && data.length > 0) {
          this.facilities = data.map(d => ({ name: d }));
        }
      }
    }
  },
  methods: {
    triggerFile () {
      this.csvProcessing = true;
      this.$refs.fileInput.click();
    },
    setCsv (event) {
      const file = event.target.files ? event.target.files[0] : null;
      Papa.parse(file, {
        header: true,
        complete: result => {
          this.facilities = result.data.map(f => ({
            name: f.name || f.Name || f.NAME,
            place: f.county || f.County || f.COUNTY
          }));
          this.csvProcessing = false;
        }
      });
    }
  }
};
</script>

<style>
.facility-list {
  max-height: 300px;
  overflow: scroll;
}
</style>
