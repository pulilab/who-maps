class PlanningAndGuidanceController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        this.active = 'all';
        this.createFilters();
    }

    createFilters() {
        const rawFilters = require('../resources/filters');
        this.filters = rawFilters.map(({ name, checkboxes }) => {
            return {
                name,
                open: false,
                selected: false,
                checkboxes: checkboxes.map(checkbox => {
                    return { name: checkbox, selected: false };
                })
            };
        });
    }

    activate(name) {
        this.active = name;
    }

    toggleFilterGroup(group) {
        group.open = !group.open;
    }

    toggleAll(group) {
        group.checkboxes.forEach(checkbox => {
            checkbox.selected = group.selected;
        });
        if (group.selected) {
            group.open = true;
        }
    }

    static factory() {
        require('./PlanningAndGuidance.scss');
        function planningAndGuidance() {
            return new PlanningAndGuidanceController();
        }
        planningAndGuidance().$inject = [];
        return planningAndGuidance;
    }
}

export default PlanningAndGuidanceController;
