<template>
  <div class="grid-content">
    <p>{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'WDescription',
  props: {
    description: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>
