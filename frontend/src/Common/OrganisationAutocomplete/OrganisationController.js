import _ from 'lodash';
import OrganisationService from './OrganisationService';

export default class OrganisationController {

    constructor($scope) {
        this.scope = $scope;
        this.os = new OrganisationService();
        this.$onInit = this.onInit.bind(this);
        this.addOrganisation = this.addOrganisation.bind(this);
        this.organisationSearch = this.organisationSearch.bind(this);
        this.handleOrganisationBlur = this.handleOrganisationBlur.bind(this);
    }

    onInit() {
        this.createBlurHandler();
    }

    createBlurHandler() {
        this.scope.$$postDigest(() => {
            document.querySelector('#organisation')
                .querySelector('input')
                .addEventListener('blur', this.handleOrganisationBlur);
        });
    }

    handleOrganisationBlur() {
        const typed = _.first(this.latestOrgs);
        if (typed) {
            if (!this.organisation || (this.organisation && typed.name !== this.organisation.name)) {
                this.addOrganisation(typed);
            }
        }
    }

    organisationSearch(name) {
        const promise  = this.os.autocompleteOrganization(name);
        promise.then(data => {
            const input = { id: null, name, manual: true };
            if (!data.some(item => item.name === name)) {
                data.splice(0, 0, input);
            }
            this.latestOrgs = data;
        });
        return promise;
    }

    addOrganisation(organisation) {
        if (organisation && organisation.manual && organisation.name.length < 101) {
            this.os.addOrganization(organisation.name)
                .then(response => {
                    this.scope.$evalAsync(() => {
                        this.organisation = response;
                        Object.assign(this.latestOrgs[0], response);
                    });
                });
        }
        else {
            this.organisation = organisation;
        }
    }

    static organisationFactory() {
        require('./Organisation.scss');
        function organisation($scope) {
            return new OrganisationController($scope);
        }
        organisation.$inject = ['$scope'];
        return organisation;
    }
}
