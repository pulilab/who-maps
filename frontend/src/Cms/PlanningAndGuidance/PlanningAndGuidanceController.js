class PlanningAndGuidanceController {

    constructor() {
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
