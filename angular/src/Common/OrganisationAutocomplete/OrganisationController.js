import * as SystemModule from '../../store/modules/system';

export default class OrganisationController {
  constructor ($scope, $ngRedux) {
    this.scope = $scope;
    this.$ngRedux = $ngRedux;
    this.organisationSearch = this.organisationSearch.bind(this);
    this.$onInit = this.onInit.bind(this);
    this.$onDestroy = this.onDestroy.bind(this);
    this.mapData = this.mapData.bind(this);
  }

  mapData (state) {
    return {
      organisations: SystemModule.getOrganisations(state)
    };
  }

  onInit () {
    this.unsubscribe = this.$ngRedux.connect(this.mapData, SystemModule)(this);
    this.scope.$watch(s => s.vm.organisation, (organisation, old) => {
      if ((!old && organisation && organisation.id) ||
            (organisation && organisation.id && organisation.id !== old.id)) {
        if (this.callOnChange && this.callOnChange instanceof Function) {
          this.callOnChange('organisation', this.organisation);
        }
      }
    });
  }

  onDestroy () {
    this.unsubscribe();
  }

  organisationSearch (name) {
    const data = this.organisations.filter(o => o.name.toLowerCase().includes(name.toLowerCase()));
    const input = { id: null, name };
    const match = data.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (!match) {
      data.splice(0, 0, input);
      this.organisation = input;
    } else {
      this.organisation = match;
    }
    return data;
  }

  static organisationFactory () {
    require('./Organisation.scss');
    function organisation ($scope, $ngRedux) {
      return new OrganisationController($scope, $ngRedux);
    }
    organisation.$inject = ['$scope', '$ngRedux'];
    return organisation;
  }
}
