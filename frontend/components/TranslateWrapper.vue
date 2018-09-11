<template>
  <span v-if="$slots.default && $slots.default[0].text">
    {{ $t($slots.default[0].text.trim()) }}
  </span>
</template>

<script>
export default {
};
</script>

<style>

</style>
