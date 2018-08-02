import { mapActions } from 'vuex';

const signupMixin = {

  data () {
    return {
      showSuccess: false,
      accountType: '',
      signupForm: {
        email: '',
        password: '',
        password2: ''
      }
    };
  },

  computed: {
    inputsFilledOkay () {
      // eslint-disable-next-line
      const validatorRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      const validEmail = validatorRegex.test(this.signupForm.email);
      const matchingPasswords = Boolean(this.signupForm.password === this.signupForm.password2);

      return this.accountType && this.signupForm.password && validEmail && matchingPasswords;
    }
  },

  methods: {
    ...mapActions({
      'doSignup': 'user/doSignup'
    }),

    async signup () {
      await this.doSignup({
        account_type: this.accountType,
        password1: this.signupForm.password,
        password2: this.signupForm.password2,
        email: this.signupForm.email
      });
      this.showSuccess = true;
      setTimeout(() => {
        this.$router.push(this.localePath('index-edit-profile'));
      }, 5000);
    }
  }
};

export default signupMixin;
