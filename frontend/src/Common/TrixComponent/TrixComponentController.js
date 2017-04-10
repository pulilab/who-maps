

class TrixComponentController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.$postLink = this.postLink.bind(this);
        this.updateValue = this.updateValue.bind(this);
    }

    onInit() {
        require('./TrixComponent.scss');
        require('trix');
    }
    onDestroy() {

    }

    postLink() {
        const self = this;
        setTimeout(() => {
            self.editorInstance = window.document.getElementById('trixEditor');
            self.editorInstance.editor.loadHTML(self.value);
            self.editorInstance.addEventListener('trix-change', self.updateValue);
        });
    }

    updateValue() {
        this.scope.$evalAsync(() => {
            this.value = this.editorInstance.editor.element.value;
        });
    }

    static factory() {
        function controller($scope) {
            return new TrixComponentController($scope);
        }

        controller.$inject = ['$scope'];

        return controller;
    }

}

export default TrixComponentController;
