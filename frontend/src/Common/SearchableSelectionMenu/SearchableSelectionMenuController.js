import replace from 'lodash/replace';
import cloneDeep from 'lodash/cloneDeep';
import angular from 'angular';

class SearchableSelectionMenuController {

    constructor($element, $timeout, $scope) {
        this.element = $element;
        this.timeout = $timeout;
        this.scope = $scope;
        this.fileds = [];
        this.search = {};
        this.isOpen = false;
        this.$onInit = this.initialization.bind(this);
    }

    initialization() {
        this.watchers();
        this.prepareOptionsArray();
        this.timeout(this.fixComma.bind(this));
    }

    watchers() {
        const self = this;
        this.scope.$watch(() => {
            return this.options;
        }, value => {
            if (value) {
                self.prepareOptionsArray();
            }
        });
        this.scope.$watch(() => {
            return this.ngModel;
        }, (value) => {
            self.checkLimit(value);
        });
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
        const temp = cloneDeep(this.options);
        if (this.subOptions === void 0 || this.subOptions === 0) {
            this.subOptions = 0;
            this.fields = [{}];
            this.fields[0][this.subOptions] = cloneDeep(temp);
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
        cont = replace(cont, /,/g, '');
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
