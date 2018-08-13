<template>
  <div>
    <l-marker
      ref="countryMarker"
      :options="pin.options"
      :lat-lng="pin.latlng"
      :icon="icon"
      class="MapMarker"
      @click="markerClickHandler"
    >
      <l-popup
        ref="tooltip"
        :options="popupOptions"
      >
        <div
          class="MouseEventSpy"
          @mouseenter="mouseEnterHandler"
          @mouseleave="mouseLeaveHandler"
        >
          <el-button
            class="CountryViewBtn"
            @click="openCountryView">
            <fa icon="search-plus" />
            <span
              v-show="popUpHover"
              class="Text"
            >
              Country view
            </span>
          </el-button>
        </div>
      </l-popup>
    </l-marker>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import GeoJsonLayer from './GeoJsonLayer';

export default {
  components: {
    GeoJsonLayer
  },
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
    return {
      popUpHover: false,
      popupOptions: {
        className: `CountryViewPopup`,
        closeButton: false
      }
    };
  },
  computed: {
    paintTooltip () {
      return this.$slots.default && (this.hovered || this.forceHovered);
    }
  },
  methods: {
    ...mapActions({
      setCountry: 'landing/setCountry',
      setActiveCountry: 'landing/setActiveCountry'
    }),
    markerClickHandler () {
      this.setActiveCountry(this.pin.id);
    },
    safeMapObjectFunctionCall (ref, functionName) {
      if (this.$refs[ref] && this.$refs[ref].mapObject) {
        this.$refs[ref].mapObject[functionName]();
      }
    },

    openCountryView () {
      this.setCountry(this.pin.id);
      this.safeMapObjectFunctionCall('countryMarker', 'closePopup');
    },
    mouseEnterHandler (event) {
      this.popUpHover = true;
      this.$nextTick(() => {
        this.safeMapObjectFunctionCall('tooltip', 'update');
      });
    },
    mouseLeaveHandler (event) {
      this.popUpHover = false;
      this.$nextTick(() => {
        this.safeMapObjectFunctionCall('tooltip', 'update');
      });
    }
  }
};
</script>

<style lang="less">
  @import "../../assets/style/variables.less";
  @import "../../assets/style/mixins.less";

  .CountryViewPopup {
    bottom: 0;
    margin-bottom: 55px;

    .leaflet-popup-content-wrapper {
      background-color: transparent;
      box-shadow: none;

      .leaflet-popup-content {
        width: 36px !important;
        margin: 0;
      }
    }

    .leaflet-popup-tip-container {
      display: none;
    }

    .MouseEventSpy {
      position: relative;
      width: 36px;
      height: 36px;
    }

    .CountryViewBtn {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 36px;
      height: 36px;
      margin: 0;
      padding: 0 12px;
      overflow: hidden;
      border: 0;
      border-radius: 36px;
      background-color: fade(@colorBrandAccent, 90%);
      box-shadow: 0 0 5px rgba(0,0,0,.12), 0 5px 5px rgba(0,0,0,.24);
      transition: @transitionAll;

      > span {
        display: inline-flex;
        height: 100%;
        align-items: center;
      }

      .svg-inline--fa {
        font-size: 16px;
        margin-left: -1px;
      }

      .Text {
        font-size: 12px;
        line-height: 36px;
        padding-left: 4px;
      }

      &:hover {
        width: auto;
        background-color: @colorBrandAccent;
      }
    }
  }

</style>
