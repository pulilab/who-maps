import chartData from './chartmock.js';
import chartData2 from './chartmock2.js';

class DashboardModuleController {

    constructor() {
        const vm = this;
        vm.linechartMockData = chartData;
        vm.linechartMockData2 = chartData2;

        vm.resizedw = () => {
            window.EE.emit('dashResized');
        };

        let doit;
        vm.resizefn = () => {

            clearTimeout(doit);
            doit = setTimeout(vm.resizedw, 50);
        };
        window.onresize = vm.resizefn;
    }

    static dashboardControllerFactory() {
        function dashController() {

            return new DashboardModuleController();
        }

        dashController.$inject = [];

        return dashController;
    }
}

export default DashboardModuleController;
