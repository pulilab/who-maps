<template>
  <div>
    <slot :errors="errors.any()" />
  </div>
</template>

<script>
export default {
  $_veeValidate: {
    validator: 'new'
  }
};
</script>

<style>

</style>
