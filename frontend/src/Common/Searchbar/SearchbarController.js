import min from 'lodash/min';
import map from 'lodash/map';
import every from 'lodash/every';
import * as SystemModule from '../../store/modules/system';

class SearchbarController {

    constructor($state, $scope, $ngRedux, filters) {
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.mapState = this.mapState.bind(this);
        this.filters = filters;
        this.unsubscribe = $ngRedux.connect(this.mapState, SystemModule)(this);
    }

    mapState(state) {
        return {
            projects: SystemModule.getSearchResult(state)
        };
    }

    onInit() {
        this.showSearch = false;
        this.searchStr = '';
        this.resultNr = 0;
        this.scope.$watch(() => {
            return this.searchStr;
        }, tmpStr => {
            this.search(tmpStr);
        });
    }

    onDestroy() {
        this.unsetSearchedProjects();
        this.unsubscribe();
    }


    toggleSearch() {
        this.showSearch = !this.showSearch;
        if (!this.showSearch) {
            this.unsetSearchedProjects();
        }
    }


    async search(tmpStr) {
        if (!tmpStr || tmpStr.length === 0) {
            return false;
        }
        if (tmpStr === this.searchStr) {
            if (this.filters.some(v => v.value)) {
                await this.searchProjects(this.searchStr, this.filters);
                this.resultNr = min([this.projects.length, 5]);
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
        this.filters = map(this.filters, (f) => {
            if (filter.name === 'all' && filter.value && f.name !== 'all') {
                f.value = false;
            }
            else if (filter.name !== 'all' && filter.value && f.name === 'all') {
                f.value = false;
            }
            else if (!filter.value && every(this.filters, (ff) => {
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
