import _template from './Searchbar.html';
import SearchbarController from './SearchbarController';

const searchbarComponent = {
    controller: SearchbarController.searchbarFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'searchbar',
    bindings: {
        compactMode: '@'
    }
};

export default searchbarComponent;
