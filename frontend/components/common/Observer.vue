<template>
  <div class="observer">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    target: {
      type: [String, Number],
      default: 0
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      observer: null
    }
  },
  mounted () {
    const options = this.options || {}
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        this.$emit('intersect', this.target)
      }
    }, options)
    this.observer.observe(this.$el)
  },
  destroyed () {
    this.observer.disconnect()
  }
}
</script>
