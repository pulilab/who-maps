import DialogMultiSelectorController from './DialogMultiSelectorController';
import _template from './DialogMultiSelector.html';


const component = {
    template: _template,
    controller: DialogMultiSelectorController.factory(),
    controllerAs: 'vm',
    name: 'dialogMultiSelector',
    bindings: {
        elements: '<',
        selection: '=',
        dialogName: '<',
        modalOpen: '=?',
        buttonName: '@',
        collectionName: '@',
        name: '<',
        formElement: '<',
        isRequired: '<',
        showTitle: '<',
        onClose: '<'
    }
};

export default component;
