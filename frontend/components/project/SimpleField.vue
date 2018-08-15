<template>
  <div class="SimpleField">
    <div
      v-if="header"
      class="Header"
    >
      {{ header }}
    </div>
    <div class="Content">
      <template v-if="content">
        {{ content }}
      </template>
      <template v-if="!content">
        <slot/>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      default: null
    },
    content: {
      type: [String, Number, Date],
      default: null
    }
  }
};
</script>

<style>

</style>
