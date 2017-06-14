import angular from 'angular';

import { prettifyDate, itemType, postProcessHtml } from '../utilities';
import { Storage } from '../../Common/';

class DetailElementDialog {
    constructor($scope, $mdDialog, content) {
        this.scope = $scope;
        this.storage = new Storage();
        this.dialog = $mdDialog;
        this.prettifyDate = prettifyDate;
        this.postProcessHtml = postProcessHtml;
        this.itemType = itemType;
        this.content = content;
        this.checkExistence = this.checkExistence.bind(this);
        this.init();
    }

    init() {
        this.cs = require('../CmsService');
        this.global = null;
        this.getData();
        this.editMode = false;
        this.newComment = {
            valid: true,
            text: null
        };
        this.watchers();
    }

    getData() {
        return this.cs.getData().then(values => {
            this.global = values;
        });
    }

    watchers() {
        this.scope.$watchCollection(s => s.vm.global, this.checkExistence);

    }

    checkExistence(data) {
        if (data && data instanceof Array) {
            const contentExist = data.some(item => {
                return item.id === this.content.id;
            });
            if (!contentExist) {
                this.dialog.cancel();
            }
        }
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
        return this.cs.updateContent(this.modified).then(() => {
            this.scope.$evalAsync(() => {
                this.content = Object.assign({}, this.modified);
                this.editMode = false;
            });
        });
    }

    isAuthor() {
        return this.cs.commonServices.userProfileId === this.content.author;
    }

    addComment() {
        return this.cs.addComment(this.newComment, this.content).then(() => {
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
    }

    scrollToAddNewComment(scrollToComment)  {
        if (scrollToComment) {
            window.document.querySelector('#add-new-comment').scrollIntoView();
        }
    }

    showDetailDialog(event, scrollToComment) {
        const self = this;
        this.dialog.show({
            controller: DetailElementDialog.factory(self.item),
            controllerAs: 'vm',
            template: require('./DetailElementDialog.html'),
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            onComplete: () => self.scrollToAddNewComment(scrollToComment)
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
export { DetailElementDialog };
