

class TrixComponentController {

    constructor($scope) {
        this.scope = $scope;
        this.$onInit = this.onInit.bind(this);
        this.$postLink = this.postLink.bind(this);
        this.updateValue = this.updateValue.bind(this);
    }

    onInit() {
        require('./TrixComponent.scss');
        require('trix');
        this.charCounter = 0;
    }

    postLink() {
        const self = this;
        setTimeout(() => {
            self.editorInstance = window.document.getElementById('trixEditor');
            self.editorInstance.setAttribute('placeholder', self.placeholder);
            self.editorInstance.editor.loadHTML(self.value);
            self.editorInstance.addEventListener('trix-change', self.updateValue);
        });
    }

    updateValue() {
        const rawString = this.editorInstance.editor.getDocument().toString();
        this.scope.$evalAsync(() => {
            this.charCounter = rawString.length - 1;
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
