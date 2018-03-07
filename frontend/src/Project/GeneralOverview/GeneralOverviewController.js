import includes from 'lodash/includes';
import moment from 'moment';
import CollapsibleSet from '../CollapsibleSet';
import * as ProjectModule from '../../store/modules/projects';
import * as CountriesModule from '../../store/modules/countries';


class GeneralOverviewController extends CollapsibleSet {

    constructor($scope, $element, $state, $ngRedux) {
        super($element, $scope, 'project', [], [], $ngRedux);
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.mapData = this.mapData.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.checkName = this.checkName.bind(this);
        this.validateDateRange = this.validateDateRange.bind(this);
        this.openSimilarProject = this.openSimilarProject.bind(this);
    }

    mapData(state) {
        const similarProject = ProjectModule.getSimilarProject(state)
          .filter(p =>  !this.project || p.id !== this.project.id);
        return {
            similarProject,
            countriesList : CountriesModule.getCountriesList(state)
        };
    }

    onInit() {
        this.defaultOnInit();
        this.unsubscribe = this.$ngRedux.connect(this.mapData, ProjectModule)(this);
        this.watchers();
    }

    onDestroy() {
        this.defaultOnDestroy();
        this.unsubscribe();
    }

    watchers() {
        this.scope.$watch(
            s => s.vm.project.name,
            name => {
                this.projectName = name;
                this.currentName = this.currentName || name;
            }
        );

        this.scope.$watchGroup(
             [s => s.vm.project.start_date, s => s.vm.project.end_date],
             this.validateDateRange
        );
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
                return includes(el.name.toLowerCase(), criteria.toLowerCase()) ||
                  includes(el.organisation_name.toLowerCase(), criteria.toLowerCase());
            }
            return false;
        });
    }

    async checkName() {
        this.handleCustomError('name');
        if (this.projectName && this.projectName.length > 0 && this.projectName !== this.currentName) {
            await this.searchDuplicateProjectName(this.projectName);
            if (this.similarProject && this.similarProject[0]
              && this.similarProject[0].name.toLowerCase() === this.projectName.toLowerCase()) {
                this.setCustomError('name', 'Project name is not unique');
                this.dispatchChange('name', null);
            }
            else {
                this.dispatchChange('name', this.projectName);
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
