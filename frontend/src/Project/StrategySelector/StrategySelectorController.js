import angular from 'angular';
import  Protected from '../../Common/Protected';


class StrategySelectorDialog {
    constructor($scope, $mdDialog, platformName, availableStrategies, strategies) {
        this.scope = $scope;
        this.dialog = $mdDialog;
        this.platformName = platformName;
        this.availableStrategies = availableStrategies || [];
        this.strategies = strategies ? strategies.slice() : [];
        this.watchers();
        this.setSelected = this.setSelected.bind(this);
    }

    watchers() {
        this.scope.$watchCollection(s => s.vm.strategies, this.setSelected.bind(this));
    }

    setSelected(strategies) {
        this.availableStrategies.forEach(group => {
            group.selected = 0;
            group.subGroups.forEach(subGroup => {
                subGroup.strategies.forEach(strategy => {
                    if (strategies.indexOf(strategy) > -1) {
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
        this.dialog.hide(this.strategies);
    }

    toggle(item) {
        this.scope.$evalAsync(() => {
            item.open = !item.open;
        });
    }

    strategyChecked(strategy) {
        return this.strategies.indexOf(strategy) > -1;
    }
    strategyToggle(strategy) {
        const index =  this.strategies.indexOf(strategy);
        if (index !== -1) {
            this.strategies.splice(index, 1);
        }
        else {
            this.strategies.push(strategy);
        }
        return false;
    }

    static factory(platformName, availableStrategies, strategies) {
        function strategySelector($scope, $mdDialog) {
            return new StrategySelectorDialog($scope, $mdDialog, platformName, availableStrategies, strategies);
        }

        strategySelector.$inject = ['$scope', '$mdDialog'];
        return strategySelector;
    }
}

class StrategySelectorController extends Protected {

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
            controller: StrategySelectorDialog.factory(this.platformName, this.availableStrategies, this.strategies),
            controllerAs: 'vm',
            template: require('./StrategySelectorDialog.html'),
            parent: angular.element(document.body),
            clickOutsideToClose:true
        }).then(strategies => {
            this.scope.$evalAsync(() => {
                this.modalOpen = false;
                this.strategies = strategies;
            });
        }).catch(()=> {
            this.scope.$evalAsync(() => {
                this.modalOpen = false;
            });
        });
    }


    static factory() {
        require('./StrategySelector.scss');
        function addNewContent($scope, $mdDialog) {
            return new StrategySelectorController($scope, $mdDialog);
        }

        addNewContent.$inject = ['$scope', '$mdDialog'];
        return addNewContent;
    }
}

export default StrategySelectorController;
export { StrategySelectorDialog };
