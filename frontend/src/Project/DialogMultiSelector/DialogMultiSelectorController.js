import angular from 'angular';
import  Protected from '../../Common/Protected';


class DialogMultiSelectorDialog {
    constructor($scope, $mdDialog, buttonName, elements, selection, collectionName, dialogName) {
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.buttonName = buttonName;
        this.dialogName = dialogName;
        this.elements = elements || [];
        this.selection = selection ? selection.slice() : [];
        this.collectionName = collectionName;
        this.watchers();
        this.setSelected = this.setSelected.bind(this);
    }

    watchers() {
        this.scope.$watchCollection(s => s.vm.selection, this.setSelected.bind(this));
    }

    setSelected(selection) {
        this.elements.forEach(group => {
            group.selected = 0;
            group.subGroups.forEach(subGroup => {
                subGroup[this.collectionName].forEach(item => {
                    if (selection.indexOf(item) > -1) {
                        group.selected += 1;
                    }
                });
            });
        });
    }

    cancel() {
        this.dialog.cancel();
    }

    addSelected() {
        this.dialog.hide(this.selection);
    }

    toggle(item) {
        this.scope.$evalAsync(() => {
            item.open = !item.open;
        });
    }

    itemChecked(strategy) {
        return this.selection.indexOf(strategy) > -1;
    }
    itemToggle(strategy) {
        const index =  this.selection.indexOf(strategy);
        if (index !== -1) {
            this.selection.splice(index, 1);
        }
        else {
            this.selection.push(strategy);
        }
        return false;
    }

    static factory(buttonName, elements, strategies, collectionName, dialogName) {
        function strategySelector($scope, $mdDialog) {
            return new DialogMultiSelectorDialog($scope, $mdDialog, buttonName,
              elements, strategies, collectionName, dialogName);
        }

        strategySelector.$inject = ['$scope', '$mdDialog'];
        return strategySelector;
    }
}

class DialogMultiSelector extends Protected {

    constructor($scope, $mdDialog) {
        super();
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.defaultOnInit();
        this.watchers();
    }

    watchers() {
        this.scope.$watch(s => s.vm.modalOpen, (newValue, oldValue) => {
            if (!oldValue && newValue) {
                this.openDialog();
            }
        });
    }

    showStrategySelector(event) {
        event.preventDefault();
        this.modalOpen = true;
    }

    openDialog() {
        this.dialog.show({
            controller: DialogMultiSelectorDialog.factory(this.buttonName, this.elements,
              this.selection, this.collectionName, this.dialogName),
            controllerAs: 'vm',
            template: require('./DialogMultiSelectorDialog.html'),
            parent: angular.element(document.body),
            clickOutsideToClose:true
        }).then(selection => {
            this.scope.$evalAsync(() => {
                this.modalOpen = false;
                this.selection = selection;
            });
        }).catch(()=> {
            this.scope.$evalAsync(() => {
                this.modalOpen = false;
            });
        });
    }


    static factory() {
        require('./DialogMultiSelector.scss');
        function addNewContent($scope, $mdDialog) {
            return new DialogMultiSelector($scope, $mdDialog);
        }

        addNewContent.$inject = ['$scope', '$mdDialog'];
        return addNewContent;
    }
}

export default DialogMultiSelector;
export { DialogMultiSelectorDialog };
