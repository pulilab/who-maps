import _ from 'lodash';

class PlanningAndGuidanceController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.extractDomainSelection = this.extractDomainSelection.bind(this);
    }

    onInit() {
        this.activate('all');
        this.createFilters();
        const mockData = require('../resources/mockData');
        this.lessons = mockData.lessons;
        this.resources = mockData.resources;
        this.experiences = mockData.experiences;
        this.all = [].concat(this.lessons, this.resources, this.experiences);
        this.watchers();
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
        this.scope.$evalAsync(() => {
            this.active = name;
            this.applyFilters(this.extractDomainSelection());
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
        function planningAndGuidance($scope) {
            return new PlanningAndGuidanceController($scope);
        }
        planningAndGuidance().$inject = ['$scope'];
        return planningAndGuidance;
    }
}

export default PlanningAndGuidanceController;
