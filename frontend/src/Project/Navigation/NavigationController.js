import forEach from 'lodash/forEach';
class NavigationController {

    constructor($element, $state) {
        this.EE = window.EE;
        this.element = $element;
        this.state = $state;
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

    goTo(editMode) {
        this.state.go(this.state.current.name, { editMode });
    }

    setAddAnother() {
        this.isAddAnother = true;
    }

    static navigationFactory() {
        require('./Navigation.scss');
        function navigation($element, $state) {
            return new NavigationController($element, $state);
        }
        navigation.$inject = ['$element', '$state'];
        return navigation;
    }
}

export default NavigationController;
