<template>
  <div class="fill">
    <img :src="url" v-if="vertical && url" />
    <div class="grid-content fill">
      <default-text-vertical v-if="vertical" />
      <default-text v-else />
    </div>
  </div>

</template>

<script>
import DefaultText from '@/components/country/commons/DefaultText';
import DefaultTextVertical from '@/components/country/commons/DefaultTextVertical';

export default {
  name: 'WDeafult',
  components: {
    DefaultText,
    DefaultTextVertical
  },
  props: {
    vertical: {
      type: Boolean,
      required: false,
      default: false
    },
    url: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>

