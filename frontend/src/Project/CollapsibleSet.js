import _ from 'lodash';

class CollapsibleSet {
    constructor(element, collectionName) {
        this.element = element;
        this.toggleClass = 'collapsed';
        this.collectionName = collectionName;
    }

    addChild(childName) {
        this[this.collectionName][childName].push({});
    }

    showAddMore(index, collection) {
        return index === (collection.length - 1);
    }

    collapse() {
        const elm = this.element[0].getElementsByClassName('project-section')[0];
        elm.classList.toggle(this.toggleClass);
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
        return field.indexOf(t) > -1;
    }
}

export default CollapsibleSet;
