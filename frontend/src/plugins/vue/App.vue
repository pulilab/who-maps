<template>
  <ajax-bar></ajax-bar>
</template>

<script >
  import 'vue-django-feedback';

  import AjaxBar from './AjaxBar.vue';


  export default {
    components: {
      AjaxBar
    },
    data () {
      return {};
    }
  };
</script>


<style lang="less">
  @import "~vue-django-feedback/dist/styles/main.less";
  @import "~vue-django-feedback/dist/styles/variables-dha.less";

  django-feedback {
    position: relative;
    z-index: 1000;
  }
</style>
