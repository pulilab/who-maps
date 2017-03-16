import _ from 'lodash';
import SignupService from './SignupService';
import Storage from '../Storage';
import CommonServices from '../CommonServices';
class SignupController {

    constructor($scope, $location, $anchorScroll) {
        this.ss = new SignupService();
        this.EE = window.EE;
        this.scope = $scope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.storage = new Storage();
        this.inProgress = false;
        this.registered = false;
        this.hideMainForm = false;
        this.processRegistrationResult = this.processRegistrationResult.bind(this);
        this.register = {
            email: null,
            password1: null,
            password2: null,
            account_type: 'I'
        };
        this.style = {
            height: CommonServices.calculateHeight()
        };
    }

    signup(signupForm) {
        if (signupForm.$valid) {
            this.inProgress = true;
            this.ss.signup(this.register)
            .then(result => {
                if (result) {
                    this.processRegistrationResult(result, signupForm);
                }
            });
        }
    }

    scrollTo(idString) {
        this.$location.hash(idString);
        this.$anchorScroll();
    }

    nextStep() {
        this.hideMainForm = true;
        this.scrollTo('scroll-to-head');
    }

    processRegistrationResult(result, signupForm) {
        this.inProgress = false;
        if (result.success) {
            this.registered = true;
            const user = {
                username: this.register.email
            };
            this.storage.set('token', result.data.key);
            this.storage.set('user_profile_id', result.data.user_profile_id);
            this.storage.set('user', user);
            setTimeout(() => {
                this.EE.emit('login');
            }, 5000);
        }
        else {
            _.forEach(result.data, (item, key) => {
                signupForm[key].customError = item;
                signupForm[key].$setValidity('custom', false);
            });
        }
        this.scope.$evalAsync();
    }

    handleCustomError(signupForm, key) {
        signupForm[key].$setValidity('custom', true);
        signupForm[key].customError = [];

    }

    static signupFactory() {
        require('./Signup.scss');
        function signup($scope, $location, $anchorScroll) {
            return new SignupController($scope, $location, $anchorScroll);
        }
        signup.$inject = ['$scope', '$location', '$anchorScroll'];
        return signup;
    }
}

export default SignupController;
