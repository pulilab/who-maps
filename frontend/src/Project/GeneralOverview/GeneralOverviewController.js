import _ from 'lodash';
import moment from 'moment';
import CollapsibleSet from '../CollapsibleSet';
import * as ProjectModule from '../../store/modules/projects';
import * as CountriesModule from '../../store/modules/countries';


class GeneralOverviewController extends CollapsibleSet {

    constructor($scope, $element, $state, $ngRedux) {
        super($element, $scope, 'project');
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.defaultOnDestroy.bind(this);
        this.mapData = this.mapData.bind(this);
        this.unsubscribe = $ngRedux.connect(this.mapData, ProjectModule)(this);
    }

    mapData(state) {
        const similarProject = ProjectModule.getSimilarProject(state)
          .filter(p =>  !this.project || p.id !== this.project.id);
        return {
            similarProject,
            countriesList : CountriesModule.getCountriesList(state)
        };
    }

    bindFunctions() {
        this.getUsers = this.getUsers.bind(this);
        this.checkName = this.checkName.bind(this);
        this.validateDateRange = this.validateDateRange.bind(this);
    }

    onInit() {
        this.defaultOnInit();
        this.bindFunctions();
        this.watchers();
    }

    watchers() {
        const self = this;
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

    getUsers(criteria) {
        return this.users.filter(el => {
            // Avoid to search user that have no proper profile.
            if (el && el.name && el.organisation_name) {
                return _.includes(el.name.toLowerCase(), criteria.toLowerCase()) ||
                  _.includes(el.organisation_name.toLowerCase(), criteria.toLowerCase());
            }
            return false;
        });
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

    async checkName() {
        this.handleCustomError('name');
        if (this.project.name && this.project.name.length > 0 && this.project.name !== this.currentName) {
            await this.searchDuplicateProjectName(this.project.name);
            if (this.similarProject && this.similarProject[0]
              && this.similarProject[0].name.toLowerCase() === this.project.name.toLowerCase()) {
                this.setCustomError('name', 'Project name is not unique');
            }
        }
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


    static factory() {
        require('./GeneralOverview.scss');
        function generalOverview($scope, $element, $state, $ngRedux) {
            return new GeneralOverviewController($scope, $element, $state, $ngRedux);
        }
        generalOverview.$inject = ['$scope', '$element', '$state', '$ngRedux'];
        return generalOverview;
    }
}

export default GeneralOverviewController;
