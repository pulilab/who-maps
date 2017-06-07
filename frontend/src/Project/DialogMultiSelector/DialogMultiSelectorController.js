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
        this.toggleAll = this.toggleAll.bind(this);
        this.elements.forEach(group => {
            this.toggleAll(group, true);
        });
    }

    toggleAll(group, reset) {
        group.subGroups.forEach(sub => {
            sub.open = reset ? false : !group.allOpen;
        });
        group.allOpen = reset ? false : !group.allOpen;
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

    static factory(buttonName, elements, selection, collectionName, dialogName) {
        function strategySelector($scope, $mdDialog) {
            return new DialogMultiSelectorDialog($scope, $mdDialog, buttonName,
              elements, selection, collectionName, dialogName);
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

    showModal(event) {
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
