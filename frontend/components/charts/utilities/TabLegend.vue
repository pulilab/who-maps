<template>
  <section>
    <nav class="tabs">
      <p
        v-for="tab in legend.tabs"
        :key="tab.id"
        :class="selected === tab.id && 'selected'"
        @click="handleSelect(tab.id)"
      >
        <span :class="tab.color" />
        {{ tab.name }}
      </p>
    </nav>
    <div
      v-for="content in legend.contents"
      :key="content.id"
      :class="`tab-content ${selected !== content.id && 'hide'}`"
    >
      <div
        v-for="area in content.areas"
        :key="area.name"
        class="area"
      >
        <h4>{{ area.name }}</h4>
        <div class="subarea">
          <p
            v-for="subarea in area.subareas"
            :key="subarea"
          >
            <i :class="`${content.icon} ${content.color}`" />{{ subarea }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    legend: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selected: 1
    }
  },
  methods: {
    handleSelect (id) {
      this.selected = id
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  border-bottom: 1px solid #d8d1c9;
  p {
    color: #777779;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 15px;
    text-transform: uppercase;
    margin: 0;
    padding: 11px 9px;
    margin-right: 9px;
    cursor: pointer;
    &:last-child {
      margin-right: 0px;
    }
    &.selected {
      color: #404041;
      font-weight: bold;
      border-bottom: 3px solid #1cabe2;
    }
    span {
      display: inline-block;
      height: 8px;
      min-width: 8px;
      border-radius: 50%;
      margin-right: 6px;
      &.green {
        background-color: #80bd41;
      }
      &.red {
        background-color: #e2231a;
      }
    }
  }
}
.tab-content {
  height: 285px;
  overflow-y: scroll;
  padding: 24px 30px;
  &.hide {
    display: none;
  }
  .area {
    h4 {
      margin: 0 0 10px 0;
      color: #a8a8a9;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 14px;
    }
  }
  .subarea {
    padding: 10px 0 16px 10px;
    p {
      margin: 0;
      color: #404041;
      font-size: 12px;
      letter-spacing: 0;
      line-height: 24px;
      i {
        margin-right: 10px;
        &.green {
          color: #80bd41;
        }
        &.red {
          color: #e2231a;
        }
      }
    }
  }
}
</style>
