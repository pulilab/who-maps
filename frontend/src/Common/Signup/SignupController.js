import _ from 'lodash';
import * as UserModule from '../../store/modules/user';
class SignupController {

    constructor($scope, $location, $anchorScroll, $ngRedux, $state) {
        this.EE = window.EE;
        this.scope = $scope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapState, UserModule)(this);
    }

    onInit() {
        this.inProgress = false;
        this.registered = false;
        this.hideMainForm = false;
        this.handleDataError = this.handleDataError.bind(this);
        this.register = {
            email: null,
            password1: null,
            password2: null,
            account_type: 'I'
        };

        this.style = {
            height: 300
        };
    }

    onDestroy() {
        this.unsubscribe();
    }

    mapState(state) {
        return {
            userModel: state.user
        };
    }

    async signup(signupForm) {
        if (signupForm.$valid) {
            this.inProgress = true;
            try {
                await this.doSignup(this.register);
                this.inProgress = false;
                this.registered = true;
                setTimeout(() => {
                    this.state.go('editProfile');
                }, 5000);
            }
            catch (data) {
                this.handleDataError(signupForm, data);
            }
        }
    }

    handleDataError(signupForm, data) {
        this.inProgress = false;
        _.forEach(data, (item, key) => {
            if (signupForm[key]) {
                signupForm[key].customError = item;
                signupForm[key].$setValidity('custom', false);

            }
            else {
                signupForm[key] = item;
            }
        });
        this.scope.$evalAsync();
    }

    scrollTo(idString) {
        this.$location.hash(idString);
        this.$anchorScroll();
    }

    nextStep() {
        this.hideMainForm = true;
        this.scrollTo('scroll-to-head');
    }

    handleCustomError(signupForm, key) {
        signupForm[key].$setValidity('custom', true);
        signupForm[key].customError = [];

    }

    static signupFactory() {
        require('./Signup.scss');
        function signup($scope, $location, $anchorScroll, $ngRedux, $state) {
            return new SignupController($scope, $location, $anchorScroll, $ngRedux, $state);
        }
        signup.$inject = ['$scope', '$location', '$anchorScroll', '$ngRedux', '$state'];
        return signup;
    }
}

export default SignupController;
