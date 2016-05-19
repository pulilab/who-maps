import HssModuleController from './HssModuleController';
import _template from './HssModule.html';
import './hssModule.scss';

const hssComponent = {
    controller: HssModuleController.hssControllerFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'hssModule'
};

export default hssComponent;
