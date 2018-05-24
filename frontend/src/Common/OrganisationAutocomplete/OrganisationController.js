import { searchOrganisation } from '../../store/modules/system';

export default class OrganisationController {
  constructor ($scope) {
    this.scope = $scope;
    this.organisationSearch = this.organisationSearch.bind(this);
    this.$onInit = this.onInit.bind(this);
  }

  onInit () {
    this.scope.$watch(s => s.vm.organisation, (organisation, old) => {
      if ((!old && organisation && organisation.id) ||
            (organisation && organisation.id && organisation.id !== old.id)) {
        if (this.callOnChange && this.callOnChange instanceof Function) {
          this.callOnChange('organisation', this.organisation);
        }
      }
    });
  }

  async organisationSearch (name) {
    const data = await searchOrganisation(name);
    const input = { id: null, name };
    const match = data.find(item => item.name === name);
    if (!match) {
      data.splice(0, 0, input);
      this.organisation = input;
    } else {
      this.organisation = match;
    }
    this.latestOrgs = data;
    return Promise.resolve(data);
  }

  static organisationFactory () {
    require('./Organisation.scss');
    function organisation ($scope) {
      return new OrganisationController($scope);
    }
    organisation.$inject = ['$scope'];
    return organisation;
  }
}
