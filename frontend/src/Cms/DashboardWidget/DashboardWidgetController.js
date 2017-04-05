class DashboardWidgetController {

    constructor() {
    }

    static factory() {
        require('./DashboardWidget.scss');
        function dashboardWidgetController() {
            return new DashboardWidgetController();
        }
        dashboardWidgetController().$inject = [];
        return dashboardWidgetController;
    }
}

export default DashboardWidgetController;
