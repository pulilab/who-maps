import _ from 'lodash';
import SearchbarService from './SearchbarService';
import Storage from '../Storage';

class SearchbarController {

    constructor($state, $scope, filters) {
        const vm = this;
        vm.EE = window.EE;
        vm.scope = $scope;
        vm.state = $state;
        vm.storage = new Storage();
        vm.ss = new SearchbarService();
        vm.$onInit = vm.initialisation.bind(vm);
        vm.filters = filters;
        vm.searchStr = '';
        vm.resultNr = 0;
        vm.projects = [];

        vm.checkIfIsOwner = vm.checkIfIsOwner.bind(this);


        vm.scope.$watch(() => {
            return vm.searchStr;
        }, tmpStr => {
            vm.search(tmpStr);
        });
    }

    initialisation() {
        this.showSearch = false;
        this.isLogin = this.storage.get('login');
        if (this.isLogin) {
            this.getUserData();
        }
    }

    getUserData() {
        const commonServices = require('../CommonServices').default;
        this.userProjects = commonServices.projectList;
        console.log(this.userProjects);
    }

    toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    checkIfIsOwner(project) {
        const result = _.filter(this.userProjects, { id: project.id });
        return result.length > 0;
    }

    search(tmpStr) {
        const vm = this;
        if (!tmpStr || tmpStr.length === 0) {
            return false;
        }
        if (tmpStr === vm.searchStr) {
            if (_.some(vm.filters, { value: true })) {
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
        const filters = require('./Resource/filters.json');
        function searchController($state, $scope) {
            return new SearchbarController($state, $scope, filters);
        }

        searchController.$inject = ['$state', '$scope'];

        return searchController;
    }

}

export default SearchbarController;
