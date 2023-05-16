<template>
  <div class="SignupPage">
    <signup-component
      :token="$route.query.token"
      :uid="$route.query.uid"
      :type="$route.query.type"
    />
  </div>
</template>

<script>
import SignupComponent from '~/components/SignupComponent'

export default {
  middleware: ['loginGuard'],
  components: {
    SignupComponent
  }
}
</script>
