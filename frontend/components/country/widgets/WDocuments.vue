<template>
  <div class="grid-content">
    <h3>Architecture roadmap documents</h3>
    <p>
      Non equidem invideo, miror magis posuere velit aliquet. Donec sed odio operae, eu vulputate felis rhoncus. Petierunt uti sibi concilium totius Galliae in diem certam indicere.
      <nuxt-link to="example">Read more »</nuxt-link>
    </p>

    <div v-for="doc in documents" :key="doc.id" class="doc">
      <p class="title">
        <a href="/images/myw3schoolsimage.jpg" download>
          {{doc.title}} <fa icon="download" />
        </a>
      </p>
      <p class="details">pdf — 558 kb</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'WDocuments',
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

