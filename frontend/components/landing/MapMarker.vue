<template>
  <l-marker
    :options="pin.options"
    :lat-lng="pin.latlng"
    :icon="icon"
    @mouseenter="markerHoverEnter($event)"
    @mouseleave="markerHoverExit"
    @click="emitMarkerClick"
  >
    <l-tooltip
      v-if="paintTooltip"
      :options="tooltipOptions"
    >
      <slot />
    </l-tooltip>
  </l-marker>
</template>

<script>

export default {
  props: {
    pin: {
      type: Object,
      required: true
    },
    icon: {
      type: Object,
      required: false,
      default: () => null
    },
    forceHovered: {
      type: Boolean,
      default: false
    },
    additionalTooltipClass: {
      type: String,
      default: ''
    }
  },
  data () {
    const iconY = this.icon ? -this.icon.options.iconSize[1] - 3 : -15;
    return {
      hovered: false,
      tooltipOptions: {
        className: `dha-tooltip ${this.additionalTooltipClass}`,
        permanent: false,
        direction: 'top',
        offset: [0, iconY]
      }
    };
  },
  computed: {
    paintTooltip () {
      return this.$slots.default && (this.hovered || this.forceHovered);
    }
  },
  methods: {
    emitMarkerClick () {
      this.$emit('marker-click');
    },
    markerHoverEnter (event) {
      if (this.$slots.default) {
        this.hovered = true;
        const m = event.target;
        window.setTimeout(() => {
          if (m && !m.isTooltipOpen()) {
            try {
              m.toggleTooltip();
            } catch (e) {
              console.log(e);
            }
          }
        }, 100);
      }
    },
    markerHoverExit () {
      this.hovered = false;
    }
  }
};
</script>

<style lang="less">
</style>
