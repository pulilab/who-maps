import ListElementController from './ListElementController';
import _template from './ListElement.html';


const component = {
    template: _template,
    controller: ListElementController.factory(),
    controllerAs: 'vm',
    name: 'cmsListElement',
    bindings: {
        experience: '<'
    }
};

export default component;
