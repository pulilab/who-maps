import { prettifyDate } from '../utilities';
import { Storage } from '../../Common/';

class CommentWidgetController {

    constructor($scope) {
        this.scope = $scope;
        this.prettifyDate = prettifyDate;
        this.$onInit = this.onInit.bind(this);
        this.storage = new Storage();

    }
    onInit() {
        this.expanded = false;
        this.editMode = false;
        this.cs = require('../CmsService');
    }

    isAuthor() {
        return this.userId === this.comment.user;
    }

    getUsername() {
        return this.cs.getNameFromId(this.comment);
    }

    delete() {
        this.cs.deleteComment(this.comment);
    }

    edit() {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.modified = Object.assign({}, this.comment);
        }
    }

    update() {
        this.cs.updateComment(this.modified).then(() => {
            this.scope.$evalAsync(() => {
                this.comment = Object.assign({}, this.modified);
                this.editMode = false;
            });
        });
    }

    readMore() {
        this.expanded = !this.expanded;
    }

    static factory() {
        require('./CommentWidget.scss');
        function commentWidget($scope) {
            return new CommentWidgetController($scope);
        }
        commentWidget().$inject = ['$scope'];
        return commentWidget;
    }
}

export default CommentWidgetController;
