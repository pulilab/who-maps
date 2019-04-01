<template>
  <div class="ImportList">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>New Import</span>
      </div>
      <import-file />
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>Previous imports</span>
      </div>
      <el-row
        v-for="(item, index) in queue"
        :key="index"
        type="flex"
      >
        <el-col :span="4">
          <div class="Label">
            Selected Country
          </div>
          <country-item :id="item.country" />
        </el-col>

        <el-col :span="4">
          <div class="Label">
            Selected Investor
          </div>
          <donor-item :id="item.donor" />
        </el-col>

        <el-col :span="4">
          <div class="Label">
            File Name
          </div>
          {{ item.filename }}
        </el-col>
        <el-col :span="4">
          <div class="Label">
            Sheet Name
          </div>
          {{ item.sheet_name }}
        </el-col>

        <el-col :span="4">
          <div class="Label">
            Draft or Published
          </div>
          <span v-if="item.draft">Draft</span>
          <span v-else>Publish</span>
        </el-col>

        <el-col :span="4">
          <div class="Label">
            Actions
          </div>
          <el-button @click="workOnThis(item)">
            Select
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ImportFile from '@/components/admin/import/ImportFile';
import CountryItem from '@/components/common/CountryItem';
import DonorItem from '@/components/common/DonorItem';

export default {
  components: {
    ImportFile,
    CountryItem,
    DonorItem
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getProfile',
      queue: 'admin/import/getQueue',
      getCountryDetails: 'countries/getCountryDetails',
      dhi: 'projects/getDigitalHealthInterventions'
    })
  },
  async fetch ({ store }) {
    await Promise.all([
      store.dispatch('system/loadDonors'),
      store.dispatch('countries/loadMapData'),
      store.dispatch('admin/import/loadQueue')
    ]);
  }
};
</script>

<style lang="less">
.ImportList{
  .box-card {
    margin: 12px;
  }
}

</style>
