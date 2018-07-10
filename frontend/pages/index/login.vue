<template>
  <div class="">
    <dha-login />
    <button @click="$router.push('/cms')"/>
  </div>
</template>

<script>
import DhaLogin from '../../components/DhaLogin';

export default {
  components: {
    DhaLogin
  }
};
</script>

<style lang="sass">
</style>
