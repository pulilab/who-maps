<template>
  <div class="">
    <dha-login />
  </div>
</template>

<script>
import DhaLogin from '../../components/DhaLogin'

export default {
  middleware: ['loginGuard'],
  components: {
    DhaLogin
  }
}
</script>
