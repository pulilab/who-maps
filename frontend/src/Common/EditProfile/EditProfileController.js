import _ from 'lodash';

import Storage from '../Storage';
import CommonService  from '../CommonServices';
import * as UserModule from '../../store/modules/user';

/* global DEV, Promise */

class EditProfileController  {

    constructor($scope, $state, $mdToast, $ngRedux) {
        this.EE = window.EE;
        this.ccs = require('../CustomCountryService');
        this.scope = $scope;
        this.state = $state;
        this.toast = $mdToast;
        this.storage = new Storage();
        this.$onInit = this.initialization.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.bindFunctions();
        this.unsubscribe = $ngRedux.connect(this.mapState, UserModule)(this);
    }

    bindFunctions() {
        this.countryCloseCallback = this.countryCloseCallback.bind(this);
    }

    mapState(state) {
        return {
            userProfile: state.user.profile
        };
    }

    onDestroy() {
        this.unsubscribe();
    }

    initialization() {
        this.cs = CommonService;
        this.dataLoaded = false;
        this.sentForm = false;
        this.handleDataLoad();
    }

    handleDataLoad() {
        const self = this;
        this.userProjects = this.cs.projectList;
        this.structure = this.cs.projectStructure;
        this.rawName = this.userProfile.name;
        this.ccs.getCountries().then(data => {
            self.scope.$evalAsync(() => {
                self.countriesList = data;
            });
        });
        this.dataLoaded = true;
        this.scope.$watch(() => {
            return this.userProfile;
        }, value => {
            if (value && value.modified) {
                this.userProfile.modified = this.userProfile.modified.split('T')[0];
            }
        });
    }

    showToast(text) {
        this.toast.show(
          this.toast.simple()
            .textContent(text)
            .position('bottom right')
            .hideDelay(3000)
        );
    }


    countryCloseCallback(name) {
        this.setCountry(name);
        this.handleCustomError('country');
    }

    isViewer(project) {
        return this.cs.isViewer(project);
    }

    isMember(project) {
        return this.cs.isMember(project);
    }

    checkErrors(field) {
        if (this.editProfileForm && this.editProfileForm[field]) {
            return !_.isEmpty(this.editProfileForm[field].$error);
        }
        return false;
    }


    async save() {
        this.sentForm = true;
        if (this.editProfileForm.$valid && this.userProfile.organisation) {
            try {
                await this.saveProfile();
            }
            catch (data) {
                this.handleResponse(data);
            }

        }
        else {
            this.showToast('Validation error');
        }
    }

    handleResponse(response) {
        _.forEach(response.data, (item, key) => {
            this.editProfileForm[key].customError = item;
            this.editProfileForm[key].$setValidity('custom', false);
        });
        this.showToast('Ops! Something went wrong');
    }

    handleCustomError(key) {
        this.editProfileForm[key].$setValidity('custom', true);
        this.editProfileForm[key].customError = [];
    }

    static editProfileFactory() {
        require('./EditProfile.scss');

        function editProfile($scope, $state, $mdToast, $ngRedux) {
            return new EditProfileController($scope, $state, $mdToast, $ngRedux);
        }

        editProfile.$inject = ['$scope', '$state', '$mdToast', '$ngRedux'];

        return editProfile;
    }
}

export default EditProfileController;
