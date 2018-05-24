import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';

import * as UserModule from '../../store/modules/user';
import * as CountriesModule from '../../store/modules/countries';
import * as SystemModule from '../../store/modules/system';

class EditProfileController {
  constructor ($scope, $state, $mdToast, $ngRedux) {
    this.scope = $scope;
    this.state = $state;
    this.toast = $mdToast;
    this.$onInit = this.onInit.bind(this);
    this.$onDestroy = this.onDestroy.bind(this);
    this.mapState = this.mapState.bind(this);
    this.unsubscribe = $ngRedux.connect(this.mapState, UserModule)(this);
  }

  mapState (state) {
    const stateProfile = UserModule.getProfile(state);
    const userProfile = this.userProfile ? this.userProfile : stateProfile;
    return {
      userProfile,
      countriesList: CountriesModule.getCountriesList(state),
      languages: SystemModule.getLanguages(state)
    };
  }

  onDestroy () {
    this.unsubscribe();
  }

  onInit () {
    this.dataLoaded = false;
    this.handleDataLoad();
  }

  handleDataLoad () {
    this.rawName = this.userProfile ? this.userProfile.name : '';

    this.dataLoaded = true;
    this.scope.$watch(() => {
      return this.userProfile;
    }, value => {
      if (value && value.modified) {
        this.userProfile.modified = this.userProfile.modified.split('T')[0];
      }
    });
  }

  showToast (text) {
    this.toast.show(
      this.toast.simple()
        .textContent(text)
        .position('bottom right')
        .hideDelay(3000)
    );
  }

  checkErrors (field) {
    if (this.editProfileForm && this.editProfileForm[field]) {
      return !isEmpty(this.editProfileForm[field].$error);
    }
    return false;
  }

  async save () {
    if (this.editProfileForm.$valid && this.userProfile.organisation) {
      if (this.userProfile.organisation.id === null) {
        const organisation = await SystemModule.addOrganisation(this.userProfile.organisation.name);
        this.userProfile.organisation = {...organisation};
      }
      try {
        await this.saveProfile(this.userProfile);
        this.state.go('dashboard');
      } catch (data) {
        this.handleResponse(data);
      }
    } else {
      this.showToast('Validation error');
    }
  }

  handleResponse (response) {
    forEach(response.data, (item, key) => {
      this.editProfileForm[key].customError = item;
      this.editProfileForm[key].$setValidity('custom', false);
    });
    this.showToast('Ops! Something went wrong');
  }

  handleCustomError (key) {
    this.editProfileForm[key].$setValidity('custom', true);
    this.editProfileForm[key].customError = [];
  }

  static editProfileFactory () {
    require('./EditProfile.scss');

    function editProfile ($scope, $state, $mdToast, $ngRedux) {
      return new EditProfileController($scope, $state, $mdToast, $ngRedux);
    }

    editProfile.$inject = ['$scope', '$state', '$mdToast', '$ngRedux'];

    return editProfile;
  }
}

export default EditProfileController;
