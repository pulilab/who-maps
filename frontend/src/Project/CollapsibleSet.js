
class CollapsibleSet {
    constructor(element) {
        this.element = element;
        this.toggleClass = 'collapsed';
    }

    collapse() {
        const elm = this.element[0].getElementsByClassName('project-section')[0];
        elm.classList.toggle(this.toggleClass);
    }
}

export default CollapsibleSet;
