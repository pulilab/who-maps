import _ from 'lodash';
import moment from 'moment';
import CollapsibleSet from '../CollapsibleSet';
import ProjectService from '../ProjectService';


class ProjectDetailsController extends CollapsibleSet {

    constructor($scope, $element) {
        super($element, $scope, 'project');
        this.ccs = require('../../Common/CustomCountryService');
        this.ns = new ProjectService();
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
    }

    bindFunctions() {
        this.fetchDistricts = this.fetchDistricts.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.checkName = this.checkName.bind(this);
        this.validateDateRange = this.validateDateRange.bind(this);
        this.validateCoverage = this.validateCoverage.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.bindFunctions();
        this.watchers();
        this.getStructureData();
        this.districtList = [];
        this.projectList = [];
    }

    watchers() {
        const self = this;
        self.scope.$watch(() => {
            return this.project.country;
        }, self.fetchDistricts);

        self.scope.$watch(() => {
            return this.project.name;
        }, name => {
            self.currentName = self.currentName || name;
        });

        self.scope.$watchGroup([() => {
            return this.project.start_date;
        }, () => {
            return this.project.end_date;
        }], self.validateDateRange);

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

    validateDateRange([start, end]) {
        if (!start || !end) {
            return;
        }
        start = moment(start);
        end = moment(end);
        if (start.isAfter(end)) {
            this.setCustomError('start_date', 'Start date can not be later than the end date');
            this.setCustomError('end_date', 'End date can not be earlier than the start date');
        }
        else {
            this.handleCustomError('start_date');
            this.handleCustomError('end_date');
        }
    }
    getStructureData() {
        const self = this;
        this.ccs.getCountries().then(data => {
            self.scope.$evalAsync(() => {
                self.countriesList = data;
            });
        });
    }

    getUsers(criteria) {
        return this.users.filter(el => {
            if (el && el.name) {
                return _.includes(el.name.toLowerCase(), criteria.toLowerCase()) ||
                    _.includes(el.organisation_name.toLowerCase(), criteria.toLowerCase());
            }
            return false;
        });
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

    checkName() {
        const self = this;
        this.handleCustomError('name');
        if (self.project.name && self.project.name.length > 0 && self.project.name !== self.currentName) {
            self.ns.autocompleteProjectName(self.project.name)
                .then(result => {
                    _.forEach(result, project => {
                        project.isOwn = _.find(self.projectList, pj => {
                            return pj.id === project.id;
                        });
                    });
                    result = result.filter(project => {
                        return project.name !== self.currentName;
                    });
                    self.similarProject = result;
                    if (result && result[0] && result[0].name.toLowerCase() === self.project.name.toLowerCase()) {
                        self.setCustomError('name', 'Project name is not unique');
                    }
                    self.scope.$evalAsync();
                });
        }
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
                !_.isNull(item.health_workers),
                !_.isNull(item.facilities),
                !_.isNull(item.clients),
                _.every(nld, _.isNull)
            ]);
        }
        return false;
    }

    openSimilarProject(project, event) {
        event.preventDefault();
        if (project.isOwn) {
            this.state.go('dashboard', { appName: project.id });
        }
        else {
            this.state.go('public-dashboard', { appName: project.id });
        }

    }


    static projectDetailFactory() {
        require('./ProjectDetails.scss');
        function projectDetail($scope, $element) {
            return new ProjectDetailsController($scope, $element);
        }
        projectDetail.$inject = ['$scope', '$element'];
        return projectDetail;
    }
}

export default ProjectDetailsController;
