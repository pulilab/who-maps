import CollapsibleSet from '../CollapsibleSet';
import _ from 'lodash';

class ImplementationOverview extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.ccs = require('../../Common/CustomCountryService');
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
        this.setAvailableOptions = this.setAvailableOptions.bind(this);
        this.mapInterventions = this.mapInterventions.bind(this);
    }

    onInit() {
        this.districtList = [];
        this.fetchDistricts = this.fetchDistricts.bind(this);
        this.validateCoverage = this.validateCoverage.bind(this);
        this.defaultOnInit();
        this.watchers();
        this.interventions = this.mapInterventions();
    }

    watchers() {
        const self = this;
        self.scope.$watch(() => {
            return this.project.platforms;
        }, (platform) => {
            self.setAvailableOptions(platform, self.structure.technology_platforms, 'name');
            self.addOtherOption(platform);
        }, true);

        self.scope.$watch(() => {
            return this.project.country;
        }, self.fetchDistricts);

        self.scope.$watch(()=>{
            return this.project.coverage;
        }, () => {
            self.observeCoverage = {};
        }, true);

        self.scope.$watchGroup([() => {
            return this.observeCoverage;
        }, () => {
            return this.districtList;
        }], ([, districts]) => {
            self.setAvailableOptions(self.project.coverage, districts, 'district');
        });
    }

    addOtherOption(platform) {
        platform.forEach(p => {
            if (p.available.indexOf('Other') === -1) {
                p.available.push('Other');
            }
        });
    }

    mapInterventions() {
        return [{
            name: '',
            subGroups: this.structure.interventions
        }];
    }

    validateCoverage(current, item) {

        let nld;
        if (this.project.national_level_deployment) {
            nld = [
                this.project.national_level_deployment.health_workers,
                this.project.national_level_deployment.facilities,
                this.project.national_level_deployment.clients
            ];
        }
        else {
            nld = [null];
        }

        if (current === 'nld' && this.project.national_level_deployment) {
            return _.some(nld);
        }
        else if (current === 'dld') {
            return _.some([
                item.district,
                !_.isNil(item.health_workers),
                !_.isNil(item.facilities),
                !_.isNil(item.clients),
                _.every(nld, _.isNull)
            ]);
        }
        return false;
    }

    fetchDistricts(country) {
        const self = this;
        if (country) {
            self.ccs.getCountryDistricts(country)
                .then(self.handleDistrictData.bind(self));
        }
    }

    handleDistrictData(data) {
        this.project.coverage.forEach(cov => {
            if (data.indexOf(cov.district) === -1) {
                cov.district = undefined;
            }
        });
        this.districtList = data;
        this.scope.$evalAsync();
    }

    handleCustomError(key) {
        this.form[key].$setValidity('custom', true);
        this.form[key].customError = [];
    }

    setCustomError(key, error) {
        const errors = this.form[key].customError || [];
        if (errors.indexOf('error') === -1) {
            errors.push(error);
        }
        this.form[key].$setValidity('custom', false);
        this.form[key].customError = errors;
    }


    static factory() {
        require('./ImplementationOverview.scss');
        function implementation($scope, $element) {
            return new ImplementationOverview($scope, $element);
        }
        implementation.$inject = ['$scope', '$element'];
        return implementation;
    }
}

export default ImplementationOverview;
