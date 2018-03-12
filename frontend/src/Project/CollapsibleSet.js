import angular from 'angular';
import remove from 'lodash/remove';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { fixUrl } from '../Utilities';
import * as ProjectModule from '../store/modules/projects';

class CollapsibleSet {
    constructor(element, scope, collectionName, resetDefaultList = [], emptyCheckableArray = [], $ngRedux) {
        this.EE = window.EE;
        this.element = element;
        this.scope = scope;
        this.$ngRedux = $ngRedux;
        this.toggleClass = 'collapsed';
        this.activateClass = 'active';
        this.collectionName = collectionName;
        this.resetDefaultList = resetDefaultList;
        this.emptyCheckableArray = emptyCheckableArray;
        this.dispatchChange = debounce(this.dispatchChange.bind(this), 300);
    }

    defaultOnInit() {
        this.bindElementClick();
        this.elementId = this.element[0].getAttribute('id');
        this.elementMainSection = this.element[0].getElementsByClassName('project-section')[0];
        this.EE.on('activateFieldSet', this.activateFieldSet, this);
        setTimeout(() => {
            this.EE.emit('componentLoaded', this.elementId);
        });
        this.defaultWatchers();
        this.fixUrl = fixUrl;
    }

    defaultWatchers() {
        if (this.resetDefaultList && this.resetDefaultList.length > 0) {
            this.resetDefaultList.forEach(item => {
                this.scope.$watch(s => s.vm[item.toWatch], this.emptyCustom.bind(this, item.field));
            });
        }
        if (this.emptyCheckableArray && this.emptyCheckableArray.length > 0) {
            this.emptyCheckableArray.forEach(item => {
                this.project[item.toWatch].forEach((innerItem, index) => {
                    this.scope.$watch(s => s.vm.project[item.toWatch][index],
                      this.emptyCheckable.bind(this, item.check, item.field), true);
                });
            });
        }
    }

    dispatchChange(field, change) {
        const project = {};
        project[field] = angular.copy(change);
        this.$ngRedux.dispatch(ProjectModule.updateEditedProject(project));
    }

    emptyCustom(field, checkbox) {
        if (checkbox === false) {
            this.project[field].custom = undefined;
        }
    }

    emptyCheckable(check, field, item) {
        if (!item[check]) {
            item[field] = undefined;
        }
    }

    defaultOnDestroy() {
        this.EE.removeListener('projectScrollTo', this.activateFieldSet);
    }

    bindElementClick() {
        const self = this;
        this.element[0].addEventListener('click', ()=> {
            self.EE.emit('activateFieldSet', this.elementId);
        });
    }

    activateFieldSet(hash) {
        if (hash === this.elementId) {
            this.elementMainSection.classList.add(this.activateClass);
        }
        else {
            this.elementMainSection.classList.remove(this.activateClass);
        }
    }

    addChild(childName) {
        const child = this[this.collectionName][childName];
        const toAdd = typeof child[0] === 'string' ? '' : {};
        child.push(toAdd);
    }
    removeChild(index, childName) {
        const collection =  this[this.collectionName][childName].splice(index, 1);
        this.dispatchChange(childName, this[this.collectionName][childName]);
        return collection;
    }

    showAddMore(index, collection) {
        return index === (collection.length - 1);
    }

    showRemove(index, collection) {
        return collection.length > 1;
    }

    collapse() {
        this.elementMainSection.classList.toggle(this.toggleClass);
    }

    findField(key) {
        const field = this[this.collectionName][key];
        return field && field.standard ? field.standard : field;
    }

    checkboxToggle(t, key) {
        if (!t || !key) {
            return;
        }
        const field = this.findField(key);
        if (this.checkboxChecked(t, key)) {
            remove(field, item => {
                return item === t.id;
            });
        }
        else {
            field.push(t.id);
        }
        this.dispatchChange(key, field);
    }

    checkboxChecked(t, key) {
        if (!t || !key) {
            return false;
        }
        const field = this.findField(key);
        return field && field.length ? field.some(f => f === t.id) : false;
    }

    printDate(date) {
        if (date) {
            return moment(date).format('DD-MM-YYYY');
        }
        return '';
    }

    setAvailableOptions(category, options, fieldName) {
        if (category && category.length > 0) {
            const used = category.map(cat => cat[fieldName]).filter(name => name);
            category.forEach(item => {
                const available = options.filter(p => {
                    return used.indexOf(p) === -1;
                });
                if (item[fieldName]) {
                    available.push(item[fieldName]);
                }
                available.sort((a, b) => {
                    return a.localeCompare(b);
                });
                item.available = available;
            });
        }
    }

    setAvailableDictOptions(category, options, fieldName) {
        if (category && category.length > 0) {
            fieldName = fieldName ? fieldName : 'id';
            const used = category.filter(cat => cat[fieldName]);
            category.forEach(item => {
                const available = options.filter(p => {
                    return item[fieldName] === p.id || used.every(u => u[fieldName] !== p.id);
                });
                available.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                item.available = available;
            });
        }
    }

    handleCustomError(key) {
        if (this.form[key]) {
            this.form[key].$setValidity('custom', true);
            this.form[key].customError = [];
        }
    }

    setCustomError(key, error) {
        key = key.trim();
        const element = this.form[key];
        if (element) {
            const errors = element.customError || [];
            if (errors.indexOf(error) === -1) {
                errors.push(error);
            }
            element.$setValidity('custom', false);
            element.customError = errors;
        }
        else {
            console.warn('trying to set an error on an unexisting form element: ', key);
        }
    }

}

export default CollapsibleSet;
