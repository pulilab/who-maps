import _template from './Project.html';
import NewProjectController from './ProjectController';


const newProjectComponent = {
    controller: NewProjectController.newProjectFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'project',
    bindings: {
        editMode: '@',
        inventoryMode: '@'
    }
};

export default newProjectComponent;
