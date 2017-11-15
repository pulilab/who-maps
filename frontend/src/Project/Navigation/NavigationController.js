import forEach from 'lodash/forEach';
class NavigationController {

    constructor($element) {
        this.EE = window.EE;
        this.element = $element;
        this.scrollTo = this.scrollTo.bind(this);
        this.$onInit = this.onInit.bind(this);
        this.$onDestroy = this.onDestroy.bind(this);
        this.scrollHandler = this.scrollHandler.bind(this);
    }

    onInit() {
        this.content = window.document.getElementsByClassName('main-content')[0];
        this.content.addEventListener('scroll', this.scrollHandler);
        this.EE.on('activateFieldSet', this.activateNavigation, this);
    }

    onDestroy() {
        this.EE.removeListener('activateFieldSet', this.activateNavigation);
    }

    activateNavigation(hash) {
        const navigation = this.element[0].getElementsByTagName('li');
        forEach(navigation, element => {
            if (element.classList.contains(hash)) {
                element.classList.add('active');
            }
            else {
                element.classList.remove('active');
            }
        });
    }

    scrollHandler() {
        if (this.content.scrollTop > 205) {
            this.element[0].style.position = 'fixed';
            this.element[0].style.top = '60px';
        }
        else {
            this.element[0].style.position = 'absolute';
            this.element[0].style.top = '0px';
        }
    }

    scrollTo(hash) {
        this.EE.emit('projectScrollTo', hash);
    }

    setAddAnother() {
        this.isAddAnother = true;
    }

    static navigationFactory() {
        require('./Navigation.scss');
        function navigation($element) {
            return new NavigationController($element);
        }
        navigation.$inject = ['$element'];
        return navigation;
    }
}

export default NavigationController;
