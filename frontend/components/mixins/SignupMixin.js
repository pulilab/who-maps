import { mapActions } from 'vuex';
import FormAPIErrorsMixin from './FormAPIErrorsMixin';

const signupMixin = {
  mixins: [FormAPIErrorsMixin],
  data () {
    return {
      showSuccess: false,
      accountType: '',
      signupForm: {
        email: '',
        password1: '',
        password2: ''
      },
      rules: {
        email: [
          { required: true, message: 'This field is required', trigger: 'blur' },
          { type: 'email', message: 'Has to be a valid email address', trigger: 'blur' },
          { validator: this.validatorGenerator('email'), trigger: 'blur' }
        ],
        password1: [
          { required: true, message: 'This field is required', trigger: 'blur' },
          { min: 8, message: 'This field should be at least 8 characters', trigger: 'blur' },
          { validator: this.validatorGenerator('password1'), trigger: 'blur' }
        ],
        password2: [
          { required: true, message: 'This field is required', trigger: 'blur' },
          { validator: this.passwordMatching, trigger: 'blur' }
        ]
      }
    };
  },

  methods: {
    ...mapActions({
      'doSignup': 'user/doSignup'
    }),
    passwordMatching (rule, value, callback) {
      value === this.signupForm.password1 ? callback() : callback(Error('The password must match'));
    },
    async signup () {
      this.deleteFormAPIErrors();
      try {
        await this.doSignup({
          account_type: this.accountType,
          password1: this.signupForm.password1,
          password2: this.signupForm.password2,
          email: this.signupForm.email
        });
        this.showSuccess = true;
        setTimeout(() => {
          this.$router.push(this.localePath('index-edit-profile'));
        }, 5000);
      } catch (e) {
        this.setFormAPIErrors(e);
        console.log(this.$refs)
        this.$refs.signupForm.validate(() => {});
      }
    }
  }
};

export default signupMixin;
