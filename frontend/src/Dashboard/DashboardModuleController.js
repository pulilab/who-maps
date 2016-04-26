import chartData from './chartmock.js';
import chartData2 from './chartmock2.js';
import perfMockMap from './CountryMap/mock/perfMockMap.js';
import mockAxis from './mockAxis.js';

class DashboardModuleController {

    constructor() {
        const vm = this;
        vm.EE = window.EE;
        vm.linechartMockData = chartData;
        vm.linechartMockData2 = chartData2;
        vm.mockAxis = mockAxis;
        vm.perfMockMap = perfMockMap;

        vm.resizedw = () => {
            this.EE.emit('dashResized');
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
