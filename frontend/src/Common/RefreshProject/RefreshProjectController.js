
class EmailConfirmationController {

    constructor($scope, $state, CommonServices) {
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.cs = CommonServices;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        this.style = {
            height: this.calculateHeight()
        };

        const reset = this.cs.reset();
        reset.loadedPromise.then(() => {
            this.scope.$evalAsync();
            this.state.go('dashboard', {}, { reload: true });
        });
    }

    onDestroy() {
    }


    calculateHeight() {
        const contentHeight = window.innerHeight - 48;
        return contentHeight + 'px';
    }


    static refreshProjectFactory() {
        require('./RefreshProject.scss');
        const CommonServices = require('../CommonServices');
        function refreshProjectsController($scope, $state) {
            return new EmailConfirmationController($scope, $state, CommonServices);
        }

        refreshProjectsController.$inject = ['$scope', '$state'];

        return refreshProjectsController;
    }

}

export default EmailConfirmationController;
