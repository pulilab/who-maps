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
        this.commonServices = require('../Common/CommonServices');
        this.init();
    }

    init() {
        this.cmsData = [];
        this.lastUpdate = new Date(1970, 1, 1).getTime();
        if (this.commonServices.userProfile) {
            this.currentUserId = this.commonServices.userProfile.id;
            this.currentUserName = this.commonServices.userProfile.name;

            this.users = this.commonServices.usersProfiles.map(({ id, name }) => {
                return { id, name };
            });
        }
    }

    getNameFromId({ user }) {
        const result = this.users.find(u => u.id === user);
        return result ? result.name : '';
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

    findContentIndex({ id }) {
        return _.findIndex(this.cmsData, item => {
            return item.id === id;
        });
    }

    addContent(content, uploadService) {
        content.author = this.currentUserId;
        if (!content.cover) {
            delete content.cover;
        }
        return new Promise(res => {
            if (uploadService) {
                uploadService.upload({
                    url: '/api/cms/',
                    data: content
                }).then(({ data }) => {
                    this.cmsData.push(data);
                    res(data);
                });
            }
            else {
                this.post('cms/', content).then(response => {
                    return response.json();
                }).then(data=> {
                    this.cmsData.push(data);
                    res(data);
                });
            }
        });
    }

    updateContent(resource) {
        return this.put(`cms/${resource.id}/`, resource).then(response => {
            return response.json();
        }).then(data => {
            const index = this.findContentIndex(resource);
            this.cmsData.splice(index, 1, data);
            return data;
        });
    }

    deleteContent({ id }) {
        return this.del(`cms/${id}/`).then(() => {
            const index = this.findContentIndex({ id });
            this.cmsData.splice(index, 1);
        });
    }

    reportContent(resource) {
        return this.patch(`cms/${resource.id}/`).then(response => {
            return response.json();
        }).then((message) => {
            const index = this.findContentIndex(resource);
            this.cmsData.splice(index, 1, resource);
            return message;
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
        comment.user = this.currentUserId;
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

    reportComment(item) {
        return this.patch(`comment/${item.id}/`).then(response => {
            return response.json();
        }).then((message) => {
            const r = this.findComment({ id: item.id });
            r.resourceItem.comments.splice(r.index, 1, item);
            return message;
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
