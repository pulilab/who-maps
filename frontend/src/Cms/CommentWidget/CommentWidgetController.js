import { prettifyDate, postProcessHtml } from '../utilities';
import { Storage } from '../../Common/';
import * as CmsModule from '../../store/modules/cms';

class CommentWidgetController {

    constructor($scope, $ngRedux) {
        this.scope = $scope;
        this.prettifyDate = prettifyDate;
        this.postProcessHtml = postProcessHtml;
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.storage = new Storage();
        this.unsubscribe = $ngRedux.connect(this.mapState, CmsModule)(this);

    }
    onInit() {
        this.expanded = false;
        this.editMode = false;
    }

    onDestroy() {
        this.unsubscribe();
    }

    mapState(state) {
        return {
            global: state.cms.data,
            userProfile: state.user.profile,
            profiles: state.system.profiles
        };
    }

    isAuthor() {
        return this.userProfile.id === this.comment.user;
    }

    getUsername() {
        const user = this.profiles.find(p => p.id === this.comment.user);
        return user ? user.name : 'No name';
    }

    edit() {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.modified = Object.assign({}, this.comment);
        }
    }

    async update() {
        await this.updateComment(this.modified);
        this.editMode  = false;
    }

    readMore() {
        this.expanded = !this.expanded;
    }

    static factory() {
        require('./CommentWidget.scss');
        function commentWidget($scope, $ngRedux) {
            return new CommentWidgetController($scope, $ngRedux);
        }
        commentWidget.$inject = ['$scope', '$ngRedux'];
        return commentWidget;
    }
}

export default CommentWidgetController;
