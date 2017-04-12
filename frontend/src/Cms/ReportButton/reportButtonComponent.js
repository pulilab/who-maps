import ReportButtonController from './ReportButtonController';
import _template from './ReportButton.html';


const component = {
    template: _template,
    controller: ReportButtonController.factory(),
    controllerAs: 'vm',
    name: 'cmsReportButton',
    bindings: {
        itemId: '<',
        type: '<'
    }
};

export default component;
