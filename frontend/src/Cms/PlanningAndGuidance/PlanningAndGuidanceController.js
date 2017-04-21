import _ from 'lodash';

class PlanningAndGuidanceController {

    constructor($scope, $state) {
        this.scope = $scope;
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$postLink = this.postLink.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.extractDomainSelection = this.extractDomainSelection.bind(this);
        this.applyLimitOrSearch = this.applyLimitOrSearch.bind(this);
    }

    onInit() {
        this.cs = require('../CmsService');
        this.createFilters();
        this.lessons = [];
        this.resources = [];
        this.experiences = [];
        this.all = [];
        this.showLimit = 10;
        this.showAllFlag = false;
        this.getData();
        this.searchText = null;
        this.watchers();
    }

    postLink() {
        this.checkHash();
    }

    getData() {
        this.cs.getData().then(data => {
            this.scope.$evalAsync(() => {
                data.forEach(item => { item.searchOccurrences = 0; });
                this.all = data;
            });
        });
    }

    checkHash() {
        setTimeout(() => {
            const hash = window.location.hash;
            if (!hash || ['#all', '#lessons', '#experiences', '#resources'].indexOf(hash) === -1) {
                this.activate('all');
            }
            else {
                this.activate();
            }
        }, 100);

    }

    toggleShowAll() {
        this.showAllFlag = !this.showAllFlag;
    }

    watchers() {
        this.scope.$watch(this.extractDomainSelection, this.applyFilters, true);
        this.scope.$watchGroup([s => s.vm.toShow, s => s.vm.showAllFlag, s => s.vm.searchText], this.applyLimitOrSearch);
        this.scope.$watchCollection(s => s.vm.all, data => {
            this.lessons = data.filter(item => item.type === 1);
            this.resources = data.filter(item => item.type === 2);
            this.experiences = data.filter(item => item.type === 3);
            this.activate();
        });
    }

    stripHtml(text) {
        const regex = /(<([^>]+)>)/ig;
        return text.replace(regex, '');
    }

    applyLimitOrSearch([toShow, showAllFlag, searchText]) {
        if (toShow && showAllFlag) {
            this.showLimit = toShow.length;
        }
        else {
            this.showLimit = 10;
        }
        if (searchText && searchText !== this.prevSearchText) {
            this.prevSearchText = searchText;
            const slice = this.toShow.slice();
            searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(searchText, 'ig');
            slice.forEach(item => {
                const strip = this.stripHtml(item.body);
                const match = strip.match(regex);
                item.searchOccurrences = match ? match.length : 0;
            });
            this.scope.$evalAsync(() => {
                this.toShow = slice;
            });
        }
        else if (this.toShow && !searchText && searchText !== this.prevSearchText) {
            this.prevSearchText = searchText;
            const slice = this.toShow.slice();
            slice.forEach(item => {
                item.searchOccurrences =  0;
            });
            this.scope.$evalAsync(() => {
                this.toShow = slice;
            });
        }
    }

    extractDomainSelection() {
        return _.flatMap(this.filters, filter => {
            return filter.domains;
        });
    }

    createFilters() {
        const rawFilters = require('../resources/domains');
        this.filters = rawFilters.map(({ name, domains }) => {
            return {
                name,
                open: false,
                selected: false,
                domains: domains.map((domain) => {
                    return { name: domain.name, id: domain.id, selected: false };
                })
            };
        });
    }

    applyFilters(filters) {
        const selected = filters.map(filter => {
            if (filter.selected) {
                return filter.id;
            }
            return null;
        }).filter(filter => filter);
        if (selected.length > 0) {
            this.toShow = this[this.active].filter(item => {
                return selected.indexOf(item.domain) > -1;
            });
        }
        else {
            this.toShow = this[this.active];
        }
    }

    clearFilters() {
        this.filters.forEach(filter => {
            filter.selected = false;
            filter.domains.forEach(domain => {
                domain.selected = false;
            });
        });
    }
    clearSearch() {
        this.searchText = null;
    }

    activate(name) {
        const newName = name || window.location.hash.replace('#', '') || 'all';
        this.scope.$evalAsync(() => {
            this.active = newName;
            this.applyFilters(this.extractDomainSelection());
            if (name) {
                // Frye the current hash if present and add the new one
                this.state.go('cms', { '#': name }, { location: 'replace', reloadOnSearch: false });
            }
        });
    }

    toggleFilterGroup(group) {
        group.open = !group.open;
    }

    toggleAll(group) {
        group.domains.forEach(checkbox => {
            checkbox.selected = group.selected;
        });
        if (group.selected) {
            group.open = true;
        }
    }

    static factory() {
        require('./PlanningAndGuidance.scss');
        function planningAndGuidance($scope, $state) {
            return new PlanningAndGuidanceController($scope, $state);
        }
        planningAndGuidance.$inject = ['$scope', '$state'];
        return planningAndGuidance;
    }
}

export default PlanningAndGuidanceController;
