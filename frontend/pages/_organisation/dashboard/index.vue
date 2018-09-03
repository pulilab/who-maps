<template>
  <div class="DashboardMapView">
    <dashboard-map />
    <dashboard-project-box />
  </div>
</template>

<script>
import DashboardMap from '../../../components/dashboard/DashboardMap';
import DashboardProjectBox from '../../../components/dashboard/DashboardProjectBox';

export default {
  components: {
    DashboardMap,
    DashboardProjectBox
  }
};
</script>

<style lang="less">
  .DashboardMapView {
    position: relative;
  }

</style>
