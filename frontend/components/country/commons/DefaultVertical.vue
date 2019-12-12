<template>
  <div>
    <img :src="url" />
    <div class="grid-content">
      <default-text-vertical />
    </div>
  </div>
</template>

<script>
import DefaultTextVertical from '@/components/country/commons/DefaultTextVertical';

export default {
  name: 'Default',
  components: {
    DefaultTextVertical
  },
  props: {
    url: {
      type: String,
      required: true
    }
  }
};
</script>

