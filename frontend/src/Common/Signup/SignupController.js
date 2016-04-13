import _ from 'lodash';
import SignupService from './SignupService';

class SignupController {

    constructor($scope) {
        this.ss = new SignupService();
        this.scope = $scope;
        this.processRegistrationResult = this.processRegistrationResult.bind(this);
        this.register = {
            email: 'c@c.com',
            password1: '123456',
            password2: '123456',
            role: 1
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
                this.processRegistrationResult(result, signupForm);
            });
        }
    }

    processRegistrationResult(result, signupForm) {
        if (result.success) {
            console.log('success', result.data);
        }
        else {
            _.forEach(result.data, (item, key) => {
                signupForm[key].customError = item;
                signupForm[key].$setValidity('custom', false);
            });
            this.scope.$evalAsync();
        }
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
