<template>
  <div class="SignupPage">
    <signup-component />
  </div>
</template>

<script>
import SignupComponent from '../../components/SignupComponent'

export default {
  middleware: ['loginGuard'],
  components: {
    SignupComponent
  }
}
</script>
