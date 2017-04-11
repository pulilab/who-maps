class DashboardWidgetController {

    constructor() {
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
        const mockData = require('../resources/mockData');
        this.lessons = mockData.lessons;
        this.resources = mockData.resources;
        this.experiences = mockData.experiences;
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
