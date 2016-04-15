import _ from 'lodash';
import angular from 'angular';

class SearchableSelectionMenuController {

    constructor($element, $timeout, $scope) {
        const vm = this;
        vm.element = $element;
        vm.timeout = $timeout;
        vm.scope = $scope;
        this.fileds = [];
        this.search = {};
        this.isOpen = false;
        this.$onInit = this.initialization.bind(this);
        this.scope.$watch(() => {
            return this.options;
        }, value => {
            if (value) {
                vm.prepareOptionsArray();
            }
        });
        this.scope.$watch(() => {
            return this.ngModel;
        }, (value) => {
            vm.checkLimit(value);
        });
    }

    initialization() {
        this.prepareOptionsArray();
        this.timeout(this.fixComma.bind(this));
    }

    checkLimit() {
        const self = this;
        if (this.limit && this.ngModel.length > this.limit) {
            this.timeout(() => {
                self.ngModel.pop();
            });

        }
    }

    prepareOptionsArray() {
        const temp = _.cloneDeep(this.options);
        if (this.subOptions === void 0 || this.subOptions === 0) {
            this.subOptions = 0;
            this.fields = [{}];
            this.fields[0][this.subOptions] = _.cloneDeep(temp);
        }
        else {
            this.fields = temp;
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
        function ssMenu($element, $timeout, $scope) {
            return new SearchableSelectionMenuController($element, $timeout, $scope);
        }

        ssMenu.$inject = ['$element', '$timeout', '$scope'];

        return ssMenu;
    }

}

export default SearchableSelectionMenuController;
