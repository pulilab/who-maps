import { AuthApi } from '../Common/';

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
            if (now - this.lastUpdate > 30) {
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

    addContent(resource) {
        resource.author = this.storage.get('user_profile_id');
        this.post('cms/', resource).then(response => {
            console.log(response);
            this.cmsData.push(response);
            return response;
        });
    }

    addComment(comment, resource) {
        this.post('comment', comment).then(response => {
            console.log(response);
            const item = this.cmsData.find(res => res.id === resource.id);
            item.comments.push(response);
            return item;
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
