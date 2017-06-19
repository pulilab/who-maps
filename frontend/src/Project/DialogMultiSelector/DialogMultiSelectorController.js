import angular from 'angular';
import Protected from '../../Common/Protected';


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
        this.openSelected = this.openSelected.bind(this);
        this.dialogClass = 'column-' + this.elements.length;
        this.openSelected(this.elements);
    }

    openSelected(elements) {
        for (const e of elements) {
            e.allOpen = true;
            for (const s of e.subGroups) {
                s.open = false;
                for (const item of s[this.collectionName]) {
                    s.open = s.open || this.itemChecked(item);
                }
                e.allOpen = e.allOpen && s.open;
            }
        }
    }

    toggleAll(group) {
        group.subGroups.forEach(sub => {
            sub.open = !group.allOpen;
        });
        group.allOpen = !group.allOpen;
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

    itemChecked(item) {
        return this.selection.indexOf(item) > -1;
    }
    itemToggle(item) {
        const index =  this.selection.indexOf(item);
        if (index !== -1) {
            this.selection.splice(index, 1);
        }
        else {
            this.selection.push(item);
        }
        return false;
    }

    subGroupClass(subGroup) {
        const status = subGroup.open ? 'open' : 'closed';

        return `${status} ${subGroup.class}`;
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
        this.checkDuplicates = this.checkDuplicates.bind(this);

        this.watchers();
    }

    watchers() {
        this.scope.$watch(s => s.vm.modalOpen, (newValue, oldValue) => {
            if (!oldValue && newValue) {
                this.openDialog();
            }
        });

        this.scope.$watch(s => s.vm.elements, this.checkDuplicates);
    }

    checkDuplicates(elements) {
        if (!elements || !elements.length) {
            console.error('No element to select from were provided to this dialog');
            return;
        }
        const flat = [];
        const flatWitPath = [];
        for (const e of elements) {
            for (const group of e.subGroups) {
                for (const item of group[this.collectionName]) {
                    const itemWithPath = `${e.name} => ${group.name} => ${item}`;
                    const index = flat.indexOf(item);
                    if (index === -1) {
                        flat.push(item);
                        flatWitPath.push(itemWithPath);
                    }
                    else {
                        console.error(`Dupes in elements collection: ${itemWithPath} / ${flatWitPath[index]} `);
                    }
                }
            }
        }
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
