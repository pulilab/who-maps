import _ from 'lodash';
import * as SystemModule from '../../store/modules/system';

class SearchbarController {

    constructor($state, $scope, $ngRedux, filters) {
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.filters = filters;

        this.unsubscribe = $ngRedux.connect(this.mapState, SystemModule)(this);


        this.isMember = this.isMember.bind(this);
        this.isViewer = this.isViewer.bind(this);

    }

    mapState(state) {
        return {
            viewer: state.user.profile ? state.user.profile.viewer : [],
            member: state.user.profile ? state.user.profile.member : [],
            userProjects: state.projects,
            projects: state.system.projectSearch
        };
    }

    onInit() {
        this.showSearch = false;
        this.searchStr = '';
        this.resultNr = 0;
        this.projects = void 0;
        this.scope.$watch(() => {
            return this.searchStr;
        }, tmpStr => {
            this.search(tmpStr);
        });
    }

    onDestroy() {
        this.unsubscribe();
    }


    toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    isViewer(project) {
        if (this.viewer) {
            return this.viewer.some(v => v === project);
        }
        return false;
    }

    isMember(project) {
        if (this.member) {
            return this.member.some(m => m === project);
        }
        return false;
    }


    async search(tmpStr) {
        if (!tmpStr || tmpStr.length === 0) {
            return false;
        }
        if (tmpStr === this.searchStr) {
            if (this.filters.some(v => v.value)) {
                await this.searchProjects(this.searchStr, this.filters);
                this.resultNr = _.min([this.projects.length, 5]);
                this.totalNr = this.projects.length;
            }
        }
        return true;
    }

    close() {
        this.showSearch = false;
        this.searchStr = '';
        this.projects = void 0;
        this.totalNr = 0;
        this.resultNr = 0;
    }

    checkboxChecks(filter) {
        this.filters = _.map(this.filters, (f) => {
            if (filter.name === 'all' && filter.value && f.name !== 'all') {
                f.value = false;
            }
            else if (filter.name !== 'all' && filter.value && f.name === 'all') {
                f.value = false;
            }
            else if (!filter.value && _.every(this.filters, (ff) => {
                return !ff.value;
            })) {
                f.value = true;
            }
            return f;
        });

        this.search(this.searchStr);
    }

    static searchbarFactory() {
        require('./Searchbar.scss');
        const filters = require('./Resource/filters.json');
        function searchController($state, $scope, $ngRedux) {
            return new SearchbarController($state, $scope, $ngRedux, filters);
        }

        searchController.$inject = ['$state', '$scope', '$ngRedux'];

        return searchController;
    }

}

export default SearchbarController;
