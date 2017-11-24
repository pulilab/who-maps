import MyProjectListController from './MyProjectListController';
import _template from './MyProjectList.html';


const component = {
    template: _template,
    controller: MyProjectListController.factory(),
    controllerAs: 'vm',
    name: 'myProjectList',
    bindings: {}
};

export default component;
