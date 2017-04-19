import { AuthApi } from '../Common/';
import _ from 'lodash';

/* global Promise, Symbol */

const singleton = Symbol();
const singletonEnforcer = Symbol();

class CmsService extends AuthApi {
    constructor(enforcer) {
        super('');
        if (enforcer !== singletonEnforcer) {
            const error = { error: 'Cannot construct singleton' };
            throw error;
        }
        this.cmsData = [];
        this.lastUpdate = new Date(1970, 1, 1).getTime();
    }

    getData() {
        return new Promise(res => {
            const now = Date.now();
            if (now - this.lastUpdate > 60) {
                this.fetchData().then(value => {
                    res(value);
                });
            }
            else {
                res(this.cmsData);
            }
        });
    }

    fetchData() {
        return this.get('cms/').then(data => {
            this.cmsData = data;
            this.lastUpdate = Date.now();
            return data;
        });
    }

    findContent({ id }) {
        return _.findIndex(this.cmsData, item => {
            return item.id === id;
        });
    }

    addContent(resource) {
        resource.author = this.storage.get('user_profile_id');
        return this.post('cms/', resource).then(response => {
            return response.json();
        }).then(data => {
            this.cmsData.push(data);
            return data;
        });
    }

    updateContent(resource) {
        return this.put(`cms/${resource.id}/`, resource).then(response => {
            return response.json();
        }).then(data => {
            const index = this.findContent(resource);
            this.cmsData.splice(index, 1, data);
            return data;
        });
    }

    deleteContent({ id }) {
        return this.del(`cms/${id}/`).then(() => {
            const index = this.findContent({ id });
            this.cmsData.splice(index, 1);
        });
    }

    findComment({ id }) {
        const resourceItem = this.cmsData.find(res => {
            return res.comments.some(comment => comment.id === id);
        });
        const index = _.findIndex(resourceItem.comments, item => {
            return item.id === id;
        });
        return { resourceItem, index };
    }

    addComment(comment, resource) {
        comment.user = this.storage.get('user_profile_id');
        comment.post = resource.id;
        return this.post('comment/', comment).then(response => {
            return response.json();
        }).then(data => {
            const item = this.cmsData.find(res => res.id === resource.id);
            item.comments.push(data);
            return item;
        });
    }

    updateComment(comment) {
        return this.put(`comment/${comment.id}/`, comment).then(response => {
            return response.json();
        }).then(data => {
            const r = this.findComment(comment);
            r.resourceItem.comments.splice(r.index, 1, data);
            return data;
        });
    }

    deleteComment({ id }) {
        return this.del(`comment/${id}/`).then(() => {
            const r = this.findComment({ id });
            r.resourceItem.comments.splice(r.index, 1);
        });
    }

    static factory() {
        if (!this[singleton]) {
            this[singleton] = new CmsService(singletonEnforcer);
        }
        return this[singleton];
    }
}

export default CmsService.factory();
