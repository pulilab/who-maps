import _ from 'lodash';
import angular from 'angular';
class SearchableSelectionMenuController {

    constructor($element) {
        const vm = this;
        vm.element = $element;
        this.search = {};
        this.isOpen = false;
    }

    searchKey(event) {
        event.stopImmediatePropagation();
    }

    selectOpen() {
        this.isOpen = true;
    }

    selectClose() {
        this.isOpen = false;
        this.fixComma();
    }

    fixComma() {
        if (!this.replaceComma) {
            return;
        }
        const element = this.element.find('span')[0];
        let cont = angular.element(element).html();
        cont = _.replace(cont, /,/g, '');
        angular.element(element).html(cont);
    }


    static ssMenuFactory() {
        require('./SearchableSelectionMenu.scss');
        function ssMenu($element) {
            return new SearchableSelectionMenuController($element);
        }

        ssMenu.$inject = ['$element'];

        return ssMenu;
    }

}

export default SearchableSelectionMenuController;
