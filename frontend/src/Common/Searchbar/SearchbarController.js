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
        vm.projects = void 0;

        vm.isMember = vm.isMember.bind(this);
        vm.isViewer = vm.isViewer.bind(this);

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
        const self = this;
        self.cs  = require('../CommonServices');
        self.cs.loadedPromise.then(()=> {
            self.userProjects = self.cs.projectList;
            self.viewer = self.cs.userProfile.viewer;
            self.member = self.cs.userProfile.member;
        });
    }

    toggleSearch() {
        this.showSearch = !this.showSearch;
    }

    isViewer(project) {
        if (this.cs) {
            return this.cs.isViewer(project);
        }
        return false;
    }

    isMember(project) {
        if (this.cs) {
            return this.cs.isMember(project);
        }
        return false;
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

    checkboxChecks(filter) {
        if (filter.name === 'all' && filter.value) {
            this.filters = _.map(this.filters, (f) => {
                if (f.name !== 'all') {
                    f.value = false;
                }
                return f;
            });
        } else if (filter.name !== 'all' && filter.value) {
            this.filters = _.map(this.filters, (f) => {
                if (f.name === 'all') {
                    f.value = false;
                }
                return f;
            });
        } else if (!filter.value && _.every(this.filters, (f) => {
            return !f.value;
        })) {
            this.filters = _.map(this.filters, (f) => {
                if (f.name === 'all') {
                    f.value = true;
                }
                return f;
            });
        }

        this.search(this.searchStr);
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
