import angular from 'angular';

import { prettifyDate, itemType } from '../utilities';
import { Storage } from '../../Common/';

class DetailElementDialog {
    constructor($scope, $mdDialog, content) {
        this.scope = $scope;
        this.storage = new Storage();
        this.dialog = $mdDialog;
        this.prettifyDate = prettifyDate;
        this.itemType = itemType;
        this.content = content;
        this.cs = require('../CmsService');
        this.editMode = false;
        this.newComment = {
            valid: true,
            text: null
        };
    }

    scrollToAddNewComment()  {
        window.document.querySelector('#add-new-comment').scrollIntoView();
    }

    cancel() {
        this.dialog.cancel();
    }

    edit() {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.modified = Object.assign({}, this.content);
        }
    }

    update() {
        this.cs.updateContent(this.modified).then(() => {
            this.scope.$evalAsync(() => {
                this.content = Object.assign({}, this.modified);
                this.editMode = false;
            });
        });
    }

    delete() {
        this.cs.deleteContent(this.content).then(() => {
            this.dialog.cancel();
        });
    }

    isAuthor() {
        return this.cs.currentUserId === this.content.author;
    }

    addComment() {
        this.cs.addComment(this.newComment, this.content).then(() => {
            this.scope.$evalAsync(() => {
                this.newComment.text = false;
            });
        });
    }

    static factory(content) {

        function detailElement($scope, $mdDialog) {
            return new DetailElementDialog($scope, $mdDialog, content);
        }

        detailElement.$inject = ['$scope', '$mdDialog'];
        return detailElement;
    }
}

class DetailElementController {

    constructor($mdDialog) {
        this.dialog = $mdDialog;
        this.$onInit = this.onInit.bind(this);
    }

    onInit() {
    }


    showDetailDialog(event) {
        const self = this;
        this.dialog.show({
            controller: DetailElementDialog.factory(self.item),
            controllerAs: 'vm',
            template: require('./DetailElementDialog.html'),
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true
        });
    }

    static factory() {
        require('./DetailElement.scss');

        function detailElement($mdDialog) {
            return new DetailElementController($mdDialog);
        }

        detailElement.$inject = ['$mdDialog'];
        return detailElement;
    }
}

export default DetailElementController;
