import _ from 'lodash';

class PlanningAndGuidanceController {

    constructor($scope, $state) {
        this.scope = $scope;
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$postLink = this.postLink.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.extractDomainSelection = this.extractDomainSelection.bind(this);
    }

    onInit() {
        this.createFilters();
        const mockData = require('../resources/mockData');
        this.lessons = mockData.lessons;
        this.resources = mockData.resources;
        this.experiences = mockData.experiences;
        this.all = [].concat(this.lessons, this.resources, this.experiences);
        this.watchers();
    }

    postLink() {
        this.checkHash();
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

    watchers() {
        const self = this;
        this.scope.$watch(self.extractDomainSelection, self.applyFilters, true);
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
                domains: domains.map(checkbox => {
                    return { name: checkbox, selected: false };
                })
            };
        });
    }

    applyFilters(filters) {
        const selected = filters.map(filter => {
            if (filter.selected) {
                return filter.name;
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

    activate(name) {
        const newName = name || window.location.hash.replace('#', '');
        this.scope.$evalAsync(() => {
            this.active = newName;
            this.applyFilters(this.extractDomainSelection());
            if (name) {
                // Frye the current hash if present and add the new one
                this.state.go('cms', { '#': name }, { location: 'replace', reloadOnSearch: false});
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
        planningAndGuidance().$inject = ['$scope', '$state'];
        return planningAndGuidance;
    }
}

export default PlanningAndGuidanceController;
