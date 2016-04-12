import SignupService from './SignupService';

class SignupController {

    constructor() {
        this.ss = new SignupService();
        this.processRegistrationResult = this.processRegistrationResult.bind(this);
        this.register = {
            // email: 'a',
            // password1: 'a',
            // password2: 'b'
        };
        this.style = {
            height: this.calculateHeight()
        };
    }

    calculateHeight() {
        const contentHeight = window.innerHeight - 48;
        return contentHeight + 'px';
    }

    signup(signupForm) {
        if (signupForm.$valid) {
            this.ss.signup(this.register)
            .then(result => {
                this.processRegistrationResult(result);
            });
        }
    }

    processRegistrationResult(result) {
        if (result.success) {
            console.log('success', result.data);
        }
        else {
            console.log('fail', result.data);
        }

    }

    static signupFactory() {
        require('./Signup.scss');
        function signup() {
            return new SignupController();
        }
        signup.$inject = [];
        return signup;
    }
}

export default SignupController;
