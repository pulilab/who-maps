import _ from 'lodash';
import SearchbarService from './SearchbarService';

class SearchbarController {

    constructor($state, $scope) {
        const vm = this;
        vm.EE = window.EE;
        vm.scope = $scope;
        vm.state = $state;
        vm.ss = new SearchbarService();
        vm.$onInit = vm.initialisation.bind(vm);
        vm.filters = [
            {
                name: 'location',
                displayName: 'Location',
                value: false
            },
            {
                name: 'project_name',
                displayName: 'Project name',
                value: true
            },
            {
                name: 'health_topic',
                displayName: 'Health topic',
                value: false
            },
            {
                name: 'technology_platform',
                displayName: 'Technology platform',
                value: false
            },
            {
                name: 'organisation',
                displayName: 'Organization',
                value: false
            }
        ];
        vm.searchStr = '';

        vm.scope.$watch(() => {
            return vm.searchStr;
        }, tmpStr => {
            vm.search(tmpStr);
        });
    }

    initialisation() {
        this.showSearch = false
    }

    toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    search(tmpStr) {
        const vm = this;
        if (!tmpStr || tmpStr.length === 0) {
            return false;
        }
        if (tmpStr === vm.searchStr) {
            if (_.some(vm.filters, {value: true})) {
                this.ss.searchProject(vm.searchStr, vm.filters).then(results => {
                    vm.projects = results;
                    vm.resultNr = _.min([results.length, 5]);
                    vm.totalNr = results.length;
                    vm.scope.$evalAsync();
                });
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

    static searchbarFactory() {
        require('./Searchbar.scss');
        function searchController($state, $scope) {
            return new SearchbarController($state, $scope);
        }

        searchController.$inject = ['$state', '$scope'];

        return searchController;
    }

}

export default SearchbarController;
