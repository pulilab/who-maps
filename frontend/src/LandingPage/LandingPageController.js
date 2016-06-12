import _ from 'lodash';
import { trendingProjects } from './landingMock';
import { Storage } from '../Common/';
import SignupService from '../Common/Signup/SignupService';

class LandingPageModuleController {

    constructor($scope, $location, $anchorScroll) {
        this.storage = new Storage();
        this.ss = new SignupService();
        this.EE = window.EE;
        this.trendingProjects = trendingProjects;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);

    }

    onInit() {
        this.isLogin = this.storage.get('login');
        if (this.isLogin) {
            const commonService = require('../Common/CommonServices');
            this.projectList = commonService.projectList;
        }
    }

    onDestroy() {
        this.isLogin = void 0;
    }

    scrollTo(idString) {
        this.$location.hash(idString);
        this.$anchorScroll();
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
            const user = {
                username: this.register.email
            };
            this.storage.set('token', result.data.key);
            this.storage.set('user_profile_id', result.data.user_profile_id);
            this.storage.set('user', user);
            this.EE.emit('login');
        }
        else {
            _.forEach(result.data, (item, key) => {
                signupForm[key].customError = item;
                signupForm[key].$setValidity('custom', false);
            });
        }
    }

    static landingControllerFactory() {
        function landingController($scope, $location, $anchorScroll) {
            require('./landingPage.scss');
            return new LandingPageModuleController($scope, $location, $anchorScroll);
        }

        landingController.$inject = ['$scope', '$location', '$anchorScroll'];

        return landingController;
    }

}

export default LandingPageModuleController;
