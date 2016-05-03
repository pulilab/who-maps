import _template from './Searchbar.html';
import SearchbarController from './SearchbarController';

const searchbarComponent = {
    controller: SearchbarController.searchbarFactory(),
    template: _template,
    controllerAs: 'vm',
    name: 'searchbar'
    // bindings: {
    //     ngModel: '=',
    //     hasLink: '=',
    //     hasLogo: '='
    // }
};

export default searchbarComponent;
