import _template from './NewProject.html';
import NewProjectController from './NewProjectController';


const newProjectComponent = {
    controller: NewProjectController.newProjectFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'newProject',
    bindings: {
        editMode: '@',
        inventoryMode: '@'
    }
};

export default newProjectComponent;
