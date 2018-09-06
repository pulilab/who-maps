<template>
  <span>
    {{ $t(text) }}
  </span>
</template>

<script>
export default {
  computed: {
    text () {
      if (this.$slots && this.$slots.default && this.$slots.default[0] && this.$slots.default[0]) {
        return this.$slots.default[0].text.trim();
      } else {
        console.error('Empty translate block');
      }
    }
  }
};
</script>

<style>

</style>
