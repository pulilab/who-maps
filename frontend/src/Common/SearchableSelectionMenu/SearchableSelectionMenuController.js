import _ from 'lodash';
import angular from 'angular';

class SearchableSelectionMenuController {

    constructor($element, $timeout) {
        const vm = this;
        vm.element = $element;
        vm.timeout = $timeout;
        this.search = {};
        this.isOpen = false;
        this.timeout(this.initialization.bind(this));
    }

    initialization() {
        this.prepareOptionsArray();
        this.timeout(this.fixComma.bind(this));
    }

    prepareOptionsArray() {
        const temp = _.cloneDeep(this.options);
        if (this.subOptions === void 0) {
            this.subOptions = 0;
            this.options = [{}];
            this.options[0][this.subOptions] = _.cloneDeep(temp);
        }
    }


    searchKey(event) {
        event.stopImmediatePropagation();
    }

    selectOpen() {
        this.isOpen = true;
        if (this.onOpenCallback) {
            this.onOpenCallback();
        }
    }

    selectClose() {
        this.isOpen = false;
        this.fixComma();
        if (this.onCloseCallback) {
            this.onCloseCallback(this.ngModel);
        }
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
        function ssMenu($element, $timeout) {
            return new SearchableSelectionMenuController($element, $timeout);
        }

        ssMenu.$inject = ['$element', '$timeout'];

        return ssMenu;
    }

}

export default SearchableSelectionMenuController;
