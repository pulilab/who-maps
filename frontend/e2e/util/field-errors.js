
export default class FieldErrors {

    constructor(baseElement) {
        this.parent = baseElement.element('..');
        this.email =   this.parent.element('div[ng-message="email"]');
        this.required =   this.parent.element('div[ng-message="required"]');
    }


}
