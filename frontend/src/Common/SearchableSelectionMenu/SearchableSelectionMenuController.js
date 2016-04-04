import _ from 'lodash';
import angular from 'angular';
class SearchableSelectionMenuController {

    constructor($element, $timeout) {
        const vm = this;
        vm.element = $element;
        this.search = {};
        this.isOpen = false;
        $timeout(()=> {
            if (vm.subOptions === void 0) {
                vm.subOptions = 0;
                const temp = _.cloneDeep(vm.options);
                vm.options = [{}];
                vm.options[0][vm.subOptions] = _.cloneDeep(temp);
            }
        });
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
        function ssMenu($element, $timeout) {
            return new SearchableSelectionMenuController($element, $timeout);
        }

        ssMenu.$inject = ['$element', '$timeout'];

        return ssMenu;
    }

}

export default SearchableSelectionMenuController;
