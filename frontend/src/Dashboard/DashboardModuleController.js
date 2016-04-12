import chartData from './chartmock.js';
import chartData2 from './chartmock2.js';

class DashboardModuleController {

    constructor() {
        const vm = this;
        vm.linechartMockData = chartData;
        vm.linechartMockData2 = chartData2;

        function resizedw() {
            window.EE.emit('dashResized');
        }

        let doit;
        window.onresize = () => {
            clearTimeout(doit);
            doit = setTimeout(resizedw, 50);
        };
    }

    static printAndReturnSome() {
        console.log('some');
        return 'some';
    }
}

export default DashboardModuleController;
