<template>
  <div class="grid-content">
    <p v-if="single">
      {{ description }}
    </p>
    <el-row v-else :gutter="20">
      <el-col v-for="(item, i) in dynamicDesc" :key="i" :span="item.span">
        <p :class="`${item.span === 24 ? 'special' : ''}`">
          {{ item.description }}
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "WDescription",
  props: {
    description: {
      type: String,
      required: false,
      default: ""
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dynamicDesc() {
      const len = this.description.length;
      if (len > 800) {
        const splitStr = this.chunkString(
          this.description,
          parseInt(len / 3 + 1)
        );
        return splitStr.map(i => {
          return { description: i, span: 8 };
        });
      }
      return [{ description: this.description, span: 24 }];
    }
  },
  methods: {
    chunkString(str, len) {
      const size = Math.ceil(str.length / len);
      const r = Array(size);
      let offset = 0;

      for (let i = 0; i < size; i++) {
        r[i] = str.substr(offset, len);
        offset += len;
      }

      return r;
    }
  }
};
</script>
