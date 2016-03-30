import _template from './SearchableSelectionMenu.html';
import SearchableSelectionMenuController from './SearchableSelectionMenuController';


const searchableSelectionMenuComponent = {
    controller: SearchableSelectionMenuController.ssMenuFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'ssmenu',
    bindings: {
        ngModel: '=',
        ariaLabel: '@',
        options: '=',
        placeholder: '@',
        mdContainerClass: '@',
        replaceComma: '<',
        searchable: '<'

    }
};

export default searchableSelectionMenuComponent;
