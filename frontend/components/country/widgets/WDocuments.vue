<template>
  <div class="grid-content">
    <h3><translate>Government technical and governance documents</translate></h3>
    <p>
      <translate>Government documents can be found below that ensure adequate governance, technical oversight, architecture, coordinated planning and financing that drive effective investment and use of digital and data systems within the country. document examples: national digital health strategy, investment roadmap, architecture; HIS, interoperability, and digital maturity assessments; prior country inventories and assessments, etc.</translate>
    </p>

    <div
      v-for="(doc, i) in documents"
      :key="i"
      class="doc"
    >
      <p class="title">
        <a
          :href="'media/' + doc.document"
          download
          target="_blank"
        >
          {{ doc.title }} <fa icon="download" />
        </a>
      </p>
      <p class="details">
        {{ doc.document | extension }} — {{ doc.size | size }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WDocuments',
  filters: {
    extension (filename) {
      return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    },
    size (bytes) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      // const dm = decimals < 0 ? 0 : decimals;
      const dm = 0;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
  },
  props: {
    documents: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
  @import "../../../assets/style/variables.less";

  .doc {
    border-bottom: 1px solid #E0E0E0;
    padding: 20px 0;
    &:last-child {
      border-bottom: none;
    }
    p {
      margin-bottom: 6px!important;
      text-transform: capitalize;
      &:last-child {
        margin-bottom: 0!important;
      }
      svg {
        float: right;
      }
    }
    .title {
      font-size: 16px;
      color: @colorBrandPrimary;
      font-weight: 700;
      cursor: pointer;
    }
    .details {
      font-size: 12px;
      text-transform: uppercase;
      color: #9E9E9E;
    }
  }
  a {
    color: @colorBrandPrimary;
    text-decoration: none;
    font-weight: 700;
  }

</style>
