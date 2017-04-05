class DashboardWidgetController {

    constructor() {
    }

    static factory() {
        require('./ExperiencesList.scss');
        function experienceListController() {
            return new DashboardWidgetController();
        }
        experienceListController().$inject = [];
        return experienceListController;
    }
}

export default DashboardWidgetController;
