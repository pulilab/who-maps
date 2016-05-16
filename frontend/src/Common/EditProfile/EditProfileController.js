import _ from 'lodash';

import EditProfileService from './EditProfileService';
import Protected from '../Protected';
import Storage from '../Storage';
import CommonService  from '../CommonServices';

/* global DEV, Promise */

class EditProfileController extends Protected {

    constructor($scope, $state) {
        super();
        this.es = new EditProfileService();
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.storage = new Storage();
        this.$onInit = this.initialization.bind(this);
        this.bindFunctions();
    }

    bindFunctions() {
        this.countryCloseCallback = this.countryCloseCallback.bind(this);
    }

    initialization() {
        this.cs = CommonService;
        this.dataLoaded = false;
        this.sentForm = false;
        this.handleDataLoad();
    }

    handleDataLoad() {
        this.userProjects = this.cs.projectList;
        this.structure = this.cs.projectStructure;
        this.userProfile = this.cs.userProfile;
        if (!this.userProfile || !this.userProfile.email) {
            const user = this.storage.get('user');
            this.userProfile = {
                email: user.username
            };
        }
        this.dataLoaded = true;
        this.scope.$watch(() => {
            return this.userProfile;
        }, value => {
            if (value && value.modified) {
                this.userProfile.modified = this.userProfile.modified.split('T')[0];
            }
        });
    }

    countryCloseCallback(name) {
        this.userProfile.country = name;
        this.handleCustomError('country');
    }

    checkErrors(field) {
        if (this.editProfileForm && this.editProfileForm[field]) {
            return !_.isEmpty(this.editProfileForm[field].$error);
        }
        return false;
    }


    save() {
        this.sentForm = true;
        if (this.editProfileForm.$valid) {
            const request = this.userProfile.id ?
                this.es.updateProfile(this.userProfile) : this.es.createProfile(this.userProfile);
            request.then(result => {
                if (result.success) {
                    const rs = this.cs.reset();
                    rs.loadedPromise.then(() => {
                        this.state.go('dashboard').then(() => {
                            // success, do nothing
                        }, () => {
                            // error in state change, reload the window
                            window.location.reload();
                        });
                    });
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
