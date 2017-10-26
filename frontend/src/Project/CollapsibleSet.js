import _ from 'lodash';

class CollapsibleSet {
    constructor(element, scope, collectionName) {
        this.EE = window.EE;
        this.element = element;
        this.scope = scope;
        this.toggleClass = 'collapsed';
        this.activateClass = 'active';
        this.collectionName = collectionName;
    }

    defaultOnInit() {
        this.bindElementClick();
        this.elementId = this.element[0].getAttribute('id');
        this.elementMainSection = this.element[0].getElementsByClassName('project-section')[0];
        this.EE.on('activateFieldSet', this.activateFieldSet, this);
        setTimeout(() => {
            this.EE.emit('componentLoaded', this.elementId);
        });
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
        return this[this.collectionName][childName].splice(index, 1);
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
            _.remove(field, item => {
                return item === t;
            });
        }
        else {
            field.push(t);
        }
    }

    checkboxChecked(t, key) {
        if (!t || !key) {
            return false;
        }
        const field = this.findField(key);
        return field && field.length ? field.indexOf(t) > -1 : false;
    }

    setAvailableOptions(category, options, fieldName) {
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

export default CollapsibleSet;
