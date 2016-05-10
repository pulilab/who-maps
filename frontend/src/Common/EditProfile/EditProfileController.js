import _ from 'lodash';

import EditProfileService from './EditProfileService';
import Protected from '../Protected';
import CommonService  from '../CommonServices';

/* global DEV, Promise */

class EditProfileController extends Protected {

    constructor($scope, $state) {
        super();
        this.es = new EditProfileService();
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$onInit = this.initialization.bind(this);
        this.bindFunctions();
    }

    bindFunctions() {
        this.countryCloseCallback = this.countryCloseCallback.bind(this);
    }

    initialization() {
        this.commonService = CommonService;
        this.dataLoaded = false;
        this.sentForm = false;
        this.handleDataLoad();
    }

    handleDataLoad() {
        this.userProjects = this.commonService.projectList;
        this.structure = this.commonService.projectStructure;
        this.dataLoaded = true;
        this.scope.$watch(() => {
            return this.userProfile.modified;
        }, value => {
            if (value) {
                this.userProfile.modified = this.userProfile.modified.split('T')[0];
            }
        });
    }

    countryCloseCallback(name) {
        this.userProfile.country = name;
        this.handleCustomError('country');
    }

    checkErrors(field) {
        return !_.isEmpty(this.editProfileForm[field].$error);
    }


    save() {
        this.sentForm = true;
        if (this.editProfileForm.$valid) {
            this.es.updateProfile(this.userProfile)
                .then(result => {
                    if (result.success) {
                        this.state.go('dashboard');
                    }
                    else {
                        this.handleResponse(result.data);
                    }
                });
        }
    }

    handleResponse(response) {
        _.forEach(response.data, (item, key) => {
            this.editProfileForm[key].customError = item;
            this.editProfileForm[key].$setValidity('custom', false);
        });
    }

    handleCustomError(key) {
        this.editProfileForm[key].$setValidity('custom', true);
        this.editProfileForm[key].customError = [];
    }


    static editProfileFactory() {
        require('./EditProfile.scss');

        function editProfile($scope, $state) {
            return new EditProfileController($scope, $state);
        }

        editProfile.$inject = ['$scope', '$state'];

        return editProfile;
    }
}

export default EditProfileController;
