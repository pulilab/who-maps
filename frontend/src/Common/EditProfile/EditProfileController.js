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
        this.createBlurHandle();
    }

    createBlurHandle() {

        this.scope.$$postDigest(() => {

            document.querySelector('#orgauto')
                .querySelector('input')
                .addEventListener('blur', () => {
                    if (!this.latestOrgs.some(org => org.name === this.searchText)) {
                        this.addOrganisation(this.searchText);
                    }
                });
        });
    }

    handleDataLoad() {
        this.userProjects = this.cs.projectList;
        this.structure = this.cs.projectStructure;
        this.userProfile = this.cs.userProfile;
        if (this.userProfile && this.userProfile.organisation && _.isNull(this.userProfile.organisation.name)) {
            this.userProfile.organisation = null;
        }
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


    save() {
        this.sentForm = true;
        if (this.editProfileForm.$valid && this.userProfile.organisation) {
            const profile = _.cloneDeep(this.userProfile);
            profile.organisation = this.userProfile.organisation.id;
            const request = profile.id ?
                this.es.updateProfile(profile) : this.es.createProfile(profile);
            request.then(result => {
                if (result.success) {
                    this.handleSuccessSave(result);
                }
                else {
                    this.handleResponse(result.data);
                }
            });
        }
    }

    handleSuccessSave(result) {
        this.storage.set('user_profile_id', result.data.id);
        const reset = this.cs.reset();
        this.cs.userProfileId = result.data.id;
        reset.loadedPromise.then(()=> {
            this.userProfile = this.cs.userProfile;
            this.EE.emit('profileUpdated');
            this.scope.$evalAsync();
        });
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

    organisationSearch(name) {
        const getOrgsPromise  = this.es.autocompleteOrganization(name);
        getOrgsPromise.then(data => {
            this.latestOrgs = data;
        });
        return getOrgsPromise;
    }

    addOrganisation(name) {
        return this.es.addOrganization(name)
            .then(response => {
                this.userProfile.organisation = response;
            });
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
