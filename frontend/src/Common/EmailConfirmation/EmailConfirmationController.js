import EmailConfirmationService from './EmailConfirmationService';

class EmailConfirmationController {

    constructor($scope, $state) {
        this.es = new EmailConfirmationService();
        this.EE = window.EE;
        this.scope = $scope;
        this.state = $state;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
    }

    onInit() {
        this.inProcess = true;
        this.style = {
            height: this.calculateHeight()
        };
        this.key = this.state.params.key;

        if (this.key) {
            this.activateEmail();
        }
    }

    onDestroy() {
    }

    activateEmail() {
        this.es.activateEmail(this.key)
            .then(response => {
                this.inProcess = false;
                this.success = response.success;
                this.scope.$evalAsync();
            }, () => {
                this.inProcess = false;
                this.success = false;
                this.scope.$evalAsync();
            });
    }

    calculateHeight() {
        const contentHeight = window.innerHeight - 48;
        return contentHeight + 'px';
    }


    static emailConfirmationFactory() {
        require('./EmailConfirmation.scss');

        function emailConfirmationController($scope, $state) {
            return new EmailConfirmationController($scope, $state);
        }

        emailConfirmationController.$inject = ['$scope', '$state'];

        return emailConfirmationController;
    }

}

export default EmailConfirmationController;
