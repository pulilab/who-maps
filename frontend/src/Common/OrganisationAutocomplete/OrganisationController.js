import first from 'lodash/first';
import { searchOrganisation, addOrganisation } from '../../store/modules/system';

export default class OrganisationController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.addOrganisationName = this.addOrganisationName.bind(this);
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
        const typed = first(this.latestOrgs);
        if (typed) {
            if (!this.organisation || (this.organisation && typed.name !== this.organisation.name)) {
                this.addOrganisationName(typed);
            }
        }
    }

    async organisationSearch(name) {
        const data = await searchOrganisation(name);
        const input = { id: null, name, manual: true };
        if (!data.some(item => item.name === name)) {
            data.splice(0, 0, input);
        }
        this.latestOrgs = data;
        return Promise.resolve(data);
    }

    async addOrganisationName(organisation) {
        if (organisation && organisation.manual && organisation.name.length < 101) {
            const response = await addOrganisation(organisation.name);
            this.scope.$evalAsync(() => {
                this.organisation = response;
                Object.assign(this.latestOrgs[0], response);
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
