import _ from 'lodash';
import SignupService from './SignupService';

class SignupController {

    constructor($scope) {
        this.ss = new SignupService();
        this.scope = $scope;
        this.inProgress = false;
        this.registered = false;
        this.processRegistrationResult = this.processRegistrationResult.bind(this);
        this.register = {
            email: null,
            password1: null,
            password2: null,
            account_type: 'I'
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
            this.inProgress = true;
            this.ss.signup(this.register)
            .then(result => {
                if (result) {
                    this.processRegistrationResult(result, signupForm);
                }
            });
        }
    }

    processRegistrationResult(result, signupForm) {
        this.inProgress = false;
        if (result.success) {
            this.registered = true;
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
        function signup($scope) {
            return new SignupController($scope);
        }
        signup.$inject = ['$scope'];
        return signup;
    }
}

export default SignupController;
