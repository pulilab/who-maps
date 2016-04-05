import chartData from './chartmock.js';

class DashboardModuleController {

    constructor() {
        const vm = this;
        vm.linechartMockData = chartData;
    }

    static printAndReturnSome() {
        console.log('some');
        return 'some';
    }
}

export default DashboardModuleController;
