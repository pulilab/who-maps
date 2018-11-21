<template>
  <div class="ErrorPage">
    {{ status }}
    {{ statusText }}
    {{ details }}
    <django-feedback />
  </div>
</template>

<script>
import get from 'lodash/get';
import DjangoFeedback from '@/components/DjangoFeedback.vue';

export default {
  components: {
    DjangoFeedback
  },
  props: {
    error: {
      type: null,
      default: null
    }
  },
  computed: {
    response () {
      return get(this, 'error.response', undefined);
    },
    status () {
      return get(this, 'response.status', 500);
    },
    statusText () {
      return get(this, 'response.statusText', this.$gettext('Server error'));
    },
    details () {
      return get(this, 'response.data.details', null);
    }
  }

};
</script>

<style lang="less">
  @import "~assets/style/variables.less";
  @import "~assets/style/mixins.less";

</style>
